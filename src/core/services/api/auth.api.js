/**
 * Authentication API Service
 * Handles user authentication with Supabase
 */

import {
  supabase,
  isSupabaseConfigured,
  SUPABASE_URL,
  SUPABASE_KEY,
  isNewSupabaseKeyFormat,
} from './supabase.client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@eefashionita:auth';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const buildAuthHeaders = () => ({
  apikey: SUPABASE_KEY,
  'Content-Type': 'application/json',
});

const parseAuthError = async (response) => {
  const payload = await response.json().catch(() => null);
  const description = payload?.error_description || payload?.message;
  const error = new Error(description || `Supabase auth request failed with status ${response.status}`);
  error.status = response.status;
  error.code = payload?.code;
  return error;
};

const persistSession = async (session) => {
  if (!session) return;
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

const createSessionFromTokens = async (tokens) => {
  if (!tokens?.access_token || !tokens?.refresh_token) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  if (error) {
    throw error;
  }

  if (data?.session) {
    await persistSession(data.session);
    return {
      session: data.session,
      user: data.user ?? data.session.user ?? null,
    };
  }

  const expiresIn = tokens.expires_in ?? 0;
  const expiresAt = tokens.expires_at ?? Math.floor(Date.now() / 1000) + expiresIn;

  const fallbackSession = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: expiresIn,
    expires_at: expiresAt,
    token_type: tokens.token_type ?? 'bearer',
    user: tokens.user ?? null,
  };

  await persistSession(fallbackSession);

  return {
    session: fallbackSession,
    user: fallbackSession.user,
  };
};

const signUpWithNewKey = async (email, password, metadata) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({
      email,
      password,
      data: metadata,
    }),
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  const payload = await response.json().catch(() => ({}));

  if (payload?.access_token && payload?.refresh_token) {
    const { session, user } = await createSessionFromTokens(payload);
    return {
      success: true,
      user: user ?? payload.user ?? null,
      session,
    };
  }

  if (payload?.session) {
    await persistSession(payload.session);
  }

  return {
    success: true,
    user: payload?.user ?? null,
    session: payload?.session ?? null,
  };
};

const signInWithNewKey = async (email, password) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  const payload = await response.json().catch(() => ({}));

  if (!payload?.access_token || !payload?.refresh_token) {
    throw new Error('Supabase did not return session tokens. Please check your Auth settings.');
  }

  const { session, user } = await createSessionFromTokens(payload);

  if (!session) {
    throw new Error('Failed to establish session with Supabase.');
  }

  return {
    success: true,
    user: user ?? payload?.user ?? null,
    session,
  };
};

const resetPasswordWithNewKey = async (email) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw await parseAuthError(response);
  }

  return {
    success: true,
    message: 'Password reset email sent',
  };
};

/**
 * Sign up with email and password
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured. Please update credentials in env.config.js');
    }

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    console.log('[Auth] Attempting sign up for:', email);

    if (isNewSupabaseKeyFormat) {
      return await signUpWithNewKey(normalizeEmail(email), password, metadata);
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      console.error('[Auth] Sign up error:', error);
      throw error;
    }

    if (data.session) {
      await persistSession(data.session);
      console.log('[Auth] Sign up successful with immediate session');
    } else {
      console.log('[Auth] Sign up successful - email confirmation may be required');
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    console.error('[Auth] Sign up error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.message.includes('already registered')) {
      errorMessage = 'This email is already registered. Please sign in instead.';
    } else if (error.message.includes('invalid email')) {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured. Please update credentials in env.config.js');
    }

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    console.log('[Auth] Attempting sign in for:', email);

    if (isNewSupabaseKeyFormat) {
      return await signInWithNewKey(normalizeEmail(email), password);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      console.error('[Auth] Sign in error:', error);
      throw error;
    }

    if (!data.session) {
      throw new Error('No session returned from Supabase');
    }

    await persistSession(data.session);
    console.log('[Auth] Sign in successful');

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    console.error('[Auth] Sign in error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'Please verify your email address before signing in.';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear local storage
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);

    return {
      success: true,
    };
  } catch (error) {
    console.error('[Auth] Sign out error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get current session
 */
export const getSession = async () => {
  try {
    // Try to get from Supabase first
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (session) {
      return session;
    }

    // Fallback to local storage
    const storedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (storedSession) {
      return JSON.parse(storedSession);
    }

    return null;
  } catch (error) {
    console.error('[Auth] Get session error:', error);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('[Auth] Get user error:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (updates) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) throw error;

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error('[Auth] Update profile error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Reset password
 */
export const resetPassword = async (email) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured. Please update credentials in env.config.js');
    }

    if (isNewSupabaseKeyFormat) {
      return await resetPasswordWithNewKey(email);
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;

    return {
      success: true,
      message: 'Password reset email sent',
    };
  } catch (error) {
    console.error('[Auth] Reset password error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('[Auth] State changed:', event);
      
      // Update local storage
      if (session) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }

      // Call callback
      if (callback) {
        callback(event, session);
      }
    }
  );

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};

// Backdoor for future: Social login
// export const signInWithGoogle = async () => { ... };
// export const signInWithFacebook = async () => { ... };
// export const signInWithApple = async () => { ... };

// Backdoor for future: Magic link
// export const signInWithMagicLink = async (email) => { ... };

// Backdoor for future: Phone auth
// export const signInWithPhone = async (phone) => { ... };

export default {
  signUp,
  signIn,
  signOut,
  getSession,
  getCurrentUser,
  updateProfile,
  resetPassword,
  onAuthStateChange,
};

