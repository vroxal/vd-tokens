# Vroxal Design Layout Usage Guidelines

This document defines the official layout structure and token usage for the shared `.layout` pattern.

## Core Rules

- Keep the base layout container on `.layout`.
- Use `layout` modifier classes (`.layout--has-navbar`, `.layout--has-sidebar`) to toggle optional regions.
- Use Vroxal Design tokens for spacing, borders, and colors. Do not hardcode raw px or hex values.
- Keep layout slots (`.layout__header`, `.layout__aside`, `.layout__body`, `.layout__content`) consistent across apps.

## Layout Structure

- `.layout`: root grid container for full viewport height.
- `.layout__header`: top navbar slot (hidden by default).
- `.layout__body`: wrapper for sidebar + content.
- `.layout__aside`: sidebar slot (hidden by default).
- `.layout__content`: main scrollable content area.

## Base Behavior

- `.layout` sets:
  - `--layout-navbar-h: var(--vd-scale-spacing-1600)`
  - `--layout-sidebar-w: calc(var(--vd-scale-spacing-3000) + var(--vd-scale-spacing-3000) + var(--vd-scale-spacing-1000))`
  - full-height grid container with background token
- `.layout__header, .layout__aside` are `display: none` by default.
- `.layout__body` is a single-column grid by default.
- `.layout__content` is scrollable, padded with `--vd-scale-spacing-600`, and centered with:
  - `max-width: calc(12 * var(--vd-scale-spacing-3000))`
  - `margin-inline: auto`
  - `margin-bottom: var(--vd-scale-spacing-1800)`

## Navbar Modifier

Use `.layout--has-navbar` when a top navigation/header exists.

- Expands root rows to:
  - `var(--layout-navbar-h) minmax(0, 1fr)`
- Enables sticky header behavior on `.layout__header`.
- Applies divider and surface styles with:
  - `--vd-scale-border-width-sm`
  - `--vd-color-border-default-tertiary`
  - `--vd-color-background-default-secondary`

## Sidebar Modifier

Use `.layout--has-sidebar` when a left sidebar exists.

- Expands body columns to:
  - `var(--layout-sidebar-w) minmax(0, 1fr)`
- Enables `.layout__aside` and keeps it independently scrollable.
- Expands `.layout__content` to fill remaining width:
  - `width: 100%`
  - `max-width: 100%`
- Applies divider and surface styles with:
  - `--vd-scale-border-width-sm`
  - `--vd-color-border-default-tertiary`
  - `--vd-color-background-default-secondary`

## Slot Fill Rules

- `.layout__header > *` must be `width: 100%`.
- `.layout__aside > *` must be `height: 100%`.

This ensures projected child components fill their assigned grid area.

## Token Usage

- Height token:
  - `--vd-scale-spacing-1600` (navbar height)
- Width token:
  - `--vd-scale-spacing-3000` (sidebar width basis)
  - `--vd-scale-spacing-1000` (additional sidebar width offset)
- Content padding:
  - `--vd-scale-spacing-600`
- Content margin:
  - `--vd-scale-spacing-1800`
- Divider width:
  - `--vd-scale-border-width-sm`
- Surface/background:
  - `--vd-color-background-default-base`
  - `--vd-color-background-default-secondary`
- Border color:
  - `--vd-color-border-default-tertiary`

## Recommended Usage

Apply modifier classes only when needed:

```html
<div class="layout layout--has-navbar layout--has-sidebar">
  <header class="layout__header"></header>
  <div class="layout__body">
    <aside class="layout__aside"></aside>
    <main class="layout__content"></main>
  </div>
</div>
```

Avoid changing the class contract or replacing token values with hardcoded values.
