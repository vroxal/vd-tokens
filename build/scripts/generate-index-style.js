module.exports = function generateIndexCss() {
  const fs = require("fs");
  const path = require("path");

  const distDir = path.join(__dirname, "../../dist");
  const outputFile = path.join(distDir, "index.css");

  // Ensure dist exists
  fs.mkdirSync(distDir, { recursive: true });

  // List of CSS files to include
  const filesToInclude = [
    "global.css",
    "layout.css",
    "tokens/colors.css",
    "tokens/scale.css",
    "tokens/typography.css",
    "semantic/typography-semantic.css",
  ];

  let indexCssContent = "";
  filesToInclude.forEach((file) => {
    indexCssContent += `@import "./${file}";\n`;
  });

  // Write index.css
  fs.writeFileSync(outputFile, indexCssContent);

  console.log("✅ index.css generated successfully");
};
