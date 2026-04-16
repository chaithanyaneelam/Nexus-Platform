#!/bin/bash

# 🧪 NEXUS UPSKILL - PAYMENT WORKFLOW QUICK TEST SCRIPT
# 
# This script automates the complete enrollment → approval → payment flow
# Usage: bash test-flow.sh
#
# Make sure the server is running: npm run dev

BASE_URL="http://localhost:5000/api"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 NEXUS UPSKILL - PAYMENT WORKFLOW TEST${NC}\n"

# ==================== STEP 1: REGISTER STUDENT ====================
echo -e "${BLUE}STEP 1: Register Student${NC}"
echo "POST $BASE_URL/auth/register"

STUDENT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "email": "student@'$(date +%s)'.com",
    "password": "Test@123",
    "mobileNumber": "9876543210",
    "role": "student",
    "interests": ["Web Development"]
  }')

echo "$STUDENT_RESPONSE" | jq '.'

STUDENT_TOKEN=$(echo "$STUDENT_RESPONSE" | jq -r '.data.token')
STUDENT_ID=$(echo "$STUDENT_RESPONSE" | jq -r '.data._id')

if [ "$STUDENT_TOKEN" = "null" ] || [ -z "$STUDENT_TOKEN" ]; then
  echo -e "${RED}❌ Failed to register student${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Student registered: $STUDENT_ID${NC}\n"

# ==================== STEP 2: REGISTER TEACHER ====================
echo -e "${BLUE}STEP 2: Register Teacher${NC}"
echo "POST $BASE_URL/auth/register"

TEACHER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Teacher",
    "email": "teacher@'$(date +%s)'.com",
    "password": "Test@123",
    "mobileNumber": "9123456789",
    "role": "teacher",
    "upiId": "jane@upi",
    "linkedinUrl": "https://linkedin.com/in/jane",
    "profession": "Software Engineer"
  }')

echo "$TEACHER_RESPONSE" | jq '.'

TEACHER_TOKEN=$(echo "$TEACHER_RESPONSE" | jq -r '.data.token')
TEACHER_ID=$(echo "$TEACHER_RESPONSE" | jq -r '.data._id')

if [ "$TEACHER_TOKEN" = "null" ] || [ -z "$TEACHER_TOKEN" ]; then
  echo -e "${RED}❌ Failed to register teacher${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Teacher registered: $TEACHER_ID${NC}\n"

# ==================== STEP 3: CREATE COURSE ====================
echo -e "${BLUE}STEP 3: Create Course (as Teacher)${NC}"
echo "POST $BASE_URL/courses/"

COURSE_RESPONSE=$(curl -s -X POST "$BASE_URL/courses/" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Advanced - Test Course",
    "description": "Learn advanced React patterns",
    "duration": 40,
    "price": 1999,
    "highlights": ["Hooks", "Context API"]
  }')

echo "$COURSE_RESPONSE" | jq '.'

COURSE_ID=$(echo "$COURSE_RESPONSE" | jq -r '.data._id')

if [ "$COURSE_ID" = "null" ] || [ -z "$COURSE_ID" ]; then
  echo -e "${RED}❌ Failed to create course${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Course created: $COURSE_ID${NC}\n"

# ==================== STEP 4: STUDENT ENROLLS ====================
echo -e "${BLUE}STEP 4: Student Enrolls in Course${NC}"
echo "POST $BASE_URL/enrollments/"

ENROLLMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/enrollments/" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"courseId\": \"$COURSE_ID\"}")

echo "$ENROLLMENT_RESPONSE" | jq '.'

ENROLLMENT_ID=$(echo "$ENROLLMENT_RESPONSE" | jq -r '.data._id')
ENROLLMENT_STATUS=$(echo "$ENROLLMENT_RESPONSE" | jq -r '.data.status')

if [ "$ENROLLMENT_ID" = "null" ] || [ -z "$ENROLLMENT_ID" ]; then
  echo -e "${RED}❌ Failed to enroll in course${NC}\n"
  exit 1
fi

if [ "$ENROLLMENT_STATUS" != "pending_admin" ]; then
  echo -e "${RED}❌ Enrollment status is $ENROLLMENT_STATUS, expected pending_admin${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Student enrolled, status: $ENROLLMENT_STATUS${NC}\n"

# ==================== STEP 5: REGISTER ADMIN ====================
echo -e "${BLUE}STEP 5: Register Admin${NC}"
echo "POST $BASE_URL/auth/register"

ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@'$(date +%s)'.com",
    "password": "Admin@123",
    "mobileNumber": "9000000000",
    "role": "admin"
  }')

echo "$ADMIN_RESPONSE" | jq '.'

ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | jq -r '.data.token')

