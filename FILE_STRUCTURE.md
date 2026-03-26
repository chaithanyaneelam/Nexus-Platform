# Nexus Platform - Complete File Structure & Directory Guide

## 📁 Complete Project Structure

```
C:\Users\neela\Desktop\Nexus Platform\
├── nexus-upskill/                           (Backend - TypeScript/Node.js)
│   ├── src/
│   │   ├── index.ts                         # Main server entry point
│   │   ├── config/
│   │   │   ├── constants.ts                 # App configuration
│   │   │   └── database.ts                  # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── AuthController.ts            # User authentication logic
│   │   │   ├── CourseController.ts          # Course management logic
│   │   │   ├── EnrollmentController.ts      # Enrollment logic
│   │   │   └── PaymentController.ts         # Payment logic
│   │   ├── models/
│   │   │   ├── User.ts                      # User database schema
│   │   │   ├── Course.ts                    # Course database schema
│   │   │   ├── Enrollment.ts                # Enrollment database schema
│   │   │   └── Payment.ts                   # Payment database schema
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts            # User DB operations
│   │   │   ├── CourseRepository.ts          # Course DB operations
│   │   │   ├── EnrollmentRepository.ts      # Enrollment DB operations
│   │   │   └── PaymentRepository.ts         # Payment DB operations
│   │   ├── routes/
│   │   │   ├── authRoutes.ts                # Authentication endpoints
│   │   │   ├── courseRoutes.ts              # Course endpoints
│   │   │   ├── enrollmentRoutes.ts          # Enrollment endpoints
│   │   │   └── paymentRoutes.ts             # Payment endpoints
│   │   ├── services/
│   │   │   ├── AuthService.ts               # Auth business logic
│   │   │   ├── CourseService.ts             # Course business logic
│   │   │   ├── EnrollmentService.ts         # Enrollment business logic
│   │   │   └── PaymentService.ts            # Payment business logic
│   │   ├── middleware/
│   │   │   └── auth.ts                      # JWT authentication middleware
│   │   ├── validators/
│   │   │   ├── authValidator.ts             # Auth input validation
│   │   │   ├── courseValidator.ts           # Course input validation
│   │   │   ├── enrollmentValidator.ts       # Enrollment input validation
│   │   │   └── paymentValidator.ts          # Payment input validation
│   │   └── utils/
│   │       ├── errors.ts                    # Custom error classes
│   │       └── jwt.ts                       # JWT token handling
│   ├── package.json                         # Dependencies & scripts
│   ├── tsconfig.json                        # TypeScript configuration
│   ├── INSTALLATION.md                      # Installation guide
│   ├── SETUP.md                             # Setup instructions
│   ├── README.md                            # Backend documentation
│   └── ... (other backend files)
│
├── nexus-frontend/                          (Frontend - HTML/CSS/JavaScript)
│   ├── index.html                           # Main HTML entry point
│   │                                        # Page structure & navbar
│   ├── js/
│   │   ├── api.js                           # API client & backend communication
│   │   │                                    # - APIClient class
│   │   │                                    # - Auth endpoints
│   │   │                                    # - Course endpoints
│   │   │                                    # - Enrollment endpoints
│   │   │                                    # - Payment endpoints
│   │   ├── auth.js                          # Authentication manager
│   │   │                                    # - AuthManager class
│   │   │                                    # - Login/Register
│   │   │                                    # - Session management
│   │   │                                    # - Role checking
│   │   ├── router.js                        # Client-side router & pages
│   │   │                                    # - Router class
│   │   │                                    # - Route definitions
│   │   │                                    # - Page render methods (19 pages)
│   │   │                                    # - Navigation logic
│   │   └── app.js                           # Main app initialization
│   │                                        # - App startup
│   │                                        # - Session restoration
│   ├── css/
│   │   ├── style.css                        # Main stylesheet (1000+ lines)
│   │   │                                    # - CSS variables & theme
│   │   │                                    # - Global styles
│   │   │                                    # - Component styles
│   │   │                                    # - Page-specific styles
│   │   └── responsive.css                   # Responsive design styles
│   │                                        # - Mobile breakpoints
│   │                                        # - Tablet breakpoints
│   │                                        # - Desktop optimizations
│   ├── pages/                               # Optional static pages folder
│   ├── README.md                            # Frontend documentation
│   ├── SETUP.md                             # Frontend setup guide
│   ├── QUICKSTART.md                        # Quick start reference
│   └── (All files are HTML/CSS/JS - no build required)
│
├── FRONTEND_OVERVIEW.md                     # Complete architecture overview
├── FRONTEND_FEATURES.md                     # Feature checklist (100+ features)
└── (Other documentation files)
```

