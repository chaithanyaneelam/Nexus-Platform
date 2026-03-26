/**
 * Main Application File
 * Initializes the app and handles app-level logic
 */

class NexusApp {
  constructor() {
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    console.log("🚀 Nexus Platform Frontend Initialized");

    // Check if user is already logged in
    if (auth.isAuthenticated()) {
      console.log("User logged in:", auth.getCurrentUser().email);
      router.updateNavbar();
    } else {
      console.log("No active session");
    }

    // Navigate to initial page
    router.navigate();

    // Handle hash change
    window.addEventListener("hashchange", () => {
      router.navigate();
    });
  }

  /**
   * Show notification
   */
  static notify(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new NexusApp();
});
