# Vroxal Design Typography Guidelines

This document defines the official Vroxal Design typography scale.

All text must use predefined semantic mapping or typography classes.

## Scale for the responsiveness is handled by the classes

## Core Rule

Typography must communicate meaning, hierarchy, and readability.

Never choose size based on visual preference.

Choose based on semantic intent.

---

## Semantic HTML Mapping

| Element | Typography Level | Purpose              |
| ------- | ---------------- | -------------------- |
| h1      | display-large    | Page hero heading    |
| h2      | display-medium   | Section hero         |
| h3      | display-small    | Section heading      |
| h4      | headline-large   | Major subsection     |
| h5      | headline-medium  | Subsection           |
| h6      | headline-small   | Minor heading        |
| p       | body-medium      | Default reading text |
| a       | label-medium     | Interactive text     |
| button  | label-medium     | Action text          |
| label   | label-medium     | Form labels          |

---

## Display Scale

Used for high visual prominence.

display-large → hero banners  
display-medium → key sections  
display-small → prominent section titles

---

## Headline Scale

Used for structured content hierarchy.

headline-large → major section  
headline-medium → subsection  
headline-small → nested section

---

## Title Scale

Used for component level titles.

title-large → cards, panels  
title-medium → grouped content  
title-small → compact headers

---

## Body Scale

Used for reading content.

body-extra-large → emphasis reading  
body-large → comfortable reading  
body-medium → default paragraph  
body-small → secondary text  
body-extra-small → metadata

body-medium-italic → emphasis within paragraph

---

## Label Scale

Used for UI and controls.

label-large → strong UI labels  
label-medium → default UI text  
label-small → compact UI  
label-extra-small → dense UI

---

## Utility Classes

Use classes when semantic HTML is not sufficient.

.display-large  
.display-medium  
.display-small

.headline-large  
.headline-medium  
.headline-small

.title-large  
.title-medium  
.title-small

.body-extra-large  
.body-large  
.body-medium  
.body-small  
.body-extra-small

.label-large  
.label-medium  
.label-small  
.label-extra-small

---

## Color Rules

Text color must use:

var(--vd-color-content-default-base)

Do not override unless using semantic color token.

---

## Implementation Examples

Page heading:

<h1>Dashboard</h1>

Card title:

<div class="title-large">Account Summary</div>

Form label:

<label class="label-medium">Email</label>

Secondary info:

<span class="body-small">Last updated 2 hours ago</span>

---

## Disallowed Practices

Do not:

style headings manually  
create custom text classes  
mix typography levels arbitrarily  
skip hierarchy levels  
use h1 multiple times per page hero context

---

## Typography Decision Flow

Is it page hero? → display scale  
Is it section structure? → headline scale  
Is it component title? → title scale  
Is it reading content? → body scale  
Is it UI control text? → label scale
