const fs = require("fs");
const file = "nexus-frontend/js/router.js";
let content = fs.readFileSync(file, "utf8");

const oldStr = `                  </button>
                </div>
              </div>
            \`;
          })`;

const newStr = `                  </button>
                </div>

                <!-- Course Review Section -->
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);" onclick="event.stopPropagation();">
                  <h4 style="margin: 0 0 0.5rem 0; color: #e2e8f0; font-size: 1rem;">Rate this Course</h4>
                  <div class="star-rating" data-course="\${courseIdStr}" style="display: flex; gap: 0.25rem; margin-bottom: 0.75rem; font-size: 1.5rem; color: #475569;">
                    <span id="star-\${courseIdStr}-1" onclick="window.setRating('\${courseIdStr}', 1)" style="cursor: pointer;">★</span>
                    <span id="star-\${courseIdStr}-2" onclick="window.setRating('\${courseIdStr}', 2)" style="cursor: pointer;">★</span>
                    <span id="star-\${courseIdStr}-3" onclick="window.setRating('\${courseIdStr}', 3)" style="cursor: pointer;">★</span>
                    <span id="star-\${courseIdStr}-4" onclick="window.setRating('\${courseIdStr}', 4)" style="cursor: pointer;">★</span>
                    <span id="star-\${courseIdStr}-5" onclick="window.setRating('\${courseIdStr}', 5)" style="cursor: pointer;">★</span>
                  </div>
                  <input type="hidden" id="rating-val-\${courseIdStr}" value="0">
                  <label for="exp-\${courseIdStr}" style="display:block; margin-bottom:0.25rem; font-size:0.85rem; color:#cbd5e1;">Experience</label>
                  <textarea id="exp-\${courseIdStr}" rows="2" style="width: 100%; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: white; padding: 0.5rem; margin-bottom: 0.75rem; resize: vertical;" placeholder="Write your experience..."></textarea>
                  <button onclick="window.submitReview('\${courseIdStr}', '\${teacher._id || teacher.id || ''}')"
                          style="width: 100%; padding: 0.5rem; background: #f59e0b; color: white;
                                 border: none; border-radius: 6px; font-weight: 600; cursor: pointer;
                                 transition: all 0.3s; font-size: 0.9rem;"
                          onmouseover="this.style.background='#d97706'"
                          onmouseout="this.style.background='#f59e0b'">
                    Submit Review
                  </button>
                  <div id="review-msg-\${courseIdStr}" style="margin-top: 0.5rem; font-size: 0.85rem;"></div>
                </div>

              </div>
            \`;
          })`;

content = content.replace(oldStr, newStr);
content = content.replace(
  oldStr.replace(/\r\n/g, "\n"),
  newStr.replace(/\r\n/g, "\n"),
);
content = content.replace(
  oldStr.replace(/\n/g, "\r\n"),
  newStr.replace(/\n/g, "\r\n"),
);
fs.writeFileSync(file, content);
console.log("done running fix.js");
