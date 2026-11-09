import { useId, useState } from 'react';

export default function PasswordField({
  label = 'Kata sandi',
  autoComplete = 'current-password',
  minLength,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          maxLength="128"
          minLength={minLength}
          required
          {...props}
        />
        <button
          type="button"
          aria-label={`${visible ? 'Sembunyikan' : 'Tampilkan'} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? 'Sembunyikan' : 'Lihat'}
        </button>
      </div>
    </div>
  );
}
