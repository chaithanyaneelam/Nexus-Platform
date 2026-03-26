# ✅ Complete Setup Checklist - Nexus Platform

**Date:** March 21, 2024  
**Status:** 🟢 Ready for Testing  
**Your Email (from screenshot):** chaithanya101@gmail.com

---

## 🔧 What Was Fixed

### Fix 1: Login Error - Double Password Hashing ✓

**Problem:** Creating account and immediately logging in with same credentials showed "Invalid email or password"

**Root Cause:** Passwords were being hashed twice:

- Once in `AuthService.ts`
- Again in `User.ts` model pre-save hook

**Solution Applied:**

- ✅ Removed hashing from `AuthService.register()`
- ✅ Removed hashing from `AuthService.changePassword()`
- ✅ Now relies only on User model's pre-save hook for hashing
- ✅ Password comparison works correctly in login

**Files Changed:**

- `nexus-upskill/src/services/AuthService.ts`

---

### Fix 2: Course Status Display for Teachers ✓

**Current State:** Already implemented

- Teachers see "Draft - Pending Approval" for draft courses
- Teachers see "Published" for approved courses
- Shown in "My Courses" status column

**How it Works:**

- Backend stores `status: "draft"` or `status: "published"`
- Frontend displays status with visual badge
- Teachers can track approval status in real-time

---

### Fix 3: Student Course Enrollment UI ✓

**Current State:** Already implemented

- "Enroll Now" button appears on course detail page for students
- Shows course price
- Only visible to authenticated students
- Teachers see "Edit Course" button instead

**How it Works:**

- `router.js` checks if user is student
- Only students see the "Enroll Now" button
- Teachers see "Edit Course" button
- Admins see neither (no access to course detail)

---

## 🚀 Action Items for You

### Step 1: Rebuild Backend (Required)

```bash
# In Terminal (in nexus-upskill directory)
npm run build

# Or if TypeScript compilation fails, try:
npm install

# Then start the server
npm run dev
```

**Expected Output:**

```
✓ Compiled successfully
Server running on http://localhost:5001
```

### Step 2: Clear Your Browser Cache

```
Press: Ctrl+Shift+Delete
Select: All time
Check: Cookies, Cached images
Click: Clear data
```

**Why:** Old password hashes might be cached in localStorage

### Step 3: Test Login with Your Account

**Your Test Credentials:**

- Email: `chaithanya101@gmail.com`
- Password: (the one you registered with)

**If Account Exists:**

1. Go to http://localhost:3000#login
2. Enter email & password
3. Should work now ✓ (previously failed)

**If Account Doesn't Exist (Registration failed):**

1. Go to http://localhost:3000#register
2. Re-register with same email and password
3. It will work this time ✓

### Step 4: Verify Course Features

**Teacher Registration:**

- Register new account with role "Teacher"
- Go to "Create New Course"
- Fill all fields (including 5-10 highlights)
- Submit
- See course in "My Courses" as "Draft - Pending Approval" ✓

**Student Registration:**

- Register new account with role "Student"
- Go to "Courses" (only sees published courses)
- Your teacher's draft course is NOT visible ✓
- (Once approved by admin, it will appear)

**Student Enrollment:**

- Click on published course
- See "Enroll Now" button with price ✓
- Can click to enroll

### Step 5: Set Up Admin Account

**Step 5A: Register Admin**

1. Go to http://localhost:3000#register
2. Register account:
   - Name: Your Name
   - Email: admin@nexus.com
   - Password: AnyPassword123
   - Role: Student (for now)
3. Complete registration

**Step 5B: Change Role to Admin**
Choose ONE method:

**Option 1: MongoDB Compass (Easiest)**

1. Open MongoDB Compass
2. Find your database → users collection
3. Find your admin@nexus.com user
4. Edit it to change `role: "student"` → `role: "admin"`
5. Save

**Option 2: Mongo Shell**

```javascript
use nexus
db.users.updateOne(
  {email: "admin@nexus.com"},
  {$set: {role: "admin"}}
)
```

Expected output: `{ acknowledged: true, modifiedCount: 1 }`

**Step 5C: Login as Admin**

