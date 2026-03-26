# 🔍 Enrollment & Payment Flow - Testing & Troubleshooting Guide

## ✅ Issues Fixed

1. **AdminController routes binding** - Fixed method calls to properly bind `this` context
2. **Route handler wrapping** - All admin routes now properly wrap controller methods with arrow functions
3. **Service instantiation** - AdminService and PaymentService are properly exported as singleton instances

---

## 🧪 Complete Testing Flow

### **Step 1: Register a Student Account**

**Endpoint:** `POST /api/auth/register`

```json
{
  "name": "John Student",
  "email": "student@test.com",
  "password": "Test@123",
  "mobileNumber": "9876543210",
  "role": "student",
  "interests": ["Web Development", "React"]
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "_id": "student_id_123",
    "email": "student@test.com",
    "role": "student",
    "token": "eyJhbGc..."
  }
}
```

**Save the token as:** `STUDENT_TOKEN`

---

### **Step 2: Create a Course (As Teacher)**

**First, register as teacher:**

```json
{
  "name": "Jane Teacher",
  "email": "teacher@test.com",
  "password": "Test@123",
  "mobileNumber": "9123456789",
  "role": "teacher",
  "upiId": "jane@upi",
  "linkedinUrl": "https://linkedin.com/in/jane",
  "profession": "Software Engineer"
}
```

**Save token as:** `TEACHER_TOKEN`

**Create a course:**

**Endpoint:** `POST /api/courses/`

```json
{
  "title": "React Advanced",
  "description": "Learn advanced React patterns and hooks",
  "duration": 40,
  "price": 1999,
  "highlights": ["Hooks", "Context API", "Performance"]
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "course_id_123",
    "title": "React Advanced",
    "teacherId": "teacher_id_123",
    "price": 1999,
    "status": "draft"
  }
}
```

**Save course ID as:** `COURSE_ID`

---

### **Step 3: Student Enrolls in Course**

**Endpoint:** `POST /api/enrollments/`

**Headers:** `Authorization: Bearer STUDENT_TOKEN`

```json
{
  "courseId": "COURSE_ID"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "_id": "enrollment_id_123",
    "studentId": "student_id_123",
    "courseId": "course_id_123",
    "status": "pending_admin",
    "progress": 0,
    "enrolledAt": "2026-03-21T10:00:00Z"
  }
}
```

✅ **Enrollment created with status `pending_admin`**

---

### **Step 4: Admin Views Pending Enrollments**

**First, register as admin:**

```json
{
  "name": "Admin User",
  "email": "admin@app.com",
  "password": "Admin@123",
  "mobileNumber": "9000000000",
  "role": "admin"
}
```

**Save token as:** `ADMIN_TOKEN`

**Endpoint:** `GET /api/admin/enrollments/pending`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Expected Response:**

```json
{
  "success": true,
  "message": "Pending enrollments retrieved successfully",
  "data": [
    {
      "_id": "enrollment_id_123",
      "studentId": {
        "_id": "student_id_123",
        "name": "John Student",
        "email": "student@test.com",
        "mobileNumber": "9876543210",
        "interests": ["Web Development", "React"]
      },
      "courseId": {
        "_id": "course_id_123",
        "title": "React Advanced",
        "price": 1999,
        "teacherId": {
          "_id": "teacher_id_123",
          "name": "Jane Teacher",
          "email": "teacher@test.com"
        }
      },
      "status": "pending_admin",
      "progress": 0,
      "enrolledAt": "2026-03-21T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

✅ **Enrollment visible to admin with student details!**

---

### **Step 5: Admin Approves Enrollment (Creates Payment Request)**

**Endpoint:** `POST /api/admin/enrollments/:enrollmentId/approve`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Body:** `{}`

**Expected Response:**

```json
{
  "success": true,
  "message": "Enrollment approved. Payment request created. Student will be asked to pay.",
  "data": {
    "enrollment": {
      "_id": "enrollment_id_123",
      "status": "approved",
      "adminApprovedAt": "2026-03-21T10:05:00Z"
    },
    "payment": {
      "_id": "payment_id_123",
      "amount": 1999,
      "status": "payment_requested",
      "adminUpiId": "admin@upi"
    }
  }
}
```

✅ **Payment created with status `payment_requested`**

---

### **Step 6: Student Sees Payment Request**

**Endpoint:** `GET /api/payments/my-requests`

**Headers:** `Authorization: Bearer STUDENT_TOKEN`

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment requests retrieved successfully",
  "data": [
    {
      "_id": "payment_id_123",
      "courseId": "course_id_123",
      "amount": 1999,
      "adminUpiId": "admin@upi",
      "status": "payment_requested",
      "adminRequestedAt": "2026-03-21T10:05:00Z",
      "message": "Please pay ₹1999 to admin@upi and submit the transaction ID below"
    }
  ],
  "pagination": { "total": 1, "page": 1, "pages": 1 }
}
```

✅ **Student sees payment request with UPI ID!**

---

### **Step 7: Student Submits Transaction ID**

**Endpoint:** `POST /api/payments/:paymentId/submit-transaction`

**Headers:** `Authorization: Bearer STUDENT_TOKEN`

```json
{
  "transactionId": "UPI_TXN_123456789"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Transaction ID submitted successfully. Waiting for admin approval.",
  "data": {
    "_id": "payment_id_123",
    "transactionId": "UPI_TXN_123456789",
    "status": "transaction_submitted",
    "transactionSubmittedAt": "2026-03-21T10:10:00Z"
  }
}
```

