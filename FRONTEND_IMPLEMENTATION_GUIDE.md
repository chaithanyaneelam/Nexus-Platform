# Frontend Implementation Guide - Student & Teacher Dashboards

## 🎯 Complete Frontend Integration Instructions

This guide provides step-by-step instructions to integrate all the new features into your existing frontend dashboards.

---

## 📱 PART 1: Student Dashboard Enhancements

### Step 1: Add Approval Notification Banner

**Location:** `js/router.js` → `renderStudentDashboard()` function

**What to Add:** At the beginning of the dashboard, check for approved enrollments and show a notification.

```javascript
// Add this section to the top of renderStudentDashboard()
async renderStudentDashboard() {
  const user = auth.getCurrentUser();
  let html = '';

  // ===== ADD APPROVAL NOTIFICATION SECTION =====
  // Check for newly approved courses
  try {
    const enrollmentsResponse = await api.getMyEnrollments();
    const approvedEnrollments = enrollmentsResponse.data?.filter(
      e => e.status === "active"
    ) || [];

    if (approvedEnrollments.length > 0) {
      html += `
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
          <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
            ✅ Course Approval Notification
          </h3>
          <p style="margin: 0; font-size: 0.95rem;">
            Great! Your enrollment in ${approvedEnrollments[0]?.courseId?.title || 'a course'}
            has been approved by the admin. You can now access the course and learn from your teacher!
          </p>
        </div>
      `;
    }
  } catch (error) {
    console.log("Error checking approvals:", error);
  }

  // ... rest of dashboard code ...
}
```

### Step 2: Enhance Course Cards with Teacher Information

**Location:** Display course cards with teacher details

**What to Add:** When rendering each enrolled course, include:

- Teacher name
- Teacher company
- Teacher role
- WhatsApp contact button

```javascript
// In the function that renders enrolled courses, update each course card:

function renderEnrolledCourseCard(enrollment) {
  const course = enrollment.courseId || {};
  const teacher = course.teacherId || {};
  const status = enrollment.status;

  return `
    <div style="background: white; border: 2px solid #ddd; border-radius: 12px; 
                padding: 1.5rem; cursor: pointer; transition: all 0.3s;"
         onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.2)'"
         onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='none'"
         onclick="viewEnrollmentDetail('${enrollment._id}')">
      
      <!-- Course Title -->
      <h3 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.1rem;">
        ${course.title || "Unknown Course"}
      </h3>

      <!-- Status Badge -->
      <div style="margin-bottom: 1rem;">
        ${
          status === "pending"
            ? '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">⏳ Pending Approval</span>'
            : status === "active"
              ? '<span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">✅ Approved</span>'
              : '<span style="background: #dbeafe; color: #082f49; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">📚 Active</span>'
        }
      </div>

      <!-- Teacher Information Box -->
      <div style="background: #f0f4ff; border-left: 4px solid #667eea; padding: 1rem; 
                  border-radius: 8px; margin-bottom: 1rem;">
        <h4 style="margin: 0 0 0.5rem 0; color: #667eea; font-size: 0.9rem;">
          👨‍🏫 Teacher Information
        </h4>
        <p style="margin: 0.25rem 0; color: #333; font-weight: 600;">
          ${teacher.name || "Unknown Teacher"}
        </p>
        <p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">
          🏢 ${teacher.company || "N/A"}
        </p>
        <p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">
          💼 ${teacher.profession || teacher.role || "Instructor"}
        </p>
      </div>

      <!-- Course Details Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <span style="color: #999; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">
            💵 Price
          </span>
          <p style="margin: 0.25rem 0 0 0; color: #333; font-size: 1.1rem; font-weight: bold;">
            ₹${course.price || 0}
          </p>
        </div>
        <div>
          <span style="color: #999; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">
            ⏱️ Duration
          </span>
          <p style="margin: 0.25rem 0 0 0; color: #333; font-size: 1.1rem; font-weight: bold;">
            ${course.duration || 0} months
          </p>
        </div>
      </div>

      <!-- Progress Bar (if in progress) -->
      ${
        enrollment.progress
          ? `
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.9rem; color: #666;">Progress</span>
            <span style="font-weight: 600; color: #667eea;">${enrollment.progress}%</span>
          </div>
          <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="width: ${enrollment.progress}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px;"></div>
          </div>
        </div>
      `
          : ""
      }

      <!-- Action Buttons -->
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
        <button onclick="openWhatsApp('${teacher.mobileNumber}', '${course.title}')"
                style="flex: 1; padding: 0.75rem; background: #25d366; color: white; 
                        border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                        transition: background 0.3s;"
                onmouseover="this.style.background='#20ba5a'"
                onmouseout="this.style.background='#25d366'">
          💬 WhatsApp Teacher
        </button>
        <button onclick="viewEnrollmentDetail('${enrollment._id}')"
                style="flex: 1; padding: 0.75rem; background: #667eea; color: white; 
                        border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                        transition: background 0.3s;"
                onmouseover="this.style.background='#5568d3'"
                onmouseout="this.style.background='#667eea'">
          📖 View Course
        </button>
      </div>
    </div>
  `;
}
```