if [ "$ADMIN_TOKEN" = "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}❌ Failed to register admin${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Admin registered${NC}\n"

# ==================== STEP 6: ADMIN VIEWS PENDING ====================
echo -e "${BLUE}STEP 6: Admin Views Pending Enrollments${NC}"
echo "GET $BASE_URL/admin/enrollments/pending"

PENDING_RESPONSE=$(curl -s -X GET "$BASE_URL/admin/enrollments/pending" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "$PENDING_RESPONSE" | jq '.'

PENDING_COUNT=$(echo "$PENDING_RESPONSE" | jq '.data | length')

if [ "$PENDING_COUNT" = "0" ]; then
  echo -e "${RED}❌ No pending enrollments found for admin${NC}\n"
  echo -e "${YELLOW}⚠️  This indicates the admin route may not be working properly${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Admin sees $PENDING_COUNT pending enrollment(s)${NC}\n"

# ==================== STEP 7: ADMIN APPROVES ENROLLMENT ====================
echo -e "${BLUE}STEP 7: Admin Approves Enrollment${NC}"
echo "POST $BASE_URL/admin/enrollments/$ENROLLMENT_ID/approve"

APPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/enrollments/$ENROLLMENT_ID/approve" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "$APPROVE_RESPONSE" | jq '.'

PAYMENT_ID=$(echo "$APPROVE_RESPONSE" | jq -r '.data.payment._id')
PAYMENT_STATUS=$(echo "$APPROVE_RESPONSE" | jq -r '.data.payment.status')

if [ "$PAYMENT_ID" = "null" ] || [ -z "$PAYMENT_ID" ]; then
  echo -e "${RED}❌ Failed to approve enrollment or create payment${NC}\n"
  exit 1
fi

if [ "$PAYMENT_STATUS" != "payment_requested" ]; then
  echo -e "${RED}❌ Payment status is $PAYMENT_STATUS, expected payment_requested${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Enrollment approved, payment created: $PAYMENT_ID${NC}\n"

# ==================== STEP 8: STUDENT SEES PAYMENT REQUEST ====================
echo -e "${BLUE}STEP 8: Student Views Payment Requests${NC}"
echo "GET $BASE_URL/payments/my-requests"

PAYMENT_REQUEST_RESPONSE=$(curl -s -X GET "$BASE_URL/payments/my-requests" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

echo "$PAYMENT_REQUEST_RESPONSE" | jq '.'

REQUEST_COUNT=$(echo "$PAYMENT_REQUEST_RESPONSE" | jq '.data | length')

if [ "$REQUEST_COUNT" = "0" ]; then
  echo -e "${RED}❌ Student sees no payment requests${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Student sees payment request${NC}\n"

# ==================== STEP 9: STUDENT SUBMITS TXN ====================
echo -e "${BLUE}STEP 9: Student Submits Transaction ID${NC}"
echo "POST $BASE_URL/payments/$PAYMENT_ID/submit-transaction"

SUBMIT_TXN_RESPONSE=$(curl -s -X POST "$BASE_URL/payments/$PAYMENT_ID/submit-transaction" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "UPI_TXN_TEST_'$(date +%s)'"}')

echo "$SUBMIT_TXN_RESPONSE" | jq '.'

TXN_STATUS=$(echo "$SUBMIT_TXN_RESPONSE" | jq -r '.data.status')

if [ "$TXN_STATUS" != "transaction_submitted" ]; then
  echo -e "${RED}❌ Payment status is $TXN_STATUS, expected transaction_submitted${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Transaction ID submitted, status: $TXN_STATUS${NC}\n"

# ==================== STEP 10: ADMIN APPROVES PAYMENT ====================
echo -e "${BLUE}STEP 10: Admin Approves Payment${NC}"
echo "POST $BASE_URL/admin/payments/$PAYMENT_ID/approve"

APPROVE_PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/payments/$PAYMENT_ID/approve" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}')

echo "$APPROVE_PAYMENT_RESPONSE" | jq '.'

FINAL_PAYMENT_STATUS=$(echo "$APPROVE_PAYMENT_RESPONSE" | jq -r '.data.payment.status')
ENROLLMENT_FINAL_STATUS=$(echo "$APPROVE_PAYMENT_RESPONSE" | jq -r '.data.enrollment.status')

if [ "$FINAL_PAYMENT_STATUS" != "approved" ]; then
  echo -e "${RED}❌ Payment status is $FINAL_PAYMENT_STATUS, expected approved${NC}\n"
  exit 1
fi

if [ "$ENROLLMENT_FINAL_STATUS" != "active" ]; then
  echo -e "${RED}❌ Enrollment status is $ENROLLMENT_FINAL_STATUS, expected active${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Payment approved, enrollment activated${NC}\n"

# ==================== STEP 11: STUDENT CHECKS COURSES ====================
echo -e "${BLUE}STEP 11: Student Views Enrolled Courses${NC}"
echo "GET $BASE_URL/enrollments/my-enrollments"

MY_COURSES_RESPONSE=$(curl -s -X GET "$BASE_URL/enrollments/my-enrollments" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

echo "$MY_COURSES_RESPONSE" | jq '.'

COURSE_COUNT=$(echo "$MY_COURSES_RESPONSE" | jq '.data | length')

if [ "$COURSE_COUNT" = "0" ]; then
  echo -e "${RED}❌ Student sees no enrolled courses${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Student sees active course enrollment${NC}\n"

# ==================== SUCCESS ====================
echo -e "${GREEN}✅ ✅ ✅ COMPLETE PAYMENT WORKFLOW TEST PASSED! ✅ ✅ ✅${NC}\n"
echo -e "${BLUE}Summary:${NC}"
echo -e "  ${GREEN}✅${NC} Student enrolled → enrollment created (pending_admin)"
echo -e "  ${GREEN}✅${NC} Admin approved → payment created (payment_requested)"
echo -e "  ${GREEN}✅${NC} Student submitted TXN → payment updated (transaction_submitted)"
echo -e "  ${GREEN}✅${NC} Admin approved payment → enrollment activated (active)"
echo -e "  ${GREEN}✅${NC} Student can see course"
echo -e "\n${BLUE}All 6 stages of the payment workflow are working! 🚀${NC}\n"
