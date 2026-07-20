// src/data/repositories/FirebaseAuthRepository.js
import { auth, db } from "../../firebase/config";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export class FirebaseAuthRepository {

  async register(
    username,
    gmail,
    password
  ) {
    const cleanUsername = username.trim();
    const cleanGmail = gmail.trim().toLowerCase();
    const usernameLower = cleanUsername.toLowerCase();

    const usernameDoc = await getDoc(
      doc(db, "usernames", usernameLower)
    );

    if (usernameDoc.exists()) {
      throw new Error(
        "Username is already taken. Please choose another."
      );
    }

    const result = await createUserWithEmailAndPassword(
      auth,
      cleanGmail,
      password
    );

    const firebaseUser = result.user;

    await updateProfile(firebaseUser, {
      displayName: cleanUsername,
    });

    await setDoc(
      doc(db, "usernames", usernameLower),
      {
        uid: firebaseUser.uid,
        email: cleanGmail,
      }
    );

    await setDoc(
      doc(db, "users", firebaseUser.uid),
      {
        uid: firebaseUser.uid,
        username: cleanUsername,
        email: cleanGmail,
        createdAt: new Date().toISOString(),
      }
    );

    await signOut(auth);

    return {
      success: true,
      message: "You are registered! Please log in.",
      user: firebaseUser,
    };
  }

  async login(
    username,
    password
  ) {
    const usernameLower = username.trim().toLowerCase();

    const usernameDoc = await getDoc(
      doc(db, "usernames", usernameLower)
    );

    if (!usernameDoc.exists()) {
      throw new Error(
        "No account found with that username."
      );
    }

    const { email } = usernameDoc.data();

    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  }

  async logout() {
    await signOut(auth);
  }

  async resetPassword(gmail) {
    await sendPasswordResetEmail(
      auth,
      gmail.trim().toLowerCase()
    );
  }

  async getUserProfile(uid) {
    const snapshot = await getDoc(
      doc(db, "users", uid)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();
  }

  async saveUserProfile(
    uid,
    username,
    email
  ) {
    const profile = {
      uid,
      username,
      email,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(
      doc(db, "users", uid),
      profile,
      {
        merge: true,
      }
    );

    return profile;
  }

  async updateVerifiedEmail(
    uid,
    email
  ) {
    await updateDoc(
      doc(db, "users", uid),
      {
        verifiedEmail: email,
        emailVerified: true,
      }
    );
  }

  observeAuthState(
    callback
  ) {
    return onAuthStateChanged(
      auth,
      callback
    );
  }

  async getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe =
        onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(user);
        });
    });
  }
}