/**
 * useAuth Hook
 * Custom hook for authentication with Supabase
 * Provides signUp, signIn, signOut, and auth state management
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabase/supabase.client';
import {
  signUp as apiSignUp,
  signIn as apiSignIn,
  signOut as apiSignOut,
  resetPassword as apiResetPassword,
} from '../api/supabase/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@eefashionita:auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sign Up
  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useAuth] Starting sign up for:', email);

      const result = await apiSignUp(email, password, metadata);

      if (result.success) {
        if (result.user || result.session?.user) {
          setUser(result.user ?? result.session?.user ?? null);
          setIsAuthenticated(true);
        }
      } else {
        setUser(result.user ?? result.session?.user ?? null);
        setError(result.error);
      }

      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('[useAuth] Sign up exception:', err);
      const errorMessage = err.message || 'An unexpected error occurred during sign up';
      setError(errorMessage);
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Sign In
  const signIn = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useAuth] Starting sign in for:', email);

      const result = await apiSignIn(email, password);

      if (result.success) {
        if (result.user || result.session?.user) {
          setUser(result.user ?? result.session?.user ?? null);
          setIsAuthenticated(true);
        }
      } else {
        setUser(result.user ?? result.session?.user ?? null);
        setError(result.error);
      }

      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('[useAuth] Sign in exception:', err);
      const errorMessage = err.message || 'An unexpected error occurred during sign in';
      setError(errorMessage);
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useAuth] Starting sign out');

      const result = await apiSignOut();

      if (result.success) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        setIsAuthenticated(false);
        console.log('[useAuth] Sign out successful');
      } else {
        setError(result.error);
      }

      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('[useAuth] Sign out exception:', err);
      const errorMessage = err.message || 'An unexpected error occurred during sign out';
      setError(errorMessage);
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Reset Password
  const resetPassword = useCallback(async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useAuth] Sending password reset email to:', email);

      const result = await apiResetPassword(email);

      if (result.success) {
        console.log('[useAuth] Password reset email sent successfully');
      } else {
        setError(result.error);
      }

      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('[useAuth] Reset password exception:', err);
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    console.log('[useAuth] Setting up auth state listener');

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[useAuth] Initial session:', session ? 'Found' : 'None');
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Auth state changed:', event, session ? 'Session exists' : 'No session');

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('[useAuth] User signed in');
          setUser(session.user);
          setIsAuthenticated(true);
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        } else if (event === 'SIGNED_OUT') {
          console.log('[useAuth] User signed out');
          setUser(null);
          setIsAuthenticated(false);
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('[useAuth] Token refreshed');
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('[useAuth] User updated');
          setUser(session.user);
        }

        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      console.log('[useAuth] Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
  };
};

export default useAuth;
