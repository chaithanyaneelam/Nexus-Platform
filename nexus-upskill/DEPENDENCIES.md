# 📦 DEPENDENCIES & INSTALLATION GUIDE

## 🎯 Complete Dependency List

### **Production Dependencies** (Required for production)

```json
{
  "express": "^4.18.2", // Web framework for API
  "mongoose": "^7.5.0", // MongoDB ODM
  "dotenv": "^16.3.1", // Environment variables
  "jsonwebtoken": "^9.1.0", // JWT authentication
  "bcryptjs": "^2.4.3", // Password hashing
  "cors": "^2.8.5", // Cross-origin headers
  "zod": "^3.22.4" // Request validation
}
```

### **Development Dependencies** (Only needed during development)

```json
{
  "typescript": "^5.2.2", // TypeScript compiler
  "ts-node": "^10.9.1", // Run TypeScript directly
  "@types/node": "^20.8.0", // TypeScript types for Node
  "@types/express": "^4.17.20", // TypeScript types for Express
  "@types/jsonwebtoken": "^9.0.5", // TypeScript types for JWT
  "@types/bcryptjs": "^2.4.4" // TypeScript types for bcryptjs
}
```

---

## 📥 INSTALLATION STEPS

### **Step 1: Install All Dependencies**

```bash
cd c:\Users\neela\Desktop\Nexus Platform\nexus-upskill
npm install
```

This will install all production and development dependencies from `package.json`.

**Expected output:**

```
added 225 packages in 45s
```

---

## 🔍 DEPENDENCY DETAILS

### **1. EXPRESS** (Web Framework)

```javascript
// What it does: Routes HTTP requests to handlers
// Used for: Creating API endpoints

import express from "express";
const app = express();

app.get("/api/courses", (req, res) => {
  res.json({ courses: [] });
});
```

---

### **2. MONGOOSE** (MongoDB ODM)

```javascript
// What it does: Connects to MongoDB and manages data
// Used for: Database operations

import mongoose from "mongoose";
await mongoose.connect("mongodb+srv://...");

const courseSchema = new Schema({ title: String });
```

---

### **3. JSONWEBTOKEN** (JWT Authentication)

```javascript
// What it does: Creates and verifies authentication tokens
// Used for: User authentication

import jwt from "jsonwebtoken";

// Generate token
const token = jwt.sign({ userId: "123", role: "student" }, "secret-key", {
  expiresIn: "7d",
});

// Verify token
jwt.verify(token, "secret-key");
```

---

### **4. BCRYPTJS** (Password Hashing)

```javascript
// What it does: Hashes passwords securely
// Used for: User registration/login

import bcrypt from "bcryptjs";

// Hash password
const hashedPassword = await bcrypt.hash("password123", 10);

// Compare password
const isMatch = await bcrypt.compare("password123", hashedPassword);
```

---

### **5. ZOD** (Request Validation)

```javascript
// What it does: Validates request data structure
// Used for: API input validation

import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "teacher", "student"]),
});

// Validate
const data = RegisterSchema.parse(req.body);
```

---

### **6. CORS** (Cross-Origin Requests)

```javascript
// What it does: Allows requests from different domains
// Used for: Frontend-Backend communication

import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

---

### **7. DOTENV** (Environment Variables)

```javascript
// What it does: Loads environment variables from .env file
// Used for: Configuration management

import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
```

---

### **8. TYPESCRIPT** (Type Safety)

```javascript
// What it does: Adds type checking to JavaScript
// Used for: Development - prevents type errors

// Example: Function must receive string
function getUserName(id: string): string {
  return 'John';
}
```

---

### **9. TS-NODE** (Run TypeScript)

```bash
// What it does: Runs TypeScript files directly
// Used for: Development - npm run dev

npm run dev
// Runs src/index.ts with ts-node
```

---

### **10. @TYPES/\* (TypeScript Type Definitions)**

```javascript
// What they do: Provide TypeScript definitions for libraries
// Used for: IDE autocomplete and type checking

import express from 'express'; // TS knows about express types
const req: express.Request;    // Autocomplete works!
```

---

## 🚀 QUICK INSTALL COMMAND

```bash
# Install everything at once
npm install

# That's it! All dependencies will be installed
```

---

## ✅ VERIFY INSTALLATION

```bash
# Check if npm installed correctly
npm -v

# Check if Node installed correctly
node -v

# Check installed packages
npm list

# Check specific package
npm list express

