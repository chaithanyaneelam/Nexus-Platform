# Nexus Platform - Frontend

Welcome to the Nexus Platform Frontend! This is a modern, responsive web application for learning from industry experts.

## 📋 Project Structure

```
nexus-frontend/
├── index.html          # Main HTML entry point
├── css/
│   ├── style.css       # Main styles
│   └── responsive.css  # Mobile & responsive styles
├── js/
│   ├── api.js          # API client & backend communication
│   ├── auth.js         # Authentication manager
│   ├── router.js       # Client-side router
│   └── app.js          # Main app initialization
├── pages/              # Page templates (optional for static pages)
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Open the Application

Simply open `index.html` in your web browser:

- Double-click `index.html`, or
- Right-click → "Open with" → Your browser, or
- Use a local server (recommended)

### 2. Using a Local Server (Recommended)

For better development experience, use a local server:

**Using Python:**

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

**Using Node.js (http-server):**

```bash
npm install -g http-server
http-server -p 3000
```

**Using VS Code Live Server:**

- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

Then navigate to: `http://localhost:3000`

## 🔧 Configuration

### Backend API Configuration

The frontend communicates with the backend server. Update the API base URL in `js/api.js`:

```javascript
const API_BASE_URL = "http://localhost:5000/api"; // Change port if needed
```

**Common Backend Ports:**

- `5000` - Default Express server
- `8000` - Alternative port
- `3001` - If backend is on different Node server

### Environment Setup

1. Ensure the backend server is running (see backend README)
2. Update the `API_BASE_URL` in `js/api.js` to match your backend port
3. Open the frontend in your browser

## 📱 Features

### Public Pages

- **Home** - Welcome page with features overview
- **Login** - User authentication
- **Register** - New user registration (Student/Teacher)
- **Courses** - Browse all available courses

### Authenticated Pages

- **Dashboard** - Role-based dashboards (Admin, Teacher, Student)
- **Profile** - View and edit user profile, change password
- **My Courses** - (Teachers) Manage published courses
- **Create Course** - (Teachers) Create new courses
- **My Enrollments** - (Students) View enrolled courses
- **Course Detail** - View course information and enroll
- **Payments** - (Students) View payment history

### User Roles

#### 👨‍🎓 Student

- Browse courses
- Enroll in courses
- Track learning progress
- View payment history
- Manage profile

#### 👨‍🏫 Teacher

- Create and manage courses
- View student enrollments
- Track student progress
- Manage course content

#### 🛡️ Admin

- Monitor all courses
- Manage users
- View platform analytics
- Configure platform settings

## 🔐 Authentication

The application uses JWT (JSON Web Token) for authentication:

1. User logs in with email and password
2. Backend returns JWT token
3. Token is stored in `localStorage`
4. Token is included in all authenticated requests
5. Token expires after a certain time (server-determined)

**Session Management:**

- Tokens are stored in browser's `localStorage`
- Sessions persist across page refreshes
- Logout clears token from `localStorage`

## 🛣️ Client-Side Routing

The app uses hash-based routing. Available routes:

### Public Routes

- `#home` - Landing page
- `#login` - Login page
- `#register` - Registration page
- `#courses` - Browse courses
- `#course-detail/:courseId` - Course details

### Protected Routes

- `#profile` - User profile
- `#student-dashboard` - Student dashboard
- `#teacher-dashboard` - Teacher dashboard
- `#admin-dashboard` - Admin dashboard
- `#my-courses` - Teacher's courses
- `#create-course` - Create new course
- `#my-enrollments` - Student's enrollments
- `#payment` - Payment history

## 📡 API Integration

The frontend communicates with the backend through the `APIClient` class in `js/api.js`.

### Available API Methods

**Authentication:**

```javascript
api.register(userData);
api.login(email, password);
api.getProfile();
api.updateProfile(profileData);
api.changePassword(passwordData);
```

**Courses:**

