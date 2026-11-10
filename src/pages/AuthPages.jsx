import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  accountError,
  loginAccount,
  loginWithGoogle,
  registerAccount,
  resetAccountPassword,
} from '../services/account.js';
import { HeroIllustration, Icon } from '../components/Visuals.jsx';
import PasswordField from '../components/PasswordField.jsx';
import GoogleMark from '../components/GoogleMark.jsx';

export default function AuthPages({ mode }) {
  const { user, configured, syncUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [remember, setRemember] = useState(false);
  const signup = mode === 'daftar';
  const reset = mode === 'lupa-password';
  useEffect(() => {
    if (user && !reset) window.location.hash = 'akun';
  }, [user, reset]);
  async function googleLogin() {
    setError('');
    setSuccess('');
    setBusy(true);
    setGoogleBusy(true);
    try {
      await loginWithGoogle({ remember });
      syncUser();
      window.location.hash = 'akun';
    } catch (error) {
      if (['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(error.code))
        setSuccess('Masuk dengan Google dibatalkan. Kamu bisa mencoba lagi saat siap.');
      else setError(accountError(error));
    } finally {
      setBusy(false);
      setGoogleBusy(false);
    }
  }
  async function submit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (signup && values.password !== values.confirmPassword) {
      setError('Kata sandi dan konfirmasi belum sama.');
      return;
    }
    setBusy(true);
    try {
      if (reset) {
        await resetAccountPassword(values.email);
        setSuccess(
          'Jika alamat tersebut terdaftar, petunjuk pengaturan ulang akan dikirim. Periksa kotak masuk dan folder spam.',
        );
        form.reset();
      } else if (signup) {
        await registerAccount({ ...values, remember });
        syncUser();
        window.location.hash = 'akun';
      } else {
        await loginAccount({ ...values, remember });
        syncUser();
        window.location.hash = 'akun';
      }
    } catch (error) {
      setError(accountError(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <section className="auth-story">
        <span className="eyebrow">SATU AKUN, RUANG BELAJARMU</span>
        <h2>
          Rasa ingin tahu
          <br />
          punya tempat pulang.
        </h2>
        <p>Kenali konsep, coba eksperimen, dan lanjutkan perjalanan memahami kimia.</p>
        <HeroIllustration />
        <div className="auth-story-bottom">
          <Icon name="leaf" size={22} />
          <span>
            Mulai dari satu pertanyaan.
            <br />
            Bangun pemahaman, langkah demi langkah.
          </span>
        </div>
      </section>
      <section className="auth-panel">
        <a href="#beranda" className="back-link">
          <Icon name="back" size={15} />
          Kembali belajar
        </a>
        <span className="eyebrow">CHEMLAB · RUANG BELAJAR</span>
        <h1>
          {reset ? 'Lupa kata sandi?' : signup ? 'Mulai perjalananmu.' : 'Selamat datang kembali.'}
        </h1>
        <p className="auth-lead">
          {reset
            ? 'Masukkan email akunmu untuk menerima petunjuk pengaturan ulang.'
            : signup
              ? 'Buat akun untuk mengelola identitas dan ruang belajarmu.'
              : 'Masuk untuk melanjutkan ruang belajar dan mengelola akunmu.'}
        </p>
        {!configured && (
          <p className="auth-service-note" role="status">
            Layanan akun belum tersedia. Kamu tetap bisa belajar mandiri melalui beranda.
          </p>
        )}
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="auth-success" role="status">
            {success}
          </p>
        )}
        {!reset && (
          <>
            <button
              type="button"
              className="button google-signin full-width"
              onClick={googleLogin}
              disabled={busy || !configured}
              aria-busy={googleBusy}
            >
              <GoogleMark />
              {googleBusy ? 'Menghubungkan ke Google…' : 'Lanjutkan dengan Google'}
            </button>
            <div className="auth-divider">
              <span>atau gunakan email</span>
            </div>
          </>
        )}
        <form
          onSubmit={submit}
          aria-label={reset ? 'Pemulihan akun' : signup ? 'Pendaftaran akun' : 'Masuk akun'}
        >
          {signup && (
            <div className="auth-field">
              <label htmlFor="register-name">Nama tampilan</label>
              <input
                id="register-name"
                name="name"
                autoComplete="name"
                required
                minLength="2"
                maxLength="60"
                placeholder="Nama yang ingin kamu gunakan"
                disabled={busy}
              />
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="account-email">Alamat email</label>
            <input
              id="account-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength="254"
              placeholder="nama@email.com"
              disabled={busy}
            />
          </div>
          {!reset && (
            <>
              <PasswordField
                name="password"
                autoComplete={signup ? 'new-password' : 'current-password'}
                minLength={signup ? 12 : undefined}
                disabled={busy}
              />
              {signup && (
                <>
                  <p className="field-hint">
                    Gunakan 12–128 karakter. Frasa panjang yang mudah diingat dapat digunakan.
                  </p>
                  <PasswordField
                    label="Konfirmasi kata sandi"
                    name="confirmPassword"
                    autoComplete="new-password"
                    minLength="12"
                    disabled={busy}
                  />
                </>
              )}
              <div className="auth-form-options">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={busy}
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
                {!signup && <a href="#lupa-password">Lupa kata sandi?</a>}
              </div>
              <p className="field-hint">Nonaktifkan “Ingat saya” untuk perangkat bersama.</p>
            </>
          )}
          <button className="button primary full-width auth-submit" disabled={busy || !configured}>
            {busy
              ? 'Memproses…'
              : reset
                ? 'Kirim petunjuk pemulihan'
                : signup
                  ? 'Buat akun'
                  : 'Masuk ke akun'}
            <Icon name="arrow" size={17} />
          </button>
        </form>
        {signup && (
          <p className="auth-data-caption">
            Nama dan email digunakan untuk identitas akun. Kata sandi diproses oleh layanan
            autentikasi.
          </p>
        )}
        <p className="auth-switch">
          {reset ? (
            <a href="#masuk">Kembali ke halaman masuk</a>
          ) : signup ? (
            <>
              Sudah punya akun? <a href="#masuk">Masuk di sini</a>
            </>
          ) : (
            <>
              Belum punya akun? <a href="#daftar">Buat akun baru</a>
            </>
          )}
        </p>
        <div className="auth-guest-link">
          <a href="#beranda">
            Lanjut belajar tanpa masuk
            <Icon name="arrow" size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
