import { useEffect, useRef, useState } from 'react';
import {
  assessmentDomains,
  assessmentQuestions,
  ASSESSMENT_VERSION,
} from '../data/chapterAssessment.js';
import { answerComplete, parseDecimal, unansweredQuestions } from '../lib/chapterAssessment.js';
import { Icon } from '../components/Visuals.jsx';
import Dialog from '../components/Dialog.jsx';
import ContextualHint from '../components/ContextualHint.jsx';
import { useContextualHelp } from '../contexts/ContextualHelpContext.jsx';
import { AssessmentHistory, AssessmentReview } from '../components/AssessmentResults.jsx';
import { downloadJson, formatDate } from './Progress.jsx';

export default function ChapterAssessment({
  progress,
  resultId,
  startAttempt,
  updateAnswer,
  updatePosition,
  submitAttempt,
  storageOk,
}) {
  const help = useContextualHelp();
  const assessment = progress.assessment;
  const draft = assessment.draft;
  const requested = assessment.attempts.find((attempt) => attempt.id === resultId);
  const submitted = requested || assessment.attempts.find((attempt) => attempt.id === draft?.id);
  const active = draft && !assessment.attempts.some((attempt) => attempt.id === draft.id);
  const [review, setReview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const focusRef = useRef(null);
  const step = draft?.position || 0;
  useEffect(() => {
    help.resolve('assessment');
  }, [draft?.answers, help.resolve]);
  useEffect(() => {
    focusRef.current?.focus({ preventScroll: true });
  }, [step, review, submitted?.id, Boolean(draft)]);
  function begin() {
    setReview(false);
    setMessage('');
    startAttempt();
    window.location.hash = 'asesmen';
  }
  function chooseQuestion(index) {
    updatePosition(index);
    setReview(false);
    setMessage('');
    window.scrollTo({ top: 0 });
  }
  function confirmSubmission() {
    const missing = unansweredQuestions(draft.answers);
    if (missing.length) {
      help.signal('assessment');
      updatePosition(assessmentQuestions.findIndex((question) => question.id === missing[0].id));
      setReview(false);
      setMessage(
        `Masih ada ${missing.length} jawaban yang perlu dilengkapi. Periksa soal ini terlebih dahulu.`,
      );
      return;
    }
    setConfirming(true);
  }
  if (resultId && !requested)
    return (
      <section className="empty-state surface">
        <Icon name="search" size={35} />
        <h1>Hasil asesmen belum ditemukan.</h1>
        <p>Hasil tersimpan pada browser tempat kamu mengerjakan asesmen.</p>
        <a className="button primary" href="#asesmen">
          Kembali ke asesmen
          <Icon name="arrow" size={16} />
        </a>
      </section>
    );
  if (submitted) {
    const number = assessment.attempts.findIndex((attempt) => attempt.id === submitted.id) + 1;
    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">ASESMEN AKHIR BAB · PERCOBAAN {number}</span>
          <h1 ref={focusRef} tabIndex="-1">
            Lihat kaitan antar-konsep.
          </h1>
          <p>Gunakan hasil dan pembahasan untuk menentukan langkah belajar selanjutnya.</p>
        </div>
        <section className="surface assessment-result">
          <div className="score-circle">
            <strong>{submitted.score}</strong>
            <span>dari 100</span>
          </div>
          <div>
            <span className="eyebrow">
              {submitted.correctCount} DARI {submitted.total} JAWABAN TEPAT
            </span>
            <h2>
              {submitted.score === 100
                ? 'Seluruh jawabanmu sudah tepat.'
                : 'Temukan bagian yang perlu diperkuat.'}
            </h2>
            <p>
              {formatDate(submitted.completedAt)} · {submitted.version}
            </p>
            <p>
              Setiap soal bernilai satu poin. Hasil ini membantu refleksi belajar; gunakan alasan
              jawaban dan bukti lain untuk menilai pemahaman.
            </p>
            <div className="result-actions">
              {active ? (
                <a className="button primary" href="#asesmen">
                  Lanjutkan draf saat ini
                  <Icon name="arrow" size={16} />
                </a>
              ) : (
                <button className="button primary" onClick={begin}>
                  <Icon name="reset" size={16} />
                  Mulai percobaan baru
                </button>
              )}
              <button
                className="button outline"
                onClick={() =>
                  downloadJson(
                    {
                      type: 'chapter-assessment',
                      exportedAt: new Date().toISOString(),
                      attempt: submitted,
                    },
                    `chemlab-asesmen-${number}.json`,
                  )
                }
              >
                <Icon name="download" size={16} />
                Ekspor hasil
              </button>
            </div>
          </div>
        </section>
        <section className="assessment-domains" aria-label="Hasil per konsep">
          {submitted.domains.map((domain) => (
            <article className="surface" key={domain.id}>
              <span className="eyebrow">
                {domain.correct} / {domain.total} TEPAT
              </span>
              <h2>{domain.title}</h2>
              <div
                className="domain-track"
                role="img"
                aria-label={`${domain.correct} dari ${domain.total} jawaban tepat`}
              >
                <span style={{ width: `${(domain.correct / domain.total) * 100}%` }} />
              </div>
              <p>
                {domain.correct === domain.total
                  ? 'Coba jelaskan kembali alasan jawaban dengan kata-katamu sendiri.'
                  : domain.correct >= domain.total / 2
                    ? 'Periksa pembahasan pada butir yang belum tepat.'
                    : 'Tinjau kembali bacaan, lalu kerjakan ulang dengan alasan yang lebih jelas.'}
              </p>
              <a className="small-link" href={`#materi/${domain.lessonId}`}>
                Tinjau bacaan
                <Icon name="arrow" size={14} />
              </a>
            </article>
          ))}
        </section>
        <div className="section-heading assessment-review-title">
          <h2>Jawaban & pembahasan akhir bab</h2>
          <span className="subtle">Jawaban percobaan ini sudah dikunci</span>
        </div>
        <AssessmentReview attempt={submitted} />
        <AssessmentHistory assessment={assessment} />
      </>
    );
  }
  if (!draft)
    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">ASAM & BASA · ASESMEN AKHIR BAB</span>
          <h1>
            Satukan pemahamanmu<span className="greeting-dot">.</span>
          </h1>
          <p>Hubungkan teori, perhitungan, dan penerapan setelah membaca seluruh bab.</p>
        </div>
        <section className="assessment-intro">
          <div>
            <span className="eyebrow">SELESAIKAN DENGAN PEMAHAMANMU SAAT INI</span>
            <h2>
              Dari mengenali konsep
              <br />
              hingga memberi alasan.
            </h2>
            <p>
              Lima belas soal untuk melihat hubungan antarbagian yang sudah kamu pelajari. Kamu
              dapat meninjau dan mengubah pilihan sebelum mengumpulkan.
            </p>
            <button className="button primary" onClick={begin}>
              Mulai asesmen
              <Icon name="arrow" size={17} />
            </button>
            <div className="assessment-meta">
              <span>
                <Icon name="quiz" size={16} />9 pilihan ganda
              </span>
              <span>
                <Icon name="chart" size={16} />6 jawaban angka
              </span>
              <span>
                <Icon name="book" size={16} />3 cakupan materi
              </span>
            </div>
          </div>
          <aside>
            <span className="assessment-large-number">
              15<span>SOAL TERARAH</span>
            </span>
            <p>
              Disarankan ±35 menit.
              <br />
              Tidak ada batas waktu.
            </p>
            <p>
              <strong>{progress.completedLessons.length}/3 bacaan</strong> ditandai selesai.
            </p>
            <a className="small-link" href="#materi">
              Tinjau materi dahulu
              <Icon name="arrow" size={14} />
            </a>
          </aside>
        </section>
        <section className="assessment-domains" aria-label="Cakupan asesmen">
          {assessmentDomains.map((domain, index) => (
            <article className="surface" key={domain.id}>
              <span className="eyebrow">BAGIAN {String(index + 1).padStart(2, '0')} · 5 SOAL</span>
              <h2>{domain.title}</h2>
              <p>{domain.description}</p>
              <a className="small-link" href={`#materi/${domain.lessonId}`}>
                Buka bacaan
                <Icon name="arrow" size={14} />
              </a>
            </article>
          ))}
        </section>
        <div className="assessment-instructions surface">
          <Icon name="bulb" size={24} />
          <div>
            <h2>Sebelum mulai</h2>
            <ul>
              <li>
                Pilih satu jawaban pada pilihan ganda. Untuk hitungan, gunakan kalkulator jika
                diperlukan.
              </li>
              <li>
                Masukkan jawaban pH sebagai angka dengan koma atau titik desimal. Pembulatan dua
                desimal diterima dengan toleransi ±0,03.
              </li>
              <li>
                Draf tersimpan saat diisi. Pembahasan baru dibuka setelah kamu mengonfirmasi
                pengumpulan.
              </li>
              <li>Percobaan ulang dicatat terpisah dari hasil awal dan dari kuis diagnostik.</li>
            </ul>
          </div>
        </div>
        {assessment.attempts.length > 0 && <AssessmentHistory assessment={assessment} />}
      </>
    );
  const question = assessmentQuestions[step];
  const count = assessmentQuestions.length - unansweredQuestions(draft.answers).length;
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">ASESMEN AKHIR BAB · ASAM & BASA</span>
        <h1 ref={focusRef} tabIndex="-1">
          {review ? 'Tinjau sebelum mengumpulkan.' : 'Hubungkan konsep, tentukan jawaban.'}
        </h1>
        <p>
          {review
            ? 'Periksa jawaban dan kembali ke soal yang ingin kamu ubah.'
            : 'Kerjakan dengan ritmemu. Jawaban dapat diubah sebelum dikumpulkan.'}
        </p>
      </div>
      {review ? (
        <section className="surface assessment-submission-review">
          <div className="section-heading">
            <h2>Ringkasan jawaban</h2>
            <span className="subtle">{count} / 15 lengkap</span>
          </div>
          {assessmentQuestions.map((item, index) => {
            const answer = draft.answers[item.id];
            const complete = answerComplete(item, answer);
            return (
              <button
                className="submission-row"
                key={item.id}
                onClick={() => chooseQuestion(index)}
              >
                <span className={`step-circle ${complete ? 'is-done' : ''}`}>{index + 1}</span>
                <span>
                  <strong>{item.topic}</strong>
                  <small>
                    {complete
                      ? item.kind === 'choice'
                        ? item.options[answer]
                        : `pH ${answer}`
                      : answer
                        ? 'Perlu diperbaiki'
                        : 'Belum diisi'}
                  </small>
                </span>
                <Icon name={complete ? 'check' : 'next'} size={16} />
              </button>
            );
          })}
          <div className="assessment-review-actions">
            <button className="button outline" onClick={() => setReview(false)}>
              <Icon name="back" size={16} />
              Kembali mengerjakan
            </button>
            <button className="button primary" onClick={confirmSubmission}>
              Kumpulkan asesmen
              <Icon name="check" size={16} />
            </button>
          </div>
        </section>
      ) : (
        <div className="quiz-layout assessment-workspace">
          <section className="surface quiz-workspace">
            <div className="quiz-progress-heading">
              <span>
                Soal {step + 1} <span className="subtle">dari 15</span>
              </span>
              <span className="save-status">
                <Icon name={storageOk ? 'check' : 'help'} size={15} />
                {storageOk ? 'Draf tersimpan di perangkat' : 'Draf hanya dalam sesi ini'}
              </span>
            </div>
            <div className="quiz-progress-track">
              <span style={{ width: `${(count / assessmentQuestions.length) * 100}%` }} />
            </div>
            <div className="question-body" key={question.id}>
              <span className="eyebrow">
                {assessmentDomains
                  .find((domain) => domain.id === question.domain)
                  .title.toUpperCase()}
              </span>
              <h2 id="assessment-question" ref={focusRef} tabIndex="-1">
                {question.text}
              </h2>
              {question.kind === 'choice' ? (
                <fieldset className="answer-options">
                  <legend className="sr-only">
                    Pilih satu jawaban untuk soal asesmen {step + 1}
                  </legend>
                  {question.options.map((option, index) => (
                    <label
                      key={option}
                      className={`answer-option ${draft.answers[question.id] === index ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={draft.answers[question.id] === index}
                        onChange={() => {
                          updateAnswer(question.id, index);
                          setMessage('');
                        }}
                      />
                      <span className="option-letter">{'ABCD'[index]}</span>
                      <span>{option}</span>
                      <span className="radio-mark">
                        {draft.answers[question.id] === index && <Icon name="check" size={13} />}
                      </span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <div className="numeric-answer">
                  <label htmlFor="assessment-numeric">Jawaban pH</label>
                  <input
                    id="assessment-numeric"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    maxLength="32"
                    value={draft.answers[question.id] || ''}
                    onChange={(event) => {
                      updateAnswer(question.id, event.target.value);
                      setMessage('');
                    }}
                    aria-describedby="assessment-number-hint"
                    aria-invalid={Boolean(
                      draft.answers[question.id] &&
                      parseDecimal(draft.answers[question.id]) === null,
                    )}
                  />
                  <p id="assessment-number-hint">
                    Masukkan angka tanpa satuan; koma atau titik desimal diterima. Contoh format:
                    2,40. Toleransi ±0,03.
                  </p>
                  {draft.answers[question.id] &&
                    parseDecimal(draft.answers[question.id]) === null && (
                      <p className="numeric-error" role="status">
                        Gunakan angka desimal, tanpa teks atau satuan.
                      </p>
                    )}
                </div>
              )}
            </div>
            <p className="form-message" role="status">
              {message}
            </p>
            <ContextualHint
              topic="assessment"
              onAction={() => focusRef.current?.focus()}
              onReturnFocus={() => focusRef.current?.focus()}
            />
            <div className="quiz-controls">
              <button
                className="text-button"
                disabled={step === 0}
                onClick={() => chooseQuestion(step - 1)}
              >
                <Icon name="back" size={16} />
                Sebelumnya
              </button>
              {step < assessmentQuestions.length - 1 ? (
                <button className="button primary" onClick={() => chooseQuestion(step + 1)}>
                  Selanjutnya
                  <Icon name="arrow" size={16} />
                </button>
              ) : (
                <button
                  className="button primary"
                  onClick={() => {
                    setReview(true);
                    setMessage('');
                    window.scrollTo({ top: 0 });
                  }}
                >
                  Tinjau jawaban
                  <Icon name="next" size={16} />
                </button>
              )}
            </div>
          </section>
          <aside className="surface quiz-map assessment-map">
            <span className="eyebrow">PETA PERTANYAAN</span>
            <div className="question-map">
              {assessmentQuestions.map((item, index) => (
                <button
                  key={item.id}
                  className={`${step === index ? 'current' : ''} ${answerComplete(item, draft.answers[item.id]) ? 'answered' : ''}`}
                  aria-current={step === index ? 'step' : undefined}
                  aria-label={`Buka soal asesmen ${index + 1}${answerComplete(item, draft.answers[item.id]) ? ', sudah diisi' : ', belum lengkap'}`}
                  onClick={() => chooseQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <p className="map-count">{count} dari 15 jawaban lengkap</p>
            <button
              className="button outline full-width"
              onClick={() => {
                setReview(true);
                setMessage('');
                window.scrollTo({ top: 0 });
              }}
            >
              Tinjau semua jawaban
            </button>
            <div className="quiz-note">
              <Icon name="bulb" size={23} />
              <h3>Periksa alasanmu.</h3>
              <p>
                Hasil dan pembahasan baru muncul setelah seluruh jawaban lengkap dan pengumpulan
                dikonfirmasi.
              </p>
              <p>Setiap soal bernilai satu poin; tidak ada pengurangan untuk jawaban salah.</p>
            </div>
          </aside>
        </div>
      )}
      {confirming && (
        <Dialog title="Kumpulkan jawaban akhir bab?" onClose={() => setConfirming(false)}>
          <p className="dialog-description">
            Kelima belas jawaban akan dikunci. Setelah dikumpulkan, kamu dapat melihat skor, hasil
            per konsep, dan pembahasan. Latihan berikutnya akan dicatat sebagai percobaan baru.
          </p>
          <div className="dialog-actions">
            <button className="button outline" autoFocus onClick={() => setConfirming(false)}>
              Periksa lagi
            </button>
            <button
              className="button primary"
              onClick={() => {
                submitAttempt();
                setConfirming(false);
                setReview(false);
                window.scrollTo({ top: 0 });
              }}
            >
              Kumpulkan jawaban
              <Icon name="check" size={16} />
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
