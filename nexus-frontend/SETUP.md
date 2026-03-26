# Frontend Setup Guide

## Prerequisites

Before setting up the frontend, ensure you have:

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- The backend server running and accessible
- Basic knowledge of web technologies

## Step-by-Step Setup

### Step 1: Verify Backend is Running

First, ensure your backend server is running:

```bash
# In the backend directory (nexus-upskill)
npm run dev
```

Expected output:

```
🚀 Nexus Upskill API is running!
Server started on port 5000
```

### Step 2: Configure API URL

Edit `js/api.js` and update the API base URL to match your backend:

```javascript
// Change this line to match your backend port
const API_BASE_URL = "http://localhost:5000/api"; // Use your backend port
```

**Common configurations:**

```javascript
// Local development
const API_BASE_URL = "http://localhost:5000/api";

// Different port
const API_BASE_URL = "http://localhost:8000/api";

// Remote server
const API_BASE_URL = "https://api.example.com/api";
```

### Step 3: Start Frontend Server

Navigate to the `nexus-frontend` directory and start a local server.

**Option A: Using Python (Recommended)**

```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

**Option B: Using Node.js**

```bash
# Install http-server globally
npm install -g http-server

# Start server on port 3000
http-server -p 3000
```

**Option C: Using npm (if installed)**

```bash
# In the nexus-frontend directory
npx http-server -p 3000
```

**Option D: VS Code Live Server**

1. Install "Live Server" VS Code extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Step 4: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

### Step 5: Test Authentication

1. Go to the **Register** page
2. Create a test account with:
   - Email: test@example.com
   - Password: password123
   - Role: Student (or Teacher)
3. Click **Register**
4. You should be redirected to your dashboard

## CORS Configuration (If Needed)

If you see CORS errors, your backend needs to allow the frontend origin.

In backend `src/index.ts`, update CORS settings:

```typescript
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  }),
);
```

## Configuration Files

### Frontend Configuration

All configuration is in the frontend files:

- **API URL**: `js/api.js` - Line 3
- **Theme Colors**: `css/style.css` - CSS variables (lines 7-15)
- **Routes**: `js/router.js` - Route definitions (lines 17-65)

### Environment Setup

Create a `.env`-like configuration in `js/api.js`:

```javascript
// Frontend Configuration
const CONFIG = {
  API_BASE_URL: "http://localhost:5000/api",
  JWT_TOKEN_KEY: "token",
  USER_DATA_KEY: "user",
  SESSION_TIMEOUT: 3600000, // 1 hour
};
```

## Testing the Frontend

### Test User Accounts

After backend is set up, test with these accounts:

**Student Account:**

- Email: student@example.com
- Password: password123

**Teacher Account:**

- Email: teacher@example.com
- Password: password123

**Admin Account:**

- Email: admin@example.com
- Password: password123

### Test Routes

| Role    | Dashboard            | Features                       |
| ------- | -------------------- | ------------------------------ |
| Student | `#student-dashboard` | Browse, Enroll, Track Progress |
| Teacher | `#teacher-dashboard` | Create, Manage Courses         |
| Admin   | `#admin-dashboard`   | Monitor Platform               |

## Browser DevTools Tips

### Check API Communication

1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Go to **Network** tab
3. Interact with frontend
4. You should see API requests like:
   - `POST /api/auth/login`
   - `GET /api/courses`
   - `POST /api/enrollments`

### Check Console for Errors

1. Open DevTools: `F12`
2. Go to **Console** tab
3. Look for error messages
4. Common errors:
   - `CORS error` - Backend CORS not configured
   - `404 Not Found` - Wrong API URL
   - `401 Unauthorized` - Invalid token

### Check LocalStorage

1. Open DevTools: `F12`
2. Go to **Application** tab
3. Check **LocalStorage** → `http://localhost:3000`
4. Should see:
   - `token` - JWT authentication token
   - `user` - User profile data (JSON)

## Troubleshooting

### Problem: Frontend shows "API Error"

**Solution:**

1. Check backend is running on correct port
2. Verify `API_BASE_URL` in `js/api.js`
3. Check backend CORS configuration
4. Look at browser console for detailed error

### Problem: Login fails

**Solution:**

1. Ensure user is registered in backend
2. Check email and password are correct
3. Verify backend database is connected
4. Check backend logs for errors

### Problem: Pages not loading

**Solution:**

1. Hard refresh: `Ctrl+Shift+R`
2. Clear cookies: DevTools → Application → Clear Site Data
3. Check browser console for JavaScript errors
4. Verify all files are in correct directories

### Problem: Styling looks broken

**Solution:**

1. Hard refresh: `Ctrl+Shift+R`
2. Check CSS files are linked correctly in HTML
3. Verify file paths are correct
4. Check browser supports CSS Grid and Flexbox

## Performance Optimization

### For Development

- Use browser cache to speed up loading
- Keep DevTools closed for better performance
- Use network throttling to test slow connections

### For Production

1. **Minify files:**

   ```bash
   # Using terser for JavaScript
   npm install -g terser
   terser js/app.js -o js/app.min.js
   ```

2. **Enable compression:**
   - Use Gzip compression on server
   - Update HTML to use minified files

3. **Optimize images:**
   - Compress course thumbnails
   - Use WebP format if supported

4. **Use CDN:**
   - Upload frontend to CloudFront/AzureCDN
   - Serve from edge locations

## Next Steps

After setup is complete:

1. ✅ Test all user roles (Student, Teacher, Admin)
2. ✅ Test course creation and enrollment
3. ✅ Test payment history
4. ✅ Test responsive design on mobile
5. ✅ Test form validation
6. ✅ Run through entire user journey

## Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review browser console errors
3. Check network tab in DevTools
4. Review backend logs
5. Check database connectivity
6. Consult backend documentation

## Quick Reference

```bash
# Start backend
cd nexus-upskill
npm run dev

# Start frontend (in another terminal)
cd nexus-frontend
python -m http.server 3000

# Access application
# http://localhost:3000

# Login with test account
# Email: test@example.com
# Password: password123
```

---

**Setup Complete! 🎉**

You're now ready to use the Nexus Platform. Happy learning!
