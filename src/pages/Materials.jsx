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
          <p>Tiga bagian singkat untuk membangun pemahaman yang utuh.</p>
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
          {lesson.sections.map((s, i) => (
            <section className="reading-section" key={s.title}>
              <span className="reading-index">0{i + 1}</span>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
              {s.formula && <div className="formula-block">{s.formula}</div>}
              {s.callout && (
                <div className="callout">
                  <Icon name="bulb" />
                  <p>{s.callout}</p>
                </div>
              )}
            </section>
          ))}
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
          <SourceList />
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

export function SourceList() {
  return (
    <section className="sources">
      <h2>Bacaan & sumber konsep</h2>
      <p>Perdalam pemahaman asam–basa melalui referensi berikut.</p>
      {sources.map((s) => (
        <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
          {s.title}
          <Icon name="external" size={13} />
        </a>
      ))}
    </section>
  );
}
