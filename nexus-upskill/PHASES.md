# 📋 PROJECT IMPLEMENTATION ROADMAP

## 🎯 Nexus Upskill - Implementation Phases

### ✅ PHASE 1: Foundation (COMPLETE)

**What's Done:**

- [x] Project structure with layered architecture
- [x] Database models (User, Course, Enrollment, Payment)
- [x] Repository pattern for data access
- [x] JWT authentication middleware
- [x] Role-based authorization (RBAC)
- [x] Error handling utilities
- [x] Express server setup with MongoDB connection

**Files Created: 19**
**Lines of Code: ~1,500**

---

## 📝 PHASE 2: Validation Layer (NEXT - ~2-3 hours)

### Deliverables:

#### 2.1 User Validation Schemas

```typescript
// src/validators/auth.ts

RegisterSchema {
  name: string (min 2, max 50)
  email: string (valid email)
  password: string (min 6, strong password check)
  role: 'admin' | 'teacher' | 'student'
  mobileNumber: string (10 digits)
  interests: string[] (optional)

  // Conditional fields
  upiId?: string (required if role === 'teacher')
  company?: string (required if profession === 'employee')
  linkedinUrl?: string (optional, valid URL)
  githubUrl?: string (optional, valid URL)
  profession?: string (optional)
}

LoginSchema {
  email: string
  password: string
}

UpdateProfileSchema {
  name?: string
  interests?: string[]
  linkedinUrl?: string
  githubUrl?: string
}
```

#### 2.2 Course Validation Schemas

```typescript
// src/validators/course.ts

CreateCourseSchema {
  title: string (min 5, max 200)
  description: string (min 20, max 5000)
  duration: number (min 1, max 500 hours)
  price: number (min 0, max 100000)
  highlights: string[] (min 1, max 10 items)
  status?: 'draft' | 'published'
}

UpdateCourseSchema {
  title?: string
  description?: string
  duration?: number
  price?: number
  highlights?: string[]
  status?: 'draft' | 'published'
}

PublishCourseSchema {
  // Only validates that course can be published
}
```

#### 2.3 Enrollment Validation Schemas

```typescript
// src/validators/enrollment.ts

CreateEnrollmentSchema {
  courseId: string (valid MongoDB ObjectId)
  // studentId from authenticated user
}

UpdateEnrollmentSchema {
  status?: 'pending' | 'approved' | 'active' | 'completed'
  progress?: number (min 0, max 100)
}
```

#### 2.4 Payment Validation Schemas

```typescript
// src/validators/payment.ts

InitiatePaymentSchema {
  courseId: string (valid MongoDB ObjectId)
  transactionId: string (unique)
  screenshotUrl?: string (optional URL)
}

VerifyPaymentSchema {
  action: 'approve' | 'reject'
  rejectionReason?: string (required if action === 'reject')
}
```

#### 2.5 Query Parameter Validators

```typescript
// src/validators/query.ts

PaginationSchema {
  page?: number (min 1)
  limit?: number (min 1, max 100)
}

FilterSchema {
  role?: 'admin' | 'teacher' | 'student'
  status?: string
  isTrending?: boolean
}
```

### Implementation Steps:

1. **Install Zod**

   ```bash
   npm install zod
   ```

2. **Create validator files** (4 files, ~100 lines each)
   - `src/validators/auth.ts`
   - `src/validators/course.ts`
   - `src/validators/enrollment.ts`
   - `src/validators/payment.ts`

3. **Create helper utilities**

   ```typescript
   // src/utils/validation.ts
   export const validateRequest = (data, schema) => {
     try {
       return { success: true, data: schema.parse(data) };
     } catch (error) {
       return { success: false, errors: error.errors };
     }
   };
   ```

4. **Update controllers** to use validateRequest (will be done in Phase 4)

---

## 🔧 PHASE 3: Service Layer (Hours 4-8)

### Deliverables:

#### 3.1 AuthService

```typescript
// src/services/AuthService.ts

class AuthService {
  async register(userData) {
    // 1. Check email exists
    // 2. Hash password
    // 3. Create user
    // 4. Generate JWT token
    // 5. Return token + user (without password)
  }

  async login(email, password) {
    // 1. Find user by email
    // 2. Compare passwords
    // 3. Generate JWT token
    // 4. Return token + user (without password)
  }

  async validatePassword(password) {
    // Check: min 6 chars, has uppercase, has number
  }
}
```

#### 3.2 CourseService

```typescript
// src/services/CourseService.ts

class CourseService {
  async createCourse(teacherId, courseData) {
    // 1. Validate teacher exists
    // 2. Create course with status "draft"
    // 3. Return created course
  }

  async publishCourse(courseId, teacherId) {
    // 1. Check course belongs to teacher
    // 2. Validate course ready
    // 3. Update status to "published"
  }

  async toggleTrending(courseId) {
    // Admin only - toggle isTrending flag
  }

  async getCourseWithEnrollments(courseId) {
    // Get course with enrollment count
  }

  async searchCourses(filters) {
    // Search by title, teacher, price range, etc.
  }
}
```

