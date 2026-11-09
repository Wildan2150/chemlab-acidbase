import { useEffect, useRef, useState } from 'react';
import { questions } from '../data/chemData.js';
import { Icon } from '../components/Visuals.jsx';

export function AttemptReview({ attempt }) {
  return (
    <div className="answer-review">
      {questions.map((q, i) => {
        const selected = attempt.answers[q.id];
        const correct = selected === q.correct;
        return (
          <section className={`review-item ${correct ? 'correct' : 'incorrect'}`} key={q.id}>
            <div className="review-heading">
              <span>
                SOAL {i + 1} · {q.concept}
              </span>
              <span>
                <Icon name={correct ? 'done' : 'close'} size={16} />
                {correct ? 'Tepat' : 'Perlu ditinjau'}
              </span>
            </div>
            <h3>{q.text}</h3>
            <p>
              Jawabanmu: <strong>{q.options[selected]}</strong>
            </p>
            {!correct && (
              <p>
                Jawaban tepat: <strong>{q.options[q.correct]}</strong>
              </p>
            )}
            <div className="review-explanation">{q.explanation}</div>
            {!correct && (
              <p className="follow-up">
                <Icon name="bulb" size={16} />
                {q.followUp}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function Quiz({ progress, updateAnswer, submitQuiz, newAttempt, storageOk }) {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  const draft = progress.draft;
  const submitted = progress.attempts.find((a) => a.id === draft.id);
  const questionRef = useRef(null);
  useEffect(() => {
    questionRef.current?.focus({ preventScroll: true });
  }, [step, submitted?.id]);
  const q = questions[step];
  const count = Object.keys(draft.answers).length;
  function finish() {
    const missing = questions.findIndex((item) => draft.answers[item.id] === undefined);
    if (missing !== -1) {
      setStep(missing);
      setMessage('Jawab kelima soal terlebih dahulu. Kamu diarahkan ke soal yang belum dijawab.');
      return;
    }
    submitQuiz();
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (submitted)
    return (
      <>
        <div className="page-heading">
          <span className="eyebrow">SELESAI SATU LANGKAH LAGI</span>
          <h1 ref={questionRef} tabIndex="-1">
            Kenali pemahamanmu.
          </h1>
          <p>Gunakan hasil ini untuk menentukan bagian yang perlu kamu pelajari lagi.</p>
        </div>
        <section className="quiz-result surface">
          <div className="score-circle">
            <strong>{submitted.score}</strong>
            <span>dari 100</span>
          </div>
          <div>
            <span className="eyebrow">
              {submitted.kind === 'diagnostic' ? 'DIAGNOSTIK AWAL' : 'LATIHAN ULANG'}
            </span>
            <h2>
              {submitted.score === 100
                ? 'Konsepnya sudah terhubung!'
                : 'Setiap jawaban membuka jalan belajar.'}
            </h2>
            <p>
              {submitted.score / 20} dari 5 jawaban tepat.{' '}
              {submitted.score === 100
                ? 'Coba jelaskan kembali alasan di balik setiap jawaban dengan kata-katamu sendiri.'
                : 'Baca pembahasan di bawah, lalu coba kembali setelah belajar.'}
            </p>
            <div className="result-actions">
              <button
                className="button primary"
                onClick={() => {
                  newAttempt();
                  setStep(0);
                }}
              >
                <Icon name="reset" size={16} />
                Mulai latihan baru
              </button>
              <a href="#progres" className="text-button">
                Lihat riwayat
                <Icon name="arrow" size={17} />
              </a>
            </div>
          </div>
        </section>
        <div className="section-heading">
          <h2>Jawaban & pembahasan</h2>
          <span className="subtle">Percobaan disimpan terpisah</span>
        </div>
        <AttemptReview attempt={submitted} />
      </>
    );
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">LIMA PERTANYAAN, SATU LANGKAH MEMAHAMI</span>
        <h1>
          {draft.kind === 'diagnostic' ? 'Kuis diagnostik' : 'Latihan ulang'}
          <span className="greeting-dot">.</span>
        </h1>
        <p>Jawab dengan pemahamanmu saat ini. Tidak ada batas waktu.</p>
      </div>
      <div className="quiz-layout">
        <section className="surface quiz-workspace">
          <div className="quiz-progress-heading">
            <span>
              Soal {step + 1} <span className="subtle">dari 5</span>
            </span>
            <span className="save-status">
              <Icon name={storageOk ? 'check' : 'help'} size={15} />
              {storageOk ? 'Draf tersimpan di perangkat' : 'Draf hanya dalam sesi ini'}
            </span>
          </div>
          <div className="quiz-progress-track">
            <span style={{ width: `${count * 20}%` }} />
          </div>
          <div className="question-body" key={q.id}>
            <span className="eyebrow">{q.concept.toUpperCase()}</span>
            <h2 id="question-heading" ref={questionRef} tabIndex="-1">
              {q.text}
            </h2>
            <fieldset className="answer-options">
              <legend className="sr-only">Pilih satu jawaban untuk soal {step + 1}</legend>
              {q.options.map((option, i) => (
                <label
                  className={`answer-option ${draft.answers[q.id] === i ? 'selected' : ''}`}
                  key={option}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={i}
                    checked={draft.answers[q.id] === i}
                    onChange={() => {
                      updateAnswer(q.id, i);
                      setMessage('');
                    }}
                  />
                  <span className="option-letter">{'ABCD'[i]}</span>
                  <span>{option}</span>
                  <span className="radio-mark">
                    {draft.answers[q.id] === i && <Icon name="check" size={13} />}
                  </span>
                </label>
              ))}
            </fieldset>
          </div>
          <p className="form-message" role="status">
            {message}
          </p>
          <div className="quiz-controls">
            <button
              className="text-button"
              disabled={step === 0}
              onClick={() => {
                setStep((s) => s - 1);
                setMessage('');
              }}
            >
              <Icon name="back" size={17} />
              Sebelumnya
            </button>
            {step < 4 ? (
              <button
                className="button primary"
                onClick={() => {
                  setStep((s) => s + 1);
                  setMessage('');
                }}
              >
                Selanjutnya
                <Icon name="arrow" size={17} />
              </button>
            ) : (
              <button className="button primary" onClick={finish}>
                Selesaikan kuis
                <Icon name="check" size={18} />
              </button>
            )}
          </div>
        </section>
        <aside className="surface quiz-map">
          <span className="eyebrow">PETA PERTANYAAN</span>
          <div className="question-map">
            {questions.map((question, i) => (
              <button
                key={question.id}
                className={`${step === i ? 'current' : ''} ${draft.answers[question.id] !== undefined ? 'answered' : ''}`}
                aria-label={`Buka soal ${i + 1}${draft.answers[question.id] !== undefined ? ', sudah dijawab' : ', belum dijawab'}`}
                aria-current={step === i ? 'step' : undefined}
                onClick={() => {
                  setStep(i);
                  setMessage('');
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="map-count">{count} dari 5 soal dijawab</p>
          <div className="quiz-note">
            <Icon name="bulb" size={23} />
            <h3>Jujur pada prosesmu.</h3>
            <p>
              Pembahasan terbuka setelah seluruh jawaban dikumpulkan. Kamu boleh meninjau pilihan
              sebelum menyelesaikan kuis.
            </p>
            <p>Percobaan berikutnya dicatat sebagai latihan baru.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