# Check for latest versions
npm outdated
```

---

## 🔧 PACKAGE.JSON STRUCTURE

Your `package.json` contains:

```json
{
  "name": "nexus-upskill",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "dev": "ts-node src/index.ts", // Run development
    "build": "tsc", // Build TypeScript
    "start": "node dist/index.js" // Run production
  },
  "dependencies": {
    // Production packages (go to dist/)
  },
  "devDependencies": {
    // Development packages (not in production)
  }
}
```

---

## 📚 COMMON COMMANDS

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Install a new package
npm install package-name

# Install dev package
npm install --save-dev package-name

# Update packages
npm update

# Check for outdated packages
npm outdated

# Remove node_modules (clean install)
rm -r node_modules
npm install
```

---

## 🔑 KEY POINTS

✅ **Install once**: `npm install`  
✅ **All packages in `node_modules/`** (don't commit this folder)  
✅ **`package.json`** lists what to install  
✅ **`package-lock.json`** locks specific versions

---

## ⚠️ IMPORTANT NOTES

### **DO NOT:**

- ❌ Commit `node_modules/` to git
- ❌ Share `.env` file (contains secrets)
- ❌ Modify `package-lock.json` manually
- ❌ Use `npm install` on different Node versions

### **DO:**

- ✅ Run `npm install` after cloning project
- ✅ Update `.env` with your credentials
- ✅ Check `package.json` before installing
- ✅ Use `npm run dev` for development
- ✅ Use `npm run build` before deployment

---

## 📊 DEPENDENCY GRAPH

```
nexus-upskill
├── express (REST API)
│   └── cors (Cross-origin)
├── mongoose (Database)
│   └── dotenv (Config)
├── jsonwebtoken (Auth)
├── bcryptjs (Password)
├── zod (Validation)
├── typescript (Type Safety)
└── ts-node (Dev Runtime)
```

---

## 🎯 WHAT EACH DEPENDENCY DOES IN YOUR PROJECT

| Dependency       | Purpose              | Example Usage                |
| ---------------- | -------------------- | ---------------------------- |
| **express**      | Create API endpoints | `app.get('/api/courses')`    |
| **mongoose**     | Query MongoDB        | `User.findById(id)`          |
| **jsonwebtoken** | Create JWT tokens    | `jwt.sign({ userId })`       |
| **bcryptjs**     | Hash passwords       | `bcrypt.hash(password)`      |
| **zod**          | Validate requests    | `RegisterSchema.parse(data)` |
| **cors**         | Allow cross-origin   | `app.use(cors())`            |
| **dotenv**       | Load .env variables  | `process.env.MONGODB_URI`    |
| **typescript**   | Type checking        | `function test(id: string)`  |
| **ts-node**      | Run TypeScript       | `npm run dev`                |

---

## 🆘 COMMON INSTALLATION ISSUES

### **Issue: npm command not found**

```bash
# Solution: Install Node.js from nodejs.org
node -v  # Should show version
npm -v   # Should show version
```

### **Issue: Permission denied**

```bash
# Solution: Use sudo (macOS/Linux)
sudo npm install

# Or change npm permissions
npm config set prefix ~/.npm-global
```

### **Issue: node_modules too large**

```bash
# Solution: Delete and reinstall with clean cache
rm -rf node_modules
npm cache clean --force
npm install
```

### **Issue: Package version conflicts**

```bash
# Solution: Use --legacy-peer-deps flag
npm install --legacy-peer-deps

# Or delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 AFTER INSTALLATION

Once you run `npm install`, you'll have:

```
node_modules/              (225+ packages)
├── express/
├── mongoose/
├── zod/
├── jsonwebtoken/
├── bcryptjs/
├── cors/
├── dotenv/
├── typescript/
├── ts-node/
└── ... (200+ dependencies)

package-lock.json          (locked versions)
```

---

## 🚀 NEXT: START THE SERVER

```bash
# 1. Update .env with your MongoDB connection
# Edit: c:\Users\neela\Desktop\Nexus Platform\nexus-upskill\.env
# Replace CLUSTER_NAME with your actual cluster

# 2. Start development server
npm run dev

# Expected output:
# ✅ MongoDB Connected: your-cluster.mongodb.net
# 📊 Database: nexus-upskill
# 🎓 Nexus Upskill Server started on http://localhost:5000
# ✅ Ready to accept requests!
```

---

## 📝 SUMMARY

**Total Packages to Install**: 16  
**Production Packages**: 7  
**Dev Packages**: 9  
**Installation Time**: ~2-3 minutes

**All dependencies are already listed in `package.json`** ✅

Just run:

```bash
npm install
```

And you're ready to go! 🚀

---

**Next Step**: Update your `.env` file with the correct MongoDB cluster name and start the server!
