import { loadProgress } from './storage.js';

export const MAX_PROGRESS_BYTES = 850000;
export const progressSyncKey = (uid) => `chemlab:sync:${uid}:v1`;

export function encodeProgress(progress) {
  const payload = JSON.stringify(progress);
  if (new TextEncoder().encode(payload).length > MAX_PROGRESS_BYTES)
    throw Object.assign(
      new Error(
        'Catatan akun terlalu besar untuk disinkronkan. Ekspor progres untuk menyimpan salinannya.',
      ),
      { code: 'progress/too-large' },
    );
  return payload;
}

export function decodeProgressDocument(raw) {
  if (!raw) return null;
  if (
    raw.version !== 1 ||
    !Number.isInteger(raw.revision) ||
    raw.revision < 1 ||
    typeof raw.resetId !== 'string' ||
    !raw.resetId ||
    typeof raw.deleted !== 'boolean'
  )
    throw Object.assign(
      new Error('Format progres akun belum dapat dibaca. Salinan pada perangkat tetap tersedia.'),
      { code: 'progress/invalid-data' },
    );
  if (raw.deleted)
    return { revision: raw.revision, resetId: raw.resetId, deleted: true, data: null };
  if (typeof raw.payload !== 'string') throw new Error('Data progres akun tidak valid.');
  const restored = loadProgress({ getItem: () => raw.payload });
  if (restored.warning)
    throw Object.assign(
      new Error('Data progres akun memerlukan pemulihan. Salinan pada perangkat tetap tersedia.'),
      { code: 'progress/invalid-data' },
    );
  return { revision: raw.revision, resetId: raw.resetId, deleted: false, data: restored.data };
}

export function progressSyncError(error) {
  if (error?.code === 'permission-denied')
    return 'Progres belum dapat disimpan ke akun. Hubungi pengelola untuk memeriksa izin penyimpanan.';
  if (['unavailable', 'deadline-exceeded', 'aborted'].includes(error?.code))
    return 'Koneksi penyimpanan terputus. Perubahan menunggu untuk disinkronkan; ekspor progres untuk menyimpan salinan.';
  if (error?.code?.startsWith('progress/')) return error.message;
  return 'Progres belum tersinkron. Coba lagi atau ekspor progres untuk menyimpan salinan.';
}
