// build/scripts/build-all.js
const path = require("path");
const fs = require("fs");

// Import your existing scripts as modules or require them
const generateTokens = require("./generate-tokens");
const generateTypography = require("./generate-typography-style");
const generateGlobalCss = require("./generate-global-style");
const generateLayoutCss = require("./generate-layout-style");
const generateIndexCss = require("./generate-index-style");

// Ensure dist folder exists
const distDir = path.join(__dirname, "../../dist");
fs.mkdirSync(distDir, { recursive: true });

console.log("🚀 Starting full build process...");

// 1️⃣ Generate token CSS
console.log("Generating token CSS...");
generateTokens();
console.log("✅ Token CSS generated");

// 2️⃣ Generate typography semantic CSS
console.log("Generating typography CSS...");
generateTypography();
console.log("✅ Typography CSS generated");

// 3️⃣ Generate global.css
console.log("Generating global CSS...");
generateGlobalCss();
console.log("✅ global.css generated");

// 4️⃣ Generate layout.css
console.log("Generating layout CSS...");
generateLayoutCss();
console.log("✅ layout.css generated");

// 5️⃣ Generate index.css (single entry)
console.log("Generating index.css...");
generateIndexCss();
console.log("✅ index.css generated");

// 6️⃣ Copy fonts from build/fonts into dist/fonts
function copyDirSync(src, dest) {
  const fs = require("fs");
  const path = require("path");
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const fontsSrc = path.join(__dirname, "../fonts");
const fontsDest = path.join(distDir, "fonts");
copyDirSync(fontsSrc, fontsDest);
console.log("✅ fonts copied to dist/fonts");

// 7️⃣ Copy guideline files to dist/guidelines
const guidelineFiles = [
  "COLOR_GUIDELINES.md",
  "LAYOUT_GUIDELINES.md",
  "SCALE_GUIDELINES.md",
  "TYPOGRAPHY_GUIDELINES.md",
];
const rootDir = path.join(__dirname, "../../");
const guidelinesSrcDir = path.join(rootDir, "guidelines");
const guidelinesDir = path.join(distDir, "guidelines");
fs.mkdirSync(guidelinesDir, { recursive: true });
for (const file of guidelineFiles) {
  const srcPath = path.join(guidelinesSrcDir, file);
  const destPath = path.join(guidelinesDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ guidelines/${file} copied to dist/guidelines`);
  } else {
    console.warn(`⚠️ guidelines/${file} not found in source guidelines directory.`);
  }
}

console.log("🎉 All files built successfully!");
