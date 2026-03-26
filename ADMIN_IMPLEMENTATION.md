# Complete Admin Panel & Course Approval System - Implementation Guide

## Overview

The Nexus Platform now has a fully functional admin panel with course approval management, payment tracking, and comprehensive JWT authentication. This guide explains all components and how to use them.

## Files Created/Updated

### New Files

1. **nexus-frontend/admin.html** - Dedicated admin panel (standalone page)

### Updated Backend Files

- `src/services/CourseService.ts` - Added admin methods
- `src/controllers/CourseController.ts` - Added admin endpoints
- `src/routes/courseRoutes.ts` - Added admin routes
- `src/middleware/auth.ts` - Proper JWT verification
- `src/utils/jwt.ts` - Token generation and verification

### Updated Frontend Files

- `js/api.js` - Added admin API methods
- `js/router.js` - Updated redirects for admin users
- `js/auth.js` - Improved error logging for login/register
- `css/style.css` - Admin page styling
- `index.html` - Main SPA for student/teacher

## System Architecture

### User Roles & Access

```
┌──────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION (JWT)                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  STUDENT                  TEACHER                ADMIN        │
│  ├─ index.html           ├─ index.html         ├─ admin.html │
│  ├─ View courses         ├─ Create courses     ├─ Approve    │
│  ├─ Enroll courses       ├─ View own courses   ├─ Reject     │
│  ├─ Track progress       ├─ View analytics     ├─ Payments   │
│  └─ Make payments        └─ Edit courses       └─ Analytics  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Course Approval Workflow

### Step 1: Teacher Creates Course

```
1. Teacher logs in (JWT token generated)
2. Goes to "Create New Course"
3. Fills form with:
   - Title (5-100 chars)
   - Description (10-1000 chars)
   - Duration in months (1-60)
   - Price
   - Company name
   - Job role
   - 5-10 Highlights/specifications
4. Submits form
5. Course created with status = "draft"
6. Course appears in "My Courses" as "Draft - Pending Approval"
```

### Step 2: Student Cannot See Draft Courses

```
1. Student logs in
2. Goes to "Courses"
3. Only PUBLISHED courses are shown
4. Draft courses from teachers are hidden
5. Only teacher who created it can see their own draft
```

### Step 3: Admin Approves/Rejects

```
1. Admin logs in → Redirected to admin.html
2. Clicks "📚 Course Approvals" tab
3. Sees all pending (draft) courses
4. Reviews course details and highlights
5. Two options:
   a) APPROVE
      - Status changes: draft → published
      - Course becomes visible to students
      - Teacher sees "Published" in My Courses
   b) REJECT
      - Course is deleted
      - Teacher no longer sees it in My Courses
```

### Step 4: Course Now Live

```
1. Students see published course in course list
2. Can view full details
3. Can enroll and make payment
4. Teacher sees course as "Published" (no further admin action needed)
```

## Access Points

### For Students

```
URL: http://localhost:3000/ (or your frontend port)
Path: index.html
Routes:
- #home              → Home page
- #login             → Login form
- #register          → Registration form
- #courses           → List of published courses (only)
- #course-detail/:id → Full course details
- #my-enrollments    → Courses student enrolled in
- #payment           → Payment tracking
```

### For Teachers

```
URL: http://localhost:3000/ (or your frontend port)
Path: index.html (same as students but different routes)
Routes:
- #home              → Home page with teacher info
- #teacher-dashboard → Teacher overview
- #create-course     → Create new course (appears as draft)
- #my-courses        → Shows draft + published courses
- #course-detail/:id → View own course details
```

### For Admin

```
URL: http://localhost:3000/admin.html (separate page)
Path: admin.html (dedicated page, not SPA)
Features:
- 📚 Course Approvals Tab
  - View all pending courses
  - Review course details
  - Approve button
  - Reject button

- 💰 Payment Management Tab
  - Pending payments count
  - Completed payments count
  - Total revenue
  - Payment transactions table
