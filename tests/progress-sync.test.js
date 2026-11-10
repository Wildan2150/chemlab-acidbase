import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyProgress, accountProgressKey } from '../src/lib/storage.js';
import { makeAttempt } from '../src/lib/chemistry.js';
import { ProgressSession } from '../src/lib/progressSession.js';
import { mergeProgress } from '../src/lib/progressMerge.js';
import {
  decodeProgressDocument,
  encodeProgress,
  progressSyncKey,
} from '../src/lib/progressDocument.js';

const copy = (value) => structuredClone(value);
const envelope = (data, revision = 1, resetId = 'original') => ({
  data,
  revision,
  resetId,
  deleted: false,
});
const memory = () => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
};
function harness(initial = emptyProgress(), storage = memory(), overrides = {}) {
  const states = [],
    values = [],
    writes = [];
  let receive;
  const adapter = {
    watch(uid, next) {
      receive = next;
      return () => {};
    },
    async commit(uid, change) {
      writes.push(change);
      return envelope(
        change.progress,
        (change.base?.revision || 0) + 1,
        change.resetId || 'original',
      );
    },
    ...overrides.adapter,
  };
  const session = new ProgressSession({
    uid: 'learner',
    initial,
    storage,
    adapter,
    onProgress: (data) => values.push(data),
    onStatus: (state) => states.push(state),
    delay: 100000,
    ...overrides,
    adapter,
  });
  session.start();
  return { session, storage, states, values, writes, receive: (data) => receive(data) };
}

test('concurrent progress combines independent fields and retains submitted results by stable ID', () => {
  const base = emptyProgress(),
    local = copy(base),
    remote = copy(base);
  local.completedLessons = ['kenali'];
  remote.completedLessons = ['skala'];
  local.draft.answers.q1 = 1;
  remote.draft.answers.q2 = 2;
  local.activityNotes.phet = {
    prediction: 'Prediksi',
    observation: '',
    explanation: '',
    completedAt: null,
  };
  remote.activityNotes.phet = {
    prediction: '',
    observation: 'Pengamatan',
    explanation: '',
    completedAt: null,
  };
  const draft = copy(base.draft);
  draft.answers = { q1: 1, q2: 2, q3: 0, q4: 3, q5: 2 };
  const attempt = makeAttempt(draft);
  remote.attempts = [attempt];
  local.attempts = [{ ...attempt, score: 0 }];
  const merged = mergeProgress(base, local, remote);
  assert.deepEqual(new Set(merged.completedLessons), new Set(['kenali', 'skala']));
  assert.deepEqual(merged.draft.answers, { q2: 2, q1: 1 });
  assert.equal(merged.activityNotes.phet.prediction, 'Prediksi');
  assert.equal(merged.activityNotes.phet.observation, 'Pengamatan');
  assert.equal(merged.attempts.length, 1);
  assert.equal(merged.attempts[0].score, 100);
});

test('a fresh device waits for the server and does not overwrite its progress with defaults', async () => {
  const h = harness();
  try {
    assert.equal(await h.session.flush(), false);
    assert.equal(h.writes.length, 0);
    const remote = emptyProgress();
    remote.ph = 3;
    remote.completedLessons = ['kenali'];
    h.receive(envelope(remote));
    assert.equal(h.session.progress.ph, 3);
    assert.equal(h.session.dirty, false);
    assert.equal(h.states.at(-1).state, 'synced');
    assert.equal(h.writes.length, 0);
  } finally {
    h.session.dispose();
  }
});

test('edits made while the first read is pending are rebased on server progress', async () => {
  const initial = emptyProgress(),
    h = harness(initial);
  try {
    h.session.update((p) => ({ ...p, ph: 2 }));
    const remote = copy(initial);
    remote.completedLessons = ['skala'];
    h.receive(envelope(remote));
    await h.session.flush();
    assert.equal(h.session.progress.ph, 2);
    assert.deepEqual(h.session.progress.completedLessons, ['skala']);
  } finally {
    h.session.dispose();
  }
});

test('edits during a pending write remain queued after its acknowledgement', async () => {
  let acknowledge;
  const h = harness(emptyProgress(), memory(), {
    adapter: {
      commit(uid, change) {
        return new Promise((resolve) => {
          acknowledge = () => resolve(envelope(change.progress, 2));
        });
      },
    },
  });
  try {
    h.receive(envelope(h.session.progress));
    h.session.update((p) => ({ ...p, ph: 3 }));
    const writing = h.session.flush();
    h.session.update((p) => ({ ...p, completedLessons: ['kenali'] }));
    acknowledge();
    await writing;
    assert.equal(h.session.progress.ph, 3);
    assert.deepEqual(h.session.progress.completedLessons, ['kenali']);
    assert.equal(h.session.dirty, true);
    assert.equal(h.states.at(-1).state, 'pending');
  } finally {
    h.session.dispose();
  }
});

