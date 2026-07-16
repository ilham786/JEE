# FocusForge Styling Guide & Design System

FocusForge features a custom-built, modern dark-themed user interface utilizing frosted glass overlays (glassmorphism), dynamic neon glows, and clear visual hierarchies. The styling implementation uses **Tailwind CSS v4**'s new CSS-first design engine.

---

## 1. CSS Architecture

FocusForge uses Tailwind CSS v4, which deprecates the traditional `tailwind.config.js` in favor of a CSS-first configuration model.
*   **Main stylesheet**: [globals.css](file:///c:/Users/Lenovo/Desktop/JEE/src/app/globals.css)
*   **Tailwind directives**: `@import "tailwindcss";` at the top of `globals.css` triggers the compile system.
*   **Theme overrides**: Done in `globals.css` inside the `@theme` block using standard CSS custom property variables.

---

## 2. Design Tokens & Color Palette

The color system encodes subject category logic directly into colors, creating immediate visual anchors.

```css
@theme {
  --color-background: #090a0f;
  --color-foreground: #f3f4f6;
  
  --color-card-bg: rgba(13, 15, 22, 0.7);
  --color-card-border: rgba(255, 255, 255, 0.06);
  --color-card-hover-border: rgba(255, 255, 255, 0.15);

  --color-physics: #3b82f6;        /* Physics Blue */
  --color-chemistry: #10b981;      /* Chemistry Green */
  --color-maths: #f59e0b;          /* Mathematics Amber */
  --color-accent-purple: #8b5cf6;  /* Brand Purple / CTAs / Active states */
  --color-accent-red: #ef4444;     /* Overdue alerts / Danger actions */
}
```

### Color Palette Mappings
*   **Physics (Blue - `#3b82f6`)**: Applied to Physics syllabus metrics, Physics mistake lists, and Physics charts.
*   **Chemistry (Green - `#10b981`)**: Applied to Chemistry progress indicators, formulas, and chemistry logs.
*   **Maths (Amber - `#f59e0b`)**: Applied to Maths progress indicators and mathematics mistakes.
*   **Accent Purple (Purple - `#8b5cf6`)**: Represents brand focus. Default button backgrounds, streak items, active navigation sidebars, and timer counters.
*   **Dark Neutral Background (`#090a0f`)**: Near-black workspace base background.

---

## 3. Typography

*   **Primary Font**: Geist Sans (loaded in [layout.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/app/layout.tsx)) mapped to standard sans-serif classes.
*   **Numerical Font**: Geist Mono (loaded in [layout.tsx](file:///c:/Users/Lenovo/Desktop/JEE/src/app/layout.tsx)) with `font-mono` and `tabular-nums` classes. This ensures numbers do not shift horizontally while countdown timers tick down.
*   **Typography Sizing Hierarchy**:
    *   Page / Section Header titles: `text-2xl font-bold md:text-3xl font-extrabold tracking-tight`
    *   Card titles: `text-base font-bold text-white`
    *   Stat/KPI values: `text-2xl font-black md:text-3xl`
    *   Subtitles/secondary labels: `text-sm text-gray-400`
    *   Micro badges: `text-[10px] tracking-wider font-semibold uppercase`

---

## 4. Glassmorphism Utilities

Standard frosted-glass classes are registered directly in `globals.css` as utility classes:

### `.glass-panel`
Frosted translucent panel styling:
```css
.glass-panel {
  background: rgba(13, 15, 22, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```
*Usage*: Combine with `rounded-xl p-4 md:p-6` to construct dashboard panels.

### `.glass-panel-hover`
Adds interactive translations and borders for grid cards:
```css
.glass-panel-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glass-panel-hover:hover {
  background: rgba(18, 21, 30, 0.85);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}
```

### `.glass-input`
Form fields that fit the dark aesthetic:
```css
.glass-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: #ffffff;
  transition: all 0.2s ease;
}
.glass-input:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.25);
  outline: none;
}
```

---

## 5. Spacing, Layouts & Grids

FocusForge enforces a mobile-first design strategy. Page layouts resize gracefully across phone, tablet, and desktop viewports.

*   **Max Layout Width**: The content container is restricted to `max-w-7xl mx-auto`.
*   **Page Margins**:
    *   Mobile viewports: `p-3` container spacing.
    *   Tablet/Desktop viewports: `p-6` spacing.
    *   Monk Mode: Collapses content padding to `p-3 md:p-4` to maximize utility surface.
*   **Responsive Grids**:
    *   KPI grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
    *   Dashboard layouts: `grid grid-cols-1 lg:grid-cols-3 gap-6` (2 columns for data charts, 1 column for quick settings/recent journals).
*   **Border Radii**:
    *   Panels/Cards: `rounded-xl` (12px)
    *   Inputs/Buttons/Badges: `rounded-lg` (8px)
    *   Gamification Chips: `rounded-full` (9999px)

---

## 6. Animations & Transitions

### Framer Motion Presets
For standard UI card entry animations or list changes, use these Framer Motion configurations:

```typescript
// Fade in and slide up (e.g. page container mounts)
const faderUpPreset = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// Scale on interaction (buttons and clicks)
const buttonHoverTap = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};
```

### CSS Pulsing Glows
For Monk Mode active signals or live session status indicators:
```css
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.pulse-glow-effect {
  animation: pulse-glow 3s infinite ease-in-out;
}
```
Combined with `.radial-glow` inside layouts to create breathing background lighting behind panels.
