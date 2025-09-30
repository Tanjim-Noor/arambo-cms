# Arambo CMS Authentication Implementation

This document describes the complete JWT authentication system implemented for the Arambo CMS frontend application.

## 🚀 Features Implemented

### 1. Authentication Context (`contexts/auth-context.tsx`)
- **JWT Token Management**: Secure token storage in sessionStorage
- **Auto-logout on expiry**: Automatic session management with 15-minute expiry
- **Global auth state**: React Context for application-wide authentication state
- **Error handling**: Comprehensive error handling for login/logout operations

### 2. Login Page (`src/app/login/page.tsx`)
- **Secure login form**: Username/password authentication
- **Token validation**: JWT token handling with automatic redirect
- **User feedback**: Toast notifications for success/error states
- **Password visibility toggle**: Enhanced UX for password input

### 3. Protected Routes (`components/auth/protected-route.tsx`)
- **Route protection**: HOC and wrapper component for protected pages
- **Automatic redirect**: Unauthenticated users redirect to login
- **Loading states**: Proper loading indicators during auth checks

### 4. Enhanced API Client (`lib/api.ts`)
- **Automatic auth headers**: Bearer token injection for protected endpoints
- **Selective protection**: Only PUT/DELETE operations require authentication
- **Token expiry handling**: Automatic logout on 401 responses
- **Auth endpoints**: Login, verify, status, logout, and health check APIs

### 5. Updated UI Components
- **Header component**: Admin profile display and logout functionality
- **Dashboard layout**: Protected route wrapper
- **Root layout**: AuthProvider and Toaster integration

## 🔒 Security Features

### Token Management
- **SessionStorage**: Secure client-side token storage
- **Automatic expiry**: 15-minute token lifetime with auto-cleanup
- **Expiry validation**: Client-side token expiry checking

### API Security
- **Bearer token authentication**: Industry-standard JWT implementation
- **Selective protection**: Public GET/POST, protected PUT/DELETE
- **Automatic logout**: Invalid/expired token handling

### Route Protection
- **Client-side guards**: Protected route components
- **Redirect handling**: Automatic login page redirection
- **Loading states**: Secure authentication state management

## 📋 Authentication Flow

1. **Initial Access**: User visits any route → Auth check → Redirect to login if unauthenticated
2. **Login Process**: Username/Password → JWT token → Store in sessionStorage → Redirect to dashboard
3. **Protected Operations**: PUT/DELETE requests → Auto-inject Bearer token → Handle auth errors
4. **Token Expiry**: Auto-logout after 15 minutes → Clear session → Redirect to login
5. **Manual Logout**: User clicks logout → Call logout API → Clear session → Redirect to login

## 🎯 Protected vs Public Operations

### 🔓 Public (No Authentication Required)
- `GET /properties` - View properties
- `GET /trips` - View trips  
- `GET /trucks` - View trucks
- `GET /furniture` - View furniture
- `POST /properties` - Create properties
- `POST /trips` - Create trips
- `POST /trucks` - Create trucks  
- `POST /furniture` - Create furniture

### 🔒 Protected (Authentication Required)
- `PUT /properties/:id` - Update properties
- `PUT /trips/:id` - Update trips
- `PUT /trucks/:id` - Update trucks
- `PUT /furniture/:id` - Update furniture
- `DELETE /properties/:id` - Delete properties
- `DELETE /trips/:id` - Delete trips
- `DELETE /trucks/:id` - Delete trucks
- `DELETE /furniture/:id` - Delete furniture

## 🏗️ File Structure

```
src/
├── contexts/
│   └── auth-context.tsx         # Authentication context and token management
├── components/
│   ├── auth/
│   │   ├── protected-route.tsx  # Route protection component
│   │   └── auth-status.tsx      # Authentication status display
│   └── layout/
│       └── header.tsx           # Updated header with logout
├── app/
│   ├── login/
│   │   └── page.tsx             # Admin login page
│   ├── (dashboard)/
│   │   └── layout.tsx           # Protected dashboard layout
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Home page with auth redirect
├── lib/
│   └── api.ts                   # Enhanced API client with auth
└── middleware.ts                # Optional route middleware
```

## 🔧 Configuration

### Environment Variables
```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional
NODE_ENV=development
```

### Backend Requirements
- JWT authentication endpoint: `POST /auth/login`
- Token verification: `GET /auth/verify`
- Logout endpoint: `POST /auth/logout`
- Auth status: `GET /auth/status`
- Health check: `GET /auth/health`

## 🚦 Usage Examples

### Using Protected Routes
```tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  )
}
```

### Using Auth Context
```tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { isAuthenticated, admin, logout } = useAuth()
  
  if (!isAuthenticated) return <div>Please log in</div>
  
  return (
    <div>
      Welcome, {admin?.username}!
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Making Authenticated API Calls
```tsx
// The API client automatically handles authentication
import { api } from '@/lib/api'

// This will automatically include Bearer token for PUT/DELETE
await api.properties.update(id, data)
await api.properties.delete(id)

// These remain public
const properties = await api.properties.getAll()
await api.properties.create(data)
```

## 🔍 Testing

### Manual Testing
1. **Start the application**: `npm run dev`
2. **Visit homepage**: Should redirect to login page
3. **Login with admin credentials**: Should redirect to dashboard
4. **Try CRUD operations**: Create/Read should work, Update/Delete require auth
5. **Wait 15 minutes**: Should auto-logout
6. **Manual logout**: Should clear session and redirect

### Backend Requirements for Testing
- Backend server running on `http://localhost:4000`
- Admin user created with credentials
- JWT authentication endpoints configured
- CORS configured for frontend origin

## 🛠️ Troubleshooting

### Common Issues

1. **"Authentication Required" errors**
   - Check if backend is running
   - Verify JWT_SECRET is configured
   - Ensure admin user exists

2. **CORS errors**
   - Configure backend CORS for `http://localhost:3000`
   - Check `NEXT_PUBLIC_API_URL` environment variable

3. **Token expiry issues**
   - Check backend JWT_EXPIRES_IN setting (default: 15m)
   - Verify token validation logic

4. **Redirect loops**
   - Check protected route configuration
   - Verify authentication context initialization

## 📝 Future Enhancements

1. **Refresh Tokens**: Implement automatic token refresh
2. **Remember Me**: Optional persistent login
3. **Multi-factor Authentication**: Additional security layer
4. **Role-based Access**: Different permission levels
5. **Session Management**: Track active sessions
6. **Audit Logging**: Track authentication events

## 🔐 Security Best Practices

- ✅ Short token expiry (15 minutes)
- ✅ Secure sessionStorage usage
- ✅ Automatic token cleanup
- ✅ HTTPS enforcement (production)
- ✅ Selective API protection
- ✅ Client-side route guards
- ✅ Error handling without sensitive data exposure