```

## Course Data Structure

### Published Course (visible to students)

```json
{
  "_id": "course_id",
  "title": "Advanced JavaScript",
  "description": "Learn advanced JS concepts",
  "teacherId": "teacher_id",
  "duration": 3,
  "price": 4999,
  "company": "Tech Corp",
  "role": "Frontend Developer",
  "highlights": [
    "Master ES6+ features",
    "Learn async/await patterns",
    "Real-world project building"
  ],
  "status": "published",
  "isTrending": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Draft Course (only for teacher & admin)

```json
{
  "_id": "course_id",
  "title": "React Masterclass",
  "description": "Complete React guide",
  "teacherId": "teacher_id",
  "duration": 4,
  "price": 5999,
  "company": "Dev Studio",
  "role": "React Developer",
  "highlights": [
    "Component architecture",
    "State management",
    "Testing with Jest"
  ],
  "status": "draft",
  "isTrending": false,
  "createdAt": "2024-01-20T14:22:00Z"
}
```

## API Endpoints

### Public Endpoints (No authentication needed)

```
GET    /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
GET    /api/courses               - Get published courses
GET    /api/courses/trending      - Get trending courses
GET    /api/courses/:courseId     - Get course details
```

### Protected Endpoints (JWT required)

```
# Profile
GET    /api/auth/profile          - Get logged-in user profile
PUT    /api/auth/profile          - Update profile
POST   /api/auth/change-password  - Change password

# Teacher Courses
POST   /api/courses               - Create new course (teacher)
GET    /api/courses/teacher/my-courses - Get teacher's courses (draft+pub)
PUT    /api/courses/:courseId     - Update course (teacher)
DELETE /api/courses/:courseId     - Delete course (teacher)
PATCH  /api/courses/:courseId/publish - Publish course (teacher)

# Admin Courses
GET    /api/courses/admin/pending - Get draft courses (admin)
PATCH  /api/courses/:courseId/approve - Approve course (admin)
PATCH  /api/courses/:courseId/reject  - Reject course (admin)

# Enrollments
POST   /api/enrollments           - Enroll in course
GET    /api/enrollments/my-enrollments - Get my enrollments
PATCH  /api/enrollments/:id/status - Update enrollment status

# Payments
POST   /api/payments              - Create payment
GET    /api/payments              - Get payments (admin)
```

## Login/Logout Flow

### Login Process

```
1. User enters email + password
2. Frontend validates email format
3. POST /api/auth/login sent
4. Backend:
   - Finds user by email
   - If not found → "Invalid email or password"
   - If found, compares password
   - If wrong → "Invalid email or password"
   - If correct → Generates JWT token
5. Frontend receives token + user data
6. localStorage.setItem("token", token)
7. localStorage.setItem("user", JSON.stringify(user))
8. User redirected based on role:
   - Admin → /admin.html
   - Teacher → #teacher-dashboard
   - Student → #student-dashboard
9. Browser console shows: ✓ Login successful for: email@example.com
```

### Logout Process

```
1. User clicks "Logout" link
2. auth.logout() called
3. Session cleared:
   - this.token = null
   - this.user = null
   - localStorage.removeItem("token")
   - localStorage.removeItem("user")
4. Browser console shows: ✓ User logged out: email@example.com
5. User redirected to #home
```

### Token Management

```
On Page Load:
- auth constructor loads token from localStorage
- If token exists → user is already logged in
- auth.isAuthenticated() returns true
- Navbar shows user info + logout button

Protected Routes:
- All requests include: Authorization: Bearer {token}
- Backend middleware verifies token
- If expired → 401 response
- If invalid → 401 response
- localStorage cleared, user redirected to #login
```

## Testing the Complete System

### Test 1: Student Registration & Login

```
1. Go to http://localhost:3000
2. Click "Register here"
3. Fill form:
   - Name: John Student
   - Email: john.student@example.com
   - Password: StudentPass123
   - Role: Student
4. Click "Register"
5. Should see: "✓ Registration successful"
6. Redirected to #student-dashboard
7. Courses list shows only PUBLISHED courses
```

### Test 2: Teacher Registration & Course Creation

```
1. New tab: http://localhost:3000
2. Click "Register here"
3. Fill form:
   - Name: Jane Teacher
   - Email: jane.teacher@example.com
   - Password: TeacherPass123
   - Role: Teacher
4. Register → Redirected to #teacher-dashboard
5. Click "Create New Course"
6. Fill course form with all details
7. Submit → See: "Course created successfully"
8. Go to "My Courses" → See course as "Draft - Pending Approval"
9. Check another student's view → Course NOT visible in course list
```

### Test 3: Admin Approval Process

```
1. New tab: Admin Registration
   - Go to http://localhost:3000
   - Register with role: Admin (if available)
   - Email: admin@nexus.com
   - This might need to be set directly in DB

2. Login as admin
3. Redirected to http://localhost:3000/admin.html
4. See "📚 Course Approvals" tab
5. Click tab → See pending course from teacher
6. Review course details, highlights
7. Click "✓ Approve Course"
8. Toast: "Course approved successfully"
9. Refresh → Course removed from pending list
10. Login as teacher → See course now "Published"
11. Login as student → See course in course list
```

### Test 4: Reject Course

```
1. Teacher creates another course
2. Login as admin
3. Go to admin.html
4. See pending course
5. Click "✗ Reject Course"
6. Confirm dialog
7. Course deleted
8. Teacher no longer sees it in "My Courses"
```

### Test 5: Login Issue Fix

```
1. Create account with email: test@example.com, password: Password123
2. Register successfully
3. Logout
4. Try login with SAME credentials
5. Should work now (not show "invalid")
6. Check console: ✓ Login successful for: test@example.com
```

## Database Setup for Admin

### Creating Admin User (Direct MongoDB)

```javascript
// In MongoDB shell or Mongo Express
db.users.insertOne({
  name: "System Admin",
  email: "admin@nexus.com",
  password: "$2a$10$...", // bcryptjs hashed password
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
});

// OR use test API endpoint to register admin
```

### Getting Admin Role in Registration

Currently role selection in registration form has: Student, Teacher
To add Admin role option:

1. Update registration form in router.js
2. Update backend role validation
3. Or create admin through manual DB entry
4. Or make registration endpoint create admin with special code

## Environment Configuration

### Backend (.env)

```
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=7d
MONGODB_URI=mongodb://localhost:27017/nexus
PORT=5001
NODE_ENV=development
```

### Frontend Configuration

```javascript
// In js/api.js
const API_BASE_URL = "http://localhost:5001/api"; // Change if backend port differs
```

## Common Issues & Solutions

### Issue 1: "Invalid email or password" on correct credentials

**Solution:**

- Check user was registered (search MongoDB)
- Try re-registering with new password
- Check browser console for error details

### Issue 2: Admin not redirected to admin.html

**Solution:**

- Ensure user has role="admin" in database
- Check localStorage shows role="admin"
- Clear cache, refresh browser

### Issue 3: Teacher can't see their draft course

**Solution:**

- Go to "My Courses" (not "Courses")
- "My Courses" shows draft + published
- "Courses" shows published only (for students)

### Issue 4: Token expired error

**Solution:**

- Clear localStorage and login again
- Or wait for backend to refresh token (if implemented)

### Issue 5: CORS errors on requests

**Solution:**

- Ensure backend CORS is configured
- Check API_BASE_URL matches backend port
- Test with curl: `curl -H "Authorization: Bearer {token}" http://localhost:5001/api/auth/profile`

## File Structure Summary

```
Nexus Platform/
├── nexus-frontend/
│   ├── index.html           (SPA for student/teacher)
│   ├── admin.html           (Admin panel - standalone)
│   ├── js/
│   │   ├── api.js           (API client with auth)
│   │   ├── auth.js          (JWT session management)
│   │   └── router.js        (SPA routing)
│   └── css/
│       └── style.css        (All styling)
│
├── nexus-upskill/
│   └── src/
│       ├── controllers/
│       │   └── CourseController.ts  (Admin methods added)
│       ├── services/
│       │   └── CourseService.ts     (Admin methods added)
│       ├── routes/
│       │   └── courseRoutes.ts      (Admin routes added)
│       ├── middleware/
│       │   └── auth.ts              (JWT verification)
│       └── utils/
│           └── jwt.ts               (Token ops)
│
└── Documentation/
    ├── JWT_AUTHENTICATION.md         (JWT detailed guide)
    ├── COURSE_APPROVAL_SYSTEM.md    (Course flow guide)
    └── ADMIN_IMPLEMENTATION.md      (This file)
```

## Next Steps / Future Enhancements

1. ✅ Course approval system
2. ✅ Admin panel with JWT auth
3. ✅ Draft course hiding from students
4. ⏳ Payment gateway integration (Stripe/Razorpay)
5. ⏳ Email notifications for approvals
6. ⏳ Course revision system before rejection
7. ⏳ Payment dispute resolution
8. ⏳ Teacher disbursement dashboard
9. ⏳ Analytics and reporting
10. ⏳ Course certificates

## Debugging Commands

### Frontend Console

```javascript
// Check auth status
console.log(auth.isAuthenticated());
console.log(auth.getCurrentUser());
console.log(localStorage.getItem("token"));

// Check role
console.log(auth.getUserRole());
console.log(auth.isAdmin());
console.log(auth.isTeacher());
console.log(auth.isStudent());

// Decode token
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Token payload:", payload);
console.log("Expires:", new Date(payload.exp * 1000));
```

### Backend Testing

```bash
# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'

# Test protected route
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer {token}"

# Test admin endpoint
curl -X GET http://localhost:5001/api/courses/admin/pending \
  -H "Authorization: Bearer {admin_token}"
```

---

Last Updated: March 21, 2026
Version: 1.0
