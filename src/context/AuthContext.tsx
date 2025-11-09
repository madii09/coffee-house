import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  login: string;
  password?: string;
  confirmPassword: string;
  city?: string;
  street?: string;
  houseNumber?: number;
  paymentMethod?: string;
  id?: number;
  createdAt?: string;
  token?: string;
}

interface AuthContextType {
  currentUser: User | null;
  register: (
    user: Partial<User> & { confirmPassword: string }
  ) => Promise<boolean | 'exists'>;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const register = async (
    user: Partial<User> & { confirmPassword: string }
  ) => {
    try {
      const res = await fetch(
        'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        }
      );

      if (res.status === 409) {
        console.warn('User already exists');
        return 'exists';
      }

      const data = await res.json();

      if (res.ok) {
        const userWithToken = {
          ...data.data.user,
          token: data.data.access_token,
        };
        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        setCurrentUser(userWithToken);
        return true;
      }

      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const login = async (login: string, password: string) => {
    try {
      const res = await fetch(
        'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, password }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        const userWithToken = {
          ...data.data.user,
          token: data.data.access_token,
        };
        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        setCurrentUser(userWithToken);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
