// Custom hook to integrate Auth0 with Convex authentication
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useCallback, useEffect } from 'react';

export function useConvexAuth() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const signIn = useMutation(api.auth.signIn);
  const signOut = useMutation(api.auth.signOut);

  // Sync Auth0 authentication with Convex
  const syncAuthWithConvex = useCallback(async () => {
    if (isAuthenticated && user) {
      try {
        const token = await getAccessTokenSilently();
        
        // Sign in to Convex with Auth0 token
        await signIn({
          type: "convexCredentials",
          token: token,
          userId: user.sub!, // Auth0 user ID
        });
      } catch (error) {
        console.error('Failed to sync Auth0 with Convex:', error);
      }
    }
  }, [isAuthenticated, user, getAccessTokenSilently, signIn]);

  // Sync authentication when Auth0 state changes
  useEffect(() => {
    syncAuthWithConvex();
  }, [syncAuthWithConvex]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out from Convex:', error);
    }
  }, [signOut]);

  return {
    isAuthenticated,
    user,
    signOut: handleSignOut,
  };
} 