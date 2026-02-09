import { useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return result.user;
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      setLoading(false);
      return result.user;
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setLoading(false);
      return result.user;
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseSignOut(auth);
      setLoading(false);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading,
    error,
  };
};
