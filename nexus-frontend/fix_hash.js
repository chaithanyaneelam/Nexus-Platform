const fs = require("fs");
const filepath = "./nexus-frontend/js/router.js";
let content = fs.readFileSync(filepath, "utf8");
content = content.replace(
  /window\.location\.hash\s*=\s*(['"])(#.*?)\1/g,
  (match, p1, p2) => {
    return "router.navigate(" + p1 + p2.replace("#", "") + p1 + ")";
  },
);
fs.writeFileSync(filepath, content);
console.log("Replaced correctly");
