import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const wantsEmulator = import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true';
const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
export const accountServiceConfigured =
  Object.values(config).every((v) => typeof v === 'string' && v.trim()) &&
  (!wantsEmulator || (import.meta.env.DEV && loopback));
let instance = null;
if (accountServiceConfigured) {
  try {
    const app = getApps().find((app) => app.name === 'chemlab') || initializeApp(config, 'chemlab');
    instance = getAuth(app);
    instance.languageCode = 'id';
    if (wantsEmulator && !instance.emulatorConfig)
      connectAuthEmulator(instance, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch {
    instance = null;
  }
}
export const firebaseAuth = instance;

export function requireAuthService() {
  if (!firebaseAuth)
    throw new Error('Layanan akun belum tersedia. Silakan coba lagi nanti atau hubungi pengelola.');
  return firebaseAuth;
}
export const emailActionSettings = () => ({
  url: `${window.location.origin}${window.location.pathname}#akun`,
  handleCodeInApp: false,
});
