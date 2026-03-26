# Quick Reference Guide - Admin Panel & Course Approval

## 🚀 Quick Start (5 Minutes)

### 1. Verify Backend Running

```bash
cd nexus-upskill
npm run dev
# Should start on http://localhost:5001
```

### 2. Verify Frontend Running

```bash
# Open nexus-frontend/index.html in browser
# Or set up a simple server if needed
```

### 3. Create Test Accounts

**Student Account:**

- Go to http://localhost:3000 → Register
- Email: student@test.com
- Password: TestPass123
- Role: Student

**Teacher Account:**

- Go to http://localhost:3000 → Register
- Email: teacher@test.com
- Password: TestPass123
- Role: Teacher

**Admin Account:**

- Go to http://localhost:3000 → Register (if role selection available)
- Email: admin@test.com
- Password: TestPass123
- Role: Admin

_If Admin role not in dropdown, set directly in MongoDB:_

```javascript
db.users.updateOne({ email: "admin@test.com" }, { $set: { role: "admin" } });
```

---

## 📚 Course Approval Flow

```
TEACHER                    ADMIN                    STUDENT
   │                         │                         │
   ├─ Login ────────────────→│                         │
   │                         │                         │
   ├─ Create Course          │                         │
   │  (status="draft")        │                         │
   │                         │                         │
   └─ See as "Draft"         │                         │
      in "My Courses"         │                         │
                             │                         │
                      ┌──────┴──────┐                  │
                      │ Login to    │                  │
                      │ admin.html  │                  │
                      └──────┬──────┘                  │
                             │                         │
                      ┌──────▼──────┐                  │
                      │ View pending │                 │
                      │ courses      │                 │
                      └──────┬──────┘                  │
                             │                         │
              ┌──────────────┤                         │
              │              │                         │
              ▼              ▼                         │
         [Approve]      [Reject]                     │
              │              │                         │
              ▼              ▼                         │
         Published        Deleted                    │
              │              │                         │
              └──────────────┼───────────────────────→│
                             │                    See published
                             │                    course in list
                             │                         │
```

---

## 🔑 Role-Based Access

### STUDENT

- ✅ Can view published courses
- ✅ Can enroll in courses
- ✅ Can make payments
- ✅ Can track progress
- ❌ Cannot create courses
- ❌ Cannot see draft courses
- ❌ Cannot access admin panel

### TEACHER

- ✅ Can create courses (status=draft)
- ✅ Can view all own courses (draft+published)
- ✅ Can edit own courses
- ✅ Can see course analytics
- ✅ Can view published courses
- ❌ Cannot approve courses
- ❌ Cannot see other teacher's courses
- ❌ Cannot access admin panel

### ADMIN

- ✅ Can view all pending (draft) courses
- ✅ Can approve courses (draft→published)
- ✅ Can reject courses (delete)
- ✅ Can view payment transactions
- ✅ Can access admin.html
- ✅ Can view all users (if implemented)
- ❌ Cannot create courses directly
- ❌ Cannot access student/teacher features

---

## 💾 Data Model

### Course Status Values

```
"draft"     → Created by teacher, not yet approved
"published" → Approved by admin, visible to students
```

### Course Document

```json
{
  "_id": "ObjectId",
  "title": "Course Title",           // 5-100 chars
  "description": "Course desc",       // 10-1000 chars
  "duration": 3,                      // months (1-60)
  "price": 4999,                      // in paise
  "company": "Company Name",
  "role": "Job Role",
  "highlights": [                     // 5-10 items, 5-500 chars each
    "Highlight 1",
    "Highlight 2"
  ],
  "teacherId": "ObjectId",
  "status": "draft" or "published",
  "createdAt": "2024-01-15T...",
  "updatedAt": "2024-01-15T..."
}
```

### User Roles

```
"student" → Enrolled in courses, makes payments
"teacher" → Creates and manages courses
"admin"   → Approves courses, manages platform
```

---

## 🌐 API Quick Reference

### Authentication

```javascript
// Create account
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "student|teacher|admin"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "Password123"
}
// Returns: { token, user }
// Store: localStorage.setItem("token", token)

// Get profile
GET /api/auth/profile
Headers: Authorization: Bearer {token}
```

### Courses (Teacher)

