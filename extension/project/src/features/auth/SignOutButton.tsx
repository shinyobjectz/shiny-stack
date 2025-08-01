// Auth0 Sign Out Button for ShinyStack
// This component provides Auth0 sign out functionality

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../../components/ui/button';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const { logout, isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
