# Design System Specification - Luxe Industrial

> **System Name**: Luxe Industrial  
> **Target Aesthetic**: Dark-mode-first high-contrast minimalism, industrial precision, subtle glassmorphism, ambient illumination.  
> **Source Baseline**: Extracted Rocket AI UI (`luxe_industrial/DESIGN.md` & `code.html` configs)  

---

## 1. Design Philosophy & Aesthetic Guidelines

The **Luxe Industrial** design system combines high-contrast dark minimalism with precise architectural typography and industrial gold accents. It creates a premium, authoritative, and sophisticated experience.

### Core Principles
1. **Dark Canvas First**: Built on deep "True Black" (`#131313` / `#000000`) surfaces to emphasize focus, contrast, and depth.
2. **Industrial Gold Accent**: A single signature color—**Industrial Gold** (`#EAB308` / `#ffd165`)—is used purposefully for call-to-actions, focused outlines, and critical brand moments.
3. **Precision Typography**: Clean geometric sans-serif **DM Sans** for structure and body, paired with all-caps **Hanken Grotesk** for technical metadata and badges.
4. **Tonal Layering & Glassmorphism**: Depth is achieved through layered dark tones (`#0e0e0e` -> `#1b1b1b` -> `#1f1f1f` -> `#2a2a2a`) and 5% white glass translucent panels with `backdrop-filter: blur(12px)`.
5. **Architectural Radii**: Standard elements use soft 4px (`0.25rem`) corners. Round "pill" buttons are explicitly avoided for buttons to retain a serious, solid tone.

---

## 2. Color Palette & Tokens

### 2.1 Surface & Background Tokens

| Token Name | Hex Code | Usage Description |
|---|---|---|
| `background` | `#131313` | Primary page canvas background |
| `surface` | `#131313` | Default element surface background |
| `surface-dim` | `#131313` | Low-brightness surface background |
| `surface-bright` | `#393939` | High-brightness surface highlight |
| `surface-container-lowest` | `#0e0e0e` | Deepest background layer (Footer, base sections) |
| `surface-container-low` | `#1b1b1b` | Base card background & form field surface |
| `surface-container` | `#1f1f1f` | Elevated card container & section surface |
| `surface-container-high` | `#2a2a2a` | Mobile bottom navbar & elevated chip background |
| `surface-container-highest` | `#353535` | Icon containers & elevated borders |
| `surface-white` | `#FFFFFF` | Pure white accent / high-contrast text |

### 2.2 Brand & Primary Tokens (Industrial Gold)

| Token Name | Hex Code | Usage Description |
|---|---|---|
| `accent-gold` | `#EAB308` | Signature Brand Gold for primary CTAs, active states, and highlights |
| `primary` | `#ffd165` | Bright gold highlight & primary text links |
| `primary-container` | `#eab308` | Container fill for primary elements |
| `on-primary` | `#3f2e00` | High-contrast dark text on primary gold buttons |
| `on-primary-container` | `#604700` | Dark text on primary container backgrounds |
| `surface-tint` | `#f7be1d` | Hover tint for primary gold actions |
| `primary-fixed` | `#ffdf9a` | Light gold accent tint |
| `primary-fixed-dim` | `#f7be1d` | Dimmed primary gold accent |
| `on-primary-fixed` | `#251a00` | Dark text on primary fixed background |

### 2.3 Secondary, Muted & Functional Tokens

| Token Name | Hex Code | Usage Description |
|---|---|---|
| `secondary` | `#c8c6c5` | High-contrast silver secondary text |
| `on-secondary` | `#313030` | Dark text on secondary containers |
| `secondary-container` | `#474746` | Medium charcoal container fill |
| `on-surface` | `#e2e2e2` | Primary body typography color |
| `on-surface-variant` | `#d3c5ac` | Subtitle text, secondary labels, and descriptors |
| `muted-gray` | `#A3A3A3` | Card body paragraphs & copyright text |
| `outline` | `#9b8f79` | Muted gold border outline |
| `outline-variant` | `#4f4633` | Dark muted border outline |
| `error` | `#ffb4ab` | Error state text |
| `error-container` | `#93000a` | Error container background |

