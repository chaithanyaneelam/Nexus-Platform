# JWT Authentication Implementation Guide

## Overview

The Nexus Platform uses JWT (JSON Web Tokens) for secure authentication and authorization. This document explains the complete flow and implementation details.

## Authentication Flow

### 1. User Registration

```
User submits registration form
    ↓
Backend validates user data (email uniqueness, password strength)
    ↓
Password is hashed using bcryptjs (salt rounds: 10)
    ↓
User record created in database
    ↓
JWT token generated with user info
    ↓
Token + User data returned to frontend
    ↓
Frontend stores token in localStorage
```

**Register Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login

```
User submits email + password
    ↓
Backend finds user by email
    ↓
If user not found → "Invalid email or password"
    ↓
If found, compare password with hash using bcryptjs
    ↓
If password invalid → "Invalid email or password"
    ↓
If valid, generate JWT token
    ↓
Return token + user data
    ↓
Frontend stores token in localStorage
```

**Login Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## JWT Token Structure

### Token Payload

```typescript
{
  userId: string; // User's MongoDB ID
  email: string; // User's email
  role: string; // User's role (student/teacher/admin)
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
}
```

### Token Expiry

```
Default: 7 days (can be configured in .env)
Environment Variable: JWT_EXPIRY
Secret Key: JWT_SECRET (from .env)
```

### Example Decoded Token

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "student",
  "iat": 1679874234,
  "exp": 1680479034
}
```

## Frontend Token Management

### 1. Storing Token

```javascript
// In auth.js
setSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  this.token = token;
  this.user = user;
}
```

### 2. Using Token in Requests

```javascript
// In api.js - All authenticated requests include:
options.headers["Authorization"] = `Bearer ${token}`;
```

### 3. Token on Page Load

```javascript
// Auth manager automatically loads from localStorage
constructor() {
  this.user = this.loadUser();      // From localStorage
  this.token = localStorage.getItem("token");
}
```

### 4. Clearing Token on Logout

```javascript
logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  this.token = null;
  this.user = null;
}
```

## Backend Authentication Middleware

### Middleware Chain

```typescript
// Example route:
router.post("/courses", authenticate, isTeacher, (req, res, next) =>
  courseController.createCourse(req, res, next),
);
```

### 1. Authentication Middleware

```typescript
export const authenticate = (req, res, next) => {
  // 1. Extract token from Authorization header
  // 2. Verify token signature and expiry
  // 3. If invalid → 401 Unauthorized
  // 4. If valid → Attach user info to req.user
  // 5. Call next middleware
};
```

**Protected Route Flow:**

```
HTTP Request with Authorization header
    ↓
Extract Bearer token
    ↓
Verify JWT signature (using JWT_SECRET)
    ↓
Check token expiry
    ↓
If invalid/expired → 401 response
    ↓
If valid → Extract userId, email, role
    ↓
