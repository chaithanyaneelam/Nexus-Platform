/**
 * Client-side Router
 * Handles navigation between different pages/views
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.setupRoutes();
    this.setupEventListeners();
  }

  /**
   * Define all routes
   */
  setupRoutes() {
    // Public routes
    this.routes["home"] = {
      path: "#home",
      requiresAuth: false,
      render: () => this.renderHome(),
    };

    this.routes["login"] = {
      path: "#login",
      requiresAuth: false,
      render: () => this.renderLogin(),
    };

    this.routes["register"] = {
      path: "#register",
      requiresAuth: false,
      render: () => this.renderRegister(),
    };

    this.routes["courses"] = {
      path: "#courses",
      requiresAuth: false,
      render: () => this.renderCourses(),
    };

    this.routes["course-detail"] = {
      path: "#course-detail",
      requiresAuth: false,
      render: (courseId) => this.renderCourseDetail(courseId),
    };

    // Protected routes
    this.routes["profile"] = {
      path: "#profile",
      requiresAuth: true,
      render: () => this.renderProfile(),
    };

    this.routes["student-dashboard"] = {
      path: "#student-dashboard",
      requiresAuth: true,
      role: "student",
      render: () => this.renderStudentDashboard(),
    };

    this.routes["teacher-dashboard"] = {
      path: "#teacher-dashboard",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderTeacherDashboard(),
    };

    this.routes["admin-dashboard"] = {
      path: "#admin-dashboard",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminDashboard(),
    };

    this.routes["admin-approve-courses"] = {
      path: "#admin-approve-courses",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminApproveCourses(),
    };

    this.routes["admin-payments"] = {
      path: "#admin-payments",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminPayments(),
    };

    this.routes["my-courses"] = {
      path: "#my-courses",
      requiresAuth: true,
      render: () => this.renderMyCourses(),
    };

    this.routes["create-course"] = {
      path: "#create-course",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderCreateCourse(),
    };

    this.routes["my-enrollments"] = {
      path: "#my-enrollments",
      requiresAuth: true,
      role: "student",
      render: () => this.renderMyEnrollments(),
    };

    this.routes["payment"] = {
      path: "#payment",
      requiresAuth: true,
      role: "student",
      render: () => this.renderPayment(),
    };

    this.routes["your-courses"] = {
      path: "#your-courses",
      requiresAuth: true,
      role: "student",
      render: () => this.renderYourCourses(),
    };

    this.routes["teacher-students"] = {
      path: "#teacher-students",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderTeacherStudents(),
    };
  }

  /**
   * Setup event listeners for navigation
   */
  setupEventListeners() {
    window.addEventListener("hashchange", () => this.navigate());
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) {
        e.preventDefault();
        const hash = e.target.getAttribute("href");
        window.location.hash = hash;
      }
    });
  }

  /**
   * Navigate to a route
   */
  navigate(path = null) {
    if (path) {
      window.location.hash = path;
      return;
    }

    const hash = window.location.hash.slice(1) || "home";
    const [routeName, ...params] = hash.split("/");
    const route = this.routes[routeName];

    if (!route) {
      this.renderNotFound();
      return;
    }

    // Check authentication
    if (route.requiresAuth && !auth.isAuthenticated()) {
      window.location.hash = "#login";
      return;
    }

    // Check role
    if (route.role && auth.getUserRole() !== route.role) {
      alert(`Access denied. This page is for ${route.role}s only.`);
      this.redirectToDashboard();
      return;
    }

    this.currentRoute = routeName;
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "";
    route.render(...params);
  }

  /**
   * Redirect to appropriate dashboard based on user role
   */
  redirectToDashboard() {
    if (!auth.isAuthenticated()) {
      window.location.hash = "#home";
      return;
    }

    const role = auth.getUserRole();
    if (role === "admin") {
      // Redirect admin to the dedicated admin.html page
      window.location.href = "admin.html";
    } else if (role === "teacher") {
      window.location.hash = "#teacher-dashboard";
    } else {
      window.location.hash = "#student-dashboard";
    }
  }

  /**
   * Update navbar based on authentication status and role
   */
  updateNavbar() {
    const loginLink = document.getElementById("loginLink");
    const settingsLink = document.getElementById("settingsLink");
    const settingsMenu = document.getElementById("settingsMenu");
    const coursesMenuItem = document.getElementById("coursesMenuItem");
    const yourCoursesMenuItem = document.getElementById("yourCoursesMenuItem");
    const myEnrollmentsMenuItem = document.getElementById(
      "myEnrollmentsMenuItem",
    );
    const myCoursesMenuItem = document.getElementById("myCoursesMenuItem");
    const studentsMenuItem = document.getElementById("studentsMenuItem");
    const adminMenuItem = document.getElementById("adminMenuItem");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");

    if (auth.isAuthenticated()) {
      loginLink.style.display = "none";
      settingsLink.style.display = "inline-block";
      settingsMenu.style.display = "none";
      userInfo.style.display = "flex";

      const user = auth.getCurrentUser();
      userName.textContent = user.name || user.email;
      userRole.textContent = user.role.toUpperCase();
      userRole.className = `role-badge ${user.role}`;

      // Hide all dynamic menu items first
      coursesMenuItem.style.display = "none";
      yourCoursesMenuItem.style.display = "none";
      myEnrollmentsMenuItem.style.display = "none";
      myCoursesMenuItem.style.display = "none";
      studentsMenuItem.style.display = "none";
      adminMenuItem.style.display = "none";

      // Show menu items based on role
      if (user.role === "student") {
        coursesMenuItem.style.display = "inline";
        yourCoursesMenuItem.style.display = "inline";
        myEnrollmentsMenuItem.style.display = "inline";
      } else if (user.role === "teacher") {
        myCoursesMenuItem.style.display = "inline";
        studentsMenuItem.style.display = "inline";
      } else if (user.role === "admin") {
        coursesMenuItem.style.display = "inline";
        adminMenuItem.style.display = "inline";
      }
    } else {
      loginLink.style.display = "inline";
      settingsLink.style.display = "none";
      settingsMenu.style.display = "none";
      userInfo.style.display = "none";

      // Hide all dynamic menu items for non-authenticated users
      coursesMenuItem.style.display = "none";
      yourCoursesMenuItem.style.display = "none";
      myEnrollmentsMenuItem.style.display = "none";
      myCoursesMenuItem.style.display = "none";
      studentsMenuItem.style.display = "none";
      adminMenuItem.style.display = "none";
    }
  }

  /**
   * Render pages
   */

  renderHome() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <div class="home-page">
        <div class="hero-section">
          <h1>Welcome to Nexus Platform</h1>
          <p>Learn from Industry Experts</p>
          <p class="subtitle">Upskill yourself with real-world tech and build production-ready projects</p>
          <div class="button-group">
            <a href="#courses" class="btn btn-primary">Explore Courses</a>
            ${!auth.isAuthenticated() ? `<a href="#register" class="btn btn-secondary">Get Started</a>` : ""}
          </div>
        </div>

        <div class="features-section">
          <div class="feature">
            <h3>🎓 Expert Instructors</h3>
            <p>Learn from industry-level experts with real-world experience</p>
          </div>
          <div class="feature">
            <h3>💼 Project-Based Learning</h3>
            <p>Build real projects and add them to your portfolio</p>
          </div>
          <div class="feature">
            <h3>📈 Career Growth</h3>
            <p>Advance your career with industry-recognized skills</p>
          </div>
          <div class="feature">
            <h3>🚀 Latest Technologies</h3>
            <p>Master the latest and greatest in tech industry</p>
          </div>
        </div>
      </div>
    `;
    this.updateNavbar();
  }

  renderLogin() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <div class="auth-page">
        <div class="auth-card">
          <h2>Login to Nexus Platform</h2>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
          <p class="auth-link">Don't have an account? <a href="#register">Register here</a></p>
          <div id="loginMessage" class="message"></div>
        </div>
      </div>
    `;

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const result = await auth.login(email, password);
      const messageDiv = document.getElementById("loginMessage");

      if (result.success) {
        messageDiv.className = "message success";
        messageDiv.textContent = result.message;
        setTimeout(() => {
          router.redirectToDashboard();
        }, 1500);
      } else {
        messageDiv.className = "message error";

        // Display field-specific errors
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, message]) => `• ${message}`)
            .join("\n");
          messageDiv.textContent = errorMessages;
          messageDiv.style.whiteSpace = "pre-line";
        } else {
          messageDiv.textContent = result.message;
          messageDiv.style.whiteSpace = "normal";
        }
      }
    });

    this.updateNavbar();
  }

  renderRegister() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <div class="auth-page">
        <div class="auth-card">
          <h2>Register to Nexus Platform</h2>
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name">Full Name:</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" placeholder="At least 6 characters with uppercase and numbers" required>
            </div>
            <div class="form-group">
              <label for="mobileNumber">Mobile Number:</label>
              <input type="tel" id="mobileNumber" name="mobileNumber" placeholder="10-digit mobile number" pattern="[0-9]{10}">
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <select id="role" name="role" required>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div class="form-group">
              <label for="linkedinUrl">LinkedIn URL (Optional):</label>
              <input type="url" id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/in/yourprofile">
            </div>
            <div class="form-group">
              <label for="githubUrl">GitHub URL (Optional):</label>
              <input type="url" id="githubUrl" name="githubUrl" placeholder="https://github.com/yourprofile">
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
          </form>
          <p class="auth-link">Already have an account? <a href="#login">Login here</a></p>
          <div id="registerMessage" class="message"></div>
        </div>
      </div>
    `;

    const form = document.getElementById("registerForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const result = await auth.register(form);
      const messageDiv = document.getElementById("registerMessage");

      if (result.success) {
        messageDiv.className = "message success";
        messageDiv.textContent = result.message;
        setTimeout(() => {
          router.redirectToDashboard();
        }, 1500);
      } else {
        messageDiv.className = "message error";

        // Display field-specific errors
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, message]) => `• ${message}`)
            .join("\n");
          messageDiv.textContent = errorMessages;
          messageDiv.style.whiteSpace = "pre-line";
        } else {
          messageDiv.textContent = result.message;
          messageDiv.style.whiteSpace = "normal";
        }
      }
    });

    this.updateNavbar();
  }

  async renderCourses() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading courses...</div>";

    try {
      const response = await api.getAllCourses();
      let courses = response.data || [];

      // Filter courses based on user role
      const user = auth.getCurrentUser();
      if (user && user.role === "teacher") {
        // Teachers see only their own courses
        courses = courses.filter(
          (c) => c.teacherId && c.teacherId._id === user._id,
        );
      } else if (user && user.role === "student") {
        // Students see only published courses
        courses = courses.filter((c) => c.status === "published");
      }
      // Admin sees all courses

      const pageTitle =
        user && user.role === "teacher" ? "My Courses" : "All Courses";
      const showCreateButton = auth.isTeacher();

      appDiv.innerHTML = `
        <div class="courses-page">
          <div class="page-header">
            <h2>${pageTitle}</h2>
            ${showCreateButton ? `<a href="#create-course" class="btn btn-primary">Create Course</a>` : ""}
          </div>
          <div class="courses-grid" id="coursesGrid">
            ${
              courses.length > 0
                ? courses
                    .map((course) => {
                      const teacher = course.teacherId || {};
                      return `
              <div class="course-card">
                <div class="course-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <div style="font-size: 48px; color: white;">💼</div>
                </div>
                  <div class="course-info">
                  <h3>${course.title}</h3>
                  <div style="background: #f0f4ff; padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem;">
                    <p style="margin: 0.25rem 0; color: #333; font-weight: 600; font-size: 0.95rem;">
                      👨‍🏫 ${teacher.name || "Unknown Teacher"}
                    </p>
                    <p style="margin: 0.25rem 0; color: #666; font-size: 0.85rem;">
                      🏢 ${teacher.company || "N/A"}
                    </p>
                    <p style="margin: 0.25rem 0; color: #666; font-size: 0.85rem;">
                      💼 ${teacher.profession || teacher.role || "Instructor"}
                    </p>
                    <p style="margin: 0.25rem 0; color: #667eea; font-size: 0.85rem; font-weight: 600;">
                      👥 ${course.enrolledCount || 0} students registered
                    </p>
                  </div>
                  <p class="description">${course.description || "No description"}</p>
                  <div class="course-meta">
                    <span class="price">₹${course.price || 0}</span>
                    <span class="duration">⏱️ ${course.duration || 0} months</span>
                  </div>
                  <a href="#course-detail/${course._id}" class="btn btn-secondary">View Course</a>
                </div>
              </div>
            `;
                    })
                    .join("")
                : `<p class='no-courses'>No courses available${user && user.role === "teacher" ? ". Create your first course!" : ""}</p>`
            }
          </div>
        </div>
      `;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading courses: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  async renderCourseDetail(courseId) {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading course...</div>";

    try {
      const response = await api.getCourseById(courseId);
      const course = response.data;

      appDiv.innerHTML = `
        <div class="course-detail-page">
          <div class="course-header">
            <div class="course-banner" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
              <div style="font-size: 80px; margin-bottom: 20px;">💼</div>
              <h1 style="color: white;">${course.title}</h1>
            </div>
            <div class="course-header-info">
              <p class="instructor">Instructor: ${course.instructor || "Unknown"}</p>
              <p class="description">${course.description}</p>
              <div class="course-stats">
                <span><strong>Company:</strong> ${course.company || "N/A"}</span>
                <span><strong>Role:</strong> ${course.role || "N/A"}</span>
                <span><strong>Duration:</strong> ${course.duration || "Self-paced"} months</span>
                <span><strong>Students:</strong> ${course.enrolledCount || 0}</span>
              </div>
              ${
                auth.isAuthenticated() && auth.isStudent()
                  ? `<button class="btn btn-primary" onclick="enrollCourse('${courseId}')">Enroll Now - ₹${course.price || 0}</button>`
                  : auth.isAuthenticated() &&
                      auth.isTeacher() &&
                      auth.getCurrentUser()._id === course.teacherId
                    ? `<a href="#edit-course/${courseId}" class="btn btn-secondary">Edit Course</a>`
                    : ""
              }
            </div>
          </div>
          <div class="course-content">
            <h3>Course Overview</h3>
            <p>${course.description}</p>
            
            <h3>Key Highlights</h3>
            <ul>
              ${(course.highlights || [])
                .map((highlight) => `<li>${highlight}</li>`)
                .join("")}
            </ul>

            <h3>Course Details</h3>
            <p>${course.fullDescription || course.description}</p>
          </div>
        </div>
      `;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading course: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  renderProfile() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser();

    appDiv.innerHTML = `
      <div class="profile-page">
        <div class="profile-card">
          <h2>User Profile</h2>
          <form id="profileForm" class="profile-form">
            <div class="form-group">
              <label for="name">Full Name:</label>
              <input type="text" id="name" name="name" value="${user.name || ""}" required>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" value="${user.email}" disabled>
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <input type="text" value="${user.role.toUpperCase()}" disabled>
            </div>
            <button type="submit" class="btn btn-primary">Update Profile</button>
          </form>

          <div class="change-password-section">
            <h3>Change Password</h3>
            <form id="passwordForm" class="profile-form">
              <div class="form-group">
                <label for="oldPassword">Current Password:</label>
                <input type="password" id="oldPassword" name="oldPassword" required>
              </div>
              <div class="form-group">
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="newPassword" required>
              </div>
              <button type="submit" class="btn btn-primary">Change Password</button>
            </form>
          </div>
          
          <div id="message" class="message"></div>
        </div>
      </div>
    `;

    document
      .getElementById("profileForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const result = await auth.updateProfile({ name });
        const messageDiv = document.getElementById("message");
        messageDiv.className = `message ${result.success ? "success" : "error"}`;
        messageDiv.textContent = result.message;
      });

    document
      .getElementById("passwordForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const result = await auth.changePassword(oldPassword, newPassword);
        const messageDiv = document.getElementById("message");
        messageDiv.className = `message ${result.success ? "success" : "error"}`;
        messageDiv.textContent = result.message;
      });

    this.updateNavbar();
  }

  renderStudentDashboard() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser();

    appDiv.innerHTML = `
      <div class="dashboard student-dashboard">
        <h2>Welcome, ${user.name || user.email}! 👋</h2>
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>My Enrollments</h3>
            <p>Explore courses you're enrolled in</p>
            <a href="#my-enrollments" class="btn btn-secondary">View</a>
          </div>
          <div class="dashboard-card">
            <h3>Browse Courses</h3>
            <p>Discover new courses to learn</p>
            <a href="#courses" class="btn btn-secondary">Explore</a>
          </div>
          <div class="dashboard-card">
            <h3>My Profile</h3>
            <p>Manage your account settings</p>
            <a href="#profile" class="btn btn-secondary">Edit</a>
          </div>
          <div class="dashboard-card">
            <h3>Payments</h3>
            <p>View your transaction history</p>
            <a href="#payment" class="btn btn-secondary">History</a>
          </div>
        </div>
      </div>
    `;

    this.updateNavbar();
  }

  async renderTeacherDashboard() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser();

    // First load the basic dashboard
    appDiv.innerHTML = `
      <div class="dashboard teacher-dashboard">
        <h2>Welcome, ${user.name || user.email}! 🎓</h2>
        <div id="notification-badge" style="margin-bottom: 2rem;"></div>
        <div id="tab-buttons" style="display: flex; gap: 1rem; margin-bottom: 2rem;"></div>
        <div id="content-courses" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));"></div>
        <div id="content-students" style="display: none;"></div>
      </div>
    `;

    try {
      // Load student count and show notification
      const studentResponse = await api.getTeacherStudents(1, 1);
      const studentCount = studentResponse.total || 0;

      const badgeHtml =
        studentCount > 0
          ? `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; padding: 1.5rem; border-radius: 12px;">
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
      `
          : "";

      document.getElementById("notification-badge").innerHTML = badgeHtml;

      // Add tab buttons
      const tabButtonsHtml = `
        <button onclick="switchTeacherTab('courses')" id="tab-courses-btn"
                style="padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; 
                       border-radius: 6px; cursor: pointer; font-weight: 600;">
          📚 My Courses
        </button>
        <button onclick="switchTeacherTab('students')" id="tab-students-btn"
                style="padding: 0.75rem 1.5rem; background: transparent; color: #666; border: 2px solid #ddd; 
                       border-radius: 6px; cursor: pointer; font-weight: 600;">
          👥 My Students (${studentCount})
        </button>
      `;
      document.getElementById("tab-buttons").innerHTML = tabButtonsHtml;

      // Load my courses
      const coursesResponse = await api.getMyCourses(1, 10);
      const courses = coursesResponse.data || [];

      const coursesHtml =
        courses.length > 0
          ? courses
              .map(
                (course) => `
        <div style="background: white; border: 2px solid #ddd; border-radius: 12px; 
                    padding: 1.5rem; cursor: pointer; transition: all 0.3s;"
             onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.2)'"
             onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='none'">
          <h3 style="margin: 0 0 0.5rem 0; color: #333;">${course.title || "Course"}</h3>
          <p style="margin: 0.5rem 0; color: #666; font-size: 0.9rem;">
            ${course.description || "No description"}
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
            <div>
              <span style="color: #999; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">
                💵 Price
              </span>
              <p style="margin: 0.25rem 0 0 0; color: #333; font-size: 1rem; font-weight: bold;">
                ₹${course.price || 0}
              </p>
            </div>
            <div>
              <span style="color: #999; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">
                ⏱️ Duration
              </span>
              <p style="margin: 0.25rem 0 0 0; color: #333; font-size: 1rem; font-weight: bold;">
                ${course.duration || 0} months
              </p>
            </div>
          </div>
          <a href="#course-detail/${course._id}" class="btn btn-secondary" style="display: inline-block; margin-top: 1rem;">
            Edit Course
          </a>
        </div>
      `,
              )
              .join("")
          : "<p>You haven't created any courses yet.</p>";

      document.getElementById("content-courses").innerHTML = coursesHtml;
    } catch (error) {
      console.error("Error loading teacher dashboard:", error);
    }

    this.updateNavbar();
  }

  async renderAdminDashboard() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser();

    appDiv.innerHTML = `
      <div class="dashboard admin-dashboard">
        <h2>Admin Dashboard 🛡️</h2>
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>📚 Approve Courses</h3>
            <p>Review and approve pending teacher courses</p>
            <a href="#admin-approve-courses" class="btn btn-secondary">Manage</a>
          </div>
          <div class="dashboard-card">
            <h3>💰 Payment Management</h3>
            <p>Monitor and manage student payments between students and teachers</p>
            <a href="#admin-payments" class="btn btn-secondary">Manage</a>
          </div>
          <div class="dashboard-card">
            <h3>All Courses</h3>
            <p>Monitor all platform courses</p>
            <a href="#courses" class="btn btn-secondary">View</a>
          </div>
          <div class="dashboard-card">
            <h3>Reports</h3>
            <p>View analytics and reports</p>
            <a href="#reports" class="btn btn-secondary">View</a>
          </div>
        </div>
      </div>
    `;

    this.updateNavbar();
  }

  async renderAdminApproveCourses() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading pending courses...</div>";

    try {
      const response = await api.getPendingCourses(1, 50);
      const pendingCourses = response.data || [];

      let courseHTML = `
        <div class="admin-approve-courses-page">
          <div class="page-header">
            <h2>📚 Course Approvals</h2>
            <p>Review and approve courses created by teachers</p>
          </div>`;

      if (pendingCourses.length === 0) {
        courseHTML += `
          <div class="no-data-message">
            <p>✅ No pending courses to review!</p>
          </div>`;
      } else {
        courseHTML += `
          <div class="courses-approval-list">`;

        for (const course of pendingCourses) {
          courseHTML += `
            <div class="course-approval-card">
              <div class="course-approval-header">
                <h3>${course.title}</h3>
                <span class="status-badge draft">Pending Admin Approval</span>
              </div>
              <div class="course-approval-details">
                <p><strong>Teacher:</strong> <span id="teacher-${course._id}">Loading...</span></p>
                <p><strong>Description:</strong> ${course.description}</p>
                <p><strong>Duration:</strong> ${course.duration} months</p>
                <p><strong>Price:</strong> ₹${course.price}</p>
                <p><strong>Company:</strong> ${course.company}</p>
                <p><strong>Role:</strong> ${course.role}</p>
                <div class="highlights-section">
                  <strong>Highlights:</strong>
                  <ul>
                    ${course.highlights.map((h) => `<li>${h}</li>`).join("")}
                  </ul>
                </div>
              </div>
              <div class="course-approval-actions">
                <button class="btn btn-success approve-btn" data-course-id="${course._id}">✓ Approve</button>
                <button class="btn btn-danger reject-btn" data-course-id="${course._id}">✗ Reject</button>
              </div>
            </div>`;
        }

        courseHTML += `</div>`;
      }

      courseHTML += `
        <div id="approvalMessage" class="message"></div>
      </div>`;

      appDiv.innerHTML = courseHTML;

      // Add event listeners for approve/reject buttons
      document.querySelectorAll(".approve-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const courseId = e.target.dataset.courseId;
          await this.approveCourse(courseId);
        });
      });

      document.querySelectorAll(".reject-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const courseId = e.target.dataset.courseId;
          await this.rejectCourse(courseId);
        });
      });

      this.updateNavbar();
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading pending courses: ${error.message}</div>`;
    }
  }

  async approveCourse(courseId) {
    try {
      const response = await api.approveCourse(courseId);
      const messageDiv = document.getElementById("approvalMessage");
      if (response.success) {
        messageDiv.className = "message success";
        messageDiv.textContent = "Course approved successfully! Reloading...";
        setTimeout(() => {
          window.location.hash = "#admin-approve-courses";
        }, 1500);
      } else {
        messageDiv.className = "message error";
        messageDiv.textContent = response.message || "Approval failed";
      }
    } catch (error) {
      const messageDiv = document.getElementById("approvalMessage");
      messageDiv.className = "message error";
      messageDiv.textContent = error.message;
    }
  }

  async rejectCourse(courseId) {
    if (!confirm("Are you sure you want to reject this course?")) {
      return;
    }

    try {
      const response = await api.rejectCourse(courseId);
      const messageDiv = document.getElementById("approvalMessage");
      if (response.success) {
        messageDiv.className = "message success";
        messageDiv.textContent = "Course rejected successfully! Reloading...";
        setTimeout(() => {
          window.location.hash = "#admin-approve-courses";
        }, 1500);
      } else {
        messageDiv.className = "message error";
        messageDiv.textContent = response.message || "Rejection failed";
      }
    } catch (error) {
      const messageDiv = document.getElementById("approvalMessage");
      messageDiv.className = "message error";
      messageDiv.textContent = error.message;
    }
  }

  async renderAdminPayments() {
    const appDiv = document.getElementById("app");

    appDiv.innerHTML = `
      <div class="admin-payments-page">
        <div class="page-header">
          <h2>💰 Payment Management - Admin as Mediator</h2>
          <p>Manage all transactions between students and teachers</p>
        </div>
        <div class="payment-management-container">
          <div class="payment-stats">
            <div class="stat-card">
              <h3>Pending Payments</h3>
              <p id="pending-count">0</p>
            </div>
            <div class="stat-card">
              <h3>Completed Payments</h3>
              <p id="completed-count">0</p>
            </div>
            <div class="stat-card">
              <h3>Total Revenue</h3>
              <p id="total-revenue">₹0</p>
            </div>
          </div>
          <div class="payments-table">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="paymentsTableBody">
                <tr>
                  <td colspan="6" style="text-align: center; padding: 2rem;">Loading payments...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id="paymentMessage" class="message"></div>
      </div>
    `;

    // Load payment data
    try {
      const response = await api.getPendingPayments();
      const payments = response.data || [];

      // Aggregate stats
      const pending = payments.filter(
        (p) => p.status === "transaction_submitted",
      ).length;
      const completed = payments.filter((p) => p.status === "approved").length;
      const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      document.getElementById("pending-count").textContent = pending;
      document.getElementById("completed-count").textContent = completed;
      document.getElementById("total-revenue").textContent = `₹${total}`;

      // Load payments table
      if (payments.length === 0) {
        document.getElementById("paymentsTableBody").innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem;">No payments yet</td>
          </tr>
        `;
      } else {
        document.getElementById("paymentsTableBody").innerHTML = payments
          .map(
            (payment) => `
          <tr>
            <td>${payment.student?.name || payment.studentName || "Unknown"}</td>
            <td>${payment.course?.title || payment.courseName || "Unknown"}</td>
            <td>₹${payment.amount || 0}</td>
            <td><span class="status-badge ${payment.status || "transaction_submitted"}">${(payment.status || "transaction_submitted").replace(/_/g, " ")}</span></td>
            <td>${new Date(payment.createdAt).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-small btn-success" onclick="approvePaymentInRouter('${payment._id}')">Confirm Receipt</button>
              <button class="btn btn-small btn-danger" onclick="rejectPaymentInRouter('${payment._id}')">Reject</button>
            </td>
          </tr>
        `,
          )
          .join("");
      }
    } catch (error) {
      console.log("Payment data not yet configured:", error.message);
      document.getElementById("paymentsTableBody").innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 2rem;">No pending payment confirmations</td>
        </tr>
      `;
    }

    this.updateNavbar();
  }

  async renderMyCourses() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading your courses...</div>";

    try {
      const response = await api.getTeacherCourses();
      const courses = response.data || [];

      appDiv.innerHTML = `
        <div class="my-courses-page">
          <div class="page-header">
            <h2>My Courses</h2>
            <a href="#create-course" class="btn btn-primary">Create New Course</a>
          </div>
          <div class="courses-table">
            <table>
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Students Enrolled</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${
                  courses.length > 0
                    ? courses
                        .map(
                          (course) => `
                  <tr>
                    <td>${course.title}</td>
                    <td>${course.enrolledCount || 0}</td>
                    <td>₹${course.price || 0}</td>
                    <td><span class="status ${course.status || "published"}">${
                      course.status === "pending_admin_approval"
                        ? "Pending Admin Approval"
                        : course.status === "rejected"
                          ? "Rejected"
                          : "Published"
                    }</span></td>
                    <td>
                      <a href="#course-detail/${course._id}" class="btn btn-small">View</a>
                      <a href="#edit-course/${course._id}" class="btn btn-small">Edit</a>
                    </td>
                  </tr>
                `,
                        )
                        .join("")
                    : "<tr><td colspan='5'>No courses created yet</td></tr>"
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading courses: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  renderCreateCourse() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <div class="create-course-page">
        <h2>Create New Course</h2>
        <form id="createCourseForm" class="form-large">
          <div class="form-group">
            <label for="title">Course Title:</label>
            <input type="text" id="title" name="title" required>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>
          <div class="form-group">
            <label for="price">Price (₹):</label>
            <input type="number" id="price" name="price" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="duration">Duration (months) - How many months will this course continue:</label>
            <input type="number" id="duration" name="duration" min="1" max="60" required>
          </div>
          <div class="form-group">
            <label for="company">Company Name:</label>
            <input type="text" id="company" name="company" required>
          </div>
          <div class="form-group">
            <label for="role">Job Role/Position:</label>
            <input type="text" id="role" name="role" required>
          </div>
          <div class="form-group">
            <label for="highlights">Course Highlights & Specifications (up to 10):</label>
            <div id="highlightsContainer">
              <div class="highlight-input-group">
                <input type="text" class="highlight-input" placeholder="Add a highlight or specification" maxlength="500">
                <button type="button" class="btn btn-small btn-danger remove-highlight" style="display:none;">Remove</button>
              </div>
            </div>
            <button type="button" id="addHighlightBtn" class="btn btn-secondary btn-small">+ Add Highlight</button>
          </div>
          <button type="submit" class="btn btn-primary">Create Course</button>
        </form>
        <div id="createMessage" class="message"></div>
      </div>
    `;

    // Handle highlights functionality
    const highlightsContainer = document.getElementById("highlightsContainer");
    const addHighlightBtn = document.getElementById("addHighlightBtn");

    addHighlightBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const highlightInputs = highlightsContainer.querySelectorAll(
        ".highlight-input-group",
      );
      if (highlightInputs.length >= 10) {
        alert("Maximum 10 highlights allowed");
        return;
      }

      const newHighlightGroup = document.createElement("div");
      newHighlightGroup.className = "highlight-input-group";
      newHighlightGroup.innerHTML = `
        <input type="text" class="highlight-input" placeholder="Add a highlight or specification" maxlength="500">
        <button type="button" class="btn btn-small btn-danger remove-highlight">Remove</button>
      `;

      newHighlightGroup
        .querySelector(".remove-highlight")
        .addEventListener("click", (e) => {
          e.preventDefault();
          newHighlightGroup.remove();
          updateRemoveButtons();
        });

      highlightsContainer.appendChild(newHighlightGroup);
      updateRemoveButtons();
    });

    function updateRemoveButtons() {
      const highlightInputs = highlightsContainer.querySelectorAll(
        ".highlight-input-group",
      );
      highlightInputs.forEach((group) => {
        const removeBtn = group.querySelector(".remove-highlight");
        removeBtn.style.display = highlightInputs.length > 1 ? "block" : "none";
      });
    }

    updateRemoveButtons();

    document
      .getElementById("createCourseForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;

        // Collect highlights
        const highlightInputs =
          highlightsContainer.querySelectorAll(".highlight-input");
        const highlights = Array.from(highlightInputs)
          .map((input) => input.value.trim())
          .filter((value) => value.length > 0);

        if (highlights.length === 0) {
          document.getElementById("createMessage").className = "message error";
          document.getElementById("createMessage").textContent =
            "Please add at least one highlight";
          return;
        }

        const courseData = {
          title: form.title.value,
          description: form.description.value,
          price: parseFloat(form.price.value),
          duration: parseInt(form.duration.value),
          company: form.company.value,
          role: form.role.value,
          highlights: highlights,
        };

        try {
          const response = await api.createCourse(courseData);
          const messageDiv = document.getElementById("createMessage");
          if (response.success) {
            messageDiv.className = "message success";
            messageDiv.textContent =
              "Course created successfully! Redirecting...";
            setTimeout(() => {
              window.location.hash = "#my-courses";
            }, 1500);
          } else {
            messageDiv.className = "message error";
            messageDiv.textContent = response.message || "Creation failed";
          }
        } catch (error) {
          document.getElementById("createMessage").className = "message error";
          document.getElementById("createMessage").textContent = error.message;
        }
      });

    this.updateNavbar();
  }

  async renderMyEnrollments() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading your enrollments...</div>";

    try {
      const response = await api.getMyEnrollments();
      const enrollments = response.data || [];

      let html = `
        <div class="my-enrollments-page">
          <h2>My Enrollments</h2>
      `;

      const approvedEnrollments = enrollments.filter(
        (e) => e.status === "active",
      );
      if (approvedEnrollments.length > 0) {
        html += `
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                      color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;
                      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
              ✅ Course Approval Notification
            </h3>
            <p style="margin: 0; font-size: 0.95rem;">
              Great! Your enrollment in ${approvedEnrollments[0].courseId?.title || "a course"}
              has been approved by the admin. You can now access the course and learn from your teacher!
            </p>
          </div>
        `;
      }

      html += `<div class="enrollments-list" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));">`;

      if (enrollments.length > 0) {
        html += enrollments
          .map((enrollment) => {
            const course = enrollment.courseId || {};
            const teacher = course.teacherId || {};
            const status = enrollment.status || "awaiting_admin_approval";

            let statusBadge = "";
            if (status === "awaiting_admin_approval") {
              statusBadge =
                '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">⏳ Awaiting Admin Approval</span>';
            } else if (status === "payment_requested") {
              statusBadge =
                '<span style="background: #e0f2fe; color: #075985; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">💳 Pay Now</span>';
            } else if (status === "payment_submitted") {
              statusBadge =
                '<span style="background: #ede9fe; color: #5b21b6; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">🧾 Payment Submitted</span>';
            } else if (status === "active") {
              statusBadge =
                '<span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">✅ Active</span>';
            } else if (status === "rejected") {
              statusBadge =
                '<span style="background: #fee2e2; color: #991b1b; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">❌ Rejected</span>';
            } else {
              statusBadge =
                '<span style="background: #dbeafe; color: #082f49; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">📚 In Progress</span>';
            }

            const showPayNow = status === "payment_requested";
            const showWaitingPaymentConfirm = status === "payment_submitted";
            const canAccessTeacher = status === "active";
            const amount = enrollment.payableAmount || course.price || 0;

            return `
                <div style="background: white; border: 2px solid #ddd; border-radius: 12px; 
                            padding: 1.5rem; cursor: pointer; transition: all 0.3s;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                     onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.2)'"
                     onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                  
                  <!-- Course Title -->
                  <h3 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.1rem;">
                    ${course.title || "Unknown Course"}
                  </h3>

                  <!-- Status Badge -->
                  <div style="margin-bottom: 1rem;display: inline-block;">
                    ${statusBadge}
                  </div>

                  <!-- Teacher Information Box -->
                  <div style="background: ${status === "active" ? "#f0f4ff" : "#fff3cd"}; border-left: 4px solid ${status === "active" ? "#667eea" : "#ff9800"}; padding: 1rem; 
                              border-radius: 8px; margin-bottom: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: ${status === "active" ? "#667eea" : "#856404"}; font-size: 0.9rem;">
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
                    ${
                      canAccessTeacher
                        ? `
                      <hr style="margin: 0.75rem 0; border: none; border-top: 1px solid #ddd;">
                      <p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">
                        📧 ${teacher.email || "N/A"}
                      </p>
                      <p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">
                        📱 ${teacher.mobileNumber || "N/A"}
                      </p>
                    `
                        : `
                      <p style="margin: 0.75rem 0 0 0; color: #ff9800; font-size: 0.85rem; font-weight: 600;">
                        ⏳ Full teacher details will be visible after admin approval
                      </p>
                    `
                    }
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
                        <button onclick="${canAccessTeacher ? `openWhatsApp('${teacher.mobileNumber || ""}', '${course.title || ""}')` : 'alert("Teacher contact is available after activation")'}"
                          style="flex: 1; padding: 0.75rem; background: ${canAccessTeacher ? "#25d366" : "#ccc"}; color: white; 
                                    border: none; border-radius: 6px; font-weight: 600; cursor: ${status === "active" ? "pointer" : "not-allowed"};
                                    transition: background 0.3s;"
                          onmouseover="${canAccessTeacher ? "this.style.background='#20ba5a'" : ""}"
                          onmouseout="${canAccessTeacher ? "this.style.background='#25d366'" : ""}"
                          ${!canAccessTeacher ? "disabled" : ""}>
                      💬 WhatsApp
                    </button>
                            <button onclick="${canAccessTeacher ? `router.navigate('#course-detail/${course._id || enrollment.courseId}')` : showPayNow ? `submitPaymentPrompt('${enrollment._id}', '${course.title || "Course"}', '${amount}')` : showWaitingPaymentConfirm ? 'alert("Your payment is submitted. Please wait for admin confirmation.")' : 'alert("Please wait for admin approval")'}"
                              style="flex: 1; padding: 0.75rem; background: ${canAccessTeacher ? "#667eea" : showPayNow ? "#0ea5e9" : "#ccc"}; color: white; 
                                border: none; border-radius: 6px; font-weight: 600; cursor: ${canAccessTeacher || showPayNow ? "pointer" : "not-allowed"};
                                    transition: background 0.3s;"
                          onmouseover="${canAccessTeacher ? "this.style.background='#5568d3'" : showPayNow ? "this.style.background='#0284c7'" : ""}"
                          onmouseout="${canAccessTeacher ? "this.style.background='#667eea'" : showPayNow ? "this.style.background='#0ea5e9'" : ""}"
                          ${!canAccessTeacher && !showPayNow && !showWaitingPaymentConfirm ? "disabled" : ""}>
                          ${canAccessTeacher ? "📖 View Course" : showPayNow ? `💳 Pay Now ₹${amount}` : showWaitingPaymentConfirm ? "⏳ Await Confirmation" : "🔒 Locked"}
                    </button>
                  </div>
                </div>
              `;
          })
          .join("");
      } else {
        html += "<p>You're not enrolled in any courses yet</p>";
      }

      html += `
          </div>
        </div>
      `;

      appDiv.innerHTML = html;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading enrollments: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  async renderPayment() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading payment history...</div>";

    try {
      const response = await api.getMyPaymentHistory();
      const transactions = response.data || [];

      appDiv.innerHTML = `
        <div class="payment-page">
          <h2>Payment History</h2>
          <div class="payment-table">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  transactions.length > 0
                    ? transactions
                        .map(
                          (transaction) => `
                  <tr>
                    <td>${transaction.course?.title || transaction.courseTitle || "Course"}</td>
                    <td>₹${transaction.amount || 0}</td>
                    <td>${new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td><span class="status ${transaction.status}">${(transaction.status || "submitted").replace(/_/g, " ")}</span></td>
                  </tr>
                `,
                        )
                        .join("")
                    : "<tr><td colspan='4'>No transactions yet</td></tr>"
                }
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading payment history: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  async renderYourCourses() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading your courses...</div>";

    try {
      const response = await api.getMyEnrollments();
      const allEnrollments = response.data || [];
      // Filter for only approved courses
      const approvedEnrollments = allEnrollments.filter(
        (e) => e.status === "active",
      );

      let html = `
        <div class="your-courses-page">
          <h2>Your Courses</h2>
      `;

      if (approvedEnrollments.length > 0) {
        html += `
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                      color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;
                      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
              ✅ Approved Courses
            </h3>
            <p style="margin: 0; font-size: 0.95rem;">
              You have ${approvedEnrollments.length} approved course(s). Start learning now!
            </p>
          </div>
        `;
      }

      html += `<div class="courses-list" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));">`;

      if (approvedEnrollments.length > 0) {
        html += approvedEnrollments
          .map((enrollment) => {
            const course = enrollment.courseId || {};
            const teacher = course.teacherId || {};

            return `
              <div style="background: white; border: 2px solid #ddd; border-radius: 12px; 
                          padding: 1.5rem; cursor: pointer; transition: all 0.3s;
                          box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                   onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.2)'"
                   onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                
                <!-- Course Title -->
                <h3 style="margin: 0 0 0.5rem 0; color: #333; font-size: 1.1rem;">
                  ${course.title || "Unknown Course"}
                </h3>

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
                      👥 Registered
                    </span>
                    <p style="margin: 0.25rem 0 0 0; color: #333; font-size: 1.1rem; font-weight: bold;">
                      ${course.enrolledCount || 0} students
                    </p>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div style="margin-bottom: 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.9rem; color: #666;">Progress</span>
                    <span style="font-weight: 600; color: #667eea;">${enrollment.progress || 0}%</span>
                  </div>
                  <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${enrollment.progress || 0}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px;"></div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                  <button onclick="openWhatsApp('${teacher.mobileNumber || ""}', '${course.title || ""}')"
                          style="flex: 1; padding: 0.75rem; background: #25d366; color: white; 
                                  border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                                  transition: background 0.3s;"
                          onmouseover="this.style.background='#20ba5a'"
                          onmouseout="this.style.background='#25d366'">
                    💬 WhatsApp
                  </button>
                  <button onclick="router.navigate('#course-detail/${enrollment.courseId}')"
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
          })
          .join("");
      } else {
        html +=
          "<p style='grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;'>No approved courses yet. Complete your registration and wait for admin approval!</p>";
      }

      html += `</div></div>`;
      appDiv.innerHTML = html;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading your courses: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  async renderTeacherStudents() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading students...</div>";

    try {
      // First get teacher's courses
      const coursesResponse = await api.getTeacherCourses();
      const teacherCourses = coursesResponse.data || [];

      let html = `
        <div class="teacher-students-page">
          <h2>Students</h2>
          <p style="color: #666; margin-bottom: 2rem;">Select a course to see enrolled students</p>
      `;

      if (teacherCourses.length === 0) {
        html += `
          <div style="text-align: center; padding: 2rem; color: #999;">
            <p>No courses created yet. Create a course first to see students!</p>
            <a href="#create-course" class="btn btn-primary" style="margin-top: 1rem;">Create Course</a>
          </div>
        `;
      } else {
        html += `<div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); margin-bottom: 2rem;">`;

        for (const course of teacherCourses) {
          const studentCount = course.enrolledCount || 0;
          html += `
            <div style="background: white; border: 2px solid #ddd; border-radius: 12px; 
                        padding: 1.5rem; cursor: pointer; transition: all 0.3s;"
                 onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.2)'"
                 onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='none'"
                 onclick="loadCourseStudents('${course._id}', '${course.title}')">
              <h3 style="margin: 0 0 0.75rem 0; color: #333;">${course.title}</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                  <span style="color: #999; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">
                    💵 Price
                  </span>
                  <p style="margin: 0.25rem 0 0 0; color: #333; font-size: 1rem; font-weight: bold;">
                    ₹${course.price || 0}
                  </p>
                </div>
                <div>
                  <span style="color: #999; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">
                    ⏱️ Duration
                  </span>
                  <p style="margin: 0.25rem 0 0 0; color: #333; font-size: 1rem; font-weight: bold;">
                    ${course.duration || 0} months
                  </p>
                </div>
              </div>
              <div style="background: #f0f4ff; padding: 0.75rem; border-radius: 6px; text-align: center;">
                <p style="margin: 0; color: #667eea; font-weight: 600; font-size: 1.1rem;">
                  👥 ${studentCount} Students Enrolled
                </p>
              </div>
            </div>
          `;
        }

        html += `</div>`;
      }

      html += `<div id="studentDetails"></div></div>`;
      appDiv.innerHTML = html;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading students: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  renderNotFound() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <div class="not-found">
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a href="#home" class="btn btn-primary">Go to Home</a>
      </div>
    `;
    this.updateNavbar();
  }
}

// Create global router instance
const router = new Router();

// Handle settings dropdown
function toggleSettingsMenu() {
  const menu = document.getElementById("settingsMenu");
  if (menu) {
    if (menu.style.display === "none" || menu.style.display === "") {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
  }
}

function goToProfile() {
  window.location.hash = "#profile";
  document.getElementById("settingsMenu").style.display = "none";
}

function logout() {
  auth.logout();
  router.updateNavbar();
  window.location.hash = "#home";
  document.getElementById("settingsMenu").style.display = "none";
}

// Close settings menu when clicking outside
document.addEventListener("click", (e) => {
  const settingsLink = document.getElementById("settingsLink");
  const settingsMenu = document.getElementById("settingsMenu");
  if (
    settingsMenu &&
    settingsLink &&
    !settingsLink.contains(e.target) &&
    !settingsMenu.contains(e.target)
  ) {
    settingsMenu.style.display = "none";
  }
});

// Navigate on page load
window.addEventListener("load", () => {
  router.navigate();
});

// Enroll in course function
async function enrollCourse(courseId) {
  try {
    const response = await api.enrollInCourse({ courseId });
    if (response.success) {
      alert("Enrolled successfully!");
      router.navigate("#my-enrollments");
    } else {
      alert(response.message || "Enrollment failed");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function submitPaymentPrompt(enrollmentId, courseTitle, amount) {
  const transactionId = prompt(
    `Enter transaction ID for ${courseTitle} (Amount: INR ${amount}):`,
  );

  if (!transactionId || !transactionId.trim()) {
    return;
  }

  try {
    const response = await api.submitPayment(enrollmentId, {
      transactionId: transactionId.trim(),
    });

    if (response.success) {
      alert(
        "Payment submitted successfully. Please wait for admin confirmation.",
      );
      router.navigate("#my-enrollments");
      return;
    }

    alert(response.message || "Failed to submit payment");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function approvePaymentInRouter(paymentId) {
  try {
    const response = await api.approvePayment(paymentId);
    if (response.success) {
      alert("Payment approved successfully");
      router.navigate("#admin-payments");
      return;
    }

    alert(response.message || "Failed to approve payment");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function rejectPaymentInRouter(paymentId) {
  const reason = prompt(
    "Enter rejection reason:",
    "Payment details are invalid",
  );
  if (!reason || !reason.trim()) {
    return;
  }

  try {
    const response = await api.rejectPayment(paymentId, reason.trim());
    if (response.success) {
      alert("Payment rejected");
      router.navigate("#admin-payments");
      return;
    }

    alert(response.message || "Failed to reject payment");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Load course students
async function loadCourseStudents(courseId, courseTitle) {
  const container = document.getElementById("studentDetails");
  container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #667eea;">Loading students for ${courseTitle}...</div>`;

  try {
    const response = await api.request(
      `/enrollments/course/${courseId}/enrollments`,
      "GET",
      null,
      true,
    );
    const enrollments = response.data || [];

    if (enrollments.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #999;">No students enrolled in this course yet</div>`;
      return;
    }

    let html = `
      <div style="margin-top: 2rem;">
        <h3 style="color: #333; margin-bottom: 1rem;">👥 Students in ${courseTitle}</h3>
        <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
    `;

    enrollments.forEach((enrollment) => {
      const student = enrollment.studentId;
      html += `
        <div style="background: white; border: 2px solid #ddd; border-radius: 12px; padding: 1.5rem;">
          <h4 style="margin: 0 0 0.75rem 0; color: #333;">${student.name || "Unknown"}</h4>
          <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">
            <p style="margin: 0.25rem 0;">📧 ${student.email || "N/A"}</p>
            <p style="margin: 0.25rem 0;">📱 ${student.mobileNumber || "N/A"}</p>
            <p style="margin: 0.25rem 0;">📊 Progress: ${enrollment.progressPercentage || 0}%</p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button onclick="callStudent('${student.mobileNumber || ""}')"
                    style="flex: 1; padding: 0.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              📞 Call
            </button>
            <button onclick="whatsappStudent('${student.mobileNumber || ""}')"
                    style="flex: 1; padding: 0.5rem; background: #25d366; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              💬 Chat
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div style="color: red; padding: 2rem; text-align: center;">Error loading students: ${error.message}</div>`;
  }
}

// WhatsApp Integration Function
function openWhatsApp(teacherPhone, courseName) {
  // Validate phone number
  if (!teacherPhone || teacherPhone === "N/A" || teacherPhone.trim() === "") {
    alert("Teacher phone number not available. Please contact the admin.");
    return;
  }

  // Create WhatsApp message
  const message = `Hey Sir/Ma'am, 👋\n\nI have registered your ${courseName} course and I need your teaching and guidance to master it!\n\nLooking forward to learning from you. 🙏`;

  // Clean phone number (remove special characters except +)
  const cleanPhone = teacherPhone.replace(/[^\d+]/g, "");

  // Validate phone number format
  if (!cleanPhone || cleanPhone.length < 10) {
    alert("Invalid phone number format. Please contact the admin.");
    return;
  }

  // Create WhatsApp URL
  const whatsappURL = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  // Open in new tab
  window.open(whatsappURL, "_blank");
}

// Teacher Dashboard Tab Switching
function switchTeacherTab(tabName) {
  const coursesContent = document.getElementById("content-courses");
  const studentsContent = document.getElementById("content-students");
  const coursesBtnId = document.getElementById("tab-courses-btn");
  const studentsBtnId = document.getElementById("tab-students-btn");

  if (tabName === "courses") {
    coursesContent.style.display = "grid";
    studentsContent.style.display = "none";
    coursesBtnId.style.background = "#667eea";
    coursesBtnId.style.color = "white";
    coursesBtnId.style.borderColor = "#667eea";
    studentsBtnId.style.background = "transparent";
    studentsBtnId.style.color = "#666";
    studentsBtnId.style.borderColor = "#ddd";
  } else if (tabName === "students") {
    coursesContent.style.display = "none";
    studentsContent.style.display = "grid";
    studentsBtnId.style.background = "#667eea";
    studentsBtnId.style.color = "white";
    studentsBtnId.style.borderColor = "#667eea";
    coursesBtnId.style.background = "transparent";
    coursesBtnId.style.color = "#666";
    coursesBtnId.style.borderColor = "#ddd";
    loadTeacherStudents();
  }
}

// Load Teacher Students
async function loadTeacherStudents() {
  const container = document.getElementById("content-students");
  container.innerHTML =
    '<div style="text-align: center; padding: 2rem; color: #667eea; grid-column: 1/-1;">Loading students...</div>';

  try {
    const response = await api.getTeacherStudents(1, 20);
    const students = response.data || [];

    if (students.length === 0) {
      container.innerHTML =
        '<div style="text-align: center; padding: 2rem; color: #999; grid-column: 1/-1;">No students enrolled yet</div>';
      return;
    }

    const html = students
      .map(
        (student) => `
      <div style="background: white; border: 2px solid #ddd; border-radius: 12px; 
                  padding: 1.5rem; cursor: pointer; transition: all 0.3s;"
           onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.2)'"
           onmouseout="this.style.borderColor='#ddd'; this.style.boxShadow='none'">
        <h3 style="margin: 0 0 0.5rem 0; color: #333;">
          ${student.name || "Unknown Student"}
        </h3>
        <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">
          <p style="margin: 0.25rem 0;">📧 ${student.email || "N/A"}</p>
          <p style="margin: 0.25rem 0;">📱 ${student.mobileNumber || "N/A"}</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button onclick="callStudent('${student.mobileNumber || ""}')"
                  style="flex: 1; padding: 0.5rem; background: #3b82f6; color: white; 
                          border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                          transition: background 0.3s; font-size: 0.9rem;"
                  onmouseover="this.style.background='#2563eb'"
                  onmouseout="this.style.background='#3b82f6'">
            📞 Call
          </button>
          <button onclick="whatsappStudent('${student.mobileNumber || ""}')"
                  style="flex: 1; padding: 0.5rem; background: #25d366; color: white; 
                          border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                          transition: background 0.3s; font-size: 0.9rem;"
                  onmouseover="this.style.background='#20ba5a'"
                  onmouseout="this.style.background='#25d366'">
            💬 Chat
          </button>
        </div>
      </div>
    `,
      )
      .join("");

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML =
      '<div style="text-align: center; padding: 2rem; color: #ef4444; grid-column: 1/-1;">Error loading students: ' +
      error.message +
      "</div>";
  }
}

// Call Student Function
function callStudent(phoneNumber) {
  if (!phoneNumber || phoneNumber === "N/A" || phoneNumber.trim() === "") {
    alert("Phone number not available");
    return;
  }
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  window.location.href = `tel:${cleanPhone}`;
}

// WhatsApp Student Function
function whatsappStudent(phoneNumber) {
  if (!phoneNumber || phoneNumber === "N/A" || phoneNumber.trim() === "") {
    alert("Phone number not available");
    return;
  }
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  const whatsappURL = `https://wa.me/${cleanPhone}`;
  window.open(whatsappURL, "_blank");
}

// Load course students
async function loadCourseStudents(courseId, courseTitle) {
  const container = document.getElementById("studentDetails");
  container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #667eea;">Loading students for ${courseTitle}...</div>`;

  try {
    const response = await api.request(
      `/enrollments/course/${courseId}/enrollments`,
      "GET",
      null,
      true,
    );
    const enrollments = response.data || [];

    if (enrollments.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #999;">No students enrolled in this course yet</div>`;
      return;
    }

    let html = `
      <div style="margin-top: 2rem;">
        <h3 style="color: #333; margin-bottom: 1rem;">👥 Students in ${courseTitle}</h3>
        <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
    `;

    enrollments.forEach((enrollment) => {
      const student = enrollment.studentId;
      html += `
        <div style="background: white; border: 2px solid #ddd; border-radius: 12px; padding: 1.5rem;">
          <h4 style="margin: 0 0 0.75rem 0; color: #333;">${student.name || "Unknown"}</h4>
          <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">
            <p style="margin: 0.25rem 0;">📧 ${student.email || "N/A"}</p>
            <p style="margin: 0.25rem 0;">📱 ${student.mobileNumber || "N/A"}</p>
            <p style="margin: 0.25rem 0;">📊 Progress: ${enrollment.progressPercentage || 0}%</p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button onclick="callStudent('${student.mobileNumber || ""}')"
                    style="flex: 1; padding: 0.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              📞 Call
            </button>
            <button onclick="whatsappStudent('${student.mobileNumber || ""}')"
                    style="flex: 1; padding: 0.5rem; background: #25d366; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
              💬 Chat
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div style="color: red; padding: 2rem; text-align: center;">Error loading students: ${error.message}</div>`;
  }
}
