
import { create } from 'zustand';

interface User {
  login: string;
  password?: string;
  confirmPassword: string;
  city?: string;
  street?: string;
  houseNumber?: number;
  paymentMethod?: string;
  id: number;
  createdAt?: string;
  token?: string;
}

interface AuthState {
  currentUser: User | null;
  register: (
    user: Partial<User> & { confirmPassword: string }
  ) => Promise<boolean | 'exists'>;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),

  // register user
  register: async (user) => {
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
        set({ currentUser: userWithToken });
        return true;
      }

      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // login user
  login: async (login, password) => {
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
        set({ currentUser: userWithToken });
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // logout user
  logout: () => {
    localStorage.removeItem('currentUser');
    set({ currentUser: null });
    window.location.reload();
  },

  setUser: (user) => set({ currentUser: user }),
}));
