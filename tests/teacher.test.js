import test from 'node:test';
import assert from 'node:assert/strict';
import { isTeacher, TEACHER_EMAIL } from '../src/lib/teacherAccess.js';
import { emptyProgress, createDraft } from '../src/lib/storage.js';
import { makeAttempt } from '../src/lib/chemistry.js';
import { encodeProgress } from '../src/lib/progressDocument.js';
import { assessmentForm } from '../src/data/chapterAssessment.js';
import { createAssessmentDraft, makeAssessmentAttempt } from '../src/lib/chapterAssessment.js';
import {
  buildTeacherRoster,
  conceptPerformance,
  filterStudents,
  studentStatus,
  teacherCsv,
  teacherExport,
  teacherSummary,
} from '../src/lib/teacherReport.js';

const correct = { q1: 1, q2: 2, q3: 0, q4: 3, q5: 2 };
function diagnostic(answers = correct, kind = 'diagnostic', date = '2026-11-10T01:00:00Z') {
  return { ...makeAttempt({ ...createDraft(kind), answers }), completedAt: date };
}
function assessment(allCorrect = true, date = '2026-11-10T01:00:00Z') {
  const draft = createAssessmentDraft();
  draft.answers = Object.fromEntries(
    assessmentForm.questions.map((question) => [
      question.id,
      question.kind === 'choice'
        ? allCorrect
          ? question.correct
          : (question.correct + 1) % question.options.length
        : String(question.expected + (allCorrect ? 0 : 10)),
    ]),
  );
  return { ...makeAssessmentAttempt(draft), completedAt: date };
}
const record = (uid, progress = emptyProgress()) => ({
  uid,
  document: {
    version: 1,
    revision: 1,
    resetId: 'original',
    deleted: false,
    payload: encodeProgress(progress),
  },
  updatedAt: '2026-11-10T02:00:00Z',
});
function students() {
  const first = emptyProgress(),
    second = emptyProgress();
  first.completedLessons = ['kenali'];
  first.attempts = [diagnostic()];
  first.assessment.attempts = [assessment()];
  second.attempts = [diagnostic({ q1: 0, q2: 0, q3: 1, q4: 0, q5: 0 })];
  return buildTeacherRoster(
    {
      profiles: [
        { uid: 'a', displayName: 'Nadia', email: 'nadia@example.com' },
        { uid: 'b', displayName: 'Raka', email: 'raka@example.com' },
        { uid: 'c', displayName: 'Sinta', email: 'sinta@example.com' },
      ],
      progress: [record('a', first), record('b', second)],
    },
    'teacher',
  );
}

test('teacher access requires the designated verified email and ignores client role labels', () => {
  assert.equal(isTeacher({ email: TEACHER_EMAIL, emailVerified: true }), true);
  assert.equal(isTeacher({ email: TEACHER_EMAIL.toUpperCase(), emailVerified: true }), true);
  for (const user of [
    null,
    { email: TEACHER_EMAIL, emailVerified: false },
    { email: 'other@gmail.com', emailVerified: true, role: 'teacher', displayName: TEACHER_EMAIL },
    { email: TEACHER_EMAIL + '.invalid', emailVerified: true },
  ])
    assert.equal(isTeacher(user), false);
});

test('the roster excludes the teacher and deleted accounts while exposing invalid records separately', () => {
  const data = {
    profiles: [
      { uid: 'teacher', email: TEACHER_EMAIL },
      { uid: 'deleted', displayName: 'Dihapus' },
      { uid: 'broken', displayName: 'Perlu pemulihan' },
    ],
    progress: [
      record('teacher'),
      { uid: 'deleted', document: { deleted: true } },
      { uid: 'broken', document: { version: 99 } },
      record('legacy'),
    ],
  };
  const roster = buildTeacherRoster(data, 'teacher');
  assert.deepEqual(new Set(roster.map((student) => student.uid)), new Set(['broken', 'legacy']));
  assert.equal(roster.find((student) => student.uid === 'broken').unreadable, true);
  assert.equal(roster.find((student) => student.uid === 'legacy').name, 'Siswa legacy');
});