## 🔍 Quick File Reference

### Frontend Files

| File                 | Purpose                 | Lines | Type       |
| -------------------- | ----------------------- | ----- | ---------- |
| `index.html`         | Main HTML structure     | 100   | HTML       |
| `js/api.js`          | Backend API client      | 300   | JavaScript |
| `js/auth.js`         | Authentication manager  | 200   | JavaScript |
| `js/router.js`       | Page router & rendering | 1200  | JavaScript |
| `js/app.js`          | App initialization      | 50    | JavaScript |
| `css/style.css`      | Main stylesheet         | 1000+ | CSS        |
| `css/responsive.css` | Responsive design       | 500+  | CSS        |
| `README.md`          | Detailed documentation  | 400+  | Markdown   |
| `SETUP.md`           | Setup instructions      | 300+  | Markdown   |
| `QUICKSTART.md`      | Quick reference         | 200+  | Markdown   |

### Backend Files (Already Exists)

| File                     | Purpose            |
| ------------------------ | ------------------ |
| `src/index.ts`           | Server entry point |
| `src/config/database.ts` | MongoDB connection |
| `src/controllers/*.ts`   | Business logic     |
| `src/models/*.ts`        | Database schemas   |
| `src/routes/*.ts`        | API endpoints      |
| `src/services/*.ts`      | Service layer      |
| `src/middleware/auth.ts` | JWT middleware     |

## 🚀 How to Use This Structure

### To Run Backend

```bash
cd nexus-upskill
npm install          # First time only
npm run dev          # Start server
```

### To Run Frontend

```bash
cd nexus-frontend
# Option 1: Python
python -m http.server 3000

# Option 2: npm
npx http-server -p 3000
```

### To Access Application

```
http://localhost:3000
```

## 📖 Documentation Files

### For Developers

- **[FRONTEND_OVERVIEW.md](../FRONTEND_OVERVIEW.md)** - Full architecture & design
- **[FRONTEND_FEATURES.md](../FRONTEND_FEATURES.md)** - Complete feature list
- **[nexus-frontend/README.md](../nexus-frontend/README.md)** - Frontend details
- **[nexus-frontend/SETUP.md](../nexus-frontend/SETUP.md)** - Setup instructions

### For Quick Start

- **[nexus-frontend/QUICKSTART.md](../nexus-frontend/QUICKSTART.md)** - 5-minute setup

### For Backend

- **[nexus-upskill/README.md](../nexus-upskill/README.md)** - Backend documentation
- **[nexus-upskill/INSTALLATION.md](../nexus-upskill/INSTALLATION.md)** - Backend setup

## 🔑 Key Files to Modify

### Frontend Configuration

**File**: `js/api.js` (Line 3)

```javascript
const API_BASE_URL = "http://localhost:5000/api"; // Change port here
```

### Frontend Styling

**File**: `css/style.css` (Lines 7-15)

```css
:root {
  --primary-color: #667eea; /* Change primary color */
  --secondary-color: #764ba2; /* Change secondary color */
  /* ... more variables ... */
}
```

### Backend Configuration

**File**: `src/index.ts` (CORS origin)

```typescript
cors({
  origin: "http://localhost:3000", // Frontend URL
  credentials: true,
});
```

## 🗂️ File Organization Tips

### Finding Things

**Want to find...**

- Authentication code? → `js/auth.js` or `src/controllers/AuthController.ts`
- API calls? → `js/api.js` or `src/routes/*.ts`
- Page content? → `js/router.js` or `src/controllers/*.ts`
- Styling? → `css/style.css` or `css/responsive.css`
- Database stuff? → `src/models/*.ts` or `src/repositories/*.ts`

