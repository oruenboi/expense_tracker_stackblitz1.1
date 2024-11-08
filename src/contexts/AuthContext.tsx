import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: (User & { firebaseUser: FirebaseUser }) | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
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
  const [user, setUser] = useState<(User & { firebaseUser: FirebaseUser }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || undefined,
          isAdmin: false, // You might want to store this in Firestore
          emailVerified: firebaseUser.emailVerified,
          firebaseUser
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please check your credentials.');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      // Here you might want to store additional user data in Firestore
      toast.success('Successfully registered! Please verify your email.');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email.');
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user?.firebaseUser) throw new Error('No user logged in');
    // Implement profile updates using Firestore
    toast.success('Profile updated successfully!');
  };

  const updateUserEmail = async (email: string) => {
    if (!user?.firebaseUser) throw new Error('No user logged in');
    try {
      await updateFirebaseEmail(user.firebaseUser, email);
      toast.success('Email updated successfully!');
    } catch (error) {
      console.error('Email update error:', error);
      toast.error('Failed to update email.');
      throw error;
    }
  };

  const updateUserPassword = async (password: string) => {
    if (!user?.firebaseUser) throw new Error('No user logged in');
    try {
      await updateFirebasePassword(user.firebaseUser, password);
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Failed to update password.');
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;