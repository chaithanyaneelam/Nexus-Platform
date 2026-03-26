# 👨‍💼 Admin Setup - Step-by-Step Visual Guide

**Your Current Issue:** Login shows "Invalid email or password" ✓ FIXED  
**What You Want:** Access admin panel, manage courses

---

## ✅ STEP 1: Fix the Backend (One-Time)

### What You Need to Do:

1. Open Terminal (Command Prompt/PowerShell)
2. Navigate to project:

```bash
cd "c:\Users\neela\Desktop\Nexus Platform\nexus-upskill"
```

3. Install fresh dependencies:

```bash
npm install
```

4. Build the project:

```bash
npm run build
```

**Expected Output:**

```
npm WARN deprecated ...
added X packages in Xs
$ tsc

✓ Compiled successfully
```

5. Start the backend server:

```bash
npm run dev
```

**Expected Output (should see):**

```
Server is running on port 5001
Database connected!
Listening on port 5001
```

**Keep this terminal open while testing!**

---

## ✅ STEP 2: Clear Browser (One-Time)

### Why:

Old password hashes are cached in your browser

### What You Do:

1. **Windows:** Press `Ctrl + Shift + Delete`
2. On the dialog that appears:
   - ✓ Check: "Cookies"
   - ✓ Check: "Cached images and files"
   - Select: "All time"
   - Click: "Clear data"

3. **Verify localStorage is cleared:**
   - Press `F12` (open DevTools)
   - Click "Application" tab
   - Left menu: "Local Storage"
   - Click "http://localhost:3000"
   - Right-click → "Clear All"

---

## ✅ STEP 3: Register Your Admin Account

### Go to: http://localhost:3000#register

```
┌─────────────────────────────────────────┐
│        Register to Nexus Platform       │
├─────────────────────────────────────────┤
│                                         │
│  Full Name:  [Your Name           ]    │
│                                         │
│  Email:      [admin@nexus.com     ]    │
│                                         │
│  Password:   [MyAdminPass123      ]    │
│  (Min 8 chars, max 128)                │
│                                         │
│  Role:       [★ Student  ▼         ]   │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         [ Register ]             │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Already have account? Login here       │
│                                         │
└─────────────────────────────────────────┘
```

### What to Fill:

