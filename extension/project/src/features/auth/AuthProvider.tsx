// Auth0 Provider for ShinyStack
// This component provides Auth0 authentication context throughout the app

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // These values should come from environment variables
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id';
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin;

  console.log('Auth0 Config:', { domain, clientId, redirectUri });

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
} 