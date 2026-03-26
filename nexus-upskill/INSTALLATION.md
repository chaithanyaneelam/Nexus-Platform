# 🚀 COMPLETE INSTALLATION & SETUP GUIDE

## ⚡ Quick Setup (5 Minutes)

### **Step 1: Update MongoDB Connection String** (IMPORTANT!)

Your `.env` file is located at:

```
c:\Users\neela\Desktop\Nexus Platform\nexus-upskill\.env
```

**Find your MongoDB Cluster Name:**

1. Go to: https://cloud.mongodb.com
2. Login with: neelamchaithanya6 / Chaithu@123
3. Click "Databases" → Look for your cluster name (e.g., "Cluster0", "MyCluster")
4. Copy the cluster name

**Update your .env file:**

Replace this line:

```env
MONGODB_URI=mongodb+srv://neelamchaithanya6:Chaithu@123@CLUSTER_NAME.mongodb.net/nexus-upskill?retryWrites=true&w=majority
```

With your actual cluster name. Example:

```env
MONGODB_URI=mongodb+srv://neelamchaithanya6:Chaithu@123@cluster0.mongodb.net/nexus-upskill?retryWrites=true&w=majority
```

---

## 📥 Step 2: Install Dependencies

Open PowerShell and run:

```powershell
cd c:\Users\neela\Desktop\Nexus Platform\nexus-upskill
npm install
```

**Expected output:**

```
added 225 packages in 45 seconds

npm notice
npm notice New patch version of npm available: 10.x.x → 10.x.x
npm notice to update run `npm install -g npm@latest`
```

---

## ✅ Step 3: Verify Installation

Check if everything installed correctly:

```bash
npm list express mongoose jsonwebtoken bcryptjs zod
```

Should show:

```
nexus-upskill@1.0.0 c:\Users\neela\Desktop\Nexus Platform\nexus-upskill
├── bcryptjs@2.4.3
├── cors@2.8.5
├── dotenv@16.3.1
├── express@4.18.2
├── jsonwebtoken@9.1.0
├── mongoose@7.5.0
└── zod@3.22.4
```

---

## 🎯 Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**

```
✅ MongoDB Connected: cluster0.mongodb.net
📊 Database: nexus-upskill
🎓 Nexus Upskill Server started on http://localhost:5000
📊 Environment: development
✅ Ready to accept requests!
```

**If you see this, your setup is complete! 🎉**

---

## 🧪 Step 5: Test the Server

Open a new PowerShell window and test the API:

```powershell
# Test health check
curl http://localhost:5000/api/health

# Or in PowerShell use:
Invoke-WebRequest http://localhost:5000/api/health -ContentType "application/json"
```

**Expected response:**

```json
{
  "status": "success",
  "message": "🚀 Nexus Upskill API is running!",
  "timestamp": "2024-03-21T10:30:00.000Z"
}
```

---

## 📊 PROJECT STRUCTURE AFTER SETUP

```
nexus-upskill/
├── src/
│   ├── config/
│   │   ├── database.ts          ✅ Implemented
│   │   └── constants.ts         ✅ Implemented
│   ├── models/
│   │   ├── User.ts              ✅ Implemented
│   │   ├── Course.ts            ✅ Implemented
│   │   ├── Enrollment.ts        ✅ Implemented
│   │   └── Payment.ts           ✅ Implemented
│   ├── repositories/
│   │   ├── UserRepository.ts    ✅ Implemented
│   │   ├── CourseRepository.ts  ✅ Implemented
│   │   ├── EnrollmentRepository.ts ✅ Implemented
│   │   └── PaymentRepository.ts ✅ Implemented
│   ├── middleware/
│   │   └── auth.ts              ✅ Implemented
│   ├── utils/
│   │   ├── errors.ts            ✅ Implemented
│   │   └── jwt.ts               ✅ Implemented
│   ├── validators/              📋 Ready for Phase 2
│   ├── services/                📋 Ready for Phase 3
│   ├── controllers/             📋 Ready for Phase 4
│   ├── routes/                  📋 Ready for Phase 4
│   └── index.ts                 ✅ Implemented
├── node_modules/                (225+ packages - auto created)
├── .env                         ✅ Created with your credentials
├── .env.example                 ✅ Template
├── package.json                 ✅ All dependencies configured
├── tsconfig.json                ✅ TypeScript config
└── Documentation/
    ├── README.md
    ├── SETUP.md
    ├── ARCHITECTURE.md
    ├── PHASES.md
    ├── QUICKSTART.md
    ├── PROJECT_TREE.md
    ├── DEPENDENCIES.md
    └── DATABASE_STRUCTURE.md
```

