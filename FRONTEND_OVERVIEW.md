# Nexus Platform - Complete Project Overview

## 📊 Project Architecture

The Nexus Platform is a full-stack e-learning application with a modern frontend and robust backend.

```
Nexus Platform/
├── nexus-upskill/           (Backend - Node.js/Express/MongoDB)
│   ├── src/
│   │   ├── index.ts         # Main server file
│   │   ├── config/          # Configuration
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Service layer
│   │   ├── middleware/      # Authentication, etc.
│   │   ├── repositories/    # Database access
│   │   ├── validators/      # Input validation
│   │   └── utils/           # Utilities
│   ├── package.json
│   └── tsconfig.json
│
└── nexus-frontend/          (Frontend - HTML/CSS/JavaScript)
    ├── index.html           # Main entry point
    ├── js/
    │   ├── api.js           # API client
    │   ├── auth.js          # Authentication manager
    │   ├── router.js        # Client-side router
    │   └── app.js           # App initialization
    ├── css/
    │   ├── style.css        # Main stylesheet
    │   └── responsive.css   # Mobile responsive
    └── pages/               # Optional static pages
```

## 🔄 How It Works

### Data Flow

```
User Interaction
     ↓
     ↓ (Frontend - HTML/CSS/JavaScript)
   Router (js/router.js)
     ↓
   Page Rendering
     ↓
   Form Submission / Button Click
     ↓
   API Client (js/api.js)
     ↓
   HTTP Request with JWT Token
     ↓
     ↓ (Backend - Express.js)
   Routes (src/routes/)
     ↓
   Middleware (Authentication)
     ↓
   Controllers (src/controllers/)
     ↓
   Services (src/services/)
     ↓
   Repositories (Database Access)
     ↓
   MongoDB Database
     ↓
   Response with Data
     ↓
   Frontend Update UI
```

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (index.html)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Client-Side Router (router.js)          │   │
│  │  Handles all page navigation and routing         │   │
│  └──────────────────────────────────────────────────┘   │
│         ↓                                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Authentication Manager (auth.js)            │   │
│  │  Manages user sessions and JWT tokens           │   │
│  └──────────────────────────────────────────────────┘   │
│         ↓                                                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │        API Client Manager (api.js)               │   │
│  │  Makes HTTP requests to backend API             │   │
│  └──────────────────────────────────────────────────┘   │
└────────────┬──────────────────────────────────────────────┘
             │
             │ HTTP/REST API
             │ (JSON data with JWT Authorization)
             ↓
┌────────────────────────────────────────────────────────┐
│  Backend Server (Express.js - Port 5000)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Routes Layer (src/routes/)             │  │
│  │  /api/auth, /api/courses, /api/enrollments      │  │
│  └──────────────────────────────────────────────────┘  │
│         ↓                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │       Middleware (Authentication, CORS)         │  │
│  │  Validates JWT tokens and manages CORS          │  │
│  └──────────────────────────────────────────────────┘  │
│         ↓                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Controllers (src/controllers/)              │  │
│  │  Processes requests and calls services          │  │
│  └──────────────────────────────────────────────────┘  │
│         ↓                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │       Services (src/services/)                   │  │
│  │  Business logic and data processing             │  │
│  └──────────────────────────────────────────────────┘  │
│         ↓                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │    Repositories (src/repositories/)              │  │
│  │  Database queries and operations                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────┬──────────────────────────────────────────────┘
          │
          │ Database Operations
          ↓
    ┌─────────────┐
    │  MongoDB    │
    │  Database   │
    └─────────────┘
```

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - Login user
GET    /api/auth/profile            - Get user profile (Protected)
PUT    /api/auth/profile            - Update profile (Protected)
POST   /api/auth/change-password    - Change password (Protected)
```

### Course Endpoints

