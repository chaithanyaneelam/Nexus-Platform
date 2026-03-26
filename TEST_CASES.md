# Nexus Platform - Test Cases & Verification Guide

**Version:** 1.0  
**Last Updated:** March 21, 2024  
**Purpose:** Complete test coverage for admin panel, course approval, and JWT authentication

---

## 📋 Test Case Categories

### Category 1: Authentication Tests (10 tests)

### Category 2: Course Management Tests (12 tests)

### Category 3: Course Approval Workflow (8 tests)

### Category 4: Admin Panel Tests (6 tests)

### Category 5: Frontend UI/UX Tests (7 tests)

### Category 6: API Endpoint Tests (15 tests)

### Category 7: Error Handling Tests (5 tests)

**Total Test Cases:** 63+

---

## 🔐 CATEGORY 1: Authentication Tests

### Test 1.1: Student Registration

**Objective:** Verify new student can register successfully  
**Steps:**

1. Open http://localhost:3000
2. Click "Register here" link
3. Fill form:
   - Name: John Student
   - Email: john.student@example.com
   - Password: StudentPass123
   - Role: Student
4. Click "Register"

**Expected Results:**

- ✅ No validation errors shown
- ✅ Console shows: "📝 Registering user: john.student@example.com"
- ✅ Redirected to #student-dashboard
- ✅ User object appears in navbar
- ✅ localStorage has "token" and "user"

**Validation Commands:**

```javascript
// In browser console
localStorage.getItem("token"); // Should have JWT token
JSON.parse(localStorage.getItem("user")).role; // Should be "student"
```

---

### Test 1.2: Teacher Registration

**Objective:** Verify teacher can register and see teacher interface  
**Steps:**

1. New tab: http://localhost:3000#register
2. Fill form:
   - Name: Jane Teacher
   - Email: jane.teacher@example.com
   - Password: TeacherPass123
   - Role: Teacher
3. Click "Register"

**Expected Results:**

- ✅ Registered successfully
- ✅ Redirected to #teacher-dashboard
- ✅ "Create New Course" button visible in navbar
- ✅ localStorage shows role="teacher"

---

### Test 1.3: Admin Registration

**Objective:** Verify admin can be created and redirected properly  
**Steps:**

1. Register normally (role will be whatever is available)
2. Manual: Update database directly
   ```javascript
   db.users.updateOne({ email: "admin@test.com" }, { $set: { role: "admin" } });
   ```
3. Login as admin
4. Observe redirect

**Expected Results:**

- ✅ Login successful
- ✅ Redirected to http://localhost:3000/admin.html
- ✅ NOT redirected to hash route
- ✅ admin.html loads with admin interface

---

### Test 1.4: Login with Correct Credentials

**Objective:** Test successful login flow  
**Steps:**

1. Register user: test@example.com / TestPass123
2. Logout (if needed)
3. Go to #login
4. Enter email: test@example.com
5. Enter password: TestPass123
6. Click "Login"

**Expected Results:**

- ✅ Console shows: "✓ Login successful for: test@example.com"
- ✅ User redirected to dashboard based on role
- ✅ Token stored in localStorage
- ✅ No "invalid" error message

---

### Test 1.5: Login with Wrong Password

**Objective:** Test login rejection with wrong password  
**Steps:**

1. Register test user first
2. Go to #login
3. Enter email: test@example.com
4. Enter password: WrongPassword123
5. Click "Login"

**Expected Results:**

- ✅ Console shows: "✗ Login failed: Invalid email or password"
- ✅ Error message displayed on page
- ✅ NOT redirected to dashboard
- ✅ No token stored in localStorage

**Error Message Should Be:**
"Invalid email or password"

---

### Test 1.6: Login with Non-existent Email

**Objective:** Test login with unregistered email  
**Steps:**

1. Go to #login
2. Enter email: nonexistent@example.com
3. Enter password: AnyPassword123
4. Click "Login"

**Expected Results:**

