import { doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import { firestoreDb } from './firebaseClient.js';
import { decodeProgressDocument, encodeProgress } from '../lib/progressDocument.js';
import { mergeProgress } from '../lib/progressMerge.js';

const reference = (uid) => {
  if (!firestoreDb || !uid) throw new Error('Penyimpanan akun belum tersedia.');
  return doc(firestoreDb, 'learningProgress', uid);
};

export const firestoreProgress = {
  watch(uid, receive, fail, cached) {
    return onSnapshot(
      reference(uid),
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) return;
        if (snapshot.metadata.fromCache) {
          cached();
          return;
        }
        try {
          receive(decodeProgressDocument(snapshot.exists() ? snapshot.data() : null));
        } catch (error) {
          fail(error);
        }
      },
      fail,
    );
  },
  commit(uid, { base, progress, resetId }) {
    const ref = reference(uid);
    return runTransaction(firestoreDb, async (transaction) => {
      const snapshot = await transaction.get(ref);
      const remote = decodeProgressDocument(snapshot.exists() ? snapshot.data() : null);
      if (remote?.deleted || (base && remote && base.resetId !== remote.resetId && !resetId))
        return remote;
      const data =
        remote && !resetId
          ? mergeProgress(base?.data || progress, progress, remote.data)
          : progress;
      const next = {
        version: 1,
        revision: (remote?.revision || 0) + 1,
        resetId: resetId || remote?.resetId || crypto.randomUUID(),
        deleted: false,
        payload: encodeProgress(data),
        updatedAt: serverTimestamp(),
      };
      transaction.set(ref, next);
      return { revision: next.revision, resetId: next.resetId, deleted: false, data };
    });
  },
};

export async function deleteCloudProgress(uid) {
  const ref = reference(uid);
  await runTransaction(firestoreDb, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const previous = snapshot.exists() ? snapshot.data() : null;
    if (previous?.deleted) return;
    // Keep an empty deletion marker so another open device cannot recreate deleted learning data.
    transaction.set(ref, {
      version: 1,
      revision: (previous?.revision || 0) + 1,
      resetId: crypto.randomUUID(),
      deleted: true,
      payload: null,
      updatedAt: serverTimestamp(),
    });
    transaction.delete(doc(firestoreDb, 'learnerProfiles', uid));
  });
}
