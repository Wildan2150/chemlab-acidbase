import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  accountError,
  changeAccountEmail,
  changeAccountPassword,
  logoutAccount,
  refreshAccount,
  removeAccount,
  saveAccountName,
  verifyAccountEmail,
} from '../services/account.js';
import { accountProgressKey } from '../lib/storage.js';
import { progressSyncKey } from '../lib/progressDocument.js';
import PasswordField from '../components/PasswordField.jsx';
import Dialog from '../components/Dialog.jsx';
import { Icon } from '../components/Visuals.jsx';

export default function Account() {
  const { user, syncUser } = useAuth();
  const [tab, setTab] = useState('profil');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    if (!user) window.location.hash = 'masuk';
  }, [user]);
  if (!user) return null;
  const hasPassword = user.providers.includes('password');
  const hasGoogle = user.providers.includes('google.com');
  async function perform(action, success, form) {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await action();
      syncUser();
      setMessage(success);
      form?.reset();
    } catch (error) {
      setError(accountError(error));
    } finally {
      setBusy(false);
    }
  }
  const values = (event) => {
    event.preventDefault();
    return Object.fromEntries(new FormData(event.currentTarget));
  };
  async function destroy() {
    const uid = user.uid;
    setError('');
    setBusy(true);
    try {
      await removeAccount(deletePassword);
      try {
        window.localStorage.removeItem(accountProgressKey(uid));
        window.localStorage.removeItem(progressSyncKey(uid));
      } catch {
        /* Storage can be unavailable. */
      }
      window.location.hash = 'beranda';
    } catch (error) {
      setError(accountError(error));
      setConfirmDelete(false);
    } finally {
      setBusy(false);
      setDeletePassword('');
    }
  }
  return (
    <>
      <div className="page-heading heading-with-action">
        <div>
          <span className="eyebrow">IDENTITAS DAN RUANG BELAJAR</span>
          <h1>
            Akun belajarmu<span className="greeting-dot">.</span>
          </h1>
          <p>Atur profil, jaga akses, dan kelola catatan belajarmu.</p>
        </div>
        <button
          className="button outline"
          disabled={busy}
          onClick={() => perform(logoutAccount, '')}
        >
          <Icon name="back" size={16} />
          Keluar dari akun
        </button>
      </div>
      <section className="account-summary surface">
        <span className="account-avatar">
          {(user.displayName || user.email || 'P').slice(0, 1).toUpperCase()}
        </span>
        <div>
          <h2>{user.displayName || 'Penjelajah kimia'}</h2>
          <p>{user.email}</p>
          {hasGoogle && <p>Masuk dengan Google{hasPassword ? ' dan kata sandi' : ''}</p>}
          <span className={`account-verification ${user.emailVerified ? 'verified' : ''}`}>
            {user.emailVerified ? (
              <>
                <Icon name="done" size={14} />
                Email terverifikasi
              </>
            ) : (
              <>
                <Icon name="help" size={14} />
                Email belum diverifikasi
              </>
            )}
          </span>
        </div>
      </section>
      {!user.emailVerified && (
        <section className="account-verify-note">
          <div>
            <h3>Konfirmasi alamat emailmu</h3>
            <p>Gunakan tautan verifikasi untuk memastikan kamu dapat mengakses alamat email ini.</p>
          </div>
          <div>
            <button
              className="button outline small"
              disabled={busy}
              onClick={() =>
                perform(
                  verifyAccountEmail,
                  'Permintaan verifikasi berhasil diproses. Periksa petunjuk pada email akunmu.',
                )
              }
            >
              Kirim verifikasi email
            </button>
            <button
              className="text-button"
              disabled={busy}
              onClick={() => perform(refreshAccount, 'Status email sudah diperiksa.')}
            >
              Periksa status
            </button>
          </div>
        </section>
      )}
      <nav className="account-tabs" aria-label="Pengaturan akun">
        {[
          ['profil', 'Profil & email'],
          ['keamanan', 'Kata sandi'],
          ['data', 'Data & akun'],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => {
              setTab(id);
              setError('');
              setMessage('');
            }}
            disabled={busy}
          >
            {label}
          </button>
        ))}
      </nav>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="auth-success" role="status">
          {message}
        </p>
      )}
      {tab === 'profil' && (
        <div className="account-settings-grid">
          <section className="surface account-setting">
            <h2>Nama tampilan</h2>
            <p>Nama yang kamu gunakan di ruang belajar.</p>
            <form
              aria-label="Ubah profil"
              onSubmit={(event) => {
                const form = event.currentTarget;
                const data = values(event);
                perform(
                  () => saveAccountName(data.name),
                  'Nama tampilan berhasil diperbarui.',
                  form,
                );
              }}
            >
              <div className="auth-field">
                <label htmlFor="profile-name">Nama tampilan</label>
                <input
                  id="profile-name"
                  name="name"
                  minLength="2"
                  maxLength="60"
                  required
                  defaultValue={user.displayName}
                  disabled={busy}
                />
              </div>
              <button className="button primary" disabled={busy}>
                Simpan profil
                <Icon name="check" size={16} />
              </button>
            </form>
          </section>
          <section className="surface account-setting">
            {hasPassword ? (
              <>
                <h2>Ganti alamat email</h2>
                <p>
                  Email baru digunakan setelah kamu menyelesaikan verifikasi pada alamat tersebut.
                </p>
                <form
                  aria-label="Ubah email"
                  onSubmit={(event) => {
                    const form = event.currentTarget;
                    const data = values(event);
                    perform(
                      () => changeAccountEmail(data.currentPassword, data.email),
                      'Petunjuk verifikasi email baru telah diminta. Selesaikan verifikasi sebelum masuk dengan alamat baru.',
                      form,
                    );
                  }}
                >
                  <div className="auth-field">
                    <label htmlFor="new-email">Alamat email baru</label>
                    <input
                      id="new-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength="254"
                      required
                      disabled={busy}
                    />
                  </div>
                  <PasswordField
                    label="Kata sandi saat ini"
                    name="currentPassword"
                    disabled={busy}
                  />
                  <button className="button primary" disabled={busy}>
                    Verifikasi email baru
                    <Icon name="arrow" size={16} />
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2>Alamat email Google</h2>
                <p>
                  Kamu masuk dengan akun Google. Kelola alamat email melalui pengaturan akun Google
                  yang kamu gunakan.
                </p>
                <a
                  className="button outline"
                  href="https://myaccount.google.com/personal-info"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kelola akun Google
                  <Icon name="external" size={16} />
                </a>
              </>
            )}
          </section>
        </div>
      )}
      {tab === 'keamanan' && (
        <section className="surface account-setting account-narrow">
          {hasPassword ? (
            <>
              <h2>Perbarui kata sandi</h2>
              <p>Masukkan kata sandi saat ini untuk mengonfirmasi perubahan.</p>
              <form
                aria-label="Ubah kata sandi"
                onSubmit={(event) => {
                  const form = event.currentTarget;
                  const data = values(event);
                  if (data.password !== data.confirmPassword) {
                    setError('Kata sandi baru dan konfirmasi belum sama.');
                    return;
                  }
                  perform(
                    () => changeAccountPassword(data.currentPassword, data.password),
                    'Kata sandi berhasil diperbarui. Gunakan kata sandi baru untuk masuk berikutnya.',
                    form,
                  );
                }}
              >
                <PasswordField label="Kata sandi saat ini" name="currentPassword" disabled={busy} />
                <PasswordField
                  label="Kata sandi baru"
                  name="password"
                  minLength="12"
                  autoComplete="new-password"
                  disabled={busy}
                />
                <p className="field-hint">
                  Gunakan 12–128 karakter dan hindari memakai kata sandi yang sama di layanan lain.
                </p>
                <PasswordField
                  label="Konfirmasi kata sandi baru"
                  name="confirmPassword"
                  minLength="12"
                  autoComplete="new-password"
                  disabled={busy}
                />
                <button className="button primary" disabled={busy}>
                  Simpan kata sandi
                  <Icon name="check" size={16} />
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Keamanan akun Google</h2>
              <p>
                Kamu tidak memerlukan kata sandi terpisah di ChemLab. Atur kata sandi dan verifikasi
                dua langkah melalui akun Google yang kamu gunakan untuk masuk.
              </p>
              <a
                className="button outline"
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka keamanan Google
                <Icon name="external" size={16} />
              </a>
            </>
          )}
        </section>
      )}
      {tab === 'data' && (
        <div className="account-settings-grid">
          <section className="surface account-setting">
            <h2>Catatan belajarmu</h2>
            <p>
              Progres akun disinkronkan agar dapat dilanjutkan pada perangkat lain. Catatan tetap
              terpisah dari progres tamu maupun akun lain. Periksa status simpan sebelum berpindah
              perangkat.
            </p>
            <a className="button outline" href="#progres">
              Lihat progres & ekspor
              <Icon name="arrow" size={16} />
            </a>
          </section>
          <section className="surface account-setting account-danger">
            <h2>Hapus akun</h2>
            <p>
              Identitas akun dan progres cloud milik akun ini akan dihapus. Salinan pada browser ini
              juga dihapus. Simpan salinan catatan sebelum melanjutkan. Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <form
              aria-label="Hapus akun"
              onSubmit={(event) => {
                event.preventDefault();
                setConfirmDelete(true);
              }}
            >
              {hasPassword ? (
                <PasswordField
                  label="Kata sandi untuk menghapus akun"
                  name="deletePassword"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  disabled={busy}
                />
              ) : (
                <p className="field-hint">
                  Setelah konfirmasi, pilih akun Google yang sama untuk mengizinkan penghapusan akun
                  ChemLab. Akun Google kamu tetap aktif.
                </p>
              )}
              <label className="auth-checkbox deletion-check">
                <input type="checkbox" required disabled={busy} />
                <span>Saya memahami akun akan dihapus secara permanen.</span>
              </label>
              <button className="button danger-button" disabled={busy}>
                Hapus akun saya
                <Icon name="reset" size={16} />
              </button>
            </form>
          </section>
        </div>
      )}
      {confirmDelete && (
        <Dialog
          title="Hapus akun secara permanen?"
          onClose={() => {
            if (!busy) {
              setConfirmDelete(false);
              setDeletePassword('');
            }
          }}
        >
          <p className="dialog-description">
            Akun {user.email}, progres cloud, dan salinan pada browser ini akan dihapus. Pastikan
            kamu sudah mengekspor catatan yang diperlukan. Tindakan ini memerlukan koneksi.
          </p>
          {!hasPassword && (
            <p className="dialog-description">
              Konfirmasi berikutnya akan membuka Google. Pilih {user.email} untuk melanjutkan.
              Tindakan ini tidak menghapus akun Google.
            </p>
          )}
          <div className="dialog-actions">
            <button
              className="button outline"
              autoFocus
              disabled={busy}
              onClick={() => {
                setConfirmDelete(false);
                setDeletePassword('');
              }}
            >
              Batal
            </button>
            <button className="button danger-button" disabled={busy} onClick={destroy}>
              {busy ? 'Menghapus…' : 'Hapus akun permanen'}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