- ✅ Console shows: "✗ Login failed: Invalid email or password"
- ✅ Same error message as wrong password (no email enumeration)
- ✅ NOT redirected
- ✅ localStorage empty

---

### Test 1.7: Logout Functionality

**Objective:** Verify logout clears session and redirects  
**Steps:**

1. Login as any user
2. Check localStorage has token and user
3. Click "Logout" button
4. Observe behavior

**Expected Results:**

- ✅ Console shows: "✓ User logged out: {userEmail}"
- ✅ Redirected to #home
- ✅ localStorage.getItem("token") returns null
- ✅ localStorage.getItem("user") returns null
- ✅ Navbar shows "Login/Register" instead of user info

---

### Test 1.8: Session Persistence (Page Reload)

**Objective:** Verify session persists after page reload  
**Steps:**

1. Login as student
2. Check navbar shows user info
3. Reload page (F5)
4. Check if still logged in

**Expected Results:**

- ✅ User still logged in after reload
- ✅ Navbar shows user info
- ✅ Token loaded from localStorage
- ✅ No need to re-login

---

### Test 1.9: Token Expiry Handling

**Objective:** Test behavior when token expires  
**Steps:**

1. Login and get token
2. Wait 7 days (or manually modify token expiry in MongoDB)
3. Try to access protected route
4. Observe behavior

**Expected Results:**

- ✅ Request returns 401 Unauthorized
- ✅ localStorage cleared
- ✅ Redirected to #login
- ✅ User prompted to login again

---

### Test 1.10: JWT Token Structure

**Objective:** Verify JWT token contains correct claims  
**Steps:**

1. Login as user
2. Open browser console
3. Run:

```javascript
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log(payload);
```

**Expected Results:**

- ✅ Token has 3 parts separated by dots
- ✅ Payload contains:
  - userId (24-char hex string)
  - email (valid email format)
  - role ("student", "teacher", or "admin")
  - iat (issued at timestamp)
  - exp (expiration timestamp)
- ✅ exp - iat ≈ 604,800,000 ms (7 days)

---

## 📚 CATEGORY 2: Course Management Tests

### Test 2.1: Teacher Creates Course

**Objective:** Verify teacher can create a new course  
**Steps:**

1. Login as teacher
2. Click "Create New Course"
3. Fill form:
   - Title: Advanced JavaScript
   - Description: Learn advanced JS concepts
   - Duration: 3 months
   - Price: 4999 paise
   - Company: Tech Corp
   - Job Role: Frontend Developer
   - Highlights:
     - Master ES6+ features
     - Learn async/await
     - Real-world projects
     - Performance optimization
     - Testing with Jest
4. Click "Create Course"

**Expected Results:**

- ✅ Success message shown
- ✅ Redirected to #my-courses
- ✅ Course appears in list marked as "Draft - Pending Approval"
- ✅ Course status in DB is "draft"
- ✅ Console shows successful creation

---

### Test 2.2: Highlights Display in Course

**Objective:** Verify highlights are stored and displayed  
**Steps:**

1. Create course with 5 highlights (as above)
2. View course in "My Courses"
3. Click on course to see details

**Expected Results:**

- ✅ Course detail page shows highlights section
- ✅ All 5 highlights displayed as bullet list
- ✅ Highlights match what was entered
- ✅ Highlights properly formatted

---

### Test 2.3: Duration in Months

**Objective:** Verify duration is stored as months  
**Steps:**

1. Create course with Duration: 3 months
2. View course details
3. Check database entry

**Expected Results:**

- ✅ Course displays "3 months" (not hours)
- ✅ Database shows duration: 3 (number)
- ✅ Validation works (1-60 only)

---

### Test 2.4: Student Cannot See Draft Courses

**Objective:** Verify draft courses hidden from students  
**Steps:**

1. Login as teacher and create course (draft)
2. Logout
3. Login as different student
4. Go to "Courses" list

**Expected Results:**

- ✅ Draft course NOT visible in student's course list
- ✅ Student sees only published courses
- ✅ No indication of draft courses exists

