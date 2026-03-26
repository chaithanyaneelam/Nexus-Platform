# Quick Start Guide - Nexus Frontend

## 🚀 Get Started in 5 Minutes

### 1. Start Backend (if not already running)

```bash
cd nexus-upskill
npm run dev
```

Expected: `🚀 Nexus Upskill API is running!`

### 2. Start Frontend

Navigate to `nexus-frontend` folder and run:

**Using Python:**

```bash
python -m http.server 3000
```

**Using npm:**

```bash
npx http-server -p 3000
```

### 3. Open in Browser

```
http://localhost:3000
```

---

## 🔒 Test Login

### Try These Test Accounts:

**Student:**

- Email: `student@example.com`
- Password: `password123`

**Teacher:**

- Email: `teacher@example.com`
- Password: `password123`

**Admin:**

- Email: `admin@example.com`
- Password: `password123`

---

## 📱 What You Can Do

### As a Student 👨‍🎓

- Browse all courses
- Enroll in courses
- Track your learning progress
- View payment history
- Update your profile

### As a Teacher 👨‍🏫

- Create new courses
- Manage your courses
- Track student enrollments
- Monitor student progress
- Manage profile

### As an Admin 🛡️

- View all courses
- Monitor all users
- View platform analytics
- Configure settings

---

## ⚙️ Configuration

If backend runs on different port, edit `js/api.js`:

```javascript
// Line 3 - Change 5000 to your backend port
const API_BASE_URL = "http://localhost:5000/api";
```

---

## 🆘 Issues?

### API Connection Error

- ✅ Backend running? Check: `npm run dev` in backend folder
- ✅ Correct port in `js/api.js`?
- ✅ CORS enabled in backend?

### Login Not Working

- ✅ Correct email/password?
- ✅ User registered?
- ✅ Backend running?

### Page Won't Load

- ✅ Refresh browser: `Ctrl+Shift+R`
- ✅ Check browser console: `F12`
- ✅ Try different browser

---

## 📂 File Structure

```
nexus-frontend/
├── index.html           # Main page
├── js/
│   ├── api.js          # API connection (configure backend URL here)
│   ├── auth.js         # Login/Register
│   ├── router.js       # Page routing
│   └── app.js          # App initialization
├── css/
│   ├── style.css       # Main styles
│   └── responsive.css  # Mobile styles
└── README.md           # Detailed documentation
```

---

## 🎨 Pages Available

| Page           | Route                | Type      |
| -------------- | -------------------- | --------- |
| Home           | `#home`              | Public    |
| Login          | `#login`             | Public    |
| Register       | `#register`          | Public    |
| Courses        | `#courses`           | Public    |
| Dashboard      | `#student-dashboard` | Protected |
| My Enrollments | `#my-enrollments`    | Protected |
| Create Course  | `#create-course`     | Teachers  |
| My Courses     | `#my-courses`        | Teachers  |
| Admin Panel    | `#admin-dashboard`   | Admins    |
| Profile        | `#profile`           | Protected |

---

## 💡 Tips

1. **Clear Cache**: If styles look weird, press `Ctrl+Shift+R`
2. **Check Console**: Press `F12` to see detailed errors
3. **Check Network**: In DevTools, see actual API requests
4. **Test Responsive**: Press `F12` → Click device icon → Select mobile

---

## 🔐 Authentication Flow

1. Register/Login → Backend checks credentials
2. Backend returns JWT token
3. Token stored in browser
4. Token sent with every request
5. Logout clears token

---

Need help? See `README.md` for detailed documentation!

**Happy Learning! 🎓**
