# Vroxal Design Tokens

`@vroxal/vd-tokens` is the Vroxal design token package. It builds raw token JSON into consumable CSS variables, semantic typography classes, layout utilities, bundled fonts, and token usage guidelines.

The package is designed for projects that want:

- CSS custom properties for color, spacing, radius, and typography
- semantic theme switching with `data-theme`
- responsive typography tokens
- packaged fonts and usage guidelines in `dist/`

## What This Project Generates

Running the build creates a distributable CSS package in `dist/`:

- `dist/index.css`  
  Single entrypoint that imports all generated styles.
- `dist/global.css`  
  Base reset and global element styles.
- `dist/layout.css`  
  Layout utilities generated from the layout map.
- `dist/tokens/colors.css`  
  Color tokens and theme overrides.
- `dist/tokens/scale.css`  
  Spacing, radius, border width, icon size, font scale, and breakpoint tokens.
- `dist/tokens/typography.css`  
  Typography variables, responsive typography overrides, and font family tokens.
- `dist/semantic/typography-semantic.css`  
  `@font-face` declarations plus semantic typography classes such as `.title-large` and `.body-medium`.
- `dist/fonts/`  
  Bundled font files copied from `build/fonts/`.
- `dist/guidelines/`  
  Markdown usage guidelines for color, typography, scale, and layout.

## Source Structure

- `build/raw-tokens/` contains the token source JSON
- `build/maps/` contains the CSS mapping definitions
- `build/scripts/` contains the generators
- `guidelines/` contains the source documentation copied into `dist/guidelines`
- `demo/index.html` is a basic integration example against the generated CSS

## Installation

Install the package:

```bash
npm install @vroxal/vd-tokens
```

Then import the bundled stylesheet:

```css
@import "@vroxal/vd-tokens/dist/index.css";
```

Or load individual files if you want finer control:

```css
@import "@vroxal/vd-tokens/dist/tokens/colors.css";
@import "@vroxal/vd-tokens/dist/tokens/scale.css";
@import "@vroxal/vd-tokens/dist/tokens/typography.css";
@import "@vroxal/vd-tokens/dist/semantic/typography-semantic.css";
```

## Usage

### Import Everything

```html
<link rel="stylesheet" href="./dist/index.css" />
```

### Use Tokens Directly

```css
.card {
  background: var(--vd-color-background-default-secondary);
  color: var(--vd-color-content-default-base);
  border-radius: var(--vd-scale-border-radius-lg);
  padding: var(--vd-scale-spacing-400);
}

.button-primary {
  background: var(--vd-color-background-primary-base);
  color: var(--vd-color-content-primary-on-base);
}
```

### Use Semantic Typography Classes

```html
<h1>Dashboard</h1>
<p class="body-medium">Default body copy</p>
<div class="title-large">Card title</div>
<label class="label-medium">Email</label>
```

## Themes And Brands

The generated CSS is desktop-first:

- base `:root` contains the default theme and default brand values
- tablet overrides are applied at `@media (max-width: 1199px)`
- mobile overrides are applied at `@media (max-width: 767px)`

Theme overrides are emitted with the `data-theme` attribute:

```html
<html data-theme="dark"></html>
```

Brand overrides are only emitted when more than one brand token source exists. In the current repository state, the generator has a single brand token source, so base brand values are merged directly into `:root`.

## Token Categories

Common token groups exposed by the package:

- color tokens such as `--vd-color-background-primary-base`
- content tokens such as `--vd-color-content-default-base`
- border tokens such as `--vd-color-border-default-base`
- spacing and scale tokens such as `--vd-scale-spacing-400`
- radius tokens such as `--vd-scale-border-radius-lg`
- typography tokens such as `--vd-font-size-title-large`
- breakpoint tokens such as `--vd-device-min-width-tablet`

## Guidelines

The package also ships Markdown guidelines for implementation:

- `COLOR_GUIDELINES.md`
- `TYPOGRAPHY_GUIDELINES.md`
- `SCALE_GUIDELINES.md`
- `LAYOUT_GUIDELINES.md`

These documents describe the semantic intent behind token selection and are copied to `dist/guidelines/` during the build.

## Local Development

Install dependencies and run the build:

```bash
npm install
npm run build
```

The build script:

1. generates token CSS from the JSON token sources
2. generates semantic typography CSS
3. generates `global.css`
4. generates `layout.css`
5. generates `index.css`
6. copies fonts into `dist/fonts`
7. copies guideline markdown into `dist/guidelines`

## Demo

Open `demo/index.html` after building to see a simple token integration example using:

- token CSS variables
- semantic typography classes
- theme switching via `data-theme`

## Publishing Notes

The package publishes `dist/` as its distributable output and exposes `dist/index.css` as the main stylesheet entry in `package.json`.

## License

MIT
