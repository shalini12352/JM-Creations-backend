# Component Inventory - Rocket UI Baseline

> **Baseline Version**: Extracted Rocket AI UI Baseline  
> **Design Language**: Luxe Industrial  
> **Status**: Confirmed Baseline UI Components  

This inventory lists all reusable visual and structural components extracted from the Rocket AI baseline files. 

---

## 1. Global Navigation Components

### 1.1 Desktop TopAppBar (`HeaderDesktop`)
* **Usage**: Sticky navigation header rendered on viewport width `md` (768px) and larger.
* **Layout**: Flexbox `justify-between items-center`, height ~64px, container padding `px-margin-mobile` (20px), `py-4`.
* **Background & Effects**:
  * Background: `bg-surface/80` (`#131313` with 80% opacity).
  * Blur effect: `backdrop-blur-xl`.
  * Border: `border-b border-white/10` (1px solid 10% white overlay).
  * Positioning: `sticky top-0 z-50`.
* **Sub-components**:
  1. **Brand Identity**: Logo image or Rocket icon (`material-symbols-outlined` gold) + Brand Title `JMCreations` (`title-md` font-bold).
  2. **Nav Links Group**: Horizontal flex container (`gap-gutter` / 16px). Links: `Home`, `Services`, `Portfolio`, `Contact`. Active item styled in solid primary gold (`text-primary opacity-80`), inactive items in `text-on-surface-variant` with gold hover transition.
  3. **Action Button**: Primary small button `ENQUIRE NOW` (`bg-accent-gold`, `text-on-primary`, `px-4 py-2`, `rounded`, `glow-shadow`).

### 1.2 Mobile TopAppBar (`HeaderMobile`)
* **Usage**: Top bar rendered on screen widths `< 768px` (`md:hidden`).
* **Layout**: Flexbox `justify-between items-center`, `px-margin-mobile py-4`, `sticky top-0 z-50`.
* **Elements**:
  * Brand Title `JMCreations` (`title-md` font-bold text-on-surface).
  * Mobile Menu Trigger Button (`material-symbols-outlined: menu` icon in gold).

### 1.3 Mobile BottomNavBar (`BottomNavMobile`)
* **Usage**: Fixed bottom tab bar for mobile viewports (`md:hidden`).
* **Layout**: Fixed positioning (`fixed bottom-0 w-full z-50`), rounded top corners (`rounded-t-xl`), height `h-16`, flex container `justify-around items-center`.
* **Background**: `bg-surface-container-high` (`#2a2a2a`), `border-t border-white/5`, `shadow-lg shadow-accent-gold/5`.
* **Nav Items (4 Tabs)**:
  * `Home` (`material-symbols-outlined: home`)
  * `Services` (`material-symbols-outlined: business_center`)
  * `Portfolio` (`material-symbols-outlined: work`)
  * `Contact` (`material-symbols-outlined: mail`)
* **States**:
  * Active Item: `text-primary bg-surface-bright/20 rounded-lg p-2 scale-95`.
  * Inactive Item: `text-muted-gray p-2 hover:text-primary/80`.

---

## 2. Interactive Buttons & Call-to-Actions

### 2.1 Primary Gold Button (`ButtonPrimary`)
* **Visual Style**: Solid **Industrial Gold** fill (`#EAB308`).
* **Typography**: `label-caps` / `title-md` (Hanken Grotesk / DM Sans), bold, uppercase letter-spacing (0.08em).
* **Text Color**: Dark Charcoal (`#3f2e00` / `#251a00`).
* **Corner Radius**: 4px (`rounded` / `rounded-lg`). *Note: Pills are explicitly avoided to maintain industrial precision.*
* **Elevation & Glow**: `shadow-[0_0_15px_rgba(234,179,8,0.15)]` or `glow-shadow` (`rgba(234, 179, 8, 0.15)` low-opacity gold light emission).
* **Hover / Active State**: Background color transitions to `#f7be1d` (`hover:bg-surface-tint`) or `hover:bg-primary-container`. `active:scale-[0.98]`.

### 2.2 Secondary / Outlined Action Button (`ButtonSecondary`)
* **Visual Style**: Dark container background (`bg-surface-container-high`), 1px border (`border border-white/10`).
* **Text Color**: Pure white or high-contrast silver (`text-on-surface`).
* **Hover State**: Border shifts to gold (`hover:border-primary/50`) or WhatsApp green (`hover:border-green-500/50`).

### 2.3 Filter Chips (`FilterChip`)
* **Usage**: Horizontal category filter bar on Portfolio page.
* **Layout**: Horizontal scroll container with scrollbar hidden (`overflow-x-auto no-scrollbar`).
* **States**:
  * **Active Chip**: Solid Gold `#EAB308` background, `#251a00` text, `rounded px-4 py-2`, `label-caps` uppercase.
  * **Inactive Chip**: Dark surface container (`bg-surface-container-high`), light text (`text-on-surface`), `hover:bg-surface-bright/20` transition.

---

## 3. Content Cards & Containers

