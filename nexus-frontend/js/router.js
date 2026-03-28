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

    this.routes["admin-student-approvals"] = {
      path: "#admin-student-approvals",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminStudentApprovals(),
    };

    this.routes["admin-payments"] = {
      path: "#admin-payments",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminPayments(),
    };

    this.routes["admin-teachers"] = {
      path: "#admin-teachers",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminTeachers(),
    };

    this.routes["admin-teacher-dues"] = {
      path: "#admin-teacher-dues",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminTeacherDues(),
    };

    this.routes["admin-teacher-details"] = {
      path: "#admin-teacher-details",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminTeacherDetails(),
    };

    this.routes["admin-details"] = {
      path: "#admin-details",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminDetails(),
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

    this.routes["settings"] = {
      path: "#settings",
      requiresAuth: true,
      render: () => this.renderSettings(),
    };

    this.routes["support"] = {
      path: "#support",
      requiresAuth: true,
      render: () => this.renderSupport(),
    };

    this.routes["documentations"] = {
      path: "#documentations",
      requiresAuth: true,
      render: () => this.renderDocumentations(),
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
      showInfoPopup(`Access denied. This page is for ${route.role}s only.`);
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
      window.location.hash = "#admin-dashboard";
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
    const coursesMenuItem = document.getElementById("coursesMenuItem");
    const yourCoursesMenuItem = document.getElementById("yourCoursesMenuItem");
    const myEnrollmentsMenuItem = document.getElementById(
      "myEnrollmentsMenuItem",
    );
    const myCoursesMenuItem = document.getElementById("myCoursesMenuItem");
    const studentsMenuItem = document.getElementById("studentsMenuItem");
    const adminMenuItem = document.getElementById("adminMenuItem");
    const supportMenuItem = document.getElementById("supportMenuItem");
    const documentationsMenuItem = document.getElementById(
      "documentationsMenuItem",
    );
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");

    if (auth.isAuthenticated()) {
      loginLink.style.display = "none";
      settingsLink.style.display = "inline-block";
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
      supportMenuItem.style.display = "none";
      documentationsMenuItem.style.display = "none";

      // Show menu items based on role
      if (user.role === "student") {
        coursesMenuItem.style.display = "inline";
        yourCoursesMenuItem.style.display = "inline";
        myEnrollmentsMenuItem.style.display = "inline";
        supportMenuItem.style.display = "inline";
        documentationsMenuItem.style.display = "inline";
      } else if (user.role === "teacher") {
        myCoursesMenuItem.style.display = "inline";
        studentsMenuItem.style.display = "inline";
        supportMenuItem.style.display = "inline";
        documentationsMenuItem.style.display = "inline";
      } else if (user.role === "admin") {
        coursesMenuItem.style.display = "inline";
        adminMenuItem.style.display = "inline";
        documentationsMenuItem.style.display = "inline";
      }
    } else {
      loginLink.style.display = "inline";
      settingsLink.style.display = "none";
      userInfo.style.display = "none";

      // Hide all dynamic menu items for non-authenticated users
      coursesMenuItem.style.display = "none";
      yourCoursesMenuItem.style.display = "none";
      myEnrollmentsMenuItem.style.display = "none";
      myCoursesMenuItem.style.display = "none";
      studentsMenuItem.style.display = "none";
      adminMenuItem.style.display = "none";
      if (supportMenuItem) supportMenuItem.style.display = "none";
      if (documentationsMenuItem) documentationsMenuItem.style.display = "none";
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
          <p>Learn Directly from Industry Experts</p>
          <p class="subtitle">Experience a premium one-to-one platform where real-world job professionals will directly mentor and teach you.</p>
          <div class="button-group">
            <a href="#courses" class="btn btn-primary">Explore Courses</a>
            ${!auth.isAuthenticated() ? `<a href="#register" class="btn btn-secondary">Get Started</a>` : ""}
          </div>
        </div>

        <div class="features-section">
          <div class="feature">
            <h3>🤝 1-on-1 Mentorship</h3>
            <p>Get personalized attention and learn directly from real-world working professionals.</p>
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

        // Display field-specific errors - show only the most important ones
        if (result.errors) {
          // Prioritize password errors
          if (result.errors.password) {
            messageDiv.textContent = `• ${result.errors.password}`;
          } else {
            // Show only the first error for other fields
            const firstError = Object.entries(result.errors)[0];
            if (firstError) {
              messageDiv.textContent = `• ${firstError[1]}`;
            }
          }
          messageDiv.style.whiteSpace = "normal";
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
                      Instructor: ${teacher.name || "Unknown Teacher"}
                    </p>
                    <p style="margin: 0.25rem 0; color: #666; font-size: 0.85rem;">
                      Company: ${teacher.company || "N/A"}
                    </p>
                    <p style="margin: 0.25rem 0; color: #666; font-size: 0.85rem;">
                      Role: ${teacher.profession || teacher.role || "Instructor"}
                    </p>
                    ${
                      teacher.mobileNumber
                        ? `<p style="margin: 0.25rem 0; color: #666; font-size: 0.85rem;">📞 Contact: ${teacher.mobileNumber}</p>
                    <a href="https://wa.me/${teacher.mobileNumber.replace(/[^\d+]/g, "")}" target="_blank" style="display: inline-block; margin-top: 5px; color: #25d366; font-weight: bold; text-decoration: none;">💬 WhatsApp</a>`
                        : ""
                    }
                    <div style="margin-top: 0.5rem; display: flex; gap: 0.75rem;">
                      ${teacher.linkedinUrl ? `<a href="${teacher.linkedinUrl}" target="_blank" style="color: #0077b5; text-decoration: none; font-size: 0.85rem; font-weight: bold;">🔗 LinkedIn</a>` : ""}
                      ${teacher.githubUrl ? `<a href="${teacher.githubUrl}" target="_blank" style="color: #333; text-decoration: none; font-size: 0.85rem; font-weight: bold;">🐙 GitHub</a>` : ""}
                    </div>
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
            <div class="form-group">
              <label for="linkedinUrl">LinkedIn URL:</label>
              <input type="url" id="linkedinUrl" name="linkedinUrl" value="${user.linkedinUrl || ""}" placeholder="https://linkedin.com/in/yourprofile">
            </div>
            <div class="form-group">
              <label for="githubUrl">GitHub URL:</label>
              <input type="url" id="githubUrl" name="githubUrl" value="${user.githubUrl || ""}" placeholder="https://github.com/yourprofile">
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
        const linkedinUrl = document.getElementById("linkedinUrl").value;
        const githubUrl = document.getElementById("githubUrl").value;
        const result = await auth.updateProfile({
          name,
          linkedinUrl,
          githubUrl,
        });
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
      <div class="admin-hub">
        <div class="admin-hub-header">
          <div>
            <p class="admin-kicker">Control Center</p>
            <h2>Platform Administration</h2>
            <p class="admin-subtitle">Manage approvals, payments, and operations from one place.</p>
          </div>
          <div class="admin-user-chip">
            <span>Signed in as</span>
            <strong>${user?.email || "admin"}</strong>
          </div>
        </div>

        <div class="dashboard-grid admin-hub-grid">
          <div class="dashboard-card admin-card">
            <h3>📚 Course Approvals</h3>
            <p>Review newly created teacher courses and publish quality content quickly.</p>
            <a href="#admin-approve-courses" class="btn btn-primary">Open Queue</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>🧑‍🎓 Student Approvals</h3>
            <p>Review student registration requests and move approved learners to payment.</p>
            <a href="#admin-student-approvals" class="btn btn-primary">Review Requests</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>💰 Payment Operations</h3>
            <p>Validate student transactions and complete approvals without leaving this dashboard.</p>
            <a href="#admin-payments" class="btn btn-primary">Manage Payments</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>👨‍🏫 Teachers View</h3>
            <p>Monitor teacher-side enrollment visibility and student activation status.</p>
            <a href="#admin-teachers" class="btn btn-secondary">Inspect</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>💸 Dues to Teacher</h3>
            <p>Settle the pending payments to teachers after taking the commission.</p>
            <a href="#admin-teacher-dues" class="btn btn-primary">Settle Dues</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>👥 User Details</h3>
            <p>View all registered students and teachers contact information.</p>
            <a href="#admin-details" class="btn btn-secondary">View Details</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>⚙️ Account Settings</h3>
            <p>Centralized profile, account security options, and logout under one settings page.</p>
            <a href="#settings" class="btn btn-secondary">Go to Settings</a>
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
    const shouldReject = await showConfirmPopup(
      "Are you sure you want to reject this course?",
      "Reject Course",
    );

    if (!shouldReject) {
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

  async renderAdminStudentApprovals() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML =
      "<div class='loading'>Loading student approvals...</div>";

    try {
      const response = await api.getPendingEnrollments(1, 100);
      const pendingEnrollments = response.data || [];

      let approvalsHtml = `
        <div class="admin-approve-courses-page">
          <div class="page-header">
            <h2>🧑‍🎓 Student Approvals</h2>
            <p>Approve student registrations and request payment from eligible learners.</p>
          </div>
      `;

      if (pendingEnrollments.length === 0) {
        approvalsHtml += `
          <div class="no-data-message">
            <p>✅ No pending student approvals right now.</p>
          </div>`;
      } else {
        approvalsHtml += '<div class="courses-approval-list">';

        for (const enrollment of pendingEnrollments) {
          const student = enrollment.studentId || {};
          const course = enrollment.courseId || {};
          const teacher = course.teacherId || {};

          approvalsHtml += `
            <div class="course-approval-card">
              <div class="course-approval-header">
                <h3>${course.title || "Untitled Course"}</h3>
                <span class="status-badge draft">Awaiting Admin Decision</span>
              </div>
              <div class="course-approval-details">
                <p><strong>Student:</strong> ${student.name || "Unknown"}</p>
                <p><strong>Email:</strong> ${student.email || "N/A"}</p>
                <p><strong>Mobile:</strong> ${student.mobileNumber || "N/A"}</p>
                <p><strong>Teacher:</strong> ${teacher.name || "Unknown"}</p>
                <p><strong>Teacher Company:</strong> ${teacher.company || "N/A"}</p>
                <p><strong>Teacher Role:</strong> ${teacher.profession || teacher.role || "Instructor"}</p>
                <p><strong>Course Price:</strong> ₹${course.price || 0}</p>
                <p><strong>Requested On:</strong> ${new Date(enrollment.createdAt || enrollment.enrolledAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <div class="course-approval-actions">
                <button class="btn btn-success enrollment-approve-btn" data-enrollment-id="${enrollment._id}">✓ Approve & Request Payment</button>
                <button class="btn btn-danger enrollment-reject-btn" data-enrollment-id="${enrollment._id}">✗ Reject Request</button>
              </div>
            </div>`;
        }

        approvalsHtml += "</div>";
      }

      approvalsHtml += `
        <div id="enrollmentApprovalMessage" class="message"></div>
      </div>`;

      appDiv.innerHTML = approvalsHtml;

      document.querySelectorAll(".enrollment-approve-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const enrollmentId = e.target.dataset.enrollmentId;
          await this.approveStudentEnrollment(enrollmentId);
        });
      });

      document.querySelectorAll(".enrollment-reject-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const enrollmentId = e.target.dataset.enrollmentId;
          await this.rejectStudentEnrollment(enrollmentId);
        });
      });
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading pending student approvals: ${error.message}</div>`;
    }

    this.updateNavbar();
  }

  async approveStudentEnrollment(enrollmentId) {
    const messageDiv = document.getElementById("enrollmentApprovalMessage");

    try {
      const response = await api.requestPayment(enrollmentId);
      if (response.success) {
        messageDiv.className = "message success";
        messageDiv.textContent =
          "Student approved successfully. Payment request sent to student.";
        setTimeout(() => {
          window.location.hash = "#admin-student-approvals";
        }, 1200);
      } else {
        messageDiv.className = "message error";
        messageDiv.textContent = response.message || "Approval failed";
      }
    } catch (error) {
      messageDiv.className = "message error";
      messageDiv.textContent = error.message;
    }
  }

  async rejectStudentEnrollment(enrollmentId) {
    const reason = await showPromptPopup(
      "Enter rejection reason for the student request:",
      "Reason is required",
      "Reject Student Request",
    );

    if (!reason || !reason.trim()) {
      showInfoPopup("Rejection cancelled. A reason is required.", "Notice");
      return;
    }

    const messageDiv = document.getElementById("enrollmentApprovalMessage");

    try {
      const response = await api.rejectEnrollment(enrollmentId, reason.trim());
      if (response.success) {
        messageDiv.className = "message success";
        messageDiv.textContent = "Student request rejected.";
        setTimeout(() => {
          window.location.hash = "#admin-student-approvals";
        }, 1200);
      } else {
        messageDiv.className = "message error";
        messageDiv.textContent = response.message || "Failed to reject";
      }
    } catch (error) {
      messageDiv.className = "message error";
      messageDiv.textContent = error.message;
    }
  }

  async renderAdminTeachers() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading teachers...</div>";

    try {
      const response = await api.getAllUsers("teacher", 1, 50);
      const teachers = response.data?.users || response.data || [];

      let html = `
        <div class="admin-teachers-page">
          <div class="page-header">
            <h2>👨‍🏫 Teachers Overview</h2>
            <p>View all teachers and their course statistics</p>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
      `;

      if (teachers.length === 0) {
        html += `<tr><td colspan="3">No teachers found.</td></tr>`;
      } else {
        teachers.forEach((t) => {
          html += `
            <tr>
              <td>${t.name}</td>
              <td>${t.email}</td>
              <td>
                <button class="btn btn-secondary btn-small" onclick="window.location.hash='#admin-teacher-details?id=${t._id}&name=${encodeURIComponent(t.name)}'">View Courses & Students</button>
              </td>
            </tr>
          `;
        });
      }

      html += `
              </tbody>
            </table>
          </div>
        </div>
      `;
      appDiv.innerHTML = html;
      this.updateNavbar();
    } catch (error) {
      appDiv.innerHTML = `<div class="error">Failed to load teachers: ${error.message}</div>`;
    }
  }

  async renderAdminTeacherDetails() {
    const appDiv = document.getElementById("app");
    const teacherId = this.queryParams?.id;
    const teacherName = this.queryParams?.name
      ? decodeURIComponent(this.queryParams.name)
      : "Teacher";

    if (!teacherId) {
      window.location.hash = "#admin-teachers";
      return;
    }

    appDiv.innerHTML = "<div class='loading'>Loading teacher data...</div>";

    try {
      const response = await api.getTeacherCoursesWithStudents(
        teacherId,
        1,
        50,
      );
      // Data format depends on the API response structure (usually response.data.courses according to service)
      const courses = response.data?.courses || response.data || [];

      let html = `
        <div class="admin-teacher-details-page">
          <div class="page-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2>📚 Courses by: \${teacherName}</h2>
              <p>Total published courses and registered active students</p>
            </div>
            <a href="#admin-teachers" class="btn btn-secondary">Back to Teachers</a>
          </div>
      `;

      if (courses.length === 0) {
        html += `<div class="no-data-message"><p>This teacher has not created any courses yet.</p></div>`;
      } else {
        html += `<div class="dashboard-grid">`;
        courses.forEach((c) => {
          const studentCount = c.activeStudentCount || 0;
          html += `
            <div class="dashboard-card">
              <h3>${c.title}</h3>
              <p><strong>Students Registered (Active):</strong> ${studentCount}</p>
              <p><strong>Category:</strong> ${c.category || "General"}</p>
              <p><strong>Price:</strong> ₹${c.price || 0}</p>
            </div>
          `;
        });
        html += `</div>`;
      }

      html += `</div>`;
      appDiv.innerHTML = html;
      this.updateNavbar();
    } catch (error) {
      appDiv.innerHTML = `<div class="error">Failed to load teacher details: ${error.message}</div>`;
    }
  }

  async renderAdminDetails() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading user details...</div>";

    try {
      const [studentsResponse, teachersResponse] = await Promise.all([
        api.getAllUsers("student", 1, 100),
        api.getAllUsers("teacher", 1, 100),
      ]);

      const students = studentsResponse.data || [];
      const teachers = teachersResponse.data || [];

      let html = `
        <div class="admin-details-page" style="padding: 2rem;">
          <div class="page-header" style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2>👥 User Details Directory</h2>
              <p>View contact information for all registered students and teachers.</p>
            </div>
            <a href="#admin-dashboard" class="btn btn-secondary">Back to Dashboard</a>
          </div>

          <!-- Tabs -->
          <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
            <button id="btn-tab-students" onclick="switchAdminDetailsTab('students')" class="btn" style="background: #2563eb; color: white;">Students (${students.length})</button>
            <button id="btn-tab-teachers" onclick="switchAdminDetailsTab('teachers')" class="btn btn-secondary">Teachers (${teachers.length})</button>
          </div>

          <!-- Students Content -->
          <div id="content-admin-students" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
            ${
              students.length > 0
                ? students
                    .map(
                      (s) => `
              <div onclick="this.querySelector('.contact-info').style.display = 'block'" 
                   style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.2s;"
                   onmouseover="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 4px 6px -1px rgba(59, 130, 246, 0.1)'"
                   onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <h3 style="margin: 0; color: #0f172a;">${s.name || "Unknown"}</h3>
                  <span style="font-size: 0.8rem; background: #dbf4ff; color: #1e3a8a; padding: 0.2rem 0.6rem; border-radius: 12px;">Student</span>
                </div>
                <p style="margin: 0.5rem 0 0 0; color: #64748b; font-size: 0.85rem;">Click to view details</p>
                <div class="contact-info" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0;">
                  <p style="margin: 0.25rem 0; color: #475569; font-size: 0.9rem;"><strong>Email:</strong> ${s.email || "N/A"}</p>
                  <p style="margin: 0.25rem 0; color: #475569; font-size: 0.9rem;"><strong>Mobile:</strong> ${s.mobileNumber || "N/A"}</p>
                </div>
              </div>
            `,
                    )
                    .join("")
                : '<p style="color: #64748b;">No students found.</p>'
            }
          </div>

          <!-- Teachers Content -->
          <div id="content-admin-teachers" style="display: none; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
            ${
              teachers.length > 0
                ? teachers
                    .map(
                      (t) => `
              <div onclick="this.querySelector('.contact-info').style.display = 'block'" 
                   style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.2s;"
                   onmouseover="this.style.borderColor='#10b981'; this.style.boxShadow='0 4px 6px -1px rgba(16, 185, 129, 0.1)'"
                   onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <h3 style="margin: 0; color: #0f172a;">${t.name || "Unknown"}</h3>
                  <span style="font-size: 0.8rem; background: #d1fae5; color: #065f46; padding: 0.2rem 0.6rem; border-radius: 12px;">Teacher</span>
                </div>
                <p style="margin: 0.5rem 0 0 0; color: #64748b; font-size: 0.85rem;">Click to view details</p>
                <div class="contact-info" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0;">
                  <p style="margin: 0.25rem 0; color: #475569; font-size: 0.9rem;"><strong>Email:</strong> ${t.email || "N/A"}</p>
                  <p style="margin: 0.25rem 0; color: #475569; font-size: 0.9rem;"><strong>Mobile:</strong> ${t.mobileNumber || "N/A"}</p>
                  <p style="margin: 0.25rem 0; color: #475569; font-size: 0.9rem;"><strong>Company:</strong> ${t.company || "N/A"}</p>
                  <p style="margin: 0.25rem 0; color: #475569; font-size: 0.9rem;"><strong>Role:</strong> ${t.profession || t.role || "Instructor"}</p>
                </div>
              </div>
            `,
                    )
                    .join("")
                : '<p style="color: #64748b;">No teachers found.</p>'
            }
          </div>

        </div>
      `;

      appDiv.innerHTML = html;
      this.updateNavbar();
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading user details: ${error.message}</div>`;
    }
  }

  async renderAdminPayments() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <div class="courses-page" style="padding: 2rem;">
        <div class="page-header" style="text-align: left; padding: 2rem 0; border-bottom: 2px solid var(--border-color); margin-bottom: 2rem;">
          <h1 style="font-size: 2.5rem; text-transform: uppercase; letter-spacing: 2px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Payment Approvals
          </h1>
          <p style="color: #cbd5e1; margin: 0 0 2rem 0; font-size: 1rem;">
            Review and process all student payments
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">⏳ Pending Review</h3>
              <p style="margin: 0; font-size: 2rem; font-weight: bold;" id="pending-count">0</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.8;">Awaiting confirmation</p>
            </div>
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">✅ Approved</h3>
              <p style="margin: 0; font-size: 2rem; font-weight: bold;" id="completed-count">0</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.8;">Successfully confirmed</p>
            </div>
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">💵 Total Revenue</h3>
              <p style="margin: 0; font-size: 2rem; font-weight: bold;" id="total-revenue">₹0</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.8;">Platform commission</p>
            </div>
          </div>

          <div id="paymentsList" style="display: grid; gap: 1.5rem;">
            <div style="text-align: center; padding: 3rem; color: #cbd5e1;">Loading payments...</div>
          </div>

          <div id="paymentMessage" class="message" style="margin-top: 2rem;"></div>
        </div>
      </div>
    `;

    // Load payment data
    try {
      const [response, statsResponse] = await Promise.all([
        api.getAdminPendingPayments(),
        api.getAdminDashboardStats(),
      ]);
      const payments = response.data || [];
      const stats = statsResponse.data || {};

      document.getElementById("pending-count").textContent =
        stats.pendingPayments || 0;
      document.getElementById("completed-count").textContent =
        stats.approvedPayments || 0;
      document.getElementById("total-revenue").textContent =
        `₹${stats.totalCommissionEarned || 0}`;

      // Load payments list
      const paymentsList = document.getElementById("paymentsList");
      if (payments.length === 0) {
        paymentsList.innerHTML = `
          <div style="text-align: center; padding: 3rem; color: #cbd5e1; background: rgba(102, 126, 234, 0.05); border-radius: 12px; border: 1px dashed var(--border-color);">
            <p style="font-size: 1.1rem; margin: 0;">✨ No pending payments</p>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #94a3b8;">All student payments have been processed!</p>
          </div>
        `;
      } else {
        paymentsList.innerHTML = payments
          .map((payment) => {
            const student = payment.studentId || {};
            const course = payment.courseId || {};
            const teacher = payment.teacherId || {};
            const isSubmitted = payment.status === "transaction_submitted";
            const isApproved = payment.status === "approved";

            return `
              <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                          border: 2px solid rgba(102, 126, 234, 0.1);
                          border-left: 4px solid ${isApproved ? "#10b981" : isSubmitted ? "#f59e0b" : "#667eea"};
                          border-radius: 12px; padding: 1.5rem; transition: all 0.3s;"
                   onmouseover="this.style.borderColor='rgba(102, 126, 234, 0.3)'; this.style.boxShadow='0 8px 20px rgba(102, 126, 234, 0.15)'"
                   onmouseout="this.style.borderColor='rgba(102, 126, 234, 0.1)'; this.style.boxShadow='none'">
                
                <div style="display: flex; flex-direction: column; gap: 2rem;">
                  
                  <!-- Left Section: Student & Course Details -->
                  <div>
                    <!-- Status Badge -->
                    <div style="display: inline-block; margin-bottom: 1rem; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
                                ${isApproved ? "background: rgba(16, 185, 129, 0.2); color: #a7f3d0;" : isSubmitted ? "background: rgba(245, 158, 11, 0.2); color: #fbbf24;" : "background: rgba(102, 126, 234, 0.2); color: #93c5fd;"}">
                      ${isApproved ? "✅ Approved" : isSubmitted ? "⏳ Payment Submitted" : "🔄 Processing"}
                    </div>

                    <!-- Student Info -->
                    <div style="margin-bottom: 1.5rem;">
                      <h3 style="margin: 0 0 0.5rem 0; color: #e2e8f0; font-size: 1.1rem;">
                        👤 Student: ${payment.studentName || student.name || "Unknown"}
                      </h3>
                      <div style="background: rgba(102, 126, 234, 0.1); padding: 0.75rem; border-radius: 6px; margin-top: 0.5rem;">
                        <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                          <strong>Email:</strong> ${student.email || "N/A"}
                        </p>
                        <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                          <strong>Phone:</strong> ${student.mobileNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    <!-- Course Info -->
                    <div style="margin-bottom: 1.5rem;">
                      <h4 style="margin: 0 0 0.5rem 0; color: #e2e8f0; font-size: 1rem;">
                        📚 Course: ${payment.courseName || course.title || "Unknown"}
                      </h4>
                      <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                        <strong>Duration:</strong> ${course.duration || "Self-paced"}
                      </p>
                    </div>

                    <!-- Teacher Info -->
                    <div>
                      <h4 style="margin: 0 0 0.5rem 0; color: #e2e8f0; font-size: 1rem;">
                        👨‍🏫 Instructor: ${payment.teacherName || teacher.name || "Unknown"}
                      </h4>
                      <div style="background: rgba(16, 185, 129, 0.1); padding: 0.75rem; border-radius: 6px;">
                        <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                          <strong>UPI ID:</strong> ${teacher.upiId || "Not specified by teacher"}
                        </p>
                        <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                          <strong>Phone:</strong> ${payment.teacherPhone || teacher.mobileNumber || "N/A"}
                        </p>
                        <p style="margin: 0.75rem 0 0 0; color: #10b981; font-size: 0.85rem; font-weight: 500;">
                          💸 Route platform payments to this teacher's UPI.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Right Section: Payment Details & Actions -->
                  <div style="display: flex; flex-direction: column;">
                    <!-- Payment Amount Box -->
                    <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
                                padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; text-align: center;">
                      <p style="margin: 0; color: #cbd5e1; font-size: 0.9rem; opacity: 0.8;">Amount Paid</p>
                      <p style="margin: 0.5rem 0 0 0; color: #e2e8f0; font-size: 2rem; font-weight: bold;">
                        ₹${payment.amountSent || payment.amount || 0}
                      </p>
                      <p style="margin: 0.5rem 0 0 0; color: #cbd5e1; font-size: 0.8rem;">
                        Original: ₹${payment.amount || 0}
                      </p>
                    </div>

                    <!-- Transaction Details -->
                    <div style="background: rgba(102, 126, 234, 0.05); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #667eea;">
                      <p style="margin: 0 0 0.5rem 0; color: #cbd5e1; font-size: 0.85rem;">
                        <strong>UTR/Transaction ID:</strong>
                      </p>
                      <p style="margin: 0; color: #e2e8f0; font-family: monospace; font-size: 0.9rem; word-break: break-all;">
                        ${payment.utrNumber || payment.transactionId || "N/A"}
                      </p>
                    </div>

                    <!-- Date Info -->
                    <div style="background: rgba(102, 126, 234, 0.05); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #667eea; font-size: 0.85rem;">
                      <p style="margin: 0.25rem 0; color: #cbd5e1;">
                        <strong>Submitted:</strong> ${new Date(
                          payment.transactionSubmittedAt || payment.createdAt,
                        ).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 0.75rem; margin-top: auto;">
                      ${
                        isSubmitted
                          ? `
                        <button onclick="approvePaymentInRouter('${payment._id}')"
                                style="flex: 1; padding: 0.75rem; background: #10b981; color: white; 
                                        border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                                        transition: all 0.3s; font-size: 0.9rem;"
                                onmouseover="this.style.background='#059669'; this.style.transform='translateY(-2px)'"
                                onmouseout="this.style.background='#10b981'; this.style.transform='translateY(0)'">
                          ✅ Accept Course Payment
                        </button>
                        <button onclick="rejectPaymentInRouter('${payment._id}')"
                                style="flex: 1; padding: 0.75rem; background: #ef4444; color: white; 
                                        border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                                        transition: all 0.3s; font-size: 0.9rem;"
                                onmouseover="this.style.background='#dc2626'; this.style.transform='translateY(-2px)'"
                                onmouseout="this.style.background='#ef4444'; this.style.transform='translateY(0)'">
                          ❌ Reject
                        </button>
                      `
                          : isApproved
                            ? `
                        <button onclick="showInfoPopup('Payment already approved'); return false;"
                                style="flex: 1; padding: 0.75rem; background: #94a3b8; color: white; 
                                        border: none; border-radius: 6px; font-weight: 600; cursor: not-allowed; font-size: 0.9rem;">
                          ✓ Approved
                        </button>
                      `
                            : ""
                      }
                    </div>
                  </div>

                </div>
              </div>
            `;
          })
          .join("");
      }
    } catch (error) {
      console.log("Payment data not yet configured:", error.message);
      document.getElementById("paymentsList").innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #cbd5e1;">
          <p style="font-size: 1.1rem; margin: 0;">No pending payment confirmations</p>
        </div>
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
        showInfoPopup("Maximum 10 highlights allowed", "Limit Reached");
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
            let infoMessage = "";
            if (status === "awaiting_admin_approval") {
              statusBadge =
                '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">⏳ Awaiting Admin Approval</span>';
            } else if (status === "payment_requested") {
              statusBadge =
                '<span style="background: #e0f2fe; color: #075985; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">💳 Pay Now</span>';
            } else if (
              status === "payment_submitted" ||
              status === "transaction_submitted"
            ) {
              statusBadge =
                '<span style="background: #ede9fe; color: #5b21b6; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">🧾 Payment Submitted</span>';
              infoMessage =
                '<div style="margin-top: 10px; font-size: 0.85rem; color: #5b21b6; background: #ede9fe; padding: 8px; border-radius: 4px;">Thank you! Following the payment submission, the admin or Nexus Platform will reach out to you within 24 hours.</div>';
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
                  ${infoMessage}

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
                        <button onclick="${canAccessTeacher ? `openWhatsApp('${teacher.mobileNumber || ""}', '${course.title || ""}')` : `showInfoPopup('Teacher contact is available after activation')`}"
                          style="flex: 1; padding: 0.75rem; background: ${canAccessTeacher ? "#25d366" : "#ccc"}; color: white; 
                                    border: none; border-radius: 6px; font-weight: 600; cursor: ${status === "active" ? "pointer" : "not-allowed"};
                                    transition: background 0.3s;"
                          onmouseover="${canAccessTeacher ? "this.style.background='#20ba5a'" : ""}"
                          onmouseout="${canAccessTeacher ? "this.style.background='#25d366'" : ""}"
                          ${!canAccessTeacher ? "disabled" : ""}>
                      💬 WhatsApp
                    </button>
                            <button onclick="${canAccessTeacher ? `router.navigate('#course-detail/${course._id || enrollment.courseId}')` : showPayNow ? `submitPaymentPrompt('${enrollment.paymentId || enrollment._id}', '${course.title || "Course"}', '${amount}')` : showWaitingPaymentConfirm ? `showInfoPopup('Your payment is submitted. Please wait for admin confirmation.')` : `showInfoPopup('Please wait for admin approval')`}"
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

      // Separate approved and pending courses
      const approvedEnrollments = allEnrollments.filter(
        (e) => e.status === "active",
      );
      const pendingEnrollments = allEnrollments.filter(
        (e) =>
          e.status === "payment_submitted" ||
          e.status === "awaiting_admin_approval",
      );

      let html = `
        <div class="your-courses-page">
          <div style="padding: 0 2rem;">
            <h1 style="margin: 2rem 0 0.5rem 0; font-size: 2.5rem; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              Your Courses Dashboard
            </h1>
            <p style="color: #cbd5e1; margin: 0 0 2rem 0; font-size: 1.1rem;">
              Manage your enrolled courses and track their status
            </p>
          </div>
      `;

      // ===== APPROVED COURSES SECTION =====
      html += `
        <div style="padding: 0 2rem;">
          <div class="courses-section-header approved">
            ✅ Active Courses (${approvedEnrollments.length})
          </div>
      `;

      if (approvedEnrollments.length > 0) {
        html += `<div class="courses-list" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); margin-bottom: 3rem;">`;

        html += approvedEnrollments
          .map((enrollment) => {
            const course = enrollment.courseId || {};
            const teacher = course.teacherId || {};

            return `
              <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                          border: 2px solid rgba(16, 185, 129, 0.2);
                          border-left: 4px solid #10b981;
                          border-radius: 12px; padding: 1.5rem; cursor: pointer; 
                          transition: all 0.3s; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);"
                   onmouseover="this.style.borderColor='#10b981'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.2)'"
                   onmouseout="this.style.borderColor='rgba(16, 185, 129, 0.2)'; this.style.boxShadow='0 4px 15px rgba(16, 185, 129, 0.1)'">
                
                <!-- Status Badge -->
                <div style="display: inline-block; background: rgba(16, 185, 129, 0.2); 
                            color: #a7f3d0; padding: 0.4rem 0.8rem; border-radius: 20px; 
                            font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem;">
                  ✓ Active & Approved
                </div>

                <!-- Course Title -->
                <h3 style="margin: 0 0 0.5rem 0; color: #e2e8f0; font-size: 1.1rem;">
                  ${course.title || "Unknown Course"}
                </h3>

                <!-- Teacher Information Box -->
                <div style="background: rgba(102, 126, 234, 0.1); border-left: 4px solid #667eea; 
                            padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                  <h4 style="margin: 0 0 0.5rem 0; color: #667eea; font-size: 0.9rem;">
                    👨‍🏫 Your Instructor
                  </h4>
                  <p style="margin: 0.25rem 0; color: #e2e8f0; font-weight: 600;">
                    ${teacher.name || "Unknown Teacher"}
                  </p>
                  <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                    🏢 ${teacher.company || "N/A"}
                  </p>
                  <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                    💼 ${teacher.profession || teacher.role || "Expert Instructor"}
                  </p>
                  <p style="margin: 0.5rem 0 0 0; color: #10b981; font-size: 0.9rem; font-weight: 500;">
                    📱 Contact ready for learning support
                  </p>
                </div>

                <!-- Course Details Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; 
                            padding: 1rem; background: rgba(102, 126, 234, 0.05); border-radius: 8px;">
                  <div>
                    <span style="color: #cbd5e1; font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">
                      💵 Fee Amount
                    </span>
                    <p style="margin: 0.25rem 0 0 0; color: #e2e8f0; font-size: 1.1rem; font-weight: bold;">
                      ₹${course.price || 0}
                    </p>
                  </div>
                  <div>
                    <span style="color: #cbd5e1; font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">
                      📚 Duration
                    </span>
                    <p style="margin: 0.25rem 0 0 0; color: #e2e8f0; font-size: 1.1rem; font-weight: bold;">
                      ${course.duration || "Self-paced"}
                    </p>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div style="margin-bottom: 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.9rem; color: #cbd5e1;">Learning Progress</span>
                    <span style="font-weight: 600; color: #10b981;">${enrollment.progress || 0}%</span>
                  </div>
                  <div style="width: 100%; height: 8px; background: rgba(102, 126, 234, 0.2); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${enrollment.progress || 0}%; height: 100%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 4px; transition: width 0.3s;"></div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                  <button onclick="openWhatsApp('${teacher.mobileNumber || ""}', '${course.title || ""}')"
                          style="flex: 1; padding: 0.75rem; background: #25d366; color: white; 
                                  border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                                  transition: all 0.3s; font-size: 0.9rem;"
                          onmouseover="this.style.background='#20ba5a'; this.style.transform='translateY(-2px)'"
                          onmouseout="this.style.background='#25d366'; this.style.transform='translateY(0)'">
                    💬 Contact Teacher
                  </button>
                  <button onclick="router.navigate('#course-detail/${enrollment.courseId}')"
                          style="flex: 1; padding: 0.75rem; background: #667eea; color: white; 
                                  border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                                  transition: all 0.3s; font-size: 0.9rem;"
                          onmouseover="this.style.background='#5568d3'; this.style.transform='translateY(-2px)'"
                          onmouseout="this.style.background='#667eea'; this.style.transform='translateY(0)'">
                    📖 View Course
                  </button>
                </div>
              </div>
            `;
          })
          .join("");

        html += `</div>`;
      } else {
        html += `
          <div class="empty-section">
            🎓 No active courses yet. Complete your payment to get started!
          </div>
        `;
      }

      html += `</div>`; // Close approved section

      // ===== PENDING/PAYMENT AWAITING COURSES SECTION =====
      html += `
        <div style="padding: 0 2rem;">
          <div class="courses-section-header pending">
            ⏳ Pending Approval (${pendingEnrollments.length})
          </div>
      `;

      if (pendingEnrollments.length > 0) {
        html += `<div class="courses-list" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); margin-bottom: 2rem;">`;

        html += pendingEnrollments
          .map((enrollment) => {
            const course = enrollment.courseId || {};
            const teacher = course.teacherId || {};
            const statusText =
              enrollment.status === "payment_submitted"
                ? "Waiting for Admin Review"
                : "Awaiting Admin Approval";

            return `
              <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                          border: 2px solid rgba(245, 158, 11, 0.2);
                          border-left: 4px solid #f59e0b;
                          border-radius: 12px; padding: 1.5rem; cursor: pointer; 
                          transition: all 0.3s; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);"
                   onmouseover="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 8px 25px rgba(245, 158, 11, 0.2)'"
                   onmouseout="this.style.borderColor='rgba(245, 158, 11, 0.2)'; this.style.boxShadow='0 4px 15px rgba(245, 158, 11, 0.1)'">
                
                <!-- Status Badge -->
                <div style="display: inline-block; background: rgba(245, 158, 11, 0.2); 
                            color: #fbbf24; padding: 0.4rem 0.8rem; border-radius: 20px; 
                            font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem;">
                  ⏳ ${statusText}
                </div>

                <!-- Course Title -->
                <h3 style="margin: 0 0 0.5rem 0; color: #e2e8f0; font-size: 1.1rem;">
                  ${course.title || "Unknown Course"}
                </h3>

                <!-- Teacher Information Box -->
                <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; 
                            padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                  <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 0.9rem;">
                    👨‍🏫 Instructor: ${teacher.name || "Unknown"}
                  </h4>
                  <p style="margin: 0.25rem 0; color: #cbd5e1; font-size: 0.9rem;">
                    💼 ${teacher.profession || teacher.role || "Expert"}
                  </p>
                </div>

                <!-- Course Details -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; 
                            padding: 1rem; background: rgba(102, 126, 234, 0.05); border-radius: 8px;">
                  <div>
                    <span style="color: #cbd5e1; font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">
                      💵 Course Fee
                    </span>
                    <p style="margin: 0.25rem 0 0 0; color: #e2e8f0; font-size: 1.1rem; font-weight: bold;">
                      ₹${course.price || 0}
                    </p>
                  </div>
                  <div>
                    <span style="color: #cbd5e1; font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">
                      📅 Submitted
                    </span>
                    <p style="margin: 0.25rem 0 0 0; color: #e2e8f0; font-size: 0.95rem;">
                      ${new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <!-- Information Box -->
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
                            padding: 1rem; border-radius: 8px; margin-bottom: 1rem; color: #fca5a5; font-size: 0.9rem;">
                  <p style="margin: 0; line-height: 1.5;">
                    Your payment is under review by the admin. You'll receive confirmation shortly. 
                    Once approved, you can access the course immediately.
                  </p>
                </div>

                <!-- Action Button -->
                <button onclick="router.navigate('#my-enrollments')"
                        style="width: 100%; padding: 0.75rem; background: #667eea; color: white; 
                                border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                                transition: all 0.3s; font-size: 0.9rem;"
                        onmouseover="this.style.background='#5568d3'; this.style.transform='translateY(-2px)'"
                        onmouseout="this.style.background='#667eea'; this.style.transform='translateY(0)'">
                  📋 View Details
                </button>
              </div>
            `;
          })
          .join("");

        html += `</div>`;
      } else {
        html += `
          <div class="empty-section">
            ✨ No pending courses. All your registrations are approved!
          </div>
        `;
      }

      html += `</div>`; // Close pending section
      html += `</div>`; // Close main container

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

  renderSupport() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser() || {};

    appDiv.innerHTML = `
      <div class="dashboard-header">
        <h1>📞 Customer Support</h1>
      </div>
      <div class="content-card" style="max-width: 600px; margin: 0 auto; padding: 2rem;">
        <h2 style="margin-top: 0;">Get in Touch</h2>
        <p style="color: #666; margin-bottom: 2rem;">Experiencing an issue? Please fill out the form below and we will get back to you shortly.</p>
        
        <form onsubmit="submitSupportForm(event)" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="form-group">
            <label for="supName">Name / UserId</label>
            <input type="text" id="supName" value="${user.name || user._id || ""}" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          
          <div class="form-group">
            <label for="supEmail">Email Address</label>
            <input type="email" id="supEmail" value="${user.email || ""}" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          
          <div class="form-group">
            <label for="supMobile">Mobile Number</label>
            <input type="tel" id="supMobile" value="${user.mobileNumber || ""}" required style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          
          <div class="form-group">
            <label for="supIssue">Issue you are facing</label>
            <textarea id="supIssue" rows="5" required placeholder="Describe your problem in detail..." style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; resize: vertical;"></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary" style="padding: 1rem; margin-top: 1rem;">
            Send to Support (neelamchaithanya9@gmail.com)
          </button>
        </form>
      </div>
    `;
    this.updateNavbar();
  }

  renderSettings() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser() || {};

    appDiv.innerHTML = `
      <div class="settings-page">
        <div class="settings-hero">
          <p class="admin-kicker">Account Center</p>
          <h2>Settings</h2>
          <p>Profile details, account controls, and secure logout in one place.</p>
        </div>

        <div class="settings-grid">
          <section class="settings-card">
            <h3>👤 Profile</h3>
            <div class="settings-list">
              <div><span>Full Name</span><strong>${user.name || "Not specified"}</strong></div>
              <div><span>Email</span><strong>${user.email || "Not specified"}</strong></div>
              <div><span>Mobile Number</span><strong>${user.mobileNumber || "Not specified"}</strong></div>
              <div><span>Role</span><strong>${user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown"}</strong></div>
              <div><span>Profession</span><strong>${user.profession || "Not specified"}</strong></div>
              <div><span>Company</span><strong>${user.company || "Not specified"}</strong></div>
            </div>
            <button class="btn btn-secondary" onclick="router.navigate('#profile')">Edit Profile</button>
          </section>

          <section class="settings-card settings-security-card">
            <h3>🔐 Security</h3>
            <p class="settings-muted">Keep your account protected and end sessions securely.</p>
            <button class="btn btn-secondary" onclick="showPasswordComingSoon()">Change Password</button>
            <button class="btn btn-danger settings-logout-btn" onclick="confirmLogoutFromSettings()">Logout</button>
          </section>
        </div>
      </div>
    `;

    this.updateNavbar();
  }

  renderDocumentations() {
    const appDiv = document.getElementById("app");

    // Array of objects as requested
    const docs = [
      {
        title: "HTML",
        link: "https://nexus-upskill-html-course.vercel.app/",
      },
    ];

    let html = `
      <div class="dashboard-header">
        <h1>📚 Documentations</h1>
        <p>Access course documentation and study materials.</p>
      </div>
      <div style="padding: 2rem;">
        <div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
    `;

    docs.forEach((doc) => {
      html += `
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <h3 style="margin-top: 0; margin-bottom: 1rem; color: #0f172a;">${doc.title} Documentation</h3>
            <p style="color: #64748b; margin-bottom: 1.5rem;">Access the comprehensive guide and learning materials for ${doc.title}.</p>
            <a href="${doc.link}" target="_blank" style="display: inline-block; background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600;">View Documentation ↗</a>
          </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    appDiv.innerHTML = html;
    this.updateNavbar();
  }

  async renderAdminTeacherDues() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading teacher dues...</div>";

    try {
      const response = await api.getAdminTeacherDues();
      const dues = response.data || [];

      let html = `
        <div class="admin-approve-courses-page">
          <div class="page-header">
            <h2>💸 Dues to Teacher</h2>
            <p>Settle pending payments to teachers after taking platform commission.</p>
          </div>
      `;

      if (dues.length === 0) {
        html += `
          <div class="no-data-message" style="margin: 2rem;">
            <p>✅ All teachers are fully paid. No pending dues.</p>
          </div>
        `;
      } else {
        html += `<div class="courses-list" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); padding: 0 2rem; margin-bottom: 2rem;">`;

        dues.forEach((due) => {
          const teacher = due.teacherId || {};
          const student = due.studentId || {};
          const course = due.courseId || {};

          html += `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); position: relative;">
              <div style="position: absolute; top: 1rem; right: 1rem;">
                <span style="background: #fef08a; color: #b45309; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">Awaiting Settlement</span>
              </div>
              
              <h3 style="margin: 0 0 1rem 0; color: #0f172a; padding-right: 6rem;">👨‍🏫 Teacher: ${teacher.name || "Unknown"}</h3>
              
              <div style="background: #f8fafc; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;"><strong>Bank/UPI:</strong> ${teacher.upiId || "Not provided"}</p>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;"><strong>Mobile:</strong> ${teacher.mobileNumber || "Not provided"}</p>
              </div>

              <div style="margin-bottom: 1rem;">
                <p style="margin: 0.25rem 0; font-size: 0.9rem; color: #475569;"><strong>Course:</strong> ${course.title || "Unknown"}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem; color: #475569;"><strong>Student:</strong> ${student.name || "Unknown"}</p>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; border-top: 1px solid #e2e8f0; padding-top: 1rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">Total Amount Paid</span>
                  <span style="font-weight: 600;">₹${due.amount || 0}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #ef4444;">Platform Commission</span>
                  <span style="font-weight: 600; color: #ef4444;">- ₹${due.adminCommission || 0}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #e2e8f0;">
                  <span style="color: #0f172a; font-weight: 700;">Due to Teacher</span>
                  <span style="font-weight: 700; color: #10b981;">₹${due.teacherPayment || 0}</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem; background: #fffbeb; padding: 0.75rem; border-radius: 8px; border: 1px solid #fde68a;">
                <input type="checkbox" id="settle-${due._id}" style="width: 20px; height: 20px; cursor: pointer;">
                <label for="settle-${due._id}" style="font-size: 0.9rem; color: #92400e; cursor: pointer;">
                  I confirm I have transferred <strong>₹${due.teacherPayment || 0}</strong> to <strong>${teacher.name || "the teacher"}</strong> after taking my commission.
                </label>
              </div>

              <button onclick="settleSpecificTeacherDue('${due._id}')" 
                      style="width: 100%; margin-top: 1rem; padding: 0.75rem; background: #10b981; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                Mark as Paid
              </button>
            </div>
          `;
        });

        html += `</div>`;
      }

      html += `</div>`;
      appDiv.innerHTML = html;
    } catch (error) {
      appDiv.innerHTML = `<div class="error-message">Error loading dues: ${error.message}</div>`;
    }
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