---

## 3. Typography Scale & Fonts

### 3.1 Font Families
* **Primary Family**: `DM Sans`, sans-serif (Structure, titles, headings, body).
* **Secondary Family**: `Hanken Grotesk`, sans-serif (Technical caps, badges, metadata).
* **Icons**: `Material Symbols Outlined` (Google Fonts).

### 3.2 Typography Tokens & Utility Specifications

| Type Token | Font Family | Size | Weight | Line Height | Letter Spacing | Case / Style |
|---|---|---|---|---|---|---|
| `display-lg` | DM Sans | 48px | 700 (Bold) | 56px | `-0.02em` | Normal |
| `headline-lg` | DM Sans | 32px | 700 (Bold) | 40px | Normal | Normal |
| `headline-lg-mobile` | DM Sans | 28px | 700 (Bold) | 36px | Normal | Normal |
| `title-md` | DM Sans | 20px | 500 / 700 | 28px | Normal | Normal |
| `body-lg` | DM Sans | 16px | 400 (Regular) | 24px | Normal | Normal |
| `body-sm` | DM Sans | 14px | 400 (Regular) | 20px | Normal | Normal |
| `label-caps` | Hanken Grotesk | 12px | 600 (SemiBold) | 16px | `0.08em` | UPPERCASE |

---

## 4. Spacing System & Grid Architecture

Following an **8px base grid** for scale and vertical rhythm:

| Spacing Token | Pixel Value | Tailwind Mapping | Application |
|---|---|---|---|
| `stack-sm` | 4px | `gap-stack-sm` / `mb-stack-sm` | Micro spacing (Icon to text, label to input) |
| `base` | 8px | `gap-base` / `p-base` | Base padding unit |
| `stack-md` | 12px | `gap-stack-md` / `mb-stack-md` | Medium vertical spacing between content blocks |
| `gutter` | 16px | `gap-gutter` | Grid item gutters & horizontal spacing |
| `margin-mobile` | 20px | `px-margin-mobile` | Safe edge padding on mobile viewports |
| `stack-lg` | 24px | `gap-stack-lg` / `py-stack-lg` | Section stack rhythm & large container padding |

---

## 5. Border Radii, Shapes & Elevation

### 5.1 Corner Radius Scale
* `rounded-sm`: `0.125rem` (2px) - Checkboxes & small micro-elements.
* `DEFAULT` / `rounded`: `0.25rem` (4px) - Interactive buttons, input fields, filter chips.
* `rounded-lg`: `0.5rem` (8px) - Project cards & container frames.
* `rounded-xl`: `0.75rem` (12px) - Service cards, glass containers, modal popups.
* `rounded-full`: `9999px` - User avatars & subtle decorative background blurred circles.

### 5.2 Depth, Elevation & Lighting Effects
* **Tonal Depth**:
  * Base Canvas: `#131313`
  * Flat Card Surface: `#1b1b1b` / `#1f1f1f` with `1px solid rgba(255, 255, 255, 0.05)` border.
* **Glassmorphism Spec (`glass-card`)**:
  ```css
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  ```
* **Ambient Light Emission Glow (`glow-shadow`)**:
  ```css
  box-shadow: 0 4px 24px rgba(234, 179, 8, 0.15);
  /* Or Tailwind arbitrary shadow */
  shadow-[0_0_15px_rgba(234,179,8,0.15)]
  ```

---

## 6. Responsive Breakpoints & Layout Rules

* **Mobile First**: Default styles target small screens (`< 768px`) with `px-margin-mobile` edge padding and sticky bottom navigation bar (`h-16`).
* **Desktop Breakpoint (`md:` - 768px)**:
  * Top navigation switches from Mobile Header + Hamburger to Desktop Sticky Header with full link bar and CTA button.
  * Bottom navigation bar hides (`md:hidden`).
  * Grid layouts expand: 1 column on mobile -> 2 columns on tablet (`md:grid-cols-2`) -> 3 columns on desktop (`lg:grid-cols-3`).
  * Typography scales up: `headline-lg-mobile` (28px) scales to `headline-lg` (32px) / `display-lg` (48px).
