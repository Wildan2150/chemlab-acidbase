import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { watchTeacherData } from '../services/teacherData.js';
import {
  buildTeacherRoster,
  conceptPerformance,
  filterStudents,
  studentStatus,
  teacherCsv,
  teacherExport,
  teacherSummary,
} from '../lib/teacherReport.js';
import { activities } from '../data/activities.js';
import { lessons } from '../data/chemData.js';
import { Icon } from '../components/Visuals.jsx';
import Dialog from '../components/Dialog.jsx';
import { AssessmentReview } from '../components/AssessmentResults.jsx';
import { AttemptReview } from './Quiz.jsx';
import { downloadJson, formatDate } from './Progress.jsx';

const statusLabels = {
  review: 'Perlu pendampingan',
  complete: 'Penguatan',
  missing: 'Belum mengumpulkan',
  unreadable: 'Data perlu ditinjau',
};
const score = (result) => (result ? `${result.score} / 100` : 'Belum ada hasil');
function downloadCsv(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'chemlab-hasil-belajar.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null),
    [error, setError] = useState('');
  const [retry, setRetry] = useState(0),
    [query, setQuery] = useState(''),
    [filter, setFilter] = useState('all');
  const [mode, setMode] = useState('diagnostic'),
    [threshold, setThreshold] = useState(80);
  const [selectedUid, setSelectedUid] = useState(null),
    [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    let active = true;
    setData(null);
    setError('');
    setSelectedUid(null);
    const timeout = setTimeout(() => {
      if (active) setError('Data siswa belum dapat dihubungi. Periksa koneksi lalu coba kembali.');
    }, 10000);
    const stop = watchTeacherData(
      (next) => {
        if (!active) return;
        clearTimeout(timeout);
        setData(next);
        setError('');
      },
      (failure) => {
        if (!active) return;
        clearTimeout(timeout);
        setData(null);
        setSelectedUid(null);
        setError(
          failure.code === 'permission-denied'
            ? 'Akses data siswa ditolak. Masuk ulang dengan akun guru yang sudah terverifikasi.'
            : 'Data siswa belum dapat dimuat. Periksa koneksi dan coba kembali.',
        );
      },
    );
    return () => {
      active = false;
      clearTimeout(timeout);
      stop();
    };
  }, [user.uid, retry]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  const students = useMemo(
    () => (data ? buildTeacherRoster(data, user.uid) : []),
    [data, user.uid],
  );
  const summary = teacherSummary(students, mode, threshold);
  const displayed = filterStudents(students, { query, filter, mode, threshold });
  const concepts = conceptPerformance(students, mode);
  const selected = students.find((student) => student.uid === selectedUid);
  const weakest = concepts
    .filter((concept) => concept.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  const resultLabel = mode === 'diagnostic' ? 'Diagnostik awal' : 'Asesmen akhir bab';
  return (
    <>
      <div className="page-heading heading-with-action">
        <div>
          <span className="eyebrow">RUANG PENGAJAR · ASAM & BASA</span>
          <h1>Di balik setiap jawaban.</h1>
          <p>Pantau progres siswa dan tentukan pendampingan dari hasil belajar yang tersinkron.</p>
        </div>
        <div className="teacher-export-actions">
          <button
            className="button outline"
            disabled={!data || !displayed.length || !!error}
            onClick={() =>
              downloadJson(teacherExport(displayed, mode, threshold), 'chemlab-hasil-belajar.json')
            }
          >
            <Icon name="download" size={17} />
            Ekspor JSON
          </button>
          <button
            className="button outline"
            disabled={!data || !displayed.length || !!error}
            onClick={() => downloadCsv(teacherCsv(displayed, mode, threshold))}
          >
            <Icon name="download" size={17} />
            Ekspor CSV
          </button>
        </div>
      </div>
      {error ? (
        <section className="surface teacher-state" role="alert">
          <h2>Data siswa belum tersedia</h2>
          <p>{error}</p>
          <button className="button outline" onClick={() => setRetry((value) => value + 1)}>
            Coba lagi
          </button>
        </section>
      ) : !data ? (
        <section className="surface teacher-state" role="status" aria-busy="true">
          <h2>Memuat progres siswa…</h2>
          <p>Menunggu catatan terbaru dari akun siswa.</p>
        </section>
      ) : (
        <>
          {!online && (
            <p className="storage-warning" role="status">
              Koneksi terputus. Data yang ditampilkan berasal dari pembaruan terakhir; hubungkan
              kembali untuk melihat perubahan siswa.
            </p>
          )}
          {summary.unreadable > 0 && (
            <p className="storage-warning" role="status">
              {summary.unreadable} catatan akun belum dapat dibaca. Catatan tersebut tidak
              dimasukkan ke perhitungan skor dan ditandai untuk ditinjau.
            </p>
          )}
          <section className="surface teacher-controls" aria-label="Pengaturan rekap">
            <label>
              Hasil yang ditinjau
              <select
                aria-label="Jenis hasil"
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                <option value="diagnostic">Diagnostik awal</option>
                <option value="assessment">Asesmen akhir bab terbaru</option>
              </select>
            </label>
            <label>
              Ambang pendampingan
              <input
                type="number"
                min="0"
                max="100"
                aria-label="Ambang pendampingan"
                value={threshold}
                onChange={(event) =>
                  setThreshold(Math.max(0, Math.min(100, Number(event.target.value) || 0)))
                }
              />
            </label>
            <p className="caption">
              Diagnostik memakai percobaan awal; asesmen memakai hasil terbaru per siswa. Ambang ini
              membantu pendampingan, bukan keputusan nilai akhir.
            </p>
          </section>
          <div className="teacher-stats teacher-live-stats">
            <section className="surface">
              <Icon name="teacher" />
              <strong>
                {summary.total}
                <span>akun siswa</span>
              </strong>
              <p>
                {summary.missing} belum mengumpulkan · {summary.unreadable} perlu pemeriksaan data
              </p>
            </section>
            <section className="surface">
              <Icon name="quiz" />
              <strong>
                {summary.submitted}
                <span>sudah mengumpulkan</span>
              </strong>
              <p>{resultLabel}</p>
            </section>
            <section className="surface">
              <Icon name="chart" />
              <strong>
                {summary.average === null ? '—' : summary.average.toLocaleString('id-ID')}
                <span>rata-rata skor</span>
              </strong>
              <p>Dihitung dari hasil yang sudah dikumpulkan</p>
            </section>
            <section className="surface">
              <Icon name="bulb" />
              <strong>
                {summary.review}
                <span>perlu pendampingan</span>
              </strong>
              <p>Skor di bawah {threshold}</p>
            </section>
          </div>
          <section className="surface concept-summary">
            <div className="section-heading">
              <div>
                <span className="eyebrow">BUKTI PEMAHAMAN</span>
                <h2>Konsep mana yang perlu perhatian?</h2>
              </div>
              <span className="subtle">
                {resultLabel} · {summary.submitted} hasil
              </span>
            </div>
            {summary.submitted === 0 ? (
              <p className="caption">
                Belum ada hasil yang dapat direkap. Siswa yang belum mengumpulkan tidak dianggap
                mendapat skor nol.
              </p>
            ) : (
              concepts.map((concept, index) => (
                <div className="concept-row" key={concept.id}>
                  <span className="concept-number">{String(index + 1).padStart(2, '0')}</span>
                  <div className="concept-description">
                    <strong>{concept.title}</strong>
                    <p>{concept.description}</p>
                  </div>
                  <div className="concept-bar">
                    <span
                      style={{
                        width: `${concept.total ? (concept.correct / concept.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <strong className="concept-count">
                    {concept.correct} / {concept.total}
                  </strong>
                </div>
              ))
            )}
            {weakest && (
              <div className="teacher-insight">
                <Icon name="bulb" size={22} />
                <div>
                  <h3>Fokus pendampingan</h3>
                  <p>
                    Proporsi jawaban tepat terendah terdapat pada {weakest.title.toLowerCase()} (
                    {weakest.correct} dari {weakest.total}). Tinjau alasan jawaban siswa dan gunakan
                    materi atau laboratorium untuk memberi latihan lanjutan. Satu jawaban belum
                    cukup untuk memastikan miskonsepsi.
                  </p>
                </div>
              </div>
            )}
          </section>
          <section className="surface student-results">
            <div className="section-heading">
              <h2>Hasil per siswa</h2>
              <span className="subtle">
                {displayed.length} dari {students.length} akun
              </span>
            </div>
            <div className="table-tools">
              <label className="search-field">
                <Icon name="search" size={17} />
                <input
                  aria-label="Cari siswa"
                  placeholder="Cari nama, email, atau ID siswa…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label className="filter-field">
                <Icon name="sliders" size={16} />
                <select
                  aria-label="Filter hasil siswa"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                >
                  <option value="all">Semua siswa</option>
                  <option value="review">Perlu pendampingan</option>
                  <option value="submitted">Sudah mengumpulkan</option>
                  <option value="missing">Belum mengumpulkan</option>
                  <option value="unreadable">Data perlu ditinjau</option>
                </select>
              </label>
            </div>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">
                  Progres dan hasil belajar siswa dari akun yang tersinkron
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Siswa</th>
                    <th scope="col">Materi</th>
                    <th scope="col">Diagnostik awal</th>
                    <th scope="col">Asesmen terbaru</th>
                    <th scope="col">Tindak lanjut</th>
                    <th scope="col">Terakhir tersinkron</th>
                    <th scope="col">
                      <span className="sr-only">Rincian</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((student) => {
                    const status = studentStatus(student, mode, threshold);
                    return (
                      <tr key={student.uid}>
                        <td>
                          <div className="student-cell">
                            <span className="student-avatar">
                              {student.name.slice(0, 1).toUpperCase()}
                            </span>
                            <div>
                              <strong>{student.name}</strong>
                              <small>{student.email || student.code}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          {student.progress
                            ? `${student.progress.completedLessons.length} / ${lessons.length}`
                            : '—'}
                        </td>
                        <td>{score(student.diagnostic)}</td>
                        <td>{score(student.assessment)}</td>
                        <td>
                          <span
                            className={`result-tag ${['review', 'unreadable'].includes(status) ? 'review' : ''}`}
                          >
                            {statusLabels[status]}
                          </span>
                        </td>
                        <td>
                          {student.updatedAt ? formatDate(student.updatedAt) : 'Belum ada progres'}
                        </td>
                        <td>
                          <button
                            className="icon-button"
                            aria-label={`Rincian ${student.name}`}
                            onClick={() => setSelectedUid(student.uid)}
                          >
                            <Icon name="up" size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!displayed.length && (
                <p className="table-empty" role="status">
                  {students.length
                    ? 'Tidak ada siswa yang cocok.'
                    : 'Belum ada akun siswa. Data muncul setelah siswa masuk dan menyimpan progres.'}
                </p>
              )}
            </div>
            <p className="caption teacher-table-hint">
              Geser tabel ke samping untuk melihat seluruh kolom.
            </p>
            <p className="caption">
              Ekspor mengikuti pencarian dan filter tabel. Rekap di atas mencakup seluruh akun siswa
              yang termuat.
            </p>
            <p className="caption">
              Sumber: progres akun siswa yang sudah tersinkron. Hasil belajar tanpa akun tersimpan
              pada perangkat siswa. Skor ditinjau bersama alasan jawaban dan bukti belajar lain.
            </p>
          </section>
        </>
      )}
      {selected && !error && (
        <StudentDetail
          key={selected.uid}
          student={selected}
          mode={mode}
          close={() => setSelectedUid(null)}
        />
      )}
    </>
  );
}

function StudentDetail({ student, mode, close }) {
  const history = [
    ...(student.progress?.attempts || []).map((attempt) => ({
      id: `diagnostic:${attempt.id}`,
      kind: 'diagnostic',
      attempt,
      title: `${attempt.kind === 'diagnostic' ? 'Diagnostik awal' : 'Latihan ulang'} · ${formatDate(attempt.completedAt)} · ${attempt.score}/100`,
    })),
    ...(student.progress?.assessment.attempts || []).map((attempt) => ({
      id: `assessment:${attempt.id}`,
      kind: 'assessment',
      attempt,
      title: `Asesmen akhir bab · ${formatDate(attempt.completedAt)} · ${attempt.score}/100`,
    })),
  ];
  const [choice, setChoice] = useState(
    student[mode] ? `${mode}:${student[mode].id}` : history[0]?.id || '',
  );
  const current = history.find((entry) => entry.id === choice) || history[0];
  const notes = activities.filter((activity) =>
    ['prediction', 'observation', 'explanation'].some((field) =>
      student.progress?.activityNotes[activity.id]?.[field]?.trim(),
    ),
  );
  return (
    <Dialog
      title={`Catatan ${student.name}`}
      className="wide-dialog teacher-detail"
      onClose={close}
    >
      <p className="dialog-description">
        {student.email || student.code} · {student.progress?.completedLessons.length || 0} dari{' '}
        {lessons.length} materi selesai
      </p>
      {student.unreadable ? (
        <p role="status">
          Catatan akun ini belum dapat dibaca. Minta siswa memeriksa penyimpanan akun dan menyimpan
          ekspor sebelum melakukan perubahan.
        </p>
      ) : (
        <>
          {history.length ? (
            <>
              <label className="teacher-history-select">
                Percobaan yang ditinjau
                <select
                  aria-label="Percobaan yang ditinjau"
                  value={current.id}
                  onChange={(event) => setChoice(event.target.value)}
                >
                  {history.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.title}
                    </option>
                  ))}
                </select>
              </label>
              <p className="dialog-description">
                Skor {current.attempt.score}/100 · ID percobaan {current.attempt.id}
              </p>
              {current.kind === 'diagnostic' ? (
                <AttemptReview attempt={current.attempt} answerLabel="Jawaban siswa" />
              ) : (
                <AssessmentReview attempt={current.attempt} answerLabel="Jawaban siswa" />
              )}
            </>
          ) : (
            <p className="caption">
              Siswa belum mengumpulkan hasil diagnostik atau asesmen akhir bab.
            </p>
          )}
          <section className="teacher-notes">
            <h3>Catatan eksplorasi</h3>
            {notes.length ? (
              notes.map((activity) => {
                const note = student.progress.activityNotes[activity.id];
                return (
                  <div className="surface" key={activity.id}>
                    <h4>{activity.title}</h4>
                    <p className="caption">
                      {note.completedAt ? 'Catatan lengkap' : 'Draf catatan'}
                    </p>
                    <dl>
                      <dt>Prediksi</dt>
                      <dd>{note.prediction || 'Belum dicatat'}</dd>
                      <dt>Pengamatan</dt>
                      <dd>{note.observation || 'Belum dicatat'}</dd>
                      <dt>Penjelasan</dt>
                      <dd>{note.explanation || 'Belum dicatat'}</dd>
                    </dl>
                  </div>
                );
              })
            ) : (
              <p className="caption">Belum ada catatan eksplorasi.</p>
            )}
          </section>
        </>
      )}
    </Dialog>
  );
}
