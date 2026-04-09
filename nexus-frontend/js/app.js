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
          mobileMenuToggle.innerHTML = "&times;"; // close symbol
          mobileMenuToggle.style.fontSize = "2rem"; // slightly larger for 'x'
        } else {
          mobileMenuToggle.innerHTML = "&#9776;"; // hamburger
          mobileMenuToggle.style.fontSize = "1.5rem";
        }
      });

      // Close menu on link click
      navbarMenu.addEventListener("click", (e) => {
        if (
          e.target.tagName === "A" ||
          e.target.classList.contains("nav-link")
        ) {
          navbarMenu.classList.remove("active");
          mobileMenuToggle.innerHTML = "&#9776;";
          mobileMenuToggle.style.fontSize = "1.5rem";
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

  const adminMail = "neelamchaithanya9@gmail.com";
  const subject = encodeURIComponent("Support Request from " + name);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\n\nIssue:\n${issue}`,
  );

  const mailtoLink = `mailto:${adminMail}?subject=${subject}&body=${body}`;
  const a = document.createElement("a");
  a.href = mailtoLink;
  a.target = "_blank"; // Opens email client correctly without getting blocked by typical browser rules
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  NexusApp.notify("Opening mail client...", "success");
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
    const response = await api.getCourseReviews(courseId);
    if (response && response.success) {
      const reviews = response.data || [];

      // Create modal for displaying reviews
      let reviewsHTML = `
        <div id="reviewsModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem;">
          <div style="background: #0f172a; border-radius: 12px; max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto; padding: 2rem; position: relative; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
            <button onclick="document.getElementById('reviewsModal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0;">✕</button>
            
            <h2 style="margin: 0 0 2rem 0; color: white; font-size: 1.5rem;">Student Reviews</h2>
      `;

      if (reviews.length === 0) {
        reviewsHTML += `<p style="text-align: center; color: #94a3b8; padding: 2rem;">No reviews yet for this course.</p>`;
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

          reviewsHTML += `
            <div style="background: #1e293b; border: 1px solid #334155; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 1rem;">
                  ${initial}
                </div>
                <div>
                  <h4 style="margin: 0 0 0.25rem 0; color: #e2e8f0; font-size: 0.95rem;">${studentName}</h4>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="color: #fbbf24; font-size: 0.9rem;">
                      ${"⭐".repeat(review.rating)}
                    </div>
                    <span style="color: #94a3b8; font-size: 0.8rem;">${dateStr}</span>
                  </div>
                </div>
              </div>
              <p style="margin: 0; color: #cbd5e1; line-height: 1.5; font-size: 0.9rem; border-left: 3px solid #667eea; padding-left: 1rem;">"${review.experience}"</p>
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
    console.error("Error loading reviews:", error);
    alert("Failed to load reviews. Please try again.");
  }
};