test('offline changes survive a new session and recover without copying guest data', async () => {
  const storage = memory(),
    h = harness(emptyProgress(), storage, { online: () => false });
  h.receive(envelope(h.session.progress));
  h.session.update((p) => ({ ...p, ph: 2, completedLessons: ['kenali'] }));
  assert.equal(h.states.at(-1).state, 'offline');
  h.session.dispose();
  const next = harness(emptyProgress(), storage);
  try {
    assert.equal(next.session.progress.ph, 2);
    const remote = emptyProgress();
    remote.completedLessons = ['skala'];
    next.receive(envelope(remote));
    await next.session.flush();
    assert.deepEqual(new Set(next.session.progress.completedLessons), new Set(['kenali', 'skala']));
    assert.equal(JSON.parse(storage.getItem(progressSyncKey('learner'))).dirty, false);
    assert.equal(storage.getItem('chemlab:guest:v1'), null);
  } finally {
    next.session.dispose();
  }
});

test('a reset from another device discards pending data from before the reset', () => {
  const h = harness();
  try {
    h.receive(envelope(h.session.progress));
    h.session.update((p) => ({ ...p, completedLessons: ['kenali'] }));
    h.receive(envelope(emptyProgress(), 2, 'reset-elsewhere'));
    assert.deepEqual(h.session.progress.completedLessons, []);
    assert.equal(h.session.dirty, false);
  } finally {
    h.session.dispose();
  }
});

test('permission failures retain the outbox and never report success or retry in a tight loop', async () => {
  let writes = 0;
  const h = harness(emptyProgress(), memory(), {
    delay: 5,
    adapter: {
      async commit() {
        writes++;
        throw { code: 'permission-denied' };
      },
    },
  });
  try {
    h.receive(envelope(h.session.progress));
    h.session.update((p) => ({ ...p, ph: 4 }));
    await h.session.flush();
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(writes, 1);
    assert.equal(h.states.at(-1).state, 'error');
    assert.equal(JSON.parse(h.storage.getItem(progressSyncKey('learner'))).dirty, true);
  } finally {
    h.session.dispose();
  }
});

test('deletion clears personal caches and prevents the session from recreating data', async () => {
  const h = harness();
  try {
    h.receive(envelope(h.session.progress));
    h.session.update((p) => ({ ...p, ph: 2 }));
    h.receive({ deleted: true, data: null, revision: 2, resetId: 'deleted' });
    h.session.update((p) => ({ ...p, ph: 5 }));
    await h.session.flush();
    assert.equal(h.states.at(-1).state, 'deleted');
    assert.equal(h.writes.length, 0);
    assert.equal(h.storage.getItem(accountProgressKey('learner')), null);
    assert.equal(h.storage.getItem(progressSyncKey('learner')), null);
  } finally {
    h.session.dispose();
  }
});

test('cloud decoding rejects damaged data and encoding enforces the document byte budget', () => {
  assert.throws(() => decodeProgressDocument({ version: 99 }));
  assert.throws(() =>
    decodeProgressDocument({
      version: 1,
      revision: 1,
      resetId: 'a',
      deleted: false,
      payload: '{}',
    }),
  );
  assert.throws(() => encodeProgress({ note: 'あ'.repeat(300000) }), /terlalu besar/);
  const progress = emptyProgress();
  assert.deepEqual(
    decodeProgressDocument({
      version: 1,
      revision: 1,
      resetId: 'a',
      deleted: false,
      payload: encodeProgress(progress),
    }).data,
    progress,
  );
});

test('an oversized pending history is recovered locally instead of being discarded on reload', () => {
  const storage = memory(),
    large = emptyProgress();
  large.draft.answers = { q1: 1, q2: 2, q3: 0, q4: 3, q5: 2 };
  const attempt = makeAttempt(large.draft);
  large.attempts = Array.from({ length: 1500 }, (_, i) => ({ ...attempt, id: `history-${i}` }));
  assert.throws(() => encodeProgress(large), /terlalu besar/);
  const first = harness(large, storage, { online: () => false });
  first.session.update((p) => ({ ...p, ph: 2 }));
  first.session.dispose();
  const recovered = harness(emptyProgress(), storage);
  try {
    assert.equal(recovered.session.dirty, true);
    assert.equal(recovered.session.progress.attempts.length, 1500);
    assert.equal(recovered.session.progress.ph, 2);
  } finally {
    recovered.session.dispose();
  }
});

test('resetting while an older write is pending preserves the new reset generation', async () => {
  let acknowledge;
  const h = harness(emptyProgress(), memory(), {
    adapter: {
      commit(uid, change) {
        return new Promise((resolve) => {
          acknowledge = () => resolve(envelope(change.progress, 2));
        });
      },
    },
  });
  try {
    h.receive(envelope(h.session.progress));
    h.session.update((p) => ({ ...p, completedLessons: ['kenali'] }));
    const writing = h.session.flush();
    h.session.reset();
    const resetId = h.session.resetId;
    acknowledge();
    await writing;
    assert.deepEqual(h.session.progress.completedLessons, []);
    assert.equal(h.session.resetId, resetId);
    assert.equal(h.session.dirty, true);
  } finally {
    h.session.dispose();
  }
});

test('an acknowledgement after account disposal cannot publish into a new session', async () => {
  let acknowledge;
  const h = harness(emptyProgress(), memory(), {
    adapter: {
      commit(uid, change) {
        return new Promise((resolve) => {
          acknowledge = () => resolve(envelope(change.progress, 2));
        });
      },
    },
  });
  h.receive(envelope(h.session.progress));
  h.session.update((p) => ({ ...p, ph: 2 }));
  const writing = h.session.flush(),
    published = h.values.length;
  h.session.dispose();
  acknowledge();
  await writing;
  assert.equal(h.values.length, published);
});
