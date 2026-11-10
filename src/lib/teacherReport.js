import { questions } from '../data/chemData.js';
import { decodeProgressDocument } from './progressDocument.js';
import { TEACHER_EMAIL } from './teacherAccess.js';

export function buildTeacherRoster({ profiles, progress }, teacherUid) {
  const identities = new Map(profiles.map((profile) => [profile.uid, profile]));
  const records = new Map(progress.map((record) => [record.uid, record]));
  const students = [];
  for (const uid of new Set([...identities.keys(), ...records.keys()])) {
    const profile = identities.get(uid),
      record = records.get(uid);
    if (
      uid === teacherUid ||
      profile?.email?.toLowerCase() === TEACHER_EMAIL ||
      record?.document.deleted
    )
      continue;
    let data = null,
      unreadable = false;
    if (record) {
      try {
        data = decodeProgressDocument(record.document).data;
      } catch {
        unreadable = true;
      }
    }
    const diagnostic =
      data?.attempts
        .filter((attempt) => attempt.kind === 'diagnostic')
        .sort((a, b) => a.completedAt.localeCompare(b.completedAt))[0] || null;
    const assessment =
      data?.assessment.attempts
        .slice()
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0] || null;
    students.push({
      uid,
      code: `S-${uid.slice(0, 8).toUpperCase()}`,
      name: profile?.displayName || `Siswa ${uid.slice(0, 8)}`,
      email: profile?.email || '',
      progress: data,
      diagnostic,
      assessment,
      updatedAt: record?.updatedAt || null,
      unreadable,
    });
  }
  return students.sort((a, b) => a.name.localeCompare(b.name, 'id') || a.uid.localeCompare(b.uid));
}

export function studentStatus(student, mode, threshold = 80) {
  if (student.unreadable) return 'unreadable';
  const result = student[mode];
  return !result ? 'missing' : result.score < threshold ? 'review' : 'complete';
}

export function filterStudents(
  students,
  { query = '', filter = 'all', mode = 'diagnostic', threshold = 80 },
) {
  const search = query.trim().toLocaleLowerCase('id');
  return students.filter((student) => {
    const status = studentStatus(student, mode, threshold);
    return (
      `${student.name} ${student.email} ${student.code} ${student.uid}`
        .toLocaleLowerCase('id')
        .includes(search) &&
      (filter === 'all' ||
        (filter === 'submitted' ? ['review', 'complete'].includes(status) : status === filter))
    );
  });
}

export function teacherSummary(students, mode, threshold = 80) {
  const submitted = students.filter((student) => !student.unreadable && student[mode]);
  return {
    total: students.length,
    submitted: submitted.length,
    average: submitted.length
      ? Math.round(
          (submitted.reduce((sum, student) => sum + student[mode].score, 0) / submitted.length) *
            10,
        ) / 10
      : null,
    review: submitted.filter((student) => student[mode].score < threshold).length,
    missing: students.filter((student) => studentStatus(student, mode, threshold) === 'missing')
      .length,
    unreadable: students.filter((student) => student.unreadable).length,
  };
}

export function conceptPerformance(students, mode) {
  const completed = students.filter((student) => !student.unreadable && student[mode]);
  if (mode === 'diagnostic')
    return questions.map((question) => ({
      id: question.id,
      title: question.concept,
      description: question.objective,
      correct: completed.filter(
        (student) => student.diagnostic.answers[question.id] === question.correct,
      ).length,
      total: completed.length,
    }));
  const groups = new Map();
  for (const student of completed) {
    for (const domain of student.assessment.domains) {
      const id = `${student.assessment.version}:${domain.id}`;
      const group = groups.get(id) || {
        id,
        title: domain.title,
        description: `Instrumen ${student.assessment.version}`,
        correct: 0,
        total: 0,
      };
      group.correct += domain.correct;
      group.total += domain.total;
      groups.set(id, group);
    }
  }
  return [...groups.values()];
}

export function teacherExport(students, mode, threshold) {
  return {
    type: 'hasil-belajar-siswa',
    exportedAt: new Date().toISOString(),
    resultType: mode,
    reviewThreshold: threshold,
    students: students.map((student) => ({
      uid: student.uid,
      name: student.name,
      email: student.email,
      status: studentStatus(student, mode, threshold),
      updatedAt: student.updatedAt,
      diagnostic: student.diagnostic,
      assessment: student.assessment,
      progress: student.progress,
    })),
  };
}

const csvCell = (value) => {
  let text = String(value ?? '');
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
};
export function teacherCsv(students, mode, threshold) {
  const rows = [
    [
      'Nama',
      'Email',
      'ID akun',
      'Materi selesai',
      'Skor diagnostik awal',
      'Skor asesmen terakhir',
      'Jenis hasil',
      'Status',
      'Terakhir tersinkron',
    ],
    ...students.map((student) => [
      student.name,
      student.email,
      student.uid,
      student.progress?.completedLessons.length ?? '',
      student.diagnostic?.score ?? '',
      student.assessment?.score ?? '',
      mode,
      studentStatus(student, mode, threshold),
      student.updatedAt || '',
    ]),
  ];
  return '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}