### Step 3: Add WhatsApp Integration Function

**Location:** `js/router.js` or `js/app.js`

```javascript
// Add this function globally in your router or app.js

function openWhatsApp(teacherPhone, courseName) {
  // Validate phone number
  if (!teacherPhone || teacherPhone === "N/A") {
    alert("Teacher phone number not available");
    return;
  }

  // Create WhatsApp message
  const message = `Hey Sir/Ma'am, 👋\n\nI have registered your ${courseName} course and I need your teaching and guidance to master it!\n\nLooking forward to learning from you. 🙏`;

  // Clean phone number (remove special characters except +)
  const cleanPhone = teacherPhone.replace(/[^\d+]/g, "");

  // Create WhatsApp URL
  const whatsappURL = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  // Open in new tab
  window.open(whatsappURL, "_blank");
}
```

---

## 👨‍🏫 PART 2: Teacher Dashboard Enhancements

### Step 1: Add Student Count Notification Badge

**Location:** `js/router.js` → `renderTeacherDashboard()` function

**What to Add:** Show notification badge with new student count

```javascript
async renderTeacherDashboard() {
  const user = auth.getCurrentUser();
  let html = '';

  // ===== ADD NOTIFICATION BADGE =====
  try {
    const response = await api.getTeacherStudents(1, 5);
    const studentCount = response.total || 0;

    if (studentCount > 0) {
      html += `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0; font-size: 1rem;">👥 Active Students</h3>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; opacity: 0.9;">
                You have ${studentCount} students enrolled in your courses
              </p>
            </div>
            <div style="font-size: 2.5rem; font-weight: bold; opacity: 0.8;">
              ${studentCount}
            </div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.log("Error fetching student count:", error);
  }

  // ... rest of teacher dashboard ...
}
```

### Step 2: Add "My Students" Tab

**Location:** Teacher Dashboard HTML structure

**What to Do:** Add a new tab button and content area:

```javascript
// In renderTeacherDashboard(), add tabs for:
// 1. My Courses (existing)
// 2. My Students (new)

// Add tab buttons:
html += `
  <div style="display: flex; gap: 1rem; margin-bottom: 2rem; background: white; 
              padding: 1rem; border-radius: 12px;">
    <button onclick="switchTeacherTab('courses')" id="tab-courses"
            style="padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; 
                   border-radius: 6px; cursor: pointer; font-weight: 600;">
      📚 My Courses
    </button>
    <button onclick="switchTeacherTab('students')" id="tab-students"
            style="padding: 0.75rem 1.5rem; background: transparent; color: #666; border: 2px solid #ddd; 
                   border-radius: 6px; cursor: pointer; font-weight: 600;">
      👥 My Students
    </button>
  </div>
`;

// Add content areas:
html += `
  <div id="content-courses">
    <!-- My Courses content -->
  </div>
  <div id="content-students" style="display: none;">
    <!-- My Students content -->
  </div>
`;
```

### Step 3: Implement "My Students" List

**Add this function to `js/router.js`:**

```javascript
async function loadTeacherStudents() {
  const container = document.getElementById("content-students");
  container.innerHTML =
    '<div style="text-align: center; padding: 2rem; color: #667eea;">Loading students...</div>';

  try {
    const response = await api.getTeacherStudents(1, 20);
    const students = response.data || [];

    if (students.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
          <p style="color: #999; font-size: 1.1rem; margin: 0;">No students enrolled yet!</p>
        </div>
      `;
      return;
    }

    let html =
      '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">';

    for (const studentData of students) {
      const student = studentData.name
        ? studentData
        : studentData.studentId || {};
      const enrollment = studentData.enrollment || {};
      const course = enrollment.courseId || {};

      html += `
        <div style="background: white; border: 2px solid #ddd; border-radius: 12px; padding: 1.5rem; 
                   transition: all 0.3s;" 
             onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.2)'"
             onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='none'">
          
          <h3 style="margin: 0 0 0.5rem 0; color: #333;">${student.name || "Unknown"}</h3>
          
          <div style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
            <p style="margin: 0.25rem 0;">📧 ${student.email || "N/A"}</p>
            <p style="margin: 0.25rem 0;">📱 ${student.mobileNumber || "N/A"}</p>
            <p style="margin: 0.25rem 0;">📚 ${course.title || "Unknown Course"}</p>
          </div>

          <div style="display: grid; gap: 0.5rem;">
            <button onclick="callStudent('${student.mobileNumber}')"
                    style="padding: 0.5rem; background: #3b82f6; color: white; border: none; 
                           border-radius: 6px; cursor: pointer; font-weight: 600;">
              📞 Call
            </button>
            <button onclick="openWhatsAppTeacher('${student.mobileNumber}')"
                    style="padding: 0.5rem; background: #25d366; color: white; border: none; 
                           border-radius: 6px; cursor: pointer; font-weight: 600;">
              💬 WhatsApp
            </button>
          </div>
        </div>
      `;
    }

    html += "</div>";
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `
      <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px;">
        Error loading students: ${error.message}
      </div>
    `;
  }
}

