import { useEffect, useState } from 'react';
import { Icon } from './Visuals.jsx';

export default function ExternalResource({ title, src, source, attribution, license }) {
  const [attempt, setAttempt] = useState(0);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    setAttempt(0);
    setSlow(false);
  }, [src]);
  useEffect(() => {
    if (!attempt) return;
    setSlow(false);
    const timeout = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(timeout);
  }, [attempt]);
  return (
    <section className="external-resource" aria-label={title}>
      <div className="external-controls">
        <h2>{title}</h2>
        <a className="button outline" href={src} target="_blank" rel="noopener noreferrer">
          Buka di tab baru
          <Icon name="external" size={15} />
        </a>
      </div>
      {!attempt ? (
        <div className="resource-placeholder">
          <Icon name="flask" size={37} />
          <h3>Siap mengamati lebih dekat?</h3>
          <p>Buka aktivitas, lalu gunakan petunjuk dan catatan pengamatan di halaman ini.</p>
          <button className="button primary" onClick={() => setAttempt(1)}>
            Buka aktivitas
            <Icon name="arrow" size={16} />
          </button>
        </div>
      ) : (
        <>
          <iframe
            key={`${src}-${attempt}`}
            src={src}
            title={title}
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setSlow(true)}
          />
          <div className="resource-retry">
            <p role="status">
              {slow
                ? 'Tampilan belum terlihat? Buka di tab baru atau lanjutkan dengan bacaan pendamping di bawah.'
                : 'Gunakan tampilan ini untuk melakukan pengamatan sesuai petunjuk.'}
            </p>
            <button className="text-button" onClick={() => setAttempt((n) => n + 1)}>
              <Icon name="reset" size={15} />
              Muat ulang aktivitas
            </button>
          </div>
          <p className="caption">
            Memuat ulang memulai kembali aktivitas. Catatanmu pada halaman ini tetap tersimpan.
          </p>
        </>
      )}
      <p className="resource-credit">
        {attribution}{' '}
        <a href={source} target="_blank" rel="noreferrer">
          Sumber
          <Icon name="external" size={12} />
        </a>
        {license && (
          <>
            {' '}
            ·{' '}
            <a href={license} target="_blank" rel="noreferrer">
              Ketentuan penggunaan
            </a>
          </>
        )}
      </p>
    </section>
  );
}
