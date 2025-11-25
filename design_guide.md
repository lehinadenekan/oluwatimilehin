# Frontend Design Guidelines

Use these guidelines when creating any frontend components or pages.

## Typography

- **Primary**: Playfair Display (headers, important text)

- **Secondary**: Inter or system fonts (body text when needed)

- **Hierarchy**: 3x+ size jumps, not 1.5x

- **Weights**: 300-400 (body), 600-700 (headers)

- **Spacing**: 0.02em-0.05em letter-spacing on headers

- Always load from Google Fonts

## Colors

**Backgrounds:**

- Dark blue: #0a0e27, #0f172a, #1e293b

- Dark grey: #1a1a2e, #16213e, #0f0f1e

**Text:** 

- White: #ffffff or off-white: #f8f9fa, #e2e8f0

**Accents:** 

- Subtle blues: #60a5fa, #3b82f6 (use sparingly)

## Layout

- **Minimal & spacious**: 2x-3x normal whitespace

- **Grid-based**: Clean alignment, clear hierarchy

- **Generous vertical spacing** between sections

- **Fewer elements, more impact**

## Backgrounds

- Solid dark blue or dark grey

- Subtle gradients (dark blue → dark grey)

- Optional: Low-opacity noise textures or geometric patterns

- **Never use light backgrounds**

## Animation

- Subtle, refined, never excessive

- Fade-ins, smooth transitions, hover micro-interactions

- 300-500ms timing for elegance

- CSS-only when possible

## Best Practices

- Use CSS variables for colors

- Rem/em units for spacing

- Mobile-first responsive design

- High contrast for readability

- Smooth transitions on interactive elements

## Avoid

- Purple gradients or bright accent colors

- Cluttered layouts, insufficient spacing

- Generic fonts (Arial, Roboto, default system)

- Light backgrounds or mixed light/dark sections

- Excessive animations

- Small, cramped spacing

## Example Implementation

```css
:root {
  --bg-primary: #0a0e27;
  --bg-secondary: #1e293b;
  --text-primary: #ffffff;
  --text-secondary: #e2e8f0;
  --accent: #60a5fa;
}

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  letter-spacing: 0.03em;
  line-height: 1.2;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  font-weight: 300;
  line-height: 1.7;
  color: var(--text-primary);
  background: var(--bg-primary);
}
```

Apply these principles to all frontend work automatically.

