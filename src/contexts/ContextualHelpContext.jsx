import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { contextualHelp } from '../data/contextualHelp.js';
import {
  createHelpSession,
  readHelpPreferences,
  recordHelpSignal,
  saveHelpPreferences,
} from '../lib/contextualHelp.js';

const ContextualHelpContext = createContext(null);
export function ContextualHelpProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      return readHelpPreferences(window.localStorage);
    } catch {
      return { enabled: true, seen: [] };
    }
  });
  const preferencesRef = useRef(preferences);
  const session = useRef(createHelpSession());
  const [active, setActive] = useState(null);
  useEffect(() => {
    const onRoute = () => setActive(null);
    window.addEventListener('hashchange', onRoute);
    return () => window.removeEventListener('hashchange', onRoute);
  }, []);
  useEffect(() => {
    if (!active) return;
    const onKey = (event) => {
      if (event.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);
  const persist = useCallback((next) => {
    preferencesRef.current = next;
    setPreferences(next);
    try {
      saveHelpPreferences(window.localStorage, next);
    } catch {
      /* Session preference still applies. */
    }
  }, []);
  const signal = useCallback(
    (topic, evidence, { entry = false } = {}) => {
      const current = preferencesRef.current;
      if (!current.enabled || current.seen.includes(topic)) return;
      const result = recordHelpSignal(session.current, topic, { evidence });
      session.current = result.session;
      if (result.show) {
        setActive({ topic, manual: false, entry });
        if (contextualHelp[topic]?.firstUse)
          persist({ ...current, seen: [...current.seen, topic] });
      }
    },
    [persist],
  );
  const resolve = useCallback((topic) => {
    session.current.counts[topic] = 0;
    session.current.evidence[topic] = [];
    setActive((current) => (current?.topic === topic ? null : current));
  }, []);
  const dismiss = useCallback(() => setActive(null), []);
  const show = useCallback((topic) => {
    if (contextualHelp[topic]) setActive({ topic, manual: true });
  }, []);
  const restart = useCallback(() => {
    session.current = createHelpSession();
    setActive(null);
    persist({ enabled: true, seen: [] });
  }, [persist]);
  function setEnabled(enabled) {
    persist({ ...preferencesRef.current, enabled });
    setActive(null);
  }
  return (
    <ContextualHelpContext.Provider
      value={{
        enabled: preferences.enabled,
        active,
        signal,
        resolve,
        dismiss,
        show,
        setEnabled,
        restart,
      }}
    >
      {children}
    </ContextualHelpContext.Provider>
  );
}
export const useContextualHelp = () => useContext(ContextualHelpContext);
