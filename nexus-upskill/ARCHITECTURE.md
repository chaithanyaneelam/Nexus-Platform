# 📊 Nexus Upskill - Project Architecture & Visualization

## 🏗️ Layered Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                       │
│          Admin | Teacher | Student Dashboard              │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/AJAX
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS ROUTES                           │
│  /api/auth  |  /api/courses  |  /api/payments  |  /api/...  │
└───────────────────────┬─────────────────────────────────────┘
                        │ Router → Controller
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLLERS                               │
│  Validate Request → Extract User → Call Service → Response  │
│  AuthController  | CourseController  | PaymentController   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Call Business Logic
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                     SERVICES                                │
│    Business Logic | Rules | Calculations | Validations     │
│  AuthService  | CourseService  | PaymentService            │
└───────────────────────┬─────────────────────────────────────┘
                        │ Call Repository
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  REPOSITORIES                               │
│         Database Abstraction Layer (DAO Pattern)            │
│  UserRepository  | CourseRepository  | PaymentRepository   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Mongoose Queries
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB                                   │
│          Collections: User | Course | Enrollment | Payment  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example - Student Enrollment

```
1. FRONTEND
   Student clicks "Enroll Now"
         ↓
2. HTTP REQUEST
   POST /api/enrollments
   Headers: { Authorization: "Bearer JWT_TOKEN" }
   Body: { courseId: "123456" }
         ↓
3. ROUTE HANDLER
   express.Router.post('/enrollments', authenticate, enrollmentController)
         ↓
4. MIDDLEWARE
   authenticate() → Validates JWT → Extracts user info → req.user attached
         ↓
5. CONTROLLER
   EnrollmentController.create()
   - Extract req.user (student)
   - Extract courseId from req.body
   - Validate input with Zod
   - Call EnrollmentService.create()
         ↓
6. SERVICE
   EnrollmentService.create()
   - Check if student already enrolled
   - Check if course exists and is published
   - Validate business rules
   - Call repository.create()
         ↓
7. REPOSITORY
   EnrollmentRepository.create()
   - Create MongoDB document
   - return saved enrollment
         ↓
8. DATABASE
   Enrollments.insertOne({
     studentId: ObjectId("student"),
     courseId: ObjectId("123456"),
     status: "pending",
     progress: 0
   })
         ↓
9. RESPONSE
   {
     status: "success",
     data: {
       enrollmentId,
       studentId,
       courseId,
       status: "pending"
     }
   }
         ↓
10. FRONTEND
    Show success message
    Redirect to payment page
```

## 🔐 Authentication & Authorization Flow

```
┌─ USER REGISTRATION ────────────────────────┐
│                                            │
│ 1. User submits form                      │
│ 2. Zod validates input                    │
│ 3. Check email not already used           │
│ 4. Hash password with bcrypt              │
│ 5. Save to User collection                │
│ 6. Return JWT token                       │
│                                            │
└────────────────────────────────────────────┘

┌─ USER LOGIN ───────────────────────────────┐
│                                            │
│ 1. User submits email + password          │
│ 2. Find user by email                     │
│ 3. Compare passwords (bcrypt)             │
│ 4. Generate JWT with payload:             │
│    { userId, email, role }                │
│ 5. Return token to client                 │
│                                            │
└────────────────────────────────────────────┘

┌─ PROTECTED ROUTE ACCESS ───────────────────┐
│                                            │
│ 1. Client sends request with token        │
│    Authorization: Bearer <jwt_token>      │
│                                            │
│ 2. authenticate() middleware              │
│    - Extract token from header            │
│    - Verify signature (verifyToken)       │
│    - Check expiration                     │
│    - Attach user to req.user              │
│                                            │
│ 3. authorize(...roles) middleware         │
│    - Check req.user.role in allowed list  │
│    - Grant/deny access                    │
│                                            │
│ 4. Controller proceeds with request       │
│                                            │
└────────────────────────────────────────────┘

┌─ ROLE-BASED ACCESS EXAMPLES ───────────────┐
│                                            │
│ Admin Only:                                │
│   router.post('/verify-payment', isAdmin) │
│                                            │
│ Teacher Only:                              │
│   router.post('/create-course', isTeacher)│
│                                            │
│ Student Only:                              │
│   router.post('/enroll', isStudent)       │
│                                            │
│ Any Authenticated:                         │
│   router.get('/profile', authenticate)    │
│                                            │
│ Teachers & Admins:                         │
│   router.get('/analytics', isTeacherOrAdmin)
│                                            │
└────────────────────────────────────────────┘
```