test('diagnostic reports retain the first diagnostic and assessments use the latest frozen result', () => {
  const progress = emptyProgress();
  progress.attempts = [
    diagnostic(correct, 'practice', '2026-11-10T04:00:00Z'),
    diagnostic({ q1: 0, q2: 0, q3: 1, q4: 0, q5: 0 }),
    diagnostic(correct, 'diagnostic', '2026-11-10T03:00:00Z'),
  ];
  progress.assessment.attempts = [assessment(true), assessment(false, '2026-11-10T05:00:00Z')];
  const [student] = buildTeacherRoster(
    { profiles: [], progress: [record('a', progress)] },
    'teacher',
  );
  assert.equal(student.diagnostic.score, 0);
  assert.equal(student.assessment.score, 0);
  assert.equal(student.progress.attempts.length, 3);
  assert.equal(student.assessment.form.questions.length, 15);
});

test('averages exclude missing and invalid records and include an actual zero score', () => {
  const roster = [...students(), { uid: 'broken', unreadable: true, diagnostic: null }];
  assert.deepEqual(teacherSummary(roster, 'diagnostic'), {
    total: 4,
    submitted: 2,
    average: 50,
    review: 1,
    missing: 1,
    unreadable: 1,
  });
  assert.equal(teacherSummary([], 'diagnostic').average, null);
  assert.equal(teacherSummary(roster, 'assessment').average, 100);
});

test('search and filters distinguish missing results, review scores and submitted work', () => {
  const roster = students();
  assert.equal(filterStudents(roster, { query: 'NADIA@', mode: 'diagnostic' })[0].uid, 'a');
  assert.equal(filterStudents(roster, { filter: 'missing', mode: 'diagnostic' })[0].uid, 'c');
  assert.equal(filterStudents(roster, { filter: 'review', mode: 'diagnostic' })[0].uid, 'b');
  assert.equal(filterStudents(roster, { filter: 'submitted', mode: 'diagnostic' }).length, 2);
  assert.equal(
    studentStatus(
      roster.find((student) => student.uid === 'b'),
      'diagnostic',
      0,
    ),
    'complete',
  );
});

test('concept denominators count submitted diagnostics and assessment coverage comes from saved instruments', () => {
  const roster = students();
  const diagnosticConcepts = conceptPerformance(roster, 'diagnostic');
  assert.equal(diagnosticConcepts.length, 5);
  assert.ok(diagnosticConcepts.every((concept) => concept.correct === 1 && concept.total === 2));
  const domains = conceptPerformance(roster, 'assessment');
  assert.equal(domains.length, 3);
  assert.ok(domains.every((domain) => domain.correct === domain.total));
  assert.equal(
    domains.reduce((sum, domain) => sum + domain.total, 0),
    15,
  );
});

test('JSON export contains only the selected real records and retains assessment instruments', () => {
  const selected = filterStudents(students(), { query: 'Nadia', mode: 'assessment' });
  const data = teacherExport(selected, 'assessment', 75);
  assert.equal(data.type, 'hasil-belajar-siswa');
  assert.equal(data.students.length, 1);
  assert.equal(data.reviewThreshold, 75);
  assert.equal(data.students[0].assessment.form.questions.length, 15);
});

test('CSV preserves zero scores, quotes text and neutralizes spreadsheet formulas from profile fields', () => {
  const roster = students();
  roster[0].name = '=HYPERLINK("https://example.com")';
  const csv = teacherCsv(roster, 'diagnostic', 80);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"\'=HYPERLINK(""https://example.com"")"'));
  assert.ok(csv.includes('"0"'));
  assert.ok(csv.includes('"missing"'));
});