```javascript
api.getAllCourses();
api.getTrendingCourses();
api.getCourseById(courseId);
api.createCourse(courseData);
api.getTeacherCourses();
api.updateCourse(courseId, courseData);
api.deleteCourse(courseId);
```

**Enrollments:**

```javascript
api.enrollInCourse(enrollmentData);
api.getMyEnrollments();
api.updateProgress(enrollmentId, progressData);
api.updateEnrollmentStatus(enrollmentId, statusData);
api.completeEnrollment(enrollmentId);
api.getEnrollmentById(enrollmentId);
```

**Payments:**

```javascript
api.createPayment(paymentData);
api.getPaymentStatus(paymentId);
api.getTransactionHistory();
```

## 🎨 Styling & Responsive Design

- **Style Framework:** Custom CSS with CSS Grid and Flexbox
- **Color Scheme:** Modern dark theme (customizable in CSS variables)
- **Responsive:** Mobile-first approach
- **Breakpoints:**
  - `1200px+` - Large desktops
  - `769px - 1199px` - Tablets
  - `481px - 768px` - Small tablets/large phones
  - `320px - 480px` - Mobile phones

### Custom CSS Variables

Update colors and theme in `css/style.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --bg-color: #0f172a;
  --text-color: #e2e8f0;
}
```

## 🐛 Troubleshooting

### Issue: API Connection Failed

**Solution:**

1. Verify backend server is running
2. Check `API_BASE_URL` in `js/api.js`
3. Check CORS settings in backend (should allow `http://localhost:3000`)
4. Check browser console for detailed error messages

### Issue: Login Not Working

**Solution:**

1. Ensure user is registered first
2. Check email and password are correct
3. Verify backend is responding
4. Check browser's `localStorage` is enabled

### Issue: Page Not Loading

**Solution:**

1. Clear browser cache and reload
2. Check browser console for JavaScript errors
3. Verify all JavaScript files are loaded
4. Try a different browser

### Issue: Styling Not Applied

**Solution:**

1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check CSS file is in correct directory

## 📝 Development Notes

### Adding New Pages

1. Create route in `router.setupRoutes()` in `js/router.js`
2. Create render method `renderPageName()`
3. Add HTML template in render method
4. Add event listeners for forms/buttons
5. Call `this.updateNavbar()` at end of render method

### Form Submission Example

```javascript
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    field1: form.field1.value,
    field2: form.field2.value,
  };

  try {
    const response = await api.someMethod(data);
    // Handle response
  } catch (error) {
    // Handle error
  }
});
```

### Using the Auth Manager

```javascript
// Check if user is logged in
if (auth.isAuthenticated()) {
  // Do something
}

// Get current user
const user = auth.getCurrentUser();
console.log(user.email, user.role);

// Check user role
if (auth.isStudent()) {
  // Student-specific code
}

// Logout
auth.logout();
```

## 🚀 Deployment

### Development

```bash
npm install -g http-server
http-server -p 3000
```

### Production

The frontend is static HTML/CSS/JavaScript, so it can be deployed to:

- **Netlify** - Drag and drop the folder
- **Vercel** - Connect GitHub repo
- **AWS S3** - Upload files to bucket
- **Azure Static Web Apps** - Connect GitHub
- **GitHub Pages** - Push to gh-pages branch

### Build & Optimize

For production, consider:

1. Minifying CSS and JavaScript
2. Using build tools like Webpack
3. Optimizing images
4. Implementing service workers for offline support
5. Loading scripts asynchronously

## 📚 Resources

- [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 🤝 Contributing

Feel free to:

- Report bugs
- Suggest improvements
- Create pull requests
- Improve documentation

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Check browser console for error messages
3. Review the API documentation
4. Contact the development team

## 📄 License

MIT License - Feel free to use for personal and commercial projects

---

**Happy Learning! 🚀**

Made with ❤️ by the Nexus Team