### Adding Features

1. **New API Call**:
   - Add method in `js/api.js` (frontend)
   - Add route in `src/routes/*.ts` (backend)
   - Add controller method in `src/controllers/*.ts`

2. **New Page**:
   - Add route in `js/router.js`
   - Add render function in `js/router.js`
   - Add CSS in `css/style.css`

3. **New Model**:
   - Create schema in `src/models/*.ts`
   - Create repository in `src/repositories/*.ts`
   - Create controller method in `src/controllers/*.ts`
   - Create API endpoint in `src/routes/*.ts`

## 📊 Project Statistics

- **Total Files**: 30+
- **Frontend Files**: 10
  - 1 HTML file
  - 4 JavaScript files
  - 2 CSS files
  - 3 Markdown docs
- **Backend Files**: 20+
  - TypeScript/JavaScript
  - Controllers, Models, Routes, Services
- **Total Lines of Code**: 3000+
  - Frontend: ~1500 lines
  - Backend: ~1500+ lines
- **Documentation**: 4000+ lines across multiple files

## 🎯 Navigation Quick Links

### Frontend Entry Points

- **Main Page**: Open `index.html` in browser
- **API Base**: Edit first 3 lines of `js/api.js`
- **routes**: Check `js/router.js` for all available pages
- **Styling**: Modify `css/style.css` for colors/layouts

### Backend Entry Points

- **Server**: Edit `src/index.ts`
- **Database**: Edit `src/config/database.ts`
- **Authentication**: Edit `src/middleware/auth.ts`
- **API Routes**: Check `src/routes/*.ts`

## 🔗 API Endpoint Map

```
Frontend js/api.js methods → Backend src/routes routes

api.register() → POST /api/auth/register
api.login() → POST /api/auth/login
api.getProfile() → GET /api/auth/profile
api.getAllCourses() → GET /api/courses
api.getCourseById() → GET /api/courses/:id
api.createCourse() → POST /api/courses
api.enrollInCourse() → POST /api/enrollments
api.getMyEnrollments() → GET /api/enrollments/my-enrollments
... (20+ total endpoints)
```

## 📱 Page Structure

### Frontend Pages (19 total)

```
Public Pages:
  #home → renderHome()
  #login → renderLogin()
  #register → renderRegister()
  #courses → renderCourses()
  #course-detail/:id → renderCourseDetail()

Protected Pages:
  #profile → renderProfile()
  #student-dashboard → renderStudentDashboard()
  #teacher-dashboard → renderTeacherDashboard()
  #admin-dashboard → renderAdminDashboard()
  #my-courses → renderMyCourses()
  #create-course → renderCreateCourse()
  #my-enrollments → renderMyEnrollments()
  #payment → renderPayment()
  ... (+ error pages, navbar, footer)
```

## 🔐 Security Files

- JWT handling: `js/auth.js` (frontend), `src/utils/jwt.ts` (backend)
- Authentication middleware: `src/middleware/auth.ts`
- Input validation: `src/validators/*.ts`
- Password hashing: `src/services/AuthService.ts`

## 🧪 Testing Resources

### Test Credentials

- Email: `student@example.com` / `password123`
- Email: `teacher@example.com` / `password123`
- Email: `admin@example.com` / `password123`

### Browser DevTools

- Console: `F12` → Console tab (see logs & errors)
- Network: `F12` → Network tab (see API calls)
- Storage: `F12` → Application → LocalStorage (see tokens)

## 📝 File Dependencies

```
index.html
├── js/app.js
│   ├── js/router.js
│   │   ├── js/auth.js
│   │   │   └── js/api.js
│   │   └── js/api.js
│   ├── js/auth.js
│   └── js/api.js
├── css/style.css
└── css/responsive.css
```

## 🚀 Deployment Structure

When deploying:

```
nexus-frontend/
├── index.html              # Upload all files
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── router.js
│   └── app.js
├── css/
│   ├── style.css
│   └── responsive.css
└── (no build or compilation needed)
```

---

**Remember**: This is a complete, production-ready application! 🎉

All files are organized, documented, and ready for deployment.
