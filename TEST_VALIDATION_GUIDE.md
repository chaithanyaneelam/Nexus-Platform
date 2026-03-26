# 🧪 Test & Validation Guide

## Quick Test Scenario - Complete User Journey

### Prerequisites

- Node.js dev server running
- MongoDB running
- Sample data with users (student, teacher, admin)

---

## 📋 Test Scenario 1: Student Approval & WhatsApp

### Setup

1. Create a **Teacher** account with:
   - Name: "John Doe"
   - Company: "Tech Academy"
   - Profession: "Software Engineer"
   - Mobile: "+917891234567"

2. Create a **Course** by teacher:
   - Title: "React Fundamentals"
   - Price: 5000
   - Duration: 3 months

3. Create a **Student** account with:
   - Name: "Alice Smith"
   - Email: "alice@example.com"
   - Mobile: "+919876543210"

### Step 1: Student Enrolls in Course

1. Login as **Student**
2. Go to Browse Courses
3. Find "React Fundamentals" course
4. Click "Enroll"
5. **Expected:** Enrollment created with status = "pending"

### Step 2: Check Student Dashboard

1. **Student** goes to "My Enrollments"
2. **Expected:**
   - Course card shows ⏳ "Pending Approval" badge
   - No green notification banner (not yet approved)
   - Teacher info shows (John Doe, Tech Academy, Software Engineer)
   - WhatsApp button visible

### Step 3: Admin Approves Enrollment

1. Login as **Admin**
2. Go to Student Approvals tab
3. Find Alice's pending enrollment
4. **Expected:**
   - Teacher information visible (blue box)
   - Shows: John Doe, Tech Academy, email, mobile
5. Click "✓ Approve Student"
6. **Expected:** Enrollment status changed to "active"

### Step 4: Student Sees Approval

1. **Student** refreshes browser or returns to My Enrollments
2. **Expected:**
   - ✅ Green notification banner appears: "Great! Your enrollment in React Fundamentals has been approved by the admin..."
   - Course card now shows ✅ "Approved" badge (green)
   - WhatsApp button still visible

### Step 5: Student Contacts Teacher via WhatsApp

1. **Student** clicks 💬 WhatsApp button on course card
2. **Expected:**
   - WhatsApp Web opens in new tab
   - Pre-filled message appears:

     ```
     Hey Sir/Ma'am, 👋

     I have registered your React Fundamentals course and I need your
     teaching and guidance to master it!

     Looking forward to learning from you. 🙏
     ```

   - Conversation starts with teacher (+917891234567)

**Test Result:** ✅ PASS / ❌ FAIL

---

## 📋 Test Scenario 2: Teacher Student Management

### Setup

- Continue with same teacher/student from Scenario 1
- Create 2 more students and approve them in course

### Step 1: Teacher Views Dashboard

1. Login as **Teacher**
2. Go to Teacher Dashboard
3. **Expected:**
   - Purple notification badge shows: "👥 Active Students: 3"
   - My Courses tab active
   - My Courses list showing "React Fundamentals" course

### Step 2: Switch to My Students Tab

1. Click "👥 My Students (3)" tab
2. **Expected:**
   - Tab changes to blue background (active)
   - Loading message appears then disappears
   - Student list shows all 3 students:
     - Alice Smith, alice@email, +919876543210
     - [Other 2 students similarly displayed]

### Step 3: Contact Student via Phone

1. Click 📞 "Call" button on Alice's card
2. **Expected:**
   - Device initiates phone call to +919876543210
   - If on desktop: tel: link appears

### Step 4: Contact Student via WhatsApp

1. Click 💬 "Chat" button on Alice's card
2. **Expected:**
   - WhatsApp Web opens in new tab
   - Conversation with Alice's number (+919876543210)
   - NO pre-filled message (teacher initiates naturally)

### Step 5: Switch Back to My Courses

1. Click 📚 "My Courses" tab
2. **Expected:**
   - Tab switches back to blue
   - Course cards appear again
   - Student count badge reappears

**Test Result:** ✅ PASS / ❌ FAIL

---

## 📋 Test Scenario 3: Admin Oversight

### Setup

- Multiple teachers with multiple courses and students
- Mix of pending and approved enrollments

### Step 1: Admin View Pending Approvals

1. Login as **Admin**
2. Go to "👥 Student Approvals" tab
3. **Expected:**
   - List of pending enrollments
   - For each enrollment:
     - Course name
     - ⏳ Pending Approval badge
     - **Teacher Info Section (Blue box):**
       - Teacher name
       - Email
       - Mobile
       - Company
     - **Student Info Section:**
       - Student name
       - Email
       - Mobile
     - ✓ Approve and ✗ Reject buttons

### Step 2: View Teachers Management

1. Click "🏫 Teachers Management" tab
2. **Expected:**
   - Grid of teacher cards
   - Each teacher card shows:
     - Teacher name
     - Company • Profession
     - Email
     - Mobile
     - Courses: X
     - Active Students: Y
     - 📚 View Courses & Students button

### Step 3: Drill Down to Teacher Courses

1. Click "📚 View Courses & Students" on a teacher card
2. **Expected:**
   - Page title: "[Teacher Name]'s Courses & Students"
   - Grid of course cards
   - Each course shows:
     - Title
     - Published/Draft status
     - Price
     - Duration
     - Active Students (green badge with count)
     - 👥 View Enrolled Students button
   - ← Back to Teachers button

### Step 4: View Course Students