---

## 📈 DEPENDENCIES INSTALLED

### Production (7 packages)

```
✅ express@4.18.2           - Web framework
✅ mongoose@7.5.0           - MongoDB ODM
✅ dotenv@16.3.1            - Environment variables
✅ jsonwebtoken@9.1.0       - JWT authentication
✅ bcryptjs@2.4.3           - Password hashing
✅ cors@2.8.5               - CORS handling
✅ zod@3.22.4               - Request validation
```

### Development (9 packages)

```
✅ typescript@5.2.2         - Type checking
✅ ts-node@10.9.1           - Run TypeScript directly
✅ @types/node@20.8.0       - Node.js types
✅ @types/express@4.17.20   - Express types
✅ @types/jsonwebtoken@9.0.5 - JWT types
✅ @types/bcryptjs@2.4.4    - bcryptjs types
```

---

## 🔍 VERIFY YOUR SETUP CHECKLIST

```
BEFORE STARTING:

Node.js & npm:
  [ ] npm -v              Shows version (v9 or higher)
  [ ] node -v             Shows version (v16 or higher)

Project Setup:
  [ ] .env file exists    (c:\Users\neela\Desktop\Nexus Platform\nexus-upskill\.env)
  [ ] MongoDB URI updated (with your cluster name)
  [ ] JWT_SECRET provided (already set)

Installation:
  [ ] npm install ran     (see package-lock.json)
  [ ] node_modules exists (225+ packages)
  [ ] All dependencies listed in package.json

MongoDB:
  [ ] MongoDB Atlas account created
  [ ] Cluster created
  [ ] User neelamchaithanya6 exists
  [ ] IP whitelist includes your computer
  [ ] Database nexus-upskill created (optional - auto-created)

Server:
  [ ] npm run dev works   (see ✅ messages)
  [ ] Health check works  (GET http://localhost:5000/api/health)
  [ ] No port conflict    (5000 is available)
```

---

## 🎯 WHAT EACH DEPENDENCY DOES

| Package          | What It Does         | In Your Project                                    |
| ---------------- | -------------------- | -------------------------------------------------- |
| **express**      | API framework        | Creates `/api/courses`, `/api/payments`, etc.      |
| **mongoose**     | MongoDB connection   | Connects to MongoDB Atlas & manages models         |
| **zod**          | Data validation      | Validates user registration, course creation, etc. |
| **jsonwebtoken** | Auth tokens          | Creates JWT for user authentication                |
| **bcryptjs**     | Password hashing     | Hashes passwords securely (never stored plain)     |
| **cors**         | Cross-origin headers | Allows frontend-backend communication              |
| **dotenv**       | Environment vars     | Loads .env file with secrets                       |
| **typescript**   | Type checking        | Prevents type errors during development            |
| **ts-node**      | TypeScript runner    | Runs TypeScript directly in dev mode               |

---

## 🚨 COMMON SETUP ISSUES & FIXES

### **Issue: npm command not found**

```
Error: 'npm' is not recognized as an internal or external command
```

**Fix:**

1. Download Node.js from https://nodejs.org
2. Install it (includes npm)
3. Restart PowerShell
4. Verify: `npm -v`

---

### **Issue: ECONNREFUSED when starting server**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Possible causes:**

- ❌ MongoDB URI in .env is incorrect
- ❌ CLUSTER_NAME not replaced with actual cluster
- ❌ MongoDB Atlas IP whitelist doesn't include your computer
- ❌ Database user credentials are wrong

**Fix:**

1. Open .env file
2. Check MongoDB URI format
3. Make sure to replace CLUSTER_NAME with actual cluster (e.g., cluster0)
4. Go to MongoDB Atlas → Cluster → Connect → Copy connection string
5. Paste in .env file

---

### **Issue: Port 5000 already in use**

```
Error: listen EADDRINUSE :::5000
```

**Fix:**

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID 12345 /F