```javascript
// Create course (sets status="draft")
POST /api/courses
{
  "title": "...",
  "description": "...",
  "duration": 3,
  "price": 4999,
  "company": "...",
  "role": "...",
  "highlights": ["...", "...", "..."]
}

// Get my courses (draft + published)
GET /api/courses/teacher/my-courses

// Update my course
PUT /api/courses/{courseId}

// Delete my course
DELETE /api/courses/{courseId}
```

### Courses (Admin)

```javascript
// Get pending courses (status="draft")
GET /api/courses/admin/pending?page=1&limit=10

// Approve course (draft → published)
PATCH /api/courses/{courseId}/approve

// Reject course (delete)
PATCH /api/courses/{courseId}/reject
```

### Courses (Student)

```javascript
// Get published courses only
GET /api/courses?page=1&limit=10

// Get course details
GET /api/courses/{courseId}

// Get trending courses
GET /api/courses/trending
```

---

## 🎯 Frontend URLs

### For Admin

```
Admin Login: http://localhost:3000
Registration: http://localhost:3000#register
After Login Redirect: http://localhost:3000/admin.html
```

### For Teacher

```
Teacher Login: http://localhost:3000
Dashboard: http://localhost:3000#teacher-dashboard
Create Course: http://localhost:3000#create-course
My Courses: http://localhost:3000#my-courses
```

### For Student

```
Student Login: http://localhost:3000
Dashboard: http://localhost:3000#student-dashboard
Course List: http://localhost:3000#courses
Course Details: http://localhost:3000#course-detail/{id}
My Enrollments: http://localhost:3000#my-enrollments
```

---

## 🔍 Browser Console Debugging

```javascript
// Check if logged in
auth.isAuthenticated(); // true/false

// Get current user
auth.getCurrentUser(); // {id, name, email, role}

// Get role
auth.getUserRole(); // "student" | "teacher" | "admin"

// Get token
localStorage.getItem("token");

// Inspect token payload
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log(payload);

// Clear session (logout)
auth.logout();
```

---

## ✅ Testing Checklist

- [ ] Student can see only published courses
- [ ] Teacher can create course (appears as draft)
- [ ] Teacher's own draft course visible in "My Courses"
- [ ] Draft course NOT visible in student's course list
- [ ] Admin can access admin.html
- [ ] Admin can see pending courses
- [ ] Admin can approve course (becomes published)
- [ ] After approval, student can see course
- [ ] Teacher course status changes to "Published"
- [ ] Admin can reject course
- [ ] Rejected course deleted
- [ ] Login/logout logs appear in console
- [ ] JWT token stored in localStorage
- [ ] Token includes userId, email, role, iat, exp

---

## 🚨 Common Errors

| Error                                              | Cause                                  | Fix                                                       |
| -------------------------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| "Cannot read property 'token' of undefined"        | auth object not initialized            | Include `<script src="js/auth.js"></script>` before usage |
| "Invalid email or password" on correct creds       | User not registered properly           | Re-register or check DB                                   |
| Admin redirects to #admin-dashboard not admin.html | auth.redirectToDashboard() not updated | Check router.js for `window.location.href = "admin.html"` |
| "401 Unauthorized" on API calls                    | Missing/invalid token                  | Re-login, check localStorage                              |
| CORS error on requests                             | Backend CORS not configured            | Check Express CORS middleware                             |

---

## 📁 Key Files Reference

| File                | Purpose               | Key Functions                                         |
| ------------------- | --------------------- | ----------------------------------------------------- |
| admin.html          | Admin panel UI        | loadPendingCourses(), approveCourse(), rejectCourse() |
| router.js           | Frontend routing      | redirectToDashboard(), renderAdminApproveCourses()    |
| auth.js             | Auth management       | login(), logout(), isAuthenticated()                  |
| api.js              | API client            | getPendingCourses(), approveCourse(), rejectCourse()  |
| CourseService.ts    | Course business logic | getPendingCourses(), approveCourse(), rejectCourse()  |
| CourseController.ts | Course HTTP handlers  | getPendingCourses(), approveCourse(), rejectCourse()  |
| courseRoutes.ts     | Course endpoints      | /admin/pending, /:id/approve, /:id/reject             |

---

## 📞 Support

For detailed documentation, see:

- `ADMIN_IMPLEMENTATION.md` - Full implementation guide
- `JWT_AUTHENTICATION.md` - JWT token details and debugging
- `COURSE_APPROVAL_SYSTEM.md` - Course workflow documentation

---

**Last Updated:** March 21, 2024  
**Version:** 1.0  
**Status:** ✅ Production Ready