```
GET    /api/courses                 - Get all courses
GET    /api/courses/trending        - Get trending courses
GET    /api/courses/:courseId       - Get course details
POST   /api/courses                 - Create course (Teacher)
PUT    /api/courses/:courseId       - Update course (Teacher)
DELETE /api/courses/:courseId       - Delete course (Teacher)
GET    /api/courses/teacher/my-courses - Get teacher's courses
```

### Enrollment Endpoints

```
POST   /api/enrollments                          - Enroll in course
GET    /api/enrollments/my-enrollments           - Get my enrollments
GET    /api/enrollments/:enrollmentId            - Get enrollment details
PATCH  /api/enrollments/:enrollmentId/progress  - Update progress
PATCH  /api/enrollments/:enrollmentId/status    - Update status
PATCH  /api/enrollments/:enrollmentId/complete  - Complete course
```

### Payment Endpoints

```
POST   /api/payments                 - Create payment
GET    /api/payments/:paymentId      - Get payment status
GET    /api/payments/transactions    - Get transaction history
```

## 👥 User Roles & Permissions

### Student 👨‍🎓

- ✅ Browse courses
- ✅ Enroll in courses
- ✅ Track progress
- ✅ View payment history
- ✅ Update profile
- ❌ Cannot create courses
- ❌ Cannot access admin panel

### Teacher 👨‍🏫

- ✅ Create courses
- ✅ Manage own courses
- ✅ View student enrollments
- ✅ Track student progress
- ✅ Update profile
- ❌ Cannot enroll in courses
- ❌ Cannot access admin panel

### Admin 🛡️

- ✅ View all courses
- ✅ Manage all users
- ✅ View analytics
- ✅ Configure platform settings
- ✅ Full system access
- ❌ Cannot teach courses (unless separate teacher account)

## 🔐 Security Features

### Authentication

- JWT (JSON Web Token) based authentication
- Tokens stored in browser's localStorage
- Tokens sent in Authorization header
- Server validates tokens on each request

### Authorization

- Role-based access control (RBAC)
- Middleware checks user roles
- Routes protected based on user permissions
- Teachers can only edit their own courses

### Password Security

- Passwords hashed with bcryptjs
- Salt rounds: 10
- Never stored in plain text
- Change password functionality

### API Security

- CORS enabled for frontend origin only
- Input validation on all endpoints
- Error handling without exposing sensitive info
- Rate limiting (configurable)

## 📱 Frontend Features

### Pages & Routes

**Public Pages:**

- Home (`#home`) - Landing page with features
- Login (`#login`) - User authentication
- Register (`#register`) - New user registration
- Browse Courses (`#courses`) - View all courses
- Course Details (`#course-detail/:id`) - Individual course info

**Protected Pages (Require Authentication):**

- Dashboard (`#dashboard`) - Role-based home page
- Profile (`#profile`) - User profile management
- My Enrollments (`#my-enrollments`) - Student courses
- My Courses (`#my-courses`) - Teacher's courses
- Create Course (`#create-course`) - Create new course
- Payment History (`#payment`) - View transactions

### UI Components

**Navigation:**

- Sticky navbar with user info
- Navigation menu with role-based links
- User profile display with role badge
- Logout button

**Forms:**

- Login/Register forms
- Profile update form
- Password change form
- Course creation form
- Enrollment form

**Display:**

- Course cards with thumbnails
- Enrollment progress bars
- Payment/Transaction table
- Dashboard cards
- Course detail page with multimedia

### Responsive Design

- Mobile-first approach
- Breakpoints: 320px, 480px, 768px, 1200px+
- Touch-friendly button sizes
- Optimized for all screen sizes
- Dark theme (customizable)

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/teacher/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  instructor: String,
  teacherId: ObjectId (ref: User),
  price: Number,
  level: String (Beginner/Intermediate/Advanced),
  duration: String,
  thumbnail: String (URL),
  enrolledCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollments Collection

