class NexusApp {
  constructor() {
    this.init();
  }

  init() {
    console.log("NexSkill Platform Frontend Initialized");

    // Check if user is already logged in
    if (auth.isAuthenticated()) {
      console.log("User logged in:", auth.getCurrentUser().email);
      router.updateNavbar();
    } else {
      console.log("No active session");
    }

    router.navigate();

    window.addEventListener("hashchange", () => {
      // Close mobile menu on navigate
      const navbarMenu = document.getElementById("navbarMenu");
      if (navbarMenu.classList.contains("active")) {
        navbarMenu.classList.remove("active");
      }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navbarMenu = document.getElementById("navbarMenu");
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", () => {
        navbarMenu.classList.toggle("active");
        if (navbarMenu.classList.contains("active")) {
          mobileMenuToggle.innerHTML =
            '<span class="material-icons" style="font-size: 1.8rem;">close</span>';
        } else {
          mobileMenuToggle.innerHTML =
            '<span class="material-icons" style="font-size: 1.8rem;">menu</span>';
        }
      });

      // Close menu on link click
      navbarMenu.addEventListener("click", (e) => {
        if (
          e.target.tagName === "A" ||
          e.target.classList.contains("nav-link")
        ) {
          navbarMenu.classList.remove("active");
          mobileMenuToggle.innerHTML =
            '<span class="material-icons" style="font-size: 1.8rem;">menu</span>';
        }
      });
    }
  }

  /**
   * Show a notification message
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

// ===== THEME MANAGEMENT =====
class ThemeManager {
  constructor() {
    this.THEME_KEY = "studbridge-theme";
    this.DARK_THEME = "dark";
    this.LIGHT_THEME = "light";
    this.init();
  }

  init() {
    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem(this.THEME_KEY);

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      this.setTheme(prefersDark ? this.DARK_THEME : this.LIGHT_THEME);
    }
  }

  setTheme(theme) {
    const htmlElement = document.documentElement;

    if (theme === this.LIGHT_THEME) {
      htmlElement.setAttribute("data-theme", "light");
    } else {
      htmlElement.removeAttribute("data-theme");
    }

    localStorage.setItem(this.THEME_KEY, theme);
    this.updateThemeButton();
  }

  toggleTheme() {
    const currentTheme =
      localStorage.getItem(this.THEME_KEY) || this.DARK_THEME;
    const newTheme =
      currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
    this.setTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme() {
    return localStorage.getItem(this.THEME_KEY) || this.DARK_THEME;
  }

  updateThemeButton() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    if (themeBtn) {
      const currentTheme = this.getCurrentTheme();
      if (currentTheme === this.LIGHT_THEME) {
        themeBtn.innerHTML =
          '<span class="material-icons" style="margin-right: 0.5rem; vertical-align: middle;">dark_mode</span>Dark Mode';
        themeBtn.style.background = "#0a0a0a";
        themeBtn.style.color = "white";
        themeBtn.style.display = "flex";
        themeBtn.style.alignItems = "center";
        themeBtn.style.justifyContent = "center";
      } else {
        themeBtn.innerHTML =
          '<span class="material-icons" style="margin-right: 0.5rem; vertical-align: middle;">light_mode</span>Light Mode';
        themeBtn.style.background = "#f97316";
        themeBtn.style.color = "white";
        themeBtn.style.display = "flex";
        themeBtn.style.alignItems = "center";
        themeBtn.style.justifyContent = "center";
      }
    }
  }
}

// Initialize theme manager globally
window.themeManager = new ThemeManager();

// Global toggle function for settings page
window.toggleTheme = function () {
  const newTheme = window.themeManager.toggleTheme();
  NexusApp.notify(
    `Switched to ${newTheme === "light" ? "Light" : "Dark"} Mode`,
    "success",
  );
};

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new NexusApp();
});

window.submitSupportForm = function (event) {
  event.preventDefault();
  const name = document.getElementById("supName").value || "User";
  const email = document.getElementById("supEmail").value || "Unknown Email";
  const mobile = document.getElementById("supMobile").value || "Unknown Mobile";
  const issue = document.getElementById("supIssue").value || "";

  const adminMail = "hr@studbridge.com";
  const subject = encodeURIComponent("Support Request from " + name);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\n\nIssue:\n${issue}`,
  );

  const mailtoLink = `mailto:${adminMail}?subject=${subject}&body=${body}`;

  // Create a hidden iframe mechanism to force the mailto action reliably
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = mailtoLink;
  document.body.appendChild(iframe);
  setTimeout(() => document.body.removeChild(iframe), 500);

  // Fallback: Also try window.open which sometimes bypasses strict mailto blockings
  window.open(mailtoLink, "_blank");

  NexusApp.notify(
    "Opening mail client... If it didn't open, click the direct email link.",
    "success",
  );
};

window.setRating = function (courseId, rating) {
  event.stopPropagation();
  const valInput = document.getElementById(`rating-val-${courseId}`);
  if (valInput) valInput.value = rating;

  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`star-${courseId}-${i}`);
    if (star) {
      if (i <= rating) {
        star.style.color = "#facc15"; // yellow
      } else {
        star.style.color = "#475569"; // empty
      }
    }
  }
};

window.submitReview = async function (courseId, teacherId) {
  event.stopPropagation();
  const valInput = document.getElementById(`rating-val-${courseId}`);
  const expInput = document.getElementById(`exp-${courseId}`);
  const msgDiv = document.getElementById(`review-msg-${courseId}`);

  if (!valInput || !expInput) return;

  const rating = parseInt(valInput.value);
  const experience = expInput.value.trim();

  if (rating === 0) {
    msgDiv.textContent = "Please select a star rating.";
    msgDiv.style.color = "#ef4444";
    return;
  }
  if (!experience || experience.length < 10) {
    msgDiv.textContent =
      "Please write your experience (minimum 10 characters).";
    msgDiv.style.color = "#ef4444";
    return;
  }

  msgDiv.textContent = "Submitting review...";
  msgDiv.style.color = "#94a3b8";

  try {
    const res = await api.submitReview({
      courseId,
      teacherId,
      rating,
      experience,
    });

    if (res && res.success) {
      msgDiv.textContent =
        "Review submitted successfully! Thanks for your feedback.";
      msgDiv.style.color = "#10b981";
      expInput.value = "";
      window.setRating(courseId, 0); // reset stars
    } else {
      msgDiv.textContent = res.message || "Failed to submit review.";
      msgDiv.style.color = "#ef4444";
    }
  } catch (error) {
    console.error("Submit review error:", error);
    msgDiv.textContent = error.message || "An error occurred.";
    msgDiv.style.color = "#ef4444";
  }
};

window.loadReviews = async function (courseId, teacherId) {
  const container = document.getElementById("reviews-container-" + courseId);
  if (!container) return;
  container.innerHTML = '<div class="loading">Loading reviews...</div>';

  try {
    const res = await api.getTeacherReviews(teacherId);
    if (res && res.success) {
      const reviews = res.data || [];
      if (reviews.length === 0) {
        container.innerHTML = "<p>No reviews yet for this teacher.</p>";
        return;
      }

      let html =
        '<div class="reviews-list" style="margin-top:1.5rem; display:flex; flex-direction:column; gap:1.5rem;">';
      reviews.forEach((r) => {
        let stars = "";
        for (let i = 1; i <= 5; i++) {
          stars += `<span style="color: ${i <= r.rating ? "#facc15" : "#475569"}; font-size:1.2rem;">★</span>`;
        }

        const studentName = r.studentId?.name || "Anonymous";
        const intials = studentName.slice(0, 2).toUpperCase();

        html += `
          <div class="review-card" style="background:#0f172a; padding:1.5rem; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
            <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
              <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, #667eea, #764ba2); display:flex; align-items:center; justify-content:center; font-weight:bold; color:white;">
                ${intials}
              </div>
              <div>
                <h4 style="margin:0; font-size:1.1rem; color:#e2e8f0;">${studentName}</h4>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.25rem;">
                  <div style="display:flex; gap:0.1rem;">${stars}</div>
                  <span style="font-size:0.8rem; color:#94a3b8;">${new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <p style="margin:0; color:#cbd5e1; line-height:1.5; font-size:0.95rem;">"${r.experience}"</p>
          </div>
        `;
      });
      html += "</div>";
      container.innerHTML = html;
    } else {
      container.innerHTML =
        '<p class="error-message">Failed to load reviews.</p>';
    }
  } catch (e) {
    container.innerHTML =
      '<p class="error-message">An error occurred while loading reviews.</p>';
  }
};

window.loadReviews = async function (courseId) {
  try {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;

    const teacherId = window.currentTeacherId || "";
    if (!teacherId) return;

    const response = await api.getTeacherReviews(teacherId);
    if (response && response.success) {
      const reviews = response.data || [];

      // Check if current student has already reviewed this course
      const alreadyReviewed = reviews.some(
        (r) =>
          r.studentId &&
          r.studentId._id === currentUser._id &&
          r.courseId === courseId,
      );

      // Disable rating UI if already reviewed
      if (alreadyReviewed) {
        const ratingContainer = document.querySelector(
          `.star-rating[data-course="${courseId}"]`,
        );
        if (ratingContainer) {
          const spans = ratingContainer.querySelectorAll("span");
          spans.forEach((s) => {
            s.style.opacity = "0.5";
            s.style.pointerEvents = "none";
            s.title = "You have already reviewed this course";
          });
        }

        const submitBtn = document.querySelector(
          `button[onclick*="submitReview('${courseId}"]`,
        );
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.background = "#cbd5e1";
          submitBtn.style.cursor = "not-allowed";
          submitBtn.textContent = "Already Reviewed";
        }

        const textArea = document.getElementById(`exp-${courseId}`);
        if (textArea) {
          textArea.disabled = true;
          textArea.style.opacity = "0.5";
        }
      }
    }
  } catch (e) {
    console.warn("Could not check reviews:", e);
  }
};

window.viewCourseReviews = async function (courseId) {
  try {
    // Show a loading overlay first
    const loaderHTML = `
      <div id="reviewsModalLoading" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--modal-backdrop, rgba(255, 255, 255, 0.8)); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div class="spinner" style="width: 40px; height: 40px; border: 4px solid rgba(232, 112, 42, 0.3); border-left-color: #E8702A; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>
      </div>
    `;

    // Add dark mode backdrop support if document is dark
    let backdropStyle = "rgba(255, 255, 255, 0.8)";
    let isDarkMode =
      !document.documentElement.hasAttribute("data-theme") ||
      document.documentElement.getAttribute("data-theme") !== "light";
    if (isDarkMode) backdropStyle = "rgba(0, 0, 0, 0.7)";

    document.body.insertAdjacentHTML(
      "beforeend",
      loaderHTML.replace(
        "var(--modal-backdrop, rgba(255, 255, 255, 0.8))",
        backdropStyle,
      ),
    );

    const response = await api.getCourseReviews(courseId);

    // Remove loader
    const loader = document.getElementById("reviewsModalLoading");
    if (loader) loader.remove();

    if (response && response.success) {
      const reviews = response.data || [];

      // Determine modal colors based on theme
      const bgMain = isDarkMode ? "#0f172a" : "#ffffff";
      const bgCard = isDarkMode ? "#1e293b" : "#f3f4f6";
      const textColor = isDarkMode ? "#ffffff" : "#1f2937";
      const subTextColor = isDarkMode ? "#94a3b8" : "#6b7280";
      const borderColor = isDarkMode ? "#334155" : "#e5e7eb";
      const closeBtnBg = isDarkMode ? "#334155" : "#eb7a41";
      const closeBtnHoverBg = isDarkMode ? "#475569" : "#d65c1c";

      // Create modal for displaying reviews
      let reviewsHTML = `
        <div id="reviewsModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: ${backdropStyle}; backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem;">
          <div style="background: ${bgMain}; border-radius: 16px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; padding: 2rem; position: relative; border: 1px solid ${borderColor}; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
            <button onclick="document.getElementById('reviewsModal').remove()" style="position: absolute; top: 1.5rem; right: 1.5rem; background: ${closeBtnBg}; border: none; color: white; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 1.2rem; cursor: pointer; padding: 0; transition: all 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'; this.style.backgroundColor='${closeBtnHoverBg}'" onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='${closeBtnBg}'">✕</button>
            
            <h2 style="margin: 0 0 2rem 0; color: ${textColor}; font-size: 1.8rem; display: flex; align-items: center; gap: 12px; font-family: 'Playfair Display', serif; font-weight: 700;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10904 20.6391 10.5124 21 12 21Z" fill="#fca5a5" stroke="#eb7a41" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Student Reviews
            </h2>
      `;

      if (reviews.length === 0) {
        reviewsHTML += `<p style="text-align: center; color: ${subTextColor}; padding: 2rem; font-family: 'Inter', sans-serif;">No reviews yet for this course.</p>`;
      } else {
        reviews.forEach((review) => {
          const studentName = review.studentId?.name || "Anonymous Student";
          const initial = studentName.charAt(0).toUpperCase();
          const dateStr = new Date(
            review.createdAt || new Date(),
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          // Generate SVG stars
          const ratingCount = Math.round(review.rating) || 5;
          const fullStar =
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
          const emptyStar =
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
          const starsHTML =
            Array(ratingCount).fill(fullStar).join("") +
            Array(5 - ratingCount)
              .fill(emptyStar)
              .join("");

          reviewsHTML += `
            <div style="background: ${bgCard}; border: 1px solid ${borderColor}; padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; font-family: 'Inter', sans-serif;">
              <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: #b592e3; display: flex; align-items: center; justify-content: center; font-weight: 600; color: white; font-size: 1.2rem; flex-shrink: 0;">
                  ${initial}
                </div>
                <div style="flex-grow: 1;">
                  <h4 style="margin: 0 0 0.4rem 0; color: ${textColor}; font-size: 1.1rem; font-weight: 700;">${studentName}</h4>
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 2px;">
                      ${starsHTML}
                    </div>
                    <span style="color: ${subTextColor}; font-size: 0.95rem;">${dateStr}</span>
                  </div>
                </div>
              </div>
              <p style="margin: 0; color: ${textColor}; line-height: 1.6; font-size: 1.05rem; border-left: 3px solid #eb7a41; padding-left: 1rem;">${review.experience}</p>
            </div>
          `;
        });
      }

      reviewsHTML += `
            </div>
          </div>
        </div>
      `;

      // Remove existing modal if present
      const existingModal = document.getElementById("reviewsModal");
      if (existingModal) existingModal.remove();

      // Insert modal into page
      document.body.insertAdjacentHTML("beforeend", reviewsHTML);

      // Close modal on outside click
      document.getElementById("reviewsModal").addEventListener("click", (e) => {
        if (e.target.id === "reviewsModal") {
          document.getElementById("reviewsModal").remove();
        }
      });
    }
  } catch (error) {
    const loader = document.getElementById("reviewsModalLoading");
    if (loader) loader.remove();
    console.error("Error loading reviews:", error);
    alert("Failed to load reviews. Please try again.");
  }
};
