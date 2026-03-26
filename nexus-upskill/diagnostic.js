#!/usr/bin/env node

/**
 * 🔍 Nexus Upskill - Payment Workflow Diagnostic Tool
 *
 * This script helps identify issues in the enrollment & payment flow
 * Run with: node diagnostic.js
 */

const fs = require("fs");
const path = require("path");

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkFileContent(filePath, searchText) {
  if (!checkFileExists(filePath)) return false;
  const content = fs.readFileSync(filePath, "utf-8");
  return content.includes(searchText);
}

function runDiagnostics() {
  log("\n🔍 NEXUS UPSKILL - PAYMENT WORKFLOW DIAGNOSTICS\n", "cyan");

  const checks = {
    files: [],
    content: [],
    issues: [],
  };

  // ==================== FILE EXISTENCE CHECKS ====================
  log("📂 Checking Required Files...", "blue");

  const requiredFiles = [
    "src/models/Enrollment.ts",
    "src/models/Payment.ts",
    "src/services/AdminService.ts",
    "src/services/PaymentService.ts",
    "src/controllers/AdminController.ts",
    "src/controllers/PaymentController.ts",
    "src/routes/adminRoutes.ts",
    "src/routes/paymentRoutes.ts",
    "src/validators/enrollmentValidator.ts",
    "src/config/constants.ts",
  ];

  requiredFiles.forEach((file) => {
    const exists = checkFileExists(file);
    const status = exists ? "✅" : "❌";
    log(`  ${status} ${file}`, exists ? "green" : "red");
    checks.files.push({ file, exists });
  });

  // ==================== CONTENT CHECKS ====================
  log("\n📝 Checking Key Implementations...", "blue");

  const contentChecks = [
    {
      name: "Enrollment Model: pending_admin status",
      file: "src/models/Enrollment.ts",
      search: "pending_admin",
    },
    {
      name: "Payment Model: payment_requested status",
      file: "src/models/Payment.ts",
      search: "payment_requested",
    },
    {
      name: "AdminService exists",
      file: "src/services/AdminService.ts",
      search: "export default adminService",
    },
    {
      name: "AdminController instance exported",
      file: "src/controllers/AdminController.ts",
      search: "export default new AdminController",
    },
    {
      name: "Admin routes registered",
      file: "src/index.ts",
      search: "/api/admin",
    },
    {
      name: "Admin routes: arrow function wrapping",
      file: "src/routes/adminRoutes.ts",
      search: "(req, res) => adminController.",
    },
    {
      name: "Payment Service: getPaymentRequests method",
      file: "src/services/PaymentService.ts",
      search: "getPaymentRequests",
    },
    {
      name: "Enrollment Service: enrollStudent method",
      file: "src/services/EnrollmentService.ts",
      search: "pending_admin",
    },
  ];

  contentChecks.forEach(({ name, file, search }) => {
    const hasContent = checkFileContent(file, search);
    const status = hasContent ? "✅" : "❌";
    log(`  ${status} ${name}`, hasContent ? "green" : "red");
    checks.content.push({ name, file, search, hasContent });
  });

  // ==================== ISSUE DETECTION ====================
  log("\n⚠️  Issue Detection...", "blue");

  let hasIssues = false;

  // Check for route binding issues
  if (checkFileExists("src/routes/adminRoutes.ts")) {
    const content = fs.readFileSync("src/routes/adminRoutes.ts", "utf-8");
    const hasStaticCalls = content.includes("AdminController.get");
    if (hasStaticCalls) {
      log("  ❌ CRITICAL: Found static method calls in adminRoutes.ts", "red");
      log(
        "     → Should use arrow functions: (req, res) => adminController.method(req, res)",
        "yellow",
      );
      hasIssues = true;
      checks.issues.push({
        severity: "CRITICAL",
        message: "Static method calls in routes instead of arrow functions",
      });
    }
  }

  // Check MongoDB connection
  if (checkFileExists(".env")) {
    const envContent = fs.readFileSync(".env", "utf-8");
    if (
      !envContent.includes("MONGODB_URI") &&
      !envContent.includes("MONGO_URL")
    ) {
      log("  ⚠️  WARNING: MongoDB URI not found in .env", "yellow");
      checks.issues.push({
        severity: "WARNING",
        message: "MongoDB connection string not configured",
      });
    }
  }

  // Check for missing EnrollmentService update
  if (checkFileExists("src/services/EnrollmentService.ts")) {
    const content = fs.readFileSync(
      "src/services/EnrollmentService.ts",
      "utf-8",
    );
    if (
      content.includes('status: "pending"') &&
      !content.includes('status: "pending_admin"')
    ) {
      log(
        '  ❌ WARNING: EnrollmentService may still use "pending" instead of "pending_admin"',
        "yellow",
      );
      checks.issues.push({
        severity: "WARNING",
        message: 'EnrollmentService may use old "pending" status',
      });
    }
  }

  // ==================== SUMMARY ====================
  log("\n📊 DIAGNOSTIC SUMMARY", "cyan");

  const filesOk = checks.files.filter((f) => f.exists).length;
  const contentOk = checks.content.filter((c) => c.hasContent).length;

  log(
    `  Files: ${filesOk}/${checks.files.length} ✅`,
    filesOk === checks.files.length ? "green" : "yellow",
  );
  log(
    `  Content: ${contentOk}/${checks.content.length} ✅`,
    contentOk === checks.content.length ? "green" : "yellow",
  );
  log(
    `  Critical Issues: ${checks.issues.filter((i) => i.severity === "CRITICAL").length} ❌`,
    "red",
  );

  if (!hasIssues) {
    log(
      "\n✅ All critical checks passed! Your payment workflow is ready.",
      "green",
    );
    log("📌 Next steps:", "blue");
    log("   1. Run: npm run dev", "cyan");
    log("   2. Follow TESTING_GUIDE.md for full flow testing", "cyan");
    log(
      "   3. Register test accounts and verify enrollment → approval → payment flow",
      "cyan",
    );
  } else {
    log("\n⚠️  Some issues detected. Please review above.", "yellow");
  }

  // ==================== QUICK TEST COMMANDS ====================
  log("\n💡 QUICK REFERENCE COMMANDS\n", "blue");

  log("Register Student:", "cyan");
  log("POST http://localhost:5000/api/auth/register", "yellow");
  log(
    'Body: { "name": "John", "email": "student@test.com", "password": "Test@123", "role": "student" }',
    "reset",
  );

  log("\nEnroll in Course:", "cyan");
  log("POST http://localhost:5000/api/enrollments/", "yellow");
  log("Headers: Auth Bearer (student token)", "reset");
  log('Body: { "courseId": "course_id" }', "reset");

  log("\nCheck Pending Enrollments (Admin):", "cyan");
  log("GET http://localhost:5000/api/admin/enrollments/pending", "yellow");
  log("Headers: Auth Bearer (admin token)", "reset");

  log("\nApprove Enrollment (Admin):", "cyan");
  log(
    "POST http://localhost:5000/api/admin/enrollments/{enrollmentId}/approve",
    "yellow",
  );
  log("Headers: Auth Bearer (admin token)", "reset");

  log("\n🎯 If You Still See Issues:", "blue");
  log("   1. Check /TESTING_GUIDE.md for detailed step-by-step flow", "cyan");
  log("   2. Run: npx tsc --noEmit (to check TypeScript errors)", "cyan");
  log(
    '   3. Check MongoDB: Is the enrollment saved with "pending_admin" status?',
    "cyan",
  );
  log("   4. Check server logs: Does admin route handler get called?", "cyan");
  log(
    "   5. Debug adminRoutes.ts: Verify arrow function wrapping on all routes",
    "cyan",
  );

  log("\n", "reset");
}

runDiagnostics();
