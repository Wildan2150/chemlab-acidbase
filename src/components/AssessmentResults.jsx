import { Icon } from './Visuals.jsx';

export function AssessmentHistory({ assessment }) {
  const { draft, attempts } = assessment;
  const active = draft && !attempts.some((attempt) => attempt.id === draft.id);
  return (
    <section className="surface assessment-history">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SETELAH MENYELESAIKAN BACAAN</span>
          <h2>Riwayat asesmen akhir bab</h2>
        </div>
        <a className="small-link" href="#asesmen">
          {active ? 'Lanjutkan draf' : 'Buka asesmen'}
          <Icon name="arrow" size={15} />
        </a>
      </div>
      <p className="caption">Hasil akhir bab dicatat terpisah dari kuis diagnostik awal.</p>
      {attempts.length === 0 ? (
        <p className="assessment-empty">
          {active
            ? 'Draf asesmenmu masih dapat dilanjutkan.'
            : 'Belum ada hasil akhir bab. Mulai saat kamu siap menghubungkan seluruh konsep.'}
        </p>
      ) : (
        <div className="assessment-history-list">
          {[...attempts].reverse().map((attempt, index) => (
            <a key={attempt.id} href={`#asesmen/${attempt.id}`}>
              <span className="history-order">
                {String(attempts.length - index).padStart(2, '0')}
              </span>
              <div>
                <strong>Percobaan {attempts.length - index}</strong>
                <span>
                  {new Intl.DateTimeFormat('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Jakarta',
                  }).format(new Date(attempt.completedAt))}{' '}
                  WIB
                </span>
              </div>
              <span className="assessment-history-score">
                {attempt.score}
                <small> / 100</small>
              </span>
              <Icon name="next" size={17} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export function AssessmentReview({ attempt }) {
  return (
    <div className="assessment-review">
      {attempt.form.questions.map((question, index) => {
        const item = attempt.items.find((item) => item.questionId === question.id);
        const domain = attempt.form.domains.find((domain) => domain.id === question.domain);
        const userAnswer =
          question.kind === 'choice'
            ? question.options[attempt.answers[question.id]]
            : attempt.answers[question.id];
        const correctAnswer =
          question.kind === 'choice'
            ? question.options[question.correct]
            : `${question.expected.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (toleransi ±${question.tolerance.toLocaleString('id-ID')})`;
        return (
          <section
            key={question.id}
            className={`review-item ${item.correct ? 'correct' : 'incorrect'}`}
          >
            <div className="review-heading">
              <span>
                SOAL {index + 1} · {question.topic}
              </span>
              <span>
                <Icon name={item.correct ? 'done' : 'close'} size={16} />
                {item.correct ? 'Tepat' : 'Perlu ditinjau'} · {item.points}/{item.maxPoints}
              </span>
            </div>
            <h3>{question.text}</h3>
            <p>
              Jawabanmu: <strong>{userAnswer}</strong>
            </p>
            {(!item.correct || question.kind === 'numeric') && (
              <p>
                Jawaban acuan: <strong>{correctAnswer}</strong>
              </p>
            )}
            <div className="review-explanation">
              <p>{question.explanation}</p>
              {question.steps && (
                <ol>
                  {question.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
            </div>
            {!item.correct && (
              <p className="follow-up">
                <Icon name="bulb" size={16} />
                {question.followUp}
              </p>
            )}
            <a className="small-link review-reading-link" href={`#materi/${domain.lessonId}`}>
              Baca kembali: {domain.title}
              <Icon name="arrow" size={14} />
            </a>
          </section>
        );
      })}
    </div>
  );
}
