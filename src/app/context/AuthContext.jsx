import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  registerUseCase,
  loginUseCase,
  logoutUseCase,
  resetPasswordUseCase,
  getUserProfileUseCase,
  saveUserProfileUseCase,
  updateVerifiedEmailUseCase,
  getCurrentUserUseCase,
  authRepository
} from "../../app/authUseCaseProvider";

const AuthContext = createContext();

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
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = authRepository.observeAuthState(async (firebaseUser) => {
      // Skip auth state updates during registration
      if (isRegistering) {
        return;
      }

      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const profile = await getUserProfileUseCase.execute(firebaseUser.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            const defaultProfile = {
              uid: firebaseUser.uid,
              username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email,
              createdAt: new Date().toISOString()
            };
            await saveUserProfileUseCase.execute(firebaseUser.uid, defaultProfile.username, defaultProfile.email);
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
  }, [isRegistering]);

  const resetVerificationState = () => {
    setVerifiedEmail("");
    setEmailVerified(false);
  };

  const register = async (username, gmail, password) => {
    setIsRegistering(true);
    try {
      const result = await registerUseCase.execute(username, gmail, password);
      setUser(null);
      setUserProfile(null);
      resetVerificationState();
      // Wait a bit before allowing auth state updates again
      setTimeout(() => {
        setIsRegistering(false);
      }, 2000);
      return result;
    } catch (error) {
      setIsRegistering(false);
      console.error('Registration error:', error);
      throw new Error(error.message);
    }
  };

  const login = async (username, password) => {
    try {
      const result = await loginUseCase.execute(username, password);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await logoutUseCase.execute();
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
      await resetPasswordUseCase.execute(gmail);
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.message);
    }
  };

  const setVerifiedEmailState = async (email) => {
    setVerifiedEmail(email);
    setEmailVerified(true);

    if (user?.uid) {
      try {
        await updateVerifiedEmailUseCase.execute(user.uid, email);
      } catch (error) {
        console.error('Error saving verified email:', error);
      }
    }
  };

  const getCurrentUser = async () => {
    return await getCurrentUserUseCase.execute();
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
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};