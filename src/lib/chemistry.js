import { questions, QUESTION_VERSION } from '../data/chemData.js';

export function phInfo(value) {
  const ph = Math.min(14, Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 7));
  return {
    ph,
    poh: 14 - ph,
    hydronium: 10 ** -ph,
    hydroxide: 10 ** -(14 - ph),
    label: ph < 7 ? 'Asam' : ph > 7 ? 'Basa' : 'Netral',
    color:
      ph < 3
        ? '#da6a49'
        : ph < 6
          ? '#c69924'
          : ph <= 7
            ? '#48936b'
            : ph < 10
              ? '#378e99'
              : '#8070b8',
  };
}

export function gradeAnswers(answers) {
  return questions.map((q) => ({
    questionId: q.id,
    concept: q.concept,
    selectedIndex: answers[q.id],
    correctIndex: q.correct,
    isCorrect: answers[q.id] === q.correct,
  }));
}

export function makeAttempt(draft) {
  if (
    !questions.every(
      (q) =>
        Number.isInteger(draft.answers[q.id]) &&
        draft.answers[q.id] >= 0 &&
        draft.answers[q.id] < q.options.length,
    )
  )
    throw new Error('Jawab kelima soal sebelum menyelesaikan kuis.');
  const items = gradeAnswers(draft.answers);
  return {
    id: draft.id,
    questionVersion: QUESTION_VERSION,
    kind: draft.kind,
    startedAt: draft.startedAt,
    completedAt: new Date().toISOString(),
    answers: { ...draft.answers },
    items,
    score: items.filter((i) => i.isCorrect).length * 20,
  };
}

export function hclPh(concentration) {
  if (![0.1, 0.01, 0.001].includes(concentration))
    throw new Error('Model HCl hanya untuk 0,1; 0,01; atau 0,001 mol/L.');
  return -Math.log10(concentration);
}
