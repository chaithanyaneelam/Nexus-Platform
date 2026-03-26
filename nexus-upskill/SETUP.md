# 🎯 Nexus Upskill - Setup Instructions

## Step 1: Project Setup Complete! ✅

The foundational project structure has been created with all necessary folders and initial files.

## Step 2: What's Been Created

### Directory Structure

```
nexus-upskill/
├── src/
│   ├── config/
│   │   ├── database.ts          ✅ MongoDB connection setup
│   │   └── constants.ts         ✅ App constants & enums
│   │
│   ├── models/                  ✅ Mongoose schemas
│   │   ├── User.ts              (User with role-based fields)
│   │   ├── Course.ts            (Course with teacher reference)
│   │   ├── Enrollment.ts        (Student-Course enrollment)
│   │   └── Payment.ts           (Payment tracking with commission)
│   │
│   ├── repositories/            ✅ Data access layer
│   │   ├── UserRepository.ts    (CRUD for users)
│   │   ├── CourseRepository.ts  (Course management)
│   │   ├── EnrollmentRepository.ts (Enrollment tracking)
│   │   └── PaymentRepository.ts (Payment operations)
│   │
│   ├── middleware/              ✅ Express middleware
│   │   └── auth.ts              (JWT & RBAC)
│   │       ├── authenticate()   (Verify JWT token)
│   │       ├── authorize()      (Role-based access)
│   │       ├── isAdmin          (Admin-only)
│   │       ├── isTeacher        (Teacher-only)
│   │       └── isStudent        (Student-only)
│   │
│   ├── utils/                   ✅ Utility functions
│   │   ├── errors.ts            (Custom error handling)
│   │   └── jwt.ts               (Token generation & verification)
│   │
│   ├── controllers/             📋 (Coming in Step 4)
│   ├── services/                📋 (Coming in Step 4)
│   ├── validators/              📋 (Coming in Step 3)
│   ├── routes/                  📋 (Coming in Step 4)
│   │
│   └── index.ts                 ✅ Main server entry point
│
├── public/                      📁 (Frontend assets)
├── package.json                 ✅ Dependencies configured
├── tsconfig.json                ✅ TypeScript configuration
├── .env.example                 ✅ Environment template
├── .gitignore                   ✅ Git ignore rules
└── README.md                    ✅ Documentation
```

## Step 3: Key Features Implemented

### 🔐 Authentication & Security

```typescript
// JWT-based authentication
const token = generateToken({ userId, email, role });

// Role-based authorization
@Router.post('/admin-only', isAdmin)
@Router.post('/teacher-only', isTeacher)
@Router.post('/student-only', isStudent)
```

### 🗄️ Database Connection

```typescript
// Automatic MongoDB connection
await connectDB();
// ✅ Connected to: mongodb+srv://...
// 📊 Database: nexus-upskill
```

### 🏗️ Layered Architecture

```
Route (API endpoint)
  ↓
Controller (Request validation & response)
  ↓
Service (Business logic & rules)
  ↓
Repository (Database operations)
  ↓
MongoDB (Data)
```

### 📋 Data Models with Privacy

```typescript
User {
  role: 'admin' | 'teacher' | 'student'
  mobileNumber: string // Hidden from cross-role visibility
  upiId?: string // Teachers only
  company?: string // Employees only
}

Course {
  isTrending: boolean // Admin-only toggle
  status: 'draft' | 'published'
}

Payment {
  status: 'pending_admin' | 'paid_to_teacher' | 'completed'
  adminCommission: number // Calculated based on percentage
  teacherPayment: number
}
```

## Step 4: Next Steps - Coming Next

### Step 2️⃣: Zod Validation Schemas

```typescript
// We'll create validation schemas for:
- User Registration (with conditional company field)
- User Login
- Course Creation
- Enrollment Request
- Payment Verification
```

### Step 3️⃣: JWT Middleware

```typescript
// Already implemented! ✅
- authenticate(): Verify JWT tokens
- authorize(...roles): Check user roles
- isAdmin, isTeacher, isStudent: Shortcuts
```

### Step 4️⃣: Service & Controller Layer

```typescript
// Business logic layer
AuthService.register();
AuthService.login();

CourseService.createCourse();
CourseService.getCourseDetails();

PaymentService.initiatePayment();
PaymentService.verifyPayment(); // Admin only

// API endpoints
POST / api / auth / register;
POST / api / auth / login;
POST / api / courses;
POST / api / payments / verify;
```

### Step 5️⃣: Frontend Dashboards

```
Public/
├── admin-dashboard.html      # Payment verification, trending toggle
├── teacher-dashboard.html    # Course management, earnings
├── student-dashboard.html    # Enroll, track progress
├── css/
│   ├── styles.css
│   └── dashboard.css
└── js/
    ├── auth.js
    ├── api-client.js
    └── dashboard.js
```

## 🚀 Installation & Running