```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  studentId: ObjectId (ref: User),
  status: String (active/completed/dropped),
  progress: Number (0-100),
  enrolledAt: Date,
  completedAt: Date
}
```

### Payments Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  amount: Number,
  status: String (pending/completed/failed),
  paymentMethod: String,
  transactionId: String,
  createdAt: Date
}
```

## 🚀 Getting Started

### 1. Clone/Download Projects

```bash
# You should have two folders
cd "Nexus Platform"
# Contains: nexus-upskill (backend) and nexus-frontend (frontend)
```

### 2. Setup Backend

```bash
cd nexus-upskill
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd ../nexus-frontend
# Option A: Python
python -m http.server 3000

# Option B: npm
npx http-server -p 3000
```

### 4. Access Application

Open browser: `http://localhost:3000`

### 5. Test Accounts

Use any of these to login:

- student@example.com / password123
- teacher@example.com / password123
- admin@example.com / password123

## 🛠️ Technology Stack

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid/Flexbox
- **Vanilla JavaScript** - No dependencies
- **REST API** - HTTP communication
- **LocalStorage** - Client-side session storage

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin requests

### Deployment Ready

- Lightweight frontend (no build required)
- Dockerizable backend
- Cloud-agnostic design
- Scalable architecture

## 📊 Project Statistics

- **Frontend**: ~500 lines HTML, ~2000 lines CSS, ~1500 lines JavaScript
- **Backend**: ~1500 lines TypeScript
- **Documentation**: Complete setup and usage guides
- **Features**: 20+ pages/features
- **API Endpoints**: 20+ endpoints
- **User Roles**: 3 (Student, Teacher, Admin)

## 🔄 Data Flow Examples

### Example 1: User Registration

```
1. User fills register form on #register page
2. JS validates input
3. API client sends POST to /api/auth/register
4. Backend validates data (Zod schema)
5. Backend hashes password (bcryptjs)
6. Backend stores user in MongoDB
7. Backend returns JWT token and user data
8. Frontend stores token in localStorage
9. Frontend redirects to appropriate dashboard
10. User is now authenticated
```

### Example 2: Student Enrolls in Course

```
1. Student views course on #courses page
2. Student clicks "Enroll Now" button
3. Frontend calls api.enrollInCourse(courseId)
4. API sends POST to /api/enrollments with JWT
5. Backend middleware verifies JWT token
6. Backend checks if student exists
7. Backend checks if course exists
8. Backend creates enrollment record
9. Backend increments course enrolledCount
10. Backend returns success response
11. Frontend shows "Enrolled!" message
12. Student can now view course in #my-enrollments
```

### Example 3: Teacher Creates Course

```
1. Teacher navigates to #create-course
2. Teacher fills in course details
3. Teacher submits form
4. Frontend validates inputs
5. API sends POST to /api/courses with JWT
6. Backend verifies teacher authentication
7. Backend validates input (Zod schema)
8. Backend creates course in MongoDB
9. Backend links course to teacher
10. Backend returns new course data
11. Frontend redirects to #my-courses
12. New course appears in teacher's course list
```

## 📈 Future Enhancements

- Video hosting integration
- Live classes/webinars
- Certificate generation
- Discussion forums
- Assignment submissions
- Peer reviews
- Analytics dashboard
- Mobile app
- Payment gateway integration
- Email notifications
- Search and filters
- Course ratings and reviews

## 🤝 Contributing

To contribute to the frontend:

1. Create new branches for features
2. Follow existing code patterns
3. Update both HTML and CSS
4. Test on multiple browsers
5. Document new features
6. Submit pull requests

## 📞 Support & Documentation

- **Frontend README**: See `nexus-frontend/README.md`
- **Frontend Setup**: See `nexus-frontend/SETUP.md`
- **Quick Start**: See `nexus-frontend/QUICKSTART.md`
- **Backend**: See `nexus-upskill` documentation

## 📝 License

MIT License - Open source and free to use

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready

Happy Learning! 🚀📚
