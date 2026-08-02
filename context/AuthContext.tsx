'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserCabinetData, User } from '@/types';

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  cabinetData: UserCabinetData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: {
    phone: string;
    name: string;
    email?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshCabinet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [cabinetData, setCabinetData] = useState<UserCabinetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCabinet = useCallback(async () => {
    try {
      const res = await fetch('/api/user/cabinet');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.cabinetData) {
          setUser(data.cabinetData.user);
          setCabinetData(data.cabinetData);
        }
      }
    } catch (err) {
      console.error('Failed to fetch cabinet data:', err);
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            await refreshCabinet();
          } else {
            setUser(null);
            setCabinetData(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, [refreshCabinet]);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        await refreshCabinet();
        return { success: true };
      }
      return { success: false, error: data.error || 'Ошибка входа' };
    } catch (err) {
      return { success: false, error: 'Сетевая ошибка при входе' };
    }
  };

  const register = async (payload: {
    phone: string;
    name: string;
    email?: string;
    password: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        await refreshCabinet();
        return { success: true };
      }
      return { success: false, error: data.error || 'Ошибка регистрации' };
    } catch (err) {
      return { success: false, error: 'Сетевая ошибка при регистрации' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setCabinetData(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        cabinetData,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshCabinet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
