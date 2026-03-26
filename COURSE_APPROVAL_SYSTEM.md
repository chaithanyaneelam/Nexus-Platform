# Course Approval & Payment Management System

## Overview

This document explains the new course approval workflow and payment management system implemented for the Nexus Platform.

## Course Approval Workflow

### 1. **Teacher Creates Course**

- Teachers create courses with status `draft` (by default)
- Course includes: title, description, duration (in months), price, company, role, and highlights (5-10 specifications)
- Draft courses are NOT visible to students

### 2. **Teacher Visibility**

- In "My Courses" page, teachers can see their courses with status:
  - ✅ "Published" - Course is live and students can enroll
  - ⏳ "Draft - Pending Approval" - Waiting for admin approval

### 3. **Student Visibility**

- Students can ONLY see published courses in the courses list
- Draft courses are hidden until admin approves them
- This ensures quality control and prevents incomplete courses from being shown

### 4. **Admin Approval Process**

- Admin dashboard shows 2 new options:
  - 📚 **Approve Courses** - Review pending teacher courses
  - 💰 **Payment Management** - Monitor student-teacher transactions

### 5. **Admin Course Approval Page**

Path: `#admin-approve-courses`

Features:

- View all pending (draft) courses from teachers
- Each course card shows:
  - Course title and status (Draft - Pending Approval)
  - Full course details (description, duration, price, company, role)
  - List of highlights/specifications
  - Two action buttons:
    - ✓ **Approve** - Changes status to "published" (visible to students)
    - ✗ **Reject** - Deletes the course permanently

### 6. **Backend Course Service**

Updated methods:

- `getAllCourses()` - Returns only PUBLISHED courses for students
- `getTeacherCourses()` - Returns ALL courses (draft + published) for teachers
- `getPendingCourses()` - Returns DRAFT courses for admin review (Admin only)
- `approveCourse()` - Changes draft course to published (Admin only)
- `rejectCourse()` - Deletes draft course (Admin only)

## Database Schema Status

Course Model includes:

```typescript
status: "draft" | "published" (default: "draft")
isTrending: boolean (for featured courses)
highlights: string[] (min 5-500 chars each, max 10 items)
duration: number (in months, not hours anymore)
```

## API Endpoints

### New Admin Endpoints

```
GET  /courses/admin/pending - Get all pending courses
PATCH /courses/:courseId/approve - Approve a course
PATCH /courses/:courseId/reject - Reject a course
```

### Existing Endpoints (Updated)

```
GET /courses - Returns only published courses (for students)
GET /courses/teacher/my-courses - Returns all teacher's courses (for teachers)
```

## Frontend Routes

### New Routes

- `#admin-approve-courses` - Course approval management page
- `#admin-payments` - Payment management page (admin as mediator)

### Updated Routes

- `#admin-dashboard` - Now shows course approval and payment management cards
- `#my-courses` - Shows status (Draft/Published) for each course
- `#courses` - Shows only published courses

## Payment Management (Admin as Mediator)

The admin acts as a mediator between students and teachers:

### Admin Payments Page Features

- **Pending Payments Count** - Shows how many payments are waiting
- **Completed Payments Count** - Shows successful transactions
- **Total Revenue** - Shows total amount managed
- **Payments Table** - Lists all transactions with:
  - Student name
  - Course name
  - Amount (₹)
  - Status (Pending/Completed)
  - Date
  - Action (Release to Teacher)

### How It Works

1. Student pays for course → Money goes to admin account (escrow)
2. Admin reviews course quality and student completion
3. Admin releases payment to teacher after verifying student engagement
4. This protects both parties and ensures course quality

## Highlights/Specifications

Teachers can add up to 10 highlights per course, each with:

- Minimum: 5 characters
- Maximum: 500 characters per highlight
- Examples:
  - "Learn advanced JavaScript programming concepts"
  - "Hands-on project-based learning with real industry scenarios"
  - "Certification upon course completion"

## Status Badges

### Course Status Display

```css
Draft - Pending Approval (gray)
Published (green)
```

## User Access Control

### Student

- Can view: Published courses only
- Can enroll: In published courses
- Cannot see: Draft courses or admin pages

### Teacher

- Can create: Courses (status = draft)
- Can view: All their courses (draft + published)
- Can edit: Their own courses
- Can see: Status of each course
- Cannot approve: Their own courses

### Admin

- Can view: All pending (draft) courses
- Can approve: Courses (draft → published)
- Can reject: Courses (delete permanently)
- Can manage: All payments and transactions
- Acts as: Mediator between students and teachers

## Testing the System

1. **Test Teacher Course Creation**
   - Login as teacher
   - Create a course with all required fields
   - Should appear in "My Courses" with "Draft - Pending Approval" status
   - Should NOT appear in student's course list

2. **Test Admin Approval**
   - Login as admin
   - Go to "#admin-approve-courses"
   - See the pending course from the teacher
   - Click Approve button
   - Course status should change to Published
   - Teacher should see "Published" in My Courses
   - Course should now appear in student's course list

3. **Test Admin Rejection**
   - Create another draft course as teacher
   - Login as admin
   - Go to "#admin-approve-courses"
   - Click Reject button (with confirmation)
   - Course should be deleted
   - Teacher should no longer see it in My Courses

4. **Test Payment Management**
   - Go to "#admin-payments"
   - View payment statistics and transaction list
   - This page is ready for integration with payment service

## Future Enhancements

1. Implement actual payment gateway integration
2. Add email notifications to teachers about course approval/rejection
3. Add detailed analytics for admin (course popularity, revenue by teacher)
4. Implement disbursement scheduling for teachers
5. Add course revision requests before final rejection
6. Implement payment dispute resolution system

## Files Modified

Backend:

- `src/services/CourseService.ts` - Added admin methods
- `src/controllers/CourseController.ts` - Added admin endpoints
- `src/routes/courseRoutes.ts` - Added admin routes

Frontend:

- `js/api.js` - Added new API methods
- `js/router.js` - Added admin pages and updated course display
- `css/style.css` - Added styling for admin pages

## Important Notes

⚠️ **Course Duration Changed**

- Duration changed from **hours** to **months**
- This better represents how long a course continues, not just instruction time
- Validation: 1-60 months (can be updated in validators)

⚠️ **Draft Courses**

- Draft courses are completely hidden from students
- Teachers can still edit draft courses before submission
- Admin can approve or reject without further notification requirements

⚠️ **Admin as Mediator**

- All payments flow through admin account
- Admin ensures course quality before releasing funds to teachers
- This builds trust in the platform

---

Last Updated: March 21, 2026
