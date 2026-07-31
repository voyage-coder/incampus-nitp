export const PREFS_KEY = 'incampus_prefs';

export const DEFAULT_PREFS = {
  compact: false,
  emailDigest: true,
  digestDismissedAt: null,
};

export const DIGEST_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export function loadPrefs() {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    return { ...DEFAULT_PREFS, ...stored };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function shouldShowWeeklyDigest(prefs) {
  if (!prefs.emailDigest) return false;
  if (!prefs.digestDismissedAt) return true;
  const dismissedAt = new Date(prefs.digestDismissedAt).getTime();
  if (Number.isNaN(dismissedAt)) return true;
  return Date.now() - dismissedAt >= DIGEST_INTERVAL_MS;
}

export function isWithinPastWeek(date) {
  if (!date) return false;
  const ts = new Date(date).getTime();
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < DIGEST_INTERVAL_MS;
}
