import { contextualHelp } from '../data/contextualHelp.js';

export const CONTEXTUAL_HELP_KEY = 'chemlab:contextual-help:v1';
export const HELP_COOLDOWN_MS = 60000;
export const MAX_SESSION_HINTS = 3;

export function createHelpSession() {
  return { counts: {}, evidence: {}, shown: [], lastShownAt: null };
}

export function recordHelpSignal(session, topic, { now = Date.now(), evidence } = {}) {
  const rule = contextualHelp[topic];
  if (!rule || session.shown.includes(topic)) return { session, show: false };
  const previousEvidence = session.evidence[topic] || [];
  if (evidence && previousEvidence.includes(evidence)) return { session, show: false };
  const count = (session.counts[topic] || 0) + 1;
  const next = {
    ...session,
    counts: { ...session.counts, [topic]: count },
    evidence: {
      ...session.evidence,
      [topic]: evidence ? [...previousEvidence, evidence].slice(-10) : previousEvidence,
    },
  };
  const show =
    count >= rule.threshold &&
    (rule.firstUse ||
      (session.shown.filter((shown) => !contextualHelp[shown]?.firstUse).length <
        MAX_SESSION_HINTS &&
        (session.lastShownAt === null || now - session.lastShownAt >= HELP_COOLDOWN_MS)));
  if (show) {
    next.shown = [...session.shown, topic];
    if (!rule.firstUse) next.lastShownAt = now;
  }
  return { session: next, show };
}

export function readHelpPreferences(storage) {
  try {
    const saved = JSON.parse(storage.getItem(CONTEXTUAL_HELP_KEY));
    return {
      enabled: saved?.enabled !== false,
      seen: Array.isArray(saved?.seen)
        ? saved.seen.filter((topic) => contextualHelp[topic]?.firstUse)
        : [],
    };
  } catch {
    return { enabled: true, seen: [] };
  }
}

export function saveHelpPreferences(storage, preferences) {
  try {
    storage.setItem(CONTEXTUAL_HELP_KEY, JSON.stringify(preferences));
    return true;
  } catch {
    return false;
  }
}
