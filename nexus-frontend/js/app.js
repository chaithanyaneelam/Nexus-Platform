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