function switchTeacherTab(tabName) {
  // Hide all tabs
  document.getElementById("content-courses").style.display = "none";
  document.getElementById("content-students").style.display = "none";

  // Reset button styles
  document.getElementById("tab-courses").style.background = "transparent";
  document.getElementById("tab-courses").style.color = "#666";
  document.getElementById("tab-courses").style.border = "2px solid #ddd";

  document.getElementById("tab-students").style.background = "transparent";
  document.getElementById("tab-students").style.color = "#666";
  document.getElementById("tab-students").style.border = "2px solid #ddd";

  // Show selected tab
  if (tabName === "courses") {
    document.getElementById("content-courses").style.display = "block";
    document.getElementById("tab-courses").style.background = "#667eea";
    document.getElementById("tab-courses").style.color = "white";
    document.getElementById("tab-courses").style.border = "none";
  } else {
    document.getElementById("content-students").style.display = "block";
    document.getElementById("tab-students").style.background = "#667eea";
    document.getElementById("tab-students").style.color = "white";
    document.getElementById("tab-students").style.border = "none";
    loadTeacherStudents();
  }
}

function openWhatsAppTeacher(studentPhone) {
  if (!studentPhone || studentPhone === "N/A") {
    alert("Student phone number not available");
    return;
  }
  const cleanPhone = studentPhone.replace(/[^\d+]/g, "");
  const whatsappURL = `https://wa.me/${cleanPhone}`;
  window.open(whatsappURL, "_blank");
}

function callStudent(phone) {
  if (!phone || phone === "N/A") {
    alert("Phone number not available");
    return;
  }
  window.location.href = `tel:${phone}`;
}
```

---

## 🎨 CSS Additions

Add these styles to your CSS file or in-page style tags:

```css
/* WhatsApp Button Styles */
.whatsapp-button {
  background: #25d366;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.whatsapp-button:hover {
  background: #20ba5a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

/* Approval Notification Styles */
.approval-banner {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Teacher Info Box */
.teacher-info-box {
  background: #f0f4ff;
  border-left: 4px solid #667eea;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.teacher-info-box h4 {
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-size: 0.9rem;
}

/* Course Card Enhancement */
.course-card {
  background: white;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.course-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.course-card.pending {
  border-color: #fbbf24;
  background: #fffbeb;
}

.course-card.approved {
  border-color: #10b981;
  background: #f0fdf4;
}
```

---

## ✅ Implementation Checklist

### Frontend Updates ToDo:

- [ ] Add approval notification banner to student dashboard
- [ ] Add teacher info section to course cards
- [ ] Implement WhatsApp button and openWhatsApp() function
- [ ] Add "My Students" tab to teacher dashboard
- [ ] Load and display teacher's students list
- [ ] Add student detail cards with contact options
- [ ] Implement switchTeacherTab() function
- [ ] Add student count badge to teacher dashboard header
- [ ] Update CSS for new components
- [ ] Test all WhatsApp integrations
- [ ] Test approval notifications
- [ ] Test teacher students list loading

### Testing Checklist:

- [ ] Student sees approval notification after admin approval
- [ ] Course cards show teacher name, company, role
- [ ] WhatsApp button opens chat with pre-filled message
- [ ] Teacher sees student count on dashboard
- [ ] Teacher can view list of enrolled students
- [ ] Teacher can call/WhatsApp students
- [ ] All responsive on mobile
- [ ] No console errors

---

## 📝 Notes

1. **Phone Format:** Make sure phone numbers are in the format `+91XXXXXXXXXX` for WhatsApp to work properly globally.

2. **Message Template:** The pre-filled WhatsApp message is:

   ```
   "Hey Sir/Ma'am, 👋\n\nI have registered your [COURSE] course and I need your teaching and guidance to master it!\n\nLooking forward to learning from you. 🙏"
   ```

   You can customize this in the `openWhatsApp()` function.

3. **API Endpoints Used:**
   - `api.getMyEnrollments()` - Get student's courses
   - `api.getTeacherStudents()` - Get teacher's students
   - `api.getAllTeachersWithCourses()` - Admin view

4. **Authorization:** All teacher endpoints require teacher role, student endpoints require student role.

---

**Status:** Ready for implementation
**Estimated Time:** 2-3 hours for full integration
**Difficulty:** Medium