---

### Test 2.5: Teacher Sees All Own Courses

**Objective:** Verify teacher sees draft + published courses  
**Steps:**

1. Login as teacher
2. Click "My Courses"
3. Previously created courses should be visible

**Expected Results:**

- ✅ All courses visible (draft + published)
- ✅ Status badge shows "Draft" or "Published"
- ✅ Count matches database

---

### Test 2.6: Edit Course (Teacher)

**Objective:** Verify teacher can edit own course  
**Steps:**

1. Login as teacher
2. Go to "My Courses"
3. Click edit on a draft course
4. Change title: "Advanced JavaScript - Master Edition"
5. Change price to 5999
6. Save

**Expected Results:**

- ✅ Changes saved successfully
- ✅ Course title updated in My Courses list
- ✅ Price reflects change
- ✅ Status still "Draft"

---

### Test 2.7: Delete Course (Teacher)

**Objective:** Verify teacher can delete own draft course  
**Steps:**

1. Create a test course as teacher
2. Go to My Courses
3. Click delete on the test course
4. Confirm deletion

**Expected Results:**

- ✅ Course deleted from My Courses
- ✅ Confirmation message shown
- ✅ Course no longer in database

---

### Test 2.8: Cannot Edit Published Course

**Objective:** Verify teacher cannot edit published courses (optional feature)  
**Steps:**

1. Approve a course (make it published)
2. Login as teacher
3. Try to edit published course

**Expected Results:**

- ✅ Edit button disabled or grayed out
- ✅ OR error message: "Cannot edit published course"

---

### Test 2.9: Pagination in Course List

**Objective:** Verify pagination works correctly  
**Steps:**

1. Create 15+ courses
2. Student goes to "Courses"
3. Default should show 10 per page
4. Click "Next" or page 2

**Expected Results:**

- ✅ Page 1 shows 10 courses
- ✅ Next button navigates to page 2
- ✅ Page 2 shows remaining courses
- ✅ Pagination controls visible

---

### Test 2.10: Course Detail Page

**Objective:** Verify full course details display  
**Steps:**

1. Create course with all fields
2. Student views course detail
3. Observe all fields displayed

**Expected Results:**

- ✅ Title, description displayed
- ✅ Price shown correctly
- ✅ Company and job role visible
- ✅ Duration shown as months
- ✅ Highlights shown as list
- ✅ "Enroll" button visible

---

### Test 2.11: Trending Courses

**Objective:** Verify trending courses endpoint works  
**Steps:**

1. GET /api/courses/trending

**Expected Results:**

- ✅ Returns array of courses
- ✅ Only published courses
- ✅ Limited to top trending (if implemented)

---

### Test 2.12: Search Courses (Optional)

**Objective:** Test course search functionality  
**Steps:**

1. Create multiple courses with different titles
2. Search for partial title

**Expected Results:**

- ✅ Results filtered by search term
- ✅ Case-insensitive search
- ✅ Real-time results

---

## ✅ CATEGORY 3: Course Approval Workflow

### Test 3.1: Admin Views Pending Courses

**Objective:** Verify admin can see draft courses  
**Steps:**

1. Teacher creates course (draft)
2. Login as admin
3. Open admin.html
4. Click "Course Approvals" tab

**Expected Results:**

- ✅ admin.html loads properly
- ✅ Course Approvals tab shows
- ✅ Pending course card displayed
- ✅ Course details visible (title, desc, duration, highlights)

---

### Test 3.2: Admin Approves Course

**Objective:** Verify course approval flow  
**Steps:**

1. Admin views pending course
2. Clicks "✓ Approve Course" button
3. Observe response

**Expected Results:**

- ✅ Toast shows: "Course approved successfully"
- ✅ Course removed from pending list
- ✅ Course status in DB changed to "published"
- ✅ Course now visible to all students

---

### Test 3.3: Approved Course Visible to Students

**Objective:** Verify published course appears to students  
**Steps:**

