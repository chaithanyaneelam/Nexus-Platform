const fs=require("fs"); let txt=fs.readFileSync("client/js/router.js", "utf8"); txt=txt.replace(/color:\s*var\(--text-color\);?/g, ""); fs.writeFileSync("client/js/router.js", txt);