Attach to req.user and proceed
```

### 2. Authorization Middleware

```typescript
// isTeacher, isAdmin, isStudent - Check user role
export const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can access this" });
  }
  next();
};
```

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (Browser)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User enters credentials                                 │
│  2. auth.login(email, password)                            │
│  3. API sends POST /auth/login                             │
│  4. Response with token received                           │
│  5. Token stored: localStorage.setItem("token", token)    │
│  6. User data stored: localStorage.setItem("user", ...)   │
│                                                              │
│  On future requests:                                        │
│  - Authorization: Bearer {token}                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           ↕
                    (HTTP Requests)
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. POST /auth/login received                             │
│  2. Validate email + password                              │
│  3. Generate JWT token                                     │
│  4. Return token + user data                               │
│                                                              │
│  For protected routes:                                      │
│  1. Extract Bearer token from header                       │
│  2. Verify token with JWT_SECRET                           │
│  3. If valid → Set req.user                                │
│  4. If invalid → 401 response                              │
│  5. Check role-based access (isTeacher, isAdmin)          │
│  6. If authorized → Execute controller                     │
│  7. If unauthorized → 403 response                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Login Issue Troubleshooting

### Issue: "Invalid email or password" shown even with correct credentials

**Root Cause Analysis:**

1. **User Not Found in Database**
   - Email address doesn't exist in database
   - Solution: Verify user was registered (check MongoDB)

2. **Password Hash Comparison Failed**
   - Wrong password entered
   - Password storage issue (not hashing correctly on registration)
   - Solution: Re-register with new password

3. **API Error Not Properly Returned**
   - Error caught but not showing correct message
   - Solution: Improved error handling in auth.js (now implemented)

### Fix Implemented

Updated `auth.js` login method with better logging:

```javascript
async login(email, password) {
  try {
    const response = await api.login(email, password);

    if (response.success && response.data?.token) {
      this.setSession(response.data.token, response.data.user);
      console.log("✓ Login successful for:", email);
      return { success: true, message: "Login successful!" };
    }

    console.warn("✗ Login failed:", response.message);
    return { success: false, message: response.message || "Login failed" };
  } catch (error) {
    console.error("✗ Login error:", error);

    // Return proper error message
    const errorMessage = error.message || "Login failed";
    return {
      success: false,
      message: errorMessage
    };
  }
}
```

## Course Approval Flow with JWT

### 1. Teacher Creates Course (with JWT)

```
1. Teacher authenticated (JWT token verified)
2. POST /courses with course data
3. middleware: authenticate → isTeacher → courseController
4. Course created with status="draft" and teacherId from token
5. Course NOT visible to students
```

### 2. Admin Reviews Course (with JWT)

```
1. Admin authenticated (JWT token verified)
2. GET /courses/admin/pending
3. middleware: authenticate → isAdmin → courseController
4. Returns all draft courses only
5. Admin can approve or reject
```

### 3. Admin Approves Course (with JWT)

```
1. Admin authenticated (JWT token verified)
2. PATCH /courses/:courseId/approve
3. middleware: authenticate → isAdmin → courseController
4. Course status changed to "published"
5. Course now visible to students
```

## Role-Based Access Control (RBAC)

### Roles Defined

- **student**: Can view published courses, enroll, submit assignments
- **teacher**: Can create courses, view analytics, see enrollments
- **admin**: Can approve courses, manage payments, access admin dashboard

### Middleware Checks

```typescript
// Protected route example
router.post(
  "/courses",
  authenticate, // Must have valid JWT
  isTeacher, // Must have teacher role
  courseController.createCourse,
);
```

### Frontend Redirects

```javascript
// Admin users redirected to admin.html
if (role === "admin") {
  window.location.href = "admin.html";
} else if (role === "teacher") {
  window.location.hash = "#teacher-dashboard";
} else {
  window.location.hash = "#student-dashboard";
}
```

## Session Management

### On Page Load

```javascript
// auth.js constructor
constructor() {
  this.user = this.loadUser();        // From localStorage
  this.token = localStorage.getItem("token");
}

// Check authentication
isAuthenticated() {
  return !!this.token && !!this.user;
}
```

### On Logout

```javascript
// Clear session completely
logout() {
  this.token = null;
  this.user = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Redirect to home
window.location.hash = "#home";
```

### 401 Unauthorized Handling

```javascript
// api.js - When token expires
if (response.status === 401) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "#login";
  throw new Error("Unauthorized. Please login again.");
}
```

## Security Best Practices

✅ **Implemented:**

- JWT tokens stored in localStorage (accessible but not transmitted in cookies)
- Authorization header includes Bearer token
- Token expiry set to 7 days
- Password hashing with bcryptjs (10 rounds)
- Role-based middleware enforcement
- Error messages don't leak user existence information

⚠️ **Recommendations:**

- Consider storing token in httpOnly cookie (more secure than localStorage)
- Implement token refresh mechanism for long sessions
- Set HTTPS for production (protects against man-in-the-middle)
- Add CORS headers properly configured
- Implement rate limiting on login endpoint
- Add 2FA for admin accounts
- Regular token expiry review (currently 7 days)

## Testing JWT Flow

### 1. Test Registration

```bash
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "SecurePass123",
  "role": "student"
}
```

### 2. Test Login

```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "SecurePass123"
}
```

### 3. Test Protected Route

```bash
GET http://localhost:5001/api/auth/profile
Authorization: Bearer {token_from_login}
```

### 4. Test Role-Based Access

```bash
# Teacher can create courses
POST http://localhost:5001/api/courses
Authorization: Bearer {teacher_token}

# Admin can approve courses
PATCH http://localhost:5001/api/courses/{courseId}/approve
Authorization: Bearer {admin_token}

# Student cannot approve courses
PATCH http://localhost:5001/api/courses/{courseId}/approve
Authorization: Bearer {student_token}
# Response: 403 Forbidden
```

## Debugging

### Check Token Validity

```javascript
// In browser console
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Token expires at:", new Date(payload.exp * 1000));
console.log("User role:", payload.role);
```

### Check Server Logs

```bash
# Terminal where backend is running
# Look for:
# ✓ Login successful for: email
# ✗ Login failed/error messages
# ❌ Token verification failed
```

### Network Tab Inspection

```
1. Open Developer Tools (F12)
2. Go to Network tab
3. Login
4. Check POST /auth/login request
5. Response tab should show token
6. Check Authorization header in subsequent requests
```

---

Last Updated: March 21, 2026