1. Admin approves course (from Test 3.2)
2. Login as student
3. Go to "Courses" list

**Expected Results:**

- ✅ Course now visible in student's course list
- ✅ Course shows all details
- ✅ Course available for enrollment

---

### Test 3.4: Approved Course Shows as Published to Teacher

**Objective:** Verify teacher sees published status  
**Steps:**

1. Approve course (from Test 3.2)
2. Login as teacher who created course
3. Go to "My Courses"

**Expected Results:**

- ✅ Course shows with status "Published" (not "Draft")
- ✅ Status badge shows "Published"
- ✅ Course cannot be deleted (if locked after approval)

---

### Test 3.5: Admin Rejects Course

**Objective:** Verify course rejection flow  
**Steps:**

1. Create new course as teacher
2. Admin views pending courses
3. Clicks "✗ Reject Course"
4. Confirms rejection in dialog

**Expected Results:**

- ✅ Confirmation dialog shown
- ✅ Toast: "Course rejected successfully"
- ✅ Course deleted from database
- ✅ Course removed from admin pending list
- ✅ Teacher no longer sees course in My Courses

---

### Test 3.6: Rejected Course Notification (Future)

**Objective:** Test rejection notification to teacher  
**Steps:**

1. Reject a course
2. Check teacher's email (if notification implemented)

**Expected Results:**

- ✅ Teacher receives email: "Your course {title} has been rejected"
- ✅ Reason for rejection included (if implemented)

---

### Test 3.7: Approval Process Multiple Courses

**Objective:** Verify admin can approve multiple courses  
**Steps:**

1. Create 3 courses as different teachers
2. Admin views pending courses (should see 3)
3. Approve first course
4. Reject second course
5. Approve third course
6. Admin pending list should be empty

**Expected Results:**

- ✅ All operations complete successfully
- ✅ Correct courses approved/rejected
- ✅ No errors with multiple operations

---

### Test 3.8: Pagination in Admin Pending Courses

**Objective:** Verify pagination works in admin panel  
**Steps:**

1. Create 15+ draft courses
2. Admin opens admin.html
3. Course Approvals tab shows first 10
4. Click "Next" or pagination controls

**Expected Results:**

- ✅ Page 1 shows 10 courses
- ✅ Pagination controls visible
- ✅ Can navigate between pages

---

## 🎛️ CATEGORY 4: Admin Panel Tests

### Test 4.1: Admin Panel Access

**Objective:** Verify only admins can access admin.html  
**Steps:**

1. Try accessing http://localhost:3000/admin.html as student
2. OR just navigate directly in logged-out state
3. Check behavior

**Expected Results:**

- ✅ If not logged in: No data loads (no token)
- ✅ If student logged in: API calls return 403 Forbidden
- ✅ Basic HTML loads, but no course data
- OR admin.html could redirect to login

---

### Test 4.2: Admin Dashboard Overview

**Objective:** Verify admin panel displays all sections  
**Steps:**

1. Login as admin
2. Open admin.html
3. Observe dashboard layout

**Expected Results:**

- ✅ Header with admin name/logo
- ✅ Tab navigation visible
- ✅ "Course Approvals" tab
- ✅ "Payment Management" tab
- ✅ Clean, professional layout

---

### Test 4.3: Course Approval Cards Display

**Objective:** Verify pending courses display properly  
**Steps:**

1. Create 2 draft courses
2. Admin views Course Approvals tab

**Expected Results:**

- ✅ Cards display for each pending course
- ✅ Course title visible
- ✅ Status badge shows "Pending Approval"
- ✅ Description shown
- ✅ Duration shown
- ✅ Highlights section visible
- ✅ Approve/Reject buttons present

---

### Test 4.4: Payment Tab Display

**Objective:** Verify payment management tab layout  
**Steps:**

1. Admin opens admin.html
2. Click "Payment Management" tab

**Expected Results:**

