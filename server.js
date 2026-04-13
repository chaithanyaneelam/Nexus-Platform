const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "nexus-frontend");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "audio/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

const server = http.createServer((req, res) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);

  // Remove '/nexus-frontend' prefix if requested that way so it maps correctly
  let reqUrl = req.url.replace(/^\/nexus-frontend/, "");

  // Parse URL and determine strictly if it's a file request (has extension)
  const ext = path.extname(reqUrl).toLowerCase();

  // For SPA routes without extensions (e.g., /courses, /home), fall back to index.html
  let filePath = path.join(PUBLIC_DIR, reqUrl);
  if (reqUrl === "/" || ext === "") {
    filePath = path.join(PUBLIC_DIR, "index.html");
  }

  // Attempt to read the requested file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // If a specific file like image.png wasn't found, 404
        if (ext !== "") {
          res.writeHead(404);
          res.end("404 Not Found");
        } else {
          // For missing paths without extensions, serve index.html (SPA Fallback)
          fs.readFile(
            path.join(PUBLIC_DIR, "index.html"),
            (err, fallbackContent) => {
              if (err) {
                res.writeHead(500);
                res.end("500 Internal Server Error (No index.html found)");
              } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(fallbackContent, "utf-8");
              }
            },
          );
        }
      } else {
        res.writeHead(500);
        res.end(`500 Internal Server Error: ${error.code}`);
      }
    } else {
      const contentType = MIME_TYPES[ext] || "text/html";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SPA Local Server running at http://localhost:${PORT}/`);
  console.log(`   It handles clean URLs (e.g., /courses, /home, etc.)`);
  console.log(`   Press Ctrl+C to stop`);
  console.log(`======================================================\n`);
});
