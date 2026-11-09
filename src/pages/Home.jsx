import { lessons } from '../data/chemData.js';
import { phInfo } from '../lib/chemistry.js';
import { Icon, BeakerDrawing, HeroIllustration, PhScale } from '../components/Visuals.jsx';

export function LessonCard({ lesson, completed }) {
  return (
    <a className={`lesson-card ${lesson.color}`} href={`#materi/${lesson.id}`}>
      <div className="lesson-card-top">
        <span className="lesson-icon">
          <Icon name={lesson.icon} size={23} />
        </span>
        <span className="lesson-number">
          {completed ? <Icon name="done" size={19} /> : lesson.number}
        </span>
      </div>
      <div>
        <span className="micro-label">BAGIAN {lesson.number}</span>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
      </div>
      <div className="lesson-card-bottom">
        <span>
          <Icon name={completed ? 'check' : 'book'} size={14} />
          {completed ? 'Sudah dipelajari' : lesson.duration}
        </span>
        <span className="circle-arrow">
          <Icon name="up" size={18} />
        </span>
      </div>
    </a>
  );
}

export default function Home({ progress, setPh }) {
  const completed =
    progress.completedLessons.length +
    Number(progress.labVisited) +
    Number(progress.attempts.length > 0);
  const info = phInfo(progress.ph);
  const nextLesson = lessons.find((l) => !progress.completedLessons.includes(l.id)) || lessons[0];
  return (
    <>
      <div className="page-heading home-heading">
        <div>
          <p className="eyebrow">SEDIKIT RASA INGIN TAHU, BANYAK PENEMUAN.</p>
          <h1>
            Halo, penjelajah kimia<span className="greeting-dot">.</span>
          </h1>
          <p>Siap menemukan hal menarik di balik larutan sehari-hari?</p>
        </div>
        <span className="tag">
          <span className="tiny-dot" /> Belajar mandiri
        </span>
      </div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="hero-label">
            <span /> MODUL 01 <span className="label-divider">/</span> ASAM & BASA
          </span>
          <h2 id="hero-title">
            Kimia lebih dekat
            <br />
            dari yang kamu <em>kira.</em>
          </h2>
          <p>
            Dari segelas air hingga sari lemon. Kenali asam, basa, dan pH dengan cara yang lebih
            seru.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={`#materi/${nextLesson.id}`}>
              {progress.completedLessons.length ? 'Lanjutkan belajar' : 'Mulai belajar'}
              <Icon name="arrow" size={18} />
            </a>
            <a className="text-button" href="#laboratorium">
              <Icon name="flask" size={17} />
              Coba eksperimen
            </a>
          </div>
          <div className="hero-meta">
            <span>
              <Icon name="book" size={14} />3 bagian materi
            </span>
            <i />
            <span>± 75 menit belajar</span>
            <i />
            <span>Untuk kelas XI</span>
          </div>
        </div>
        <HeroIllustration />
      </section>
      <section className="learning-summary" aria-label="Ringkasan aktivitas">
        <div className="summary-item">
          <span className="summary-icon">
            <Icon name="book" size={21} />
          </span>
          <div>
            <strong>
              {progress.completedLessons.length}
              <span> / 3</span>
            </strong>
            <p>Bagian dipelajari</p>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">
            <Icon name="flask" size={21} />
          </span>
          <div>
            <strong>{progress.labVisited ? 'Sudah dicoba' : 'Bebas eksplorasi'}</strong>
            <p>Laboratorium virtual</p>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">
            <Icon name="quiz" size={21} />
          </span>
          <div>
            <strong>
              {progress.attempts.length
                ? `${progress.attempts.at(-1).score} / 100`
                : 'Belum dimulai'}
            </strong>
            <p>{progress.attempts.length ? 'Skor kuis terakhir' : 'Kuis diagnostik · 5 soal'}</p>
          </div>
          <a href="#progres" className="summary-link" aria-label="Lihat progres saya">
            <Icon name="up" size={19} />
          </a>
        </div>
      </section>
      <div className="dashboard-lower">
        <section className="learning-path">
          <div className="section-heading">
            <div>
              <span className="eyebrow">LANGKAH KECIL, PAHAM LEBIH JAUH</span>
              <h2>Jalur belajarmu</h2>
            </div>
            <a className="small-link" href="#materi">
              Semua materi
              <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="lesson-grid">
            {lessons.map((l) => (
              <LessonCard
                key={l.id}
                lesson={l}
                completed={progress.completedLessons.includes(l.id)}
              />
            ))}
          </div>
          <div className="quiz-banner">
            <span className="quiz-banner-icon">
              <Icon name="bulb" size={24} />
            </span>
            <div>
              <h3>Sejauh mana kamu sudah paham?</h3>
              <p>Lima pertanyaan untuk mengenali pemahaman awalmu.</p>
            </div>
            <a href="#kuis" className="button outline">
              {progress.attempts.length ? 'Lihat hasil kuis' : 'Coba kuis'}
              <Icon name="arrow" size={16} />
            </a>
          </div>
        </section>
        <aside className="mini-lab">
          <div className="mini-lab-title">
            <span className="mini-icon">
              <Icon name="flask" size={18} />
            </span>
            <span>EKSPERIMEN CEPAT</span>
            <Icon name="atom" size={22} />
          </div>
          <h2>Geser. Amati. Pahami.</h2>
          <p>Apa yang berubah saat pH bergeser?</p>
          <div className="mini-beaker">
            <BeakerDrawing color={info.color} label={`Larutan ${info.label}, pH ${info.ph}`} />
            <div className="ph-readout">
              <span>pH larutan</span>
              <strong>{info.ph.toLocaleString('id-ID', { minimumFractionDigits: 1 })}</strong>
              <span className="type-pill">{info.label}</span>
            </div>
          </div>
          <label className="sr-only" htmlFor="home-ph">
            Atur pH larutan
          </label>
          <input
            id="home-ph"
            className="ph-range"
            type="range"
            min="0"
            max="14"
            step="0.5"
            value={info.ph}
            onChange={(e) => setPh(Number(e.target.value))}
          />
          <PhScale ph={info.ph} />
          <a href="#laboratorium" className="lab-link">
            Buka laboratorium
            <Icon name="up" size={17} />
          </a>
          <p className="lab-note">Ilustrasi indikator pada 25 °C.</p>
        </aside>
      </div>
      <section className="home-footnote">
        <Icon name="leaf" size={18} />
        <p>
          Belajar itu proses. Kamu sudah menyelesaikan <strong>{completed} dari 5 langkah</strong>.
          Lanjutkan dengan ritmemu sendiri.
        </p>
        <span className="mini-progress">
          <span style={{ width: `${completed * 20}%` }} />
        </span>
      </section>
    </>
  );
}
