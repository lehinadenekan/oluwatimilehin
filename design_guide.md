# Frontend Design Guidelines

Use these guidelines when creating any frontend components or pages.

## Typography

- **Primary Font**: Calibri (system font, applied globally)

  - Fallback stack: Calibri, Calibri Light, Candara, Segoe UI variants, Trebuchet MS, Arial, sans-serif
  - Applied to all text globally via `app/globals.css`

- **Base Font Size**: 18px (increased from default 16px by 2px)

  - Set on `html` element for global scaling

- **Hierarchy**: 3x+ size jumps, not 1.5x

- **Weights**: 300 (body), 600 (headers) ✅ Implemented

- **Spacing**: 0.02em-0.05em letter-spacing on headers ✅ Implemented

  - h1: 0.05em
  - h2: 0.04em
  - h3: 0.03em
  - h4-h6: 0.02em

- **Font**: Calibri system font (preferred over Google Fonts)

## Colors

**Backgrounds:**

- **Implemented Color Scheme:**
  - Black: #000000 (primary background)
  - Dark gray: #111827 (gray-900) for cards and sections
  - Medium gray: #1f2937 (gray-800) for form inputs and borders

**Text:**

- White: #ffffff (primary text)
- Off-white: #9ca3af (gray-400) for secondary text
- Light gray: #6b7280 (gray-500) for muted text

**Accents:**

- **Purple (Implemented):**
  - Main purple: #7e22ce (purple-700) - used for buttons, active states, borders, cursor
  - Hover purple: #6b21a8 (purple-800) - used for hover states
  - Text purple: #a78bfa (purple-400), #c4b5fd (purple-300) - used for accent text
  - Dark purple: #581c87 (purple-900) - used for dark backgrounds

## Layout

- **Minimal & spacious**: 2x-3x normal whitespace

- **Grid-based**: Clean alignment, clear hierarchy

- **Generous vertical spacing** between sections

- **Fewer elements, more impact**

## Backgrounds

- **Implemented:**

  - Solid black (#000000) - primary background
  - Solid dark gray (#111827, gray-900) - cards and sections
  - Solid medium gray (#1f2937, gray-800) - inputs and nested elements

- **Optional Enhancements (Not Yet Implemented):**

  - Subtle gradients (optional enhancement)
  - Low-opacity noise textures or geometric patterns (optional enhancement)

- **Never use light backgrounds** ✅ Enforced

## Animation

- **Implemented:**

  - Smooth transitions: 300ms duration (standardized across components)
  - Typewriter effect: 100ms per character
  - Fade-ins: 1000ms duration for tagline
  - Hover micro-interactions: scale transforms, border color changes
  - CSS-only animations ✅

- **Timing**: 300-500ms timing for elegance ✅ (using 300ms)

## Best Practices

- **Implemented:**
  - Mobile-first responsive design ✅
  - High contrast for readability ✅ (white on black/dark gray)
  - Smooth transitions on interactive elements ✅ (300ms standard)
  - CSS variables for colors ✅ (comprehensive color system implemented)
- **Implemented:**
  - Rem/em units for spacing ✅
    - Tailwind spacing utilities already use rem units (each unit = 0.25rem)
    - Inline styles converted from px to rem
    - Base font size: 18px (1.125rem) for proper rem scaling

## Avoid

- **✅ Implemented:**
  - Purple gradients or bright accent colors ✅ (removed, using solid purple-700)
  - Light backgrounds or mixed light/dark sections ✅ (all dark backgrounds)
  - Excessive animations ✅ (subtle, refined animations only)
- **⚠️ Needs Attention:**
  - Generic fonts (Arial, Roboto, default system) - _Currently using Calibri system font_
  - Cluttered layouts, insufficient spacing - _Review spacing consistency_
  - Small, cramped spacing - _Ensure generous spacing_

## Current Implementation

```css
/* app/globals.css - Current Implementation */
html {
  font-size: 18px; /* Base font size */
  scroll-behavior: smooth;
}

body {
  font-family: "Calibri", "Calibri Light", "Candara", "Segoe UI",
    "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Bold", "Trebuchet MS",
    "Arial", sans-serif;
  color: rgb(255, 255, 255);
  background: rgb(0, 0, 0);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

**Color Usage:**

- **CSS Variables Available:**

  - Backgrounds: `var(--bg-primary)`, `var(--bg-secondary)`, `var(--bg-tertiary)`
  - Text: `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`
  - Accents: `var(--accent-primary)`, `var(--accent-hover)`, `var(--accent-text-light)`, `var(--accent-text-lighter)`, `var(--accent-dark)`
  - Borders: `var(--border-primary)`, `var(--border-secondary)`

- **Tailwind Classes (now use CSS variables):**
  - Buttons/Active States: `bg-purple-700` or `bg-accent-primary` (#7e22ce)
  - Hover States: `hover:bg-purple-800` or `hover:bg-accent-hover` (#6b21a8)
  - Borders/Focus: `border-purple-700`, `focus:ring-purple-700`
  - Text Accents: `text-purple-400`, `text-purple-300`
  - Backgrounds: `bg-black`, `bg-gray-900`, `bg-gray-800` (or use `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-tertiary`)

## Not Yet Implemented

The following items from the original design guide are **not yet implemented**:

1. **Typography:**

   - ✅ Letter-spacing on headers (0.02em-0.05em) - Implemented
   - ✅ Consistent font weights (300 body, 600 headers) - Implemented
   - ✅ Using Calibri system font (preferred over Playfair Display/Inter)

2. **Colors:**

   - ✅ Current color scheme implemented (black, gray-900, gray-800 backgrounds with purple-700 accents)

3. **Backgrounds:**

   - ❌ Subtle gradients (dark blue → dark grey)
   - ❌ Low-opacity noise textures or geometric patterns

4. **CSS Variables:**

   - ✅ Comprehensive color system using CSS variables - Implemented
   - ✅ Variables for: --bg-primary, --bg-secondary, --bg-tertiary, --text-primary, --text-secondary, --accent-primary, --accent-hover, etc.

5. **Spacing:**
   - ✅ Rem/em units for spacing - Implemented
     - Tailwind spacing utilities use rem units by default (each unit = 0.25rem)
     - Inline styles converted from px to rem
     - Base font size set to 18px (1.125rem) for proper rem scaling

Apply these principles to all frontend work automatically.
