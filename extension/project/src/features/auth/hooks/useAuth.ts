// Custom Auth0 Hook for ShinyStack
// This hook provides a clean interface for Auth0 authentication

import { useAuth0 } from '@auth0/auth0-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  sub: string;
}

export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    error
  } = useAuth0();

  const signIn = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  const signOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const getToken = async () => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  return {
    // State
    isAuthenticated,
    isLoading,
    user: user as AuthUser | undefined,
    error,
    
    // Actions
    signIn,
    signOut,
    getToken,
    
    // Aliases for consistency
    login: signIn,
    logout: signOut,
    isAuthenticated: isAuthenticated,
    isAuthenticated: isAuthenticated,
  };
} 