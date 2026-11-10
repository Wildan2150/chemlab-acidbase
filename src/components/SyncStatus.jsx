import { Icon } from './Visuals.jsx';

export const syncLabels = {
  loading: 'Memuat progres akun…',
  pending: 'Menunggu penyimpanan…',
  saving: 'Menyimpan progres…',
  synced: 'Progres tersimpan di akun',
  offline: 'Belum tersinkron · menunggu koneksi',
  error: 'Progres belum tersinkron',
  deleted: 'Catatan akun telah dihapus',
};

export default function SyncStatus({ sync, retry }) {
  if (sync.state === 'guest') return null;
  return (
    <div className={`sync-status sync-${sync.state}`} role="status" aria-live="polite">
      <Icon name={sync.state === 'synced' ? 'check' : 'help'} size={17} />
      <div>
        <strong>{syncLabels[sync.state]}</strong>
        {sync.message && <p>{sync.message}</p>}
      </div>
      {['error', 'offline'].includes(sync.state) && (
        <button className="text-button" onClick={retry}>
          Coba sinkronkan
        </button>
      )}
    </div>
  );
}
