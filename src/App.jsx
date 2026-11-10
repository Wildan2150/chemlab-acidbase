import { useEffect, useRef, useState } from 'react';
import { lessons } from './data/chemData.js';
import {
  accountProgressKey,
  createDraft,
  emptyProgress,
  loadProgress,
  saveProgress,
} from './lib/storage.js';
import { makeAttempt } from './lib/chemistry.js';
import { Icon } from './components/Visuals.jsx';
import Dialog from './components/Dialog.jsx';
import Home from './pages/Home.jsx';
import Materials from './pages/Materials.jsx';
import Laboratory from './pages/Laboratory.jsx';
import Quiz from './pages/Quiz.jsx';
import Progress from './pages/Progress.jsx';
import Teacher from './pages/Teacher.jsx';
import ChapterAssessment from './pages/ChapterAssessment.jsx';
import { createAssessmentDraft, submitChapterAssessment } from './lib/chapterAssessment.js';
import Exploration from './pages/Exploration.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import AuthPages from './pages/AuthPages.jsx';
import Account from './pages/Account.jsx';
import EmailAction from './pages/EmailAction.jsx';

const navigation = [
  { id: 'beranda', label: 'Beranda', icon: 'home' },
  { id: 'materi', label: 'Materi belajar', icon: 'book' },
  { id: 'laboratorium', label: 'Laboratorium pH', icon: 'flask' },
  { id: 'eksplorasi', label: 'Eksplorasi kimia', icon: 'atom' },
  { id: 'kuis', label: 'Kuis diagnostik', icon: 'quiz' },
  { id: 'asesmen', label: 'Asesmen akhir bab', icon: 'chart' },
  { id: 'progres', label: 'Progres saya', icon: 'chart' },
];
const getRoute = () =>
  window.location.hash.slice(1) ||
  (new URLSearchParams(window.location.search).has('oobCode') ? 'tindakan-akun' : 'beranda');