#### 3.3 EnrollmentService

```typescript
// src/services/EnrollmentService.ts

class EnrollmentService {
  async enrollStudent(studentId, courseId) {
    // 1. Check course exists & published
    // 2. Check not already enrolled
    // 3. Create enrollment with status "pending"
    // 4. Return enrollment
  }

  async approveEnrollment(enrollmentId) {
    // Admin: Update status to "approved"
  }

  async activateEnrollment(enrollmentId) {
    // Update status to "active" (after payment verified)
  }

  async updateProgress(enrollmentId, progress) {
    // Update student progress (0-100)
  }

  async getStudentEnrollments(studentId) {
    // Get all enrollments for student with course details
  }

  async getTeacherEnrollments(teacherId) {
    // Get all enrollments for courses taught by teacher
  }
}
```

#### 3.4 PaymentService

```typescript
// src/services/PaymentService.ts

class PaymentService {
  async initiatePayment(studentId, courseId, transactionData) {
    // 1. Get course details
    // 2. Calculate: adminCommission, teacherPayment
    // 3. Create payment record
    // 4. Create/update enrollment (status: pending)
    // 5. Return payment details
  }

  async verifyPayment(paymentId, action, rejectionReason) {
    // Admin only actions:
    // 1. If approve:
    //    - Update payment status to "paid_to_teacher"
    //    - Update enrollment status to "active"
    //    - Store adminVerifiedAt timestamp
    // 2. If reject:
    //    - Update payment status to "rejected"
    //    - Store rejectionReason
  }

  async getAdminEarnings() {
    // Admin: Get total commission earned
  }

  async getTeacherEarnings(teacherId) {
    // Teacher: Get total amount earned from courses
  }

  async calculateCommission(amount) {
    // amount × (PAYMENT_COMMISSION_PERCENTAGE / 100)
  }
}
```

---

## 🎮 PHASE 4: Controllers & Routes (Hours 9-14)

### Deliverables:

#### 4.1 AuthController

```typescript
// src/controllers/AuthController.ts

class AuthController {
  async register(req, res) {
    // 1. Validate request (Zod)
    // 2. Call service.register()
    // 3. Return token + user
  }

  async login(req, res) {
    // 1. Validate request
    // 2. Call service.login()
    // 3. Return token
  }
}

// Routes: src/routes/auth.ts
POST   /api/auth/register   → (no auth needed)
POST   /api/auth/login      → (no auth needed)
```

#### 4.2 CourseController

```typescript
// src/controllers/CourseController.ts

class CourseController {
  async createCourse(req, res) {
    // Teacher only
  }

  async getCourse(req, res) {
    // Public (published only)
  }

  async listCourses(req, res) {
    // Public (with filters)
  }

  async updateCourse(req, res) {
    // Teacher only (their own courses)
  }

  async publishCourse(req, res) {
    // Teacher only
  }

  async toggleTrending(req, res) {
    // Admin only
  }
}

// Routes: src/routes/courses.ts
POST   /api/courses                      → isTeacher
GET    /api/courses                      → public
GET    /api/courses/:id                  → public
PUT    /api/courses/:id                  → isTeacher
DELETE /api/courses/:id                  → isTeacher
PATCH  /api/courses/:id/publish          → isTeacher
PATCH  /api/courses/:id/toggle-trending  → isAdmin
```

#### 4.3 EnrollmentController

```typescript
// src/controllers/EnrollmentController.ts

class EnrollmentController {
  async enrollCourse(req, res) {
    // Student only
  }

  async getEnrollment(req, res) {
    // Student/Teacher/Admin
  }

  async listEnrollments(req, res) {
    // Filtered by role
  }

  async updateProgress(req, res) {
    // Student updates their own progress
  }
}

// Routes: src/routes/enrollments.ts
POST   /api/enrollments           → isStudent
GET    /api/enrollments           → authenticate
GET    /api/enrollments/:id       → authenticate
PATCH  /api/enrollments/:id       → authenticate
```

#### 4.4 PaymentController

```typescript
// src/controllers/PaymentController.ts

class PaymentController {
  async initiatePayment(req, res) {
    // Student: Create payment request
  }

  async verifyPayment(req, res) {
    // Admin: Approve or reject payment
  }

  async getPayment(req, res) {
    // Fetch payment details
  }

  async listPayments(req, res) {
    // Admin: all payments
    // Teacher: payments for their courses
    // Student: their own payments
  }

  async getTeacherEarnings(req, res) {
    // Teacher: their earnings
  }

  async getAdminEarnings(req, res) {
    // Admin: all earnings
  }
}

// Routes: src/routes/payments.ts
POST   /api/payments           → isStudent
POST   /api/payments/:id/verify → isAdmin
GET    /api/payments           → authenticate
GET    /api/payments/:id       → authenticate
GET    /api/payments/earnings  → authenticate
```

