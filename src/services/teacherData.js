import { deleteApp, initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  initializeAuth,
  inMemoryPersistence,
  updateCurrentUser,
} from 'firebase/auth';
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { firebaseAuth, firestoreDb, firestoreDatabaseId } from './firebaseClient.js';

export async function syncLearnerProfile(user) {
  if (!firestoreDb || !user?.uid || firebaseAuth?.currentUser?.uid !== user.uid) return;
  await setDoc(doc(firestoreDb, 'learnerProfiles', user.uid), {
    displayName: (user.displayName?.trim() || 'Pelajar').slice(0, 60),
    email: user.email || '',
    updatedAt: serverTimestamp(),
  });
}

export function watchTeacherData(receive, fail) {
  if (!firestoreDb) throw new Error('Layanan data siswa belum tersedia.');
  let profiles = null,
    progress = null,
    stopped = false;
  const subscriptions = [];
  let privateApp = null;
  const cleanup = () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
    const app = privateApp;
    privateApp = null;
    if (app) void deleteApp(app).catch(() => {});
  };
  const failure = (error) => {
    if (stopped) return;
    stopped = true;
    cleanup();
    fail(error);
  };
  const emit = () => {
    if (!stopped && profiles && progress) receive({ profiles, progress });
  };
  // Keep class data outside the learning client's cache and discard this in-memory session on exit.
  const connect = async () => {
    const current = firebaseAuth.currentUser;
    if (!current) throw new Error('Masuk kembali untuk melihat data siswa.');
    privateApp = initializeApp(firebaseAuth.app.options, `chemlab-teacher-${crypto.randomUUID()}`);
    const privateAuth = initializeAuth(privateApp, { persistence: inMemoryPersistence });
    const emulator = firebaseAuth.emulatorConfig;
    if (emulator)
      connectAuthEmulator(privateAuth, `${emulator.protocol}://${emulator.host}:${emulator.port}`, {
        disableWarnings: true,
      });
    await updateCurrentUser(privateAuth, current);
    if (stopped) return;
    const privateDb = getFirestore(privateApp, firestoreDatabaseId);
    if (emulator) connectFirestoreEmulator(privateDb, '127.0.0.1', 8080);
    subscriptions.push(
      onSnapshot(
        collection(privateDb, 'learnerProfiles'),
        { includeMetadataChanges: true },
        (snapshot) => {
          if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
          profiles = snapshot.docs.map((item) => ({ ...item.data(), uid: item.id }));
          emit();
        },
        failure,
      ),
      onSnapshot(
        collection(privateDb, 'learningProgress'),
        { includeMetadataChanges: true },
        (snapshot) => {
          if (snapshot.metadata.fromCache || snapshot.metadata.hasPendingWrites) return;
          progress = snapshot.docs.map((item) => {
            const data = item.data();
            return {
              uid: item.id,
              document: data,
              updatedAt: data.updatedAt?.toDate?.().toISOString() || null,
            };
          });
          emit();
        },
        failure,
      ),
    );
  };
  void connect().catch(failure);
  return () => {
    stopped = true;
    cleanup();
  };
}
