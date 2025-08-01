# Auth0 Integration with Convex Setup Guide

This guide will help you set up Auth0 authentication with your Convex backend.

## Prerequisites

1. An Auth0 account and tenant
2. A Convex project
3. Your application running locally

## Step 1: Create Auth0 Application

1. Go to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Single Page Application** (SPA)
5. Give it a name (e.g., "ShinyStack App")
6. Click **Create**

## Step 2: Configure Auth0 Application

1. In your Auth0 application settings, note down:
   - **Domain** (e.g., `your-tenant.auth0.com`)
   - **Client ID**
   - **Client Secret**

2. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:5173, http://localhost:5173/`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
   - **Allowed Origins (CORS)**: `http://localhost:5173`

3. In **Advanced Settings** → **OAuth**:
   - Set **JsonWebToken Signature Algorithm** to `RS256`
   - Enable **Refresh Token Rotation**

## Step 3: Set Environment Variables

### Frontend Environment Variables (.env.local)

Create a `.env.local` file in your project root:

```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
VITE_AUTH0_AUDIENCE=your-api-identifier
VITE_CONVEX_URL=your-convex-url
```

### Convex Environment Variables

In your Convex dashboard, go to **Settings** → **Environment Variables** and add:

```env
CONVEX_SITE_URL=http://localhost:5173
```

**Note**: We're using a custom integration where Auth0 handles authentication and we sync the Auth0 tokens with Convex using the ConvexCredentials provider.

## Step 4: Update Auth0 Application Settings

1. In your Auth0 application, go to **Settings**
2. Add these URLs to **Allowed Callback URLs**:
   ```
   http://localhost:5173,
   http://localhost:5173/,
   https://your-convex-url.convex.cloud/auth/callback
   ```

3. Add these URLs to **Allowed Logout URLs**:
   ```
   http://localhost:5173,
   https://your-convex-url.convex.cloud/auth/logout
   ```

## Step 5: How the Integration Works

This setup uses a hybrid approach:

1. **Auth0 handles authentication**: Users sign in through Auth0's secure authentication flow
2. **Custom sync with Convex**: The `useConvexAuth` hook automatically syncs Auth0 authentication with Convex
3. **ConvexCredentials provider**: Convex uses the ConvexCredentials provider to accept Auth0 tokens
4. **Seamless user experience**: Users only need to authenticate once with Auth0

## Step 6: Test the Integration

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:5173`
3. You should see the Auth0 login page when trying to access protected routes
4. After successful authentication, you should be redirected back to your app
5. The authentication will be automatically synced with Convex

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Auth0 application has the correct origins configured
2. **Redirect URI Mismatch**: Ensure the callback URLs in Auth0 match exactly with your app URLs
3. **Environment Variables**: Double-check that all environment variables are set correctly
4. **Convex URL**: Make sure your `VITE_CONVEX_URL` is correct and includes the full URL

### Debug Steps

1. Check browser console for any authentication errors
2. Verify Auth0 application settings match your environment
3. Ensure Convex environment variables are set correctly
4. Check that the Auth0 domain and client ID match between frontend and backend

## Security Notes

- Never commit your `.env.local` file to version control
- Use different Auth0 applications for development and production
- Regularly rotate your Auth0 client secrets
- Use HTTPS in production environments

## Production Deployment

When deploying to production:

1. Create a new Auth0 application for production
2. Update all environment variables with production values
3. Update callback and logout URLs to your production domain
4. Ensure your production domain is added to Auth0 allowed origins 