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
      path: "/home",
      requiresAuth: false,
      render: () => this.renderHome(),
    };

    this.routes["login"] = {
      path: "/login",
      requiresAuth: false,
      render: () => this.renderLogin(),
    };

    this.routes["register"] = {
      path: "/register",
      requiresAuth: false,
      render: () => this.renderRegister(),
    };

    this.routes["courses"] = {
      path: "/courses",
      requiresAuth: false,
      render: () => this.renderCourses(),
    };

    this.routes["course-detail"] = {
      path: "/course-detail",
      requiresAuth: false,
      render: (courseId) => this.renderCourseDetail(courseId),
    };

    // Protected routes
    this.routes["profile"] = {
      path: "/profile",
      requiresAuth: true,
      render: () => this.renderProfile(),
    };

    this.routes["student-dashboard"] = {
      path: "/student-dashboard",
      requiresAuth: true,
      role: "student",
      render: () => this.renderStudentDashboard(),
    };

    this.routes["teacher-dashboard"] = {
      path: "/teacher-dashboard",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderTeacherDashboard(),
    };

    this.routes["admin-dashboard"] = {
      path: "/admin-dashboard",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminDashboard(),
    };

    this.routes["admin-approve-courses"] = {
      path: "/admin-approve-courses",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminApproveCourses(),
    };

    this.routes["admin-student-approvals"] = {
      path: "/admin-student-approvals",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminStudentApprovals(),
    };

    this.routes["admin-payments"] = {
      path: "/admin-payments",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminPayments(),
    };

    this.routes["admin-teachers"] = {
      path: "/admin-teachers",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminTeachers(),
    };

    this.routes["admin-teacher-dues"] = {
      path: "/admin-teacher-dues",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminTeacherDues(),
    };

    this.routes["admin-teacher-details"] = {
      path: "/admin-teacher-details",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminTeacherDetails(),
    };

    this.routes["admin-details"] = {
      path: "/admin-details",
      requiresAuth: true,
      role: "admin",
      render: () => this.renderAdminDetails(),
    };

    this.routes["my-courses"] = {
      path: "/my-courses",
      requiresAuth: true,
      render: () => this.renderMyCourses(),
    };

    this.routes["create-course"] = {
      path: "/create-course",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderCreateCourse(),
    };

    this.routes["edit-course"] = {
      path: "/edit-course",
      requiresAuth: true,
      role: "teacher",
      render: (courseId) => this.renderEditCourse(courseId),
    };

    this.routes["my-enrollments"] = {
      path: "/my-enrollments",
      requiresAuth: true,
      role: "student",
      render: () => this.renderMyEnrollments(),
    };

    this.routes["payment"] = {
      path: "/payment",
      requiresAuth: true,
      role: "student",
      render: () => this.renderPayment(),
    };

    this.routes["your-courses"] = {
      path: "/your-courses",
      requiresAuth: true,
      role: "student",
      render: () => this.renderYourCourses(),
    };

    this.routes["teacher-students"] = {
      path: "/teacher-students",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderTeacherStudents(),
    };

    this.routes["settings"] = {
      path: "/settings",
      requiresAuth: true,
      render: () => this.renderSettings(),
    };

    this.routes["support"] = {
      path: "/support",
      requiresAuth: true,
      render: () => this.renderSupport(),
    };

    this.routes["documentations"] = {
      path: "/documentations",
      requiresAuth: true,
      render: () => this.renderDocumentations(),
    };

    this.routes["create-meeting"] = {
      path: "/create-meeting",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderCreateMeeting(),
    };

    this.routes["teacher-reviews"] = {
      path: "/teacher-reviews",
      requiresAuth: false,
      render: (teacherId) => this.renderTeacherReviews(teacherId),
    };

    // Legal Routes
    this.routes["terms"] = {
      path: "/terms",
      requiresAuth: false,
      render: () => this.renderTerms(),
    };

    this.routes["privacy"] = {
      path: "/privacy",
      requiresAuth: false,
      render: () => this.renderPrivacy(),
    };

    this.routes["refund"] = {
      path: "/refund",
      requiresAuth: false,
      render: () => this.renderRefund(),
    };

    // Teacher Specific Rules
    this.routes["teacher-terms"] = {
      path: "/teacher-terms",
      requiresAuth: true,
      role: "teacher",
      render: () => this.renderTeacherTerms(),
    };

    // Client / Freelance Routes
    this.routes["client-projects"] = {
      path: "/client-projects",
      requiresAuth: true,
      role: "client",
      render: () => this.renderClientProjects(),
    };
    this.routes["client-dashboard"] = {
      path: "/client-dashboard",
      requiresAuth: true,
      role: "client",
      render: () => this.renderClientProjects(),
    };
    this.routes["client-create-project"] = {
      path: "/client-create-project",
      requiresAuth: true,
      role: "client",
      render: () => this.renderCreateProject(),
    };
    this.routes["client-project-details"] = {
      path: "/client-project-details",
      requiresAuth: true,
      role: "client",
      render: (id) => this.renderProjectDetailsAdmin(id),
    };
    this.routes["freelance"] = {
      path: "/freelance",
      requiresAuth: true,
      role: "student",
      render: () => this.renderFreelance(),
    };
    this.routes["freelance-project"] = {
      path: "/freelance-project",
      requiresAuth: true,
      role: "student",
      render: (id) => this.renderProjectDetailsStudent(id),
    };
    this.routes["my-applications"] = {
      path: "/my-applications",
      requiresAuth: true,
      role: "student",
      render: () => this.renderStudentApplications(),
    };
  }

  /**
   * Setup event listeners for navigation
   */
  setupEventListeners() {
    window.addEventListener("popstate", () => this.navigate());
    window.addEventListener("hashchange", () => this.navigate());
    document.addEventListener("click", async (e) => {
      const navLink =
        e.target.closest(".nav-link") ||
        (e.target.classList.contains("nav-link") ? e.target : null);
      if (navLink) {
        e.preventDefault();
        const href = navLink.getAttribute("href");
        if (href && href.startsWith("#")) {
          this.navigate(href.substring(1));
        } else if (href && href.startsWith("/")) {
          this.navigate(href.substring(1));
        } else if (href) {
          window.location.href = href;
        }
      }
    });
  }

  async handleCreateInstantMeet(btn) {
    this.navigate("create-meeting");
  }

  /**
   * Navigate to a route
   */
  navigate(path = null) {
    if (path) {
      const cleanPath = path.startsWith("#") ? path.substring(1) : path;
      try {
        const currentPath = window.location.pathname;
        let newUrl = "/" + cleanPath;
        if (currentPath.includes("nexus-frontend")) {
          const basePath = currentPath.substring(
            0,
            currentPath.indexOf("nexus-frontend") + "nexus-frontend".length,
          );
          newUrl = basePath + "/" + cleanPath;
        }
        window.history.pushState({}, "", newUrl);
      } catch (e) {
        window.location.hash = cleanPath;
      }
      this.navigate();
      return;
    }

    let routePath = "";

    // Check hash first
    if (window.location.hash.length > 1) {
      routePath = window.location.hash.substring(1);
    } else {
      routePath = window.location.pathname;
    }

    if (routePath.startsWith("/")) {
      routePath = routePath.substring(1);
    }

    // Clean up base path if needed
    if (routePath.includes("nexus-frontend/")) {
      routePath = routePath.split("nexus-frontend/")[1];
    }
    if (routePath.includes(".html")) {
      routePath = routePath.replace(/\/[^/]+\.html$/, "");
    }

    if (!routePath) {
      routePath = "home";
    }

    const parts = routePath.split("/");
    let routeName = parts[0];
    let params = parts.slice(1);
    let route = this.routes[routeName];

    // Robustly handle 'course-detail/:id' logic
    if (
      routeName === "course-detail" ||
      routePath.startsWith("course-detail/") ||
      (routeName === "courses" && parts[1] === "course-detail")
    ) {
      if (routeName === "courses" && parts[1] === "course-detail") {
        routeName = "course-detail";
        params = parts.slice(2);
      } else {
        routeName = "course-detail";
        params = parts.slice(1);
      }
      route = this.routes[routeName];
    }

    if (!route) {
      this.renderNotFound();
      return;
    }

    // Check authentication
    if (route.requiresAuth && !auth.isAuthenticated()) {
      this.navigate("login");
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

    // Toggle main footer visibility
    const footer = document.querySelector(".footer");
    if (footer) {
      if (
        ["home", "login", "register", "settings"].includes(routeName) ||
        routeName === ""
      ) {
        footer.style.display = "block";
      } else {
        footer.style.display = "none";
      }

      const teacherFooterLink = document.getElementById("teacher-footer-link");
      if (teacherFooterLink) {
        teacherFooterLink.style.display =
          auth.getUserRole() === "teacher" ? "inline-block" : "none";
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    route.render(...params);
  }

  /**
   * Redirect to appropriate dashboard based on user role
   */
  redirectToDashboard() {
    if (!auth.isAuthenticated()) {
      this.navigate("home");
      return;
    }

    const role = auth.getUserRole();
    if (role === "admin") {
      this.navigate("admin-dashboard");
    } else if (role === "teacher") {
      this.navigate("teacher-dashboard");
    } else if (role === "client") {
      this.navigate("client-dashboard");
    } else {
      this.navigate("student-dashboard");
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
    const yourProjectsMenuItem = document.getElementById(
      "yourProjectsMenuItem",
    );
    const myEnrollmentsMenuItem = document.getElementById(
      "myEnrollmentsMenuItem",
    );
    const myCoursesMenuItem = document.getElementById("myCoursesMenuItem");
    const studentsMenuItem = document.getElementById("studentsMenuItem");
    const adminMenuItem = document.getElementById("adminMenuItem");
    const servicesMenuItem = document.getElementById("servicesMenuItem");
    const supportMenuItem = document.getElementById("supportMenuItem");
    const freelanceMenuItem = document.getElementById("freelanceMenuItem");
    const documentationsMenuItem = document.getElementById(
      "documentationsMenuItem",
    );
    const createMeetingMenuItem = document.getElementById(
      "createMeetingMenuItem",
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
      if (yourProjectsMenuItem) yourProjectsMenuItem.style.display = "none";
      myEnrollmentsMenuItem.style.display = "none";
      myCoursesMenuItem.style.display = "none";
      studentsMenuItem.style.display = "none";
      adminMenuItem.style.display = "none";
      if (servicesMenuItem) servicesMenuItem.style.display = "none";
      supportMenuItem.style.display = "none";
      if (freelanceMenuItem) freelanceMenuItem.style.display = "none";
      documentationsMenuItem.style.display = "none";
      if (createMeetingMenuItem) createMeetingMenuItem.style.display = "none";

      // Show menu items based on role
      if (user.role === "student") {
        coursesMenuItem.style.display = "block";
        yourCoursesMenuItem.style.display = "block";
        myEnrollmentsMenuItem.style.display = "block";
        if (servicesMenuItem) servicesMenuItem.style.display = "block";
        supportMenuItem.style.display = "block";
        if (freelanceMenuItem) freelanceMenuItem.style.display = "block";
        documentationsMenuItem.style.display = "block";
      } else if (user.role === "client") {
        if (yourProjectsMenuItem) yourProjectsMenuItem.style.display = "block";
        if (servicesMenuItem) servicesMenuItem.style.display = "block";
        supportMenuItem.style.display = "block";
        documentationsMenuItem.style.display = "block";
      } else if (user.role === "teacher") {
        coursesMenuItem.style.display = "block";
        myCoursesMenuItem.style.display = "block";
        studentsMenuItem.style.display = "block";
        if (servicesMenuItem) servicesMenuItem.style.display = "block";
        supportMenuItem.style.display = "block";
        documentationsMenuItem.style.display = "block";
        if (createMeetingMenuItem)
          createMeetingMenuItem.style.display = "block";
      } else if (user.role === "admin") {
        coursesMenuItem.style.display = "block";
        adminMenuItem.style.display = "block";
        if (servicesMenuItem) servicesMenuItem.style.display = "block";
        documentationsMenuItem.style.display = "block";
      }
    } else {
      loginLink.style.display = "block";
      settingsLink.style.display = "none";
      userInfo.style.display = "none";

      // Hide all dynamic menu items for non-authenticated users
      coursesMenuItem.style.display = "none";
      yourCoursesMenuItem.style.display = "none";
      myEnrollmentsMenuItem.style.display = "none";
      myCoursesMenuItem.style.display = "none";
      studentsMenuItem.style.display = "none";
      adminMenuItem.style.display = "none";
      if (servicesMenuItem) servicesMenuItem.style.display = "none";
      if (supportMenuItem) supportMenuItem.style.display = "none";
      if (documentationsMenuItem) documentationsMenuItem.style.display = "none";
      if (createMeetingMenuItem) createMeetingMenuItem.style.display = "none";
    }
  }

  /**
   * Render pages
   */

  renderHome() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <style>
        .home-container {
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
        }

        .home-section {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 5%;
        }

        .section-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
        }

        @media(min-width: 768px) {
          .section-content {
            flex-direction: row;
            justify-content: space-between;
          }
          .section-content.reverse {
            flex-direction: row-reverse;
          }
        }

        /* Setup staggered animations */
        .section-text {
          flex: 1;
          text-align: left;
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .section-content.reverse .section-text {
          transform: translateX(50px);
        }

        .section-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transform: translateX(50px) scale(0.95);
          transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
        }

        .section-content.reverse .section-image {
          transform: translateX(-50px) scale(0.95);
        }

        .home-section.visible .section-text,
        .home-section.visible .section-image {
          opacity: 1;
          transform: translate(0) scale(1);
        }

        /* Subtle parallax and float animation for images */
        @keyframes floatImage {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        .section-image img {
          max-width: 100%;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          position: relative;
          z-index: 1;
        }

        .home-section.visible .section-image img {
          animation: floatImage 6s ease-in-out infinite;
        }

        .section-image img:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 25px 45px rgba(0,0,0,0.3);
          animation-play-state: paused;
        }

        .home-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #E8702A, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        html:not([data-theme="light"]) .home-title {
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .home-subtitle {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-color, #1e293b);
          line-height: 1.3;
        }

        .home-text {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 30px;
          color: var(--text-color, #475569);
          opacity: 0.9;
        }

        .home-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .home-btn {
          padding: 12px 30px;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-explore {
          background: #E8702A;
          color: white;
          border: 2px solid #E8702A;
        }

        html:not([data-theme="light"]) .btn-explore {
          background: #667eea;
          border: 2px solid #667eea;
        }

        .btn-explore:hover {
          box-shadow: 0 5px 15px rgba(232, 112, 42, 0.4);
          transform: translateY(-2px);
          color: white;
        }

        html:not([data-theme="light"]) .btn-explore:hover {
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .btn-login {
          background: transparent;
          color: var(--text-color, #1e293b);
          border: 2px solid var(--text-color, #1e293b);
        }

        .btn-login:hover {
          background: var(--text-color, #1e293b);
          color: var(--bg-color, white);
        }

        /* Dynamic Logo for Light/Dark Mode */
        html[data-theme="light"] .home-logo-dark {
          display: none !important;
        }
        html:not([data-theme="light"]) .home-logo-light {
          display: none !important;
        }

        .home-scroll-btn {
          background: #E8702A;
        }
        html:not([data-theme="light"]) .home-scroll-btn {
          background: #667eea;
        }
      </style>

      <div class="home-container" id="homeScrollContainer">
        <!-- Section 1: Intro -->
        <section class="home-section">
          <div class="section-content">
            <div class="section-text">
              <h1 class="home-title">StudBridge</h1>
              <h2 class="home-subtitle">We turn students into Engineers.</h2>
              <p class="home-text">Enroll with top working professionals today to land an internship or a high-paying job quickly. Master real-world skills and accelerate your career right now.</p>
              <div class="home-buttons">
                <a href="/courses" class="home-btn btn-explore">View the Courses</a>
                ${!auth.isAuthenticated() ? `<a href="/login" class="home-btn btn-login">Login</a>` : ""}
              </div>
            </div>
            <div class="section-image" style="align-items: center; justify-content: center;">
              <img src="assets/logo_DM.png" class="home-logo-dark" alt="StudBridge Logo (Dark)" style="box-shadow: none; max-width: 80%; border-radius: 0;" onerror="this.src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
              <img src="assets/logo_LM.png" class="home-logo-light" alt="StudBridge Logo (Light)" style="box-shadow: none; max-width: 80%; border-radius: 0;" onerror="this.src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            </div>
          </div>
        </section>

        <!-- Section 2: Teachers -->
        <section class="home-section">
          <div class="section-content reverse">
            <div class="section-text">
              <h2 class="home-subtitle">Learn from Working Professionals</h2>
              <p class="home-text">Our teachers aren't just instructors—they are active software engineers and industry leaders doing the job. Secure direct guidance from professionals currently working at top tech companies.</p>
            </div>
            <div class="section-image">
              <img src="assets/working_professional_pic.png" alt="Working Professionals" onerror="this.src='https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            </div>
          </div>
        </section>

        <!-- Section 3: 1-on-1 Mentorship -->
        <section class="home-section">
          <div class="section-content">
            <div class="section-text">
              <h2 class="home-subtitle">1-on-1 Mentorship on Google Meet</h2>
              <p class="home-text">Your teacher will personally guide you through coding challenges, help you build robust projects, and teach you how to crack rigorous technical interviews. Upskill yourself with undivided attention.</p>
            </div>
            <div class="section-image">
              <img src="assets/1-on-1-mentorship_pic.png" alt="1-on-1 Mentorship" onerror="this.src='https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            </div>
          </div>
        </section>

        <!-- Section 4: Tech Insights -->
        <section class="home-section">
          <div class="section-content reverse">
            <div class="section-text">
              <h2 class="home-subtitle">Navigate the Changing Tech Industry</h2>
              <p class="home-text">The world is shifting from simple programming to complex architecture. System design and DSA are more crucial than ever. Our mentors will help you choose the right domains, master architecture, and survive and thrive in today's tech landscape.</p>
            </div>
            <div class="section-image">
              <img src="assets/tech_insights_pic.png" alt="Tech Insights" onerror="this.src='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            </div>
          </div>
        </section>

        <!-- Section 5: Resume & Portfolio -->
        <section class="home-section">
          <div class="section-content">
            <div class="section-text">
              <h2 class="home-subtitle">Build a Standout Resume & Portfolio</h2>
              <p class="home-text">Your resume is your ticket to the interview. Our industry experts will personally help you craft a professional resume and an impressive portfolio that catches the eye of top recruiters.</p>
            </div>
            <div class="section-image">
              <img src="assets/resum_portfolio_pic.png" alt="Resume and Portfolio Building" onerror="this.src='https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            </div>
          </div>
        </section>

        <!-- Section 6: Reviews & Refunds -->
        <section class="home-section">
          <div class="section-content reverse">
            <div class="section-text">
              <h2 class="home-subtitle">Trusted by Students, Backed by Us</h2>
              <p class="home-text">Check out our <a href="https://g.page/r/CXrVJDchmzS_EBM/review" target="_blank" style="color:#E8702A; font-weight:600; text-decoration:underline;">Google Reviews</a>! See what students have to say about their teachers before joining.</p>
              <p class="home-text" style="font-weight:600; color: #10b981;">Guaranteeing quality and peace of mind. If you face any unresolvable issues with your teacher, reach out directly to our team. We offer a 100% Refundable Amount policy to ensure your satisfaction.</p>
            </div>
            <div class="section-image">
              <img src="assets/reviews_page_pic.png" alt="Student Reviews" onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            </div>
          </div>
        </section>
      </div>

      <!-- Scroll Button -->
      <button id="homeScrollBtn" class="home-scroll-btn" style="position: fixed; bottom: 30px; right: 30px; z-index: 100; width: 50px; height: 50px; border-radius: 50%; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.3s, background 0.3s;">
        <span class="material-icons" id="homeScrollIcon">arrow_downward</span>
      </button>
    `;
    this.updateNavbar();

    // Init scroll observer for animations
    setTimeout(() => {
      const sections = document.querySelectorAll(".home-section");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.15 },
      );

      sections.forEach((sec) => observer.observe(sec));

      // Make first section visible immediately
      if (sections.length > 0) sections[0].classList.add("visible");

      // Scroll button logic
      const scrollBtn = document.getElementById("homeScrollBtn");
      const scrollIcon = document.getElementById("homeScrollIcon");

      if (scrollBtn && scrollIcon) {
        const handleScroll = () => {
          // Add a small threshold (like 50px) to handle mobile browsers and zoom rounding
          if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 50
          ) {
            scrollIcon.textContent = "arrow_upward";
          } else {
            scrollIcon.textContent = "arrow_downward";
          }
        };

        window.addEventListener("scroll", handleScroll);

        // Remove listener when navigating away
        const originalNavigate = router.navigate;
        router.navigate = function (path) {
          window.removeEventListener("scroll", handleScroll);
          originalNavigate.call(router, path);
        };

        scrollBtn.addEventListener("click", () => {
          if (scrollIcon.textContent === "arrow_upward") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }
        });
      }
    }, 100);
  }

  renderLogin() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
      <div class="auth-page">
        <div class="auth-card">
          <h2>Login to <span class="brand-stud">Stud</span><span class="brand-bridge">Bridge</span> Platform</h2>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <div style="position: relative; display: flex; align-items: center;">
                <input type="password" id="password" name="password" required style="width: 100%; padding-right: 40px;">
                <span class="material-icons" id="toggleLoginPasswordBtn" style="position: absolute; right: 10px; cursor: pointer; color: #94a3b8; user-select: none;">visibility_off</span>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" id="loginBtn" style="width: 100%;">Login</button>
          </form>

          <div class="divider" style="text-align: center; margin: 20px 0; color: #cbd5e1; display:flex; align-items:center;">
            <hr style="flex:1; border:none; border-top:1px solid #334155;">
            <span style="padding: 0 10px; font-size: 0.875rem;">OR</span>
            <hr style="flex:1; border:none; border-top:1px solid #334155;">
          </div>

          <div id="googleBtnContainer" style="display: flex; justify-content: center; margin-bottom: 20px; min-height: 40px;">
            <!-- Google button rendered here -->
          </div>

          <p class="auth-link">Don't have an account? <a href="/register">Register here</a></p>
          <p style="text-align: center; font-size: 0.875rem; color: #94a3b8; margin-top: 15px;">By logging in, you agree to our <a href="/terms" class="nav-link" style="color: #6366f1;">Terms and Conditions</a></p>
          <div id="loginMessage" class="message"></div>
        </div>
      </div>
    `;

    // Render Google Button via JavaScript API (SPA compat)
    const renderGoogleBtn = setInterval(() => {
      if (
        window.google &&
        window.google.accounts &&
        document.getElementById("googleBtnContainer")
      ) {
        clearInterval(renderGoogleBtn);
        window.google.accounts.id.initialize({
          client_id:
            "972878196372-rh96kcu502h3r0jucr4mcapa37ao3nud.apps.googleusercontent.com",
          callback: window.handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtnContainer"),
          {
            theme: "filled_blue",
            size: "large",
            shape: "pill",
            width:
              window.innerWidth < 400
                ? Math.min(window.innerWidth - 60, 280)
                : 330,
            text: "continue_with",
          },
        );
      }
    }, 100);
    setTimeout(() => clearInterval(renderGoogleBtn), 5000);

    const toggleLoginPasswordBtn = document.getElementById(
      "toggleLoginPasswordBtn",
    );
    const loginPasswordInput = document.getElementById("password");
    if (toggleLoginPasswordBtn && loginPasswordInput) {
      toggleLoginPasswordBtn.addEventListener("click", () => {
        const type =
          loginPasswordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        loginPasswordInput.setAttribute("type", type);
        toggleLoginPasswordBtn.textContent =
          type === "password" ? "visibility_off" : "visibility";
      });
    }

    const form = document.getElementById("loginForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const loginBtn = document.getElementById("loginBtn");

      toggleLoading(loginBtn, true);
      const result = await auth.login(email, password);
      toggleLoading(loginBtn, false);

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
          <h2>Register to <span class="brand-stud">Stud</span><span class="brand-bridge">Bridge</span> Platform</h2>
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
              <div style="position: relative; display: flex; align-items: center;">
                <input type="password" id="password" name="password" placeholder="At least 6 characters with uppercase and numbers" required style="width: 100%; padding-right: 40px;">
                <span class="material-icons" id="togglePasswordBtn" style="position: absolute; right: 10px; cursor: pointer; color: #94a3b8; user-select: none;">visibility_off</span>
              </div>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password:</label>
              <div style="position: relative; display: flex; align-items: center;">
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" required style="width: 100%; padding-right: 40px;">
                <span class="material-icons" id="toggleConfirmPasswordBtn" style="position: absolute; right: 10px; cursor: pointer; color: #94a3b8; user-select: none;">visibility_off</span>
              </div>
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
                <option value="client">Client</option>
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
            <button type="submit" class="btn btn-primary" style="width: 100%;" id="registerBtn">Register</button>
          </form>

          <div class="divider" style="text-align: center; margin: 20px 0; color: #cbd5e1; display:flex; align-items:center;">
            <hr style="flex:1; border:none; border-top:1px solid #334155;">
            <span style="padding: 0 10px; font-size: 0.875rem;">OR</span>
            <hr style="flex:1; border:none; border-top:1px solid #334155;">
          </div>
          
          <div id="googleBtnContainerReg" style="display: flex; justify-content: center; margin-bottom: 20px; min-height: 40px;">
            <!-- Google button rendered here dynamically -->
          </div>

          <p class="auth-link">Already have an account? <a href="/login">Login here</a></p>
          <p style="text-align: center; font-size: 0.875rem; color: #94a3b8; margin-top: 15px;">By registering, you agree to our <a href="/terms" class="nav-link" style="color: #6366f1;">Terms and Conditions</a></p>
          <div id="registerMessage" class="message"></div>
        </div>
      </div>
    `;

    // Render Google Button via JavaScript API (works correctly for SPAs)
    const renderGoogleBtnReg = setInterval(() => {
      if (
        window.google &&
        window.google.accounts &&
        document.getElementById("googleBtnContainerReg")
      ) {
        clearInterval(renderGoogleBtnReg);
        window.google.accounts.id.initialize({
          client_id:
            "972878196372-rh96kcu502h3r0jucr4mcapa37ao3nud.apps.googleusercontent.com",
          callback: window.handleGoogleLogin,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtnContainerReg"),
          {
            theme: "filled_blue",
            size: "large",
            shape: "pill",
            width:
              window.innerWidth < 400
                ? Math.min(window.innerWidth - 60, 280)
                : 330,
            text: "signup_with",
          },
        );
      }
    }, 100);
    setTimeout(() => clearInterval(renderGoogleBtnReg), 5000);

    // Toggle Password Visibility Logic
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");
    const passwordInput = document.getElementById("password");
    if (togglePasswordBtn && passwordInput) {
      togglePasswordBtn.addEventListener("click", () => {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);
        togglePasswordBtn.textContent =
          type === "password" ? "visibility_off" : "visibility";
      });
    }

    const toggleConfirmPasswordBtn = document.getElementById(
      "toggleConfirmPasswordBtn",
    );
    const confirmPasswordInput = document.getElementById("confirmPassword");
    if (toggleConfirmPasswordBtn && confirmPasswordInput) {
      toggleConfirmPasswordBtn.addEventListener("click", () => {
        const type =
          confirmPasswordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        confirmPasswordInput.setAttribute("type", type);
        toggleConfirmPasswordBtn.textContent =
          type === "password" ? "visibility_off" : "visibility";
      });
    }

    const form = document.getElementById("registerForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const messageDiv = document.getElementById("registerMessage");

      if (password !== confirmPassword) {
        messageDiv.className = "message error";
        messageDiv.textContent = "• Passwords do not match!";
        messageDiv.style.whiteSpace = "normal";
        return;
      }

      const registerBtn = document.getElementById("registerBtn");

      toggleLoading(registerBtn, true);
      const result = await auth.register(form);
      toggleLoading(registerBtn, false);

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

      // Prevent race conditions if user navigated away while fetching
      if (this.currentRoute !== "courses") return;

      let courses = response.data || [];

      // Filter courses based on user role
      const user = auth.getCurrentUser();

      // Allow everyone (including teachers) to see all published courses
      // In the courses view, teachers shouldn't be restricted to only their own
      if (user && user.role !== "admin") {
        // Students and Teachers see only published courses
        courses = courses.filter((c) => c.status === "published");
      }
      // Admin sees all courses

      const pageTitle = "Explore All Courses";
      const showCreateButton = auth.isTeacher();

      appDiv.innerHTML = `
        <style>
          #courseSearchInput {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          .search-container {
            border-color: #E8702A !important;
          }
          .search-container:focus-within {
            border-color: #E8702A !important;
            box-shadow: 0 0 0 2px rgba(232, 112, 42, 0.2) !important;
          }
          html:not([data-theme="light"]) .enroll-btn {
            border: 1px solid #0f766e !important;
            color: #0f766e !important;
            transition: all 0.3s ease;
            background: transparent;
          }
          html:not([data-theme="light"]) .enroll-btn:hover {
            background-color: #0f766e !important;
            color: #ffffff !important;
          }
        </style>
        <div class="courses-page">
          <div class="page-header" style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 2rem;">
            <h2 style="margin:0">${pageTitle}</h2>
            <div class="search-actions" style="display: flex; gap: 1rem; align-items: center; flex: 1; justify-content: flex-end;">
              <div class="search-container" style="display:flex; align-items:center; background: #fff; border: 1px solid #E8702A; border-radius: 8px; padding: 0.3rem 0.8rem; flex: 1; max-width: 500px; min-width: 250px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000" width="24" height="24" stroke="#000000" stroke-width="0.5">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
                <input type="text" id="courseSearchInput" placeholder="Find your next career path..." style="background: transparent; color: #334155; padding: 0.4rem; width: 100%; font-size: 15px; margin-left: 8px;">
              </div>
              ${showCreateButton ? `<a href="/create-course" class="btn btn-primary">Create Course</a>` : ""}
            </div>
          </div>
          <div class="courses-grid" id="coursesGrid">
            ${
              courses.length > 0
                ? courses
                    .map((course) => {
                      const teacher = course.teacherId || {};

                      const t = (course.title || "").toLowerCase();

                      const iconMap = [
                        {
                          keywords: ["java", "spring"],
                          icons: [
                            "devicon-java-plain colored",
                            "devicon-spring-plain colored",
                          ],
                        },
                        {
                          keywords: [
                            "low level design",
                            "lld",
                            "system design",
                          ],
                          icons: [
                            "devicon-java-plain colored",
                            "devicon-cplusplus-plain colored",
                          ],
                        },
                        {
                          keywords: ["python", "django"],
                          icons: [
                            "devicon-python-plain colored",
                            "devicon-django-plain colored",
                          ],
                        },
                        {
                          keywords: ["azure", "microsoft", ".net"],
                          icons: [
                            "devicon-azure-plain colored",
                            "devicon-dot-net-plain colored",
                          ],
                        },
                        {
                          keywords: ["react", "frontend"],
                          icons: ["devicon-react-original colored"],
                        },
                        {
                          keywords: ["mobile", "android", "ios", "flutter"],
                          icons: [
                            "devicon-android-plain colored",
                            "devicon-apple-original",
                          ],
                        },
                        {
                          keywords: ["go", "golang"],
                          icons: ["devicon-go-plain colored"],
                        },
                        {
                          keywords: ["node", "javascript", "web"],
                          icons: [
                            "devicon-nodejs-plain colored",
                            "devicon-react-original colored",
                          ],
                        },
                      ];

                      const matched = iconMap.find((entry) =>
                        entry.keywords.some((k) => t.includes(k)),
                      );
                      const icons = matched
                        ? matched.icons
                        : [
                            "devicon-nodejs-plain colored",
                            "devicon-react-original colored",
                          ];

                      let iconHtml = `<div style="font-size: 60px; display: flex; gap: 10px; align-items: center; justify-content: center;">
                        ${icons.map((cls) => `<i class="${cls}" ${cls.includes("apple") ? 'style="color: #fff;"' : ""}></i>`).join("")}
                      </div>`;

                      let displayDesc =
                        course.description ||
                        "No description available for this course.";

                      return `
              <div class="course-card">
                <div class="course-icon" style="background: #1e2a3a; height: 140px; display: flex; align-items: center; justify-content: center;">
                  ${iconHtml}
                </div>
                  <div class="course-info" style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
                  <h3 style="margin: 0 0 1rem 0;">${course.title}</h3>
                  <div style="margin-bottom: 1rem;">
                    <p class="info-row" style="margin: 0.35rem 0; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Instructor: <strong style="font-weight: 600; margin-left: 4px;">${course.instructor || teacher.name || "Unknown Teacher"}</strong>
                    </p>
                    <p class="info-row" style="margin: 0.35rem 0; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                      Company: <strong style="font-weight: 600; margin-left: 4px;">${course.company || teacher.company || "N/A"}</strong>
                    </p>
                    <p class="info-row" style="margin: 0.35rem 0; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                      Role: <strong style="font-weight: 600; margin-left: 4px;">${course.role || teacher.profession || teacher.role || "Instructor"}</strong>
                    </p>
                  </div>
                  
                  <hr style="border: 0; border-top: 1px solid #334155; margin: 0 0 1rem 0;" />

                  <p class="course-desc" style="margin: 0 0 1rem 0; font-size: 0.9rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
                    ${displayDesc}
                  </p>

                  <p class="students-count" style="margin: 0 0 1.5rem 0; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; margin-top: auto;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    ${course.enrolledCount || 0} students registered
                  </p>

                  <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span class="price" style="font-size: 22px; font-weight: bold;">₹${course.price || 0}</span>
                    <span class="duration" style="font-size: 0.9rem; display: flex; align-items: center; gap: 0.2rem;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      ${course.duration || 0} months
                    </span>
                  </div>
                  ${auth.isTeacher() ? `<a href="/course-detail/${course._id}" class="btn enroll-btn" style="background-color: var(--secondary-color)">View Course</a>` : `<a href="/course-detail/${course._id}" class="btn enroll-btn">View Course Details</a>`}
                </div>
              </div>
            `;
                    })
                    .join("")
                : `<p class='no-courses'>No courses available.</p>`
            }
          </div>
        </div>
      `;

      // Search functionality
      const searchInputField = document.getElementById("courseSearchInput");
      const courseCards = document.querySelectorAll(
        "#coursesGrid .course-card",
      );

      if (searchInputField) {
        searchInputField.addEventListener("input", function (e) {
          const query = e.target.value.toLowerCase().trim();
          courseCards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? "flex" : "none";
          });
        });
      }
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

      let isEnrolled = false;
      if (auth.isAuthenticated() && auth.isStudent()) {
        try {
          const enrollmentsResp = await api.getMyEnrollments(1, 100);
          if (enrollmentsResp.success) {
            const enrollments = enrollmentsResp.data.enrollments || [];
            isEnrolled = enrollments.some(
              (e) =>
                (e.courseId === courseId || e.courseId?._id === courseId) &&
                (e.status === "active" || e.status === "completed"),
            );
          }
        } catch (e) {
          console.error("Failed to fetch enrollments for course details", e);
        }
      }

      // Define icons logic based on title identical to courses list
      const t = (course.title || "").toLowerCase();

      const iconMap = [
        {
          keywords: ["java", "spring"],
          icons: ["devicon-java-plain colored", "devicon-spring-plain colored"],
        },
        {
          keywords: ["low level design", "lld", "system design"],
          icons: [
            "devicon-java-plain colored",
            "devicon-cplusplus-plain colored",
          ],
        },
        {
          keywords: ["python", "django"],
          icons: [
            "devicon-python-plain colored",
            "devicon-django-plain colored",
          ],
        },
        {
          keywords: ["azure", "microsoft", ".net"],
          icons: [
            "devicon-azure-plain colored",
            "devicon-dot-net-plain colored",
          ],
        },
        {
          keywords: ["react", "frontend"],
          icons: ["devicon-react-original colored"],
        },
        {
          keywords: ["mobile", "android", "ios", "flutter"],
          icons: ["devicon-android-plain colored", "devicon-apple-original"],
        },
        { keywords: ["go", "golang"], icons: ["devicon-go-plain colored"] },
        {
          keywords: ["node", "javascript", "web"],
          icons: [
            "devicon-nodejs-plain colored",
            "devicon-react-original colored",
          ],
        },
      ];

      const matched = iconMap.find((entry) =>
        entry.keywords.some((k) => t.includes(k)),
      );
      const icons = matched
        ? matched.icons
        : ["devicon-nodejs-plain colored", "devicon-react-original colored"];

      let iconHtml = `<div style="font-size: 80px; display: flex; gap: 15px; align-items: center; justify-content: center;">
        ${icons.map((cls) => `<i class="${cls}" ${cls.includes("apple") ? 'style="color: #333;"' : ""}></i>`).join("")}
      </div>`;

      appDiv.innerHTML = `
        <style>
          /* Make background light orange only outside dark mode */
          html[data-theme="light"] .course-detail-wrapper {
            background-color: #faf0e6 !important;
          }
          html:not([data-theme="light"]) .course-detail-wrapper {
            background-color: var(--bg-color);
          }
          
          /* Details card background */
          html[data-theme="light"] .details-info-card {
            background: #ffffff !important;
          }
          html[data-theme="light"] .course-content-card {
            background: #ffffff !important;
          }
          
          /* Border and backgrounds for light mode */
          html[data-theme="light"] .icon-card,
          html[data-theme="light"] .details-info-card,
          html[data-theme="light"] .course-content-card {
            box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important;
            border: 1px solid #d1d5db !important;
            background-color: #ffffff !important;
            border-radius: 12px !important;
          }

          /* Enroll button theming */
          html[data-theme="light"] .course-detail-enroll-btn {
            background-color: #E8702A !important;
            transition: all 0.3s ease;
          }
          html[data-theme="light"] .course-detail-enroll-btn:hover {
            background-color: #d65c1c !important;
            box-shadow: 0 4px 12px rgba(232, 112, 42, 0.4) !important;
          }
          html:not([data-theme="light"]) .course-detail-enroll-btn {
            background-color: var(--primary-color) !important;
            transition: all 0.3s ease;
          }
          html:not([data-theme="light"]) .course-detail-enroll-btn:hover {
            opacity: 0.9 !important;
            box-shadow: 0 4px 12px rgba(15, 118, 110, 0.4) !important;
          }

          /* Text colors for light vs dark mode */
          html:not([data-theme="light"]) .icon-card h1,
          html:not([data-theme="light"]) .course-content-card h3,
          html:not([data-theme="light"]) .details-info-card div {
             !important;
          }
          html:not([data-theme="light"]) .details-info-card span {
              !important;
          }

          /* DARK MODE SPECIFIC STYLES TO MATCH IMAGE */
          html:not([data-theme="light"]) .icon-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border: none !important;
          }
          html:not([data-theme="light"]) .icon-card h1 {
            color: #ffffff !important;
          }
          html:not([data-theme="light"]) .details-info-card,
          html:not([data-theme="light"]) .course-content-card {
            background: var(--card-bg) !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: none !important;
          }
          html:not([data-theme="light"]) .course-detail-card p,
          html:not([data-theme="light"]) .course-detail-card span,
          html:not([data-theme="light"]) .course-detail-card a,
          html:not([data-theme="light"]) .course-content-card p,
          html:not([data-theme="light"]) .course-content-card li {
             !important;
          }
          
          /* Special teal/primary colors for headers and specific links */
          html:not([data-theme="light"]) .course-content-card h3 {
            color: var(--primary-color) !important;
          }
          html:not([data-theme="light"]) .instructor-name {
            color: #60a5fa !important;
          }
          html:not([data-theme="light"]) .details-info-card .rating-box {
            color: #818cf8 !important;
          }
          
          /* Light mode read reviews button */
          html[data-theme="light"] .read-reviews-btn {
            background: none !important;
            border: none !important;
            color: #0f766e !important;
            text-decoration: underline !important;
            padding: 0 !important;
          }
          
          /* Dark mode read reviews button */
          html:not([data-theme="light"]) .read-reviews-btn {
            background: var(--card-bg, #1e293b) !important;
            border: 1px solid var(--border-color, #334155) !important;
            color: #818cf8 !important;
            text-decoration: none !important;
            padding: 0.5rem 1.2rem !important;
            border-radius: 20px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
          html:not([data-theme="light"]) .read-reviews-btn:hover {
            background: var(--primary-color, #0f766e) !important;
            color: #ffffff !important;
            border-color: var(--primary-color, #0f766e) !important;
          }
          
          /* Bullet points for highlights */
          html:not([data-theme="light"]) .course-content-card .highlight-item {
             background: transparent !important;
             padding: 0 !important;
             border-radius: 0 !important;
          }
          html:not([data-theme="light"]) .course-content-card .highlight-item-hash {
             width: 6px;
             height: 6px;
             display: inline-block !important;
             background- !important;
             border-radius: 50% !important;
             color: transparent !important;
             overflow: hidden !important;
             margin-right: 8px;
          }
          
          /* Dark mode text and icons overrides */
          html:not([data-theme="light"]) .course-detail-card [style*="color: #475569"],
          html:not([data-theme="light"]) .course-detail-card [style*="color: #64748b"],
          html:not([data-theme="light"]) .instructor-name,
          html:not([data-theme="light"]) .course-detail-card [style*="color: #0f172a;"] {
             color: #ffffff !important;
          }
          html:not([data-theme="light"]) .course-detail-card [style*="color: #475569"] svg,
          html:not([data-theme="light"]) .course-detail-card [style*="color: #64748b"] svg {
             stroke: #ffffff !important;
          }
          html:not([data-theme="light"]) .course-detail-card a[style*="color: #0284c7;"] {
             color: #ffffff !important;
          }
          html:not([data-theme="light"]) .course-content-card ul[style*="color: #334155;"] {
             color: #ffffff !important;
          }
          html:not([data-theme="light"]) .course-content-card .highlight-item {
             color: #ffffff !important;
          }
        </style>
        <div class="course-detail-wrapper" style="min-height: calc(100vh - 70px); padding: 40px 0;">
        <div class="course-detail-page" style="max-width: 1000px; margin: 0 auto; padding: 0 20px;">
          <!-- Top Card -->
          <div class="course-detail-card" style="display: flex; flex-wrap: wrap; gap: 2rem; margin-bottom: 2rem;">
            
            <!-- Left Side / Icon -->
            <div class="icon-card" style="flex: 1; min-width: 250px; border-radius: 12px; padding: 3rem 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border: 2px solid #d1d5db; background: var(--light-card-bg, #fff);">
              <div style="margin-bottom: 1.5rem; display: flex; justify-content: center; align-items: center;">
                ${iconHtml}
              </div>
              <h1 style="font-size: 1.8rem; text-align: center; margin: 0; font-family: 'Playfair Display', serif; font-weight: 700;">${course.title}</h1>
            </div>

            <!-- Right Side / Details -->
            <div style="flex: 2; min-width: 300px; display: flex; flex-direction: column;">
              <div style="margin-bottom: 1.5rem;">
                <p style="margin: 0 0 0.5rem 0; color: #475569; display: flex; align-items: center; gap: 8px; font-weight: 500;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 
                  Instructor: <span class="instructor-name" style="font-weight: 600;">${course.instructor || course.teacherId?.name || "Unknown"}</span>
                </p>
                <p style="margin: 0 0 0.5rem 0; color: #64748b; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <a href="${course.teacherId?.linkedinUrl || "#"}" target="_blank" style="color: #0284c7; text-decoration: none;">LinkedIn Profile</a>
                </p>
                <p style="margin: 0 0 0.5rem 0; color: #64748b; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <a href="${course.teacherId?.githubUrl || "#"}" target="_blank" style="color: #0284c7; text-decoration: none;">GitHub Profile</a>
                </p>
                
              </div>

              <div class="details-info-card" style="border: 2px solid #d1d5db; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--light-card-bg, #fff);">
                <div style="font-weight: 500; font-size: 0.95rem;">Company: <span style="font-weight: 600; color: #E8702A !important;">${course.company || course.teacherId?.company || "N/A"}</span></div>
                <div style="font-weight: 500; font-size: 0.95rem;">Role: <span style="font-weight: 600;">${course.role || course.teacherId?.profession || "N/A"}</span></div>
                ${isEnrolled ? `<div style="font-weight: 500; font-size: 0.95rem;">Mobile: <span style="font-weight: 400;">${course.teacherId?.mobileNumber || "N/A"}</span></div>` : ""}
                <div style="font-weight: 500; font-size: 0.95rem;">Duration: <span style="font-weight: 400;">${course.duration || "Self-paced"} months</span></div>
                <div style="font-weight: 500; font-size: 0.95rem;">Students: <span style="font-weight: 400;">${course.enrolledCount || 0}</span></div>
              </div>

              <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: #64748b; letter-spacing: 0.5px; margin-bottom: 0.25rem;">RATING</div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: #0f172a;">(${(course.teacherId?.averageRating || 0).toFixed(1)})</span>
                    <div style="display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                      ${Array(
                        Math.max(
                          0,
                          Math.min(
                            5,
                            Math.round(course.teacherId?.averageRating || 0),
                          ),
                        ),
                      )
                        .fill(
                          '<svg width="22" height="22" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
                        )
                        .join("")}${Array(
                        Math.max(
                          0,
                          5 - Math.round(course.teacherId?.averageRating || 0),
                        ),
                      )
                        .fill(
                          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
                        )
                        .join("")}
                    </div>
                  </div>
                </div>
                <button class="read-reviews-btn" onclick="window.viewCourseReviews('${courseId}')" style="background: none; border: none; color: #0f766e; text-decoration: underline; cursor: pointer; font-weight: 500; font-size: 0.95rem; padding: 0; margin-top: 15px;">Read all reviews</button>
              </div>

              <div>
                ${
                  !auth.isAuthenticated()
                    ? `<button class="btn btn-primary course-detail-enroll-btn" onclick="enrollCourse('${courseId}')" style="padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; border: none; width: max-content; color: white;">Login to Enroll - ₹${course.price || 0}</button>`
                    : auth.isStudent() && !isEnrolled
                      ? `<button class="btn btn-primary course-detail-enroll-btn" onclick="enrollCourse('${courseId}')" style="padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; border: none; width: max-content; color: white;">Enroll Now - ₹${course.price || 0}</button>`
                      : auth.isStudent() && isEnrolled
                        ? `<button class="btn btn-success" disabled style="padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; border: none; width: max-content; background: #10b981; color: white;">Already Enrolled</button>`
                        : auth.isTeacher() &&
                            auth.getCurrentUser()._id ===
                              (course.teacherId?._id || course.teacherId)
                          ? `<a href="/edit-course/${courseId}" class="btn btn-secondary" style="padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; width: max-content; display: inline-block;">Edit Course</a>`
                          : ""
                }
              </div>
            </div>
          </div>

          <!-- Bottom Card -->
          <div class="course-content-card" style="border-radius: 12px; padding: 2rem; border: 2px solid #d1d5db;">
            <h3 style="font-size: 1.4rem; margin: 0 0 1rem 0; font-family: 'Playfair Display', serif;">Description</h3>
            <p style="line-height: 1.7; margin-bottom: 2rem; font-family: 'Inter', sans-serif;">${course.fullDescription || course.description}</p>

            <h3 style="font-size: 1.4rem; margin: 0 0 1rem 0; font-family: 'Playfair Display', serif;">Highlights</h3>
            <ul style="list-style-type: none; padding: 0; margin: 0; color: #334155; line-height: 1.7; display: flex; flex-wrap: wrap; gap: 1.5rem; font-family: 'Inter', sans-serif;">
              ${(Array.isArray(course.highlights)
                ? course.highlights
                : course.highlights
                  ? [course.highlights]
                  : []
              )
                .map(
                  (
                    highlight,
                  ) => `<li class="highlight-item" style="display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.95rem; font-weight: 500;">
                  <span class="highlight-item-hash" style="color: #E8702A;">#</span>
                  <span>${highlight}</span>
                </li>`,
                )
                .join("")}
            </ul>
          </div>
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
              <label for="mobileNumber">Mobile Number:</label>
              <input type="tel" id="mobileNumber" name="mobileNumber" value="${user.mobileNumber || ""}" pattern="[0-9]{10}" placeholder="10-digit mobile number">
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
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (window.toggleLoading) window.toggleLoading(submitBtn, true);

        const name = document.getElementById("name").value;
        const mobileNumber = document.getElementById("mobileNumber").value;
        const linkedinUrl = document.getElementById("linkedinUrl").value;
        const githubUrl = document.getElementById("githubUrl").value;
        const result = await auth.updateProfile({
          name,
          mobileNumber,
          linkedinUrl,
          githubUrl,
        });

        if (window.toggleLoading) window.toggleLoading(submitBtn, false);

        const messageDiv = document.getElementById("message");
        messageDiv.className = `message ${result.success ? "success" : "error"}`;
        messageDiv.textContent = result.message;
      });

    document
      .getElementById("passwordForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (window.toggleLoading) window.toggleLoading(submitBtn, true);

        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const result = await auth.changePassword(oldPassword, newPassword);

        if (window.toggleLoading) window.toggleLoading(submitBtn, false);

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
      <style>
        .student-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .premium-card {
          background: var(--bg-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
          overflow: hidden;
        }
        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        html:not([data-theme="light"]) .premium-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        .premium-card-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: rgba(232, 112, 42, 0.1);
          color: #E8702A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        html:not([data-theme="light"]) .premium-card-icon {
          background: rgba(102, 126, 234, 0.15);
          color: #667eea;
        }
        .premium-card h3 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem 0;
          color: var(--text-color);
        }
        .premium-card p {
          font-size: 0.95rem;
          color: var(--text-color);
          opacity: 0.8;
          margin: 0 0 1.5rem 0;
          flex-grow: 1;
        }
        .premium-card-link {
          margin-top: auto;
          text-decoration: none;
          font-weight: 600;
          color: #E8702A;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: gap 0.2s;
        }
        html:not([data-theme="light"]) .premium-card-link {
          color: #667eea;
        }
        .premium-card-link:hover {
          gap: 0.6rem;
        }
      </style>
      <div class="dashboard student-dashboard" style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
        <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Welcome, ${user.name || user.email}! 👋</h2>
        <p style="color: var(--text-color); opacity: 0.8; font-size: 1.1rem;">Here is an overview of your progress and activities.</p>
        <div class="student-dashboard-grid">
          <div class="premium-card">
            <div class="premium-card-icon">
              <span class="material-icons" style="font-size: 1.8rem;">school</span>
            </div>
            <h3>My Enrollments</h3>
            <p>Explore courses you're currently enrolled in and track your learning progress.</p>
            <a href="/my-enrollments" class="premium-card-link">View Enrollments <span class="material-icons" style="font-size: 1.2rem;">arrow_forward</span></a>
          </div>
          <div class="premium-card">
            <div class="premium-card-icon">
              <span class="material-icons" style="font-size: 1.8rem;">explore</span>
            </div>
            <h3>Browse Courses</h3>
            <p>Discover new courses, gain new skills, and unlock better opportunities.</p>
            <a href="/courses" class="premium-card-link">Explore Courses <span class="material-icons" style="font-size: 1.2rem;">arrow_forward</span></a>
          </div>
          <div class="premium-card">
            <div class="premium-card-icon">
              <span class="material-icons" style="font-size: 1.8rem;">person</span>
            </div>
            <h3>My Profile</h3>
            <p>Manage your account settings, update your details, and personalize your experience.</p>
            <a href="/profile" class="premium-card-link">Edit Profile <span class="material-icons" style="font-size: 1.2rem;">arrow_forward</span></a>
          </div>
          <div class="premium-card">
            <div class="premium-card-icon">
              <span class="material-icons" style="font-size: 1.8rem;">receipt_long</span>
            </div>
            <h3>Payments</h3>
            <p>View your transaction history, receipts, and manage your billing information.</p>
            <a href="/payment" class="premium-card-link">View History <span class="material-icons" style="font-size: 1.2rem;">arrow_forward</span></a>
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
        <div style="margin-bottom: 2rem;">
          <button id="btn-start-live" class="btn btn-primary">Start Live Class</button>
        </div>
        <div id="notification-badge" style="margin-bottom: 2rem;"></div>
        <div id="tab-buttons" style="display: flex; gap: 1rem; margin-bottom: 2rem;"></div>
        <div id="content-courses" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));"></div>
        <div id="content-students" style="display: none;"></div>
      </div>
    `;
    // Add event listener for start live class
    const btnStartLive = document.getElementById("btn-start-live");
    if (btnStartLive) {
      btnStartLive.addEventListener("click", () => {
        router.navigate("create-meeting");
      });
    }

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
          <a href="/course-detail/${course._id}" class="btn btn-secondary" style="display: inline-block; margin-top: 1rem;">
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
            <a href="/admin-approve-courses" class="btn btn-primary">Open Queue</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>🧑‍🎓 Student Approvals</h3>
            <p>Review student registration requests and move approved learners to payment.</p>
            <a href="/admin-student-approvals" class="btn btn-primary">Review Requests</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>💰 Payment Operations</h3>
            <p>Validate student transactions and complete approvals without leaving this dashboard.</p>
            <a href="/admin-payments" class="btn btn-primary">Manage Payments</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>👨‍🏫 Teachers View</h3>
            <p>Monitor teacher-side enrollment visibility and student activation status.</p>
            <a href="/admin-teachers" class="btn btn-secondary">Inspect</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>💸 Dues to Teacher</h3>
            <p>Settle the pending payments to teachers after taking the commission.</p>
            <a href="/admin-teacher-dues" class="btn btn-primary">Settle Dues</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>👥 User Details</h3>
            <p>View all registered students and teachers contact information.</p>
            <a href="/admin-details" class="btn btn-secondary">View Details</a>
          </div>

          <div class="dashboard-card admin-card">
            <h3>⚙️ Account Settings</h3>
            <p>Centralized profile, account security options, and logout under one settings page.</p>
            <a href="/settings" class="btn btn-secondary">Go to Settings</a>
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
                    ${(course.highlights || []).map((h) => `<li>${h}</li>`).join("")}
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
          router.navigate("admin-approve-courses");
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
          router.navigate("admin-approve-courses");
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
                <p><strong>Teacher Company:</strong> ${course.company || teacher.company || "N/A"}</p>
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
          router.navigate("admin-student-approvals");
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
          router.navigate("admin-student-approvals");
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
          <div class="page-header" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
            <div>
              <h2 style="margin:0">👨‍🏫 Teachers Overview</h2>
              <p style="margin:0">View all teachers and their course statistics</p>
            </div>
            <div class="search-bar" style="display:flex; align-items:center; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0.1rem 0.5rem; flex: 1; max-width: 400px; min-width: 250px;">
              <span style="color: #94a3b8; padding: 0 0.5rem; font-size: 1.1rem;">&#128269;</span>
              <input type="text" id="teacherSearchInput" placeholder="Search teachers by name or email..." style="background: transparent; border: none; color: white; padding: 0.5rem; outline: none; width: 100%;">
            </div>
          </div>
          <div class="table-container courses-table" style="overflow-x: auto;">
            <table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 600px;">
              <thead>
                <tr>
                  <th style="padding: 1rem; text-align: left; background: rgba(102, 126, 234, 0.1); border-bottom: 1px solid var(--border-color); font-weight: 600;">Name</th>
                  <th style="padding: 1rem; text-align: left; background: rgba(102, 126, 234, 0.1); border-bottom: 1px solid var(--border-color); font-weight: 600;">Email</th>
                  <th style="padding: 1rem; text-align: left; background: rgba(102, 126, 234, 0.1); border-bottom: 1px solid var(--border-color); font-weight: 600;">Actions</th>
                </tr>
              </thead>
              <tbody id="teachersTableBody">
      `;

      if (teachers.length === 0) {
        html += `<tr><td colspan="3" style="padding: 1rem; border-bottom: 1px solid var(--border-color);">No teachers found.</td></tr>`;
      } else {
        teachers.forEach((t) => {
          html += `
            <tr class="teacher-row" style="transition: background-color 0.2s;">
              <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${t.name}</td>
              <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${t.email}</td>
              <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                <button class="btn btn-secondary btn-small" onclick="router.navigate('admin-teacher-details?id=${t._id}&name=${encodeURIComponent(t.name)}')">View Courses & Students</button>
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

      // Make search functional
      const searchInput = document.getElementById("teacherSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const searchTerm = e.target.value.toLowerCase();
          const rows = document.querySelectorAll(".teacher-row");
          rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? "" : "none";
          });
        });
      }

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
      router.navigate("admin-teachers");
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
            <a href="/admin-teachers" class="btn btn-secondary">Back to Teachers</a>
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
            <a href="/admin-dashboard" class="btn btn-secondary">Back to Dashboard</a>
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

        <div style="display: flex; flex-direction: row; gap: 1.5rem; margin-bottom: 2rem;">
            <div style="flex: 1; background: linear-gradient(135deg, #667eea, #764ba2); padding: 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">⏳ Pending Review</h3>
              <p style="margin: 0; font-size: 2rem; font-weight: bold;" id="pending-count">0</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.8;">Awaiting confirmation</p>
            </div>
            <div style="flex: 1; background: linear-gradient(135deg, #10b981, #059669); padding: 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; opacity: 0.9;">✅ Approved</h3>
              <p style="margin: 0; font-size: 2rem; font-weight: bold;" id="completed-count">0</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.8;">Successfully confirmed</p>
            </div>
            <div style="flex: 1; background: linear-gradient(135deg, #f59e0b, #d97706); padding: 1.5rem; border-radius: 12px; color: white; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);">
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
          <div class="page-header" style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; flex: 1;">
              <h2 style="margin:0">My Courses</h2>
              <div class="search-bar" style="display:flex; align-items:center; background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 0.1rem 0.5rem; flex: 1; max-width: 500px; min-width: 250px;">
                <span class="material-icons" style="color: #94a3b8; padding: 0 0.5rem; font-size: 1.3rem;">search</span>
                <input type="text" id="myCourseSearchInput" placeholder="Search my courses..." style="background: transparent; border: none;  padding: 0.5rem; outline: none; width: 100%;">
              </div>
            </div>
            <a href="/create-course" class="btn btn-primary" style="margin-left:auto">Create New Course</a>
          </div>
          <div class="courses-table" style="overflow-x: auto;">
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
                      <a href="/course-detail/${course._id}" class="btn btn-small">View</a>
                      <a href="/edit-course/${course._id}" class="btn btn-small">Edit</a>
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

      // Search functionality
      const searchInput = document.getElementById("myCourseSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const searchTerm = e.target.value.toLowerCase().trim();
          const rows = appDiv.querySelectorAll("tbody tr");
          rows.forEach((row) => {
            if (row.cells.length > 1) {
              const text = row.textContent.toLowerCase();
              row.style.display = text.includes(searchTerm) ? "" : "none";
            }
          });
        });
      }
    } catch (e) {
      console.error(e);
      appDiv.innerHTML =
        "<div class='error'>Failed to load your courses.</div>";
    }
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
              router.navigate("my-courses");
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

  async renderEditCourse(courseId) {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = "<div class='loading'>Loading course details...</div>";

    try {
      const response = await api.getCourseById(courseId);
      const course = response.data;
      if (!course) throw new Error("Course not found");

      appDiv.innerHTML = `
        <div class="create-course-page">
          <h2>Edit Course</h2>
          <form id="editCourseForm" class="form-large">
            <div class="form-group">
              <label for="title">Course Title:</label>
              <input type="text" id="title" name="title" value="${course.title || ""}" required>
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea id="description" name="description" rows="4" required>${course.description || ""}</textarea>
            </div>
            <div class="form-group">
              <label for="price">Price (₹):</label>
              <input type="number" id="price" name="price" step="0.01" value="${course.price || ""}" required>
            </div>
            <div class="form-group">
              <label for="duration">Duration (months):</label>
              <input type="number" id="duration" name="duration" min="1" max="60" value="${course.duration || ""}" required>
            </div>
            <div class="form-group">
              <label for="company">Company Name:</label>
              <input type="text" id="company" name="company" value="${course.company || ""}" required>
            </div>
            <div class="form-group">
              <label for="role">Job Role/Position:</label>
              <input type="text" id="role" name="role" value="${course.role || ""}" required>
            </div>
            <div class="form-group">
              <label for="highlights">Course Highlights & Specifications:</label>
              <div id="highlightsContainer">
                ${(course.highlights && course.highlights.length > 0
                  ? course.highlights
                  : [""]
                )
                  .map(
                    (h) => `
                  <div class="highlight-input-group">
                    <input type="text" class="highlight-input" value="${h.replace(/"/g, "&quot;")}" placeholder="Add a highlight" maxlength="500">
                    <button type="button" class="btn btn-small btn-danger remove-highlight">Remove</button>
                  </div>
                `,
                  )
                  .join("")}
              </div>
              <button type="button" id="addHighlightBtn" class="btn btn-secondary btn-small">+ Add Highlight</button>
            </div>
            <button type="submit" class="btn btn-primary">Update Course</button>
          </form>
          <div id="editMessage" class="message"></div>
        </div>
      `;

      const highlightsContainer = document.getElementById(
        "highlightsContainer",
      );
      const addHighlightBtn = document.getElementById("addHighlightBtn");

      function updateRemoveButtons() {
        const highlightInputs = highlightsContainer.querySelectorAll(
          ".highlight-input-group",
        );
        highlightInputs.forEach((group) => {
          const removeBtn = group.querySelector(".remove-highlight");
          removeBtn.style.display =
            highlightInputs.length > 1 ? "block" : "none";
        });
      }

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

      highlightsContainer
        .querySelectorAll(".remove-highlight")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.target.closest(".highlight-input-group").remove();
            updateRemoveButtons();
          });
        });

      updateRemoveButtons();

      document
        .getElementById("editCourseForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const form = e.target;
          const msgDiv = document.getElementById("editMessage");
          const submitBtn = form.querySelector('button[type="submit"]');

          if (window.toggleLoading) window.toggleLoading(submitBtn, true);

          const highlightInputs =
            highlightsContainer.querySelectorAll(".highlight-input");
          const highlights = Array.from(highlightInputs)
            .map((input) => input.value.trim())
            .filter((value) => value.length > 0);

          if (highlights.length === 0) {
            msgDiv.className = "message error";
            msgDiv.textContent = "Please add at least one highlight";
            if (window.toggleLoading) window.toggleLoading(submitBtn, false);
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
            msgDiv.className = "message";
            msgDiv.textContent = "Updating course...";
            const res = await api.updateCourse(courseId, courseData);
            if (res.success || res.data) {
              msgDiv.className = "message success";
              msgDiv.textContent =
                "Course updated successfully! Redirecting...";
              setTimeout(() => {
                router.navigate("my-courses");
              }, 1000);
            } else {
              msgDiv.className = "message error";
              msgDiv.textContent = res.message || "Update failed";
            }
          } catch (error) {
            msgDiv.className = "message error";
            msgDiv.textContent = error.message;
          } finally {
            if (window.toggleLoading) window.toggleLoading(submitBtn, false);
          }
        });
    } catch (err) {
      appDiv.innerHTML = `<div class="error-message">Error loading course: ${err.message}</div>`;
    }
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

      // Find recently approved enrollments (approved within last 5 minutes)
      const approvedEnrollments = enrollments.filter((e) => {
        if (e.status !== "active") return false;

        // Check if approval was recent (within 5 minutes)
        const enrollmentDate = new Date(e.updatedAt || e.createdAt);
        const currentDate = new Date();
        const minutesDiff = (currentDate - enrollmentDate) / (1000 * 60);

        return minutesDiff <= 5; // Only show for approvals within last 5 minutes
      });

      // Check if we've already dismissed this notification in current session
      const shownNotificationKey = "approval_notification_shown";
      const notificationAlreadyShown =
        sessionStorage.getItem(shownNotificationKey);

      if (approvedEnrollments.length > 0 && !notificationAlreadyShown) {
        html += `
          <div id="approval-notification" 
               style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                      color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;
                      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                      transition: opacity 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                  ✅ Course Approval Notification
                </h3>
                <p style="margin: 0; font-size: 0.95rem;">
                  Great! Your enrollment in ${approvedEnrollments[0].courseId?.title || "a course"}
                  has been approved by the admin. You can now access the course and learn from your teacher!
                </p>
              </div>
              <button onclick="document.getElementById('approval-notification').style.display='none'; sessionStorage.setItem('${shownNotificationKey}', 'true');"
                      style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-left: 1rem; flex-shrink: 0;">
                ✕
              </button>
            </div>
          </div>
        `;

        // Auto-hide notification after 5 minutes (300000 ms)
        html += `
          <script>
            (function() {
              const notificationEl = document.getElementById('approval-notification');
              if (notificationEl) {
                // Auto-hide after 5 minutes
                setTimeout(function() {
                  if (notificationEl) {
                    notificationEl.style.opacity = '0';
                    setTimeout(() => {
                      if (notificationEl && notificationEl.parentNode) {
                        notificationEl.style.display = 'none';
                      }
                    }, 300);
                  }
                }, 300000); // 5 minutes in milliseconds
              }
              sessionStorage.setItem('${shownNotificationKey}', 'true');
            })();
          </script>
        `;
      }

      html += `<div class="enrollments-list" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">`;

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
                '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;"><span style="margin-right: 4px;">⏳</span> Awaiting Admin Approval</span>';
            } else if (status === "payment_requested") {
              statusBadge =
                '<span style="background: #e0f2fe; color: #075985; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;"><span style="margin-right: 4px;">💳</span> Pay Now</span>';
            } else if (
              status === "payment_submitted" ||
              status === "transaction_submitted"
            ) {
              statusBadge =
                '<span style="background: #ede9fe; color: #5b21b6; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;"><span style="margin-right: 4px;">🧾</span> Payment Submitted</span>';
              infoMessage =
                '<div style="margin-top: 10px; font-size: 0.85rem; color: #5b21b6; background: #ede9fe; padding: 8px; border-radius: 4px;">Thank you! Following the payment submission, the admin or <span class="brand-stud">Stud</span><span class="brand-bridge">Bridge</span> Platform will reach out to you within 24 hours.</div>';
            } else if (status === "active") {
              statusBadge =
                '<span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Active</span>';
            } else if (status === "rejected") {
              statusBadge =
                '<span style="background: #fee2e2; color: #991b1b; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px; margin-bottom: 2px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Rejected</span>';
            } else {
              statusBadge =
                '<span style="background: #dbeafe; color: #082f49; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">📚 In Progress</span>';
            }

            const showPayNow = status === "payment_requested";
            const showWaitingPaymentConfirm = status === "payment_submitted";
            const canAccessTeacher = status === "active";
            const amount = enrollment.payableAmount || course.price || 0;
            const courseIdStr =
              course._id ||
              (enrollment.courseId && enrollment.courseId._id) ||
              enrollment.courseId;

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
                  <div style="background: ${status === "active" ? "#f0f4ff" : "#fff3cd"}; border-left: 4px solid ${status === "active" ? "#667eea" : "#ff9800"}; padding: 1.25rem 1.5rem; 
                              border-radius: 8px; margin-bottom: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; color: ${status === "active" ? "#667eea" : "#856404"}; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      Teacher Information
                    </h4>
                    <p style="margin: 0.5rem 0; color: #333; font-weight: 600; font-size: 1.05rem;">
                      ${course.instructor || teacher.name || "Unknown Teacher"}
                    </p>
                    <p style="margin: 0.35rem 0; color: #64748b; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="2"></line><line x1="15" y1="22" x2="15" y2="2"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="7" x2="9" y2="7"></line><line x1="4" y1="17" x2="9" y2="17"></line><line x1="15" y1="7" x2="20" y2="7"></line><line x1="15" y1="17" x2="20" y2="17"></line></svg>
                      ${course.company || teacher.company || "N/A"}
                    </p>
                    <p style="margin: 0.35rem 0; color: #64748b; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      ${course.role || teacher.profession || teacher.role || "Instructor"}
                    </p>
                    ${
                      canAccessTeacher
                        ? `
                      <hr style="margin: 1rem 0; border: none; border-top: 1px solid rgba(0,0,0,0.08);">
                      <p style="margin: 0.4rem 0; color: #475569; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="20" height="20" style="flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        ${teacher.email || "N/A"}
                      </p>
                      <p style="margin: 0.4rem 0; color: #475569; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
                        <svg width="20" height="20" style="flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        ${teacher.mobileNumber || "N/A"}
                      </p>
                    `
                        : `
                      <p style="margin: 1rem 0 0 0; color: #d97706; font-size: 0.9rem; font-weight: 600; display: flex; align-items: flex-start; gap: 0.5rem; line-height: 1.4;">
                        <svg width="18" height="18" style="flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.24l-3.26-1.5M12 12v5"></path><path d="M12 7v.01"></path></svg>
                        Full teacher details will be visible after admin approval
                      </p>
                    `
                    }
                  </div>

                  <!-- Course Details Grid -->
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                      <span style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; display: flex; align-items: center; gap: 0.35rem;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        Price
                      </span>
                      <p style="margin: 0.35rem 0 0 0; color: #1e293b; font-size: 1.15rem; font-weight: 800;">
                        ₹${course.price || 0}
                      </p>
                    </div>
                    <div>
                      <span style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; display: flex; align-items: center; gap: 0.35rem;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Duration
                      </span>
                      <p style="margin: 0.35rem 0 0 0; color: #1e293b; font-size: 1.15rem; font-weight: 800;">
                        ${course.duration || 0} months
                      </p>
                    </div>
                  </div>

                  <!-- Progress Bar (if in progress) -->
                  ${
                    enrollment.progress
                      ? `
                    <div style="margin-bottom: 1.5rem;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.95rem; color: #64748b; font-weight: 500;">Progress</span>
                        <span style="font-weight: 700; color: #667eea;">${enrollment.progress}%</span>
                      </div>
                      <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${enrollment.progress}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px;"></div>
                      </div>
                    </div>
                  `
                      : ""
                  }

                  <!-- Action Buttons -->
                  <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                        <button onclick="${canAccessTeacher ? `openWhatsApp('${teacher.mobileNumber || ""}', '${course.title || ""}')` : `showInfoPopup('Teacher contact is available after activation')`}"
                          style="flex: 1; padding: 0.75rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem; background-color: ${canAccessTeacher ? "#25d366" : "#cbd5e1"} !important; color: ${canAccessTeacher ? "white" : "#64748b"} !important; 
                                    border: none; border-radius: 6px; font-weight: 600; cursor: ${status === "active" ? "pointer" : "not-allowed"}; font-size: 0.95rem;
                                    transition: background-color 0.3s;"
                          onmouseover="${canAccessTeacher ? "this.style.setProperty('background-color', '#20ba5a', 'important')" : ""}"
                          onmouseout="${canAccessTeacher ? "this.style.setProperty('background-color', '#25d366', 'important')" : ""}"
                          onmousedown="${canAccessTeacher ? "this.style.setProperty('color', 'white', 'important')" : ""}"
                          ${!canAccessTeacher ? "disabled" : ""}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      WhatsApp
                    </button>
                    
                    <button onclick="${canAccessTeacher ? `router.navigate('course-detail/${courseIdStr}')` : showPayNow ? `submitPaymentPrompt('${enrollment.paymentId || enrollment._id}', '${course.title || "Course"}', '${amount}')` : showWaitingPaymentConfirm ? `showInfoPopup('Your payment is submitted. Please wait for admin confirmation.')` : `showInfoPopup('Please wait for admin approval')`}"
                              style="flex: 1; padding: 0.75rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem; background-color: ${canAccessTeacher ? "#667eea" : showPayNow ? "#0ea5e9" : "#cbd5e1"} !important; color: ${canAccessTeacher || showPayNow ? "white" : "#64748b"} !important; 
                                border: none; border-radius: 6px; font-weight: 600; cursor: ${canAccessTeacher || showPayNow ? "pointer" : "not-allowed"}; font-size: 0.95rem;
                                    transition: background-color 0.3s;"
                          onmouseover="${canAccessTeacher ? "this.style.setProperty('background-color', '#5568d3', 'important')" : showPayNow ? "this.style.setProperty('background-color', '#0284c7', 'important')" : ""}"
                          onmouseout="${canAccessTeacher ? "this.style.setProperty('background-color', '#667eea', 'important')" : showPayNow ? "this.style.setProperty('background-color', '#0ea5e9', 'important')" : ""}"
                          onmousedown="this.style.setProperty('color', 'white', 'important')"
                          ${!canAccessTeacher && !showPayNow && !showWaitingPaymentConfirm ? "disabled" : ""}>
                          ${canAccessTeacher ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> View Course` : showPayNow ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> Pay Now ₹${amount}` : showWaitingPaymentConfirm ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Await Confirmation` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Locked`}
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
        <style>
          /* Light mode defaults */
          :root {
            --dashboard-bg: #fffbf7;
            --card-bg: #ffffff;
            --text-main: #1e3a8a;
            --text-secondary: #475569;
            --text-dark: #1e293b;
            --text-darker: #0f172a;
            --border-color: #f1f5f9;
            --border-color-alt: #e2e8f0;
            --avatar-bg: #e2e8f0;
            --info-box-bg: #fff7ed;
            --info-box-border: #ffedd5;
            --progress-bg: #e2e8f0;
            --btn-secondary-bg: #e2e8f0;
            --btn-secondary-text: #334155;
            --btn-secondary-hover-bg: #cbd5e1;
            --review-input-bg: #ffffff;
            --review-input-border: #e2e8f0;
            --primary-bg: #f97316;
            --primary-hover: #ea580c;
            --primary-text: #d97706;
            --primary-badge-bg: #ffedd5;
            --primary-focus: #f97316;
            --pending-status-bg: rgba(217, 119, 6, 0.1);
            --pending-status-border: rgba(217, 119, 6, 0.2);
            --pending-status-text: #d97706;
          }

          /* Dark mode overrides. */
          html:not([data-theme="light"]) {
            --dashboard-bg: #1a1b26;
            --card-bg: #1e293b;
            --text-main: #60a5fa;
            --text-secondary: #94a3b8;
            --text-dark: #f8fafc;
            --text-darker: #f1f5f9;
            --border-color: #334155;
            --border-color-alt: #475569;
            --avatar-bg: #334155;
            --info-box-bg: #334155;
            --info-box-border: #475569;
            --progress-bg: #475569;
            --btn-secondary-bg: #334155;
            --btn-secondary-text: #f8fafc;
            --btn-secondary-hover-bg: #475569;
            --review-input-bg: #1e293b;
            --review-input-border: #475569;
            --primary-bg: #117864;
            --primary-hover: #0e6252;
            --primary-text: #117864;
            --primary-badge-bg: rgba(17, 120, 100, 0.2);
            --primary-focus: #117864;
            --pending-status-bg: rgba(17, 120, 100, 0.15);
            --pending-status-border: rgba(17, 120, 100, 0.3);
            --pending-status-text: #117864;
          }

          .courses-dashboard-container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            background-color: var(--dashboard-bg);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .courses-dashboard-grid {
            display: grid;
            grid-template-columns: 1.3fr 1fr;
            gap: 2rem;
            align-items: start;
          }
          @media (max-width: 900px) {
            .courses-dashboard-grid {
              grid-template-columns: 1fr;
            }
          }
          /* Custom Button Styles to override global button hover effects that turn text white */
          button.btn-view-course {
            flex: 1; min-width: 120px; padding: 0.75rem 1rem; border: none; border-radius: 20px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 1.05rem;
            background-color: var(--primary-bg) !important;
            color: #ffffff !important;
          }
          button.btn-view-course:hover {
            background-color: var(--primary-hover) !important;
            color: #ffffff !important;
          }
          button.btn-secondary-action {
            flex: 1; min-width: 120px; padding: 0.75rem 1rem; border: none; border-radius: 20px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 1.05rem;
            background-color: var(--btn-secondary-bg) !important;
            color: var(--btn-secondary-text) !important;
          }
          button.btn-secondary-action:hover {
            background-color: var(--btn-secondary-hover-bg) !important;
            color: var(--btn-secondary-text) !important;
          }
        </style>
        <div class="your-courses-page courses-dashboard-container">
          <div style="margin-bottom: 2rem;">
            <h1 style="margin: 0 0 0.5rem 0; font-size: 2.5rem; color: var(--text-main); font-weight: 700;">
              Your Courses Dashboard
            </h1>
            <p style="color: var(--text-secondary); margin: 0; font-size: 1.1rem;">
              Manage your enrolled courses and track their status
            </p>
          </div>
          
          <div class="courses-dashboard-grid">
            <!-- Approved Courses Column -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      `;

      if (approvedEnrollments.length > 0) {
        html += approvedEnrollments
          .map((enrollment) => {
            const course = enrollment.courseId || {};
            const teacher = course.teacherId || {};
            const courseIdStr =
              course._id ||
              course.id ||
              (typeof enrollment.courseId === "string"
                ? enrollment.courseId
                : enrollment.courseId?._id) ||
              "";

            return `
              <div style="background: var(--card-bg); border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.12); border: 1px solid var(--border-color);">
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
                  <h2 style="margin: 0; color: var(--text-dark); font-size: 1.6rem; font-weight: 700;">
                    ${course.title || "Unknown Course"}
                  </h2>
                  <div style="background: var(--primary-badge-bg); color: var(--primary-text); padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px;">
                    ACTIVE & APPROVED
                  </div>
                </div>

                <!-- Teacher Info -->
                <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; border-bottom: 1px solid var(--border-color-alt); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
                  <!-- Avatar -->
                  <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--avatar-bg); display: flex; justify-content: center; align-items: center; overflow: hidden; flex-shrink: 0;">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  
                  <!-- Name & Role -->
                  <div style="flex: 1; min-width: 180px;">
                    <div style="color: var(--text-darker); font-weight: 700; font-size: 1.25rem; margin-bottom: 0.2rem;">
                      ${course.instructor || teacher.name || "Unknown Teacher"}
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.95rem;">
                      Company: <span style="color: var(--text-dark);">${course.company || teacher.company || "N/A"}</span>
                    </div>
                    <div style="color: var(--text-secondary); font-size: 0.95rem;">
                      Role: <span style="color: var(--text-dark);">${course.role || teacher.profession || teacher.role || "Expert Instructor"}</span>
                    </div>
                  </div>
                  
                  <!-- Contact Support -->
                  <div style="display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; max-width: 210px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--avatar-bg); display: flex; justify-content: center; align-items: center; flex-shrink: 0;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      <span style="color: var(--text-dark); font-size: 0.95rem; font-weight: 500; line-height: 1.2;">
                        Contact ready for learning support
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Course Details Row -->
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                  <div style="flex: 1; min-width: 150px; background: var(--info-box-bg); padding: 1.2rem; border-radius: 10px; border: 1px solid var(--info-box-border); display: flex; align-items: flex-start; gap: 0.75rem;">
                    <svg width="24" height="24" style="margin-top: 0.1rem; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                    <div>
                      <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.3rem;">Fee Amount</div>
                      <div style="color: var(--text-darker); font-size: 1.4rem; font-weight: 700;">₹${course.price || 0}</div>
                    </div>
                  </div>
                  <div style="flex: 1; min-width: 150px; background: var(--info-box-bg); padding: 1.2rem; border-radius: 10px; border: 1px solid var(--info-box-border); display: flex; align-items: flex-start; gap: 0.75rem;">
                    <svg width="24" height="24" style="margin-top: 0.1rem; flex-shrink: 0;" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <div>
                      <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.3rem;">Duration</div>
                      <div style="color: var(--text-darker); font-size: 1.4rem; font-weight: 700;">${course.duration || "2 Months"}</div>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color-alt); padding-bottom: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <span style="font-size: 1.05rem; color: var(--text-dark); font-weight: 600;">Learning Progress</span>
                    <span style="font-weight: 700; font-size: 1.05rem; color: #f97316;">${enrollment.progress || 0}%</span>
                  </div>
                  <div style="width: 100%; height: 8px; background: var(--progress-bg); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${enrollment.progress || 0}%; height: 100%; background: #f97316; border-radius: 4px; transition: width 0.3s;"></div>
                  </div>
                </div>

                <!-- Review Section -->
                <div style="margin-bottom: 1.5rem;" onclick="event.stopPropagation();">
                  <h4 style="margin: 0 0 0.75rem 0; color: var(--text-dark); font-size: 1.05rem;">Rate this Course</h4>
                  <div class="star-rating" data-course="${courseIdStr}" style="display: flex; gap: 0.25rem; margin-bottom: 0.75rem; font-size: 1.7rem; color: #cbd5e1;">
                    <span id="star-${courseIdStr}-1" onclick="window.setRating('${courseIdStr}', 1)" style="cursor: pointer; color: #cbd5e1;">★</span>
                    <span id="star-${courseIdStr}-2" onclick="window.setRating('${courseIdStr}', 2)" style="cursor: pointer; color: #cbd5e1;">★</span>
                    <span id="star-${courseIdStr}-3" onclick="window.setRating('${courseIdStr}', 3)" style="cursor: pointer; color: #cbd5e1;">★</span>
                    <span id="star-${courseIdStr}-4" onclick="window.setRating('${courseIdStr}', 4)" style="cursor: pointer; color: #cbd5e1;">★</span>
                    <span id="star-${courseIdStr}-5" onclick="window.setRating('${courseIdStr}', 5)" style="cursor: pointer; color: #cbd5e1;">★</span>
                  </div>
                  <input type="hidden" id="rating-val-${courseIdStr}" value="0">
                  <textarea id="exp-${courseIdStr}" class="custom-scrollbar" rows="3" style="width: 100%; box-sizing: border-box; border-radius: 8px; border: 1px solid var(--review-input-border); background: var(--review-input-bg); color: var(--text-dark); padding: 0.75rem; resize: vertical; max-height: 150px; outline: none; transition: border-color 0.3s; font-family: inherit; font-size: 1rem;" placeholder="Write your experience..." onfocus="this.style.borderColor='var(--primary-focus)'" onblur="this.style.borderColor='var(--review-input-border)'"></textarea>
                  <div id="review-msg-${courseIdStr}" style="margin-top: 0.5rem; font-size: 0.95rem;"></div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                  <button class="btn-view-course" onclick="router.navigate('course-detail/${courseIdStr}')">
                    View Course
                  </button>
                  <button class="btn-secondary-action" onclick="openWhatsApp('${teacher.mobileNumber || ""}', '${course.title || ""}')">
                    Contact Teacher
                  </button>
                  <button class="btn-secondary-action" onclick="window.submitReview('${courseIdStr}', '${typeof teacher === "string" ? teacher : teacher._id || teacher.id || ""}')">
                    Submit Review
                  </button>
                </div>
                
                <script>
                  (async () => {
                    window.currentTeacherId = '${typeof teacher === "string" ? teacher : teacher._id || teacher.id || ""}';
                    await window.loadReviews('${courseIdStr}');
                  })();
                </script>
              </div>
            `;
          })
          .join("");
      } else {
        html += `
          <div style="background: var(--card-bg); border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-color); text-align: center;">
            <p style="color: var(--text-secondary); font-size: 1.1rem; margin: 0;">🎓 No active courses yet. Complete your payment to get started!</p>
          </div>
        `;
      }

      html += `</div>`; // Close approved column

      // ===== PENDING COURSES COLUMN =====
      html += `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div style="background: var(--card-bg); border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                  <div style="position: relative; display: inline-block;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <!-- Hourglass floating icon -->
                    <div style="position: absolute; bottom: -5px; right: -5px; background: var(--card-bg); border-radius: 50%; padding: 2px;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 22h14"></path>
                        <path d="M5 2h14"></path>
                        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
                        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
                      </svg>
                    </div>
                  </div>
                  <h2 style="margin: 0; color: var(--text-dark); font-size: 1.4rem; font-weight: 700;">
                    Pending Approval (${pendingEnrollments.length})
                  </h2>
                </div>
                
                ${
                  pendingEnrollments.length > 0
                    ? `<div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${pendingEnrollments
                      .map((enrollment) => {
                        const course = enrollment.courseId || {};
                        const teacher = course.teacherId || {};
                        const statusText =
                          enrollment.status === "payment_submitted"
                            ? "Waiting for Admin Review"
                            : "Awaiting Admin Approval";
                        return `
                        <div style="background: var(--dashboard-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem;">
                          <h3 style="margin: 0 0 0.5rem 0; color: var(--text-dark); font-size: 1.1rem; font-weight: 600;">${course.title || "Unknown Course"}</h3>
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">Instructor:</span>
                            <span style="color: var(--text-dark); font-weight: 500; font-size: 0.9rem;">${teacher.name || "Unknown"}</span>
                          </div>
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">Fee:</span>
                            <span style="color: var(--text-dark); font-weight: 600; font-size: 0.9rem;">₹${course.price || 0}</span>
                          </div>
                          <div style="background: var(--pending-status-bg); padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid var(--pending-status-border); font-size: 0.85rem; color: var(--pending-status-text); font-weight: 500; text-align: center;">
                            ⏳ ${statusText}
                          </div>
                        </div>
                      `;
                      })
                      .join("")}
                  </div>`
                    : `<div style="background: var(--dashboard-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem;">
                    <p style="margin: 0; color: var(--text-secondary); font-size: 1rem; line-height: 1.5;">
                      No pending courses. All your registrations are approved!
                    </p>
                  </div>`
                }
              </div>
            </div>
          </div>
        </div>
      `;

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
            <a href="/create-course" class="btn btn-primary" style="margin-top: 1rem;">Create Course</a>
          </div>
        `;
      } else {
        html += `<div style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); margin-bottom: 2rem;">`;

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
    const userName = user.name || "Student";

    appDiv.innerHTML = `
      <style>
        :root {
          --card-bg: #ffffff;
          --border-color: #e2e8f0;
          --text-dark: #0f172a;
          --text-secondary: #475569;
          --dashboard-bg: #ffffff;
          --primary-color: #ea580c;
          --primary-hover: #c2410c;
          --primary-border-glow: rgba(234, 88, 12, 0.1);
        }
        html:not([data-theme="light"]) {
          --card-bg: #1e293b;
          --border-color: #334155;
          --text-dark: #f8fafc;
          --text-secondary: #94a3b8;
          --dashboard-bg: #0f172a;
          --primary-color: #117864;
          --primary-hover: #0e6252;
          --primary-border-glow: rgba(17, 120, 100, 0.2);
        }
        
        .support-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .support-page-title {
          font-size: 1.8rem;
          color: var(--text-dark);
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .support-hero {
          text-align: center;
          margin-bottom: 3rem;
        }
        .support-hero h2 {
          font-size: 2.2rem;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-family: serif;
        }
        .support-hero p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }
        .support-main-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 800px) {
          .support-main-layout {
            grid-template-columns: 1fr;
          }
        }
        .support-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          margin-bottom: 1rem;
        }
        .support-card h3 {
          margin-top: 0;
          font-size: 1.2rem;
          color: var(--text-dark);
          margin-bottom: 1.2rem;
        }
        .contact-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          text-align: center;
        }
        .contact-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-icon-wrapper {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border-radius: 50%;
          color: #475569;
        }
        .contact-option-text {
          font-weight: 600;
          color: #334155;
          font-size: 0.95rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .contact-option-subtext {
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          display: inline-block;
        }
        .direct-support-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .direct-support-email {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .copy-btn {
          background: var(--primary-color);
          border: none;
          border-radius: 6px;
          padding: 0.5rem;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .copy-btn:hover {
          background: var(--primary-hover);
        }
        
        .support-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 600px) {
          .support-form-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-group-full {
          grid-column: 1 / -1;
        }
        .support-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .support-form input, .support-form textarea {
          width: 100%;
          padding: 0.75rem;
          background: var(--dashboard-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-family: inherit;
          box-sizing: border-box;
          color: var(--text-dark);
          font-size: 0.95rem;
        }
        .support-form input:focus, .support-form textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-border-glow);
        }
        .support-submit-btn {
          width: 100%;
          padding: 1rem;
          background: var(--primary-color);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 1rem;
        }
        .support-submit-btn:hover {
          background: var(--primary-hover);
        }
      </style>

      <div class="support-container">
        <h1 class="support-page-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          Customer Support
        </h1>

        <div class="support-hero">
          <h2>We're Here to Help, ${userName}!</h2>
          <p>Facing an issue with a teacher, course, or platform feature? Contact the StudBridge corporate support team directly.</p>
        </div>

        <div class="support-main-layout">
          <!-- Left Column -->
          <div>
            <div class="support-card">
              <h3>Direct Corporate Support</h3>
              <div class="direct-support-row">
                <a href="mailto:hr@studbridge.com" class="direct-support-email" style="text-decoration: underline; font-weight: 600; color: var(--primary-color);">hr@studbridge.com</a>
                <button class="copy-btn" onclick="navigator.clipboard.writeText('hr@studbridge.com').then(() => showInfoPopup('Email copied!'))" title="Copy email">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="support-card">
            <h3>Submit a Detailed Support Ticket</h3>
            <form onsubmit="submitSupportForm(event)" class="support-form">
              <div class="support-form-grid">
                <div class="form-group">
                  <label for="supName">Name/UserID</label>
                  <input type="text" id="supName" value="${user.name || user._id || ""}" required>
                </div>
                
                <div class="form-group">
                  <label for="supEmail">Email Address</label>
                  <input type="email" id="supEmail" value="${user.email || ""}" required>
                </div>
                
                <div class="form-group form-group-full">
                  <label for="supMobile">Mobile Number</label>
                  <input type="tel" id="supMobile" value="${user.mobileNumber || ""}" required style="background: var(--dashboard-bg);">
                </div>
                
                <div class="form-group form-group-full">
                  <label for="supIssue">Issue you are facing</label>
                  <textarea id="supIssue" rows="4" required placeholder="Describe your issue in detail. If about a specific teacher, please include their name."></textarea>
                </div>
              </div>
              
              <button type="submit" class="support-submit-btn">
                Send to Support
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    this.updateNavbar();
  }

  renderSettings() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser() || {};

    appDiv.innerHTML = `
      <div class="settings-page">
        <style>.theme-toggle-wrapper {display: flex; align-items: center; gap: 12px;background: var(--card-bg, #1e293b); padding: 8px 16px; border-radius: 30px;border: 1px solid var(--border-color, #334155); box-shadow: 0 4px 6px rgba(0,0,0,0.05);}html:not([data-theme="light"]) .theme-toggle-wrapper {background: var(--card-bg, #1e293b); border-color: var(--border-color, #334155);}html[data-theme="light"] .theme-toggle-wrapper {background: #ffffff; border-color: #d1d5db;}.theme-switch {position: relative; display: inline-block; width: 48px; height: 24px; margin: 0;}.theme-switch input { opacity: 0; width: 0; height: 0; }.slider {position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;background-color: #cbd5e1; transition: .4s; border-radius: 24px;}.slider:before {position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);}input:checked + .slider { background-color: #E8702A; }input:checked + .slider:before { transform: translateX(24px); }html:not([data-theme="light"]) input:checked + .slider { background-color: #667eea; }.theme-toggle-text {font-size: 0.95rem; font-weight: 600; color: var(--text-color, #f8fafc); min-width: 85px; text-align: right;}</style><div class="settings-hero" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;"><div><p class="admin-kicker">Account Center</p><h2 style="margin-bottom: 0.5rem; margin-top: 0;">Settings</h2><p style="margin: 0; opacity: 0.9;">Profile details, account controls, and secure logout in one place.</p></div><div class="theme-toggle-wrapper"><span class="theme-toggle-text" id="themeTextLabel">Light Mode</span><label class="theme-switch" aria-label="Toggle Theme"><input type="checkbox" id="themeToggleCheckbox" onchange="window.toggleTheme()"><span class="slider"></span></label></div></div>

        <div class="settings-grid">
          <section class="settings-card">
            <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Profile</h3>
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
            <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Security</h3>
            <p class="settings-muted">Keep your account protected and end sessions securely.</p>
            <button class="btn btn-secondary" onclick="showPasswordComingSoon()">Change Password</button>
            <button class="btn btn-danger settings-logout-btn" onclick="confirmLogoutFromSettings()">Logout</button>
          </section>

          ${
            user.role === "teacher"
              ? `
          <section class="settings-card">
            <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Platform Commission</h3>
            <p class="settings-muted">View platform fee and your revenue share details.</p>
            <button class="btn btn-secondary" onclick="router.navigate('teacher-terms')">View Terms</button>
          </section>
              `
              : ""
          }

        </div>
      </div>
    `;

    // Update theme button styling after render
    setTimeout(() => {
      window.themeManager.updateThemeButton();
    }, 0);

    this.updateNavbar();
  }

  renderDocumentations() {
    const appDiv = document.getElementById("app");

    // Array of objects as requested
    const docs = [
      {
        title: "HTML",
        link: "https://nexus-upskill-html-course.vercel.app/htmlcss.html",
      },
      {
        title: "JavaScript",
        link: "https://nexus-upskill-html-course.vercel.app/javascript.html",
      },
      {
        title: "React",
        link: "https://nexus-upskill-html-course.vercel.app/react.html",
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
          <div class="course-card" style="background: var(--card-bg, white); border: 1px solid var(--border-color, #e2e8f0); border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column;">
            <div style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; height: 100px; background: #f8fafc; border-radius: 8px;">
               <i class="${doc.title === "HTML" ? "devicon-html5-plain colored" : doc.title === "JavaScript" ? "devicon-javascript-plain colored" : doc.title === "React" ? "devicon-react-original colored" : "devicon-devicon-plain"}" style="font-size: 60px;"></i>
            </div>
            <h3 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--text-primary, #cdd9f5); font-size: 1.25rem;">${doc.title} Documentation</h3>
            <p style="color: var(--text-secondary, #64748b); margin-bottom: 1.5rem; font-size: 0.95rem; flex-grow: 1;">Access the comprehensive guide and learning materials for ${doc.title}.</p>
            <a href="${doc.link}" target="_blank" class="btn btn-primary" style="display: inline-block; background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center; width: 100%; box-sizing: border-box;">View Documentation ↗</a>
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
        html += `<div class="courses-list" style="display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); margin-bottom: 2rem; overflow-x: hidden;">`;

        dues.forEach((due) => {
          const teacher = due.teacherId || {};
          const student = due.studentId || {};
          const course = due.courseId || {};

          html += `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden;">
              <div style="display: flex; justify-content: space-between; align-items:flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                <h3 style="margin: 0; color: #0f172a; flex: 1; min-width: 200px;">👨‍🏫 Teacher: ${teacher.name || "Unknown"}</h3>
                <span style="background: #fef08a; color: #b45309; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap;">Awaiting Settlement</span>
              </div>
              
              <div style="background: #f8fafc; color: #334155; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; word-break: break-all;">
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
        <a href="/home" class="btn btn-primary">Go to Home</a>
      </div>
    `;
    this.updateNavbar();
  }

  async renderCreateMeeting() {
    const appDiv = document.getElementById("app");
    const user = auth.getCurrentUser() || {};

    appDiv.innerHTML = `
      <div class="page custom-meeting-page" style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
        <div class="meeting-card" style="background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 500px; width: 100%; text-align: center;">
          <h2 style="margin-bottom: 1rem; color: #333; font-size: 1.8rem;">🎥 Create Live Class</h2>
          <p style="color: #666; margin-bottom: 2rem;">Please create a secure Google Meet link using your own Google account to get full host and recording controls.</p>
          
          <a href="https://meet.google.com/new" target="_blank" id="btnGenerateMeeting" style="display: block; text-decoration: none; background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: all 0.3s; width: 100%; box-sizing: border-box;">
            Create Meeting (via Google Meet)
          </a>
          
          <div style="margin-top: 2rem;">
            <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">After generating, share your link with students via WhatsApp or post it in the course.</p>
          </div>
        </div>
      </div>
    `;

    this.updateNavbar();
  }

  async renderTeacherReviews(teacherId) {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `<div style="padding:4rem; text-align:center; color:white;">Loading reviews...</div>`;

    try {
      const res = await api.getTeacherReviews(teacherId);
      if (res && res.success) {
        const reviews = res.data || [];

        let average = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
          average = (totalRating / reviews.length).toFixed(1);
        }

        let html = `
        <div class="page" style="padding: 2rem; max-width: 900px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="color: white; margin: 0; font-size: 2rem; font-weight: bold;">Teacher Ratings & Reviews</h2>
            <button onclick="window.history.back()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
              ← Back
            </button>
          </div>
          
          <div style="background: #1e293b; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; border: 1px solid #334155; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);">
            <div style="font-size: 4rem; font-weight: bold; color: white; line-height: 1;">${average}</div>
            <div style="color: #fbbf24; font-size: 2rem; margin: 0.5rem 0; letter-spacing: 4px;">
              ${(() => {
                let starsHTML = "";
                let avgNum = Math.round(Number(average));
                for (let i = 0; i < 5; i++) {
                  starsHTML +=
                    i < avgNum ? "⭐" : '<span style="opacity:0.2">⭐</span>';
                }
                return starsHTML;
              })()}
            </div>
            <div style="color: #94a3b8;">Based on ${reviews.length} review${reviews.length !== 1 ? "s" : ""}</div>
          </div>
          
          <div class="reviews-list">`;

        if (reviews.length === 0) {
          html += `<p style="text-align: center; color: #94a3b8; padding: 3rem; background: #0f172a; border-radius: 8px; border: 1px dashed #334155;">No reviews yet.</p>`;
        } else {
          reviews.forEach((review) => {
            const studentName = review.studentId?.name || "Anonymous";
            const initial = studentName.charAt(0).toUpperCase();
            const d = new Date(review.createdAt || new Date());
            const dateStr = d.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            // Helper to escape potentially harmful HTML
            const escapeH = (str) =>
              String(str || "").replace(
                /[&<>'"]/g,
                (tag) =>
                  ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;",
                  })[tag] || tag,
              );

            html += `
                <div style="background: #0f172a; border: 1px solid #1e293b; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.25rem; transition: transform 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem; flex-shrink: 0;">
                            ${escapeH(initial)}
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.25rem 0; color: #f8fafc; font-size: 1.1rem;">${escapeH(studentName)}</h4>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div style="color: #fbbf24; font-size: 1rem; letter-spacing: 2px;">
                                    ${"⭐".repeat(review.rating)}
                                </div>
                                <span style="color: #64748b; font-size: 0.85rem;">${escapeH(dateStr)}</span>
                            </div>
                        </div>
                    </div>
                    <p style="margin: 0; color: #cbd5e1; line-height: 1.6; font-size: 0.95rem; white-space: pre-wrap; padding-left: 1rem; border-left: 2px solid #334155;">${escapeH(review.experience)}</p>
                </div>
                `;
          });
        }

        html += `
          </div>
        </div>
        `;
        appDiv.innerHTML = html;
        this.updateNavbar();
      } else {
        appDiv.innerHTML = `<div style="padding:4rem; text-align:center; color:#ef4444;">Failed to load reviews.</div>`;
      }
    } catch (e) {
      console.error(e);
      appDiv.innerHTML = `<div style="padding:4rem; text-align:center; color:#ef4444;">Error loading reviews.</div>`;
    }
  }

  renderTerms() {
    const appDiv = document.getElementById("app");
    window.scrollTo(0, 0);
    appDiv.innerHTML = `
      <div class="legal-page" style="padding: 4rem 2rem; max-width: 800px; margin: 0 auto; color: var(--text-color, #ffffff); line-height: 1.6;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-color, #ffffff);">Terms and Conditions</h1>
        
        <p>Welcome to StudBridge. By accessing our website and enrolling in our courses, you agree to be bound by these Terms and Conditions.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Platform Use</h3>
        <p>StudBridge is an educational platform providing courses and industry mentorship. You agree to use the platform for lawful educational purposes only.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Account Registration</h3>
        <p>You must provide accurate information when registering. You are responsible for maintaining the confidentiality of your account credentials.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Payments</h3>
        <p>All payments for courses are processed securely through our authorized payment gateways. By purchasing a course, you agree to pay the specified fees.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Intellectual Property</h3>
        <p>All course materials, scripts, and platform content are the exclusive property of StudBridge. You may not distribute, reproduce, or resell any content without written permission.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">User Conduct</h3>
        <p>Any harassment, sharing of account access, or misuse of the platform's resources will result in immediate termination of your account without a refund.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Limitation of Liability</h3>
        <p>StudBridge provides educational content and mentorship but does not guarantee specific career or financial outcomes.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Contact Us</h3>
        <p>If you have any questions or queries regarding these Terms and Conditions, please contact us:</p>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Owner:</strong> N Chaithanya</li>
          <li><strong>Email:</strong> <a href="mailto:chaithanya@studbridge.com" style="color: #3b82f6;">chaithanya@studbridge.com</a></li>
          <li><strong>Contact Number:</strong> 6304886413</li>
          <li><strong>Address:</strong> Thorur, Puttur, Tirupati, Andhra Pradesh</li>
          <li><strong>Pincode:</strong> 517583</li>
        </ul>

        <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color, #334155); display:flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
          <a href="/terms" class="nav-link" style="color: #3b82f6; text-decoration: none;">Terms & Conditions</a>
          <a href="/privacy" class="nav-link" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a>
          <a href="/refund" class="nav-link" style="color: #3b82f6; text-decoration: none;">Refund Policy</a>
        </div>
      </div>
    `;
    this.updateNavbar();
  }

  renderPrivacy() {
    const appDiv = document.getElementById("app");
    window.scrollTo(0, 0);
    appDiv.innerHTML = `
      <div class="legal-page" style="padding: 4rem 2rem; max-width: 800px; margin: 0 auto; color: var(--text-color, #ffffff); line-height: 1.6;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-color, #ffffff);">Privacy Policy</h1>
        
        <p>StudBridge is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your data.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Information We Collect</h3>
        <p>We collect personal information you provide when registering, including your name, email address (e.g., example@gmail.com), phone number, and educational background.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">How We Use Your Information</h3>
        <p>We use your data to provide access to courses, process payments, connect you with mentors, and send important administrative emails or platform updates.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Data Sharing</h3>
        <p>We do not sell your personal data. We only share necessary information with trusted third-party service providers (like payment gateways and cloud hosting providers) strictly for operating our platform.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Data Security</h3>
        <p>We implement standard security measures to protect your data against unauthorized access or disclosure.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Contact Us</h3>
        <p>For privacy-related inquiries, please contact us at: <a href="mailto:chaithanya@studbridge.com" style="color:#3b82f6;">chaithanya@studbridge.com</a>.</p>

        <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color, #334155); display:flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
          <a href="/terms" class="nav-link" style="color: #3b82f6; text-decoration: none;">Terms & Conditions</a>
          <a href="/privacy" class="nav-link" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a>
          <a href="/refund" class="nav-link" style="color: #3b82f6; text-decoration: none;">Refund Policy</a>
        </div>
      </div>
    `;
    this.updateNavbar();
  }

  renderRefund() {
    const appDiv = document.getElementById("app");
    window.scrollTo(0, 0);
    appDiv.innerHTML = `
      <div class="legal-page" style="padding: 4rem 2rem; max-width: 800px; margin: 0 auto; color: var(--text-color, #ffffff); line-height: 1.6;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-color, #ffffff);">Refund and Cancellation Policy</h1>
        
        <p>At StudBridge, we strive to deliver high-quality educational content and mentorship.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Digital Goods Nature</h3>
        <p>Because our courses are digital and access is granted immediately upon purchase, we generally maintain a strict <strong>No Refund</strong> policy once a course has been accessed.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Cancellation</h3>
        <p>If you have purchased a course but have not yet logged in or accessed any of the materials, you may request a cancellation within 48 hours of the transaction.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Exceptions</h3>
        <p>If you experience severe technical issues that prevent you from accessing the course content, and our support team cannot resolve the issue within a reasonable timeframe, a partial or full refund may be issued at the sole discretion of StudBridge management.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Processing Time</h3>
        <p>Approved refunds will be credited back to the original payment method (UPI, Bank Account, or Card) within 5 to 7 business days.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Contact for Support</h3>
        <p>To request a cancellation or report an issue, email <a href="mailto:chaithanya@studbridge.com" style="color:#3b82f6;">chaithanya@studbridge.com</a> with your transaction ID and registered email address.</p>

        <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color, #334155); display:flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
          <a href="/terms" class="nav-link" style="color: #3b82f6; text-decoration: none;">Terms & Conditions</a>
          <a href="/privacy" class="nav-link" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a>
          <a href="/refund" class="nav-link" style="color: #3b82f6; text-decoration: none;">Refund Policy</a>
        </div>
      </div>
    `;
    this.updateNavbar();
  }

  renderTeacherTerms() {
    const appDiv = document.getElementById("app");
    window.scrollTo(0, 0);
    appDiv.innerHTML = `
      <div class="legal-page" style="padding: 4rem 2rem; max-width: 800px; margin: 0 auto; color: var(--text-color, #ffffff); line-height: 1.6;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-color, #ffffff);">Platform Commission Terms</h1>
        <p style="color: var(--text-muted, #94a3b8); margin-bottom: 2rem;">Overview of earnings and platform fees</p>
        
        <p>If you are registered as an instructor or mentor providing courses or guidance on StudBridge, the following terms apply to your earnings:</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Platform Fee</h3>
        <p>StudBridge charges a standard <strong>20% platform fee</strong> on the total sale price of any course or service sold through the platform.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Instructor Revenue</h3>
        <p>The instructor will receive the remaining <strong>80% of the course fee</strong>.</p>

        <h3 style="margin-top: 2rem; color: var(--text-color, #ffffff);">Payouts</h3>
        <p>Earnings will be calculated and remitted to the instructor's designated bank account on a regular schedule (e.g., the 5th of every month) for all cleared transactions from the previous month. StudBridge reserves the right to withhold payouts for transactions that are disputed or refunded.</p>

        <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border-color, #334155); display:flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
          <a href="/terms" class="nav-link" style="color: #3b82f6; text-decoration: none;">Terms & Conditions</a>
          <a href="/privacy" class="nav-link" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a>
          <a href="/refund" class="nav-link" style="color: #3b82f6; text-decoration: none;">Refund Policy</a>
        </div>
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
  router.navigate("settings");
}

function logout() {
  auth.logout();
  router.updateNavbar();
  router.navigate("home");
}

// Navigate on page load
window.addEventListener("load", () => {
  router.navigate();
});

// Enroll in course function
async function enrollCourse(courseId) {
  if (!auth.isAuthenticated()) {
    showInfoPopup(
      "Please login or create an account to enroll in courses.",
      "Login Required",
    );
    router.navigate("#login");
    return;
  }

  // Find the button that was clicked to show loading state
  const enrollBtn = document.querySelector(
    `button[onclick="enrollCourse('${courseId}')"]`,
  );
  if (enrollBtn && window.toggleLoading) {
    window.toggleLoading(enrollBtn, true);
  }

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
    // We don't want to show raw log errors in popups, parse it nicely or just show a generic error
    let errorMsg = "An error occurred during enrollment.";
    if (error && error.message) {
      // Don't show raw object string
      if (!error.message.includes("[object Object]")) {
        errorMsg = error.message;
      }
    }
    showInfoPopup(`Error: ${errorMsg}`, "Enrollment Error");
  } finally {
    if (enrollBtn && window.toggleLoading) {
      window.toggleLoading(enrollBtn, false);
    }
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
  let cleanPhone = teacherPhone.replace(/[^\d]/g, "");

  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

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

// ==== FREELANCE / CLIENT FEATURES ====
Router.prototype.renderClientProjects = async function () {
  this.updateNavbar();
  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <style>
      .client-project-price {
        color: #E8702A !important;
      }
      html:not([data-theme="light"]) .client-project-price {
        color: #0f766e !important;
      }
    </style>
    <div class="dashboard-container" style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <h2 style="font-size: 2rem; margin: 0;">Your Projects</h2>
        <button class="btn" style="background: var(--primary-color); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onclick="router.navigate('client-create-project')">
          <span class="material-icons" style="font-size: 1.2rem;">add</span> Create Project
        </button>
      </div>
      
      <div class="tabs" style="display: flex; gap: 1.5rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0;">
        <button id="tab-open" style="background: transparent; color: var(--primary-color); border: none; border-bottom: 2px solid var(--primary-color); padding: 0.5rem 0.5rem; font-weight: 600; cursor: pointer; font-size: 1.05rem;" onclick="filterProjects('open', this)">Open / Ongoing</button>
        <button id="tab-completed" style="background: transparent;  opacity: 0.7; border: none; border-bottom: 2px solid transparent; padding: 0.5rem 0.5rem; font-weight: 600; cursor: pointer; font-size: 1.05rem;" onclick="filterProjects('completed', this)">Completed</button>
      </div>

      <div id="projectsList" class="projects-list" style="display: grid; gap: 1.2rem;">
        <div class="loader" style="margin: 2rem auto;"></div>
      </div>
    </div>
  `;

  try {
    const response = await api.getClientProjects();
    const projects = response.data || [];
    window.clientProjectsData = projects;

    window.filterProjects = (statusPattern, btnElement) => {
      // Update tab styles
      document.getElementById("tab-open").style.color = "var(--text-color)";
      document.getElementById("tab-open").style.opacity = "0.7";
      document.getElementById("tab-open").style.borderBottomColor =
        "transparent";
      document.getElementById("tab-completed").style.color =
        "var(--text-color)";
      document.getElementById("tab-completed").style.opacity = "0.7";
      document.getElementById("tab-completed").style.borderBottomColor =
        "transparent";

      if (btnElement) {
        btnElement.style.color = "var(--primary-color)";
        btnElement.style.opacity = "1";
        btnElement.style.borderBottomColor = "var(--primary-color)";
      }

      const filtered = projects.filter((p) => {
        if (statusPattern === "open")
          return ["open", "in-progress"].includes(p.status);
        return p.status === "completed" || p.status === "closed";
      });

      const listDiv = document.getElementById("projectsList");
      if (filtered.length === 0) {
        listDiv.innerHTML =
          '<p class="empty-state" style=" opacity: 0.7; text-align: center; padding: 3rem; border: 1px dashed var(--border-color); border-radius: 8px;">You have no projects in this category.</p>';
        return;
      }

      listDiv.innerHTML = filtered
        .map(
          (p) => `
        <div class="project-card" style="border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 12px; background: var(--bg-color); display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'">
          <div style="flex: 1; padding-right: 1.5rem;">
            <h3 style="margin-bottom: 0.8rem; font-size: 1.3rem; ">${p.title}</h3>
            <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
              <div class="client-project-price" style="display: flex; align-items: center; gap: 0.4rem; font-weight: 700; font-size: 1.1rem;">
                <span class="material-icons" style="font-size: 1.2rem;">payments</span> ₹${p.price}
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem;  opacity: 0.8; font-size: 0.95rem;">
                <span class="material-icons" style="font-size: 1.1rem;">group</span> ${p.applicationCount || 0} candidates
              </div>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="background: ${p.status === "open" ? "rgba(59, 130, 246, 0.15)" : p.status === "in-progress" ? "rgba(234, 179, 8, 0.15)" : "rgba(34, 197, 94, 0.15)"}; color: ${p.status === "open" ? "#3b82f6" : p.status === "in-progress" ? "#eab308" : "#22c55e"}; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; border: 1px solid ${p.status === "open" ? "rgba(59, 130, 246, 0.4)" : p.status === "in-progress" ? "rgba(234, 179, 8, 0.4)" : "rgba(34, 197, 94, 0.4)"};">
                  ${p.status ? p.status.toUpperCase() : "UNKNOWN"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn" style="background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='var(--primary-color)'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='var(--primary-color)'" onclick="router.navigate('client-project-details/${p._id}')">View Details</button>
          </div>
        </div>
      `,
        )
        .join("");
    };

    window.filterProjects("open");
  } catch (error) {
    document.getElementById("projectsList").innerHTML =
      `<div class="error-message">Server error or network issue. Please reach out or try again after a few minutes.</div>`;
  }
};

Router.prototype.renderCreateProject = function () {
  this.updateNavbar();
  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <div class="dashboard-container" style="max-width: 800px; margin: 0 auto; padding: 2rem;">
      <div style="display: flex; align-items: center; margin-bottom: 2rem; gap: 1rem;">
        <button class="icon-btn" onclick="router.navigate('client-dashboard')">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2>Create New Project</h2>
      </div>

      <form id="createProjectForm" class="auth-form" style="max-width: 100%;">
        <div class="form-group">
          <label>Project Title (Name)</label>
          <input type="text" id="pTitle" required placeholder="e.g. Build an E-commerce Website">
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea id="pDescription" rows="5" required placeholder="Detailed requirements..."></textarea>
        </div>
        
        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label>Price ($)</label>
            <input type="number" id="pPrice" required min="1">
          </div>
          
          <div class="form-group">
            <label>Time Period</label>
            <input type="text" id="pTimePeriod" required placeholder="e.g. 1 month, 2 weeks">
          </div>
        </div>
        
        <div class="form-group">
          <label>Language/Tech Preferences (Optional)</label>
          <input type="text" id="pLanguage" placeholder="e.g. React, Node.js, Python. Default: any language">
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;" id="submitProjectBtn">Publish Project</button>
      </form>
    </div>
  `;

  document
    .getElementById("createProjectForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("submitProjectBtn");
      btn.disabled = true;
      btn.textContent = "Publishing...";

      try {
        const data = {
          title: document.getElementById("pTitle").value,
          description: document.getElementById("pDescription").value,
          price: Number(document.getElementById("pPrice").value),
          timePeriod: document.getElementById("pTimePeriod").value,
        };

        const lang = document.getElementById("pLanguage").value.trim();
        if (lang) data.languagePreferences = lang;

        await api.createProject(data);
        showInfoPopup("Project published successfully!", "Success");
        this.navigate("client-dashboard");
      } catch (error) {
        showInfoPopup(error.message, "Error");
        btn.disabled = false;
        btn.textContent = "Publish Project";
      }
    });
};

Router.prototype.renderProjectDetailsAdmin = async function (projectId) {
  this.updateNavbar();
  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <style>
      .client-detail-icon {
        color: #E8702A !important;
      }
      .client-detail-price {
        color: #E8702A !important;
      }
      .client-detail-radio {
        accent-color: #E8702A !important;
      }
      html:not([data-theme="light"]) .client-detail-icon {
        color: #0f766e !important;
      }
      html:not([data-theme="light"]) .client-detail-price {
        color: #0f766e !important;
      }
      html:not([data-theme="light"]) .client-detail-radio {
        accent-color: #0f766e !important;
      }
    </style>
    <div class="dashboard-container" style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
      <div style="display: flex; align-items: center; margin-bottom: 2rem; gap: 1rem;">
        <button class="icon-btn" onclick="router.navigate('client-dashboard')">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2>Project Details</h2>
      </div>
      <div id="projectDetailsContent">
        <div class="loader" style="margin: 2rem auto;"></div>
      </div>
    </div>
  `;

  try {
    const projectResponse = await api.getProjectDetailsByClient(projectId);
    const applicationsResponse = await api.getProjectApplications(projectId);

    console.log("Project Details Response:", projectResponse);
    console.log("Applications Response:", applicationsResponse);

    const project = projectResponse.data || projectResponse || {};
    const applications =
      applicationsResponse.data || applicationsResponse || [];

    let appsHtml = '<p class="empty-state">No candidates have applied yet.</p>';
    if (applications && applications.length > 0) {
      appsHtml = applications
        .map((app) => {
          let actionButtons = "";
          if (app.status === "pending") {
            actionButtons = `
            <button class="btn btn-primary" onclick="updateAppStatus('${app._id}', 'approved')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">Approve</button>
            <button class="btn btn-danger" onclick="updateAppStatus('${app._id}', 'rejected')" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">Reject</button>
          `;
          } else if (app.status === "approved") {
            actionButtons = `<span style="color: green; font-weight: bold;">Approved</span>`;
          } else {
            actionButtons = `<span style="color: red; font-weight: bold;">${app.status ? app.status.toUpperCase() : "UNKNOWN"}</span>`;
          }

          let contactInfo =
            app.status === "approved" && app.studentId
              ? `<div style="margin-top: 0.5rem; font-size: 0.9rem; padding: 0.5rem; background: rgba(128,128,128,0.1); border-radius: 4px; color: var(--text-color);">
               <b>Contact Student:</b><br/>
               Name: ${app.studentId.name}<br/>
               Email: <a href="mailto:${app.studentId.email}">${app.studentId.email}</a><br/>
               Mobile: ${app.studentId.mobileNumber || "N/A"}
             </div>`
              : "";

          return `
          <div style="border: 1px solid var(--border-color); padding: 1rem; border-radius: 6px; margin-bottom: 1rem; background: var(--bg-color);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <strong style="color: var(--text-color);">${app.studentId?.name || "Unknown Student"}</strong>
                <p style="font-size: 0.9rem; color: var(--text-color); opacity: 0.8; margin-top: 0.2rem;">Applied on: ${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}</p>
                <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-color);">
                  <strong>Message/Pitch:</strong><br/>
                  ${app.message || "No additional message provided."}
                </div>
                ${contactInfo}
              </div>
              <div style="display: flex; gap: 0.5rem;">
                ${actionButtons}
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    }

    document.getElementById("projectDetailsContent").innerHTML = `
      <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2rem;">
          <div style="flex: 1; min-width: 300px;">
            <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem; ">${project.title}</h3>
            <p style="margin-bottom: 1.5rem;  opacity: 0.8; line-height: 1.5;">${project.description || "No description provided."}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; font-size: 0.95rem; background: rgba(128,128,128,0.1); padding: 1rem; border-radius: 8px; ">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="material-icons client-detail-icon" style="font-size: 1.2rem;">payments</span>
                <div><strong>Price:</strong> <span class="client-detail-price" style="font-weight: bold;">₹${project.price}</span></div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="material-icons client-detail-icon" style="font-size: 1.2rem;">schedule</span>
                <div><strong>Time Period:</strong> ${project.timePeriod}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="material-icons client-detail-icon" style="font-size: 1.2rem;">info</span>
                <div><strong>Status:</strong> <span style="font-weight: bold; color: ${project.status === "completed" ? "#22c55e" : project.status === "in-progress" ? "#eab308" : "#3b82f6"};">${project.status ? project.status.toUpperCase() : "UNKNOWN"}</span></div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="material-icons client-detail-icon" style="font-size: 1.2rem;">code</span>
                <div><strong>Tech Pref:</strong> ${Array.isArray(project.languagePreferences) ? project.languagePreferences.join(", ") : project.languagePreferences || "Any Language"}</div>
              </div>
            </div>
          </div>
          
          <div style="background: rgba(128,128,128,0.1); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 8px; width: 250px;">
            <h4 style="margin-bottom: 1rem;  font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Update Project Status</h4>
            <div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.8rem; cursor: pointer; padding: 0.5rem; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.1)'" onmouseout="this.style.background='transparent'">
                <input type="radio" class="client-detail-radio" name="projStatus" value="open" ${project.status === "open" ? "checked" : ""} onchange="changeProjectStatus('${project._id}', this.value)" style="transform: scale(1.2);">
                <span style=" font-weight: ${project.status === "open" ? "bold" : "normal"}">Open</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.8rem; cursor: pointer; padding: 0.5rem; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.1)'" onmouseout="this.style.background='transparent'">
                <input type="radio" class="client-detail-radio" name="projStatus" value="in-progress" ${project.status === "in-progress" ? "checked" : ""} onchange="changeProjectStatus('${project._id}', this.value)" style="transform: scale(1.2);">
                <span style=" font-weight: ${project.status === "in-progress" ? "bold" : "normal"}">In-Progress</span>
              </label>
              <label style="display: flex; align-items: center; gap: 0.8rem; cursor: pointer; padding: 0.5rem; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='rgba(128,128,128,0.1)'" onmouseout="this.style.background='transparent'">
                <input type="radio" class="client-detail-radio" name="projStatus" value="completed" ${project.status === "completed" ? "checked" : ""} onchange="changeProjectStatus('${project._id}', this.value)" style="transform: scale(1.2);">
                <span style=" font-weight: ${project.status === "completed" ? "bold" : "normal"}">Completed</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <h3>Student Applications (${applications ? applications.length : 0})</h3>
      <div style="margin-top: 1rem;">
        ${appsHtml}
      </div>
    `;

    // Expose helpers to window for injected HTML handlers
    window.updateAppStatus = async (appId, status) => {
      try {
        await api.updateApplicationStatus(appId, status);
        showInfoPopup(`Application marked as ${status}.`, "Success");
        router.navigate(`client-project-details/${projectId}`);
      } catch (err) {
        showInfoPopup(
          "Server error or network issue while updating. Please try again later.",
          "Error",
        );
      }
    };

    window.changeProjectStatus = async (pId, status) => {
      try {
        await api.updateProjectStatus(pId, status);
        showInfoPopup(`Project status updated to ${status}.`, "Success");
        router.navigate(`client-project-details/${projectId}`);
      } catch (err) {
        showInfoPopup(
          "Server error or network issue while updating. Please try again later.",
          "Error",
        );
      }
    };
  } catch (error) {
    console.error("renderProjectDetailsAdmin Error:", error);
    document.getElementById("projectDetailsContent").innerHTML =
      `<div class="error-message">Server error or network issue. Please reach out or try again after a few minutes. <br/> [Debug] ${error.message}</div>`;
  }
};

Router.prototype.renderFreelance = async function () {
  this.updateNavbar();
  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <style>
      html:not([data-theme="light"]) .freelance-my-apps-btn {
        border-color: #0f766e !important;
        color: #0f766e !important;
      }
      html:not([data-theme="light"]) .freelance-my-apps-btn:hover {
        background-color: #0f766e !important;
        color: #ffffff !important;
      }
      html:not([data-theme="light"]) .freelance-price {
        color: #0f766e !important;
      }
    </style>
    <div class="dashboard-container" style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>Freelance Marketplace</h2>
        <button class="btn btn-outline freelance-my-apps-btn" onclick="router.navigate('my-applications')">My Applications</button>
      </div>
      
      <p style="margin-bottom: 2rem; color: #64748b;">Browse open projects posted by clients and apply to build them.</p>

      <div id="freelanceProjectsList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        <div class="loader" style="margin: 2rem auto; grid-column: 1 / -1;"></div>
      </div>
    </div>
  `;

  try {
    const response = await api.getOpenProjectsForStudents();
    const projects = response.data || [];
    const listDiv = document.getElementById("freelanceProjectsList");

    if (!projects || projects.length === 0) {
      listDiv.innerHTML =
        '<p class="empty-state" style="grid-column: 1 / -1;">No open projects available right now. Check back later!</p>';
      return;
    }

    listDiv.innerHTML = projects
      .map(
        (p) => `
      <div style="border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 8px; background: var(--bg-color); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem;">${p.title}</h3>
          <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${p.description || `Posted by: ${p.clientId?.name || "Unknown Client"}`}</p>
          <div class="freelance-price" style="font-weight: bold; margin-bottom: 0.5rem; color: #E8702A;">₹${p.price}</div>
          <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 1rem;">Time: ${p.timePeriod}</div>
        </div>
        <button class="btn btn-primary" style="width: 100%" onclick="router.navigate('freelance-project/${p._id}')">View Project Details</button>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    document.getElementById("freelanceProjectsList").innerHTML =
      `<div class="error-message" style="grid-column: 1 / -1; text-align: center;">Server error or network issue. Please reach out or try again after a few minutes.</div>`;
  }
};

Router.prototype.renderProjectDetailsStudent = async function (projectId) {
  this.updateNavbar();
  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <style>
      html:not([data-theme="light"]) .freelance-price {
        color: #0f766e !important;
      }
    </style>
    <div class="dashboard-container" style="max-width: 800px; margin: 0 auto; padding: 2rem;">
      <div style="display: flex; align-items: center; margin-bottom: 2rem; gap: 1rem;">
        <button class="icon-btn" onclick="router.navigate('freelance')">
          <span class="material-icons">arrow_back</span>
        </button>
        <h2>Project Details</h2>
      </div>
      <div id="projectInfoContent">
        <div class="loader" style="margin: 2rem auto;"></div>
      </div>
    </div>
  `;

  try {
    const response = await api.getProjectDetailsForStudent(projectId);
    const project = response.data || {};

    document.getElementById("projectInfoContent").innerHTML = `
      <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem; font-size: 1.5rem; ">${project.title}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.95rem; background: rgba(128, 128, 128, 0.1); padding: 1rem; border-radius: 6px; ">
          <div><strong>Price:</strong> <span class="freelance-price" style="font-weight: bold; color: #E8702A;">₹${project.price}</span></div>
          <div><strong>Time Period:</strong> ${project.timePeriod}</div>
          <div><strong>Preferred Tech:</strong> ${Array.isArray(project.languagePreferences) ? project.languagePreferences.join(", ") : project.languagePreferences || "Any"}</div>
          <div><strong>Posted By:</strong> ${project.clientId?.name || "Unknown Client"}</div>
        </div>
        <div style="margin-bottom: 2rem; ">
          <h4 style="margin-bottom: 0.5rem;">Description</h4>
          <p style="line-height: 1.6;">${project.description ? project.description.replace(/\n/g, "<br/>") : ""}</p>
        </div>
        
        <button id="applyBtn" class="btn btn-primary" style="width: 100%; padding: 0.8rem; font-size: 1.1rem;">Get Connection / Apply</button>
      </div>
    `;

    document.getElementById("applyBtn").addEventListener("click", async () => {
      try {
        document.getElementById("applyBtn").disabled = true;
        document.getElementById("applyBtn").textContent = "Applying...";
        await api.applyToProject(projectId);
        showInfoPopup("Application submitted successfully!", "Success");
        router.navigate("my-applications");
      } catch (err) {
        showInfoPopup(err.message, "Error");
        document.getElementById("applyBtn").disabled = false;
        document.getElementById("applyBtn").textContent =
          "Get Connection / Apply";
      }
    });
  } catch (error) {
    document.getElementById("projectInfoContent").innerHTML =
      `<div class="error-message">Server error or network issue. Please reach out or try again after a few minutes.</div>`;
  }
};

Router.prototype.renderStudentApplications = async function () {
  this.updateNavbar();
  const appDiv = document.getElementById("app");

  appDiv.innerHTML = `
    <div class="dashboard-container" style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button class="icon-btn" onclick="router.navigate('freelance')">
            <span class="material-icons">arrow_back</span>
          </button>
          <h2>My Applications</h2>
        </div>
      </div>
      
      <div id="studentAppsList" style="display: grid; gap: 1rem;">
        <div class="loader" style="margin: 2rem auto;"></div>
      </div>
    </div>
  `;

  try {
    const response = await api.getStudentApplications();
    const apps = response.data || [];
    const listDiv = document.getElementById("studentAppsList");

    if (!apps || apps.length === 0) {
      listDiv.innerHTML =
        '<p class="empty-state">You haven\'t applied to any projects yet.</p>';
      return;
    }

    listDiv.innerHTML = apps
      .map((a) => {
        let clientContact = "";
        if (a.status === "approved" && a.client) {
          clientContact = `
          <div style="margin-top: 1rem; padding: 1rem; background: rgba(34, 197, 94, 0.05); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 6px;">
            <h4 style="margin-bottom: 0.5rem; color: #22c55e;">Client Contact Info</h4>
            <p><strong>Name:</strong> ${a.client.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${a.client.email}">${a.client.email}</a></p>
            <p><strong>Mobile:</strong> ${a.client.mobileNumber || "N/A"}</p>
          </div>
        `;
        }

        let statusColor =
          a.status === "approved" || a.status === "completed"
            ? "#22c55e"
            : a.status === "rejected"
              ? "#ef4444"
              : "#f59e0b";

        return `
        <div class="project-card" style="border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 8px; background: var(--bg-color);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
            <div>
              <h3 style="margin-bottom: 0.5rem;">${a.project?.title || "Deleted Project"}</h3>
              <p class="freelance-price" style="font-weight: bold; color: #E8702A;">₹${a.project?.price || 0}</p>
            </div>
            <span style="background: ${statusColor}; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: bold;">
              ${a.status ? a.status.toUpperCase() : "UNKNOWN"}
            </span>
          </div>
          <p style="font-size: 0.9rem;  opacity: 0.8;">Applied on: ${a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "N/A"}</p>
          ${clientContact}
        </div>
      `;
      })
      .join("");
  } catch (error) {
    document.getElementById("studentAppsList").innerHTML =
      `<div class="error-message">Server error or network issue. Please reach out or try again after a few minutes.</div>`;
  }
};

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
  let cleanPhone = phoneNumber.replace(/[^\d]/g, "");
  if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
  window.location.href = `tel:${cleanPhone}`;
}

// WhatsApp Student Function
function whatsappStudent(phoneNumber) {
  if (!phoneNumber || phoneNumber === "N/A" || phoneNumber.trim() === "") {
    showInfoPopup("Phone number not available", "Contact");
    return;
  }
  let cleanPhone = phoneNumber.replace(/[^\d]/g, "");
  if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
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

    // Only show active and pending enrollments
    enrollments = enrollments.filter((e) =>
      [
        "active",
        "awaiting_admin_approval",
        "payment_requested",
        "payment_submitted",
      ].includes(e.status),
    );

    if (enrollments.length === 0) {
      container.innerHTML = `
        <div style="margin-top: 2rem; padding: 2rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border-left: 4px solid #667eea; color: #667eea;">
          <p style="margin: 0;">ℹ️ No students in this course yet.</p>
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
      const isActive = enrollment.status === "active";

      html += `
        <div style="background: white; border: 2px solid #ddd; border-radius: 12px; padding: 1.5rem;">
          <h4 style="margin: 0 0 0.5rem 0; color: #333;">${student.name || "Unknown"}</h4>
          ${!isActive ? `<span style="display: inline-block; margin-bottom: 0.75rem; background: #fff3cd; color: #856404; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">Pending Admin Approval</span>` : `<span style="display: inline-block; margin-bottom: 0.75rem; background: #d1fae5; color: #065f46; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">Active</span>`}
          <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">
            <p style="margin: 0.25rem 0;">📧 ${student.email || "N/A"}</p>
            ${
              isActive
                ? `<p style="margin: 0.25rem 0;">📱 ${student.mobileNumber || "N/A"}</p>`
                : `<p style="margin: 0.25rem 0; color: #ff9800; font-style: italic;">📱 Mobile hidden until approved</p>`
            }
            <p style="margin: 0.25rem 0;">📊 Progress: ${enrollment.progress || 0}%</p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button onclick="${isActive ? `callStudent('${student.mobileNumber || ""}')` : `showInfoPopup('Student phone hidden until admin approval')`}"
                    style="flex: 1; padding: 0.5rem; background: ${isActive ? "#3b82f6" : "#ccc"}; color: white; border: none; border-radius: 6px; cursor: ${isActive ? "pointer" : "not-allowed"}; font-weight: 600;">
              📞 Call
            </button>
            <button onclick="${isActive ? `whatsappStudent('${student.mobileNumber || ""}')` : `showInfoPopup('Student chat hidden until admin approval')`}"
                    style="flex: 1; padding: 0.5rem; background: ${isActive ? "#25d366" : "#ccc"}; color: white; border: none; border-radius: 6px; cursor: ${isActive ? "pointer" : "not-allowed"}; font-weight: 600;">
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