✅ **Payment updated to `transaction_submitted`**

---

### **Step 8: Admin Approves Payment**

**Endpoint:** `POST /api/admin/payments/:paymentId/approve`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Body:** `{}`

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment approved! Enrollment activated. Complete this payment to teacher.",
  "data": {
    "payment": {
      "_id": "payment_id_123",
      "studentId": "John Student",
      "courseId": "React Advanced",
      "amount": 1999,
      "adminCommission": 399.8,
      "teacherPayment": 1599.2,
      "transactionId": "UPI_TXN_123456789",
      "status": "approved",
      "adminApprovedAt": "2026-03-21T10:15:00Z"
    },
    "enrollment": {
      "_id": "enrollment_id_123",
      "status": "active"
    }
  }
}
```

✅ **Enrollment now `active` - Student can access course!**

---

### **Step 9: Student Checks Enrolled Courses**

**Endpoint:** `GET /api/enrollments/my-enrollments`

**Headers:** `Authorization: Bearer STUDENT_TOKEN`

**Expected Response:**

```json
{
  "success": true,
  "message": "Enrollments fetched successfully",
  "data": [
    {
      "_id": "enrollment_id_123",
      "courseId": {
        "_id": "course_id_123",
        "title": "React Advanced",
        "price": 1999,
        "enrolledCount": 1
      },
      "status": "active",
      "progress": 0,
      "enrolledAt": "2026-03-21T10:00:00Z"
    }
  ],
  "pagination": { "total": 1, "page": 1, "pages": 1 }
}
```

✅ **Student sees active course with access granted!**

---

### **Step 10: Admin Transfers to Teacher & Marks Paid**

**Endpoint:** `POST /api/admin/payments/:paymentId/mark-as-paid`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Body:** `{}`

**Expected Response:**

```json
{
  "success": true,
  "message": "Payment marked as paid to teacher",
  "data": {
    "_id": "payment_id_123",
    "status": "paid_to_teacher",
    "paidToTeacherAt": "2026-03-21T10:20:00Z",
    "teacherPayment": 1599.2,
    "adminCommission": 399.8
  }
}
```

✅ **Payment marked as `paid_to_teacher`**

---

### **Step 11: Admin Dashboard Stats**

**Endpoint:** `GET /api/admin/dashboard/stats`

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Expected Response:**

```json
{
  "success": true,
  "message": "Admin dashboard stats retrieved",
  "data": {
    "pendingEnrollments": 0,
    "pendingPayments": 0,
    "approvedPayments": 0,
    "paidToTeacherPayments": 1,
    "rejectedPayments": 0,
    "totalCommissionEarned": 399.8,
    "pendingTeacherPayments": 0
  }
}
```

✅ **Admin earned ₹399.80 commission!**

---

## 🔧 Troubleshooting Checklist

### **If student enrollment doesn't appear to admin:**

```bash
# 1. Check if student token is valid
# Try: GET /api/enrollments/my-enrollments with student token
# Should return the enrollment

# 2. Check if admin token has correct role
# Try: GET /api/admin/enrollments/pending with admin token
# Should return pending enrollments

# 3. Check if admin is actually role "admin"
# Verify in database: db.users.findOne({email: "admin@app.com"})
# Should have role: "admin"

# 4. Check if enrollment was created
# In MongoDB: db.enrollments.find({status: "pending_admin"})
# Should show the enrollment

# 5. Check if routes are registered
# Look for: "/api/admin" routes in server logs
```

---

## 🐛 Common Issues & Solutions

### **Issue: "User with given email already exists"**

→ Use different email for each test user (e.g., change timestamp in email)

### **Issue: "Unauthorized" when accessing admin endpoints**

→ Make sure you're using `ADMIN_TOKEN` and user role is `admin`

### **Issue: Enrollment not visible to admin**

→ Check that enrollment was created with `status: "pending_admin"`
→ Check that admin token is valid

### **Issue: Payment not created after admin approves enrollment**

→ Check ADMIN_UPI_ID in .env (default: "admin@upi")
→ Check course price is a valid number

### **Issue: Student can't submit transaction ID**

→ Make sure payment status is `payment_requested` (not already `rejected`)
→ Make sure you're using student token

---

## 📊 Database Check Queries

```javascript
// Check pending enrollments
db.enrollments.find({ status: "pending_admin" });

// Check payment requests
db.payments.find({ status: "payment_requested" });

// Check transaction submitted payments
db.payments.find({ status: "transaction_submitted" });

// Check student enrollments
db.enrollments.find({ studentId: ObjectId("student_id_123") });

// Check teacher earnings
db.payments.find({
  teacherId: ObjectId("teacher_id_123"),
  status: "paid_to_teacher",
});
```

---

## ✅ Complete Flow Verification

```
STEP 1: Student enrolls         ✅ GET: enrollment status = pending_admin
        ↓
STEP 2: Admin approves          ✅ GET: Admin sees pending enrollment
        ↓
STEP 3: Student submits TXN     ✅ GET: Payment status = transaction_submitted
        ↓
STEP 4: Admin approves payment  ✅ GET: Enrollment status = active
        ↓
STEP 5: Student accesses course ✅ GET: Course visible in my courses
        ↓
STEP 6: Admin marks as paid     ✅ GET: Payment status = paid_to_teacher
```

If all these steps work, your payment workflow is fully operational! 🚀
