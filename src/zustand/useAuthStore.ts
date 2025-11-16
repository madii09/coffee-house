import { create } from "zustand";
import { registerUser, loginUser, logoutUser } from "../firebase/auth";
import { getUserProfile } from "../firebase/firestore";

export interface User {
  uid: string;
  login: string;
  city?: string;
  street?: string;
  houseNumber?: number;
  paymentMethod?: string;
}

interface AuthState {
  currentUser: User | null;
  register: (user: any) => Promise<boolean | "exists">;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),

  register: async (user) => {
    const result = await registerUser(user);

    if (result === "exists") return "exists";
    if (!result) return false;

    const profileData = await getUserProfile(result.uid);
    if (!profileData || !profileData.login) return false;

    const profile: User = {
      uid: result.uid,
      login: profileData.login,
      city: profileData.city,
      street: profileData.street,
      houseNumber: profileData.houseNumber,
      paymentMethod: profileData.paymentMethod,
    };

    localStorage.setItem("currentUser", JSON.stringify(profile));
    set({ currentUser: profile });

    return true;
  },

  login: async (login, password) => {
    const result = await loginUser(login, password);
    if (!result) return false;

    const profileData = await getUserProfile(result.uid);
    if (!profileData || !profileData.login) return false;

    const profile: User = {
      uid: result.uid,
      login: profileData.login,
      city: profileData.city,
      street: profileData.street,
      houseNumber: profileData.houseNumber,
      paymentMethod: profileData.paymentMethod,
    };

    localStorage.setItem("currentUser", JSON.stringify(profile));
    set({ currentUser: profile });

    return true;
  },

  logout: () => {
    logoutUser();
    localStorage.removeItem("currentUser");
    set({ currentUser: null });
  },

  setUser: (user) => set({ currentUser: user }),
}));