1. Go to http://localhost:3000#login
2. Login with admin@nexus.com
3. Should redirect to http://localhost:3000/admin.html ✓

### Step 6: Test Complete Approval Flow

**Timeline:**

1. **Register Teacher** → chaithanya_teacher@test.com / Teacher123 / Role: Teacher
2. **Login as Teacher** → Create new course → See as "Draft"
3. **Register Student** → new_student@test.com / Student123 / Role: Student
4. **Login as Student** → Go to Courses → Don't see draft course ✓
5. **Login as Admin** → See pending courses in admin.html
6. **Click Approve** → Course becomes published
7. **Login as Student** → Now can see course in course list ✓
8. **View Course** → Click "Enroll Now" button ✓

---

## 📋 Pre-Testing Checklist

Before testing, verify:

- [ ] Backend code is built (`npm run build`)
- [ ] Backend server is running (`npm run dev`)
- [ ] Browser cache is cleared (Ctrl+Shift+Delete)
- [ ] MongoDB is running (local or Atlas)
- [ ] Frontend is accessible (http://localhost:3000)
- [ ] Console shows no errors (F12 → Console tab)
- [ ] You have test email(s) ready

---

## 🧪 Testing Scenarios

### Scenario 1: Login Works (Your Test)

```
Email: chaithanya101@gmail.com
Password: [your registered password]
Expected: Login successful, redirected to dashboard
Actual: ?
Status: [ ] Pass [ ] Fail
```

### Scenario 2: Teacher Creates Draft Course

```
1. Register: teacher@test.com / Role: Teacher
2. Login with teacher account
3. Create Course with all fields + 5 highlights
4. Expected: Course appears in "My Courses" as "Draft - Pending Approval"
Status: [ ] Pass [ ] Fail
```

### Scenario 3: Student Cannot See Draft Courses

```
1. Register: student@test.com / Role: Student
2. Login with student account
3. Go to "Courses" tab
4. Expected: Draft course from teacher is NOT visible
Status: [ ] Pass [ ] Fail
```

### Scenario 4: Admin Approves Course

```
1. Register: admin@test.com / Role: (change to admin manually)
2. Login with admin account
3. Expected: Redirected to admin.html (not hash route)
4. Click "Course Approvals" tab
5. See draft course, click "Approve"
6. Expected: Course status changes to "Published"
Status: [ ] Pass [ ] Fail
```

### Scenario 5: Student Can Now See & Enroll

```
1. After admin approves (Scenario 4)
2. Login as student (from Scenario 3)
3. Go to "Courses" tab
4. Expected: Teacher's course now visible
5. Click on course
6. Expected: "Enroll Now - ₹{price}" button appears
Status: [ ] Pass [ ] Fail
```

### Scenario 6: Teacher Sees Published Status

```
1. After admin approves
2. Login as teacher (from Scenario 2)
3. Go to "My Courses"
4. Expected: Course status changed from "Draft - Pending Approval" to "Published"
Status: [ ] Pass [ ] Fail
```

---

## 🔍 Browser Console Check

### During Login, Console Should Show:

```javascript
✓ Login successful for: chaithanya101@gmail.com
```

### During Registration, Console Should Show:

```javascript
📝 Registering user: newemail@test.com Role: student
✓ Registration successful for: newemail@test.com
```

### During Logout, Console Should Show:

```javascript
✓ User logged out: email@test.com
```

**To Check:**

1. Press F12 (DevTools)
2. Go to Console tab
3. Log in/out/register and watch for messages
4. Should see ✓ or 📝 indicators (not ✗ errors)

---

## 🐛 If Something Goes Wrong

### Scenario: Still Getting "Invalid email or password"

**Checklist:**

1. [ ] Backend rebuilt? (`npm run build`)
2. [ ] Backend restarted? (Kill and `npm run dev` again)
3. [ ] Browser cache cleared? (Ctrl+Shift+Delete)
4. [ ] LocalStorage cleared? (DevTools → Application → Local Storage → Clear)
5. [ ] User actually exists in DB? (Check MongoDB)
6. [ ] Password matches exactly? (Check for spaces, caps)
7. [ ] Network tab shows 200 response? (DevTools → Network → check login request)

**Debug Steps:**

```javascript
// In browser console
localStorage.clear();
location.reload();
// Try login again
```

### Scenario: Admin Not Redirecting to admin.html

**Checklist:**

1. [ ] Role changed to "admin" in database?
2. [ ] Logged out and back in after changing role?
3. [ ] admin.html file exists? (Check nexus-frontend/admin.html)
4. [ ] Frontend can access admin.html? (Try direct URL: http://localhost:3000/admin.html)

---

## 📞 File Locations for Reference

**Key Files Modified:**

- `nexus-upskill/src/services/AuthService.ts` - Password hashing fix
- `nexus-frontend/js/auth.js` - Already has correct login handling
- `nexus-frontend/admin.html` - Admin dashboard (already created)
- `nexus-frontend/js/router.js` - Already has enroll button logic

**Documentation Created:**

- `ADMIN_ACCESS_GUIDE.md` - How to access admin (read this!)
- `ADMIN_IMPLEMENTATION.md` - Detailed implementation guide
- `QUICK_REFERENCE.md` - Quick developer reference
- `TEST_CASES.md` - 63+ test cases to verify

---

## ✨ Summary of Current System

### User Roles & Features

**Student Can:**

- ✅ Register account
- ✅ Login with JWT
- ✅ View published courses only
- ✅ Enroll in courses (see button)
- ✅ Track enrollments
- ✅ Make payments
- ❌ Cannot see draft courses
- ❌ Cannot approve courses

**Teacher Can:**

- ✅ Register account
- ✅ Login with JWT
- ✅ Create courses (status=draft)
- ✅ View ALL their courses (draft + published)
- ✅ See approval status in My Courses
- ✅ Edit and delete courses
- ✅ View course analytics
- ❌ Cannot see other teachers' courses
- ❌ Cannot approve their own courses

**Admin Can:**

- ✅ Register and login
- ✅ Access dedicated admin.html panel
- ✅ View all pending (draft) courses
- ✅ Approve courses (draft → published)
- ✅ Reject courses (delete)
- ✅ View payment transactions UI
- ✅ Manage platform
- ❌ Cannot create courses directly
- ❌ Cannot teach (edit courses)

### Course Status Tracking

| Action          | Course Status | Visibility                   |
| --------------- | ------------- | ---------------------------- |
| Teacher creates | `draft`       | Only to teacher & admin      |
| Admin approves  | `published`   | To students, teachers, admin |
| Admin rejects   | Deleted       | Nowhere                      |
| After approval  | `published`   | Students can enroll          |

---

## 🎯 Next After Verification

Once all tests pass:

1. **Optional:** Add payment gateway (Stripe/Razorpay)
2. **Optional:** Email notifications for course approval
3. **Optional:** Course revision requests before rejection
4. **Optional:** Teacher payment disbursement system
5. **Optional:** Student progress tracking
6. **Optional:** Course certificates

All features are documented in:

- `IMPLEMENTATION_STATUS.md` - Current status
- `PENDING_FEATURES.md` - Future work

---

## 📞 Support Resources

**In This Workspace:**

- 📄 `ADMIN_ACCESS_GUIDE.md` - Admin setup
- 📄 `ADMIN_IMPLEMENTATION.md` - Full implementation details
- 📄 `QUICK_REFERENCE.md` - Quick commands
- 📄 `TEST_CASES.md` - 63+ test cases

**In Browser Console (After Login):**

```javascript
// Check authentication
auth.isAuthenticated();
auth.getCurrentUser();
auth.getUserRole();

// Check token
localStorage.getItem("token");

// Decode JWT
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log(payload);
```

---

## 🚀 Ready to Test?

**You should now:**

1. ✅ Understand the authentication fix
2. ✅ Know how to set up admin account
3. ✅ Have test scenarios ready
4. ✅ Know what to check if something fails

**Next Step:** Follow the "Action Items" section above!

---

**Questions?** Check:

1. Browser console (F12) for error messages
2. Backend console for server errors
3. `ADMIN_ACCESS_GUIDE.md` for troubleshooting
4. `TEST_CASES.md` for expected behavior

**Have a successful testing session! 🎉**