- ✅ Statistics cards displayed
- ✅ Pending payments count shown (0 if none)
- ✅ Completed payments count shown
- ✅ Total revenue amount shown
- ✅ Payment transactions table visible
- ✅ Table headers: Date, Course, Student, Amount, Status

---

### Test 4.5: No Admin Access for Teachers

**Objective:** Verify teachers cannot access admin features  
**Steps:**

1. Teacher tries to GET /api/courses/admin/pending
2. Teacher tries to PATCH /courses/{id}/approve

**Expected Results:**

- ✅ Both requests return 403 Forbidden
- ✅ Auth headers checked
- ✅ Role verified
- ✅ Access denied

---

### Test 4.6: Admin Analytics View

**Objective:** Verify admin can see platform statistics  
**Steps:**

1. Admin views dashboard
2. Check metrics are displayed

**Expected Results:**

- ✅ Total courses count
- ✅ Total users count
- ✅ Total revenue (if implemented)
- ✅ Pending approvals count
- ✅ Numbers update when changes made

---

## 🎨 CATEGORY 5: Frontend UI/UX Tests

### Test 5.1: Responsive Design - Mobile

**Objective:** Verify UI works on mobile (375px)  
**Steps:**

1. Open browser DevTools
2. Set device: iPhone SE (375x667)
3. Navigate through app
4. Check: courses list, course detail, forms

**Expected Results:**

- ✅ Content readable without horizontal scroll
- ✅ Buttons clickable
- ✅ Forms fill full width
- ✅ Navigation accessible
- ✅ No layout issues

---

### Test 5.2: Responsive Design - Tablet

**Objective:** Verify UI works on tablet (768px)  
**Steps:**

1. DevTools: iPad (768x1024)
2. Navigate app
3. Check layout and spacing

**Expected Results:**

- ✅ Proper spacing between elements
- ✅ Two-column layouts where appropriate
- ✅ All functionality accessible

---

### Test 5.3: Responsive Design - Desktop

**Objective:** Verify UI works on desktop (1920px+)  
**Steps:**

1. Full-width browser window
2. All features should work
3. Check desktop optimizations

**Expected Results:**

- ✅ Multi-column layouts (if used)
- ✅ Proper whitespace
- ✅ Professional appearance

---

### Test 5.4: Form Validation

**Objective:** Verify form validations work  
**Steps:**

1. Try to submit empty registration form
2. Try invalid email
3. Try password < 8 chars
4. Try empty course title

**Expected Results:**

- ✅ Error messages for each field
- ✅ Clear validation feedback
- ✅ Form not submitted
- ✅ Focus on first error field

---

### Test 5.5: Navigation Bar Rendering

**Objective:** Verify navbar changes with role  
**Steps:**

1. Student logged in: Check navbar
2. Teacher logged in: Check navbar
3. Admin logged in: Check navbar

**Expected Results:**

- **Student:**
  - Home, Courses, My Enrollments, My Profile, Logout
- **Teacher:**
  - Home, Courses, Create Course, My Courses, My Profile, Logout
- **Admin:**
  - Logout (then redirected to admin.html)

---

### Test 5.6: Error Messages Display

**Objective:** Verify error messages are user-friendly  
**Steps:**

1. Make an API request fail (400/500)
2. Observe error display
3. Try invalid login

**Expected Results:**

- ✅ Error messages clearly displayed
- ✅ No technical jargon
- ✅ Actionable advice if possible
- ✅ Toast/modal notifications work

---

### Test 5.7: Loading States

**Objective:** Verify loading indicators appear  
**Steps:**

1. Click button that makes API call
2. Observe before response arrives

**Expected Results:**

- ✅ Button shows loading state (disabled/spinner)
- ✅ User can't double-submit
- ✅ Success/error shown when complete

---

## 🔗 CATEGORY 6: API Endpoint Tests

### Test 6.1: GET /api/courses (Published Only)

**Steps:**

```bash
# Without token (or invalid token)
curl http://localhost:5001/api/courses?page=1&limit=10
```

