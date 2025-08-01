// Auth0 Sign In Form for ShinyStack
// This component provides Auth0 authentication UI

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export function SignInForm() {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleSignIn = () => {
    loginWithRedirect({
      appState: {
        returnTo: window.location.pathname
      }
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to ShinyStack</CardTitle>
        <CardDescription>
          Sign in to access your account and start building amazing applications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Signing in...' : 'Sign In with Auth0'}
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          <p>Secure authentication powered by Auth0</p>
        </div>
      </CardContent>
    </Card>
  );
}
