import { useCallback, useEffect, useRef, useState } from 'react';
import { accountProgressKey, emptyProgress, loadProgress, saveProgress } from '../lib/storage.js';
import { ProgressSession, registerProgressSession } from '../lib/progressSession.js';
import { firestoreDb } from '../services/firebaseClient.js';
import { firestoreProgress } from '../services/firestoreProgress.js';

function localProgress(key) {
  try {
    return loadProgress(window.localStorage, key);
  } catch {
    return {
      data: emptyProgress(),
      warning:
        'Penyimpanan browser tidak tersedia. Ekspor progres untuk menyimpan salinan catatan.',
    };
  }
}

export default function useLearningProgress(uid) {
  const key = accountProgressKey(uid);
  const [initial] = useState(() => localProgress(key));
  const [progress, setValue] = useState(initial.data);
  const value = useRef(initial.data);
  const session = useRef(null);
  const [storageOk, setStorageOk] = useState(!initial.warning);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [sync, setSync] = useState({ state: uid ? 'loading' : 'guest', message: '' });

  const accept = useCallback((next) => {
    value.current = next;
    setValue(next);
  }, []);
  const setProgress = useCallback(
    (action) => {
      if (session.current) session.current.update(action);
      else accept(typeof action === 'function' ? action(value.current) : action);
    },
    [accept],
  );
  const resetProgress = useCallback(() => {
    if (session.current) session.current.reset();
    else setProgress(emptyProgress());
  }, [setProgress]);

  useEffect(() => {
    let saved = false;
    try {
      saved = saveProgress(window.localStorage, progress, key);
    } catch {
      /* Storage may be denied. */
    }
    setStorageOk(saved);
    if (!saved)
      setStorageWarning(
        'Penyimpanan browser tidak tersedia. Ekspor progres untuk menyimpan salinan catatan.',
      );
  }, [progress, key]);

  useEffect(() => {
    if (!uid) return;
    if (!firestoreDb) {
      setSync({
        state: 'error',
        message: 'Penyimpanan akun belum tersedia. Catatan tetap disimpan pada perangkat.',
      });
      return;
    }
    let storage = null;
    try {
      storage = window.localStorage;
    } catch {
      /* Cloud can still work without local storage. */
    }
    const current = new ProgressSession({
      uid,
      initial: value.current,
      storage,
      adapter: firestoreProgress,
      onProgress: accept,
      onStatus: setSync,
      online: () => navigator.onLine,
    });
    session.current = current;
    accept(current.progress);
    const unregister = registerProgressSession(current);
    const connection = () => {
      if (navigator.onLine) current.retry();
      else current.status('offline');
    };
    window.addEventListener('online', connection);
    window.addEventListener('offline', connection);
    current.start();
    return () => {
      current.dispose();
      unregister();
      session.current = null;
      window.removeEventListener('online', connection);
      window.removeEventListener('offline', connection);
    };
  }, [uid, accept]);

  return {
    progress,
    setProgress,
    resetProgress,
    storageOk,
    storageWarning,
    setStorageWarning,
    sync,
    retrySync: () => session.current?.retry(),
  };
}
