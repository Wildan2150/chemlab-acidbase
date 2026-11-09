import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { emailActionSettings, requireAuthService } from './firebaseClient.js';

function currentUser() {
  const user = requireAuthService().currentUser;
  if (!user) throw new Error('Masuk kembali untuk melanjutkan.');
  return user;
}
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128)
    throw new Error('Gunakan kata sandi 12–128 karakter.');
}
export function validateDisplayName(name) {
  const value = name.trim();
  if (value.length < 2 || value.length > 60 || /[\u0000-\u001f\u007f]/.test(value))
    throw new Error('Gunakan nama 2–60 karakter.');
  return value;
}
export function accountError(error) {
  const messages = {
    'auth/invalid-credential': 'Email atau kata sandi tidak sesuai.',
    'auth/wrong-password': 'Email atau kata sandi tidak sesuai.',
    'auth/user-not-found': 'Email atau kata sandi tidak sesuai.',
    'auth/invalid-email': 'Masukkan alamat email yang valid.',
    'auth/email-already-in-use':
      'Alamat email belum dapat digunakan. Coba masuk atau pulihkan akun.',
    'auth/weak-password':
      'Kata sandi belum memenuhi kebijakan akun. Gunakan setidaknya 12 karakter.',
    'auth/password-does-not-meet-requirements':
      'Kata sandi belum memenuhi kebijakan akun. Gunakan frasa yang lebih panjang.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar sebelum mencoba kembali.',
    'auth/network-request-failed': 'Koneksi ke layanan akun terputus. Periksa jaringanmu.',
    'auth/requires-recent-login': 'Untuk keamanan, masuk kembali lalu ulangi tindakan ini.',
    'auth/user-disabled': 'Akun tidak dapat digunakan. Hubungi pengelola.',
    'auth/expired-action-code': 'Tautan sudah kedaluwarsa. Minta tautan baru.',
    'auth/invalid-action-code': 'Tautan tidak valid atau sudah digunakan. Minta tautan baru.',
    'auth/operation-not-allowed': 'Layanan masuk belum tersedia. Hubungi pengelola.',
  };
  return (
    messages[error?.code] ||
    (!error?.code ? error?.message : '') ||
    'Tindakan belum berhasil. Coba lagi nanti.'
  );
}
export async function registerAccount({ name, email, password, remember }) {
  validatePassword(password);
  const displayName = validateDisplayName(name);
  const auth = requireAuthService();
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(result.user, { displayName });
  return result.user;
}
export async function loginAccount({ email, password, remember }) {
  const auth = requireAuthService();
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email.trim(), password);
}
export const logoutAccount = () => signOut(requireAuthService());
export const verifyAccountEmail = () => sendEmailVerification(currentUser(), emailActionSettings());
export async function resetAccountPassword(email) {
  try {
    await sendPasswordResetEmail(requireAuthService(), email.trim(), emailActionSettings());
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
  }
}
export async function refreshAccount() {
  const user = currentUser();
  await reload(user);
  await user.getIdToken(true);
  return user;
}
export async function saveAccountName(name) {
  await updateProfile(currentUser(), { displayName: validateDisplayName(name) });
}
async function reauthenticate(password) {
  const user = currentUser();
  if (!password) throw new Error('Masukkan kata sandi saat ini.');
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  return user;
}
export async function changeAccountPassword(currentPassword, newPassword) {
  validatePassword(newPassword);
  const user = await reauthenticate(currentPassword);
  await updatePassword(user, newPassword);
}
export async function changeAccountEmail(password, email) {
  const user = await reauthenticate(password);
  if (user.email?.toLowerCase() === email.trim().toLowerCase())
    throw new Error('Masukkan alamat email baru yang berbeda.');
  await verifyBeforeUpdateEmail(user, email.trim(), emailActionSettings());
}
export async function removeAccount(password) {
  const user = await reauthenticate(password);
  await deleteUser(user);
}
