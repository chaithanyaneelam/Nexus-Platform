/**
 * API Configuration and Helper
 * Handles all communication with the backend server
 */

// const API_BASE_URL = "https://nexus-platform-three.vercel.app/api";

const API_BASE_URL = "http://localhost:5001/api";

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, method = "GET", body = null, requiresAuth = false) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (requiresAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "#login";
        throw new Error("Unauthorized. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(
          errorData.message || `HTTP Error: ${response.status}`,
        );
        error.errors = errorData.errors || null;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ===== Authentication =====
  async register(userData) {
    return this.request("/auth/register", "POST", userData);
  }

  async login(email, password) {
    return this.request("/auth/login", "POST", { email, password });
  }

  async googleLogin(credential, role = "student") {
    return this.request("/auth/google", "POST", { credential, role });
  }

  async getProfile() {
    return this.request("/auth/profile", "GET", null, true);
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", "PUT", profileData, true);
  }

  async changePassword(passwordData) {
    return this.request("/auth/change-password", "POST", passwordData, true);
  }

  // ===== Courses =====
  async getAllCourses() {
    return this.request("/courses");
  }

  async getTrendingCourses() {
    return this.request("/courses/trending");
  }

  async getCourseById(courseId) {
    return this.request(`/courses/${courseId}`);
  }

  async createCourse(courseData) {
    return this.request("/courses", "POST", courseData, true);
  }

  async getTeacherCourses(page = 1, limit = 10) {
    return this.request(
      `/courses/teacher/my-courses?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  // Backward compatible alias used in some UI methods
  async getMyCourses(page = 1, limit = 10) {
    return this.getTeacherCourses(page, limit);
  }

  async updateCourse(courseId, courseData) {
    return this.request(`/courses/${courseId}`, "PUT", courseData, true);
  }

  async deleteCourse(courseId) {
    return this.request(`/courses/${courseId}`, "DELETE", null, true);
  }

  async approveCourse(courseId) {
    return this.request(`/courses/${courseId}/approve`, "PATCH", {}, true);
  }

  async rejectCourse(courseId) {
    return this.request(`/courses/${courseId}/reject`, "PATCH", {}, true);
  }

  async getPendingCourses(page = 1, limit = 10) {
    return this.request(
      `/courses/admin/pending?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  // ===== Enrollments =====
  async enrollInCourse(enrollmentData) {
    return this.request("/enrollments", "POST", enrollmentData, true);
  }

  async getMyEnrollments(page = 1, limit = 20) {
    return this.request(
      `/enrollments/my-enrollments?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  async updateProgress(enrollmentId, progressData) {
    return this.request(
      `/enrollments/${enrollmentId}/progress`,
      "PATCH",
      progressData,
      true,
    );
  }

  async updateEnrollmentStatus(enrollmentId, statusData) {
    return this.request(
      `/enrollments/${enrollmentId}/status`,
      "PATCH",
      statusData,
      true,
    );
  }

  async completeEnrollment(enrollmentId) {
    return this.request(
      `/enrollments/${enrollmentId}/complete`,
      "PATCH",
      {},
      true,
    );
  }

  async getEnrollmentById(enrollmentId) {
    return this.request(`/enrollments/${enrollmentId}`, "GET", null, true);
  }

  async getCourseEnrollments(courseId, page = 1, limit = 20) {
    return this.request(
      `/enrollments/course/${courseId}/enrollments?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  // ===== Admin Enrollment Actions =====
  async getPendingEnrollments(page = 1, limit = 10) {
    return this.request(
      `/admin/enrollments/pending?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  async requestPayment(enrollmentId) {
    return this.request(
      `/admin/enrollments/${enrollmentId}/request-payment`,
      "POST",
      {},
      true,
    );
  }

  // Backward compatible alias
  async approveEnrollment(enrollmentId) {
    return this.requestPayment(enrollmentId);
  }

  async rejectEnrollment(enrollmentId, reason = "") {
    return this.request(
      `/admin/enrollments/${enrollmentId}/reject`,
      "POST",
      { reason },
      true,
    );
  }

  // ===== Teacher Enrollment =====
  async getTeacherStudents(page = 1, limit = 10) {
    return this.request(
      `/enrollments/teacher/students/list?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  // ===== Admin Users / Teachers =====
  async getAllUsers(role, page = 1, limit = 20) {
    const roleQuery = role ? `&role=${encodeURIComponent(role)}` : "";
    return this.request(
      `/admin/users?page=${page}&limit=${limit}${roleQuery}`,
      "GET",
      null,
      true,
    );
  }

  async getTeacherPendingDues(teacherId) {
    return this.request(
      `/admin/teachers/${teacherId}/pending-dues`,
      "GET",
      null,
      true,
    );
  }

  async getTeacherCoursesWithStudents(teacherId, page = 1, limit = 10) {
    return this.request(
      `/enrollments/admin/teacher/${teacherId}/courses?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  async getAllTeachersWithCourses(page = 1, limit = 10) {
    return this.request(
      `/enrollments/admin/teachers/courses?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  // ===== Payments =====
  async getMyPaymentRequests(page = 1, limit = 20) {
    return this.request(
      `/payments/my-requests?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  async submitTransaction(paymentId, utrNumber) {
    return this.request(
      `/payments/${paymentId}/submit-transaction`,
      "POST",
      { transactionId: utrNumber },
      true,
    );
  }

  async getMyPaymentHistory(page = 1, limit = 20) {
    return this.request(
      `/payments/my-payments?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  // Backward compatible alias
  async getTransactionHistory(page = 1, limit = 20) {
    return this.getMyPaymentHistory(page, limit);
  }

  async getAdminPendingPayments(page = 1, limit = 20) {
    return this.request(
      `/admin/payments/pending?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  async getAdminTeacherDues(page = 1, limit = 20) {
    return this.request(
      `/admin/payments/dues?page=${page}&limit=${limit}`,
      "GET",
      null,
      true,
    );
  }

  async approvePayment(paymentId) {
    return this.request(
      `/admin/payments/${paymentId}/approve`,
      "POST",
      {},
      true,
    );
  }

  async rejectPayment(paymentId, reason = "") {
    return this.request(
      `/admin/payments/${paymentId}/reject`,
      "POST",
      { reason },
      true,
    );
  }

  async settleTeacherPayment(paymentId) {
    return this.request(
      `/admin/payments/${paymentId}/settle-teacher-payment`,
      "POST",
      {},
      true,
    );
  }

  async getAdminDashboardStats() {
    return this.request("/admin/dashboard/stats", "GET", null, true);
  }
}

const api = new APIClient();
