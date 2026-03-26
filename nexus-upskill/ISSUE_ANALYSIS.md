# ISSUE FOUND: Student Count in Teacher Course View

## Problem Identified

The teacher view for courses should display the number of enrolled students for each course, but there's an issue in the code structure.

## Root Cause Analysis

### 1. **Issue in CourseService.createCourse() - Extra Fields**

**File:** `src/services/CourseService.ts` (Lines 17-36)

The `createCourse` method has extra fields that shouldn't be there:

```typescript
data: {
  title: string;
  description: string;
  duration: number;
  price: number;
  company: string;          // ❌ NOT in validator
  role: string;             // ❌ NOT in validator
  highlights: string[];
  isTrending?: boolean;
  status?: "draft" | "published";
}
```

These fields (`company`, `role`) are not in the `CreateCourseSchema` validator and will cause validation to fail.

### 2. **Solution - Implementation is Correct**

The good news: The `getTeacherCourses()` method **IS correctly implemented**:

- ✅ It calls `enrollmentRepository.countByCourseAndStatus()`
- ✅ The method exists in EnrollmentRepository
- ✅ It adds `enrolledCount` to each course
- ✅ Returns courses with enrollment counts

**File:** `src/services/CourseService.ts` (Lines 119-151)

```typescript
// Add enrollment counts to each course
const coursesWithCounts = await Promise.all(
  courses.map(async (course: any) => {
    const enrollmentCount =
      await this.enrollmentRepository.countByCourseAndStatus(
        course._id.toString(),
        "active",
      );
    return {
      ...(course.toObject ? course.toObject() : course),
      enrolledCount: enrollmentCount, // ✅ CORRECTLY ADDED
    };
  }),
);
```

## What's Working ✅

1. `EnrollmentRepository.countByCourseAndStatus()` - Method exists and is correct
2. `CourseService.getTeacherCourses()` - Correctly fetches courses with enrollment counts
3. `CourseController.getTeacherCourses()` - Returns the data with enrolledCount field

## What Needs Fixing ❌

1. **CreateCourseSchema validator vs CourseService.createCourse()**
   - Remove `company` and `role` from createCourse parameter type
   - Keep only: title, description, duration, price, highlights, isTrending, status

## Fix Required

**File:** `src/services/CourseService.ts` (Lines 17-36)

Change from:

```typescript
async createCourse(
  teacherId: string,
  data: {
    title: string;
    description: string;
    duration: number;
    price: number;
    company: string;    // ❌ REMOVE
    role: string;       // ❌ REMOVE
    highlights: string[];
    isTrending?: boolean;
    status?: "draft" | "published";
  },
): Promise<ICourse>
```

To:

```typescript
async createCourse(
  teacherId: string,
  data: {
    title: string;
    description: string;
    duration: number;
    price: number;
    highlights: string[];
    isTrending?: boolean;
    status?: "draft" | "published";
  },
): Promise<ICourse>
```

## Response Structure (Teacher View)

When calling `GET /api/courses/teacher/my-courses`:

```json
{
  "success": true,
  "message": "Teacher courses fetched successfully",
  "data": [
    {
      "_id": "...",
      "title": "Course Title",
      "description": "...",
      "duration": 40,
      "price": 1999,
      "teacherId": "...",
      "highlights": ["..."],
      "isTrending": false,
      "status": "published",
      "enrolledCount": 5, // ✅ STUDENT COUNT SHOWN HERE
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "pages": 1
  }
}
```

## Summary

The student count functionality is **correctly implemented**. The enrolled count is being retrieved and added to each course. The only issue is the mismatch between the `CreateCourseSchema` validator and the `createCourse()` parameter types.
