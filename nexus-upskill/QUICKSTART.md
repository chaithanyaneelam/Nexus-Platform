# 🚀 QUICK START GUIDE - Nexus Upskill

## ⚡ 5-Minute Setup

### 1. Install & Run

```bash
cd "c:\Users\neela\Desktop\Nexus Platform\nexus-upskill"
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev
```

### 2. Verify Server

```bash
# Open browser or use curl
curl http://localhost:5000/api/health

# Expected response
{
  "status": "success",
  "message": "🚀 Nexus Upskill API is running!",
  "timestamp": "2024-03-21T..."
}
```

---

## 📁 File Organization Reference

### Core Application Files

```
src/index.ts                  Main server entry point
src/config/database.ts        MongoDB connection
src/config/constants.ts       Enums & configuration
```

### Models (Database Schemas)

```
src/models/User.ts            👤 User schema
src/models/Course.ts          📚 Course schema
src/models/Enrollment.ts      📋 Enrollment schema
src/models/Payment.ts         💳 Payment schema
```

### Data Access Layer

```
src/repositories/UserRepository.ts
src/repositories/CourseRepository.ts
src/repositories/EnrollmentRepository.ts
src/repositories/PaymentRepository.ts
```

### Authentication & Authorization

```
src/middleware/auth.ts        JWT & RBAC middleware
src/utils/jwt.ts              Token utilities
```

### Error Handling

```
src/utils/errors.ts           Custom error classes
```

---

## 🔐 Authentication Tokens

### Generate a Token

```typescript
// In AuthService (to be implemented)
const token = generateToken({
  userId: user._id.toString(),
  email: user.email,
  role: user.role,
});
```

### Use a Token

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/courses
```

### Token Payload

```typescript
{
  userId: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  role: "student",
  iat: 1713607000,        // issued at
  exp: 1714211800         // expires at
}
```

---

## 🛣️ API Route Structure (When Complete)

```
/api/auth/
  POST   /register
  POST   /login

/api/courses/
  POST   /          (teacher - create)
  GET    /          (public - list)
  GET    /:id       (public - get one)
  PUT    /:id       (teacher - update own)
  DELETE /:id       (teacher - delete own)
  PATCH  /:id/publish
  PATCH  /:id/toggle-trending (admin only)

/api/enrollments/
  POST   /          (student - enroll)
  GET    /          (get own/related)
  GET    /:id       (get one)
  PATCH  /:id       (update progress)

/api/payments/
  POST   /          (student - initiate)
  POST   /:id/verify (admin - approve/reject)
  GET    /          (list own/related)
  GET    /:id       (get one)
```

---

## 🗂️ Folder Quick Reference

| Folder             | Purpose                   | Status      |
| ------------------ | ------------------------- | ----------- |
| `src/config`       | Configuration & constants | ✅ Complete |
| `src/models`       | Mongoose schemas          | ✅ Complete |
| `src/repositories` | Database access layer     | ✅ Complete |
| `src/middleware`   | Express middleware        | ✅ Complete |
| `src/utils`        | Helper utilities          | ✅ Complete |
| `src/services`     | Business logic            | 📋 Next     |
| `src/controllers`  | Request handlers          | 📋 Next     |
| `src/validators`   | Zod schemas               | 📋 Next     |
| `src/routes`       | API routes                | 📋 Next     |
| `public`           | Frontend assets           | 📋 Next     |

---

## 💻 Common Commands

```bash
# Development
npm run dev              # Start with ts-node (auto-reload)

# Building
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled JavaScript

# Checking
npm list                 # List all dependencies
npm outdated             # Check for outdated packages
npm update               # Update dependencies
```

---

## 🔍 Key Middleware Functions

### Authentication

```typescript
import { authenticate } from "./middleware/auth";

// Use on protected routes
router.get("/profile", authenticate, profileController);
```

### Authorization by Role

```typescript
import { isAdmin, isTeacher, isStudent } from "./middleware/auth";

// Admin only
router.delete("/users/:id", isAdmin, deleteUserController);

// Teacher only
router.post("/courses", isTeacher, createCourseController);

// Student only
router.post("/enrollments", isStudent, enrollViewController);

// Teachers and Admins
router.get("/analytics", isTeacherOrAdmin, analyticsController);
```

---

## 📊 Database Connection

### Connection String Format

```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

### Connection Status

