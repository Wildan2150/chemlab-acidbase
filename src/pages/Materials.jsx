import { useState } from 'react';
import { lessons, sources } from '../data/chemData.js';
import { LessonCard } from './Home.jsx';
import { Icon } from '../components/Visuals.jsx';

export default function Materials({ lessonId, progress, completeLesson }) {
  const [revealed, setRevealed] = useState(false);
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson)
    return (
      <>
        <div className="page-heading">
          <p className="eyebrow">MODUL 01 · ASAM & BASA</p>
          <h1>Mulai dari konsep.</h1>
          <p>Tiga bacaan mendalam, dari teori asam–basa hingga penyangga dan titrasi.</p>
        </div>
        <div className="info-strip">
          <Icon name="bulb" />
          <p>
            Ingin mengukur pemahaman awal? <a href="#kuis">Kerjakan kuis diagnostik</a> sebelum
            membaca materi.
          </p>
        </div>
        <div className="lesson-grid material-grid">
          {lessons.map((l) => (
            <LessonCard
              key={l.id}
              lesson={l}
              completed={progress.completedLessons.includes(l.id)}
            />
          ))}
        </div>
        <section className="surface learning-objectives">
          <span className="eyebrow">SETELAH MODUL INI, KAMU BISA…</span>
          <h2>Lebih dari menghafal rumus.</h2>
          {lessons.map((l) => (
            <div className="objective-row" key={l.id}>
              <span>{l.number}</span>
              <p>{l.objective}</p>
            </div>
          ))}
        </section>
        <SourceList />
      </>
    );
  const index = lessons.indexOf(lesson);
  const next = lessons[index + 1];
  const done = progress.completedLessons.includes(lesson.id);
  return (
    <>
      <a href="#materi" className="back-link">
        <Icon name="back" size={16} />
        Semua materi
      </a>
      <div className="reading-layout">
        <article className="lesson-article">
          <div className="page-heading">
            <span className="eyebrow">
              BAGIAN {lesson.number} / 03 · {lesson.duration.toUpperCase()}
            </span>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>
          </div>
          <div className="objective-box">
            <Icon name="atom" />
            <div>
              <strong>Tujuan belajarmu</strong>
              <p>{lesson.objective}</p>
            </div>
          </div>
          <div className="reading-prerequisites">
            <strong>Sebelum mulai</strong>
            <p>{lesson.prerequisites.join(' · ')}</p>
          </div>
          <details className="reading-outline">
            <summary>Daftar isi bacaan · {lesson.sections.length} bagian</summary>
            <nav aria-label="Daftar isi bacaan">
              {lesson.sections.map((section, i) => (
                <button
                  key={section.title}
                  onClick={() => {
                    const target = document.getElementById(`reading-${i}`);
                    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target?.focus({ preventScroll: true });
                  }}
                >
                  {String(i + 1).padStart(2, '0')} · {section.title}
                </button>
              ))}
            </nav>
          </details>
          {lesson.sections.map((s, i) => (
            <section className="reading-section" key={s.title}>
              <span className="reading-index">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`reading-${i}`} tabIndex="-1">
                {s.title}
              </h2>
              {(s.paragraphs || [s.body]).map((p, n) => (
                <p key={n}>{p}</p>
              ))}
              {s.formula && <div className="formula-block">{s.formula}</div>}
              {s.table && (
                <div className="table-scroll reading-table">
                  <table>
                    <caption>{s.table.caption}</caption>
                    <thead>
                      <tr>
                        {s.table.headers.map((h) => (
                          <th key={h} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row, n) => (
                        <tr key={n}>
                          {row.map((cell, j) =>
                            j === 0 ? (
                              <th key={j} scope="row">
                                {cell}
                              </th>
                            ) : (
                              <td key={j}>{cell}</td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {s.example && (
                <div className="worked-example">
                  <span className="eyebrow">CONTOH TERBIMBING</span>
                  <h3>{s.example.question}</h3>
                  <ol>
                    {s.example.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p>
                    <strong>Kesimpulan:</strong> {s.example.answer}
                  </p>
                </div>
              )}
              {s.callout && (
                <div className="callout">
                  <Icon name="bulb" />
                  <p>{s.callout}</p>
                </div>
              )}
              <div className="section-references">
                <span>Rujukan konsep:</span>
                {s.sourceIds.map((id) => {
                  const source = sources.find((item) => item.id === id);
                  return (
                    <a key={id} href={source.url} target="_blank" rel="noreferrer">
                      {source.title}
                      <Icon name="external" size={12} />
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
          <section className="reading-recap">
            <h2>Hubungkan kembali konsepnya</h2>
            <ul>
              {lesson.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
          <section className="reading-practice">
            <h2>Uji alasanmu</h2>
            <p>Coba jelaskan dengan kata-katamu sendiri sebelum membuka pembahasan.</p>
            {lesson.checks.map((check, i) => (
              <details key={check.question}>
                <summary>
                  {i + 1}. {check.question}
                </summary>
                <p>{check.answer}</p>
              </details>
            ))}
          </section>
          <section className="self-check">
            <span className="eyebrow">BERHENTI SEJENAK, COBA PIKIRKAN</span>
            <h2>{lesson.check}</h2>
            {revealed ? (
              <p className="check-answer" role="status">
                {lesson.answer}
              </p>
            ) : (
              <button className="text-button" onClick={() => setRevealed(true)}>
                Lihat penjelasan
                <Icon name="next" size={16} />
              </button>
            )}
          </section>
          <div className="reading-actions">
            <button
              className={`button ${done ? 'outline' : 'primary'}`}
              onClick={() => completeLesson(lesson.id)}
              disabled={done}
            >
              <Icon name={done ? 'done' : 'check'} size={18} />
              {done ? 'Sudah dipelajari' : 'Tandai sudah dipelajari'}
            </button>
            <a className="text-button" href={next ? `#materi/${next.id}` : '#laboratorium'}>
              {next ? 'Bagian berikutnya' : 'Lanjut ke laboratorium'}
              <Icon name="arrow" size={18} />
            </a>
          </div>
          <SourceList ids={[...new Set(lesson.sections.flatMap((s) => s.sourceIds))]} />
        </article>
        <aside className="reading-sidebar">
          <span className="eyebrow">ISI MODUL</span>
          {lessons.map((l) => (
            <a
              key={l.id}
              href={`#materi/${l.id}`}
              aria-current={l.id === lesson.id ? 'page' : undefined}
            >
              <span>{l.number}</span>
              {l.title}
              {progress.completedLessons.includes(l.id) && <Icon name="check" size={16} />}
            </a>
          ))}
          <div className="sidebar-tip">
            <Icon name="flask" size={27} />
            <h3>Konsep bertemu eksplorasi.</h3>
            <p>Coba ubah pH dan amati hubungan antar-ion.</p>
            <a href="#laboratorium" className="small-link">
              Ke laboratorium
              <Icon name="arrow" size={15} />
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

export function SourceList({ ids } = {}) {
  return (
    <section className="sources">
      <h2>Bacaan & sumber konsep</h2>
      <p>Perdalam pemahaman asam–basa melalui referensi berikut.</p>
      {sources
        .filter((s) => !ids || ids.includes(s.id))
        .map((s) => (
          <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
            {s.title}
            <Icon name="external" size={13} />
          </a>
        ))}
    </section>
  );
}
