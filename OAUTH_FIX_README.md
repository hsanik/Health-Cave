# OAuth Login Fix - Complete Solution

## Problem
The "account not linked" error occurred when logging out and trying to sign in again with Google/GitHub OAuth providers.

## Root Cause
The issue was caused by using **MongoDB Adapter with JWT session strategy**. This combination doesn't work properly because:
- MongoDB Adapter expects database sessions
- JWT strategy doesn't use the adapter's account linking mechanism
- This creates a conflict where accounts aren't properly linked on subsequent logins

## Solution
**Removed MongoDB Adapter** and implemented manual user management with JWT-only authentication.

### Key Changes:

1. **Removed MongoDB Adapter**
   - No longer using `MongoDBAdapter(clientPromise)`
   - All user/account management is now manual

2. **Simplified signIn Callback**
   - Creates new users directly in the database for OAuth
   - Links existing users by email automatically
   - Tracks OAuth providers in user document

3. **Enhanced JWT Callback**
   - Fetches user data from database on each request
   - Automatically determines and updates user roles
   - Handles both new and existing users

4. **Added Admin Tools**
   - Fix User Roles: Update all user roles
   - Debug Accounts: View all users and OAuth providers
   - Cleanup DB: Remove orphaned adapter collections
   - Clear OAuth: Remove OAuth links for specific users

## How to Fix Your Current Issue

### Step 1: Clean Up Database
1. Login as admin (use email: `admin@healthcave.com`, `admin@example.com`, or `admin@gmail.com`)
2. Go to `/test-auth`
3. Click **"Cleanup DB"** button
4. This will remove all orphaned account/session records

### Step 2: Test OAuth Login
1. Logout completely
2. Go to `/login`
3. Click "Sign in with Google"
4. Should work without "account not linked" error
5. Logout and try again - should still work

### Step 3: Verify
1. Go to `/test-auth`
2. Check your session status
3. Verify your role is correct
4. Click "Debug Accounts" to see all users

## Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String,
  role: String, // 'admin', 'doctor', or 'user'
  password: String, // Only for credentials users
  emailVerified: Date,
  oauthProviders: [String], // ['google', 'github']
  createdAt: Date,
  updatedAt: Date
}
```

### No More Collections Needed
- ❌ accounts (removed - not needed with JWT)
- ❌ sessions (removed - using JWT)
- ❌ verification_tokens (removed - not needed)

## Role Assignment Logic

1. **Admin**: Email matches admin list
   - `admin@healthcave.com`
   - `admin@example.com`
   - `admin@gmail.com`

2. **Doctor**: Email exists in doctors collection

3. **User**: Default role for everyone else

## Testing Checklist

- [ ] First time Google login works
- [ ] Logout and login again with Google works
- [ ] First time GitHub login works
- [ ] Logout and login again with GitHub works
- [ ] Credentials login still works
- [ ] User roles are correctly assigned
- [ ] Dashboard shows correct interface for each role
- [ ] No "account not linked" errors

## Troubleshooting

### Still Getting "Account Not Linked"?
1. Run "Cleanup DB" from `/test-auth`
2. Clear browser cookies/cache
3. Try logging in again

### User Not Found in Database?
1. Check console logs for errors
2. Verify MongoDB connection
3. Run "Debug Accounts" to see all users

### Wrong Role Assigned?
1. Run "Fix User Roles" from `/test-auth`
2. Check if email is in admin list
3. Check if email exists in doctors collection

## Important Notes

- OAuth users are created automatically on first login
- Email is used as the unique identifier
- Multiple OAuth providers can be linked to same email
- Roles are automatically updated on each login
- No manual account linking needed

## Files Modified

1. `src/app/api/auth/[...nextauth]/route.js` - Main NextAuth config
2. `src/app/test-auth/page.jsx` - Admin testing tools
3. `src/app/api/admin/cleanup-database/route.js` - Database cleanup
4. `src/app/api/admin/debug-accounts/route.js` - Debug tool
5. `src/app/api/admin/clear-oauth-accounts/route.js` - Clear OAuth links

## Success Criteria

✅ OAuth login works on first attempt
✅ OAuth login works on subsequent attempts
✅ No "account not linked" errors
✅ Roles are correctly assigned
✅ Dashboard shows correct interface
✅ Can switch between OAuth providers
✅ Credentials login still works
