import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../utils/api';
import { useToast } from './ToastContext';

interface User {
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const checkAuth = async () => {
    // Only attempt to restore if an active session token exists in this browser tab
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.authenticated && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
        setAuthToken(null);
      }
    } catch {
      setUser(null);
      setAuthToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setAuthToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);
    if (res.success && res.user) {
      setUser(res.user);
      if (res.token) {
        setAuthToken(res.token);
      }
      showToast(`Welcome back, ${res.user.name || 'Keerthika'}! 🌻`, 'success');
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    setUser(null);
    setAuthToken(null);
    showToast('See you soon! 🌻', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
