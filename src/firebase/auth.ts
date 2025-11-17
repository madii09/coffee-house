import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type AuthError
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { saveUserProfile } from "./firestore";

export interface RegisterUser {
  login: string;
  password: string;
  fullName?: string;
  city?: string;
  street?: string;
  houseNumber?: number;
}

export const registerUser = async (
  user: RegisterUser
): Promise<User | "exists" | false> => {
  try {
    const email = `${user.login}`;

    const res = await createUserWithEmailAndPassword(auth, email, user.password);

    await saveUserProfile(res.user.uid, user);

    return res.user;
  } catch (err) {
    const error = err as AuthError;
    if (error.code === "auth/email-already-in-use") return "exists";
    return false;
  }
};

export const loginUser = async (
  login: string,
  password: string
): Promise<User | false> => {
  try {
    const email = `${login}`;
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (err) {
    return false;
  }
};

export const logoutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (err) {
    return false;
  }
};
