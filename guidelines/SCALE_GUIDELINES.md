# Vroxal Design Scale Usage Guidelines for Agentic AI

**Authoritative source:** `node_modules/@vroxal/vd-tokens/scales.css`  
**Supporting references:**

- `@vroxal/vd-tokens/index.css`
- Component usage guidelines (`@vroxal/vd-angular-components/USAGE_GUIDELINES.md`)

---

## 1️⃣ Core Principles

- All sizing must be applied via **Vroxal Design scale tokens**.
- Do not hardcode spacing, border width, border radius, or icon size.
- Apply scale **semantically**, reflecting layout, separation, and emphasis.
- Always use tokens for consistent UI rhythm and visual hierarchy.

---

## 2️⃣ Spacing Scale Tokens

| Scale           | Token                                                              | Notes                                        |
| --------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| 0               | `--vd-scale-spacing-0`                                             | No spacing                                   |
| 50              | `--vd-scale-spacing-50`                                            | Extra-tight spacing                          |
| 100             | `--vd-scale-spacing-100`                                           | Very tight spacing                           |
| 200             | `--vd-scale-spacing-200`                                           | Tight spacing                                |
| 300             | `--vd-scale-spacing-300`                                           | Small spacing                                |
| 400             | `--vd-scale-spacing-400`                                           | Medium spacing                               |
| 600             | `--vd-scale-spacing-600`                                           | Large spacing                                |
| 800             | `--vd-scale-spacing-800`                                           | Extra-large spacing                          |
| 1000            | `--vd-scale-spacing-1000`                                          | Massive spacing                              |
| 1200            | `--vd-scale-spacing-1200`                                          | Layout padding                               |
| 1600            | `--vd-scale-spacing-1600`                                          | Section separation                           |
| 1800            | `--vd-scale-spacing-1800`                                          | Section/gutter spacing                       |
| 2400            | `--vd-scale-spacing-2400`                                          | Major layout spacing                         |
| 3000            | `--vd-scale-spacing-3000`                                          | Extreme spacing                              |
| Negative values | `--vd-scale-spacing-negative50` … `--vd-scale-spacing-negative600` | For offsetting/margins in layout adjustments |

**Rule:** Always select spacing token based on **layout intent** and semantic purpose, not visual approximation.

---

## 3️⃣ Border Width Scale Tokens

| Width       | Token                          | Notes                       |
| ----------- | ------------------------------ | --------------------------- |
| None        | `--vd-scale-border-width-none` | No border                   |
| Small       | `--vd-scale-border-width-sm`   | Minor separators, outlines  |
| Medium      | `--vd-scale-border-width-md`   | Standard component borders  |
| Large       | `--vd-scale-border-width-lg`   | Emphasis borders            |
| Extra Large | `--vd-scale-border-width-xl`   | Strong emphasis, highlights |

**Rule:** Use the narrowest width that preserves accessibility and clarity.

---

## 4️⃣ Border Radius Scale Tokens

| Size | Token                           | Notes                                     |
| ---- | ------------------------------- | ----------------------------------------- |
| None | `--vd-scale-border-radius-none` | Sharp corners                             |
| XS   | `--vd-scale-border-radius-xs`   | Very subtle rounding                      |
| SM   | `--vd-scale-border-radius-sm`   | Slight rounding                           |
| MD   | `--vd-scale-border-radius-md`   | Standard rounding                         |
| LG   | `--vd-scale-border-radius-lg`   | Rounded components, cards                 |
| XL   | `--vd-scale-border-radius-xl`   | Prominent rounding                        |
| XXL  | `--vd-scale-border-radius-xxl`  | Larger rounding for modal/dialog          |
| XXXL | `--vd-scale-border-radius-xxxl` | Very large rounding for hero/UI accent    |
| Full | `--vd-scale-border-radius-full` | Fully circular elements (avatars, badges) |

**Rule:** Border-radius selection must follow **component intent** (e.g., card vs. avatar vs. button).

---

## 5️⃣ Icon Size Scale Tokens

| Size | Token                     | Notes                             |
| ---- | ------------------------- | --------------------------------- |
| XS   | `--vd-scale-icon-size-xs` | Very small icons (inputs, badges) |
| SM   | `--vd-scale-icon-size-sm` | Small icons (buttons, tabs)       |
| MD   | `--vd-scale-icon-size-md` | Standard icons                    |
| LG   | `--vd-scale-icon-size-lg` | Emphasized icons                  |
| XL   | `--vd-scale-icon-size-xl` | Large icons, hero elements        |

**Rule:** Icon size must correspond to **component context**. Do not resize manually outside the token system.

---

## 6️⃣ Usage Workflow for Agentic AI

1. Determine **semantic purpose** of element: spacing, border, radius, icon.
2. Select the correct **scale token** from the table.
3. Apply token via style bindings or class usage.
4. For layout adjustments, use negative spacing tokens only if needed.
5. Document scale token usage when generating UI:

   ```text
   Scale token used: --vd-scale-spacing-400
   Semantic purpose: Container padding
   UI element: Card
   Status/intent: Default
   ```

## 7️⃣ Priority Order

1. Component-defined scale (Vroxal Design Angular component default)
2. Token-driven scale (spacing, border, radius, icon)
3. Project-specific overrides (only when a Vroxal Design token cannot achieve the layout)