### 1. Install Dependencies

```bash
cd nexus-upskill
npm install
```

### 2. Setup Environment

```bash
# Copy example to .env
cp .env.example .env

# Edit .env and add:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus-upskill
JWT_SECRET=your-secret-key-min-32-chars
ADMIN_UPI_ID=your-admin-upi@bank
```

### 3. Start Server

```bash
# Development mode (with hot-reload)
npm run dev

# Output:
# 🎓 Nexus Upskill Server started on http://localhost:5000
# 📊 Environment: development
# ✅ MongoDB Connected: cluster.mongodb.net
# ✅ Ready to accept requests!
```

### 4. Health Check

```bash
curl http://localhost:5000/api/health

# Response:
# {
#   "status": "success",
#   "message": "🚀 Nexus Upskill API is running!",
#   "timestamp": "2024-03-21T10:30:00.000Z"
# }
```

## 📊 Database Schema Summary

### Users Collection

```typescript
{
  _id: ObjectId
  name: string
  email: string (unique)
  password: string (hashed with bcrypt)
  role: 'admin' | 'teacher' | 'student'
  mobileNumber: string (10 digits)
  interests: string[]
  upiId?: string (teacher only)
  linkedinUrl?: string
  githubUrl?: string
  profession?: string
  company?: string
  createdAt: Date
  updatedAt: Date
}
```

### Courses Collection

```typescript
{
  _id: ObjectId
  title: string
  description: string
  teacherId: ObjectId (ref: User)
  duration: number (hours)
  price: number
  highlights: string[]
  isTrending: boolean
  status: 'draft' | 'published'
  createdAt: Date
  updatedAt: Date
}
```

### Enrollments Collection

```typescript
{
  _id: ObjectId
  studentId: ObjectId (ref: User)
  courseId: ObjectId (ref: Course)
  status: 'pending' | 'approved' | 'active' | 'completed'
  progress: number (0-100)
  enrolledAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### Payments Collection

```typescript
{
  _id: ObjectId
  studentId: ObjectId (ref: User)
  teacherId: ObjectId (ref: User)
  courseId: ObjectId (ref: Course)
  enrollmentId: ObjectId (ref: Enrollment)
  amount: number
  adminCommission: number
  teacherPayment: number
  transactionId: string (unique)
  screenshotUrl?: string
  status: 'pending_admin' | 'paid_to_teacher' | 'completed' | 'rejected'
  rejectionReason?: string
  adminVerifiedAt?: Date
  paidToTeacherAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

## 🔑 Key Implementation Details

### Privacy Guard Implementation

```typescript
// Teachers never see student mobile number
GET /api/users/:id (as teacher)
// Returns: { name, email, interests, linkedinUrl, ... }
// Excludes: mobileNumber, company

// Students never see teacher mobile number
GET /api/courses/:id
// Returns: { title, description, teacherName, teacherProfile, ... }
// Excludes: teacherMobileNumber

// Only Admin sees everything
GET /api/users/:id (as admin)
// Returns: { ...all fields including mobileNumber }
```

### Payment Commission Flow

```typescript
// Example: Course price = ₹1000, Commission = 20%
amount = 1000
adminCommission = 1000 × 0.20 = 200
teacherPayment = 1000 - 200 = 800

// Admin gets ₹200, Teacher gets ₹800
```

### Admin Verification Flow

```
1. Student uploads transaction screenshot
   ↓
2. Payment status = 'pending_admin'
   ↓
3. Admin verifies in dashboard
   ↓
4. Admin clicks "Confirm"
   ↓
5. System:
   - Updates payment status → 'paid_to_teacher'
   - Updates enrollment → 'active'
   - Notifies student & teacher
   ↓
6. Student gains course access
7. Teacher receives notification
```

## 📱 API Response Format

All API responses follow this structure:

```typescript
// Success Response
{
  status: "success",
  message: "Operation completed",
  data: { ... }
}

// Error Response
{
  status: "error",
  message: "Error description",
  errors?: [ ... ] // For validation errors
}
```

## ✅ Checklist - What's Complete

- [x] Folder structure created
- [x] Database connection setup
- [x] MongoDB Atlas configured
- [x] Mongoose models with proper validation
- [x] JWT authentication middleware
- [x] Role-based authorization (isAdmin, isTeacher, isStudent)
- [x] Error handling utilities
- [x] Repository pattern implementation
- [x] Constants and configuration
- [x] TypeScript type safety
- [x] bcryptjs for password hashing
- [x] Express server setup
- [ ] Zod validation schemas
- [ ] Service layer (business logic)
- [ ] Controller layer (request handlers)
- [ ] API routes
- [ ] Frontend dashboards
- [ ] API documentation
- [ ] Testing suite

## 🎯 Ready for Step 2!

The foundation is solid. Ready to implement **Zod validation schemas** next! 🚀

---

**Questions?** Check the README.md for more details.
