/**
 * Authentication Module
 * Handles user authentication and session management
 */

class AuthManager {
  constructor() {
    this.user = this.loadUser();
    this.token = localStorage.getItem("token");
  }

  /**
   * Register a new user
   */
  async register(form) {
    try {
      // Create FormData from form element
      const formData = new FormData(form);

      const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role") || "student", // Default role is student
        mobileNumber: formData.get("mobileNumber") || undefined,
        linkedinUrl: formData.get("linkedinUrl") || undefined,
        githubUrl: formData.get("githubUrl") || undefined,
      };

      console.log(
        "📝 Registering user:",
        userData.email,
        "Role:",
        userData.role,
      );

      const response = await api.register(userData);

      if (response.success && response.data?.token) {
        this.setSession(response.data.token, response.data.user);
        console.log("✓ Registration successful for:", userData.email);
        return { success: true, message: "Registration successful!" };
      }
      console.warn("✗ Registration failed:", response.message);
      return {
        success: false,
        message: response.message || "Registration failed",
      };
    } catch (error) {
      console.error("✗ Registration error:", error);
      // Return field-specific errors if available, otherwise return general message
      if (error.errors) {
        return {
          success: false,
          message: "Please check the errors below",
          errors: error.errors,
        };
      }
      return { success: false, message: error.message };
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await api.login(email, password);

      if (response.success && response.data?.token) {
        this.setSession(response.data.token, response.data.user);
        console.log("✓ Login successful for:", email);
        return { success: true, message: "Login successful!" };
      }
      console.warn("✗ Login failed:", response.message);
      return { success: false, message: response.message || "Login failed" };
    } catch (error) {
      console.error("✗ Login error:", error);
      // Return field-specific errors if available, otherwise return general message
      if (error.errors) {
        return {
          success: false,
          message: "Please check the errors below",
          errors: error.errors,
        };
      }
      // Return the error message from the server
      const errorMessage = error.message || "Login failed";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Set user session
   */
  setSession(token, user) {
    this.token = token;
    this.user = user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("Session set for user:", user.email, "Role:", user.role);
  }

  /**
   * Load user from localStorage
   */
  loadUser() {
    const userJSON = localStorage.getItem("user");
    return userJSON ? JSON.parse(userJSON) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Get user role
   */
  getUserRole() {
    return this.user?.role || null;
  }

  /**
   * Check if user is student
   */
  isStudent() {
    return this.getUserRole() === "student";
  }

  /**
   * Check if user is teacher
   */
  isTeacher() {
    return this.getUserRole() === "teacher";
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.getUserRole() === "admin";
  }

  /**
   * Logout user
   */
  logout() {
    const userEmail = this.user?.email;

    this.token = null;
    this.user = null;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log("✓ User logged out:", userEmail);
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    try {
      const response = await api.updateProfile(profileData);
      if (response.success) {
        this.user = response.data;
        localStorage.setItem("user", JSON.stringify(this.user));
        return { success: true, message: "Profile updated successfully!" };
      }
      return { success: false, message: response.message || "Update failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.changePassword({
        oldPassword,
        newPassword,
      });
      if (response.success) {
        return { success: true, message: "Password changed successfully!" };
      }
      return { success: false, message: response.message || "Change failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

// Create global auth manager instance
const auth = new AuthManager();

// Global loading function
window.toggleLoading = function (button, isLoading) {
  if (!button) return;
  if (isLoading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.innerHTML;
    }
    button.classList.add("btn-loading");
    button.innerHTML = "";
    button.disabled = true;
  } else {
    button.classList.remove("btn-loading");
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
    }
    button.disabled = false;
  }
};

// Global Google Login callback handler
window.handleGoogleLogin = async function (response) {
  const credential = response.credential;
  if (!credential) return;

  const loginMessageDiv =
    document.getElementById("loginMessage") ||
    document.getElementById("registerMessage");
  if (loginMessageDiv) {
    loginMessageDiv.className = "message";
    loginMessageDiv.textContent = "Authenticating with Google...";
  }

  try {
    // If there's a role dropdown on the register page, pass it along. Default to student.
    const roleElem = document.getElementById("role");
    const role = roleElem ? roleElem.value : "student";

    const response = await api.googleLogin(credential, role);

    if (response.success && response.data?.token) {
      auth.setSession(response.data.token, response.data.user);
      if (loginMessageDiv) {
        loginMessageDiv.className = "message success";
        loginMessageDiv.textContent = "Google Sign-In successful!";
      }
      setTimeout(() => {
        router.redirectToDashboard();
      }, 1500);
    } else {
      if (loginMessageDiv) {
        loginMessageDiv.className = "message error";
        loginMessageDiv.textContent =
          response.message || "Google Sign-In failed";
      }
    }
  } catch (error) {
    console.error("Google Sign-In error:", error);
    if (loginMessageDiv) {
      loginMessageDiv.className = "message error";
      loginMessageDiv.textContent =
        "Failed to connect to Google Sign-In service.";
    }
  }
};
