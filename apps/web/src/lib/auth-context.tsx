'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email?: string;
  name?: string;
  roles: string[];
  mobileNumber?: string;
  status?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken?: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-load on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const storedUserStr = localStorage.getItem('user');

      if (storedToken) {
        let loadedUser: User | null = null;
        if (storedUserStr) {
          try {
            loadedUser = JSON.parse(storedUserStr);
          } catch {
            // Ignore parse errors
          }
        }
        
        if (!loadedUser) {
          const decoded = decodeJwt(storedToken);
          if (decoded) {
            loadedUser = {
              id: decoded.userId,
              email: decoded.email,
              roles: decoded.roles,
              name: decoded.email ? decoded.email.split('@')[0] : 'User',
            };
          }
        }

        if (loadedUser) {
          setUser(loadedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Listen to silent refresh logout events
  useEffect(() => {
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = useCallback((accessToken: string, refreshToken?: string, userData?: User) => {
    let resolvedUser = userData || null;

    if (!resolvedUser) {
      const decoded = decodeJwt(accessToken);
      if (decoded) {
        resolvedUser = {
          id: decoded.userId,
          email: decoded.email,
          roles: decoded.roles,
          name: decoded.email ? decoded.email.split('@')[0] : 'User',
        };
      }
    }

    setUser(resolvedUser);
    setToken(accessToken);
    setIsAuthenticated(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      if (resolvedUser) {
        localStorage.setItem('user', JSON.stringify(resolvedUser));
      }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
