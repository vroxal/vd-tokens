module.exports = function generateTokens() {
  const fs = require("fs");
  const path = require("path");

  const TOKENS_DIR = path.join(__dirname, "../", "raw-tokens");
  const OUT_DIR = path.join(__dirname, "../../", "dist");
  const OUT_FILE = path.join(OUT_DIR, "tokens.css");
  const TOKENS_OUT_DIR = path.join(OUT_DIR, "tokens");

  function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  function readTokensFolder(subfolder) {
    const dir = path.join(TOKENS_DIR, subfolder);
    if (!fs.existsSync(dir)) return {};
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    const out = {};
    for (const file of files) {
      const name = path.basename(file, ".json");
      out[name] = readJson(path.join(dir, file));
    }
    return out;
  }

  const root = readTokensFolder("root");
  const brands = readTokensFolder("brand");
  const mapped = readTokensFolder("mapped");
  const responsive = readTokensFolder("responsive");
  const brandEntries = Object.entries(brands);
  const hasSingleBrand = brandEntries.length === 1;
  const singleBrandName = hasSingleBrand ? brandEntries[0][0] : null;
  const responsiveOrder = ["desktop", "tablet", "mobile"];
  const responsiveMediaQueries = {
    tablet: "@media (max-width: 1199px)",
    mobile: "@media (max-width: 767px)",
  };
  const defaultThemeName = "light";
  const defaultBrandName = singleBrandName || "consumer";

  function kebab(parts) {
    return parts
      .map((p) => String(p).replace(/[^a-zA-Z0-9]+/g, "-"))
      .map((s) => s.replace(/([a-z])([A-Z])/g, "$1-$2"))
      .join("-")
      .toLowerCase();
  }

  function varNameFromPath(parts) {
    return `--vd-${kebab(parts)}`;
  }

  function walk(obj, cb, prefix = []) {
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val && typeof val === "object" && "$value" in val) {
        cb(prefix.concat(key), val);
      } else if (val && typeof val === "object") {
        walk(val, cb, prefix.concat(key));
      }
    }
  }

  // Build an index for lookup by path string
  const index = new Map();

  function addIndexEntry(key, entry) {
    if (!key || index.has(key)) return;
    index.set(key, entry);
  }

  function addToIndex(rootName, tree) {
    walk(tree, (parts, node) => {
      const entry = { parts, node, rootName };
      const rawKey = parts.join(".");

      addIndexEntry(rawKey, entry);

      const [scope, scopeName] = String(rootName).split(".");
      if (scope === "root") {
        addIndexEntry(["Root"].concat(parts).join("."), entry);
      }
      if (scope === "brand") {
        addIndexEntry(["Brand"].concat(parts).join("."), entry);
        if (scopeName) {
          addIndexEntry(["Brand", scopeName].concat(parts).join("."), entry);
        }
      }
      if (scope === "mapped") {
        addIndexEntry(["Mapped"].concat(parts).join("."), entry);
        if (scopeName) {
          addIndexEntry(["Mapped", scopeName].concat(parts).join("."), entry);
        }
      }
      if (scope === "responsive") {
        addIndexEntry(["Responsive"].concat(parts).join("."), entry);
        if (scopeName) {
          addIndexEntry(["Responsive", scopeName].concat(parts).join("."), entry);
        }
      }
    });
  }

  addToIndex("root", root.root || root);
  for (const [name, tree] of brandEntries) addToIndex(`brand.${name}`, tree);
  for (const [name, tree] of Object.entries(mapped))
    addToIndex(`mapped.${name}`, tree);
  for (const [name, tree] of Object.entries(responsive))
    addToIndex(`responsive.${name}`, tree);

  function findToken(pathStr) {
    if (index.has(pathStr)) return index.get(pathStr);
    // try fallback: some tokens reference with different casing, attempt case-insensitive
    const lc = pathStr.toLowerCase();
    for (const [k, v] of index.entries()) {
      if (k.toLowerCase() === lc) return v;
    }
    return null;
  }

  function resolveValue(node) {
    const raw = node["$value"];
    if (typeof raw === "string") {
      const m = raw.match(/^\{(.+)\}$/);
      if (m) {
        const ref = m[1];
        const found = findToken(ref);
        if (found) {
          return {
            refPath: ref,
            cssVar: varNameFromPath(found.parts),
            type: node["$type"],
          };
        }
        return { literal: raw, refPath: ref, type: node["$type"] };
      }
    }
    // literal value (string, number, etc)
    return { literal: raw, type: node["$type"] };
  }

  function formatLiteral(val, type, parts) {
    if (typeof val === "string") {
      // color hashes or rgb/rgba should be emitted without quotes
      if (/^#/.test(val) || /^rgba?\(/i.test(val)) return val;
      // unit values like px, rem, em, % (if stored as strings) emit as-is
      if (/^-?\d+(?:\.\d+)?(?:px|rem|em|%)$/.test(val)) return val;
      // if it's a bare number string, emit as number
      if (/^-?\d+(?:\.\d+)?$/.test(val)) return val;
      // otherwise keep quotes (font-family names with spaces)
      return JSON.stringify(val);
    }
    // numeric literal: decide whether to append px based on token type
    if (typeof val === "number") {
      // types that should NOT receive px
      const noPxTypes = new Set(["lineHeight", "opacity"]);
      if (type && noPxTypes.has(type)) return String(val);
      // if this token belongs to Font but not Font.Scale (i.e. font weights like Font.AvenierNext.Bold), do not append px
      if (parts) {
        const lower = parts.map((p) => String(p).toLowerCase());
        if (lower.includes("font") && !lower.includes("scale"))
          return String(val);
      }
      // append px to numeric values by default
      return `${val}px`;
    }
    return JSON.stringify(val);
  }

  function selectKeyIgnoreCase(obj, key) {
    if (!obj || typeof obj !== "object") return undefined;
    const lc = String(key).toLowerCase();
    for (const k of Object.keys(obj)) {
      if (k.toLowerCase() === lc) return obj[k];
    }
    return undefined;
  }

  function resolvePossibleRef(val) {
    if (typeof val === "string") {
      const m = val.match(/^\{(.+)\}$/);
      if (m) {
        const found = findToken(m[1]);
        if (found) return `var(${varNameFromPath(found.parts)})`;
        return val;
      }
    }
    if (typeof val === "number") return formatLiteral(val);
    return null;
  }

  // Collect all token entries we want to emit
  const entries = [];

  for (const [key, tree] of Object.entries(root)) {
    // root may have top-level wrapper or be the object directly
    walk(tree, (parts, node) => {
      entries.push({ parts, node, scope: "root" });
    });
  }

  // also add brand/mapped/responsive tokens so we can emit ref vars and scoped overrides
  for (const [bname, tree] of brandEntries) {
    walk(tree, (parts, node) =>
      entries.push({ parts, node, scope: `brand:${bname}`, sourceName: bname }),
    );
  }
  for (const [mname, tree] of Object.entries(mapped)) {
    walk(tree, (parts, node) =>
      entries.push({
        parts,
        node,
        scope: `mapped:${mname}`,
        sourceName: mname,
      }),
    );
  }
  for (const [rname, tree] of Object.entries(responsive)) {
    walk(tree, (parts, node) =>
      entries.push({
        parts,
        node,
        scope: `responsive:${rname}`,
        sourceName: rname,
      }),
    );
  }

  // Prepare output
  let css = "/* Auto-generated design tokens CSS (single file) */\n\n";

  // Ensure out dir
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  // Ensure tokens out dir
  if (!fs.existsSync(TOKENS_OUT_DIR))
    fs.mkdirSync(TOKENS_OUT_DIR, { recursive: true });

  // Build a single root variable map (root tokens + defaults + device vars)
  // rootVars: varName -> value
  // varNameToParts: varName -> parts array (used for categorization)
  const rootVars = new Map();
  const varNameToParts = new Map();

  for (const e of entries.filter((en) => en.scope === "root")) {
    const name = varNameFromPath(e.parts);
    const resolved = resolveValue(e.node);
    if (resolved.cssVar) {
      if (resolved.cssVar !== name) {
        rootVars.set(name, `var(${resolved.cssVar})`);
      }
      varNameToParts.set(name, e.parts);
    } else if (resolved.literal !== undefined) {
      if (
        resolved &&
        typeof resolved.literal === "object" &&
        resolved.literal !== null
      ) {
        // interpret as a brand map; pick default brand value for root
        const candidate =
          selectKeyIgnoreCase(resolved.literal, defaultBrandName) ||
          Object.values(resolved.literal)[0];
        const rv = resolvePossibleRef(candidate);
        if (rv !== null) rootVars.set(name, rv);
        else
          rootVars.set(name, formatLiteral(candidate, resolved.type, e.parts));
        varNameToParts.set(name, e.parts);
      } else {
        rootVars.set(
          name,
          formatLiteral(resolved.literal, resolved.type, e.parts),
        );
        varNameToParts.set(name, e.parts);
      }
    }
  }

  // Emit explicit breakpoint vars without using responsive Device.MinWidth tokens
  const deviceVars = {
    desktop: {
      varName: "--vd-device-min-width-desktop",
      value: 1200,
    },
    tablet: {
      varName: "--vd-device-min-width-tablet",
      value: 768,
    },
    mobile: {
      varName: "--vd-device-min-width-mobile",
      value: 0,
    },
  };
  for (const [rname, obj] of Object.entries(deviceVars)) {
    rootVars.set(obj.varName, `${obj.value}px`);
    varNameToParts.set(obj.varName, ["Device", "MinWidth", rname]);
  }

  function mergeResponsiveTokensIntoRoot(rname) {
    const tree = responsive[rname];
    if (!tree) return;
    walk(tree, (parts, node) => {
      if (parts[0] === "Device" && parts[1] === "MinWidth") return;
      const name = varNameFromPath(parts);
      const resolved = resolveValue(node);
      if (resolved.cssVar) {
        if (resolved.cssVar !== name) {
          rootVars.set(name, `var(${resolved.cssVar})`);
        }
        varNameToParts.set(name, parts);
      } else if (resolved.literal !== undefined) {
        rootVars.set(
          name,
          formatLiteral(resolved.literal, resolved.type, parts),
        );
        varNameToParts.set(name, parts);
      }
    });
  }

  // Desktop-first: desktop responsive tokens become the base :root layer.
  mergeResponsiveTokensIntoRoot("desktop");

  // Emit single :root block
  css += ":root {\n";
  for (const [name, val] of rootVars.entries()) {
    css += `  ${name}: ${val};\n`;
  }
  css += "}\n\n";

  // Merge default mapped/theme tokens into rootVars so they appear in the base :root
  for (const [mname, tree] of Object.entries(mapped)) {
    try {
      if (
        String(mname).toLowerCase() === String(defaultThemeName).toLowerCase()
      ) {
        walk(tree, (parts, node) => {
          const name = varNameFromPath(parts);
          // don't overwrite existing rootVars
          if (rootVars.has(name)) return;
          const resolved = resolveValue(node);
          if (resolved.cssVar) {
            rootVars.set(name, `var(${resolved.cssVar})`);
            varNameToParts.set(name, parts);
          } else if (resolved.literal !== undefined) {
            if (
              typeof resolved.literal === "object" &&
              resolved.literal !== null
            ) {
              const candidate =
                selectKeyIgnoreCase(resolved.literal, defaultBrandName) ||
                Object.values(resolved.literal)[0];
              const rv = resolvePossibleRef(candidate);
              if (rv !== null) rootVars.set(name, rv);
              else
                rootVars.set(
                  name,
                  formatLiteral(candidate, resolved.type, parts),
                );
              varNameToParts.set(name, parts);
            } else {
              rootVars.set(
                name,
                formatLiteral(resolved.literal, resolved.type, parts),
              );
              varNameToParts.set(name, parts);
            }
          }
        });
      }
    } catch (err) {}
  }

  // Merge default brand tokens into rootVars so the active brand values appear in :root
  for (const [bname, tree] of brandEntries) {
    try {
      if (
        String(bname).toLowerCase() === String(defaultBrandName).toLowerCase()
      ) {
        walk(tree, (parts, node) => {
          const name = varNameFromPath(parts);
          if (rootVars.has(name)) return;
          const resolved = resolveValue(node);
          if (resolved.cssVar) {
            rootVars.set(name, `var(${resolved.cssVar})`);
            varNameToParts.set(name, parts);
          } else if (resolved.literal !== undefined) {
            if (
              typeof resolved.literal === "object" &&
              resolved.literal !== null
            ) {
              const candidate =
                selectKeyIgnoreCase(resolved.literal, bname) ||
                Object.values(resolved.literal)[0];
              const rv = resolvePossibleRef(candidate);
              if (rv !== null) rootVars.set(name, rv);
              else
                rootVars.set(
                  name,
                  formatLiteral(candidate, resolved.type, parts),
                );
              varNameToParts.set(name, parts);
            } else {
              rootVars.set(
                name,
                formatLiteral(resolved.literal, resolved.type, parts),
              );
              varNameToParts.set(name, parts);
            }
          }
        });
      }
    } catch (err) {}
  }

  // Emit mapped (theme) scopes using :root[data-theme=name]
  for (const [mname, tree] of Object.entries(mapped)) {
    // skip default theme because its values were merged into :root
    if (String(mname).toLowerCase() === String(defaultThemeName).toLowerCase())
      continue;
    let block = `:root[data-theme="${mname}"] {\n`;
    let added = false;
    walk(tree, (parts, node) => {
      const name = varNameFromPath(parts);
      const resolved = resolveValue(node);
      if (resolved.cssVar) {
        if (resolved.cssVar !== name) {
          block += `  ${name}: var(${resolved.cssVar});\n`;
          added = true;
        }
      } else if (resolved.literal !== undefined) {
        if (typeof resolved.literal === "object" && resolved.literal !== null) {
          const candidate =
            selectKeyIgnoreCase(resolved.literal, mname) ||
            Object.values(resolved.literal)[0];
          const rv = resolvePossibleRef(candidate);
          if (rv !== null) block += `  ${name}: ${rv};\n`;
          else
            block += `  ${name}: ${formatLiteral(
              candidate,
              resolved.type,
              parts,
            )};\n`;
          added = true;
        } else {
          block += `  ${name}: ${formatLiteral(
            resolved.literal,
            resolved.type,
            parts,
          )};\n`;
          added = true;
        }
      }
    });
    if (added) css += block + "}\n\n";
  }

  if (!hasSingleBrand) {
    // Emit brand scopes using :root[data-brand=name] only when multiple brands exist.
    for (const [bname, tree] of brandEntries) {
      // skip default brand because its values were merged into :root
      if (
        String(bname).toLowerCase() === String(defaultBrandName).toLowerCase()
      )
        continue;
      let block = `:root[data-brand="${bname}"] {\n`;
      let added = false;
      walk(tree, (parts, node) => {
        const name = varNameFromPath(parts);
        const resolved = resolveValue(node);
        if (resolved.cssVar) {
          if (resolved.cssVar !== name) {
            block += `  ${name}: var(${resolved.cssVar});\n`;
            added = true;
          }
        } else if (resolved.literal !== undefined) {
          if (
            typeof resolved.literal === "object" &&
            resolved.literal !== null
          ) {
            const candidate =
              selectKeyIgnoreCase(resolved.literal, bname) ||
              Object.values(resolved.literal)[0];
            const rv = resolvePossibleRef(candidate);
            if (rv !== null) block += `  ${name}: ${rv};\n`;
            else
              block += `  ${name}: ${formatLiteral(
                candidate,
                resolved.type,
                parts,
              )};\n`;
            added = true;
          } else {
            block += `  ${name}: ${formatLiteral(
              resolved.literal,
              resolved.type,
              parts,
            )};\n`;
            added = true;
          }
        }
      });
      if (added) css += block + "}\n\n";
    }
  }

  // Emit responsive media queries with explicit desktop-first ranges:
  // base only: 1200+ => desktop
  // first media only: 768-1199 => tablet
  // both media match, last wins: 0-767 => mobile
  for (const rname of responsiveOrder) {
    const tree = responsive[rname];
    if (!tree || rname === "desktop") continue;
    const mqRule = responsiveMediaQueries[rname];
    const mq = mqRule ? `${mqRule} {\n` : null;
    if (mq) css += mq;
    const containerStart = mq ? "  :root {\n" : ":root {\n";
    css += containerStart;
    walk(tree, (parts, node) => {
      // skip Device.MinWidth token itself
      if (parts[0] === "Device" && parts[1] === "MinWidth") return;
      const name = varNameFromPath(parts);
      const resolved = resolveValue(node);
      if (resolved.cssVar) {
        if (resolved.cssVar !== name)
          css += `    ${name}: var(${resolved.cssVar});\n`;
      } else if (resolved.literal !== undefined) {
        css += `    ${name}: ${formatLiteral(
          resolved.literal,
          resolved.type,
          parts,
        )};\n`;
      }
    });
    const containerEnd = mq ? "  }\n}\n\n" : "}\n\n";
    css += containerEnd;
  }

  // Do not emit a combined tokens.css file per user request.
  // Remove existing combined file if present so only category files remain.
  try {
    if (fs.existsSync(OUT_FILE)) {
      fs.unlinkSync(OUT_FILE);
      console.log("Removed", OUT_FILE);
    }
  } catch (err) {}

  // Helper: build separate category CSS files
  function partsLower(parts) {
    return parts.map((p) => String(p).toLowerCase());
  }

  function isColor(parts) {
    return parts && parts[0] && String(parts[0]).toLowerCase() === "color";
  }

  function isFont(parts) {
    const lower = partsLower(parts);
    return (
      parts &&
      parts[0] &&
      String(parts[0]).toLowerCase() === "font" &&
      !lower.includes("scale")
    );
  }

  function isScale(parts) {
    const lower = partsLower(parts);
    return (
      lower.includes("scale") ||
      (parts && parts[0] && String(parts[0]).toLowerCase() === "scale")
    );
  }

  function buildCategoryFile(filename, predicate, opts = {}) {
    const outPath = path.join(TOKENS_OUT_DIR, filename);
    let out = `/* Auto-generated ${filename} */\n\n`;

    // :root with values from rootVars filtered by predicate
    out += ":root {\n";
    for (const [name, val] of rootVars.entries()) {
      const parts = varNameToParts.get(name);
      if (!parts) continue;
      if (!predicate(parts)) continue;
      out += `  ${name}: ${val};\n`;
    }
    // include device vars in scale file if requested
    if (opts.includeDeviceVars) {
      for (const [rname, obj] of Object.entries(deviceVars)) {
        if (!obj || !obj.varName) continue;
        const pname = obj.varName;
        if (rootVars.has(pname) && !out.includes(pname)) {
          out += `  ${pname}: ${rootVars.get(pname)};\n`;
        }
      }
    }
    out += "}\n\n";

    // mapped themes
    for (const [mname, tree] of Object.entries(mapped)) {
      // skip default theme because its values were merged into :root
      if (
        String(mname).toLowerCase() === String(defaultThemeName).toLowerCase()
      )
        continue;
      let added = false;
      let block = `:root[data-theme="${mname}"] {\n`;
      walk(tree, (parts, node) => {
        if (!predicate(parts)) return;
        const name = varNameFromPath(parts);
        const resolved = resolveValue(node);
        if (resolved.cssVar) {
          if (resolved.cssVar !== name) {
            block += `  ${name}: var(${resolved.cssVar});\n`;
            added = true;
          }
        } else if (resolved.literal !== undefined) {
          block += `  ${name}: ${formatLiteral(
            resolved.literal,
            resolved.type,
            parts,
          )};\n`;
          added = true;
        }
      });
      if (added) out += block + "}\n\n";
    }

    // brand scopes
    if (!hasSingleBrand) {
      for (const [bname, tree] of brandEntries) {
        // skip default brand because its values were merged into :root
        if (
          String(bname).toLowerCase() === String(defaultBrandName).toLowerCase()
        )
          continue;
        let added = false;
        let block = `:root[data-brand="${bname}"] {\n`;
        walk(tree, (parts, node) => {
          if (!predicate(parts)) return;
          const name = varNameFromPath(parts);
          const resolved = resolveValue(node);
          if (resolved.cssVar) {
            if (resolved.cssVar !== name) {
              block += `  ${name}: var(${resolved.cssVar});\n`;
              added = true;
            }
          } else if (resolved.literal !== undefined) {
            if (
              typeof resolved.literal === "object" &&
              resolved.literal !== null
            ) {
              const candidate =
                selectKeyIgnoreCase(resolved.literal, bname) ||
                Object.values(resolved.literal)[0];
              const rv = resolvePossibleRef(candidate);
              if (rv !== null) block += `  ${name}: ${rv};\n`;
              else
                block += `  ${name}: ${formatLiteral(
                  candidate,
                  resolved.type,
                  parts,
                )};\n`;
              added = true;
            } else {
              block += `  ${name}: ${formatLiteral(
                resolved.literal,
                resolved.type,
                parts,
              )};\n`;
              added = true;
            }
          }
        });
        if (added) out += block + "}\n\n";
      }
    }

    // Desktop-first responsive blocks:
    // base only: 1200+ => desktop
    // first media only: 768-1199 => tablet
    // both media match, last wins: 0-767 => mobile
    for (const rname of responsiveOrder) {
      const tree = responsive[rname];
      if (!tree || rname === "desktop") continue;
      const mqRule = responsiveMediaQueries[rname];
      const mq = mqRule ? `${mqRule} {\n` : null;

      // build responsive block into temporary string and append only if non-empty
      let block = "";
      if (mq) block += mq;
      block += mq ? "  :root {\n" : ":root {\n";
      let added = false;
      walk(tree, (parts, node) => {
        if (parts[0] === "Device" && parts[1] === "MinWidth") return;
        if (!predicate(parts)) return;
        const name = varNameFromPath(parts);
        const resolved = resolveValue(node);
        if (resolved.cssVar) {
          if (resolved.cssVar !== name) {
            block += `    ${name}: var(${resolved.cssVar});\n`;
            added = true;
          }
        } else if (resolved.literal !== undefined) {
          block += `    ${name}: ${formatLiteral(
            resolved.literal,
            resolved.type,
            parts,
          )};\n`;
          added = true;
        }
      });

      if (added) {
        block += mq ? "  }\n}\n\n" : "}\n\n";
        out += block;
      }
    }

    fs.writeFileSync(outPath, out, "utf8");
    console.log("Generated", outPath);
  }

  // Build and write category files
  buildCategoryFile("colors.css", isColor);
  buildCategoryFile("typography.css", isFont);
  buildCategoryFile("scale.css", isScale, { includeDeviceVars: true });

  // Create an index.css inside the tokens directory that imports all generated category files
  try {
    const indexPath = path.join(TOKENS_OUT_DIR, "index.css");
    const imports = ["colors.css", "typography.css", "scale.css"];
    let indexOut = "/* Auto-generated index.css - imports token files */\n\n";
    for (const imp of imports) {
      indexOut += `@import "./${imp}";\n`;
    }
    fs.writeFileSync(indexPath, indexOut, "utf8");
    console.log("Generated", indexPath);
  } catch (err) {
    console.error("Failed to write index.css", err);
  }
};