function ensurePopupHost() {
  let host = document.getElementById("customPopupHost");
  if (!host) {
    host = document.createElement("div");
    host.id = "customPopupHost";
    host.style.position = "fixed";
    host.style.inset = "0";
    host.style.zIndex = "12000";
    host.style.pointerEvents = "none";
    document.body.appendChild(host);
  }
  return host;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showDialogPopup(options) {
  const {
    title = "Notice",
    message = "",
    variant = "info",
    withCancel = false,
    confirmText = "OK",
    cancelText = "Cancel",
    withInput = false,
    defaultValue = "",
    placeholder = "",
  } = options || {};

  const colors = {
    info: "#2563eb",
    danger: "#dc2626",
    success: "#059669",
    warning: "#d97706",
  };

  const accent = colors[variant] || colors.info;
  const host = ensurePopupHost();
  const popupId = `popup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.id = popupId;
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "rgba(15, 23, 42, 0.6)";
    overlay.style.backdropFilter = "blur(2px)";
    overlay.style.pointerEvents = "auto";
    overlay.innerHTML = `
      <div style="width:min(92vw, 440px); background:#ffffff; color:#0f172a; border-radius:14px;
                  border:1px solid #dbeafe; box-shadow:0 18px 50px rgba(15,23,42,0.35); overflow:hidden;">
        <div style="padding:1rem 1.25rem; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; gap:0.6rem;">
          <span style="width:0.7rem; height:0.7rem; border-radius:999px; background:${accent}; display:inline-block;"></span>
          <strong style="font-size:1rem;">${escapeHtml(title)}</strong>
        </div>
        <div style="padding:1rem 1.25rem 0.75rem; font-size:0.95rem; line-height:1.5; color:#1f2937; white-space:pre-line;">
          ${escapeHtml(message)}
        </div>
        ${
          withInput
            ? `<div style="padding:0.5rem 1.25rem 0.75rem;"><input id="${popupId}-input" type="text" value="${escapeHtml(defaultValue)}" placeholder="${escapeHtml(placeholder)}" style="width:100%; border:1px solid #cbd5e1; border-radius:8px; padding:0.65rem 0.75rem; font-size:0.95rem; color:#0f172a; background:#ffffff;"></div>`
            : ""
        }
        <div style="display:flex; justify-content:flex-end; gap:0.65rem; padding:0.85rem 1.25rem 1.1rem;">
          ${
            withCancel
              ? `<button id="${popupId}-cancel" style="border:1px solid #cbd5e1; background:#ffffff; color:#0f172a; border-radius:8px; padding:0.52rem 0.9rem; font-weight:600; cursor:pointer;">${escapeHtml(cancelText)}</button>`
              : ""
          }
          <button id="${popupId}-confirm" style="border:none; background:${accent}; color:#ffffff; border-radius:8px; padding:0.52rem 0.9rem; font-weight:600; cursor:pointer;">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    const cleanup = (value) => {
      overlay.remove();
      resolve(value);
    };

    host.appendChild(overlay);

    const confirmBtn = document.getElementById(`${popupId}-confirm`);
    const cancelBtn = document.getElementById(`${popupId}-cancel`);
    const inputEl = document.getElementById(`${popupId}-input`);

    confirmBtn.addEventListener("click", () => {
      cleanup(withInput ? inputEl.value : true);
    });

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () =>
        cleanup(withInput ? null : false),
      );
    }

    if (!withCancel && !withInput) {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          cleanup(true);
        }
      });
    }

    if (inputEl) {
      inputEl.focus();
      inputEl.select();
      inputEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          cleanup(inputEl.value);
        }
      });
    }
  });
}

