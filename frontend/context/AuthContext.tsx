
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

export type UserRole = 'admin' | 'technician';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role') as UserRole | null;

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(username, password);

      // Store token and role
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_role', response.role);

      setUserRole(response.role as UserRole);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setError(null);

    // Clear stored credentials
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
