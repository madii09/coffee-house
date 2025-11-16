import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveUserProfile = async (uid: string, user: any) => {
  const ref = doc(db, "users", uid);
  await setDoc(ref, {
    uid: uid,
    login: user.login,
    city: user.city || "",
    street: user.street || "",
    houseNumber: user.houseNumber || "",
    paymentMethod: user.paymentMethod || "",
    createdAt: new Date().toISOString(),
  });
};

export const getUserProfile = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};