### 3.1 Service Card (`CardService`)
* **Container**: `bg-surface-container-low` (`#1b1b1b`), 1px border (`border-white/10` or `border-white/5`), rounded corners 12px (`rounded-xl`), padding `p-6` / `p-stack-lg`.
* **Hover Effect**: Border transitions to gold focus (`hover:border-accent-gold/50`), background shifts to `#1f1f1f`.
* **Internal Structure**:
  1. **Icon Container**: 48x48px box (`w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center`). Gold Material Symbol icon (`code`, `campaign`, `brush`, `insights`, `share`, `edit_document`).
  2. **Category Label**: Uppercase `label-caps` in `text-on-surface-variant`.
  3. **Title**: `title-md` font-bold text-on-surface.
  4. **Description**: `body-sm` font in `muted-gray` (`#A3A3A3`).
  5. **Footer Action**: Gold text link `Learn more ->` with animated arrow translation on card hover (`group-hover:gap-2`).

### 3.2 Portfolio Card (`CardPortfolio`)
* **Container**: `bg-surface-container-low border border-white/5 rounded-lg overflow-hidden flex flex-col group cursor-pointer hover:bg-surface-container`.
* **Media Container**: Top image area `h-48 w-full relative overflow-hidden`. Image zoom transition on hover (`group-hover:scale-105 transition-transform duration-500`).
* **Category Badge**: Overlaid badge top-left (`absolute top-2 left-2 bg-surface-dim/80 backdrop-blur-md text-surface-white font-label-caps px-2 py-1 rounded`).
* **Content Body**: Padding `p-4 flex flex-col gap-2`. Title (`title-md`), Interactive arrow link `View Project ->` in gold.

### 3.3 Glassmorphic Card (`CardGlass`)
* **Visual Spec**:
  * Background: `rgba(255, 255, 255, 0.05)`.
  * Backdrop Blur: `backdrop-filter: blur(12px)`.
  * Border: `1px solid rgba(255, 255, 255, 0.1)`.
  * Radius: `rounded-2xl` or `rounded-xl`.
* **Variants**:
  * **Stat Glass Card**: Displays big metric text (`6+` in `display-lg` gold) and label caps.
  * **Testimonial Glass Card**: Left accent border (`border-l-2 border-l-accent-gold`), quote text, user avatar initials circle (`AV`), author name and company.

---

## 4. Form Controls & Inputs

### 4.1 Input Text Field (`InputText`)
* **Container**: `bg-surface-container-low` (`#1b1b1b`), 1px border (`border-white/10`), corner radius 4px (`rounded`).
* **Typography**: Body text `text-on-surface`, placeholder `text-muted-gray` (`#A3A3A3`).
* **Focus State**: `focus:border-accent-gold focus:ring-1 focus:ring-accent-gold outline-none`.

### 4.2 Textarea Field (`InputTextarea`)
* **Visual Spec**: Matches input field styling, height specified via `rows="4"`, non-resizable (`resize-none`).

### 4.3 Form Label (`FormLabel`)
* **Typography**: `label-caps` / Hanken Grotesk, 12px, font-weight 600, letter-spacing 0.08em, uppercase, `text-on-surface-variant` (`#d3c5ac`).

---

## 5. Footers & Branding Elements

### 5.1 Desktop & Mobile Footer (`FooterGlobal`)
* **Background**: Pure dark surface container lowest (`bg-surface-container-lowest` / `#0e0e0e`), top border `border-t border-white/5`.
* **Elements**: Brand logo title (`JMCreations` in gold), text links (`Services`, `Portfolio`, `Contact`, `Privacy`), copyright timestamp `© 2024 JMCreations. All rights reserved.`.

### 5.2 Floating WhatsApp Button (`FABWhatsApp`)
* **Visual Spec**: Fixed floating callout linking directly to `wa.me/919042986355`. Green icon / gold accent integration with pre-filled message support.

---

## 6. Summary Matrix of Component Specifications

| Component Name | Primary HTML Class Pattern | Dominant Colors | Border / Shadow Spec |
|---|---|---|---|
| **Primary Button** | `bg-accent-gold text-on-primary font-label-caps px-6 py-3 rounded` | Gold (`#EAB308`), Dark `#3f2e00` | Soft 4px radius, `shadow-[0_0_15px_rgba(234,179,8,0.15)]` |
| **Service Card** | `bg-surface-container-low border border-white/5 rounded-xl p-6` | Charcoal `#1b1b1b`, Gold icons | 12px radius, `border-white/5`, gold hover border |
| **Portfolio Card** | `bg-surface-container-low border border-white/5 rounded-lg overflow-hidden` | Dark `#1b1b1b`, Glass overlay badge | 8px radius, image zoom transition |
| **Form Input** | `bg-surface-container-low border border-white/10 rounded py-3 px-4` | Dark `#1b1b1b`, Text `#e2e2e2` | 4px radius, `focus:border-accent-gold` |
| **Glass Container** | `glass-card p-6 rounded-xl` | 5% White overlay, 12px blur | 1px `white/10` border, optional gold left bar |
| **Filter Chip** | `bg-surface-container-high rounded px-4 py-2 font-label-caps` | Gold (Active) / Dark `#2a2a2a` (Inactive) | 4px radius, uppercase label caps |
