'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: any; // In a real app, you'd have a proper User type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Check if user is authenticated (check localStorage, cookies, etc.)
      const token = localStorage.getItem('skillmap_token');
      const userData = localStorage.getItem('skillmap_user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('skillmap_user');
      localStorage.removeItem('skillmap_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = () => {
    // Simulate login
    setIsAuthenticated(true);
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    setUser(mockUser);
    localStorage.setItem('skillmap_token', 'mock_token');
    localStorage.setItem('skillmap_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    // Simulate logout
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('skillmap_token');
    localStorage.removeItem('skillmap_user');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
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