```bash
# Check in console output during npm run dev
# ✅ MongoDB Connected: cluster.mongodb.net
# 📊 Database: nexus-upskill
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-secret-key-32-chars-min
JWT_EXPIRY=7d

# Payments
ADMIN_UPI_ID=admin@upi
PAYMENT_COMMISSION_PERCENTAGE=20
```

---

## 🎯 Data Structure Examples

### User Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$encrypted...",
  "role": "student",
  "mobileNumber": "9876543210",
  "interests": ["Node.js", "React"],
  "linkedinUrl": "https://linkedin.com/in/john",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Course Document

```json
{
  "_id": "507f191e810c19729de860ea",
  "title": "Advanced Node.js",
  "description": "Master Node.js with TypeScript...",
  "teacherId": "507f1f77bcf86cd799439011",
  "duration": 40,
  "price": 1999,
  "highlights": ["Real projects", "Job ready"],
  "status": "published",
  "isTrending": true,
  "createdAt": "2024-01-10T10:30:00Z"
}
```

### Enrollment Document

```json
{
  "_id": "507f191e810c19729de860eb",
  "studentId": "507f1f77bcf86cd799439012",
  "courseId": "507f191e810c19729de860ea",
  "status": "active",
  "progress": 45,
  "enrolledAt": "2024-01-20T10:30:00Z"
}
```

### Payment Document

```json
{
  "_id": "507f191e810c19729de860ec",
  "studentId": "507f1f77bcf86cd799439012",
  "teacherId": "507f1f77bcf86cd799439011",
  "courseId": "507f191e810c19729de860ea",
  "enrollmentId": "507f191e810c19729de860eb",
  "amount": 1999,
  "adminCommission": 400,
  "teacherPayment": 1599,
  "transactionId": "TXN123456789",
  "status": "paid_to_teacher",
  "adminVerifiedAt": "2024-01-21T10:30:00Z"
}
```

---

## 🎨 Password Hashing

Passwords are automatically hashed using bcrypt:

```typescript
// In User model pre-save hook
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
```

This happens automatically when creating a user - never store plain passwords!

---

## 📚 API Response Format

### Success Response (200/201)

```json
{
  "status": "success",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Error Response (400/401/403/500)

```json
{
  "status": "error",
  "message": "Invalid email or password",
  "errors": [{ "field": "email", "message": "Email not found" }]
}
```

---

## 🔐 Privacy Rules

### Phone Number Access

- ❌ Teachers cannot see student phone numbers
- ❌ Students cannot see teacher phone numbers
- ✅ Only Admin can see all phone numbers

### Implementation Pattern

```typescript
// In responses, conditionally exclude fields:
if (requestingUserRole !== "admin") {
  delete user.mobileNumber;
  delete user.company; // if employee
}
```

---

## 🎯 Next Phase Checklist

Phase 2 will implement:

- [ ] Zod validation schemas for all endpoints
- [ ] Custom error messages
- [ ] Client-side validation helpers
- [ ] Conditional field validation (company for employees)

Run this command when ready:

```bash
# After npm install, validate setup works:
npm run dev
# Then visit: http://localhost:5000/api/health
```

---

## 📞 Common Issues & Solutions

### MongoDB Connection Failed

```
❌ Error: connect ECONNREFUSED
✅ Solution: Check MongoDB URI in .env
✅ Ensure IP whitelist in MongoDB Atlas
```

### Port Already in Use

```
❌ Error: listen EADDRINUSE :::5000
✅ Solution: Change PORT in .env or kill process on 5000
```

### JWT Token Expired

```
❌ Error: 401 Invalid or expired token
✅ Solution: Generate new token via /api/auth/login
```

### Validation Error

```
❌ Error: Zod validation failed
✅ Solution: Check request body format matches schema
```

---

## 📖 Documentation Files

- `README.md` - Project overview & dependencies
- `SETUP.md` - Detailed setup instructions
- `ARCHITECTURE.md` - Visual architecture diagrams
- `PHASES.md` - Complete implementation roadmap
- `QUICKSTART.md` - This file

---

## ✅ Phase 1 Complete!

You have a production-ready foundation:

- ✅ TypeScript type safety
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Error handling
- ✅ Repository pattern

**Ready for Phase 2: Validation Schemas?** 🚀

---

**Last Updated**: March 21, 2024
**Status**: Phase 1 Complete | Phase 2 Ready to Start
