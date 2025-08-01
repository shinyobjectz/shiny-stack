// Auth0 Auth Guard Component for ShinyStack
// This component protects routes that require authentication

import { useAuth0 } from '@auth0/auth0-react';
import { ReactNode } from 'react';
import { SignInForm } from '../SignInForm';
import { useConvexAuth } from '../hooks/useConvexAuth';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ 
  children, 
  fallback,
  requireAuth = true 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth0();
  // Initialize Convex auth sync
  useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-400"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen p-8 bg-stone-950">
        <div className="w-full max-w-md mx-auto">
          <SignInForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 