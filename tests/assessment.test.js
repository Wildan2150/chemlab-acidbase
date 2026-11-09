import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assessmentForm,
  assessmentQuestions,
  ASSESSMENT_VERSION,
} from '../src/data/chapterAssessment.js';
import {
  answerComplete,
  createAssessmentDraft,
  emptyAssessment,
  gradeAssessment,
  makeAssessmentAttempt,
  parseDecimal,
  restoreAssessment,
  submitChapterAssessment,
  unansweredQuestions,
} from '../src/lib/chapterAssessment.js';
import { emptyProgress, loadProgress, saveProgress } from '../src/lib/storage.js';
import { lessons } from '../src/data/chemData.js';

const correctAnswers = () =>
  Object.fromEntries(
    assessmentQuestions.map((q) => [
      q.id,
      q.kind === 'choice' ? q.correct : q.expected.toFixed(2).replace('.', ','),
    ]),
  );
const completedDraft = () => ({ ...createAssessmentDraft(), answers: correctAnswers() });
const memory = () => ({
  value: null,
  getItem() {
    return this.value;
  },
  setItem(key, value) {
    this.value = value;
  },
});

test('assessment covers the three readings with 9 choice and 6 numeric items', () => {
  assert.equal(assessmentQuestions.length, 15);
  assert.equal(new Set(assessmentQuestions.map((q) => q.id)).size, 15);
  assert.equal(assessmentQuestions.filter((q) => q.kind === 'choice').length, 9);
  assert.equal(assessmentQuestions.filter((q) => q.kind === 'numeric').length, 6);
  for (const domain of assessmentForm.domains) {
    assert.equal(assessmentQuestions.filter((q) => q.domain === domain.id).length, 5);
    assert.ok(lessons.some((lesson) => lesson.id === domain.lessonId));
  }
});
test('numeric references agree with independent chemistry calculations', () => {
  const ka = 2e-5,
    c = 0.05;
  const expected = {
    b2: -Math.log10(0.004),
    b3: 14 + Math.log10(0.0002),
    b4: -Math.log10((-ka + Math.sqrt(ka * ka + 4 * ka * c)) / 2),
    b5: -Math.log10((2e-8 + Math.sqrt(4e-16 + 4e-14)) / 2),
    c1: -Math.log10((0.03 * 0.1 - 0.02 * 0.1) / 0.05),
    c3: 4.76 + Math.log10(0.012 / 0.018),
  };
  for (const question of assessmentQuestions.filter((q) => q.kind === 'numeric'))
    assert.ok(Math.abs(question.expected - expected[question.id]) < 1e-8, question.id);
});
test('decimal parser accepts comma, point and zero but rejects misleading numeric formats', () => {
  assert.equal(parseDecimal(' 2,40 '), 2.4);
  assert.equal(parseDecimal('10.30'), 10.3);
  assert.equal(parseDecimal('0'), 0);
  assert.equal(parseDecimal('-.25'), -0.25);
  for (const value of ['', ' ', '2,4.0', '2 pH', '1e2', '0x10', 'NaN', 'Infinity', 2.4])
    assert.equal(parseDecimal(value), null);
});
test('grading respects tolerance, awards equal points and counts filled zero', () => {
  const answers = correctAnswers();
  const all = gradeAssessment(answers);
  assert.equal(all.score, 100);
  assert.equal(all.correctCount, 15);
  assert.ok(all.domains.every((d) => d.correct === 5 && d.total === 5));
  const numeric = assessmentQuestions.find((q) => q.id === 'b2');
  answers.b2 = String(numeric.expected + numeric.tolerance);
  assert.equal(gradeAssessment(answers).score, 100);
  answers.b2 = String(numeric.expected + numeric.tolerance + 0.001);
  assert.equal(gradeAssessment(answers).correctCount, 14);
  answers.b2 = '0';
  assert.equal(answerComplete(numeric, answers.b2), true);
  assert.equal(unansweredQuestions(answers).length, 0);
});
test('submission rejects incomplete or invalid answers and does not duplicate an ID', () => {
  const draft = createAssessmentDraft();
  assert.throws(() => makeAssessmentAttempt(draft));
  draft.answers = correctAnswers();
  draft.answers.b2 = 'not a number';
  assert.throws(() => makeAssessmentAttempt(draft));
  draft.answers.b2 = '2,40';
  const state = { draft, attempts: [] };
  const submitted = submitChapterAssessment(state);
  assert.equal(submitted.attempts.length, 1);
  assert.strictEqual(submitChapterAssessment(submitted), submitted);
  assert.equal(state.attempts.length, 0);
  const first = submitted.attempts[0];
  draft.answers.a1 = 0;
  assert.equal(first.answers.a1, 2);
  assert.equal(first.score, 100);
  assert.notStrictEqual(first.form, assessmentForm);
  assert.notStrictEqual(first.form.questions, assessmentQuestions);
});
test('restored results use the saved instrument and recalculate a tampered score', () => {
  const draft = completedDraft();
  const attempt = makeAssessmentAttempt(draft);
  attempt.version = 'archived-assessment-v0';
  attempt.form.version = attempt.version;
  attempt.form.questions[0].correct = 0;
  attempt.score = 999;
  const restored = restoreAssessment({ draft: null, attempts: [attempt] });
  assert.equal(restored.warning, '');
  assert.equal(restored.data.attempts[0].score, 93);
  assert.equal(restored.data.attempts[0].version, 'archived-assessment-v0');
  assert.equal(assessmentQuestions[0].correct, 2);
});
test('legacy study data migrates without resetting diagnostic or reading progress', () => {
  const original = emptyProgress();
  original.completedLessons = ['kenali', 'skala'];
  original.draft.answers.q1 = 1;
  delete original.assessment;
  const storage = memory();
  saveProgress(storage, original);
  const restored = loadProgress(storage);
  assert.equal(restored.warning, '');
  assert.deepEqual(restored.data.completedLessons, ['kenali', 'skala']);
  assert.equal(restored.data.draft.answers.q1, 1);
  assert.deepEqual(restored.data.assessment, emptyAssessment());
});
test('malformed assessment restores valid results without resetting the learning module', () => {
  const original = emptyProgress();
  original.completedLessons = ['kehidupan'];
  original.draft.answers.q2 = 2;
  original.assessment = {
    draft: { version: 'unsupported' },
    attempts: [makeAssessmentAttempt(completedDraft()), { id: 'broken' }],
  };
  const storage = memory();
  saveProgress(storage, original);
  const restored = loadProgress(storage);
  assert.ok(restored.warning);
  assert.deepEqual(restored.data.completedLessons, ['kehidupan']);
  assert.equal(restored.data.draft.answers.q2, 2);
  assert.equal(restored.data.assessment.attempts.length, 1);
  assert.equal(restored.data.assessment.draft, null);
});
test('draft position and decimal text survive reload; reset clears assessment only through fresh state', () => {
  const original = emptyProgress();
  const draft = createAssessmentDraft();
  draft.position = 6;
  draft.answers.b2 = '2,';
  original.assessment = { draft, attempts: [] };
  const storage = memory();
  saveProgress(storage, original);
  const restored = loadProgress(storage);
  assert.equal(restored.warning, '');
  assert.equal(restored.data.assessment.draft.id, draft.id);
  assert.equal(restored.data.assessment.draft.position, 6);
  assert.equal(restored.data.assessment.draft.answers.b2, '2,');
  assert.equal(unansweredQuestions(restored.data.assessment.draft.answers).length, 15);
  assert.deepEqual(emptyProgress().assessment, emptyAssessment());
  assert.equal(restored.data.assessment.draft.version, ASSESSMENT_VERSION);
});
