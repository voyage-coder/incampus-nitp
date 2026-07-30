import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getProfile,
  loginRequest,
  registerRequest,
} from '../services/authService';

const AuthContext = createContext(null);
const TOKEN_KEY = 'incampus_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
    const profile = await getProfile();
    setUser(profile);
    return profile;
  };

  const register = async (payload) => {
    await registerRequest(payload);
    return login({ email: payload.email, password: payload.password });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, token, loading, isAdmin, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