**Expected Results:**

- ✅ Status 200 OK
- ✅ Returns array of published courses only
- ✅ No draft courses included
- ✅ Pagination info included (total, page, pages)

---

### Test 6.2: POST /api/courses (Teacher)

**Steps:**

```bash
curl -X POST http://localhost:5001/api/courses \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "description": "Learn JS fundamentals",
    "duration": 2,
    "price": 2999,
    "company": "Dev Academy",
    "role": "Developer",
    "highlights": ["Intro to JS", "DOM manipulation"]
  }'
```

**Expected Results:**

- ✅ Status 201 Created
- ✅ Returns created course
- ✅ status field = "draft"
- ✅ teacherId populated
- ✅ createdAt timestamp set

---

### Test 6.3: GET /api/courses/admin/pending (Admin Only)

**Steps:**

```bash
curl http://localhost:5001/api/courses/admin/pending \
  -H "Authorization: Bearer {admin_token}"
```

**Expected Results:**

- ✅ Status 200 OK
- ✅ Returns only draft courses
- ✅ Pagination working
- ✅ Teacher info included (if needed)

---

### Test 6.4: PATCH /api/courses/{id}/approve (Admin Only)

**Steps:**

```bash
curl -X PATCH http://localhost:5001/api/courses/courseId/approve \
  -H "Authorization: Bearer {admin_token}"
```

**Expected Results:**

- ✅ Status 200 OK
- ✅ Course status changed to "published"
- ✅ Returns updated course
- ✅ Non-admin gets 403

---

### Test 6.5: PATCH /api/courses/{id}/reject (Admin Only)

**Steps:**

```bash
curl -X PATCH http://localhost:5001/api/courses/courseId/reject \
  -H "Authorization: Bearer {admin_token}"
```

**Expected Results:**

- ✅ Status 200 OK (or 204 No Content)
- ✅ Course deleted from database
- ✅ Confirmation message returned
- ✅ Non-admin gets 403

---

### Test 6.6: GET /api/courses/{id} (Public)

**Steps:**

```bash
curl http://localhost:5001/api/courses/courseId
```

**Expected Results:**

- ✅ Status 200 OK
- ✅ Full course details returned
- ✅ Highlights array included
- ✅ Teacher info (optional: name, email)

---

### Test 6.7: POST /api/auth/login

**Steps:**

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected Results:**

- ✅ Status 200 OK (success)
- ✅ Returns: { token, user }
- ✅ User contains: id, name, email, role
- ✅ Token is valid JWT
- OR Status 401 (invalid credentials)

---

### Test 6.8: GET /api/auth/profile (Protected)

**Steps:**

```bash
curl http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer {token}"
```

**Expected Results:**

- ✅ Status 200 OK
- ✅ Returns current user profile
- ✅ Without token: 401 Unauthorized
- ✅ With invalid token: 401 Unauthorized

---

### Test 6.9: GET /api/courses/teacher/my-courses (Teacher Only)

**Steps:**

```bash
curl http://localhost:5001/api/courses/teacher/my-courses \
  -H "Authorization: Bearer {teacher_token}"
```

**Expected Results:**

- ✅ Status 200 OK
- ✅ Returns all courses (draft + published)
- ✅ Only teacher's own courses
- ✅ Student gets 403 (if role-specific)

---

### Test 6.10: Enrollment Endpoints

**Steps:**

```bash
# Create enrollment
curl -X POST http://localhost:5001/api/enrollments \
  -H "Authorization: Bearer {student_token}" \
  -H "Content-Type: application/json" \
  -d '{"courseId": "courseId"}'
```

**Expected Results:**

- ✅ Status 201 Created
- ✅ Enrollment record created
- ✅ studentId and courseId stored

---

### Test 6.11: Pagination Parameters

**Steps:**

```bash
curl "http://localhost:5001/api/courses?page=2&limit=5"
```

**Expected Results:**

