import { useEffect, useRef, useState } from 'react';
import { Icon } from './Visuals.jsx';

export default function MoleculeViewer({ molecule, source, attribution }) {
  const frame = useRef(null);
  const [opened, setOpened] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState({ phase: 'idle' });
  const src = `${import.meta.env.BASE_URL}molecule-viewer.html?cid=${molecule.cid}`;

  useEffect(() => {
    if (!opened) return;
    setStatus({ phase: 'loading' });
    const timeout = setTimeout(() => {
      setStatus({
        phase: 'error',
        message: 'Model belum dapat dimuat. Periksa koneksi lalu coba muat ulang.',
      });
    }, 15000);
    function receive(event) {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow ||
        event.data?.type !== 'chemlab:molecule' ||
        event.data.cid !== molecule.cid
      )
        return;
      if (event.data.state === 'ready' && event.data.atoms === molecule.atomCount) {
        clearTimeout(timeout);
        setStatus({ phase: 'ready', atoms: event.data.atoms });
      } else if (event.data.state === 'error') {
        clearTimeout(timeout);
        setStatus({ phase: 'error', message: event.data.message });
      }
    }
    window.addEventListener('message', receive);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('message', receive);
    };
  }, [opened, molecule.cid, molecule.atomCount, attempt]);

  function control(action) {
    frame.current?.contentWindow.postMessage(
      { type: 'chemlab:molecule-control', action },
      location.origin,
    );
  }

  return (
    <section
      className="external-resource molecule-resource"
      aria-label={`Model 3D ${molecule.name}`}
    >
      <div className="external-controls" data-help="molecule-controls">
        <h2>Model 3D · {molecule.name}</h2>
        <a
          className="button outline"
          href={`https://3dmol.org/viewer.html?cid=${molecule.cid}&style=stick`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Buka di tab baru <Icon name="external" size={15} />
        </a>
      </div>
      {!opened ? (
        <div className="resource-placeholder">
          <Icon name="atom" size={37} />
          <h3>Amati bentuk molekul dari dekat</h3>
          <p>Buka model, lalu putar dan perbesar untuk mengamati susunan atomnya.</p>
          <button
            className="button primary"
            onClick={() => {
              setOpened(true);
            }}
          >
            Buka aktivitas <Icon name="arrow" size={16} />
          </button>
        </div>
      ) : (
        <>
          {status.phase !== 'error' && (
            // Closing this document releases 3Dmol's context, observers, and event listeners.
            <iframe
              key={`${molecule.cid}-${attempt}`}
              ref={frame}
              src={src}
              title={`Model 3D · ${molecule.name}`}
              className="molecule-frame"
            />
          )}
          {status.phase === 'error' && (
            <div className="resource-placeholder molecule-error">
              <Icon name="atom" size={37} />
              <h3>Model belum dapat ditampilkan</h3>
              <p>
                Struktur ringkas dan bacaan pendamping tetap tersedia untuk melanjutkan pengamatan.
              </p>
            </div>
          )}
          <p className="molecule-status" role="status">
            {status.phase === 'ready'
              ? `${molecule.name} siap diamati · ${status.atoms} atom.`
              : status.phase === 'error'
                ? status.message
                : 'Memuat struktur molekul…'}
          </p>
          <div className="molecule-controls" aria-label="Kontrol model molekul">
            {[
              ['left', 'Putar ke kiri'],
              ['right', 'Putar ke kanan'],
              ['up', 'Putar ke atas'],
              ['down', 'Putar ke bawah'],
              ['in', 'Perbesar'],
              ['out', 'Perkecil'],
              ['reset', 'Atur ulang sudut pandang'],
            ].map(([action, label]) => (
              <button
                key={action}
                className="button outline"
                disabled={status.phase !== 'ready'}
                onClick={() => control(action)}
              >
                {label}
              </button>
            ))}
            <button className="text-button" onClick={() => setAttempt((value) => value + 1)}>
              <Icon name="reset" size={15} /> Muat ulang model
            </button>
          </div>
          <p className="caption">
            Seret untuk memutar; gunakan roda mouse atau cubit untuk memperbesar. Tombol di atas
            juga dapat digunakan dengan keyboard. Muat ulang tidak menghapus catatanmu.
          </p>
        </>
      )}
      <p className="resource-credit">
        {attribution}{' '}
        <a href={source} target="_blank" rel="noreferrer">
          Sumber <Icon name="external" size={12} />
        </a>{' '}
        ·{' '}
        <a
          href={`${import.meta.env.BASE_URL}licenses/3dmol-LICENSE.txt`}
          target="_blank"
          rel="noreferrer"
        >
          Lisensi 3Dmol.js
        </a>
      </p>
    </section>
  );
}