## 💳 Payment Processing Flow (Admin Escrow)

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: STUDENT PAYS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Student clicks "Purchase" on course                       │
│           ↓                                                │
│  App shows Admin UPI ID & QR Code                          │
│           ↓                                                │
│  Student scans QR & enters amount in their UPI app         │
│           ↓                                                │
│  Student transfers money to ADMIN_UPI_ID                  │
│           ↓                                                │
│  Student uploads transaction ID (& optional screenshot)    │
│           ↓                                                │
│  POST /api/payments/initiate {                            │
│    courseId,                                              │
│    transactionId,                                         │
│    screenshotUrl                                          │
│  }                                                         │
│           ↓                                                │
│  Payment created: status = "pending_admin"                │
│  Enrollment created: status = "pending"                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: ADMIN VERIFICATION                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Admin logs into Nexus Upskill dashboard                   │
│           ↓                                                │
│  Navigates to "Pending Payments"                           │
│           ↓                                                │
│  See list of pending payments:                             │
│    - Student Name | Course | Amount | Trans ID | Status   │
│           ↓                                                │
│  Admin checks their bank account for receipt              │
│           ↓                                                │
│  If verified:                                             │
│    - Click "Confirm" button                               │
│       ↓                                                   │
│       POST /api/payments/:paymentId/verify {             │
│         action: "approve"                                 │
│       }                                                   │
│           ↓                                               │
│  If fraud/issue:                                          │
│    - Click "Reject" button                                │
│       ↓                                                   │
│       POST /api/payments/:paymentId/verify {             │
│         action: "reject",                                 │
│         reason: "Amount mismatch"                         │
│       }                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         STEP 3: SYSTEM PROCESSES CONFIRMATION              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Calculation:                                              │
│    coursePrice = 1000                                      │
│    adminCommission = 1000 × 20% = 200                      │
│    teacherPayment = 1000 - 200 = 800                       │
│           ↓                                                │
│  Update Payment:                                           │
│    status: 'pending_admin' → 'paid_to_teacher'            │
│    adminCommission: 200                                    │
│    teacherPayment: 800                                     │
│    adminVerifiedAt: now                                    │
│           ↓                                                │
│  Update Enrollment:                                        │
│    status: 'pending' → 'active'                            │
│           ↓                                                │
│  Send Notifications:                                       │
│    - Student: "Course access unlocked!"                   │
│    - Teacher: "You earned ₹800 from {studentName}"        │
│           ↓                                                │
│  Course becomes accessible to student                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🛡️ Privacy Guard Implementation

```
┌────────────────────────────────────────────────────────────┐
│  PHONE NUMBER VISIBILITY (Most Sensitive)                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Admin requests GET /api/users/:userId                    │
│  ├─ Returns: ✅ mobileNumber, email, ...all fields       │
│  │                                                        │
│  Teacher requests GET /api/users/:studentId              │
│  ├─ Returns: ❌ EXCLUDED mobileNumber                    │
│  ├─ Returns: ✅ name, interests, linkedinUrl, ...        │
│  │                                                        │
│  Student requests GET /api/users/:teacherId              │
│  ├─ Returns: ❌ EXCLUDED mobileNumber, company          │
│  ├─ Returns: ✅ name, linkedinUrl, gitHubUrl, ...       │
│                                                            │
└────────────────────────────────────────────────────────────┘

Implementation Pattern:
────────────────────────

// In UserRepository or Controller
async getPublicProfile(userId: string, requesterRole: string) {
  const user = await User.findById(userId);

  if (requesterRole === 'admin') {
    return user; // Full access
  }

  // Remove sensitive fields
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    // mobileNumber ❌ EXCLUDED
    // company ❌ EXCLUDED (if not admin/teacher)
  };

  return safeUser;
}
```

## 📈 Data Flow - Course Creation

```
TEACHER
  │
  │ POST /api/courses
  │ { title, description, duration, price, highlights }
  │
  ↓
ROUTE (/courses)
  │ authenticate() → authorize(TEACHER)
  │
  ↓
CONTROLLER (CourseController)
  │ 1. Validate request with Zod
  │ 2. Extract req.user (teacher)
  │ 3. Call service.createCourse()
  │
  ↓
SERVICE (CourseService)
  │ 1. Check teacher exists
  │ 2. Validate course data
  │ 3. Set default: status = "draft"
  │ 4. Call repository.create()
  │
  ↓
REPOSITORY (CourseRepository)
  │ 1. Create Course document
  │ 2. Return saved course
  │
  ↓
DATABASE (MongoDB)
  │
  db.courses.insertOne({
    title: "...",
    description: "...",
    teacherId: ObjectId(teacher),
    duration: 30,
    price: 1000,
    status: "draft",
    isTrending: false,
    createdAt: now,
    updatedAt: now
  })
  │
  ↓
RESPONSE to TEACHER
  │
  {
    status: "success",
    data: {
      courseId: "123456",
      title: "...",
      status: "draft",
      message: "Course created successfully. Publish when ready!"
    }
  }
```