1. Click "👥 View Enrolled Students" on a course
2. **Expected:**
   - Page title: "Students in '[Course Name]'"
   - List of enrolled students:
     - 👤 Student name
     - 📧 Email
     - 📱 Mobile
     - 📅 Enrolled: [Date]
     - ⚡ Progress: X%
   - Grid layout or list layout
   - ← Back to Teachers button

### Step 5: Navigation Test

1. Click back button multiple times
2. **Expected:**
   - Teachers → Courses → Students
   - Back navigation works correctly
   - Returns to appropriate view each level

**Test Result:** ✅ PASS / ❌ FAIL

---

## ⚠️ Error Scenarios to Test

### Missing Phone Number

1. **Student** clicks WhatsApp on a course where teacher has no phone
2. **Expected:** Alert: "Teacher phone number not available. Please contact the admin."

### Invalid Phone Format

1. Manually call `openWhatsApp('abc', 'Course')` in console
2. **Expected:** Alert: "Invalid phone number format. Please contact the admin."

### No Students

1. **Teacher** with no enrolled students clicks "My Students"
2. **Expected:** Message: "No students enrolled yet"

### No Courses

1. **Admin** clicks on teacher with no courses
2. **Expected:** Message: "No courses found for this teacher!"

### API Failure

1. Stop backend server
2. Try to load enrollments
3. **Expected:** Error message in admin panel explaining issue

---

## 🎯 Feature Checklist for QA

### Student Dashboard

- [ ] Approval notification banner appears only for approved courses
- [ ] Notification banner has correct course name
- [ ] Teacher information displays correctly (name, company, role)
- [ ] Status badges show correct colors (yellow=pending, green=approved)
- [ ] WhatsApp button works and shows correct message
- [ ] View Course button navigates to course
- [ ] Progress bar displays if progress exists
- [ ] Responsive on mobile (single column)
- [ ] Responsive on tablet (2 columns)
- [ ] Responsive on desktop (3+ columns)

### Teacher Dashboard

- [ ] Student count badge shows correct count
- [ ] Tab switching works smoothly
- [ ] My Courses tab shows all teacher courses
- [ ] My Students tab shows all students with pagination
- [ ] Student contact info is visible (name, email, phone)
- [ ] Call button opens phone app/tel link
- [ ] WhatsApp button opens WhatsApp chat
- [ ] Empty state when no students
- [ ] Empty state when no courses
- [ ] Tab buttons highlight correctly

### Admin Dashboard - Student Approvals

- [ ] Teacher info section displays with blue background
- [ ] Teacher name, email, mobile, company all visible
- [ ] Student info displays correctly
- [ ] Approve button changes status to active
- [ ] Reject button deletes enrollment
- [ ] Notifications show for actions
- [ ] Multiple approvals refresh correctly
- [ ] Responsive layout
- [ ] Empty state when no pending

### Admin Dashboard - Teachers Management

- [ ] All teachers display in grid
- [ ] Teacher card shows name, company, profession
- [ ] Contact info visible (email, mobile)
- [ ] Course count accurate
- [ ] Active student count accurate
- [ ] Click to view courses works
- [ ] Grid responsive on mobile (1 col)
- [ ] Grid responsive on tablet (2 col)
- [ ] Grid responsive on desktop (3 col)

### Admin Dashboard - Teacher Courses

- [ ] Back button returns to teachers list
- [ ] All teacher courses display
- [ ] Course title and description visible
- [ ] Price and duration correct
- [ ] Active student count highlights in green
- [ ] Student count accurate
- [ ] Click to view students works
- [ ] Empty state if no courses
- [ ] Responsive layout

### Admin Dashboard - Course Students

- [ ] Back button returns to courses
- [ ] All active students display
- [ ] Student name with icon visible
- [ ] Email and mobile visible
- [ ] Enrollment date displays
- [ ] Progress percentage visible
- [ ] Empty state if no students
- [ ] Grid layout responsive

---

## 🔍 Data Validation Tests

### Teacher Information Population

1. Database: Verify course.teacherId is ObjectId
2. Database: Verify teacher object has name, company, profession, email, mobileNumber
3. API: Verify GET /enrollments/my-enrollments returns courseId.teacherId fully populated
4. API: Verify GET /enrollments/admin/pending returns courseId.teacherId fully populated
5. Frontend: Verify no "undefined" values in UI

### Phone Number Validation

- Valid: "+919876543210" ✅
- Valid: "9876543210" (cleaned to valid) ✅
- Invalid: "abc" ❌
- Invalid: "" (empty) ❌
- Invalid: "123" (too short) ❌

### Status Values

- Student enrollment: "pending" → "active" ✅
- Course: "draft" → "published" ✅
- Progress: 0-100 numeric ✅

---

## 📊 Performance Tests

### Load Time Tests

- [ ] Student enrollments load < 1 second (10 items)
- [ ] Teacher students load < 2 seconds (20 items)
- [ ] Admin teachers load < 2 seconds (10 teachers)
- [ ] Course students load < 1 second (per course)

### Browser Console

- [ ] No JavaScript errors
- [ ] No TypeScript compilation errors
- [ ] No network 404 errors
- [ ] No 401 unauthorized errors
- [ ] PropTypes warnings (if React): none critical

### Database Queries

- [ ] No N+1 query problems
- [ ] Indexes used for status and courseId queries
- [ ] Pagination works with large datasets

---

## ✅ Sign-Off

**Tested By:** ******\_\_\_\_******
**Date:** ******\_\_\_\_******
**Environment:** Dev / Staging / Production

**Test Results Summary:**

- Feature Completeness: \_\_\_/100%
- Bug Count: **\_**
- Critical Issues: **\_**
- Minor Issues: **\_**

**Ready for Production:** ☐ YES / ☐ NO

**Notes:**

---

---