function showInfoPopup(message, title = "Notice") {
  return showDialogPopup({
    title,
    message,
    variant: "info",
    confirmText: "OK",
  });
}

function showConfirmPopup(message, title = "Confirm") {
  return showDialogPopup({
    title,
    message,
    variant: "warning",
    withCancel: true,
    confirmText: "Yes",
    cancelText: "No",
  });
}

function showPromptPopup(message, defaultValue = "", title = "Input Required") {
  return showDialogPopup({
    title,
    message,
    variant: "warning",
    withCancel: true,
    withInput: true,
    defaultValue,
    confirmText: "Submit",
    cancelText: "Cancel",
    placeholder: "Type here",
  });
}

function showPasswordComingSoon() {
  showInfoPopup("Password change feature is coming soon.", "Coming Soon");
}

async function confirmLogoutFromSettings() {
  const shouldLogout = await showConfirmPopup(
    "Are you sure you want to logout?",
    "Confirm Logout",
  );

  if (!shouldLogout) {
    return;
  }

  auth.logout();
  router.navigate("#login");
}

function goToProfile() {
  window.location.hash = "#settings";
}

function logout() {
  auth.logout();
  router.updateNavbar();
  window.location.hash = "#home";
}

// Navigate on page load
window.addEventListener("load", () => {
  router.navigate();
});

