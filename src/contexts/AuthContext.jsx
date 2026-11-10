import { createContext, useContext, useEffect, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { firebaseAuth } from '../services/firebaseClient.js';
import { syncLearnerProfile } from '../services/teacherData.js';
import { isTeacher } from '../lib/teacherAccess.js';

const AuthContext = createContext(null);
const snapshot = (user) =>
  user
    ? {
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        emailVerified: user.emailVerified,
        providers: user.providerData.map((provider) => provider.providerId),
      }
    : null;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!firebaseAuth);
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');
  useEffect(() => {
    if (!firebaseAuth) return;
    return onIdTokenChanged(
      firebaseAuth,
      (current) => {
        setUser(snapshot(current));
        setReady(true);
      },
      () => {
        setError('Status akun belum dapat diperiksa. Coba muat ulang halaman.');
        setReady(true);
      },
    );
  }, []);
  useEffect(() => {
    let active = true;
    setProfileError('');
    if (user)
      syncLearnerProfile(user).catch(() => {
        if (active)
          setProfileError(
            'Profil belum tersimpan. Periksa koneksi, lalu muat ulang agar nama tercantum pada daftar siswa.',
          );
      });
    return () => {
      active = false;
    };
  }, [user?.uid, user?.displayName, user?.email]);
  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        error,
        profileError,
        isTeacher: isTeacher(user),
        configured: Boolean(firebaseAuth),
        syncUser: () => setUser(snapshot(firebaseAuth?.currentUser)),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
