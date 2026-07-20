import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from "../../firebase/config";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  // While true, onAuthStateChanged ignores the auto-login/sign-out events
  // that Firebase fires internally during createUserWithEmailAndPassword + signOut.
  // This stops the brief "flash of TaskPage" after registering.
  const registeringRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Ignore the transient auth events that happen mid-registration
      if (registeringRef.current) {
        return;
      }

      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            const defaultProfile = {
              uid: firebaseUser.uid,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile({
            uid: firebaseUser.uid,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
        resetVerificationState();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const resetVerificationState = () => {
    setVerifiedEmail("");
    setEmailVerified(false);
  };

  const saveUserProfile = async (uid, username, email) => {
    try {
      const userData = {
        uid,
        username,
        email,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), userData, { merge: true });
      setUserProfile(userData);
      return userData;
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw new Error('Failed to save user profile');
    }
  };

  const getCurrentUser = async () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        unsubscribe();
        resolve(firebaseUser);
      });
    });
  };

  const register = async (username, gmail, password) => {
    const cleanUsername = username.trim();
    const cleanGmail = gmail.trim().toLowerCase();

    if (!USERNAME_REGEX.test(cleanUsername)) {
      throw new Error('Username must be 3-20 characters (letters, numbers, underscore only).');
    }

    if (!GMAIL_REGEX.test(cleanGmail)) {
      throw new Error('Please enter a valid Gmail address (example@gmail.com).');
    }

    const usernameLower = cleanUsername.toLowerCase();

    // Block the auth-state listener from reacting until we're fully done
    // (this is what stops the "flash of TaskPage then back to login" glitch)
    registeringRef.current = true;

    try {
      const usernameDoc = await getDoc(doc(db, 'usernames', usernameLower));
      if (usernameDoc.exists()) {
        throw new Error('Username is already taken. Please choose another.');
      }

      const result = await createUserWithEmailAndPassword(auth, cleanGmail, password);
      const firebaseUser = result.user;

      await updateProfile(firebaseUser, {
        displayName: cleanUsername
      });

      await setDoc(doc(db, 'usernames', usernameLower), {
        uid: firebaseUser.uid,
        email: cleanGmail,
      });

      await saveUserProfile(firebaseUser.uid, cleanUsername, cleanGmail);

      await signOut(auth);

      setUser(null);
      setUserProfile(null);
      resetVerificationState();

      return {
        success: true,
        message: '✅ Registration successful! Please login with your credentials.',
        user: firebaseUser
      };

    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message);
    } finally {
      // Safe to let the listener react to auth changes again
      registeringRef.current = false;
    }
  };

  const login = async (username, password) => {
    try {
      const usernameLower = username.trim().toLowerCase();

      const usernameDoc = await getDoc(doc(db, 'usernames', usernameLower));
      if (!usernameDoc.exists()) {
        throw new Error('No account found with that username.');
      }

      const { email } = usernameDoc.data();
      
      const result = await signInWithEmailAndPassword(auth, email, password);

      try {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user profile during login:', error);
      }

      return result.user;
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      resetVerificationState();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
  };

  const resetPassword = async (gmail) => {
    try {
      await sendPasswordResetEmail(auth, gmail.trim().toLowerCase());
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message);
    }
  };

  const setVerifiedEmailState = (email) => {
    setVerifiedEmail(email);
    setEmailVerified(true);

    if (user?.uid) {
      updateDoc(doc(db, 'users', user.uid), {
        verifiedEmail: email,
        emailVerified: true
      }).catch(error => console.error('Error saving verified email:', error));
    }
  };

  const isAuthenticated = !!user;

  const getUsername = () => {
    if (userProfile?.username) return userProfile.username;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const value = {
    user,
    userProfile,
    loading,
    verifiedEmail,
    emailVerified,
    setVerifiedEmailState,
    resetVerificationState,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated,
    getUsername,
    getCurrentUser,
    saveUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};