#### 4.5 Route Registration

```typescript
// src/routes/index.ts

import authRoutes from "./auth";
import courseRoutes from "./courses";
import enrollmentRoutes from "./enrollments";
import paymentRoutes from "./payments";

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/enrollments", enrollmentRoutes);
  app.use("/api/payments", paymentRoutes);
};
```

---

## 🎨 PHASE 5: Frontend Dashboards (Hours 15-25)

### Deliverables:

#### 5.1 Admin Dashboard

```html
public/admin/index.html ├── Sidebar │ ├── Dashboard (Overview) │ ├── Users
(List, Edit) │ ├── Courses (Manage, Trending Toggle) │ ├── Payments (Verify,
Reject) │ ├── Analytics (Earnings, Charts) │ └── Settings ├── Main Content Areas
│ ├── Overview Cards (Users, Courses, Revenue) │ ├── Pending Payments Table │
├── Recent Transactions │ └── Analytics Charts └── Modal Dialogs ├── Payment
Verification ├── Rejection Reason └── User Details Features: - View all payments
(pending/approved/rejected) - Verify payment with confirmation - Toggle course
trending - View earnings/revenue - User management
```

#### 5.2 Teacher Dashboard

```html
public/teacher/index.html ├── Sidebar │ ├── Dashboard (Overview) │ ├── My
Courses (CRUD) │ ├── Enrollments (Track students) │ ├── Earnings (Payments
received) │ └── Profile ├── Main Content Areas │ ├── Overview Cards (Courses,
Students, Revenue) │ ├── My Courses List (with status) │ ├── Recent Enrollments
│ └── Earnings History └── Modals ├── Create/Edit Course ├── Publish Course └──
View Student List Features: - Create/edit/delete courses - View course
enrollments (student names only, no phone) - Track earnings - View payment
history - Student progress tracking (if applicable)
```

#### 5.3 Student Dashboard

```html
public/student/index.html ├── Sidebar │ ├── Dashboard (Overview) │ ├── Explore
Courses │ ├── My Courses (Enrolled) │ ├── Upcoming Payments │ └── Profile ├──
Main Content Areas │ ├── Featured/Trending Courses │ ├── My Enrollments (with
progress) │ ├── Course Discovery (Search, Filter) │ └── Payment History └──
Modals ├── Course Details ├── Payment Initiation (QR Code) │ └── Display Admin
UPI │ └── Input Transaction ID │ └── Upload Screenshot └── Enrollment Status
Features: - Browse all published courses - Enroll in courses - Track enrollment
status - View progress - Make payments via UPI - View payment history
```

#### 5.4 Shared Pages

```html
public/ ├── login.html (Login form) ├── register.html (Registration form with
role selection) ├── privacy-policy.html (Privacy & data protection) ├──
terms.html (Terms of service) └── contact.html (Contact form)
```

#### 5.5 Frontend Technologies

- **HTML5**: Semantic markup
- **CSS3**: Modern styling, responsive design
- **Vanilla JavaScript**: Modular approach
  - `api-client.js` → API communication
  - `auth.js` → JWT token management
  - `ui-components.js` → Reusable components
  - `dashboard.js` → Dashboard logic
  - `validation.js` → Client-side validation

---

## 🧪 PHASE 6: Testing & Deployment (Hours 26-30)

### Deliverables:

#### 6.1 API Testing

- Unit tests for services
- Integration tests for endpoints
- Test database setup

#### 6.2 Frontend Testing

- Component testing
- API integration testing

#### 6.3 API Documentation

- Swagger/OpenAPI specification
- Postman collection

#### 6.4 Deployment

- Environment setup
- Database migration
- Production build
- Server deployment

---

## 📊 Time Estimate

```
PHASE 1: Foundation        ✅ COMPLETE (4 hours)
PHASE 2: Validation        📝 2-3 hours
PHASE 3: Services          🔧 5-6 hours
PHASE 4: Controllers       🎮 6-8 hours
PHASE 5: Frontend          🎨 10-12 hours
PHASE 6: Testing & Deploy  🧪 4-6 hours
                          ─────────────
TOTAL                      31-40 hours
```

---

## 🚀 Ready to Start Phase 2?

Phase 2 focuses on creating **Zod validation schemas** for all request/response handling. This ensures type safety and proper validation at API boundaries.

Would you like me to:

1. ✅ **Proceed with Phase 2** - Create all Zod validation schemas
2. 📌 **Focus on a specific area** - Deep dive into one phase
3. ❓ **Get clarification** - Questions about design/approach?

---

**Current Status**: Phase 1 Complete | 25% Total Progress ✅
