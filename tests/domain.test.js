import test from 'node:test';
import assert from 'node:assert/strict';
import { phInfo, hclPh, makeAttempt } from '../src/lib/chemistry.js';
import {
  createDraft,
  emptyProgress,
  loadProgress,
  saveProgress,
  STORAGE_KEY,
  accountProgressKey,
} from '../src/lib/storage.js';
import { demoStudents, QUESTION_VERSION } from '../src/data/chemData.js';

const memoryStorage = (value) => ({
  value,
  getItem() {
    return this.value;
  },
  setItem(key, next) {
    assert.equal(key, STORAGE_KEY);
    this.value = next;
  },
});
const answers = { q1: 1, q2: 2, q3: 0, q4: 3, q5: 2 };

test('pH reference points respect ion concentrations and 25 °C neutrality', () => {
  assert.equal(phInfo(3).hydronium, 0.001);
  assert.equal(phInfo(5).label, 'Asam');
  assert.equal(phInfo(7).label, 'Netral');
  assert.equal(phInfo(7).hydronium, phInfo(7).hydroxide);
  assert.equal(phInfo(12).label, 'Basa');
  assert.equal(phInfo(12).poh, 2);
  assert.ok(Math.abs(phInfo(3).hydronium / phInfo(5).hydronium - 100) < 1e-10);
  assert.equal(phInfo(-1).ph, 0);
  assert.equal(phInfo(Infinity).ph, 7);
});
test('HCl model accepts only its stated concentration range', () => {
  assert.equal(hclPh(0.1), 1);
  assert.equal(hclPh(0.01), 2);
  assert.equal(hclPh(0.001), 3);
  for (const c of [0, -1, 1e-8, NaN]) assert.throws(() => hclPh(c));
});
test('submission requires every answer and freezes an independent copy', () => {
  const draft = createDraft();
  assert.throws(() => makeAttempt(draft));
  draft.answers = { ...answers };
  const attempt = makeAttempt(draft);
  assert.equal(attempt.score, 100);
  assert.equal(attempt.items.length, 5);
  assert.equal(attempt.questionVersion, QUESTION_VERSION);
  draft.answers.q1 = 0;
  assert.equal(attempt.answers.q1, 1);
  assert.equal(makeAttempt(draft).score, 80);
  assert.notEqual(createDraft('practice').id, draft.id);
});
test('local draft, attempt ID, history and progress survive reload', () => {
  const original = emptyProgress();
  original.completedLessons = ['kenali'];
  original.ph = 5;
  original.labVisited = true;
  original.draft.answers = { ...answers };
  original.attempts.push(makeAttempt(original.draft));
  const storage = memoryStorage(null);
  assert.equal(saveProgress(storage, original), true);
  const restored = loadProgress(storage);
  assert.equal(restored.warning, '');
  assert.deepEqual(restored.data, original);
});
test('blocked storage, invalid JSON and invalid nested answers never crash startup', () => {
  const denied = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('quota');
    },
  };
  assert.ok(loadProgress(denied).warning);
  assert.equal(saveProgress(denied, emptyProgress()), false);
  for (const value of ['{invalid', 'null', JSON.stringify({ schemaVersion: 99 })])
    assert.ok(loadProgress(memoryStorage(value)).warning);
  const broken = emptyProgress();
  broken.draft.answers.q1 = 20;
  assert.ok(loadProgress(memoryStorage(JSON.stringify(broken))).warning);
  const obsolete = emptyProgress();
  obsolete.draft.questionVersion = 'obsolete';
  assert.ok(loadProgress(memoryStorage(JSON.stringify(obsolete))).warning);
});
test('teacher demo aggregate is derived from one fictitious diagnostic per student', () => {
  const scores = demoStudents.map(
    (s) => makeAttempt({ ...createDraft(), answers: s.answers }).score,
  );
  assert.equal(scores.reduce((a, b) => a + b) / scores.length, 70);
  assert.equal(scores.filter((s) => s < 80).length, 2);
  assert.equal(demoStudents.filter((s) => s.answers.q2 === 2).length, 3);
});

test('guest and account progress are isolated under separate keys', () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
  const guest = emptyProgress();
  guest.completedLessons = ['kenali'];
  const first = emptyProgress();
  first.ph = 3;
  saveProgress(storage, guest);
  saveProgress(storage, first, accountProgressKey('student-a'));
  assert.equal(accountProgressKey(null), STORAGE_KEY);
  assert.notEqual(accountProgressKey('student-a'), accountProgressKey('student-b'));
  assert.equal(loadProgress(storage, accountProgressKey('student-a')).data.ph, 3);
  assert.deepEqual(loadProgress(storage).data.completedLessons, ['kenali']);
  assert.equal(loadProgress(storage, accountProgressKey('student-b')).data.ph, 7);
});
