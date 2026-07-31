import { createContext, useContext, useState } from 'react';
import {
  DEFAULT_PREFS,
  loadPrefs,
  savePrefs,
} from '../constants/preferences';

const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs);

  const updatePref = (key, value) => {
    setPrefs((current) => {
      const next = { ...current, [key]: value };
      savePrefs(next);
      return next;
    });
  };

  const dismissWeeklyDigest = () => {
    updatePref('digestDismissedAt', new Date().toISOString());
  };

  return (
    <PreferencesContext.Provider
      value={{
        prefs,
        compact: prefs.compact,
        emailDigest: prefs.emailDigest,
        updatePref,
        dismissWeeklyDigest,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}

export { DEFAULT_PREFS };