// Enroll in course function
async function enrollCourse(courseId) {
  try {
    const response = await api.enrollInCourse({ courseId });
    if (response.success) {
      showInfoPopup(
        "Enrollment request sent. Please wait for admin approval.",
        "Enrollment Submitted",
      );
      router.navigate("#my-enrollments");
    } else {
      showInfoPopup(response.message || "Enrollment failed", "Enrollment");
    }
  } catch (error) {
    showInfoPopup(`Error: ${error.message}`, "Enrollment Error");
  }
}

async function submitPaymentPrompt(paymentId, courseTitle, amount) {
  // Store the payment data in window for the modal to access
  window.currentPaymentData = {
    paymentId: paymentId,
    courseTitle: courseTitle,
    amount: amount,
  };

  // Show the payment modal
  const modal = document.getElementById("paymentModal");
  modal.style.display = "flex";

  // Populate the form
  document.getElementById("courseName").value = courseTitle;
  document.getElementById("courseAmount").value = amount;
  document.getElementById("utrNumber").value = "";
  document.getElementById("utrNumber").focus();
}

// Close the payment modal
function closePaymentModal() {
  const modal = document.getElementById("paymentModal");
  modal.style.display = "none";
  window.currentPaymentData = null;
}

// Submit the payment form
async function submitPaymentForm(event) {
  event.preventDefault();

  const paymentData = window.currentPaymentData;
  if (!paymentData) {
    showInfoPopup("Payment session expired. Please try again.", "Payment");
    return;
  }

  const utrNumber = document.getElementById("utrNumber").value.trim();

  if (!utrNumber) {
    showInfoPopup("Please enter a valid UTR/Transaction number", "Missing UTR");
    return;
  }

  try {
    const response = await api.submitTransaction(
      paymentData.paymentId,
      utrNumber,
    );

    if (response.success) {
      closePaymentModal();
      showInfoPopup(
        "✅ Payment details submitted successfully!\n\nPlease wait for admin confirmation.",
        "Payment Submitted",
      );
      router.navigate("#my-enrollments");
      return;
    }

    showInfoPopup(response.message || "Failed to submit payment", "Payment");
  } catch (error) {
    showInfoPopup(`Error: ${error.message}`, "Payment Error");
  }
}

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  const modal = document.getElementById("paymentModal");
  if (modal && event.target === modal) {
    closePaymentModal();
  }
});

