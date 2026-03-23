module.exports = function generateTypography() {
  const fs = require("fs");
  const path = require("path");
  const typographyMap = require("../maps/typography-map.json");

  const outputDir = path.join(__dirname, "../../dist/semantic");
  const outputFile = path.join(outputDir, "typography-semantic.css");
  fs.mkdirSync(outputDir, { recursive: true });

  // 0️⃣ Build @font-face rules by scanning build/fonts (relative to build/scripts)
  const fontsDir = path.join(__dirname, "../fonts");
  let fontFaceCss = "";

  function formatFromExt(filename) {
    if (filename.endsWith(".ttf")) return "truetype";
    if (filename.endsWith(".otf")) return "opentype";
    if (filename.endsWith(".woff")) return "woff";
    if (filename.endsWith(".woff2")) return "woff2";
    return "";
  }

  function inferWeight(descriptor) {
    const d = descriptor.toLowerCase();
    if (d.includes("thin")) return 100;
    if (d.includes("extralight") || d.includes("ultralight")) return 200;
    if (d.includes("light")) return 300;
    if (d.includes("regular") || d.includes("book")) return 400;
    if (d.includes("medium")) return 500;
    if (d.includes("semibold") || d.includes("demibold")) return 600;
    if (d.includes("bold")) return 700;
    if (d.includes("extrabold") || d.includes("heavy")) return 800;
    if (d.includes("black")) return 900;
    return 400;
  }

  function inferStyle(descriptor) {
    return descriptor.toLowerCase().includes("italic") ? "italic" : "normal";
  }

  if (fs.existsSync(fontsDir)) {
    const families = fs
      .readdirSync(fontsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const familyFolder of families) {
      const familyPath = path.join(fontsDir, familyFolder);
      const files = fs
        .readdirSync(familyPath)
        .filter((f) => !f.startsWith("."));
      // Attempt to create a readable family name from folder or typography map
      const mapFonts = typographyMap.fonts || {};
      let familyName = (
        Object.values(mapFonts).find(
          (f) =>
            f.path && f.path.toLowerCase().includes(familyFolder.toLowerCase()),
        ) || {}
      ).family;
      if (!familyName) {
        // fallback: prettify folder name
        familyName = familyFolder
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }

      for (const file of files) {
        const descr = file
          .replace(/^[^-]+-?/, "")
          .replace(/\.(woff2|woff|ttf|otf)$/i, "");
        const weight = inferWeight(descr);
        const style = inferStyle(descr);
        const fmt = formatFromExt(file);
        const relUrl = path
          .join("..", "fonts", familyFolder, file)
          .replace(/\\/g, "/");
        fontFaceCss += `@font-face {\n  font-family: '${familyName}';\n  src: url('${relUrl}') format('${fmt}');\n  font-weight: ${weight};\n  font-style: ${style};\n  font-display: swap;\n}\n\n`;
      }
    }
  }

  // 1️⃣ Create :root font-family variables (if typography map contains fonts entry)
  // let rootCss = ":root {\n";
  // if (typographyMap.fonts) {
  //   for (const [key, info] of Object.entries(typographyMap.fonts)) {
  //     const family = info.family;
  //     const fallbacks =
  //       info.fallbacks ||
  //       'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  //     rootCss += `  --vd-font-style-${key}: ${family}, ${fallbacks};\n`;
  //   }
  // } else {
  //   // fallback single var
  //   rootCss += `  --vd-font-style-primary: Avenir Next, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n`;
  // }
  // rootCss += "}\n\n";

  // 2️⃣ Build main typography CSS
  let css =
    fontFaceCss +
    "\n" +
    ':root { \nbody {\n  font-family: var(--vd-font-style-primary), system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n}\n}\n';

  // HTML element mapping
  const elementMapping = {
    h1: "display-large",
    h2: "display-medium",
    h3: "display-small",
    h4: "headline-large",
    h5: "headline-medium",
    h6: "headline-small",
    p: "body-medium",
    a: "label-medium",
    button: "label-medium",
    label: "label-medium",
  };

  function generateCSS(selector, props) {
    let cssText = `${selector} {\n`;
    for (const [key, value] of Object.entries(props)) {
      if (key === "paragraph-spacing") {
        cssText += `  margin-bottom: ${value};\n`;
      } else if (key === "font-style") {
        cssText += `  font-style: ${value};\n`;
      } else {
        cssText += `  ${key}: ${value};\n`;
      }
    }
    cssText += "}\n\n";
    return cssText;
  }

  // 3️⃣ Generate CSS for default element mapping
  for (const [element, role] of Object.entries(elementMapping)) {
    if (typographyMap[role]) {
      css += generateCSS(element, typographyMap[role]);
    }
  }

  // 4️⃣ Generate classes for all roles (skip `fonts` key)
  for (const [role, props] of Object.entries(typographyMap)) {
    if (role === "fonts") continue;
    css += generateCSS(`.${role}`, props);
  }

  // Write CSS file
  fs.writeFileSync(outputFile, css);
  console.log(`✅ Typography CSS generated: ${outputFile}`);
};
