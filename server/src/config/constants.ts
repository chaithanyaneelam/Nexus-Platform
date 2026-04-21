export const APP_CONFIG = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  ADMIN_UPI_ID: process.env.ADMIN_UPI_ID,
  PAYMENT_COMMISSION_PERCENTAGE: parseFloat(
    process.env.PAYMENT_COMMISSION_PERCENTAGE || "20",
  ),
};

export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  CLIENT: "client",
};

export const PAYMENT_STATUS = {
  PAYMENT_REQUESTED: "payment_requested",
  TRANSACTION_SUBMITTED: "transaction_submitted",
  APPROVED: "approved",
  PAID_TO_TEACHER: "paid_to_teacher",
  REJECTED: "rejected",
};

export const ENROLLMENT_STATUS = {
  AWAITING_ADMIN_APPROVAL: "awaiting_admin_approval",
  PAYMENT_REQUESTED: "payment_requested",
  PAYMENT_SUBMITTED: "payment_submitted",
  ACTIVE: "active",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

export const COURSE_STATUS = {
  PENDING_ADMIN_APPROVAL: "pending_admin_approval",
  PUBLISHED: "published",
  REJECTED: "rejected",
};