async function approvePaymentInRouter(paymentId) {
  try {
    const response = await api.approvePayment(paymentId);
    if (response.success) {
      showInfoPopup("Payment approved successfully", "Payment Approved");
      router.navigate("#admin-payments");
      return;
    }

    showInfoPopup(response.message || "Failed to approve payment", "Payment");
  } catch (error) {
    showInfoPopup(`Error: ${error.message}`, "Payment Error");
  }
}

async function settleSpecificTeacherDue(paymentId) {
  const checkbox = document.getElementById(`settle-${paymentId}`);
  if (!checkbox.checked) {
    showInfoPopup(
      "Please check the confirmation box to verify you have paid the teacher.",
      "Confirmation Required",
    );
    return;
  }

  try {
    const response = await api.settleTeacherPayment(paymentId);
    if (response.success) {
      showInfoPopup(
        "Successfully marked as paid to teacher!",
        "Settlement Complete",
      );
      router.navigate("#admin-teacher-dues");
      return;
    }

    showInfoPopup(
      response.message || "Failed to settle payment",
      "Settlement Error",
    );
  } catch (error) {
    showInfoPopup(`Error: ${error.message}`, "Settlement Error");
  }
}

async function rejectPaymentInRouter(paymentId) {
  const reason = await showPromptPopup(
    "Enter rejection reason:",
    "Payment details are invalid",
    "Reject Payment",
  );
  if (!reason || !reason.trim()) {
    return;
  }

  try {
    const response = await api.rejectPayment(paymentId, reason.trim());
    if (response.success) {
      showInfoPopup("Payment rejected", "Payment Rejected");
      router.navigate("#admin-payments");
      return;
    }

    showInfoPopup(response.message || "Failed to reject payment", "Payment");
  } catch (error) {
    showInfoPopup(`Error: ${error.message}`, "Payment Error");
  }
}

