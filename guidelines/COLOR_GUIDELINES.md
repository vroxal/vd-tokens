# Vroxal Design Color Usage Guidelines

## 1️⃣ Core Principles

- All colors must be applied using **Vroxal Design tokens**.
- **Do not hardcode colors** in CSS, HTML, or component templates.
- Apply colors **semantically**, reflecting status, state, or purpose.
- Differentiate usage for **content**, **background**, and **border**.
- Text and icon colors now share the same **content** token set.

---

## 2️⃣ Content Color Tokens

| Semantic Purpose | Base                            | Secondary                           | Tertiary                          | Disabled                           | Notes                         |
| ---------------- | ------------------------------- | ----------------------------------- | --------------------------------- | ---------------------------------- | ----------------------------- |
| **Default**      | `--vd-color-content-default-base` | `--vd-color-content-default-secondary` | `--vd-color-content-default-tertiary` | `--vd-color-content-default-disabled` | Regular UI text and icons     |
| **Primary**      | `--vd-color-content-primary-base` | `--vd-color-content-primary-secondary` | `--vd-color-content-primary-tertiary` | N/A                                | Brand emphasis                |
| **Success**      | `--vd-color-content-success-base` | `--vd-color-content-success-secondary` | `--vd-color-content-success-tertiary` | N/A                                | Positive feedback             |
| **Error**        | `--vd-color-content-error-base` | `--vd-color-content-error-secondary` | `--vd-color-content-error-tertiary` | N/A                                | Negative/error feedback       |
| **Warning**      | `--vd-color-content-warning-base` | `--vd-color-content-warning-secondary` | `--vd-color-content-warning-tertiary` | N/A                                | Warning messages              |
| **Info**         | `--vd-color-content-info-base`  | `--vd-color-content-info-secondary` | `--vd-color-content-info-tertiary` | N/A                                | Informational messages        |
| **Neutral**      | `--vd-color-content-neutral-base` | `--vd-color-content-neutral-secondary` | `--vd-color-content-neutral-tertiary` | N/A                                | Subtle or secondary UI content |

> Use `-on-base`, `-on-secondary`, and `-on-tertiary` tokens when content is displayed on colored backgrounds.

---

## 3️⃣ Background Color Tokens

| Semantic Purpose | Base                                    | Secondary                                 | Tertiary                                 | Hover     | Notes                      |
| ---------------- | --------------------------------------- | ----------------------------------------- | ---------------------------------------- | --------- | -------------------------- |
| **Default**      | `--vd-color-background-default-base`    | `--vd-color-background-default-secondary` | `--vd-color-background-default-tertiary` | N/A       | General surfaces           |
| **Primary**      | `--vd-color-background-primary-base`    | `--vd-color-background-primary-secondary` | `--vd-color-background-primary-tertiary` | `*-hover` | Buttons, highlights        |
| **Success**      | `--vd-color-background-success-base`    | `--vd-color-background-success-secondary` | `--vd-color-background-success-tertiary` | `*-hover` | Positive UI feedback       |
| **Error**        | `--vd-color-background-error-base`      | `--vd-color-background-error-secondary`   | `--vd-color-background-error-tertiary`   | `*-hover` | Error/critical states      |
| **Warning**      | `--vd-color-background-warning-base`    | `--vd-color-background-warning-secondary` | `--vd-color-background-warning-tertiary` | `*-hover` | Warnings                   |
| **Info**         | `--vd-color-background-info-base`       | `--vd-color-background-info-secondary`    | `--vd-color-background-info-tertiary`    | `*-hover` | Info messages              |
| **Neutral**      | `--vd-color-background-neutral-base`    | `--vd-color-background-neutral-secondary` | `--vd-color-background-neutral-tertiary` | `*-hover` | Default UI backgrounds     |
| **Overlay**      | `--vd-color-background-overlay-base`    | N/A                                       | N/A                                      | N/A       | Modals, tooltips, overlays |

---

## 4️⃣ Border Color Tokens

| Semantic Purpose | Base                              | Secondary                             | Tertiary                             | Disabled                             | Notes                |
| ---------------- | --------------------------------- | ------------------------------------- | ------------------------------------ | ------------------------------------ | -------------------- |
| **Default**      | `--vd-color-border-default-base`  | `--vd-color-border-default-secondary` | `--vd-color-border-default-tertiary` | `--vd-color-border-default-disabled` | General borders      |
| **Primary**      | `--vd-color-border-primary-base`  | `--vd-color-border-primary-secondary` | `--vd-color-border-primary-tertiary` | N/A                                  | Highlighted controls |
| **Success**      | `--vd-color-border-success-base`  | `--vd-color-border-success-secondary` | `--vd-color-border-success-tertiary` | N/A                                  | Positive feedback    |
| **Error**        | `--vd-color-border-error-base`    | `--vd-color-border-error-secondary`   | `--vd-color-border-error-tertiary`   | N/A                                  | Error states         |
| **Warning**      | `--vd-color-border-warning-base`  | `--vd-color-border-warning-secondary` | `--vd-color-border-warning-tertiary` | N/A                                  | Warnings             |
| **Info**         | `--vd-color-border-info-base`     | `--vd-color-border-info-secondary`    | `--vd-color-border-info-tertiary`    | N/A                                  | Info messages        |
| **Neutral**      | `--vd-color-border-neutral-base`  | `--vd-color-border-neutral-secondary` | `--vd-color-border-neutral-tertiary` | N/A                                  | Default borders      |

---

## 5️⃣ White & Black Tokens

- **White scale:** `--vd-color-white-100` → `--vd-color-white-1000`
- **Black scale:** `--vd-color-black-100` → `--vd-color-black-1000`
- Always use **tokens**; never raw hex codes.

---

## 6️⃣ Usage Workflow for Agentic AI

1. Determine **semantic role** of UI element (default, primary, success, error, warning, info, neutral).
2. Select correct token for **content**, **background**, or **border**.
3. For content on colored backgrounds, use **`-on-base`**, **`-on-secondary`**, or **`-on-tertiary`** tokens for contrast.
4. For hover/active states, select `*-hover` tokens if available.
5. Document token usage explicitly if AI generates custom UI:

   ```
   Token used: --vd-color-background-primary-base
   Semantic purpose: Primary button background
   UI element: Button
   Status/intent: Primary
   ```

---

## 7️⃣ Priority Order

1. **Component-driven color** (from Vroxal Design components)
2. **Token-driven color** (content, background, border)
3. **Project conventions** (only if no Vroxal Design token exists, rare)