- **Full Name:** Any name (e.g., "Admin User", "Your Name")
- **Email:** `admin@nexus.com` (or admin@yourname.com)
- **Password:** Anything secure (e.g., "MyAdminPass123")
- **Role:** Keep as "Student" (we'll change it in Step 4)

### After Clicking Register:

✅ You should see: "✓ Registration successful"  
✅ Redirected to: Student Dashboard  
✅ Navbar shows: Your name + Logout button

**Note:** In browser console (F12), should see:

```
📝 Registering user: admin@nexus.com Role: student
✓ Registration successful for: admin@nexus.com
```

---

## ✅ STEP 4: Change Admin Role in Database

### Option A: MongoDB Compass (Easiest - Visual)

1. **Open MongoDB Compass**
   - Look for MongoDB Compass icon on desktop or Start menu
   - Or download from: https://www.mongodb.com/products/tools/compass

2. **Connect to Database**
   - URL: `mongodb://localhost:27017`
   - Click "Connect"

3. **Navigate to Users**

   ```
   Left Panel:
   ├─ nexus (database)
   │  ├─ users (collection) ← CLICK HERE
   │  ├─ courses
   │  ├─ enrollments
   │  └─ payments
   ```

4. **Find Your Admin Account**
   - You'll see a list of users
   - Look for the one with: `"email": "admin@nexus.com"`
   - Click on it to expand/view

5. **Edit the Document**
   - Find the line: `"role": "student"`
   - Click on it to edit
   - Change "student" to "admin"
   - Should look like: `"role": "admin"`

6. **Save Changes**
   - Click "Update" button (bottom right area)
   - Should see confirmation

### Option B: MongoDB Shell (Command Line)

1. **Open MongoDB Shell**

   ```bash
   mongosh
   ```

2. **Run These Commands:**

   ```javascript
   use nexus
   db.users.updateOne(
     {email: "admin@nexus.com"},
     {$set: {role: "admin"}}
   )
   ```

3. **Expected Result:**
   ```
   { acknowledged: true, modifiedCount: 1 }
   ```

### ✅ Verify It Worked:

```javascript
// Still in MongoDB shell
db.users.findOne({email: "admin@nexus.com"})

// Should show:
{
  _id: ObjectId(...),
  name: "Admin User",
  email: "admin@nexus.com",
  password: "$2a$10$...", // encrypted
  role: "admin",           // ← CHANGED ✓
  createdAt: ...,
  updatedAt: ...
}
```

---

## ✅ STEP 5: Login as Admin

### Go to: http://localhost:3000#login

```
┌─────────────────────────────────────────┐
│      Login to Nexus Platform            │
├─────────────────────────────────────────┤
│                                         │
│  Email:     [admin@nexus.com       ]   │
│                                         │
│  Password:  [••••••••••••••••••   ]   │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         [ Login ]                │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Don't have account? Register here      │
│                                         │
└─────────────────────────────────────────┘
```

### Enter:

- **Email:** `admin@nexus.com`
- **Password:** (Whatever you set in Step 3)
- Click **Login**

### What Happens:

✅ Console should show: `✓ Login successful for: admin@nexus.com`  
✅ Browser redirects to: `http://localhost:3000/admin.html`  
✅ Page loads with: Admin Dashboard interface

---

## ✅ STEP 6: Verify Admin Panel

When you see admin.html, you should see:

```
┌─────────────────────────────────────────────┐
│  Nexus Platform Admin Dashboard             │
├─────────────────────────────────────────────┤
│                                             │
│  Tabs:  [ 📚 Course Approvals ]            │
│         [ 💰 Payment Management ]           │
│                                             │
│  ┌─────────────────────────────────────────┐
│  │  📚 COURSE APPROVALS (default tab)      │
│  ├─────────────────────────────────────────┤
│  │  Pending Courses: 0                     │
│  │  (Will show courses after teacher      │
│  │   creates and you approve)              │
│  └─────────────────────────────────────────┘
│                                             │
│  Navbar: [ Home | Logout ]                  │
│                                             │
└─────────────────────────────────────────────┘
```

**If you see this:** ✅ Admin setup is complete!

---

## 🧪 STEP 7: Test Complete Flow

### Test Sequence:

**PART A: Teacher Creates Course**

1. **New Browser Tab/Window** (keep admin logged in)
2. Go to: http://localhost:3000#register
3. Register new account:
   ```
   Name: Teacher Test
   Email: teacher.test@example.com
   Password: TeacherPass123
   Role: Teacher
   ```
4. After registration → Dashboard with "Create New Course"
5. Click "Create New Course"
6. Fill form:
   ```
   Title: JavaScript Mastery
   Description: Complete JavaScript course from basics
   Duration: 3 (months)
   Price: 2999 (paise = ₹29.99)
   Company: Tech Academy
   Job Role: JavaScript Developer
   Highlights: (click "Add Highlight" 5 times)
     1. Variables and Data Types
     2. Functions and Scope
     3. Async/Await Patterns
     4. DOM Manipulation
     5. ES6+ Features
   ```
7. Click "Create Course"
8. Should see: "Course created successfully"
9. See course in "My Courses" with status: "Draft - Pending Approval"

**PART B: Admin Approves Course**

1. Go back to **admin.html tab** (should still be open)
2. Refresh page (F5)
3. Should now see course in "Course Approvals" tab
4. See course card with:
   - Title: JavaScript Mastery
   - Description shown
   - 5 Highlights listed
   - Buttons: "✓ Approve" | "✗ Reject"
5. Click "✓ Approve Course"
6. Notification: "Course approved successfully"
7. Course disappears from pending list

**PART C: Teacher Sees Published Status**

1. Teacher tab → Go to "My Courses"
2. Refresh page (F5)
3. Course status changed from:
   ```
   Draft - Pending Approval  →  Published ✓
   ```

**PART D: Student Can See & Enroll**

1. **New Browser Tab/Window**
2. Go to: http://localhost:3000#register
3. Register student account:
   ```
   Name: Student Test
   Email: student.test@example.com
   Password: StudentPass123
   Role: Student
   ```
4. After registration → Dashboard
5. Click "Browse Courses" or go to "Courses"
6. Should see: "JavaScript Mastery" course card
7. Click on course
8. See "Enroll Now - ₹29.99" button ✓
9. (Optional: Click to enroll)

---

## 📊 Flow Summary

```
YOUR SETUP PROCESS:
┌─────────────┐
│  Start      │
│ (You are)   │
└──────┬──────┘
       │
       → Backend running? (npm run dev)
       │  NO? → Do STEP 1
       │
       → Cache cleared?
       │  NO? → Do STEP 2
       │
       → Register account
       │  (STEP 3)
       │
       → Change role to admin
       │  (STEP 4)
       │
       → Login as admin
       │  (STEP 5)
       │
       → Access admin.html
       │  (STEP 6)
       │
       → Test full flow
       │  (STEP 7)
       │
       ✓ DONE! Admin panel working
```

---

## 🐛 Things That Might Go Wrong

### ❌ Still Shows "Invalid email or password" on login

**Did you:**

- [ ] Restart backend AFTER npm run build? (IMPORTANT!)
- [ ] Clear browser cache? (Ctrl+Shift+Delete)
- [ ] Clear localStorage? (DevTools → Application → Local Storage)
- [ ] User role is "admin" in MongoDB? (Check!)

**If still failing:**

1. In browser console (F12) type:

```javascript
localStorage.clear();
location.reload();
```

2. Try login again

---

### ❌ Admin not redirected to admin.html, stays in #admin-dashboard

**Check:**

- [ ] Is user role "admin" in MongoDB? (Use MongoDB Compass)
- [ ] Did you logout and login again after changing role?
- [ ] Does admin.html file exist? (Check folder: nexus-frontend/)

**To Fix:**

1. Log out (click Logout)
2. Refresh page (F5)
3. Log back in
4. Should now redirect to admin.html

---

### ❌ No pending courses visible in admin panel

**Check:**

- [ ] Did teacher actually create a course? (Check "My Courses" as teacher)
- [ ] Is course status = "draft" in database?
- [ ] Is teacher email correct?

**To Verify in MongoDB:**

```javascript
db.courses.find({ status: "draft" });
// Should show courses with status: draft
```

---

## ✅ Final Verification

### You know it's working when:

**Teacher Account:**

```
✓ Can create courses
✓ Course appears as "Draft - Pending Approval"
✓ Can see course in "My Courses"
✓ Cannot change status (only admin can)
```

**Admin Account:**

```
✓ Redirected to admin.html (not hash route)
✓ Can see pending courses
✓ Can click "Approve"
✓ Can click "Reject"
✓ Course disappears after action
```

**Student Account:**

```
✓ Cannot see draft courses
✓ Sees only published courses
✓ See "Enroll Now" button on course detail
✓ Can click to enroll
```

---

## 📝 Notes

- **Email Format:** Any valid email works (admin@test.com, admin123@gmail.com, etc.)
- **Password:** Min 8 chars, can have special characters
- **Browser:** Chrome, Firefox, Edge (not IE)
- **Port:** Frontend = 3000, Backend = 5001 (don't change unless you know why)

---

## 🎯 Success Indicators

When everything is working:

1. ✅ Can register → login → not see "invalid" error
2. ✅ Teacher creates course → admin sees it pending
3. ✅ Admin approves → course becomes visible to students
4. ✅ Student sees course → clicks "Enroll Now"

**If all 4 are working → System is ready! 🚀**

---

**Ready to start?** → Begin with STEP 1 above!
