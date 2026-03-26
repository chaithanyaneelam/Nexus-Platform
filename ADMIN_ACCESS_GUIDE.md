# 🔐 How to Access Admin Panel - Complete Setup Guide

## Quick Start (3 Steps)

### Step 1: Register Your Admin Account

1. Go to **http://localhost:3000** (or your frontend URL)
2. Click "**Register here**"
3. Fill in the form:
   - **Name:** Your Name
   - **Email:** admin@nexus.com (or any email)
   - **Password:** Your password (min 8 chars)
   - **Role:** Student (for now - we'll change this in Step 2)
4. Click "**Register**"
5. You'll be redirected to the dashboard

### Step 2: Give Your Account Admin Role

You need to update your user role in the database. Choose ONE method:

#### Method A: MongoDB Compass (Easiest - UI)

1. Open **MongoDB Compass**
2. Connect to your database (usually `localhost:27017` or your connection string)
3. Navigate to: **Database → nexus → users** collection
4. Find your admin account by email
5. Click to edit the document
6. Change `"role": "student"` to `"role": "admin"`
7. Click "Save"

#### Method B: MongoDB Shell (Command Line)

1. Open MongoDB shell or MongoDB Atlas terminal
2. Run these commands:

```javascript
use nexus
db.users.updateOne(
  {email: "admin@nexus.com"},
  {$set: {role: "admin"}}
)
```

#### Method C: Mongosh (Modern MongoDB CLI)

```bash
mongosh
use nexus
db.users.updateOne({email: "admin@nexus.com"}, {$set: {role: "admin"}})
```

**You should see:** `{ acknowledged: true, modifiedCount: 1 }`

### Step 3: Login as Admin

1. Go to **http://localhost:3000#login**
2. Enter your email and password
3. Click "**Login**"
4. You'll be automatically redirected to **http://localhost:3000/admin.html** ✅

---

## 🎯 What You Can Do as Admin

### View Pending Courses

- Courses created by teachers (status = "draft")
- Shows course details with:
  - Course title
  - Description
  - Duration
  - Highlights
  - Teacher info

### Approve Courses

- Click **"✓ Approve Course"** button
- Course becomes visible to students
- Teacher sees it as "Published" in their "My Courses"
- Students can now see and enroll in the course

### Reject Courses

- Click **"✗ Reject Course"** button
- Confirm the rejection
- Course is deleted permanently
- Teacher no longer sees it in their courses

### View Payment Transactions

- See all payments made by students
- Track payment status
- View payment statistics

---

## 🧪 Test the Complete Flow

### Test Scenario 1: Course Approval

**Step 1: Create Teacher Account**

```
Email: teacher1@test.com
Password: Teacher123
Role: Teacher
```

**Step 2: Create a Course (as Teacher)**

1. Login with teacher account
2. Click "Create New Course"
3. Fill all fields:
   - Title: "React Advanced"
   - Description: "Learn advanced React patterns"
   - Duration: 3 months
   - Price: 4999
   - Company: "Tech Corp"
   - Role: "React Developer"
   - Highlights: (add 5-10 items)
4. Click "Create Course"
5. See course appear in "My Courses" as "Draft - Pending Approval"

**Step 3: Approve Course (as Admin)**

1. Login with admin account
2. Redirected to admin.html
3. Click "📚 Course Approvals" tab
4. See the pending course
5. Click "✓ Approve Course"
6. Confirm approval

**Step 4: Verify Course is Published**

1. Teacher logs in
2. Goes to "My Courses"
3. Course now shows "Published" (not "Draft")
4. Student logs in (new account)
5. Goes to "Courses"
6. Can see the course
7. Can view details and see "Enroll Now" button

---

## 🔐 Security Notes

### ⚠️ Important for Production

- Never share admin credentials
- Use strong passwords (12+ chars, mix of case, numbers, special chars)
- Change default admin email to something secure
- Enable 2FA when implemented
- Regular password rotation recommended

### Development vs Production

- **Development:** One admin account is fine
- **Production:** Multiple admins with audit logs required
- **Production:** HTTPS required for admin.html
- **Production:** IP whitelisting recommended

---

## 🐛 Troubleshooting

### Problem: Still showing "Invalid email or password" on login

**Solution:**

1. **Verify registration was successful:**
   - Check MongoDB compass - does user exist?
   - If not, registration might have failed

2. **Clear browser storage and try again:**
   - Open DevTools (F12)
   - Go to Application → Local Storage
   - Delete "token" and "user"
   - Reload page and try login again

3. **Check backend logs:**
   - Look for console output in terminal running backend
   - Should show any errors

---

### Problem: Admin redirects to home instead of admin.html

**Solution:**

1. **Check admin role in database:**

   ```javascript
   db.users.findOne({ email: "admin@nexus.com" });
   // Should show: role: "admin"
   ```

2. **Clear localStorage:**
   - DevTools → Application → Local Storage → Clear All
   - Refresh page and login again

3. **Verify admin.html exists:**
   - Check: `nexus-frontend/admin.html` exists in your folder

---

### Problem: Cannot see pending courses in admin panel

**Solution:**

1. **Verify teacher created a course:**
   - Login as teacher account
   - Check "My Courses" tab
   - Should show course as "Draft"

2. **Check database:**

   ```javascript
   db.courses.find({ status: "draft" });
   // Should show draft courses
   ```

3. **Refresh admin panel:**
   - Clear browser cache
   - Close and reopen admin.html tab

---

## 📱 Test Data Setup

### Quick Setup Script

If you want to create test data quickly, use this MongoDB script:

```javascript
// Run in MongoDB terminal/shell
use nexus

// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@test.com",
  password: "$2a$10$...", // manually register instead
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create teacher user
db.users.insertOne({
  name: "Teacher User",
  email: "teacher@test.com",
  password: "$2a$10$...", // manually register instead
  role: "teacher",
  createdAt: new Date(),
  updatedAt: new Date()
})

// Create student user
db.users.insertOne({
  name: "Student User",
  email: "student@test.com",
  password: "$2a$10$...", // manually register instead
  role: "student",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Note:** Use the UI registration instead - it will automatically hash passwords!

---

## 🚀 Admin Features Checklist

- ✅ Login with jwt authentication
- ✅ View pending courses (draft status)
- ✅ See course details (title, description, duration, highlights)
- ✅ Approve courses (change status to published)
- ✅ Reject courses (delete course)
- ✅ View payment management (UI ready, backend pending)
- ✅ Pagination support
- ✅ Toast notifications
- ✅ Responsive design

---

## 📞 Backend Endpoints (Admin Only)

All require: `Authorization: Bearer {admin_token}`

### Get Pending Courses (Draft)

```bash
GET http://localhost:5001/api/courses/admin/pending?page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "courses": [...],
    "total": 5,
    "page": 1,
    "pages": 1
  }
}
```

### Approve Course

```bash
PATCH http://localhost:5001/api/courses/{courseId}/approve
```

**Response:**

```json
{
  "success": true,
  "data": {
    "...course object with status: published..."
  }
}
```

### Reject Course

```bash
PATCH http://localhost:5001/api/courses/{courseId}/reject
```

**Response:**

```json
{
  "success": true,
  "message": "Course rejected successfully"
}
```

---

## 🎓 Course Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    COURSE LIFECYCLE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TEACHER                   ADMIN                  STUDENT    │
│  Creates Course     →       Reviews            →  Enrolls    │
│  (Status: draft)            Approves/Rejects       Pays       │
│                             (Status: published)    Learns     │
│                             OR Deletes (Rejected)  Progress   │
│                                                              │
│  Visibility:         Visibility:               Visibility:  │
│  ✓ Sees draft       ✓ Sees draft courses     ✗ No draft     │
│  ✓ Sees published   ✓ No access to student   ✓ Published OK │
│  ✗ Sees student's   ✗ courses                ✓ Can enroll  │
│    enrollment                                 ✓ Progress    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Course Status Reference

| Status        | Visibility                    | Can Edit | Can Enroll | Next Action     |
| ------------- | ----------------------------- | -------- | ---------- | --------------- |
| **draft**     | Teacher ✓, Admin ✓, Student ✗ | Yes      | No         | Await Approval  |
| **published** | All roles ✓                   | No\*     | Yes        | Students Enroll |
| **rejected**  | None                          | -        | -          | Deleted         |

\* Teachers cannot edit published courses (optional future feature)

---

## 🔄 Login Flow Diagram

```
┌─────────────┐
│   Login     │
│  Page       │
└──────┬──────┘
       │
       ├─ Valid Email/Password
       │           │
       └──────────→ Backend Auth
                   │
         ┌─────────┴─────────┐
         │                   │
    ✓ Success           ✗ Failed
         │                   │
         ├─Store JWT token   └──→ Error Message
         ├─Store User info        (shown on page)
         └─Check Role
              │
    ┌─────────┼─────────┐
    │         │         │
  Admin    Teacher    Student
    │         │         │
    ↓         ↓         ↓
admin.html  #teacher-  #student-
            dashboard  dashboard
```

---

## ✅ Verification Checklist

Before considering admin setup complete:

- [ ] Backend server running (http://localhost:5001)
- [ ] Frontend serving (http://localhost:3000)
- [ ] Can register new account
- [ ] Registration clears password (not showing)
- [ ] Can login with correct credentials
- [ ] Role changed to "admin" in database
- [ ] Redirected to admin.html after login (not hash route)
- [ ] admin.html loads properly
- [ ] Can see pending courses tab
- [ ] Can see payment management tab
- [ ] Can approve/reject courses
- [ ] Changes reflect immediately

---

**Last Updated:** March 21, 2024  
**Version:** 1.0  
**Status:** ✅ Ready for Testing

---

## 💡 Next Steps

1. **Follow the 3-step setup above** to create admin account
2. **Test the complete flow:** Register teacher → Create course → Approve as admin → Verify as student
3. **Check console logs:** Browser console should show "✓ Login successful"
4. **Verify database:** Use MongoDB Compass to confirm user and course data

**Having issues?** Check the Troubleshooting section above! 🛠️
