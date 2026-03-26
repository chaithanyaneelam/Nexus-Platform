# Student Enrollment Approval System - Quick Testing Guide

## 🚀 Quick Start Test

### Prerequisites

1. Backend running: `npm run dev` in nexus-upskill folder
2. Frontend server running (or open index.html)
3. Backend compiled: `npm run build` ✅ (already done)

---

## 📋 Step-by-Step Testing

### Test #1: Student Enrollment Creates Pending Status

**Steps:**

1. Open frontend (index.html)
2. Login as Student (email: student@example.com, password: student123)
3. Go to "Browse Courses" tab
4. Find any course and click "View Details"
5. Click "Enroll Now" button
6. Confirm enrollment dialog

**Expected Result:**

- ✅ Enrollment created
- ✅ Status should be "pending"
- ✅ Student sees "Pending Admin Approval" message

**Verify in Database:**

```
db.enrollments.findOne({status: "pending"})
// Should return the enrollment
```

---

### Test #2: Admin Views Pending Enrollments

**Steps:**

1. Open `nexus-frontend/admin.html` in browser
2. Login as Admin (email: admin@example.com, password: admin123)
3. Look for "👥 Student Approvals" tab
4. Click on it

**Expected Result:**

- ✅ Tab loads successfully
- ✅ Shows pending enrollment cards
- ✅ Each card displays:
  - Student name
  - Student email
  - Student mobile number
  - Course title
  - Course price
  - Enrollment date

**Card Should Look Like:**

```
┌─ Advanced JavaScript ─ Pending Approval ─┐
├─────────────────────────────────────────┤
│ Student Name: John Smith                │
│ Email: john.smith@example.com           │
│ Mobile Number: +91-98765-43210          │
│ Course Price: ₹4,999                    │
│ Duration: 3 months                      │
│ Enrollment Date: 9/1/2024               │
│                                         │
│ [✓ Approve Student] [✗ Reject Student]  │
└─────────────────────────────────────────┘
```

---

### Test #3: Admin Approves Student

**Steps:**

