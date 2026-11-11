import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHelpSession,
  recordHelpSignal,
  HELP_COOLDOWN_MS,
  MAX_SESSION_HINTS,
  readHelpPreferences,
  saveHelpPreferences,
} from '../src/lib/contextualHelp.js';

test('failed actions need repetition; identical search evidence counts once', () => {
  let session = createHelpSession();
  let result = recordHelpSignal(session, 'search', { evidence: 'term1', now: 0 });
  assert.equal(result.show, false);
  session = result.session;
  result = recordHelpSignal(session, 'search', { evidence: 'term1', now: 2000 });
  assert.equal(result.session.counts.search, 1);
  result = recordHelpSignal(result.session, 'search', { evidence: 'term2', now: 4000 });
  assert.equal(result.show, true);
  assert.equal(
    recordHelpSignal(result.session, 'search', { evidence: 'term3', now: 90000 }).show,
    false,
  );
  assert.deepEqual(session.counts, { search: 1 });
});

test('first visits bypass recovery cooldown and quota while repeated-error hints remain bounded', () => {
  let result = recordHelpSignal(createHelpSession(), 'phet-start', { now: 0 });
  assert.equal(result.show, true);
  result = recordHelpSignal(result.session, 'molecule-start', { now: 1000 });
  assert.equal(result.show, true);
  result = recordHelpSignal(result.session, 'quiz', { now: 2000 });
  assert.equal(result.show, false);
  result = recordHelpSignal(result.session, 'quiz', { now: 2000 });
  assert.equal(result.show, true);
  for (let i = 0; i < 2; i++)
    result = recordHelpSignal(result.session, 'assessment', { now: 3000 });
  assert.equal(result.show, false);
  result = recordHelpSignal(result.session, 'assessment', { now: HELP_COOLDOWN_MS + 2000 });
  assert.equal(result.show, true);
  for (let i = 0; i < 2; i++)
    result = recordHelpSignal(result.session, 'search', { now: HELP_COOLDOWN_MS * 2 + 2000 });
  assert.equal(result.show, true);
  assert.equal(result.session.shown.length, MAX_SESSION_HINTS + 2);
  for (let i = 0; i < 2; i++)
    result = recordHelpSignal(result.session, 'phet-retry', { now: HELP_COOLDOWN_MS * 3 + 2000 });
  assert.equal(result.show, false);
  result = recordHelpSignal(result.session, 'pubchem-start', { now: HELP_COOLDOWN_MS * 3 + 2001 });
  assert.equal(result.show, true);
  assert.equal(recordHelpSignal(result.session, 'unknown').show, false);
});

test('preferences recover safely from corrupt or denied storage and retain opt-out', () => {
  let saved = '{broken';
  const storage = {
    getItem: () => saved,
    setItem: (_key, value) => {
      saved = value;
    },
  };
  assert.deepEqual(readHelpPreferences(storage), { enabled: true, seen: [] });
  assert.equal(saveHelpPreferences(storage, { enabled: false, seen: ['phet-start'] }), true);
  assert.deepEqual(readHelpPreferences(storage), { enabled: false, seen: ['phet-start'] });
  saved = JSON.stringify({ enabled: false, seen: ['phet-start', 'quiz', 'untrusted'] });
  assert.deepEqual(readHelpPreferences(storage), { enabled: false, seen: ['phet-start'] });
  const denied = {
    getItem() {
      throw Error('denied');
    },
    setItem() {
      throw Error('denied');
    },
  };
  assert.deepEqual(readHelpPreferences(denied), { enabled: true, seen: [] });
  assert.equal(saveHelpPreferences(denied, { enabled: false, seen: [] }), false);
});
