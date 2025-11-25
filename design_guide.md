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

- White: #ffffff (primary text, headers)
- Light gray: #e5e7eb (gray-200) for descriptive text, game instructions, service descriptions
- Off-white: #9ca3af (gray-400) for less prominent secondary text
- Muted gray: #6b7280 (gray-500) for very muted text

**Accents:**

- **Purple (Implemented):**
  - Main purple: #7e22ce (purple-700) - used for buttons, active states, borders, cursor, Settings button
  - Hover purple: #6b21a8 (purple-800) - used for hover states
  - Text purple: #a78bfa (purple-400) - used for play stats and accent text
  - Light purple: #c4b5fd (purple-300) - used for lighter accent text
  - Dark purple: #581c87 (purple-900) - used for dark backgrounds
- **Gray (Secondary Actions):**
  - Gray: #4b5563 (gray-600) - used for Stats and Help buttons
  - Gray hover: #374151 (gray-700) - used for hover states
- **Green (Special Actions):**
  - Green: #15803d (green-700) - used for "New Game" button
  - Green hover: #166534 (green-800) - used for hover state

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
  - High contrast for readability ✅ (white on black/dark gray, gray-200 for descriptive text)
  - Smooth transitions on interactive elements ✅ (300ms standard)
  - CSS variables for colors ✅ (comprehensive color system implemented)
  - Rem/em units for spacing ✅
    - Tailwind spacing utilities already use rem units (each unit = 0.25rem)
    - Inline styles converted from px to rem
    - Base font size: 18px (1.125rem) for proper rem scaling
  - **Button Standardization:**
    - All buttons use consistent styling: `px-6 py-3`, `font-semibold`, `transition-all duration-300`
    - Consistent layout: `inline-flex items-center space-x-2`
    - Color scheme:
      - Purple (primary): Settings, Send Message, Share, Continue Playing
      - Gray (secondary): Stats, Help, Cancel, Return to Game Board, No/I'll keep trying
      - Green (special actions): New Game, Play Again
  - **Text Legibility:**
    - Descriptive text uses `text-gray-200` (lighter gray, not white) for better readability
    - Larger font sizes: `text-base`, `text-xl` instead of `text-sm`, `text-xs`
    - Consistent across all sections: game descriptions, service descriptions, instructions
  - **Mobile Layout:**
    - Component ordering optimized for mobile (description → buttons → content)
    - Responsive spacing: Use `mb-12` on mobile, `mb-6` on desktop for proper visual hierarchy
    - Buttons positioned directly above interactive content, not above descriptive text
  - **Modal Positioning:**
    - All game modals use `absolute` positioning relative to game board container
    - Modals center over game board area specifically (not entire viewport)
    - Game board container has `relative` positioning to establish positioning context
    - All modals (GameEndModal, LetterRevealModal, AccentGuidanceModal, CharacterHintModal, HelpModal, SettingsPanel, EnhancedStatisticsDisplay, ConfirmationModal) rendered inside game board container
  - **Modal Styling:**
    - Info sections use gray backgrounds (bg-gray-700) with gray borders (border-gray-600)
    - Only primary action buttons use purple (e.g., "Continue Playing", "Reset All", "Apply & New Game")
    - Secondary buttons (Cancel, Close) use gray (bg-gray-600 hover:bg-gray-700)
    - Secondary buttons and info sections avoid purple for cleaner appearance
    - **Stats Modal:**
      - Simplified color scheme: Consistent gray backgrounds (gray-700, gray-600)
      - Standardized text sizes: text-base for section headers, text-sm for body text, text-xs for fine print
      - Consistent spacing: p-6 for sections, p-4 for cards, space-y-4 between sections
      - Buttons: Close (gray) and Reset All (purple) same size (flex-1)
    - **Settings Modal:**
      - Cancel button grey (bg-gray-600)
      - Word length synchronized with game board using currentWordLength prop

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
  - Text Accents: `text-purple-400` (for play stats), `text-purple-300` (for lighter accents)
  - Descriptive Text: `text-gray-200` (for game descriptions, service descriptions, instructions)
  - Secondary Buttons: `bg-gray-600 hover:bg-gray-700` (for Stats, Help)
  - Special Actions: `bg-green-700 hover:bg-green-800` (for "New Game")
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

## Button Styling Standard

All buttons should follow this standard pattern:

```tsx
className =
  "inline-flex items-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300";
```

**Variations:**

- **Primary Actions:** `bg-purple-700 hover:bg-purple-800` (Settings, Send Message, Share, Continue Playing, Reset All, Apply & New Game)
- **Secondary Actions:** `bg-gray-600 hover:bg-gray-700` (Stats, Help, Cancel, Close, Return to Game Board, No/I'll keep trying)
- **Special Actions:** `bg-green-700 hover:bg-green-800` (New Game, Play Again)

## Text Styling Standard

**Descriptive Text:**

- Use `text-gray-200` (not white, not gray-400)
- Use larger sizes: `text-base`, `text-xl` (not `text-sm`, `text-xs`)
- Examples: Game descriptions, service descriptions, "Get in touch" text, Part of Speech/English translations

**Play Stats:**

- Use `text-purple-400` for better legibility
- Example: "155K plays", "911K plays"

## Modal Positioning Standard

**Game Modals:**

- All game modals (GameEndModal, LetterRevealModal, AccentGuidanceModal, CharacterHintModal) use `absolute` positioning
- Positioned relative to game board container (not viewport)
- Game board container must have `relative` positioning to establish positioning context
- Modals center over game board area specifically using `flex items-center justify-center`
- Backdrop uses `absolute inset-0` to cover only the game board area

**Modal Styling:**

- Info sections: Gray backgrounds (`bg-gray-700`) with gray borders (`border-gray-600`)
- Avoid purple in info sections - only use for primary action buttons
- Modal container: Gray background (`bg-gray-800`) with gray border (`border-gray-700`)

Apply these principles to all frontend work automatically.