1. In "Student Approvals" tab (from Test #2)
2. Click "✓ Approve Student" button
3. Observe notification

**Expected Result:**

- ✅ Success notification appears
- ✅ Enrollment card disappears
- ✅ List refreshes

**Verify Backend:**

```
db.enrollments.findOne({_id: ObjectId("...")})
// status should now be "active" (not "pending")
```

**Verify Frontend:**

- Login as the approved student
- Go to "My Courses"
- Should see enrollment with status "Active" or "Approved"
- Should be able to view course content

---

### Test #4: Admin Rejects Student

**Steps:**

1. In "Student Approvals" tab, create another test enrollment first
2. Click "✗ Reject Student" button
3. Confirm rejection in dialog
4. Observe notification

**Expected Result:**

- ✅ Confirmation dialog appears
- ✅ Success notification appears
- ✅ Enrollment card disappears
- ✅ List refreshes

**Verify Backend:**

```
db.enrollments.findOne({_id: ObjectId("...")})
// Should return null (enrollment deleted)
```

**Verify Frontend:**

- Login as rejected student
- Go to "My Courses"
- Enrollment should NOT appear in the list

---

### Test #5: Payment Routing to Admin

**Steps:**

1. Complete Test #3 (approve a student)
2. Check Admin Dashboard "💰 Payment Management" tab
3. Look for the new payment

**Expected Result:**

- ✅ Payment appears in admin's payment list
- ✅ Amount equals course price
- ✅ Payment shows as "pending" status
- ✅ Student is NOT the recipient, Admin is

---

## 🔍 API Endpoint Testing (Using Postman/cURL)

### Get Pending Enrollments

**Request:**

```
GET http://localhost:3000/api/enrollments/admin/pending?page=1&limit=10
Authorization: Bearer <ADMIN_TOKEN>
```

**Response (Success - 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f7d8c9e4b0a1b2c3d4e5f6",
      "studentId": {
        "_id": "64f7d8c9e4b0a1b2c3d4e5f0",
        "name": "John Smith",
        "email": "john@example.com",
        "mobileNumber": "+91-98765-43210"
      },
      "courseId": {
        "_id": "64f7d8c9e4b0a1b2c3d4e5f1",
        "title": "Advanced JavaScript",
        "price": 4999,
        "duration": 3
      },
      "status": "pending",
      "enrolledAt": "2024-09-01T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "pages": 1
}
```

**Response (No Admin Token - 401):**

```json
{
  "error": "Unauthorized"
}
```

**Response (Non-Admin User - 403):**

```json
{
  "error": "Access denied: Insufficient permissions"
}
```

---

### Approve Enrollment

**Request:**

```
PATCH http://localhost:3000/api/enrollments/64f7d8c9e4b0a1b2c3d4e5f6/approve
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Enrollment approved successfully",
  "data": {
    "_id": "64f7d8c9e4b0a1b2c3d4e5f6",
    "studentId": {...},
    "courseId": {...},
    "status": "active",
    "enrolledAt": "2024-09-01T10:30:00Z"
  }
}
```

**Response (Not Pending - 400):**

```json
{
  "error": "Only pending enrollments can be approved"
}
```

---

### Reject Enrollment

**Request:**

```
PATCH http://localhost:3000/api/enrollments/64f7d8c9e4b0a1b2c3d4e5f6/reject
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Enrollment rejected successfully"
}
```

---

## ✅ Verification Checklist

- [ ] Backend compiles without errors: `npm run build` ✅
- [ ] API endpoints respond with correct data
- [ ] Admin can view pending enrollments with student contact info
- [ ] Admin can approve enrollments (status changes to active)
- [ ] Admin can reject enrollments (enrollment deleted)
- [ ] Approved students can access courses
- [ ] Rejected students cannot access courses
- [ ] Payments are routed to admin account
- [ ] Non-admin users cannot access approval endpoints
- [ ] Success/error notifications display correctly
- [ ] Enrollment list refreshes after approval/rejection

---

## 🐛 Troubleshooting

### Issue: API returns 404 Not Found

**Cause:** Backend not running or endpoint not found
**Fix:**

```bash
cd nexus-upskill
npm run dev
```

### Issue: 403 Forbidden when accessing admin endpoints

**Cause:** User is not admin, or token incorrect
**Fix:**

1. Login as admin user
2. Verify token in localStorage is valid
3. Check authorization middleware in routes

### Issue: Enrollment cards not displaying

**Cause:** API not returning data, or UI binding issue
**Fix:**

1. Check browser console for errors
2. Verify API endpoint returns data
3. Check that api.js methods are called correctly

### Issue: Status still shows "pending" after approval

**Cause:** UI caching or API not saving changes
**Fix:**

1. Hard refresh browser (Ctrl+F5)
2. Check database directly: `db.enrollments.findOne({_id: ObjectId("...")})`
3. Verify approval endpoint returns updated enrollment

---

## 📊 Test Data

### Test User Accounts

**Admin Account:**

- Email: admin@example.com
- Password: admin123
- Role: admin

**Teacher Account:**

- Email: teacher@example.com
- Password: teacher123
- Role: teacher

**Student Accounts:**

- Email: student@example.com, Password: student123
- Email: student2@example.com, Password: student123
- Role: student

### Sample Course

**Course:** Advanced JavaScript

- Title: Advanced JavaScript
- Price: ₹4,999
- Duration: 3 months
- Description: Master JavaScript concepts

---

## 📝 Testing Notes

**When Testing:**

1. Always clear browser cache before testing UI changes
2. Use browser DevTools Console to check for JavaScript errors
3. Monitor Network tab to verify API calls
4. Check server logs for backend errors
5. Test with multiple students to verify pagination works

**Security Testing:**

1. Try accessing admin endpoint as student → should get 403
2. Try accessing without token → should get 401
3. Try rejecting non-pending enrollment → should get error

---

## 🎯 Success Criteria

**System is working correctly when:**

1. ✅ Students enroll with "pending" status
2. ✅ Admin sees pending enrollments in dashboard
3. ✅ Admin can see student email and mobile
4. ✅ Admin can approve students (status → "active")
5. ✅ Admin can reject students (enrollment deleted)
6. ✅ Approved students can access courses
7. ✅ Rejected students see no enrollment
8. ✅ Payments created with admin account
9. ✅ All authorization checks working

---

## 📞 Support

**For Issues:**

1. Check browser console for errors
2. Check server logs
3. Verify database records separately
4. Test API directly with cURL/Postman
5. Review STUDENT_APPROVAL_SYSTEM.md documentation

**Status:** ✅ Ready for Testing
