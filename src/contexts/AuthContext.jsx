import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../services/firebaseClient.js';

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
  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(
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
  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        error,
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
