const fs = require("fs");

function applyUIFixes() {
  const filePath = "nexus-frontend/js/router.js";
  let content = fs.readFileSync(filePath, "utf8");

  // --- 1. EXPLORE COURSES FIX ---
  const exploreStartContext =
    '        appDiv.innerHTML = `\n          <div class="courses-page">';
  const exploreEndContext = "          </div>\n        `;";

  const exploreStartIndex = content.indexOf(exploreStartContext);
  const exploreEndIndex = content.indexOf(exploreEndContext, exploreStartIndex);

  if (exploreStartIndex !== -1 && exploreEndIndex !== -1) {
    const newExploreHtml = `        appDiv.innerHTML = \`
          <div class="courses-page" style="background-color: #faf5ed; min-height: 100vh; padding: 3rem 2rem; width: 100%; box-sizing: border-box; margin: -2rem -2rem 0 -2rem;">
            <div style="max-width: 1200px; margin: 0 auto;">
              
              <div class="page-header" style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 3rem;">
                <h2 style="margin:0; font-family: Georgia, serif; font-size: 2.8rem; color: #111827; font-weight: normal;">\${pageTitle}</h2>
                
                <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; flex: 1; justify-content: flex-end;">
                  <div class="search-bar" style="display:flex; align-items:center; background: white; border: 1px solid #e5e7eb; border-radius: 50px; padding: 0.5rem 1.5rem; flex: 1; max-width: 400px; min-width: 250px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <span class="material-icons" style="color: #9ca3af; font-size: 1.4rem; margin-right: 0.5rem;">search</span>
                    <input type="text" id="courseSearchInput" placeholder="Find your next career path..." style="background: transparent; border: none; color: #111827; padding: 0.25rem; outline: none; width: 100%; font-size: 1rem;">
                  </div>
                  <button style="background: #f3f4f6; color: #111827; padding: 0.8rem 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb; font-weight: 500; font-size: 0.95rem; cursor: pointer;">Advanced Filters</button>
                  \${showCreateButton ? \`<a href="#create-course" class="btn btn-primary" style="margin-left: 1rem;">Create Course</a>\` : ""}
                </div>
              </div>

              <div class="courses-grid" id="coursesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
                \${
                  courses.length > 0
                    ? courses
                        .map((course) => {
                          const teacher = course.teacherId || {};
                          let titleLower = (course.title || "").toLowerCase();
                          let iconHtml = '<span class="material-icons" style="font-size: 64px; color: #93c5fd;">stars</span>';
                          if (titleLower.includes('microsoft') || titleLower.includes('.net') || titleLower.includes('c#')) {
                             iconHtml = '<img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" style="height: 60px;" alt="Azure"/> <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg" style="height: 60px; margin-left: 15px;" alt="Windows"/>';
                          } else if (titleLower.includes('mobile') || titleLower.includes('app') || titleLower.includes('flutter') || titleLower.includes('react native')) {
                             iconHtml = '<span class="material-icons" style="font-size: 80px; color: #93c5fd;">smartphone</span> <span style="background:#f97316; color:white; padding:2px 6px; border-radius:4px; font-size:12px; font-weight:bold; position:absolute; transform: translate(-20px, 10px);">&lt;/&gt;</span>'; 
                          } else if (titleLower.includes('full stack') || titleLower.includes('web') || titleLower.includes('node')) {
                             iconHtml = '<span class="material-icons" style="font-size: 80px; color: #93c5fd;">layers</span> <span class="material-icons" style="color: #10b981; position: absolute; transform: translate(-15px, 20px);">settings</span>'; 
                          } else {
                             iconHtml = '<span class="material-icons" style="font-size: 64px; color: #93c5fd;">stars</span>';
                          }

                          return \`
                  <div class="course-card" style="background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s; border: 1px solid #e5e7eb;" onclick="window.location.hash='#course-detail/\${course._id}'">
                    
                    <!-- Banner -->
                    <div style="background: #1e3a8a; height: 140px; display: flex; align-items: center; justify-content: center; position: relative;">
                      \${iconHtml}
                    </div>

                    <!-- Body -->
                    <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                      <h3 style="margin: 0 0 1.25rem 0; font-size: 1.3rem; font-weight: 700; color: #111827;">\${course.title}</h3>
                      
                      <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem; color: #4b5563;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <span class="material-icons" style="font-size: 1.2rem;">person_outline</span>
                          <span>Instructor: \${course.instructor || teacher.name || "Unknown Teacher"}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <span class="material-icons" style="font-size: 1.2rem;">domain</span>
                          <span>Company: \${course.company || teacher.company || "N/A"}</span>
                        </div>
                         <div style="display: flex; align-items: center; gap: 0.5rem;">
                          <span class="material-icons" style="font-size: 1.2rem;">badge</span>
                          <span>Role: \${course.role || teacher.profession || teacher.role || "Instructor"}</span>
                        </div>
                      </div>

                      <div style="border-top: 1px dashed #cbd5e1; margin: 1.25rem 0;"></div>

                      <div style="font-size: 0.95rem; color: #111827; flex: 1;">
                        <ul style="padding-left: 1.2rem; margin: 0;">
                          <li style="margin-bottom: 0.25rem;">\${course.description ? course.description.split('.')[0] : "Build end-to-end web apps with modern frontends"}</li>
                        </ul>
                      </div>

                      <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: #4b5563; margin-top: 1rem; margin-bottom: 1.5rem;">
                        <span class="material-icons" style="font-size: 1.2rem;">group_outline</span>
                        <span>\${course.enrolledCount || 0} students registered</span>
                      </div>

                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <span style="font-size: 1.4rem; font-weight: 700; color: #111827;">₹\${course.price || 0}</span>
                        <span style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.95rem; color: #4b5563;">
                          <span class="material-icons" style="font-size: 1.1rem;">schedule</span> \${course.duration || 2} months
                        </span>
                      </div>

                      <button class="btn" style="background: #ea580c; color: white; border: none; border-radius: 50px; padding: 0.8rem; text-align: center; text-decoration: none; font-weight: 500; font-size: 1.1rem; width: 100%; box-sizing: border-box; display: block; box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3); cursor: pointer;" onclick="event.stopPropagation(); enrollCourse('\${course._id}');">Enroll Now</button>
                    </div>
                  </div>
                \`;
                        })
                        .join("")
                    : \`<p class='no-courses'>No courses available\${user && user.role === "teacher" ? ". Create your first course!" : ""}</p>\`
                }
              </div>
            </div>
          </div>
        \`;`;

    content =
      content.substring(0, exploreStartIndex) +
      newExploreHtml +
      content.substring(exploreEndIndex + exploreEndContext.length);
  } else {
    console.error("Explore Courses boundary not found.");
  }

  // --- 2. VIEW COURSE DETAIL FIX ---
  const viewStartContext =
    '        appDiv.innerHTML = `\n          <div class="course-detail-page"';
  const viewEndContext = "      `;";

  const viewStartIndex = content.indexOf(viewStartContext);
  const viewEndIndex = content.indexOf(viewEndContext, viewStartIndex);

  if (viewStartIndex !== -1 && viewEndIndex !== -1) {
    const newViewHtml = `        appDiv.innerHTML = \`
          <div class="course-detail-page" style="width: 100% !important; margin: 0; padding: 2rem; background-color: #faf5ed; min-height: 100vh; box-sizing: border-box;">
            <!-- Content Container -->
            <div style="max-width: 1100px; margin: 0 auto;">
              <!-- TOP SECTION -->
              <div style="display: flex; gap: 2rem; margin-bottom: 2rem; align-items: stretch; flex-wrap: wrap;">

                <!-- Left Box: Course Icon and Title -->
                <div style="flex: 0 0 35%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 3rem 2rem; text-align: center; min-width: 280px; border: 1px solid #e5e7eb;">
                  <!-- Generic course illustration -->
                  <img src="\${course.thumbnail || 'https://cdn-icons-png.flaticon.com/512/2210/2210153.png'}" alt="Course Icon" style="width: 160px; height: 160px; margin-bottom: 2.5rem; object-fit: contain;" />
                  <h2 style="font-size: 2.4rem; font-weight: 700; margin: 0; color: #111827; line-height: 1.3;">
                    \${course.title || "Full Stack Development"}
                  </h2>
                </div>

                <!-- Right Box: Instructor Details and Stats -->
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 320px;">
                  
                  <!-- Instructor headers -->
                  <div style="margin-bottom: 1.5rem;">
                    <p style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #111827; display: flex; align-items: center; gap: 0.5rem;">
                      <span class="material-icons" style="font-size: 1.2rem; color: #4b5563;">person_outline</span>
                      <span style="font-weight: 600;">Instructor:</span> \${course.instructor || course.teacherId?.name || "chaithanya"}
                    </p>
                    
                    \${course.teacherId?.linkedinUrl ? \`
                    <p style="margin: 0 0 0.5rem 0; font-size: 1rem;">
                      <a href="\${course.teacherId.linkedinUrl}" target="_blank" style="color: #111827; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" style="width: 20px; height: 20px;" alt="LinkedIn" />
                        LinkedIn Profile
                      </a>
                    </p>
                    \` : \`<p style="margin: 0 0 0.5rem 0; font-size: 1rem; color: #111827; display: flex; align-items: center; gap: 0.5rem;">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" style="width: 20px; height: 20px;" alt="LinkedIn" /> <span style="color: #111827;">LinkedIn Profile</span>
                        </p>\`}
                    
                    \${course.teacherId?.githubUrl ? \`
                    <p style="margin: 0 0 0.5rem 0; font-size: 1rem;">
                      <a href="\${course.teacherId.githubUrl}" target="_blank" style="color: #111827; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-weight: 600; font-size: 1.1rem;">&lt;/&gt;</span> GitHub Profile
                      </a>
                    </p>
                    \` : \`<p style="margin: 0 0 0.5rem 0; font-size: 1rem; color: #111827; display: flex; align-items: center; gap: 0.5rem;">
                          <span style="font-weight: 700; color: #111827; font-size: 1.1rem;">&lt;/&gt;</span> <span style="color: #111827;">GitHub Profile</span>
                        </p>\`}
                  </div>

                  <p style="margin: 0 0 1.5rem 0; font-size: 1.25rem; color: #111827;">
                    \${course.category || "full stack with web development"}
                  </p>

                  <!-- Stats Box -->
                  <div style="border-radius: 12px; margin-bottom: 2rem; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                    
                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; border-bottom: 1px solid #e5e7eb;">
                      <div style="display: flex; align-items: center; padding: 1.25rem; font-size: 1rem; color: #111827;">
                        <strong style="margin-right: 0.5rem;">Company:</strong> 
                        <span style="display:inline-flex; align-items:center; gap:0.25rem;">
                          <span style="color:#d946ef; font-weight:bold; font-size: 1.1rem; font-style: italic;">W</span>
                          \${course.company || course.teacherId?.company || "WonderKids"}
                        </span>
                      </div>
                      <div style="display: flex; align-items: center; padding: 1.25rem; font-size: 1rem; color: #111827; border-left: 1px solid #e5e7eb;">
                        <strong style="margin-right: 0.5rem;">Role:</strong> 
                        <span style="background: #f3f4f6; color: #111827; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.95rem;">
                          \${course.role || course.teacherId?.profession || "Full Stack Developer"}
                        </span>
                      </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.2fr 1fr; border-bottom: 1px solid #e5e7eb;">
                       <div style="display: flex; align-items: center; padding: 1.25rem; font-size: 1rem; color: #111827;">
                        <strong style="margin-right: 0.5rem;">Duration:</strong> \${course.duration || "2"} months
                      </div>
                      <div style="display: flex; align-items: center; padding: 1.25rem; font-size: 1rem; color: #111827; border-left: 1px solid #e5e7eb;">
                         <span class="material-icons" style="font-size: 1.2rem; margin-right: 0.5rem; color: #4b5563;">group_outline</span> 
                         <strong style="margin-right: 0.5rem;">Students:</strong> \${course.enrolledCount || 2}
                      </div>
                    </div>

                    <!-- Rating Section -->
                    <div style="padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
                      <strong style="font-size: 0.95rem; text-transform: uppercase; color: #111827; letter-spacing: 0.5px;">RATING</strong>
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        \${(() => {
                            let avg = course.teacherId?.averageRating || course.averageRating || 0;
                            if(avg === 0) avg = 5.0;
                            let numStars = Math.round(avg);
                            // Corrected reviews counting directly from the array length or proper count var
                            let reviewsCount = Array.isArray(course.reviews) ? course.reviews.length : (course.reviewsCount || 0);
                            return \`
                              <span style="font-size: 2rem; font-weight: 400; color: #111827;">(\${avg.toFixed(1)})</span>
                              <div style="display: flex; color: #f59e0b; font-size: 2.2rem; gap: 4px;">
                                \${Array.from({ length: Math.min(5, numStars) }).map(() => '&#9733;').join('')}\${Array.from({ length: Math.max(0, 5 - numStars) }).map(() => '&#9734;').join('')}
                              </div>
                              <a href="javascript:void(0)" onclick="window.viewCourseReviews('\${course._id || courseId}')" style="font-size: 1rem; color: #111827; text-decoration: underline; margin-left: 0.5rem;">Read all \${reviewsCount} reviews</a>
                            \`;
                        })()}
                      </div>
                    </div>
                  </div>

                  <!-- Enroll button / Action Button -->
                  <div>
                    \${
                      auth.isAuthenticated() && auth.isStudent() && !isEnrolled
                        ? \`<button class="btn btn-primary" onclick="enrollCourse('\${courseId}')" style="width: 100%; max-width: 320px; padding: 1rem; font-size: 1.25rem; font-weight: 500; background: #ea580c; border:none; border-radius: 50px; color: white; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);">Enroll Now - ₹\${course.price || 5000}</button>\`
                        : auth.isAuthenticated() && auth.isStudent() && isEnrolled
                          ? \`<button class="btn btn-success" disabled style="width: 100%; max-width: 320px; padding: 1rem; font-size: 1.25rem; font-weight: 500; background: #22c55e; border:none; border-radius: 50px; color: white; opacity: 0.8; display: flex; justify-content: center; align-items: center;">Already Enrolled</button>\`
                          : auth.isAuthenticated() && auth.isTeacher() && auth.getCurrentUser()._id === (course.teacherId?._id || course.teacherId)
                            ? \`<a href="#edit-course/\${courseId}" class="btn btn-secondary" style="display: inline-flex; justify-content: center; align-items: center; width: 100%; max-width: 320px; padding: 1rem; font-size: 1.25rem; font-weight: 500; background: #475569; border-radius: 50px; color: white;">Edit Course</a>\`
                            : \`<button class="btn btn-primary" onclick="enrollCourse('\${courseId}')" style="width: 100%; max-width: 320px; padding: 1rem; font-size: 1.25rem; font-weight: 500; background: #ea580c; border:none; border-radius: 50px; color: white; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);">Enroll Now - ₹\${course.price || 5000}</button>\`
                    }
                  </div>

                </div>
              </div>

              <!-- BOTTOM SECTION -->
              <div style="background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; margin-top: 1rem;">
                
                <div style="margin-bottom: 2rem;">
                  <h3 style="font-size: 1.6rem; color: #111827; margin: 0 0 1rem 0; font-weight: 600;">Description</h3>
                  <p style="color: #111827; font-size: 1.1rem; margin: 0 0 0.5rem 0;">\${course.category || "full stack with web development"}</p>
                  <ul style="color: #111827; font-size: 1.05rem; line-height: 1.6; padding-left: 1.2rem; margin: 0;">
                    \${(course.description || "Frontend, full-stack web development based on project patterns. Master user-centric design models. Backend server applications models with ethical hacking.")
                        .split('.')
                        .filter(sentence => sentence.trim().length > 0)
                        .map(sentence => \`<li style="margin-bottom: 0.4rem;">\${sentence.trim()}.</li>\`)
                        .join('')
                    }
                  </ul>
                </div>

                <h3 style="font-size: 1.6rem; color: #111827; margin: 0 0 1.5rem 0; font-weight: 600;">Highlights</h3>
                
                <div style="display: flex; align-items: center; gap: 3rem; flex-wrap: wrap;">
                  \${(() => {
                      const highlights = Array.isArray(course.highlights) && course.highlights.length > 0 
                          ? course.highlights 
                          : ["Frontend", "Backend", "Database", "Node.js"];
                      return highlights.map(h => {
                          let iconStr = '<span class="material-icons" style="color: #4b5563; font-size: 1.6rem;">stars</span>';
                          let hLower = h.toLowerCase();
                          if(hLower.includes('front') || hLower.includes('html') || hLower.includes('css') || hLower.includes('ui')) 
                              iconStr = '<span class="material-icons" style="color: #1d4ed8; font-size: 1.8rem;">code</span>';
                          else if(hLower.includes('back') || hLower.includes('api') || hLower.includes('server')) 
                              iconStr = '<span class="material-icons" style="color: #111827; font-size: 1.8rem;">dns</span>';
                          else if(hLower.includes('data') || hLower.includes('sql') || hLower.includes('mongo')) 
                              iconStr = '<span class="material-icons" style="color: #111827; font-size: 1.8rem;">storage</span>';
                          else if(hLower.includes('node')) 
                              iconStr = '<img src="https://img.icons8.com/?size=100&id=54087&format=png&color=000000" style="width: 28px; height: 28px;" alt="Node" />';
                          else if(hLower.includes('js') || hLower.includes('javascript')) 
                              iconStr = '<span class="material-icons" style="color: #eab308; font-size: 1.8rem;">javascript</span>';
                          else if(hLower.includes('python')) 
                              iconStr = '<span class="material-icons" style="color: #111827; font-size: 1.8rem;">terminal</span>';
                          else if(hLower.includes('react')) 
                              iconStr = '<span class="material-icons" style="color: #3b82f6; font-size: 1.8rem;">web</span>';
                          
                          return \`
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                              \${hLower.includes('front') && !iconStr.includes('stars') 
                                  ? \`<div style="background: #e0f2fe; padding: 0.5rem; border-radius: 6px; border: 1px solid #bfdbfe; display:flex; align-items: center; justify-content: center; min-width: 40px; min-height: 40px;">\${iconStr}</div>\` 
                                  : \`<div style="display:flex; align-items: center; justify-content: center; min-width: 40px; min-height: 40px;">\${iconStr}</div>\`}
                              <span style="color: #111827; font-weight: 500; font-size: 1.2rem;">\${h}</span>
                            </div>
                          \`;
                      }).join('');
                  })()}
                </div>

              </div>
            </div>
          </div>
        \`;`;

    content =
      content.substring(0, viewStartIndex) +
      newViewHtml +
      content.substring(viewEndIndex + viewEndContext.length);
  } else {
    console.error("View Course boundary not found.");
  }

  fs.writeFileSync(filePath, content);
  console.log("Successfully rolled back AND applied exact UI updates.");
}

applyUIFixes();
