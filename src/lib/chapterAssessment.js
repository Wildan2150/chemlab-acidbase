import { assessmentForm, ASSESSMENT_VERSION } from '../data/chapterAssessment.js';

export const emptyAssessment = () => ({ draft: null, attempts: [] });
export const createAssessmentDraft = () => ({
  id: globalThis.crypto.randomUUID(),
  version: ASSESSMENT_VERSION,
  startedAt: new Date().toISOString(),
  position: 0,
  answers: {},
});
export function parseDecimal(raw) {
  if (typeof raw !== 'string' || raw.length > 32) return null;
  const value = raw.trim();
  if (!/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(value)) return null;
  const number = Number(value.replace(',', '.'));
  return Number.isFinite(number) ? number : null;
}
export function answerComplete(question, answer) {
  return question.kind === 'choice'
    ? Number.isInteger(answer) && answer >= 0 && answer < question.options.length
    : parseDecimal(answer) !== null;
}
export const unansweredQuestions = (answers, form = assessmentForm) =>
  form.questions.filter((question) => !answerComplete(question, answers?.[question.id]));
export function gradeAssessment(answers, form = assessmentForm) {
  const items = form.questions.map((question) => {
    const answer = answers[question.id];
    const correct =
      answerComplete(question, answer) &&
      (question.kind === 'choice'
        ? answer === question.correct
        : Math.abs(parseDecimal(answer) - question.expected) <= question.tolerance + 1e-10);
    return {
      questionId: question.id,
      domain: question.domain,
      answer,
      correct,
      points: correct ? 1 : 0,
      maxPoints: 1,
    };
  });
  const correctCount = items.filter((item) => item.correct).length;
  return {
    items,
    correctCount,
    total: items.length,
    score: Math.round((correctCount / items.length) * 100),
    domains: form.domains.map((domain) => ({
      id: domain.id,
      title: domain.title,
      lessonId: domain.lessonId,
      correct: items.filter((item) => item.domain === domain.id && item.correct).length,
      total: items.filter((item) => item.domain === domain.id).length,
    })),
  };
}
export function makeAssessmentAttempt(draft) {
  if (!draft || draft.version !== ASSESSMENT_VERSION || unansweredQuestions(draft.answers).length)
    throw new Error('Lengkapi seluruh jawaban sebelum mengumpulkan asesmen.');
  const form = JSON.parse(JSON.stringify(assessmentForm));
  const answers = { ...draft.answers };
  return {
    id: draft.id,
    version: draft.version,
    startedAt: draft.startedAt,
    completedAt: new Date().toISOString(),
    form,
    answers,
    ...gradeAssessment(answers, form),
  };
}
export function submitChapterAssessment(state) {
  if (!state.draft) throw new Error('Mulai asesmen terlebih dahulu.');
  if (state.attempts.some((attempt) => attempt.id === state.draft.id)) return state;
  return { ...state, attempts: [...state.attempts, makeAssessmentAttempt(state.draft)] };
}
const validId = (value) => typeof value === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(value);
const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
function validateForm(form) {
  if (
    !form ||
    typeof form.version !== 'string' ||
    form.version.length > 100 ||
    typeof form.title !== 'string' ||
    form.title.length > 200 ||
    !Array.isArray(form.domains) ||
    !form.domains.length ||
    form.domains.length > 10 ||
    !Array.isArray(form.questions) ||
    !form.questions.length ||
    form.questions.length > 100
  )
    throw new Error('Form tidak valid');
  const domainIds = new Set();
  for (const domain of form.domains) {
    if (
      !validId(domain.id) ||
      domainIds.has(domain.id) ||
      typeof domain.title !== 'string' ||
      domain.title.length > 200 ||
      !['kenali', 'skala', 'kehidupan'].includes(domain.lessonId)
    )
      throw new Error('Domain tidak valid');
    domainIds.add(domain.id);
  }
  const ids = new Set();
  for (const question of form.questions) {
    if (
      !validId(question.id) ||
      ids.has(question.id) ||
      !domainIds.has(question.domain) ||
      !['choice', 'numeric'].includes(question.kind) ||
      typeof question.text !== 'string' ||
      question.text.length > 10000 ||
      typeof question.topic !== 'string' ||
      question.topic.length > 200 ||
      typeof question.explanation !== 'string' ||
      question.explanation.length > 10000 ||
      typeof question.followUp !== 'string' ||
      question.followUp.length > 5000
    )
      throw new Error('Butir tidak valid');
    ids.add(question.id);
    if (
      question.kind === 'choice' &&
      (!Array.isArray(question.options) ||
        question.options.length < 2 ||
        question.options.length > 8 ||
        !question.options.every((option) => typeof option === 'string' && option.length <= 3000) ||
        !Number.isInteger(question.correct) ||
        question.correct < 0 ||
        question.correct >= question.options.length)
    )
      throw new Error('Pilihan tidak valid');
    if (
      question.kind === 'numeric' &&
      (!Number.isFinite(question.expected) ||
        !Number.isFinite(question.tolerance) ||
        question.tolerance <= 0 ||
        question.tolerance > 1)
    )
      throw new Error('Model angka tidak valid');
    if (
      question.steps !== undefined &&
      (!Array.isArray(question.steps) ||
        question.steps.length > 20 ||
        !question.steps.every((step) => typeof step === 'string' && step.length < 3000))
    )
      throw new Error('Pembahasan tidak valid');
  }
  if (
    form.domains.some((domain) => !form.questions.some((question) => question.domain === domain.id))
  )
    throw new Error('Domain tanpa butir');
}
function validateDraft(draft) {
  if (
    !draft ||
    !validId(draft.id) ||
    draft.version !== ASSESSMENT_VERSION ||
    !validDate(draft.startedAt) ||
    !Number.isInteger(draft.position) ||
    draft.position < 0 ||
    draft.position >= assessmentForm.questions.length ||
    !draft.answers ||
    typeof draft.answers !== 'object' ||
    Array.isArray(draft.answers)
  )
    throw new Error('Draf tidak valid');
  for (const [id, answer] of Object.entries(draft.answers)) {
    const question = assessmentForm.questions.find((question) => question.id === id);
    if (
      !question ||
      (question.kind === 'choice'
        ? !answerComplete(question, answer)
        : typeof answer !== 'string' || answer.length > 32)
    )
      throw new Error('Jawaban draf tidak valid');
  }
  return { ...draft, answers: { ...draft.answers } };
}
function restoreAttempt(attempt) {
  if (
    !attempt ||
    !validId(attempt.id) ||
    !validDate(attempt.startedAt) ||
    !validDate(attempt.completedAt) ||
    !attempt.answers ||
    typeof attempt.answers !== 'object' ||
    Array.isArray(attempt.answers)
  )
    throw new Error('Hasil tidak valid');
  validateForm(attempt.form);
  if (
    attempt.version !== attempt.form.version ||
    unansweredQuestions(attempt.answers, attempt.form).length
  )
    throw new Error('Versi atau jawaban hasil tidak valid');
  return { ...attempt, ...gradeAssessment(attempt.answers, attempt.form) };
}
export function restoreAssessment(raw) {
  if (raw === undefined) return { data: emptyAssessment(), warning: '' };
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.attempts))
    return {
      data: emptyAssessment(),
      warning: 'Data asesmen tidak dapat dibaca. Progres materi dan kuis tetap dipulihkan.',
    };
  const attempts = [];
  const seen = new Set();
  let recovered = false;
  for (const attempt of raw.attempts) {
    try {
      const restored = restoreAttempt(attempt);
      if (seen.has(restored.id)) throw new Error('Duplikat');
      seen.add(restored.id);
      attempts.push(restored);
    } catch {
      recovered = true;
    }
  }
  let draft = null;
  if (raw.draft) {
    try {
      draft = validateDraft(raw.draft);
    } catch {
      recovered = true;
    }
  }
  return {
    data: { draft, attempts },
    warning: recovered
      ? 'Sebagian data asesmen tidak sesuai versi atau format. Hasil valid, progres materi, dan kuis tetap dipulihkan.'
      : '',
  };
}
