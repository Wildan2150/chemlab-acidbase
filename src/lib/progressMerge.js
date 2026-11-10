const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function changedFields(base = {}, local = {}, remote = {}) {
  const result = { ...remote };
  for (const key of new Set([...Object.keys(base), ...Object.keys(local)])) {
    if (same(base[key], local[key])) continue;
    if (local[key] === undefined) delete result[key];
    else result[key] = local[key];
  }
  return result;
}

function mergeDraft(base, local, remote) {
  if (same(base, local)) return remote;
  if (!local || !remote) return local;
  if (local.id !== remote.id) return local.id === base?.id ? remote : local;
  return {
    ...changedFields(base || {}, local, remote),
    answers: changedFields(base?.answers, local.answers, remote.answers),
  };
}

function mergeAttempts(local, remote) {
  // A submitted result already on the server retains its original instrument and answers.
  const attempts = new Map(remote.map((attempt) => [attempt.id, attempt]));
  for (const attempt of local) if (!attempts.has(attempt.id)) attempts.set(attempt.id, attempt);
  return [...attempts.values()].sort((a, b) => a.completedAt.localeCompare(b.completedAt));
}

export function mergeProgress(base, local, remote) {
  const activityNotes = { ...remote.activityNotes };
  for (const [id, note] of Object.entries(local.activityNotes)) {
    if (same(base.activityNotes[id], note)) continue;
    const previous = base.activityNotes[id] || {
      prediction: '',
      observation: '',
      explanation: '',
      completedAt: null,
    };
    activityNotes[id] = changedFields(previous, note, remote.activityNotes[id]);
    if (
      ['prediction', 'observation', 'explanation'].some((field) => previous[field] !== note[field])
    )
      activityNotes[id].completedAt = note.completedAt || null;
  }
  return {
    schemaVersion: 1,
    completedLessons: [...new Set([...remote.completedLessons, ...local.completedLessons])],
    labVisited: remote.labVisited || local.labVisited,
    ph: same(base.ph, local.ph) ? remote.ph : local.ph,
    draft: mergeDraft(base.draft, local.draft, remote.draft),
    attempts: mergeAttempts(local.attempts, remote.attempts),
    assessment: {
      draft: mergeDraft(base.assessment.draft, local.assessment.draft, remote.assessment.draft),
      attempts: mergeAttempts(local.assessment.attempts, remote.assessment.attempts),
    },
    activityNotes,
  };
}

export { same as sameProgress };