# Or change PORT in .env
# PORT=5001
```

---

### **Issue: Node version conflict**

```
Error: Unexpected token (due to old Node version)
```

**Fix:**

```bash
# Check Node version
node -v

# Must be v16 or higher
# Update Node.js from nodejs.org
```

---

### **Issue: Dependencies won't install**

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Fix:**

```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or clean and reinstall
rm -r node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🔐 .ENV FILE CHECKLIST

Your `.env` file should have:

```env
✅ NODE_ENV=development
✅ PORT=5000
✅ MONGODB_URI=mongodb+srv://neelamchaithanya6:Chaithu@123@YOUR_CLUSTER.mongodb.net/nexus-upskill?retryWrites=true&w=majority
✅ JWT_SECRET=nexus_upskill_secret_key_@2024_secure_token_generation
✅ JWT_EXPIRY=7d
✅ ADMIN_UPI_ID=admin@okhdfcbank
✅ PAYMENT_COMMISSION_PERCENTAGE=20
```

---

## 📊 DATABASE COLLECTIONS CREATED

After first run, MongoDB will auto-create these collections:

```
nexus-upskill (database)
├── users              (not yet populated)
├── courses            (not yet populated)
├── enrollments        (not yet populated)
└── payments           (not yet populated)
```

We'll populate these with test data in the next phase!

---

## 🎮 AVAILABLE COMMANDS

```bash
# Development
npm run dev             # Start with auto-reload

# Production
npm run build           # Compile TypeScript → dist/
npm start               # Run compiled JavaScript

# Checking
npm list                # Show all installed packages
npm outdated            # Check for updates
npm update              # Update packages
npm audit               # Check for security issues

# Cleaning
npm cache clean --force # Clear cache
# Then delete and reinstall:
rm -r node_modules
npm install
```

---

## 📚 NEXT PHASE: START CODING

Once your server is running (✅ confirms success):

### **Phase 2: Validation Schemas**

We'll create Zod schemas for:

- User registration
- User login
- Course creation
- Enrollment requests
- Payment verification

### **Phase 3: Services**

Business logic layer with:

- AuthService
- CourseService
- EnrollmentService
- PaymentService

### **Phase 4: Controllers & Routes**

API endpoints for all features

### **Phase 5: Frontend Dashboards**

HTML/CSS/JS dashboards for Admin, Teacher, Student

---

## ⚙️ SERVER CONFIGURATION

Your server runs with these settings:

```typescript
Port:                  5000
Environment:           development
MongoDB:               MongoDB Atlas (Cloud)
Database Name:         nexus-upskill
Authentication:        JWT (7 day expiry)
Password Hashing:      bcrypt (10 rounds)
CORS:                  Enabled (http://localhost:3000)
```

---

## 📱 CONNECTING FRONTEND LATER

When we build the frontend:

```javascript
// Frontend will connect to:
const API_BASE = "http://localhost:5000/api";

// Example: Get all courses
fetch(`${API_BASE}/courses`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // JWT from login
  },
});
```

---

## ✅ SETUP COMPLETE VERIFICATION

After running `npm run dev`, you should see:

```
✅ MongoDB Connected: cluster0.mongodb.net
📊 Database: nexus-upskill
🎓 Nexus Upskill Server started on http://localhost:5000
📊 Environment: development
✅ Ready to accept requests!
```

**If you see this, everything is set up correctly!** 🎉

---

## 🎯 NOW YOU'RE READY TO:

1. ✅ **Understand MongoDB structure** → Read `DATABASE_STRUCTURE.md`
2. ✅ **Start Phase 2 coding** → Create validation schemas
3. ✅ **Learn dependencies** → Read `DEPENDENCIES.md`
4. ✅ **Follow the roadmap** → Read `PHASES.md`

---

## 📞 TROUBLESHOOTING HELP

If something doesn't work:

1. **Check .env file** - Is MongoDB URI correct?
2. **Check npm install** - Did it complete without errors?
3. **Check Node version** - Is it v16 or higher?
4. **Check port 5000** - Is something else using it?
5. **Check MongoDB Atlas** - Is cluster running and IP whitelisted?

---

**Congratulations! Your Nexus Upskill backend is now set up and ready!** 🚀

Next: Phase 2 - Validation Schemas Coming Soon!
