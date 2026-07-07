// Authentication context: holds the logged-in user and login/register/logout actions

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthCredentials, User } from '../types';
import {
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
  TOKEN_STORAGE_KEY,
} from '../api/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean; // true while restoring the session on first load
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, validate it and restore the user
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials: AuthCredentials) => {
    const { access_token, user } = await apiLogin(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setUser(user);
  };

  const register = async (credentials: AuthCredentials) => {
    const { access_token, user } = await apiRegister(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for consuming the auth context
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