// Load course students

// WhatsApp Integration Function
function openWhatsApp(teacherPhone, courseName) {
  // Validate phone number
  if (
    !teacherPhone ||
    teacherPhone === "N/A" ||
    teacherPhone === "undefined" ||
    teacherPhone === "null" ||
    String(teacherPhone).trim() === ""
  ) {
    showInfoPopup(
      "Teacher phone number not available. Please contact the admin.",
      "Contact Unavailable",
    );
    return;
  }

  // Create WhatsApp message
  const message = `Hey Sir/Ma'am, 👋\n\nI have registered your ${courseName} course and I need your teaching and guidance to master it!\n\nLooking forward to learning from you. 🙏`;

  // Clean phone number (remove special characters except +)
  const cleanPhone = teacherPhone.replace(/[^\d+]/g, "");

  // Validate phone number format
  if (!cleanPhone || cleanPhone.length < 10) {
    showInfoPopup(
      "Invalid phone number format. Please contact the admin.",
      "Invalid Contact",
    );
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
    showInfoPopup("Phone number not available", "Contact");
    return;
  }
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  window.location.href = `tel:${cleanPhone}`;
}

// WhatsApp Student Function
function whatsappStudent(phoneNumber) {
  if (!phoneNumber || phoneNumber === "N/A" || phoneNumber.trim() === "") {
    showInfoPopup("Phone number not available", "Contact");
    return;
  }
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  const whatsappURL = `https://wa.me/${cleanPhone}`;
  window.open(whatsappURL, "_blank");
}

