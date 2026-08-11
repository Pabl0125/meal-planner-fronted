---
name: Serene Table
colors:
  surface: '#fbf9f6'
  surface-dim: '#dcdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#f0edea'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#434843'
  inverse-surface: '#30302f'
  inverse-on-surface: '#f3f0ed'
  outline: '#747872'
  outline-variant: '#c3c8c1'
  surface-tint: '#526254'
  primary: '#506052'
  on-primary: '#ffffff'
  primary-container: '#687969'
  on-primary-container: '#f6fff4'
  inverse-primary: '#b9cbb9'
  secondary: '#5e5e5d'
  on-secondary: '#ffffff'
  secondary-container: '#e0dfde'
  on-secondary-container: '#626361'
  tertiary: '#5c5c59'
  on-tertiary: '#ffffff'
  tertiary-container: '#757571'
  on-tertiary-container: '#fffcf8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e7d5'
  primary-fixed-dim: '#b9cbb9'
  on-primary-fixed: '#101f13'
  on-primary-fixed-variant: '#3b4b3d'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c5'
  on-secondary-fixed: '#1a1c1b'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#e4e2de'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474744'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system embodies a **Zen-Minimalist** aesthetic tailored for a high-end meal planning experience. The goal is to reduce the cognitive load of domestic management through extreme clarity, generous whitespace, and a sophisticated editorial feel. 

The style utilizes a "Soft-Tactile" approach—mixing the cleanliness of modern SaaS with the warmth of a luxury lifestyle magazine. It prioritizes a calm emotional response, ensuring that the process of planning meals feels like a moment of mindfulness rather than a chore. Visual weight is managed through thin, precise lines and tonal shifts rather than heavy fills or aggressive colors.

## Colors

The palette is rooted in **Warm Whites and Earthy Neutrals** to create an inviting, kitchen-like atmosphere. 

- **Primary (Sage Green):** Used sparingly for meaningful actions (Save, Complete, Add) and active states. It should feel organic and muted.
- **Secondary (Warm White):** The foundational surface color. It is softer than pure #FFFFFF, reducing eye strain and feeling more "premium paper" than "digital screen."
- **Tertiary (Stone):** Used for subtle borders, secondary backgrounds, and disabled states.
- **Neutral (Charcoal):** Reserved for high-contrast text and iconography to ensure AAA accessibility against the light backgrounds.

## Typography

The typographic system relies on a high-contrast pairing between a literary serif and a geometric sans-serif.

- **Headlines:** Use *Libre Caslon Text* to evoke an editorial, high-end cookbook feel. Larger headings should utilize slight negative letter-spacing to appear more cohesive.
- **Body & UI:** Use *DM Sans* for its exceptional legibility and modern, low-contrast letterforms. It keeps the functional parts of the UI feeling efficient and clean.
- **Labels:** Small labels and "Overlines" should be set in uppercase with increased letter-spacing to provide a clear structural hierarchy without needing heavy font weights.

## Layout & Spacing

The layout follows a **Fixed-Width Centered Grid** for desktop to maintain an organized, boutique feel, transitioning to a fluid single column for mobile.

- **The 8px Rule:** All dimensions, padding, and margins must be multiples of 8px.
- **Whitespace:** Emphasize "Macro-whitespace" (space between major sections). The design system favors a 48px or 64px gap between functional blocks to allow the content to "breathe."
- **Planning Grid:** The weekly view should utilize a flexible 7-column layout on desktop, reflowing to a vertical list (stack) on mobile devices.

## Elevation & Depth

To maintain a "Zen" aesthetic, depth is achieved through **Tonal Layering** and **Ambient Shadows** rather than stark borders.

- **Level 0 (Base):** The main canvas, using the Secondary color (Warm White).
- **Level 1 (Cards):** Pure white background with a very soft, diffused shadow (Blur: 20px, Y: 4px, Opacity: 4%, Color: Neutral).
- **Level 2 (Interactive/Floating):** Used for meal cards being dragged or dropdown menus. Increase shadow spread and add a subtle 1px border in the Tertiary color.
- **Glassmorphism:** Use sparingly for fixed navigation bars or recipe overlays, using a heavy backdrop-blur (12px) and 80% opacity of the Base color.

## Shapes

The shape language is **Soft and Architectural**. 

- **Containers:** Standard cards use a 0.25rem (4px) or 0.5rem (8px) radius. This keeps the interface feeling structured and precise rather than "bubbly."
- **Interactive Elements:** Buttons and input fields should match the card roundedness for consistency.
- **Drop Zones:** Use dashed strokes (1px, 4px gap) with the same corner radius to indicate where recipes can be placed.

## Components

- **Meal Cards:** Minimalist blocks featuring a high-quality image, a small `label-sm` tag for category (e.g., "BREAKFAST"), and a `headline-md` title. Metadata (time, calories) should be in `label-md` with low-opacity text.
- **Buttons:** 
  - *Primary:* Solid Sage Green with white text. 
  - *Secondary:* Ghost style with a 1px Stone border and Charcoal text.
- **Input Fields:** Bottom-border only or very light 1px frames. Focus states should transition the border color to Sage Green without adding thickness.
- **Drop Zones:** Large, empty states within the daily planner columns with a "Plus" icon and `label-md` text ("Add Meal").
- **Chips:** Used for dietary tags (Vegan, GF). Small, pill-shaped with a Tertiary background and no border.
- **Lists:** Recipe ingredients should use generous line-height (`body-md`) and custom checkboxes that are simple 18px circles with a Sage Green checkmark upon selection.