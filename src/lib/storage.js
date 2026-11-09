import { lessons, questions, QUESTION_VERSION } from '../data/chemData.js';
import { makeAttempt } from './chemistry.js';
import { emptyAssessment, restoreAssessment } from './chapterAssessment.js';

export const STORAGE_KEY = 'chemlab:guest:v1';
export function createDraft(kind = 'diagnostic') {
  return {
    id: globalThis.crypto.randomUUID(),
    questionVersion: QUESTION_VERSION,
    kind,
    startedAt: new Date().toISOString(),
    answers: {},
  };
}
export function emptyProgress() {
  return {
    schemaVersion: 1,
    completedLessons: [],
    labVisited: false,
    ph: 7,
    draft: createDraft(),
    attempts: [],
    assessment: emptyAssessment(),
  };
}
const validAnswers = (answers) =>
  answers &&
  typeof answers === 'object' &&
  !Array.isArray(answers) &&
  Object.entries(answers).every(([id, value]) =>
    questions.some(
      (q) => q.id === id && Number.isInteger(value) && value >= 0 && value < q.options.length,
    ),
  );
const validDraft = (draft) =>
  draft &&
  typeof draft.id === 'string' &&
  draft.id.length > 0 &&
  draft.questionVersion === QUESTION_VERSION &&
  ['diagnostic', 'practice'].includes(draft.kind) &&
  Number.isFinite(Date.parse(draft.startedAt)) &&
  validAnswers(draft.answers);

export function loadProgress(storage) {
  const fresh = emptyProgress();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { data: fresh, warning: '' };
    const saved = JSON.parse(raw);
    if (
      saved?.schemaVersion !== 1 ||
      !Array.isArray(saved.completedLessons) ||
      !Array.isArray(saved.attempts) ||
      !validDraft(saved.draft)
    )
      throw new Error('Invalid data');
    const seen = new Set();
    const attempts = saved.attempts.map((a) => {
      if (!validDraft(a) || !Number.isFinite(Date.parse(a.completedAt)) || seen.has(a.id))
        throw new Error('Invalid attempt');
      seen.add(a.id);
      return { ...makeAttempt(a), completedAt: a.completedAt };
    });
    if (
      typeof saved.labVisited !== 'boolean' ||
      !Number.isFinite(saved.ph) ||
      saved.ph < 0 ||
      saved.ph > 14 ||
      saved.completedLessons.some((id) => !lessons.some((l) => l.id === id))
    )
      throw new Error('Invalid progress');
    const assessment = restoreAssessment(saved.assessment);
    return {
      data: {
        ...fresh,
        completedLessons: [...new Set(saved.completedLessons)],
        labVisited: saved.labVisited,
        ph: saved.ph,
        draft: saved.draft,
        attempts,
        assessment: assessment.data,
      },
      warning: assessment.warning,
    };
  } catch {
    return {
      data: fresh,
      warning:
        'Data lokal tidak dapat dibaca. Sesi baru dimulai dan data yang tidak valid diganti dengan catatan baru.',
    };
  }
}

export function saveProgress(storage, data) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
