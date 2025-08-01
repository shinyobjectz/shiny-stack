// Auth0 User Profile Component for ShinyStack
// This component displays user information from Auth0

import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SignOutButton } from './SignOutButton';
import { User, Mail } from 'lucide-react';

export function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 p-4">
        <div className="animate-pulse bg-gray-200 rounded-full h-10 w-10"></div>
        <div className="animate-pulse bg-gray-200 rounded h-4 w-32"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.picture} alt={user.name || 'User'} />
            <AvatarFallback>
              {user.name ? getInitials(user.name) : <User className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || 'Unknown User'}
            </p>
            {user.email && (
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-1" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <SignOutButton />
        </div>
      </CardContent>
    </Card>
  );
} 