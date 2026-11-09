import { useState } from 'react';
import { lessons, QUESTION_VERSION } from '../data/chemData.js';
import { Icon } from '../components/Visuals.jsx';
import { AttemptReview } from './Quiz.jsx';
import { AssessmentHistory } from '../components/AssessmentResults.jsx';

export const formatDate = (date) =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(date)) + ' WIB';
export function downloadJson(data, filename) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Progress({ progress, requestReset, storageOk }) {
  const [expanded, setExpanded] = useState(null);
  const completed =
    progress.completedLessons.length +
    Number(progress.labVisited) +
    Number(progress.attempts.length > 0);
  return (
    <>
      <div className="page-heading heading-with-action">
        <div>
          <span className="eyebrow">CATATAN PERJALANAN BELAJAR</span>
          <h1>Langkahmu, kemajuanmu.</h1>
          <p>Setiap konsep yang kamu pahami adalah satu penemuan baru.</p>
        </div>
        <button
          className="button outline"
          onClick={() =>
            downloadJson(
              {
                exportedAt: new Date().toISOString(),
                questionVersion: QUESTION_VERSION,
                ...progress,
              },
              'chemlab-progres.json',
            )
          }
        >
          <Icon name="download" size={17} />
          Ekspor progres
        </button>
      </div>
      <div className="progress-overview surface">
        <div className="progress-ring" style={{ '--progress': `${completed * 20}%` }}>
          <div>
            <strong>
              {completed * 20}
              <span>%</span>
            </strong>
            <small>langkah selesai</small>
          </div>
        </div>
        <div>
          <span className="eyebrow">BELAJAR DENGAN RITMEMU</span>
          <h2>
            {completed === 5
              ? 'Satu modul, banyak penemuan.'
              : `${completed} dari 5 langkah selesai`}
          </h2>
          <p>
            3 bagian materi, 1 eksplorasi laboratorium, dan 1 kuis. Persentase menunjukkan
            aktivitas, bukan ukuran penguasaan konsep.
          </p>
          <a href={completed === 5 ? '#kuis' : '#materi'} className="small-link">
            {completed === 5 ? 'Tinjau pemahamanmu' : 'Lanjutkan belajar'}
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
      <section className="surface progress-checklist">
        <h2>Jejak aktivitas</h2>
        {[
          ...lessons.map((l) => ({
            label: l.title,
            done: progress.completedLessons.includes(l.id),
            href: `#materi/${l.id}`,
          })),
          { label: 'Mencoba laboratorium pH', done: progress.labVisited, href: '#laboratorium' },
          {
            label: 'Menyelesaikan kuis diagnostik',
            done: progress.attempts.length > 0,
            href: '#kuis',
          },
        ].map((item, i) => (
          <a className="checklist-row" key={item.label} href={item.href}>
            <span className={`step-circle ${item.done ? 'is-done' : ''}`}>
              {item.done ? <Icon name="check" size={16} /> : i + 1}
            </span>
            <span>{item.label}</span>
            <small>{item.done ? 'Selesai' : 'Belum selesai'}</small>
            <Icon name="next" size={16} />
          </a>
        ))}
      </section>
      <div className="section-heading">
        <h2>Riwayat percobaan</h2>
        <span className="subtle">{progress.attempts.length} percobaan</span>
      </div>
      {progress.attempts.length === 0 ? (
        <div className="empty-state surface">
          <Icon name="quiz" size={35} />
          <h3>Perjalanan kuismu mulai di sini.</h3>
          <p>Selesaikan kuis untuk melihat hasil dan pembahasan per soal.</p>
          <a href="#kuis" className="button primary">
            Mulai kuis
            <Icon name="arrow" size={16} />
          </a>
        </div>
      ) : (
        [...progress.attempts].reverse().map((a, i) => (
          <section className="history-card surface" key={a.id}>
            <div className="history-row">
              <span className="history-order">
                {String(progress.attempts.length - i).padStart(2, '0')}
              </span>
              <div>
                <h3>{a.kind === 'diagnostic' ? 'Diagnostik awal' : 'Latihan ulang'}</h3>
                <p>{formatDate(a.completedAt)}</p>
              </div>
              <strong>
                {a.score}
                <small> / 100</small>
              </strong>
              <button
                className="button outline small"
                aria-expanded={expanded === a.id}
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
              >
                {expanded === a.id ? 'Tutup rincian' : 'Lihat rincian'}
              </button>
            </div>
            {expanded === a.id && <AttemptReview attempt={a} />}
          </section>
        ))
      )}
      <AssessmentHistory assessment={progress.assessment} />
      <section className="local-data-note">
        <div>
          <Icon name="help" size={22} />
          <div>
            <h3>{storageOk ? 'Tersimpan di browser ini' : 'Penyimpanan browser tidak tersedia'}</h3>
            <p>
              {storageOk
                ? 'Progresmu tersimpan di perangkat dan browser ini. Ekspor catatan sebelum menghapus data browser atau menggunakan perangkat bersama.'
                : 'Aktivitas masih dapat digunakan, tetapi akan hilang saat halaman ditutup. Ekspor progres untuk menyimpan salinannya.'}
            </p>
          </div>
        </div>
        <button className="text-button danger" onClick={requestReset}>
          <Icon name="reset" size={15} />
          Reset progres
        </button>
      </section>
    </>
  );
}
