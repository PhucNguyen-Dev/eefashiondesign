import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { onAuthStateChange } from '../core/services/api/auth.api';

// Create the context with a default shape for better autocompletion
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

/**
 * Custom hook to easily access the authentication context.
 * @returns {{user: object | null, isAuthenticated: boolean, isLoading: boolean}}
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * The AuthProvider component wraps your application to provide the authentication context.
 * It manages the user session and authentication state by subscribing to Supabase's auth events.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Supabase's onAuthStateChange is the key to managing session state.
    // It fires once on initial load to get the current session, and then
    // again whenever the authentication state changes (e.g., login, logout).
    const unsubscribe = onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      // The first time this callback fires, we know the initial session
      // state has been determined, so we can stop showing a loading indicator.
      setIsLoading(false);
    });

    // The returned function from useEffect is a cleanup function.
    // It's crucial to unsubscribe from the listener when the component unmounts
    // to prevent memory leaks.
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
  }), [user, isAuthenticated, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
