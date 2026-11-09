import { useState } from 'react';
import { demoStudents, questions, QUESTION_VERSION } from '../data/chemData.js';
import { gradeAnswers } from '../lib/chemistry.js';
import { Icon } from '../components/Visuals.jsx';
import Dialog from '../components/Dialog.jsx';
import { AttemptReview } from './Quiz.jsx';
import { downloadJson } from './Progress.jsx';

const students = demoStudents.map((s) => ({
  ...s,
  score: gradeAnswers(s.answers).filter((i) => i.isCorrect).length * 20,
}));
export default function Teacher() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const displayed = students.filter(
    (s) =>
      `${s.code} ${s.name}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === 'all' || s.score < 80),
  );
  const average = students.reduce((sum, s) => sum + s.score, 0) / students.length;
  return (
    <>
      <div className="page-heading heading-with-action">
        <div>
          <span className="eyebrow">RUANG PENGAJAR · KELAS XI · ASAM & BASA</span>
          <h1>Di balik setiap jawaban.</h1>
          <p>Kenali pola pemahaman untuk merencanakan langkah belajar berikutnya.</p>
        </div>
        <button
          className="button outline"
          onClick={() =>
            downloadJson(
              { type: 'data-contoh-fiktif', questionVersion: QUESTION_VERSION, students },
              'chemlab-hasil-belajar.json',
            )
          }
        >
          <Icon name="download" size={17} />
          Ekspor hasil
        </button>
      </div>
      <div className="teacher-stats">
        <section className="surface">
          <Icon name="teacher" />
          <strong>
            {students.length}
            <span>siswa</span>
          </strong>
          <p>Satu percobaan awal per siswa</p>
        </section>
        <section className="surface">
          <Icon name="chart" />
          <strong>
            {average}
            <span>rata-rata skor</span>
          </strong>
          <p>Dari skor maksimum 100</p>
        </section>
        <section className="surface">
          <Icon name="bulb" />
          <strong>
            {students.filter((s) => s.score < 80).length}
            <span>perlu ditinjau</span>
          </strong>
          <p>Prioritas pendampingan · skor &lt; 80</p>
        </section>
      </div>
      <section className="surface concept-summary">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BUKTI BELAJAR PER BUTIR</span>
            <h2>Konsep mana yang perlu perhatian?</h2>
          </div>
          <span className="subtle">Jawaban tepat / 6 siswa</span>
        </div>
        {questions.map((q, i) => {
          const correct = students.filter((s) => s.answers[q.id] === q.correct).length;
          return (
            <div className="concept-row" key={q.id}>
              <span className="concept-number">0{i + 1}</span>
              <div className="concept-description">
                <strong>{q.concept}</strong>
                <p>{q.objective}</p>
              </div>
              <div className="concept-bar">
                <span style={{ width: `${(correct / students.length) * 100}%` }} />
              </div>
              <strong className="concept-count">{correct} / 6</strong>
            </div>
          );
        })}
        <div className="teacher-insight">
          <Icon name="bulb" size={22} />
          <div>
            <h3>Rekomendasi tindak lanjut</h3>
            <p>
              Pada soal skala logaritmik, 3 dari 6 siswa belum menjawab tepat. Dua memilih “2 kali
              lebih besar”, yang konsisten dengan dugaan pembacaan linear. Ajak siswa membandingkan
              10⁻³ dan 10⁻⁵ melalui laboratorium, minta alasan, lalu berikan soal setara. Satu
              jawaban saja belum cukup untuk memastikan miskonsepsi.
            </p>
          </div>
        </div>
      </section>
      <section className="surface student-results">
        <div className="section-heading">
          <h2>Hasil per siswa</h2>
          <span className="subtle">Versi soal: {QUESTION_VERSION}</span>
        </div>
        <div className="table-tools">
          <label className="search-field">
            <Icon name="search" size={17} />
            <input
              aria-label="Cari siswa"
              placeholder="Cari nama atau kode siswa…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="filter-field">
            <Icon name="sliders" size={16} />
            <select
              aria-label="Filter hasil siswa"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Semua hasil</option>
              <option value="review">Perlu ditinjau (&lt; 80)</option>
            </select>
          </label>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Hasil diagnostik awal siswa</caption>
            <thead>
              <tr>
                <th scope="col">Siswa</th>
                <th scope="col">Jawaban tepat</th>
                <th scope="col">Skor</th>
                <th scope="col">Tindak lanjut</th>
                <th scope="col">
                  <span className="sr-only">Rincian</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((s) => (
                <tr key={s.code}>
                  <td>
                    <div className="student-cell">
                      <span className="student-avatar">{s.code.slice(-2)}</span>
                      <div>
                        <strong>{s.name}</strong>
                        <small>{s.code}</small>
                      </div>
                    </div>
                  </td>
                  <td>{s.score / 20} / 5</td>
                  <td>
                    <strong>{s.score}</strong>
                    <span className="subtle"> / 100</span>
                  </td>
                  <td>
                    <span className={`result-tag ${s.score < 80 ? 'review' : ''}`}>
                      {s.score < 80 ? 'Tinjau konsep' : 'Penguatan'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`Rincian ${s.name}`}
                      onClick={() => setSelected(s)}
                    >
                      <Icon name="up" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!displayed.length && (
            <p className="table-empty" role="status">
              Tidak ada siswa yang cocok.
            </p>
          )}
        </div>
        <p className="caption">
          Menampilkan {displayed.length} dari 6 siswa. Skor digunakan bersama alasan jawaban dan
          bukti belajar lain.
        </p>
        <p className="caption">Sumber: data latihan fiktif.</p>
      </section>
      {selected && (
        <Dialog
          title={`Jawaban ${selected.name}`}
          className="wide-dialog"
          onClose={() => setSelected(null)}
        >
          <p className="dialog-description">Diagnostik awal · Skor {selected.score}/100</p>
          <AttemptReview attempt={selected} />
        </Dialog>
      )}
    </>
  );
}
