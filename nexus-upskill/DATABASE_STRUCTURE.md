# 📊 NEXUS UPSKILL - DATABASE STRUCTURE & JSON FORMAT

## 🗄️ MongoDB Collections - Complete Structure

### 1️⃣ **USERS COLLECTION**

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$encrypted_bcrypt_hash_here",
  "role": "student",
  "mobileNumber": "9876543210",
  "interests": [
    "Node.js",
    "React",
    "Machine Learning"
  ],
  "upiId": null,
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "githubUrl": "https://github.com/johndoe",
  "profession": null,
  "company": null,
  "createdAt": ISODate("2024-03-21T10:30:00Z"),
  "updatedAt": ISODate("2024-03-21T10:30:00Z")
}
```

**Field Descriptions:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | MongoDB auto-generated ID |
| `name` | String | ✅ | User's full name |
| `email` | String | ✅ | Unique email address (lowercase) |
| `password` | String | ✅ | Hashed with bcrypt (10 rounds) |
| `role` | String | ✅ | "admin" \| "teacher" \| "student" |
| `mobileNumber` | String | ✅ | 10-digit phone number |
| `interests` | Array | ❌ | Array of skill interests |
| `upiId` | String | Conditional | Required if role = "teacher" |
| `linkedinUrl` | String | ❌ | LinkedIn profile URL |
| `githubUrl` | String | ❌ | GitHub profile URL |
| `profession` | String | ❌ | "student" \| "employee" |
| `company` | String | Conditional | Required if profession = "employee" |

**Indexes:**

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
```

---

### 2️⃣ **COURSES COLLECTION**

```json
{
  "_id": ObjectId("507f191e810c19729de860ea"),
  "title": "Advanced Node.js with TypeScript",
  "description": "Master backend development with Node.js, Express, TypeScript, and MongoDB. Build production-ready applications with proper architecture and best practices.",
  "teacherId": ObjectId("507f1f77bcf86cd799439011"),
  "duration": 40,
  "price": 1999,
  "highlights": [
    "Real-world projects",
    "Job-ready skills",
    "Industry expert",
    "Lifetime access",
    "Certificate included"
  ],
  "isTrending": true,
  "status": "published",
  "createdAt": ISODate("2024-03-10T08:15:00Z"),
  "updatedAt": ISODate("2024-03-21T10:30:00Z")
}
```

**Field Descriptions:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | MongoDB auto-generated ID |
| `title` | String | ✅ | Course title (5-200 chars) |
| `description` | String | ✅ | Course description (20-5000 chars) |
| `teacherId` | ObjectId | ✅ | Reference to User (teacher) |
| `duration` | Number | ✅ | Course duration in hours (1-500) |
| `price` | Number | ✅ | Price in INR (0-100000) |
| `highlights` | Array | ✅ | Key features (min 1, max 10) |
| `isTrending` | Boolean | ✅ | Admin-only toggle (default: false) |
| `status` | String | ✅ | "draft" \| "published" |

**Indexes:**

```javascript
db.courses.createIndex({ teacherId: 1 });
db.courses.createIndex({ status: 1 });
db.courses.createIndex({ isTrending: 1 });
db.courses.createIndex({ createdAt: -1 });
```

---

### 3️⃣ **ENROLLMENTS COLLECTION**

```json
{
  "_id": ObjectId("507f191e810c19729de860eb"),
  "studentId": ObjectId("507f1f77bcf86cd799439012"),
  "courseId": ObjectId("507f191e810c19729de860ea"),
  "status": "active",
  "progress": 45,
  "enrolledAt": ISODate("2024-03-20T14:25:00Z"),
  "createdAt": ISODate("2024-03-20T14:25:00Z"),
  "updatedAt": ISODate("2024-03-21T10:30:00Z")
}
```

**Field Descriptions:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | MongoDB auto-generated ID |
| `studentId` | ObjectId | ✅ | Reference to User (student) |
| `courseId` | ObjectId | ✅ | Reference to Course |
| `status` | String | ✅ | "pending" \| "approved" \| "active" \| "completed" |
| `progress` | Number | ✅ | Progress percentage (0-100) |
| `enrolledAt` | Date | ✅ | Enrollment timestamp |

**Indexes:**

```javascript
db.enrollments.createIndex({ studentId: 1, courseId: 1 }, { unique: true });
db.enrollments.createIndex({ studentId: 1 });
db.enrollments.createIndex({ courseId: 1 });
db.enrollments.createIndex({ status: 1 });
```

---

### 4️⃣ **PAYMENTS COLLECTION**

```json
{
  "_id": ObjectId("507f191e810c19729de860ec"),
  "studentId": ObjectId("507f1f77bcf86cd799439012"),
  "teacherId": ObjectId("507f1f77bcf86cd799439011"),
  "courseId": ObjectId("507f191e810c19729de860ea"),
  "enrollmentId": ObjectId("507f191e810c19729de860eb"),
  "amount": 1999,
  "adminCommission": 400,
  "teacherPayment": 1599,
  "transactionId": "TXN20240321001234",
  "screenshotUrl": "https://storage.example.com/screenshots/txn_123.png",
  "status": "paid_to_teacher",
  "rejectionReason": null,
  "adminVerifiedAt": ISODate("2024-03-21T10:45:00Z"),
  "paidToTeacherAt": ISODate("2024-03-21T11:00:00Z"),
  "createdAt": ISODate("2024-03-21T10:30:00Z"),
  "updatedAt": ISODate("2024-03-21T11:00:00Z")
}
```