function switchAdminDetailsTab(tabName) {
  const studentsContent = document.getElementById("content-admin-students");
  const teachersContent = document.getElementById("content-admin-teachers");
  const studentsBtn = document.getElementById("btn-tab-students");
  const teachersBtn = document.getElementById("btn-tab-teachers");

  if (!studentsContent || !teachersContent) return;

  if (tabName === "students") {
    studentsContent.style.display = "grid";
    teachersContent.style.display = "none";
    studentsBtn.style.background = "#2563eb";
    studentsBtn.style.color = "white";
    studentsBtn.classList.remove("btn-secondary");

    teachersBtn.style.background = "";
    teachersBtn.style.color = "";
    teachersBtn.classList.add("btn-secondary");
  } else if (tabName === "teachers") {
    studentsContent.style.display = "none";
    teachersContent.style.display = "grid";
    teachersBtn.style.background = "#2563eb";
    teachersBtn.style.color = "white";
    teachersBtn.classList.remove("btn-secondary");

    studentsBtn.style.background = "";
    studentsBtn.style.color = "";
    studentsBtn.classList.add("btn-secondary");
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
    let enrollments = response.data || [];

    // Filter to show only active (approved) enrollments
    enrollments = enrollments.filter((e) => e.status === "active");

    if (enrollments.length === 0) {
      container.innerHTML = `
        <div style="margin-top: 2rem; padding: 2rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border-left: 4px solid #667eea; color: #667eea;">
          <p style="margin: 0;">ℹ️ No approved students in this course yet. Students will appear here once their enrollments are approved by admin.</p>
        </div>
      `;
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
            <p style="margin: 0.25rem 0;">📊 Progress: ${enrollment.progress || 0}%</p>
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
