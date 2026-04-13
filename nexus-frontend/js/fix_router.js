const fs = require("fs");
const path = "nexus-frontend/js/router.js";
let content = fs.readFileSync(path, "utf8");

const startIndex = content.indexOf("          if (enrollmentsResp.success) {");
const renderProfileIndex = content.indexOf("  renderProfile() {");

if (startIndex === -1 || renderProfileIndex === -1) {
  console.log("Could not find indices", { startIndex, renderProfileIndex });
  process.exit(1);
}

const extractEndIndex =
  content.indexOf("    this.updateNavbar();", startIndex) +
  "    this.updateNavbar();".length;

const oldSegment = content.substring(startIndex, extractEndIndex);

const newSegment = `          if (enrollmentsResp.success) {
            const enrollments = enrollmentsResp.data.enrollments || [];
            isEnrolled = enrollments.some(
              (e) =>
                (e.courseId === courseId || e.courseId?._id === courseId) &&
                (e.status === "active" || e.status === "completed")
            );
          }
        } catch (e) {
          console.error("Failed to fetch enrollments for course details", e);
        }
      }

      // Define icons logic based on title identical to courses list
      const t = (course.title || "").toLowerCase();
      let iconHtml = \`<div style="font-size: 80px;"><i class="devicon-nodejs-plain colored"></i> <i class="devicon-react-original colored"></i></div>\`;
      
      if (t.includes("microsoft") || t.includes("azure") || t.includes(".net")) {
        iconHtml = \`<div style="display: flex; gap: 15px; align-items: center; justify-content: center; font-size: 70px;"><i class="devicon-azure-plain colored"></i> <i class="devicon-windows8-original colored"></i></div>\`;
      } else if (t.includes("mobile") || t.includes("android") || t.includes("ios") || t.includes("flutter")) {
        iconHtml = \`<div style="display: flex; gap: 20px; align-items: center; justify-content: center; font-size: 65px;"><i class="devicon-android-plain colored"></i> <i class="devicon-apple-original" style="color: #333;"></i></div>\`;
      }

      appDiv.innerHTML = \`
        <div class="course-detail-page" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
          <!-- Top Card -->
          <div class="course-detail-card" style="background: var(--light-card-bg, #fff); border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03); display: flex; flex-wrap: wrap; gap: 2rem;">
            
            <!-- Left Side / Icon -->
            <div style="flex: 1; min-width: 250px; border-radius: 8px; padding: 3rem 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; background: #fff;">
              <div style="margin-bottom: 1.5rem; display: flex; justify-content: center; align-items: center;">
                \${iconHtml}
              </div>
              <h1 style="color: #1e293b; font-size: 1.8rem; text-align: center; margin: 0; font-family: 'Playfair Display', serif; font-weight: 700;">\${course.title}</h1>
            </div>

            <!-- Right Side / Details -->
            <div style="flex: 2; min-width: 300px; display: flex; flex-direction: column;">
              <div style="margin-bottom: 1.5rem;">
                <p style="margin: 0 0 0.5rem 0; color: #475569; display: flex; align-items: center; gap: 8px; font-weight: 500;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 
                  Instructor: <span style="color: #0f172a;">\${course.instructor || course.teacherId?.name || "Unknown"}</span>
                </p>
                <p style="margin: 0 0 0.5rem 0; color: #64748b; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <a href="\${course.teacherId?.linkedinUrl || '#'}" target="_blank" style="color: #0284c7; text-decoration: none;">LinkedIn Profile</a>
                </p>
                <p style="margin: 0 0 0.5rem 0; color: #64748b; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <a href="\${course.teacherId?.githubUrl || '#'}" target="_blank" style="color: #0284c7; text-decoration: none;">GitHub Profile</a>
                </p>
                <p style="margin: 1rem 0 0 0; color: #334155; font-size: 1.05rem;">\${course.description}</p>
              </div>

              <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #fff;">
                <div style="color: #0f172a; font-weight: 500; font-size: 0.95rem;">Company: <span style="font-weight: 600; color: #E8702A;">\${course.company || course.teacherId?.company || "N/A"}</span></div>
                <div style="color: #475569; font-weight: 500; font-size: 0.95rem;">Role: <span style="font-weight: 600; color: #334155;">\${course.role || course.teacherId?.profession || "N/A"}</span></div>
                \${isEnrolled ? \`<div style="color: #0f172a; font-weight: 500; font-size: 0.95rem;">Mobile: <span style="font-weight: 400; color: #475569;">\${course.teacherId?.mobileNumber || "N/A"}</span></div>\` : ""}
                <div style="color: #0f172a; font-weight: 500; font-size: 0.95rem;">Duration: <span style="font-weight: 400; color: #475569;">\${course.duration || "Self-paced"} months</span></div>
                <div style="color: #0f172a; font-weight: 500; font-size: 0.95rem;">Students: <span style="font-weight: 400; color: #475569;">\${course.enrolledCount || 0}</span></div>
              </div>

              <div style="margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem; display: flex; align-items: center; gap: 1.5rem;">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: #64748b; letter-spacing: 0.5px; margin-bottom: 0.25rem;">RATING</div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.5rem; font-weight: 700; color: #0f172a;">(\${(course.teacherId?.averageRating || 0).toFixed(1)})</span>
                    <div style="color: #fbbf24; font-size: 1.25rem;">
                      \${"★".repeat(Math.round(course.teacherId?.averageRating || 0))}\${"☆".repeat(5 - Math.round(course.teacherId?.averageRating || 0))}
                    </div>
                  </div>
                </div>
                <button onclick="window.viewCourseReviews('\${courseId}')" style="background: none; border: none; color: #0f766e; text-decoration: underline; cursor: pointer; font-weight: 500; font-size: 0.95rem; padding: 0; margin-top: 15px;">Read all reviews</button>
              </div>

              <div>
                \${
                  auth.isAuthenticated() && auth.isStudent() && !isEnrolled
                    ? \`<button class="btn btn-primary" onclick="enrollCourse('\${courseId}')" style="background: #E8702A; padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; border: none; width: max-content; color: white;">Enroll Now - ₹\${course.price || 0}</button>\`
                    : auth.isAuthenticated() && auth.isStudent() && isEnrolled
                      ? \`<button class="btn btn-success" disabled style="padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; border: none; width: max-content; background: #10b981; color: white;">Already Enrolled</button>\`
                      : auth.isAuthenticated() &&
                          auth.isTeacher() &&
                          auth.getCurrentUser()._id ===
                            (course.teacherId?._id || course.teacherId)
                        ? \`<a href="/edit-course/\${courseId}" class="btn btn-secondary" style="padding: 0.8rem 2rem; font-size: 1.1rem; border-radius: 30px; width: max-content; display: inline-block;">Edit Course</a>\`
                        : ""
                }
              </div>
            </div>
          </div>

          <!-- Bottom Card -->
          <div class="course-content-card" style="background: var(--light-card-bg, #fff); border-radius: 12px; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
            <h3 style="color: #1e293b; font-size: 1.4rem; margin: 0 0 1rem 0; font-family: 'Playfair Display', serif;">Description</h3>
            <p style="color: #334155; line-height: 1.7; margin-bottom: 2rem; font-family: 'Inter', sans-serif;">\${course.fullDescription || course.description}</p>

            <h3 style="color: #1e293b; font-size: 1.4rem; margin: 0 0 1rem 0; font-family: 'Playfair Display', serif;">Highlights</h3>
            <ul style="list-style-type: none; padding: 0; margin: 0; color: #334155; line-height: 1.7; display: flex; flex-wrap: wrap; gap: 1.5rem; font-family: 'Inter', sans-serif;">
              \${(course.highlights || [])
                .map((highlight) => \`<li style="display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.95rem; font-weight: 500;">
                  <span style="color: #E8702A;">#</span>
                  <span>\${highlight}</span>
                </li>\`)
                .join("")}
            </ul>
          </div>
        </div>
      \`;
    } catch (error) {
      appDiv.innerHTML = \`<div class="error-message">Error loading course: \${error.message}</div>\`;
    }

    this.updateNavbar();`;

content = content.replace(oldSegment, newSegment);
fs.writeFileSync(path, content);
console.log("File successfully updated!");
