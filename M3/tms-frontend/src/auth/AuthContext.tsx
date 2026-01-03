import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../http/auth.model';
import { mockUser } from '@/http/auth.mocks';
import { login as loginUser } from '../http/auth.http';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('deliveroo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const success = await loginUser(email, password);
    
    if (success) {
      // Use mock user data with provided email
      const userWithEmail: User = {
        ...mockUser,
        email: email,
      };

      setUser(userWithEmail);
      localStorage.setItem('deliveroo_user', JSON.stringify(userWithEmail));
    }
    
    setIsLoading(false);
    return success;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('deliveroo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};