**Field Descriptions:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | MongoDB auto-generated ID |
| `studentId` | ObjectId | ✅ | Reference to User (student) |
| `teacherId` | ObjectId | ✅ | Reference to User (teacher) |
| `courseId` | ObjectId | ✅ | Reference to Course |
| `enrollmentId` | ObjectId | ✅ | Reference to Enrollment |
| `amount` | Number | ✅ | Total amount paid (in INR) |
| `adminCommission` | Number | ✅ | Commission calculated (20% default) |
| `teacherPayment` | Number | ✅ | Amount paid to teacher (80% default) |
| `transactionId` | String | ✅ | Unique transaction reference |
| `screenshotUrl` | String | ❌ | Payment proof screenshot URL |
| `status` | String | ✅ | "pending_admin" → "paid_to_teacher" → "completed" |
| `rejectionReason` | String | ❌ | Reason if payment rejected |
| `adminVerifiedAt` | Date | ❌ | When admin verified |
| `paidToTeacherAt` | Date | ❌ | When teacher received payment |

**Indexes:**

```javascript
db.payments.createIndex({ transactionId: 1 }, { unique: true });
db.payments.createIndex({ studentId: 1 });
db.payments.createIndex({ teacherId: 1 });
db.payments.createIndex({ courseId: 1 });
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ createdAt: -1 });
```

---

## 📋 SAMPLE DATA QUERIES

### Insert User (Student)

```javascript
db.users.insertOne({
  name: "Neela Chaithanya",
  email: "neela@example.com",
  password: "$2a$10$...", // bcrypted
  role: "student",
  mobileNumber: "9876543210",
  interests: ["Node.js", "React"],
  linkedinUrl: "https://linkedin.com/in/neela",
  githubUrl: "https://github.com/neela",
});
```

### Insert User (Teacher)

```javascript
db.users.insertOne({
  name: "Expert Teacher",
  email: "teacher@example.com",
  password: "$2a$10$...", // bcrypted
  role: "teacher",
  mobileNumber: "9988776655",
  interests: ["Teaching", "Mentoring"],
  upiId: "teacher@phonepay",
  linkedinUrl: "https://linkedin.com/in/teacher",
  githubUrl: "https://github.com/teacher",
});
```

### Insert User (Admin)

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@nexusupskill.com",
  password: "$2a$10$...", // bcrypted
  role: "admin",
  mobileNumber: "9999999999",
  interests: [],
});
```

### Insert Course

```javascript
db.courses.insertOne({
  title: "Advanced Node.js",
  description: "Learn Node.js with TypeScript...",
  teacherId: ObjectId("507f1f77bcf86cd799439011"),
  duration: 40,
  price: 1999,
  highlights: ["Real projects", "Job ready"],
  isTrending: true,
  status: "published",
});
```

### Enroll Student

```javascript
db.enrollments.insertOne({
  studentId: ObjectId("507f1f77bcf86cd799439012"),
  courseId: ObjectId("507f191e810c19729de860ea"),
  status: "pending",
  progress: 0,
  enrolledAt: new Date(),
});
```

### Create Payment

```javascript
db.payments.insertOne({
  studentId: ObjectId("507f1f77bcf86cd799439012"),
  teacherId: ObjectId("507f1f77bcf86cd799439011"),
  courseId: ObjectId("507f191e810c19729de860ea"),
  enrollmentId: ObjectId("507f191e810c19729de860eb"),
  amount: 1999,
  adminCommission: 400,
  teacherPayment: 1599,
  transactionId: "TXN20240321001234",
  status: "pending_admin",
});
```

---

## 🔗 RELATIONSHIPS DIAGRAM

```
Users (👤 Admin/Teacher/Student)
  ├─→ Courses (📚 Created by Teacher)
  │   └─→ Enrollments (📋 Student enrolls)
  │       └─→ Payments (💳 Payment for enrollment)
  │
  └─→ Payments (💳 Student makes payment to Teacher)
```

---

## 📊 DATA HIERARCHY

```
ADMIN
├─ Can see all Users (with phone numbers)
├─ Can toggle Course trending
├─ Can verify payments
└─ Can view all transactions

TEACHER
├─ Can create/edit own courses
├─ Can view student enrollments (name + interests only, no phone)
├─ Can track earnings from courses
└─ Can see payments for their courses

STUDENT
├─ Can view published courses
├─ Can enroll in courses
├─ Can make payments
└─ Can track own progress
```

---

## 🔐 PRIVACY FIELD MAPPING

| Field          | Admin Sees | Teacher Sees | Student Sees |
| -------------- | ---------- | ------------ | ------------ |
| User Phone     | ✅         | ❌           | ❌           |
| User Company   | ✅         | ❌           | ❌           |
| Teacher UPI    | ✅         | ✅           | ❌           |
| Student Email  | ✅         | ✅           | ❌           |
| Payment Amount | ✅         | ✅ (own)     | ✅ (own)     |
| Commission     | ✅         | ❌           | ❌           |

---

## 💰 PAYMENT CALCULATION EXAMPLE

```
Course Price: ₹1999
Commission: 20%

Calculation:
adminCommission = 1999 × (20/100) = 399.80 ≈ 400
teacherPayment = 1999 - 400 = 1599

Admin gets: ₹400
Teacher gets: ₹1599
```

---

## 📈 COLLECTION CAPACITY ESTIMATES

| Collection  | Expected Records | Growth                     |
| ----------- | ---------------- | -------------------------- |
| Users       | 500-1000         | Daily new registrations    |
| Courses     | 50-100           | Teachers create courses    |
| Enrollments | 1000-5000        | Students enroll in courses |
| Payments    | 200-500          | Payment transactions       |

---

**These JSON structures are ready to use with MongoDB!** 🎉