- ✅ Returns 5 results (limit)
- ✅ Skips first 5 results (page 2)
- ✅ Includes: total, page, pages in response

---

### Test 6.12: Invalid Authorization Header

**Steps:**

```bash
curl http://localhost:5001/api/auth/profile \
  -H "Authorization: InvalidToken"
```

**Expected Results:**

- ✅ Status 401 Unauthorized
- ✅ Error message: "Invalid token" or similar
- ✅ Session NOT created

---

### Test 6.13: Missing Authorization Header

**Steps:**

```bash
curl http://localhost:5001/api/auth/profile
```

**Expected Results:**

- ✅ Status 401 Unauthorized
- ✅ Error message: "No token provided" or similar

---

### Test 6.14: CORS Headers

**Steps:**
Frontend makes request to different port

**Expected Results:**

- ✅ Response includes CORS headers
- ✅ Access-Control-Allow-Origin: \* (or specific origin)
- ✅ Preflight OPTIONS request succeeds

---

### Test 6.15: Request Validation

**Steps:**

```bash
# Missing required field
curl -X POST http://localhost:5001/api/courses \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'  # Missing description, duration, etc.
```

**Expected Results:**

- ✅ Status 400 Bad Request
- ✅ Returns validation error details
- ✅ Specifies which fields are missing/invalid

---

## ⚠️ CATEGORY 7: Error Handling Tests

### Test 7.1: Network Error Recovery

**Objective:** Test behavior when API unavailable  
**Steps:**

1. Stop backend server
2. Try to login
3. Observe error handling

**Expected Results:**

- ✅ Error message appears
- ✅ User sees "Connection failed" or similar
- ✅ Form not submitted
- ✅ Console shows network error

---

### Test 7.2: Malformed JSON Response

**Objective:** Test handling of invalid JSON  
**Steps:**

1. Server returns invalid JSON
2. Observe frontend behavior

**Expected Results:**

- ✅ Error caught and logged
- ✅ User sees friendly error message
- ✅ App doesn't crash

---

### Test 7.3: Duplicate Email Registration

**Objective:** Test preventing duplicate accounts  
**Steps:**

1. Register with email: test@example.com
2. Try to register again with same email

**Expected Results:**

- ✅ Status 400 Bad Request
- ✅ Error: "Email already registered"
- ✅ Registration fails

---

### Test 7.4: Invalid Password Format

**Objective:** Test password validation  
**Steps:**

1. Try password: "123" (too short)
2. Try password: "" (empty)
3. Try password with special chars: "P@ssw0rd!"

**Expected Results:**

- ✅ Too short → Error shown
- ✅ Empty → Error shown
- ✅ With special chars → Accepted (if allowed)

---

### Test 7.5: Course Update Conflict

**Objective:** Test handling of concurrent updates  
**Steps:**

1. Two teachers edit same course
2. Both save simultaneously
3. Check final state

**Expected Results:**

- ✅ Last update wins (or optimistic locking)
- ✅ No data corruption
- ✅ Users notified of conflict (if applicable)

---

## 📊 Test Execution Checklist

| Category          | Total  | Passed | Failed | Notes |
| ----------------- | ------ | ------ | ------ | ----- |
| 1. Authentication | 10     | \_     | \_     |       |
| 2. Course Mgmt    | 12     | \_     | \_     |       |
| 3. Approval       | 8      | \_     | \_     |       |
| 4. Admin Panel    | 6      | \_     | \_     |       |
| 5. UI/UX          | 7      | \_     | \_     |       |
| 6. API            | 15     | \_     | \_     |       |
| 7. Errors         | 5      | \_     | \_     |       |
| **TOTAL**         | **63** | **\_** | **\_** |       |

---

## ✅ Sign-Off

**Test Results Status:** ⏳ Pending  
**Tester Name:** ********\_********  
**Date:** ********\_********  
**Approval:** ********\_********

---

**Note:** Mark tests as Passed ✅, Failed ❌, or Skipped ⏭️  
Print this document and manually track test results during QA phase.
