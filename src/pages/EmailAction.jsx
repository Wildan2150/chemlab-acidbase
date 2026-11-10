import { useEffect, useState } from 'react';
import {
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { requireAuthService } from '../services/firebaseClient.js';
import {
  accountError,
  logoutAccount,
  refreshAccount,
  validatePassword,
} from '../services/account.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { Icon } from '../components/Visuals.jsx';

function actionParameters() {
  const hash = window.location.hash;
  return new URLSearchParams(
    hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : window.location.search,
  );
}
export default function EmailAction() {
  const { configured, user, syncUser } = useAuth();
  const [state, setState] = useState({
    busy: false,
    checked: false,
    email: '',
    success: '',
    error: '',
  });
  const [params] = useState(actionParameters);
  const mode = params.get('mode');
  const code = params.get('oobCode');
  const reset = mode === 'resetPassword';
  useEffect(() => {
    let active = true;
    if (
      !configured ||
      !code ||
      !['resetPassword', 'verifyEmail', 'verifyAndChangeEmail', 'recoverEmail'].includes(mode)
    ) {
      setState((s) => ({
        ...s,
        error: 'Tautan ini belum dapat digunakan. Minta petunjuk baru melalui halaman akun.',
      }));
      return;
    }
    (async () => {
      try {
        const auth = requireAuthService();
        const result = reset
          ? await verifyPasswordResetCode(auth, code)
          : await checkActionCode(auth, code);
        if (!reset) {
          const operations = {
            verifyEmail: 'VERIFY_EMAIL',
            verifyAndChangeEmail: 'VERIFY_AND_CHANGE_EMAIL',
            recoverEmail: 'RECOVER_EMAIL',
          };
          if (result.operation !== operations[mode])
            throw new Error('Jenis tautan tidak sesuai. Minta tautan baru.');
        }
        if (active)
          setState({
            busy: false,
            checked: true,
            email: reset ? result : result.data.email || '',
            success: '',
            error: '',
          });
      } catch (error) {
        if (active) setState((s) => ({ ...s, error: accountError(error) }));
      }
    })();
    return () => {
      active = false;
    };
  }, [configured, code, mode, reset]);
  async function apply(event) {
    event.preventDefault();
    setState((s) => ({ ...s, busy: true, error: '' }));
    try {
      const auth = requireAuthService();
      if (reset) {
        const values = Object.fromEntries(new FormData(event.currentTarget));
        if (values.password !== values.confirmPassword)
          throw new Error('Kata sandi baru dan konfirmasi belum sama.');
        validatePassword(values.password);
        await confirmPasswordReset(auth, code, values.password);
        if (user) await logoutAccount();
      } else {
        await applyActionCode(auth, code);
        if (user) {
          try {
            await refreshAccount();
            syncUser();
          } catch {
            /* A changed email may require a fresh sign-in. */
          }
        }
      }
      setState((s) => ({
        ...s,
        busy: false,
        success: reset
          ? 'Kata sandi berhasil diperbarui. Masuk dengan kata sandi baru.'
          : mode === 'recoverEmail'
            ? 'Alamat email akun berhasil dipulihkan. Perbarui kata sandi jika perubahan sebelumnya bukan dilakukan olehmu.'
            : 'Alamat email berhasil dikonfirmasi. Kamu dapat kembali ke akunmu.',
      }));
    } catch (error) {
      setState((s) => ({ ...s, busy: false, error: accountError(error) }));
    }
  }
  return (
    <section className="surface email-action">
      <span className="auth-action-icon">
        <Icon name="done" size={30} />
      </span>
      <span className="eyebrow">KONFIRMASI AKUN</span>
      <h1>{reset ? 'Atur kata sandi baru.' : 'Konfirmasi alamat email.'}</h1>
      {state.email && <p className="auth-lead">{state.email}</p>}
      {state.error && (
        <p className="auth-error" role="alert">
          {state.error}
        </p>
      )}
      {state.success ? (
        <>
          <p className="auth-success" role="status">
            {state.success}
          </p>
          <a className="button primary" href={reset ? '#masuk' : '#akun'}>
            Lanjutkan
            <Icon name="arrow" size={16} />
          </a>
        </>
      ) : state.checked ? (
        <form onSubmit={apply} aria-label={reset ? 'Atur ulang kata sandi' : 'Konfirmasi email'}>
          {reset ? (
            <>
              <PasswordField
                label="Kata sandi baru"
                name="password"
                autoComplete="new-password"
                minLength="12"
                disabled={state.busy}
              />
              <p className="field-hint">Gunakan 12–128 karakter.</p>
              <PasswordField
                label="Konfirmasi kata sandi baru"
                name="confirmPassword"
                autoComplete="new-password"
                minLength="12"
                disabled={state.busy}
              />
            </>
          ) : (
            <p className="auth-lead">
              Pastikan perubahan ini memang kamu minta, lalu konfirmasikan untuk melanjutkan.
            </p>
          )}
          <button className="button primary full-width" disabled={state.busy}>
            {state.busy ? 'Memproses…' : reset ? 'Simpan kata sandi baru' : 'Konfirmasi email'}
            <Icon name="check" size={16} />
          </button>
        </form>
      ) : (
        !state.error && (
          <p role="status" className="auth-lead">
            Memeriksa tautan akun…
          </p>
        )
      )}
      <a className="back-link" href="#masuk">
        <Icon name="back" size={15} />
        Kembali ke halaman masuk
      </a>
    </section>
  );
}
