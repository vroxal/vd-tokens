module.exports = function generateGlobalCss() {
  const fs = require("fs");
  const path = require("path");

  const outputDir = path.join(__dirname, "../../dist");
  const outputFile = path.join(outputDir, "global.css");
  const globalMapPath = path.join(__dirname, "../maps/global-map.json");

  fs.mkdirSync(outputDir, { recursive: true });

  const globalStyles = require(globalMapPath);

  let css = `
/* 1. Box sizing */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 2. Remove default margin */
* {
  margin: 0;
}

/* 3. Improve text rendering */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* 4. Media defaults */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

/* 5. Remove built-in form typography */
input,
button,
textarea,
select {
  font: inherit;
}

/* 6. Avoid text overflows */
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/* 7. Create root stacking context */
#root,
#__next {
  isolation: isolate;
}
`;

  // Generate global element rules
  for (const [selector, props] of Object.entries(globalStyles)) {
    css += `${selector} {\n`;
    for (const [key, value] of Object.entries(props)) {
      css += `  ${key}: ${value};\n`;
    }
    css += "}\n\n";
  }

  fs.writeFileSync(outputFile, css.trim());
  console.log("✅ global.css generated");
};
