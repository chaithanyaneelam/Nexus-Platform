# 🎓 Nexus Upskill - Backend API

> Learn through industry-level experts who teach real-world tech and help you build projects with proper guidance.

## 📋 Project Overview

Nexus Upskill is a full-stack e-learning platform designed with a **Layered Architecture** that ensures clean code separation and maintainability. The backend is built with **Node.js**, **TypeScript**, and **MongoDB**, while the frontend uses **Vanilla JavaScript** with a modular approach.

## 🏗️ Architecture Overview

```
Routes (Express endpoints)
    ↓
Controllers (Request handling & validation)
    ↓
Services (Business logic)
    ↓
Repositories (Database operations)
    ↓
MongoDB (Data persistence)
```

## 📁 Folder Structure

```
nexus-upskill/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   └── constants.ts         # App constants & enums
│   ├── controllers/             # Request handlers
│   ├── services/                # Business logic
│   ├── repositories/            # Database operations
│   │   ├── UserRepository.ts
│   │   ├── CourseRepository.ts
│   │   ├── EnrollmentRepository.ts
│   │   └── PaymentRepository.ts
│   ├── routes/                  # API endpoints
│   ├── models/                  # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Enrollment.ts
│   │   └── Payment.ts
│   ├── middleware/
│   │   └── auth.ts              # JWT & role-based access control
│   ├── validators/              # Zod validation schemas
│   ├── utils/
│   │   ├── errors.ts            # Error handling
│   │   └── jwt.ts               # Token utilities
│   └── index.ts                 # Main server file
├── public/                      # Frontend assets
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 2. Installation

```bash
# Clone the repository
cd nexus-upskill

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Update .env with your credentials
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: Your secret key for JWT signing
# - ADMIN_UPI_ID: Admin's UPI ID for payment processing
```

### 3. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

The server will start on `http://localhost:5000`

## 🔐 Security Features

### Authentication

- **JWT-based** authentication for stateless API
- **Password Hashing** using bcrypt (10 salt rounds)
- **Token Expiry** configurable (default: 7 days)

### Authorization

- **Role-Based Access Control (RBAC)**
  - `Admin`: Full system control
  - `Teacher`: Create & manage courses, track earnings
  - `Student`: Enroll in courses, make payments

### Privacy Rules

- ✅ Teachers **cannot** see student phone numbers
- ✅ Students **cannot** see teacher phone numbers
- ✅ Only Admin has full visibility of all contact details
- ✅ Phone numbers are never exposed in API responses

## 💳 Payment Flow

1. **Student initiates purchase**
   - Clicks "Purchase" on a course
   - Sees Admin UPI ID & QR code
   - Enters transaction reference after payment

2. **Admin verifies payment**
   - Reviews pending payments in Admin Dashboard
   - Verifies bank account receipt
   - Clicks "Confirm" to approve

3. **System processes payment**
   - Calculates admin commission (default: 20%)
   - Marks enrollment as "Active"
   - Updates teacher with earnings

4. **Notifications sent**
   - Student: Course access unlocked
   - Teacher: Payment notification with amount

## 📊 Data Models

### User

- Name, Email, Password (hashed)
- Role: admin, teacher, student
- Phone (stored, but privacy-protected)
- Interests, LinkedIn/GitHub URLs
- UPI ID (teachers only)
- Company (employees only)

### Course

- Title, Description, Duration
- Teacher ID (reference)
- Price, Highlights, Status
- Trending flag (admin-only toggle)

### Enrollment

- Student → Course reference
- Status: pending, approved, active, completed
- Progress tracking (0-100%)

### Payment/Transaction

- Student, Teacher, Course references
- Amount, Commission calculation
- Transaction ID & screenshot URL
- Status tracking with timestamps

## 🔑 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexus-upskill
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
ADMIN_UPI_ID=admin@upi
PAYMENT_COMMISSION_PERCENTAGE=20
```

## 📝 Validation

Using **Zod** for type-safe validation:

- Request body validation
- Query parameter validation
- Conditional schemas (e.g., company required for employees)

## 🛣️ API Routes (Coming Next)

```
Authentication
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login

Users
GET    /api/users/:id          # Get user profile
PUT    /api/users/:id          # Update profile
GET    /api/users              # List users (admin)

Courses
POST   /api/courses            # Create course (teacher)
GET    /api/courses            # List courses
GET    /api/courses/:id        # Get course details
PUT    /api/courses/:id        # Update course (teacher)
DELETE /api/courses/:id        # Delete course (teacher)
PATCH  /api/courses/:id/trending # Toggle trending (admin)

Enrollments
POST   /api/enrollments        # Enroll in course
GET    /api/enrollments        # Get enrollments
GET    /api/enrollments/:id    # Get enrollment details

Payments
POST   /api/payments/initiate  # Initiate payment
POST   /api/payments/verify    # Verify payment (admin)
GET    /api/payments           # List payments
GET    /api/payments/:id       # Get payment details
```

## 🧪 Testing

(To be implemented)

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **typescript**: Type safety
- **zod**: Schema validation
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

## 👨‍💻 Development Team

This project is built following industry best practices with a focus on:

- ✅ Clean code architecture
- ✅ Type safety with TypeScript
- ✅ Security-first approach
- ✅ Scalable repository pattern
- ✅ Comprehensive error handling

## 📄 License

MIT

## 🤝 Contributing

(Contributing guidelines coming soon)

---

**Built with ❤️ for aspiring developers**
