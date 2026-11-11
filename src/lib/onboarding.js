export const ONBOARDING_KEY = 'chemlab:onboarding:v1';

// Keep dismissal across account changes even when browser storage is unavailable.
let dismissedInSession = false;

export function hasSeenOnboarding() {
  if (dismissedInSession) return true;
  try {
    return ['completed', 'skipped'].includes(window.localStorage.getItem(ONBOARDING_KEY));
  } catch {
    return false;
  }
}

export function dismissOnboarding(outcome) {
  dismissedInSession = true;
  try {
    window.localStorage.setItem(ONBOARDING_KEY, outcome);
  } catch {
    // Learning remains available; dismissal lasts until this document is closed.
  }
}

export function restartOnboarding() {
  dismissedInSession = false;
  try {
    window.localStorage.removeItem(ONBOARDING_KEY);
  } catch {
    // Resetting the in-memory preference still allows the tour to restart.
  }
}
