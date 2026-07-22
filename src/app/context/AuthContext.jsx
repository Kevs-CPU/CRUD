import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import {
  registerUseCase,
  loginUseCase,
  logoutUseCase,
  resetPasswordUseCase,
  updateVerifiedEmailUseCase,
  getCurrentUserUseCase,
  getOrCreateUserProfileUseCase,
  getUsernameUseCase,
  authRepository
} from "../authUseCaseProvider";

console.log("[AuthContext] Loading AuthContext...");

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  console.log("[AuthContext] AuthProvider rendering");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    console.log("[AuthContext] Setting up auth state observer...");

    const unsubscribe = authRepository.observeAuthState(async (firebaseUser) => {
      console.log("[AuthContext] Auth state changed:", {
        uid: firebaseUser?.uid,
        email: firebaseUser?.email,
        displayName: firebaseUser?.displayName
      });

      if (firebaseUser) {
        console.log("[AuthContext] User logged in:", firebaseUser.uid);
        setUser(firebaseUser);

        try {
          console.log("[AuthContext] Getting or creating user profile...");
          const profile = await getOrCreateUserProfileUseCase.execute(firebaseUser);
          setUserProfile(profile);
          console.log("[AuthContext] User profile loaded successfully:", {
            uid: profile?.uid,
            username: profile?.username,
            email: profile?.email
          });
        } catch (error) {
          console.error("[AuthContext] Failed to load user profile:", error);
          setUserProfile(null);
        }
      } else {
        console.log("[AuthContext] No user logged in - clearing state");
        setUser(null);
        setUserProfile(null);
        resetVerificationState();
      }

      setLoading(false);
      console.log("[AuthContext] Loading state set to false");
    });

    return () => {
      console.log("[AuthContext] Cleaning up auth state observer...");
      unsubscribe();
    };
  }, []);

  const resetVerificationState = () => {
    console.log("[AuthContext] Resetting verification state");
    setVerifiedEmail("");
    setEmailVerified(false);
  };

  const register = async (username, gmail, password) => {
    console.log("[AuthContext] Register started:", { username, gmail });
    
    try {
      const result = await registerUseCase.execute(username, gmail, password);
      console.log("[AuthContext] Register successful");
      
      setUser(null);
      setUserProfile(null);
      resetVerificationState();
      
      return result;
    } catch (error) {
      console.error("[AuthContext] Registration failed:", error);
      throw new Error(error.message);
    }
  };

  const login = async (username, password) => {
    console.log("[AuthContext] Login started:", { username });
    
    try {
      const result = await loginUseCase.execute(username, password);
      console.log("[AuthContext] Login successful:", { uid: result?.uid });
      return result;
    } catch (error) {
      console.error("[AuthContext] Login failed:", error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    console.log("[AuthContext] Logout started");
    
    try {
      await logoutUseCase.execute();
      console.log("[AuthContext] Logout successful");
      
      setUser(null);
      setUserProfile(null);
      resetVerificationState();
    } catch (error) {
      console.error("[AuthContext] Logout failed:", error);
      throw new Error(error.message);
    }
  };

  const resetPassword = async (gmail) => {
    console.log("[AuthContext] Reset password started:", { gmail });
    
    try {
      await resetPasswordUseCase.execute(gmail);
      console.log("[AuthContext] Reset password successful");
    } catch (error) {
      console.error("[AuthContext] Reset password failed:", error);
      throw new Error(error.message);
    }
  };

  const setVerifiedEmailState = async (email) => {
    console.log("[AuthContext] Setting verified email:", { 
      email, 
      userId: user?.uid 
    });

    const previousVerifiedEmail = verifiedEmail;
    const previousEmailVerified = emailVerified;

    console.log("[AuthContext] Updating UI state optimistically");
    setVerifiedEmail(email);
    setEmailVerified(true);

    try {
      await updateVerifiedEmailUseCase.execute({
        userId: user?.uid,
        email: email
      });
      
      console.log("[AuthContext] Verified email processed successfully:", email);
    } catch (error) {
      console.error("[AuthContext] Failed to process verified email:", error);
      
      console.log("[AuthContext] Rolling back UI state");
      setVerifiedEmail(previousVerifiedEmail);
      setEmailVerified(previousEmailVerified);
      
      throw error;
    }
  };

  const getCurrentUser = async () => {
    console.log("[AuthContext] Getting current user...");
    try {
      const user = await getCurrentUserUseCase.execute();
      console.log("[AuthContext] Current user:", { uid: user?.uid });
      return user;
    } catch (error) {
      console.error("[AuthContext] Failed to get current user:", error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  const getUsername = () => {
    const username = getUsernameUseCase.execute({ userProfile, user });
    console.log("[AuthContext] getUsername:", username);
    return username;
  };

  const value = {
    user,
    userProfile,
    loading,
    verifiedEmail,
    emailVerified,
    isAuthenticated,
    getUsername,
    login,
    register,
    logout,
    resetPassword,
    getCurrentUser,
    setVerifiedEmailState,
    resetVerificationState,
  };

  console.log("[AuthContext] AuthProvider value updated:", {
    isAuthenticated,
    hasUser: !!user,
    hasProfile: !!userProfile,
    loading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};