function initialProgress(key) {
  try {
    return loadProgress(window.localStorage, key);
  } catch {
    return {
      data: emptyProgress(),
      warning:
        'Penyimpanan browser tidak tersedia. Progres hanya bertahan selama sesi ini; kamu bisa mengekspornya.',
    };
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AccountSession />
    </AuthProvider>
  );
}
function AccountSession() {
  const { user, ready } = useAuth();
  if (!ready)
    return (
      <div className="auth-loading" role="status">
        <Icon name="flask" size={30} />
        <p>Menyiapkan ruang belajarmu…</p>
      </div>
    );
  return <LearningApp key={user?.uid || 'guest'} />;
}
function LearningApp() {
  const { user, error: authError } = useAuth();
  const progressKey = accountProgressKey(user?.uid);
  const [initial] = useState(() => initialProgress(progressKey));
  const [progress, setProgress] = useState(initial.data);
  const [route, setRoute] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [query, setQuery] = useState('');
  const [storageOk, setStorageOk] = useState(!initial.warning);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [announcement, setAnnouncement] = useState('');
  const mainRef = useRef(null);
  const firstRender = useRef(true);
  const page = route.split('/')[0].split('?')[0];
  const lessonId = route.split('/')[1];
  const current = navigation.find((n) => n.id === page);
  const accountLabels = {
    masuk: 'Masuk',
    daftar: 'Buat akun',
    'lupa-password': 'Pemulihan akun',
    akun: 'Akun saya',
    'tindakan-akun': 'Konfirmasi akun',
  };
  const pageLabel =
    current?.label ||
    accountLabels[page] ||
    (page === 'guru' ? 'Panel guru' : 'Halaman tidak ditemukan');

  useEffect(() => {
    const onHash = () => {
      setRoute(getRoute());
      setMenuOpen(false);
      setDialog(null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.title = `${pageLabel} — ChemLab`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [route, pageLabel]);
  useEffect(() => {
    let saved = false;
    try {
      saved = saveProgress(window.localStorage, progress, progressKey);
    } catch {
      /* Browser can deny access to localStorage. */
    }
    setStorageOk(saved);
    if (!saved)
      setStorageWarning(
        'Penyimpanan browser tidak tersedia. Progres hanya bertahan selama sesi ini. Ekspor catatan melalui “Progres saya”.',
      );
  }, [progress, progressKey]);
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'k') ||
        (e.key === '/' && !typing && !document.querySelector('dialog[open]'))
      ) {
        e.preventDefault();
        setDialog('search');
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    document.querySelector('.sidebar-close')?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  function completeLesson(id) {
    setProgress((p) => ({ ...p, completedLessons: [...new Set([...p.completedLessons, id])] }));
    setAnnouncement('Bagian materi ditandai sudah dipelajari.');
  }
  const setPh = (ph) => setProgress((p) => ({ ...p, ph, labVisited: true }));
  const markLab = () => setProgress((p) => ({ ...p, labVisited: true }));
  const updateActivity = (id, patch) =>
    setProgress((p) => ({
      ...p,
      activityNotes: { ...p.activityNotes, [id]: { ...p.activityNotes?.[id], ...patch } },
    }));
  const updateAnswer = (id, value) =>
    setProgress((p) => ({
      ...p,
      draft: { ...p.draft, answers: { ...p.draft.answers, [id]: value } },
    }));
  function submitQuiz() {
    setProgress((p) =>
      p.attempts.some((a) => a.id === p.draft.id)
        ? p
        : { ...p, attempts: [...p.attempts, makeAttempt(p.draft)] },
    );
  }
  function startAssessment() {
    setProgress((p) => ({ ...p, assessment: { ...p.assessment, draft: createAssessmentDraft() } }));
  }
  function updateAssessmentAnswer(id, value) {
    setProgress((p) => {
      const assessment = p.assessment;
      if (!assessment.draft || assessment.attempts.some((a) => a.id === assessment.draft.id))
        return p;
      return {
        ...p,
        assessment: {
          ...assessment,
          draft: { ...assessment.draft, answers: { ...assessment.draft.answers, [id]: value } },
        },
      };
    });
  }
  function updateAssessmentPosition(position) {
    setProgress((p) => ({
      ...p,
      assessment: { ...p.assessment, draft: { ...p.assessment.draft, position } },
    }));
  }
  function submitAssessment() {
    setProgress((p) => ({ ...p, assessment: submitChapterAssessment(p.assessment) }));
  }
  const results = [
    {
      title: 'Asesmen akhir bab',
      description:
        'Lima belas soal teori, hitungan pH, buffer, hidrolisis, dan titrasi dengan hasil per konsep.',
      href: '#asesmen',
      icon: 'chart',
    },
    ...lessons.map((l) => ({
      title: l.title,
      description: `${l.description} ${l.objective}`,
      href: `#materi/${l.id}`,
      icon: l.icon,
    })),
    {
      title: 'Laboratorium pH',
      description: 'Simulasi konsentrasi ion hidronium dan hidroksida, pOH dan model HCl.',
      href: '#laboratorium',
      icon: 'flask',
    },
    {
      title: 'Kuis diagnostik',
      description: 'Lima soal asam basa dan pembahasan.',
      href: '#kuis',
      icon: 'quiz',
    },
    {
      title: 'Eksplorasi kimia',
      description: 'PhET, model molekul 3D, dan data senyawa PubChem dengan catatan pengamatan.',
      href: '#eksplorasi',
      icon: 'atom',
    },
  ].filter((r) => `${r.title} ${r.description}`.toLowerCase().includes(query.toLowerCase().trim()));

  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Lewati ke konten utama
      </a>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Tutup menu navigasi"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`} id="app-navigation">
        <a className="brand" href="#beranda" aria-label="ChemLab beranda">
          <span className="brand-mark">
            <Icon name="flask" size={26} />
          </span>
          <span>
            ChemLab<span className="brand-period">.</span>
            <small>RUANG EKSPLORASI KIMIA</small>
          </span>
        </a>
        <button
          className="sidebar-close icon-button"
          aria-label="Tutup navigasi"
          onClick={() => setMenuOpen(false)}
        >
          <Icon name="close" />
        </button>
        <div className="sidebar-label">RUANG BELAJAR</div>
        <nav aria-label="Navigasi utama">
          {navigation.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-current={page === n.id ? 'page' : undefined}>
              <Icon name={n.icon} size={20} />
              <span>{n.label}</span>
              {n.id === 'materi' && <small>01</small>}
              {page === n.id && <span className="nav-indicator" />}
            </a>
          ))}
        </nav>
        <div className="sidebar-label teacher-label">UNTUK PENGAJAR</div>
        <nav aria-label="Navigasi pengajar">
          <a href="#guru" aria-current={page === 'guru' ? 'page' : undefined}>
            <Icon name="teacher" size={21} />
            <span>Panel guru</span>
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-invitation">
            <span className="sidebar-orbit">
              <Icon name="atom" size={31} />
            </span>
            <h3>
              Mulai dari
              <br />
              rasa ingin tahu.
            </h3>
            <p>
              Tak perlu tahu semuanya
              <br />
              untuk mulai belajar.
            </p>
            <button onClick={() => setDialog('help')}>
              Kenali ruang belajarmu
              <Icon name="up" size={16} />
            </button>
          </div>
          <button className="sidebar-help" onClick={() => setDialog('help')}>
            <Icon name="help" size={18} />
            Panduan belajar
            <Icon name="up" size={15} />
          </button>
          <a
            className="guest-profile account-profile-link"
            href={user ? '#akun' : '#masuk'}
            aria-label={user ? 'Kelola akun saya' : 'Masuk ke akun'}
          >
            <span className="guest-avatar">
              {(user?.displayName || 'P').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{user?.displayName || 'Penjelajah kimia'}</strong>
              <span>{user ? 'Kelola akun' : 'Masuk atau buat akun'}</span>
            </div>
            <Icon name="next" size={15} />
          </a>
        </div>
      </aside>
      <div className="workspace" inert={menuOpen ? true : undefined}>
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Buka navigasi"
            aria-expanded={menuOpen}
            aria-controls="app-navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumbs">
            <span>Ruang belajar</span>
            <Icon name="next" size={14} />
            <strong>{pageLabel}</strong>
          </div>
          <button
            className="global-search"
            aria-label="Cari konsep atau materi"
            onClick={() => {
              setQuery('');
              setDialog('search');
            }}
          >
            <Icon name="search" size={17} />
            <span>Cari konsep atau materi…</span>
            <kbd>/</kbd>
          </button>
          <span className="topbar-divider" />
          <span className="topbar-tag">
            <span className="tiny-dot" />
            Asam & basa
          </span>
          <a
            className="topbar-account"
            href={user ? '#akun' : '#masuk'}
            aria-label={user ? 'Buka akun saya' : 'Masuk ke akun'}
          >
            {user ? (
              <span className="topbar-avatar">
                {(user.displayName || 'P').slice(0, 1).toUpperCase()}
              </span>
            ) : (
              <>
                <Icon name="next" size={15} />
                <span>Masuk</span>
              </>
            )}
          </a>
        </header>
        <main id="main-content" ref={mainRef} tabIndex="-1" className="main-content">
          {authError && (
            <p className="auth-error" role="alert">
              {authError}
            </p>
          )}
          {storageWarning && (
            <div className="storage-warning" role="status">
              <Icon name="help" size={19} />
              <p>{storageWarning}</p>
              <button
                className="icon-button"
                aria-label="Tutup informasi penyimpanan"
                onClick={() => setStorageWarning('')}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
          {page === 'beranda' ? (
            <Home progress={progress} setPh={setPh} />
          ) : page === 'materi' ? (
            <Materials
              key={lessonId || 'list'}
              lessonId={lessonId}
              progress={progress}
              completeLesson={completeLesson}
            />
          ) : page === 'laboratorium' ? (
            <Laboratory progress={progress} setPh={setPh} markLab={markLab} />
          ) : page === 'kuis' ? (
            <Quiz
              progress={progress}
              updateAnswer={updateAnswer}
              submitQuiz={submitQuiz}
              newAttempt={() => setProgress((p) => ({ ...p, draft: createDraft('practice') }))}
              storageOk={storageOk}
            />
          ) : page === 'eksplorasi' ? (
            <Exploration
              key={lessonId || 'phet'}
              activityId={lessonId}
              progress={progress}
              updateActivity={updateActivity}
              storageOk={storageOk}
            />
          ) : page === 'progres' ? (
            <Progress
              progress={progress}
              requestReset={() => setDialog('reset')}
              storageOk={storageOk}
            />
          ) : page === 'guru' ? (
            <Teacher />
          ) : page === 'asesmen' ? (
            <ChapterAssessment
              key={lessonId || 'current'}
              progress={progress}
              resultId={lessonId}
              startAttempt={startAssessment}
              updateAnswer={updateAssessmentAnswer}
              updatePosition={updateAssessmentPosition}
              submitAttempt={submitAssessment}
              storageOk={storageOk}
            />
          ) : ['masuk', 'daftar', 'lupa-password'].includes(page) ? (
            <AuthPages key={page} mode={page} />
          ) : page === 'akun' ? (
            <Account />
          ) : page === 'tindakan-akun' ? (
            <EmailAction key={route} />
          ) : (
            <section className="empty-state">
              <Icon name="search" size={40} />
              <h1>Halaman belum ditemukan.</h1>
              <p>Kembali ke jalur belajar dan lanjutkan eksplorasimu.</p>
              <a href="#beranda" className="button primary">
                Ke beranda
                <Icon name="arrow" size={16} />
              </a>
            </section>
          )}
        </main>
        <footer className="footer">
          <span>
            ChemLab<span className="brand-period">.</span>
            <span className="footer-separator">/</span>Ruang untuk bertanya, tempat untuk memahami.
          </span>
          <span>© 2026 ChemLab</span>
        </footer>
      </div>
      <div className="sr-only" role="status">
        {announcement}
      </div>
      {dialog === 'search' && (
        <Dialog title="Temukan konsep" onClose={() => setDialog(null)}>
          <label className="search-field dialog-search">
            <Icon name="search" size={19} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Coba: pH, konsentrasi, netralisasi…"
              aria-label="Cari konsep atau materi"
            />
          </label>
          <div className="search-results">
            {results.length ? (
              results.map((r) => (
                <a key={r.href} href={r.href} onClick={() => setDialog(null)}>
                  <span className="result-icon">
                    <Icon name={r.icon} />
                  </span>
                  <div>
                    <strong>{r.title}</strong>
                    <p>{r.description}</p>
                  </div>
                  <Icon name="next" size={17} />
                </a>
              ))
            ) : (
              <p className="search-empty">
                Belum ada hasil untuk “{query}”. Coba kata “pH” atau “asam”.
              </p>
            )}
          </div>
          <p className="caption">Tekan Esc untuk kembali belajar.</p>
        </Dialog>
      )}
      {dialog === 'help' && (
        <Dialog title="Selamat datang di ChemLab." onClose={() => setDialog(null)}>
          <p className="dialog-description">
            Kenali asam, basa, dan pH melalui materi singkat, eksplorasi larutan, dan latihan yang
            membantumu memahami setiap konsep.
          </p>
          <ol className="guide-steps">
            <li>
              <strong>Kenali pemahaman awal.</strong>
              <p>
                Kuis diagnostik bisa dikerjakan sebelum materi. Pembahasan baru terbuka setelah
                dikumpulkan.
              </p>
            </li>
            <li>
              <strong>Baca, eksplorasi, hubungkan.</strong>
              <p>
                Pelajari tiga bagian materi, tandai sudah dipelajari, lalu mainkan laboratorium pH.
              </p>
            </li>
            <li>
              <strong>Lihat perjalananmu.</strong>
              <p>
                Lihat bagian yang sudah dipelajari dan bandingkan hasil diagnostik awal dengan
                latihan ulang melalui “Progres saya”.
              </p>
            </li>
            <li>
              <strong>Tentukan langkah belajar berikutnya.</strong>
              <p>
                Selesaikan asesmen akhir bab setelah membaca materi. Tinjau hasil per konsep, baca
                pembahasan, dan mulai percobaan baru saat siap.
              </p>
            </li>
          </ol>
          <div className="callout">
            <Icon name="help" />
            <p>
              Progresmu tersimpan di browser ini. Gunakan “Ekspor progres” untuk menyimpan salinan
              sebelum berganti perangkat atau menggunakan perangkat bersama.
            </p>
          </div>
          <button className="button primary full-width" onClick={() => setDialog(null)}>
            Siap bereksplorasi
            <Icon name="arrow" size={17} />
          </button>
        </Dialog>
      )}
      {dialog === 'reset' && (
        <Dialog title="Mulai perjalanan baru?" onClose={() => setDialog(null)}>
          <p className="dialog-description">
            Seluruh progres materi, draf jawaban, eksplorasi, riwayat kuis, dan asesmen akhir bab di
            browser ini akan dihapus.
          </p>
          <p className="dialog-description">
            Ekspor progres terlebih dahulu jika ingin menyimpan catatan. Penghapusan ini tidak dapat
            dibatalkan.
          </p>
          <div className="dialog-actions">
            <button className="button outline" autoFocus onClick={() => setDialog(null)}>
              Batal
            </button>
            <button
              className="button danger-button"
              onClick={() => {
                setProgress(emptyProgress());
                setDialog(null);
                setAnnouncement('Progres belajar telah direset.');
              }}
            >
              Hapus & mulai ulang
              <Icon name="reset" size={16} />
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
