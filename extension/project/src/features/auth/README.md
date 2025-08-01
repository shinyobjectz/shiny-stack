# Auth Feature - Auth0 Integration

This feature provides authentication using Auth0 for the ShinyStack application.

## 🚀 Setup

### 1. Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application
3. Choose "Single Page Application"
4. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:3000
VITE_AUTH0_AUDIENCE=your-api-identifier
```

### 3. Usage

The auth feature is automatically integrated into the app. Components include:

- **AuthProvider**: Wraps the app with Auth0 context
- **AuthGuard**: Protects routes requiring authentication
- **SignInForm**: Displays the sign-in interface
- **SignOutButton**: Allows users to sign out
- **UserProfile**: Shows user information

## 📁 Structure

```
auth/
├── AuthProvider.tsx          # Auth0 provider wrapper
├── SignInForm.tsx           # Sign-in form component
├── SignOutButton.tsx        # Sign-out button component
├── UserProfile.tsx          # User profile display
├── components/
│   └── AuthGuard.tsx        # Route protection component
├── hooks/
│   └── useAuth.ts           # Custom auth hook
└── README.md               # This file
```

## 🔧 Components

### AuthProvider
Wraps the application with Auth0 context and configuration.

### AuthGuard
Protects routes that require authentication. Automatically redirects to sign-in if not authenticated.

### SignInForm
Provides a clean sign-in interface using Auth0's universal login.

### SignOutButton
Allows users to sign out securely.

### UserProfile
Displays user information including name, email, and avatar.

## 🎣 Hooks

### useAuth
Custom hook that provides a clean interface for Auth0 functionality:

```typescript
const { user, isAuthenticated, signIn, signOut, getToken } = useAuth();
```

## 🔒 Security Features

- **Secure token handling** with automatic refresh
- **Route protection** with AuthGuard
- **Automatic redirect** after authentication
- **Secure logout** with proper cleanup
- **Token-based API access** for backend calls

## 🎨 Styling

All components use the ShinyStack design system with:
- Consistent styling with the rest of the app
- Responsive design
- Dark theme support
- Loading states and animations

## 🔄 Integration

The auth feature integrates seamlessly with:
- **ShinyStack config system** for auth settings
- **Convex backend** for user data
- **React Router** for navigation
- **Toast notifications** for user feedback 