## 🗂️ Complete Folder Structure Reference

```
nexus-upskill/
│
├── src/
│   ├── config/
│   │   ├── database.ts              # MongoDB connection
│   │   └── constants.ts             # Enums & constants
│   │
│   ├── models/                      # Mongoose Schemas
│   │   ├── User.ts                  # 👤 User model
│   │   ├── Course.ts                # 📚 Course model
│   │   ├── Enrollment.ts            # 📋 Enrollment model
│   │   └── Payment.ts               # 💳 Payment model
│   │
│   ├── repositories/                # Database Layer
│   │   ├── UserRepository.ts        # User CRUD
│   │   ├── CourseRepository.ts      # Course CRUD
│   │   ├── EnrollmentRepository.ts  # Enrollment CRUD
│   │   └── PaymentRepository.ts     # Payment CRUD
│   │
│   ├── services/                    # Business Logic (SOON)
│   │   ├── AuthService.ts           # Registration, Login
│   │   ├── CourseService.ts         # Course logic
│   │   ├── EnrollmentService.ts     # Enrollment logic
│   │   └── PaymentService.ts        # Payment logic
│   │
│   ├── controllers/                 # Request Handlers (SOON)
│   │   ├── AuthController.ts        # Auth endpoints
│   │   ├── CourseController.ts      # Course endpoints
│   │   ├── EnrollmentController.ts  # Enrollment endpoints
│   │   └── PaymentController.ts     # Payment endpoints
│   │
│   ├── routes/                      # API Routes (SOON)
│   │   ├── auth.ts
│   │   ├── courses.ts
│   │   ├── enrollments.ts
│   │   ├── payments.ts
│   │   └── index.ts                 # Register all routes
│   │
│   ├── validators/                  # Zod Schemas (SOON)
│   │   ├── auth.ts
│   │   ├── course.ts
│   │   ├── enrollment.ts
│   │   └── payment.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts                  # JWT & RBAC ✅
│   │   └── errorHandler.ts          # Error handling
│   │
│   ├── utils/
│   │   ├── errors.ts                # Custom errors
│   │   └── jwt.ts                   # Token utilities
│   │
│   └── index.ts                     # Server entry point
│
├── public/                          # Frontend Assets
│   ├── admin/
│   │   ├── index.html
│   │   ├── css/
│   │   └── js/
│   ├── teacher/
│   ├── student/
│   └── assets/
│
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript Config
├── .env.example                     # Env Template
├── .gitignore
├── README.md                        # Documentation
└── SETUP.md                         # Setup Guide
```

## 🎯 Implementation Checklist

```
PHASE 1: Foundation ✅ COMPLETE
├─ [x] Folder structure
├─ [x] MongoDB models with validation
├─ [x] JWT authentication middleware
├─ [x] Role-based authorization
├─ [x] Error handling
├─ [x] Repository pattern
└─ [x] TypeScript configuration

PHASE 2: Validation (NEXT)
├─ [ ] Zod schemas for all endpoints
├─ [ ] Conditional validation (company field)
├─ [ ] Custom error messages
└─ [ ] Type inference from schemas

PHASE 3: Business Logic
├─ [ ] AuthService (register, login)
├─ [ ] CourseService (create, list, publish)
├─ [ ] EnrollmentService (enroll, track)
└─ [ ] PaymentService (initiate, verify)

PHASE 4: Controllers & Routes
├─ [ ] AuthController
├─ [ ] CourseController
├─ [ ] EnrollmentController
├─ [ ] PaymentController
└─ [ ] API route definitions

PHASE 5: Frontend
├─ [ ] Admin Dashboard
├─ [ ] Teacher Dashboard
├─ [ ] Student Dashboard
└─ [ ] Auth pages

PHASE 6: Testing & Deployment
├─ [ ] Unit tests
├─ [ ] Integration tests
├─ [ ] API documentation
└─ [ ] Production deployment
```

---

**This architecture ensures:**

- ✅ Clean separation of concerns
- ✅ Easy to test and maintain
- ✅ Scalable and extensible
- ✅ Type-safe with TypeScript
- ✅ Security-first approach
- ✅ Privacy-conscious design
