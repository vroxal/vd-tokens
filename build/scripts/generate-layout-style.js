module.exports = function generateLayoutCss() {
  const fs = require("fs");
  const path = require("path");

  const outputDir = path.join(__dirname, "../../dist");
  const outputFile = path.join(outputDir, "layout.css");
  const layoutMapPath = path.join(__dirname, "../maps/layout-map.json");

  fs.mkdirSync(outputDir, { recursive: true });

  const layoutStyles = require(layoutMapPath);
  let css = "/* Auto-generated layout styles */\n\n";

  for (const [selector, props] of Object.entries(layoutStyles)) {
    css += `${selector} {\n`;
    for (const [key, value] of Object.entries(props)) {
      css += `  ${key}: ${value};\n`;
    }
    css += "}\n\n";
  }

  fs.writeFileSync(outputFile, css.trim() + "\n");
  console.log("✅ layout.css generated");
};
