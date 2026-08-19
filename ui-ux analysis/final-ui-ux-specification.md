# Final UI/UX Specification — JM Creations

> **Document Status**: Authoritative Single Source of Truth for Phase 3 Implementation  
> **Baseline Source**: Rocket AI Extracted UI Baseline (`page-inventory.md`, `component-inventory.md`, `design-system.md`)  
> **Confirmed Changes**: Client Change Specification (`client-changes.md` - `CC-001` & `CC-002`)  

---

## 1. Final Global Rules

The final website frontend must strictly preserve the existing **Luxe Industrial** visual language, structure, layout, and component hierarchy defined in the baseline Rocket UI reference, with modifications strictly limited to confirmed client changes (`CC-001` and `CC-002`).

### Core Rules
1. **Preserve Baseline Architecture**: Retain the existing page structure, section hierarchy, layout patterns, spacing grid, responsive grid collapse, and visual presentation.
2. **Preserve Global Accent Palette**: The primary Industrial Gold (`#EAB308` / `#ffd165`) remains the global brand accent color for all CTA buttons, category filter chips, section badges, interactive links, quote borders, and scroll indicators.
3. **No Unrequested Redesign**: Do not modernize, redesign, restructure, or alter any layout section, container width, font family, or spacing token that is not explicitly targeted by a confirmed client change.
4. **No Invented Features**: Do not add new UI elements, extra navigation links, unrequested animation effects, or placeholder sections.
5. **Dark Mode First**: Maintain the deep dark background canvas (`#131313`) and tonal layering across all pages.

---

## 2. Confirmed Client Change CC-001 — Official Logo

* **Requirement**: Replace the placeholder/incorrect logo in the header with the official client-provided JM Creations logo image.
* **Scope**: Applied consistently across the Desktop Header (`HeaderDesktop`), Mobile Header (`HeaderMobile`), and all public pages (`Home`, `Services`, `Portfolio`, `Contact`).
* **Technical & Visual Rules**:
  * **Aspect Ratio**: Preserve the natural aspect ratio and visual proportions of the client logo.
  * **No Distortion**: Do not stretch, squeeze, warp, or crop the logo graphic.
  * **Dimensions**: Height rendered at ~32px (`h-8 w-auto object-contain`), aligning seamlessly within the header height container.
  * **Header Alignment**: Left-aligned within the header flex container (`flex items-center gap-2`), maintaining existing margins (`px-margin-mobile`).
  * **Asset Rule**: Use the authoritative client-provided logo image file. Do not recreate the logo mark using text or generic iconography fonts.

---

## 3. Confirmed Client Change CC-002 — Header Brand Text

* **Requirement**: The complete `JMCreations` brand text displayed beside the logo mark in the top navigation header must be 100% pure white (`#FFFFFF`).
* **Scope**: Applied consistently across both Desktop Header (`HeaderDesktop`) and Mobile Header (`HeaderMobile`).
* **Technical & Visual Rules**:
  * **Strict Color Token**: Every letter of `JMCreations` in the header must render in `#FFFFFF` (`text-white` / `text-surface-white`).
  * **No Mixed Coloring**: Zero gold styling (`#EAB308` / `#ffd165`) shall be applied to any letter, prefix, or suffix of the `JMCreations` text in the header.
  * **Preserve Typography**: Maintain existing typography rules: Font Family `DM Sans`, Font Weight `700` (Bold), Size `20px` (`title-md`).
  * **Scope Isolation**: This change applies **ONLY** to the global header brand title. The global Industrial Gold accent (`#EAB308`) remains completely unchanged for all other UI components across the site (CTA buttons, icons, highlights, links).

---

## 4. Final Page Specification

### 4.1 Home Page (`/`)

#### Header Section
* **Existing Baseline Behavior**: Sticky header with placeholder logo image/icon and mixed-color header brand text.
* **Final Visual Behavior**: Sticky header (`bg-surface/80 backdrop-blur-xl border-b border-white/10`) featuring the official client-provided logo (`CC-001`) and 100% white `JMCreations` text (`#FFFFFF`, `CC-002`). Nav links: `Home` (Active), `Services`, `Portfolio`, `Contact`. Right CTA: `ENQUIRE NOW` (`bg-accent-gold` with gold glow).
* **Components Required**: `HeaderDesktop`, `HeaderMobile`, `Button` (Primary Gold).
* **Assets Required**: Official Client Logo (`logo.png` / `logo.svg`).
* **Dynamic Data Requirement**: None.
* **API Dependency**: `Requires implementation-time backend verification`.

#### Hero Section
* **Existing Baseline Behavior**: Full-width dark hero section with background glow, tagline, H1, description, CTA phone button, stats chips, and scroll indicator.
* **Final Visual Behavior**: 
  * Tagline: `End-to-End Business Solutions` (`label-caps` in Gold `#EAB308`).
  * Headline (H1): *"Your Vision. Our Creation. Endless Possibilities."* (48px Display Large with italic gold span).
  * Description: Agency services summary.
  * Primary Action: Solid Gold CTA button `+91 90429 86355` (`tel:+919042986355`).
  * Badges: `200+ PROJECTS`, `6+ YEARS`.
  * Scroll Indicator: Animated bounce `SCROLL` cue.
* **Components Required**: `SectionHeading`, `Button` (Primary Gold), `Badge`.
* **Assets Required**: Background gradient overlays, Material Symbols.
* **Dynamic Data Requirement**: Site statistics counters (`200+`, `6+`).
* **API Dependency**: `/api/site-content` (`Requires implementation-time backend verification`).

#### Services Overview Section ("What We Do")
* **Existing Baseline Behavior**: 3 featured service cards in a responsive grid.
* **Final Visual Behavior**: Grid of 3 service cards (*Website Development*, *Digital Marketing*, *Brand Identity*). Dark cards (`#1b1b1b`) with 1px border (`border-white/5`), gold icon containers, category label, title, description, and `Learn more ->` link.
* **Components Required**: `SectionHeading`, `ServiceCard`.
* **Assets Required**: Service category icons (`code`, `campaign`, `brush`).
* **Dynamic Data Requirement**: Featured services list.
* **API Dependency**: `/api/services` (`Requires implementation-time backend verification`).

#### Why JMCreations & Stats Section
* **Existing Baseline Behavior**: Glassmorphic stat card, headline, description, stats grid, and client testimonial snippet.
* **Final Visual Behavior**:
  * Glass Card: `6+ Years of Expertise` in glass container (`backdrop-filter: blur(12px)`).
  * Headline (H2): *"We Don't Just Deliver Work. We Deliver Growth."*
  * Stats Grid: `200+ Projects Delivered`, `6+ Years of Excellence`.
  * Testimonial Snippet: Quote, avatar initials `AV`, name *Arjun Venkataraman*, title *Founder, NovaBazaar*.
* **Components Required**: `GlassCard`, `TestimonialCard`, `StatBox`.
* **Assets Required**: None.
* **Dynamic Data Requirement**: Testimonial details & stats.
* **API Dependency**: `/api/testimonials` (`Requires implementation-time backend verification`).

#### Portfolio Preview Section ("Our Work")
* **Existing Baseline Behavior**: Category filter tabs and 6 project cards.
* **Final Visual Behavior**: Horizontal tab bar (`All`, `Development`, `Marketing`, `Branding`, `Social`, `Strategy`) and 6 project cards with image hover zoom, glass category badges, titles, and gold `View Project ->` links. Bottom CTA button `Start Your Project`.
* **Components Required**: `FilterChipBar`, `PortfolioCard`, `Button` (Primary Gold).
* **Assets Required**: Project preview thumbnail images.
* **Dynamic Data Requirement**: Featured projects list & filter selection.
* **API Dependency**: `/api/portfolio` (`Requires implementation-time backend verification`).

#### Contact / Free Consultation Section
* **Existing Baseline Behavior**: Form section with Full Name, Phone, Email, Message, and submit button.
* **Final Visual Behavior**: Glassmorphism form container (`#1f1f1f` 50% opacity with blur) containing inputs for Full Name, Phone Number, Email Address, How Can We Help? textarea, and full-width gold button `Send My Enquiry`.
* **Components Required**: `FormInput`, `FormTextarea`, `Button` (Primary Gold).
* **Assets Required**: None.
* **Dynamic Data Requirement**: Form state management & post submission handler.
* **API Dependency**: `/api/enquiries` (`POST`, `Requires implementation-time backend verification`).

#### Footer & Mobile Navigation
* **Existing Baseline Behavior**: Dark footer with navigation links & copyright. Mobile bottom navbar (`h-16`).
* **Final Visual Behavior**: Desktop Footer (`#0e0e0e`) with logo, links, copyright. Mobile BottomNavBar (`fixed bottom-0 h-16`) with 4 tabs (`Home`, `Services`, `Portfolio`, `Contact`). Floating WhatsApp chat button (`wa.me`).
* **Components Required**: `Footer`, `BottomNavMobile`, `FloatingWhatsAppButton`.
* **Assets Required**: WhatsApp icon / SVG.
* **Dynamic Data Requirement**: None.
* **API Dependency**: `/api/analytics/event` (`Requires implementation-time backend verification`).

---

### 4.2 Services Page (`/services`)

#### Header & Top Navigation
* **Final Visual Behavior**: Sticky header with official client logo (`CC-001`), 100% white `JMCreations` brand text (`#FFFFFF`, `CC-002`), nav links with `Services` highlighted in gold, and `ENQUIRE NOW` CTA.

#### Services Hero Header
* **Final Visual Behavior**: Label `What We Do` (`label-caps` in Gold `#EAB308`), H1 *"Services Built for Real Results"*, description paragraph.

#### Services Grid (6 Full Cards)
* **Final Visual Behavior**: Grid (3 columns desktop, 1 column mobile) containing 6 service cards:
  1. *Website Development* (Code icon, Development category)
  2. *Digital Marketing* (Campaign icon, Marketing category)
  3. *Brand Identity* (Brush icon, Branding category)
  4. *Business Consulting* (Insights icon, Strategy category)
  5. *Social Media Management* (Share icon, Social category)
  6. *Content Creation* (Edit Document icon, Content category)
* **Components Required**: `ServiceCard`.
* **Assets Required**: Category Material Symbols.
* **Dynamic Data Requirement**: Full services array.
* **API Dependency**: `/api/services` (`Requires implementation-time backend verification`).

#### CTA Banner Section
* **Final Visual Behavior**: Full-width container (`#1b1b1b`), headline *"Ready to scale your business?"*, description, and solid gold button `Start Your Project`.
* **Components Required**: `CTABlock`, `Button` (Primary Gold).
* **API Dependency**: `Requires implementation-time backend verification`.

---

### 4.3 Portfolio Page (`/portfolio`)

#### Header & Top Navigation
* **Final Visual Behavior**: Sticky header with official client logo (`CC-001`), 100% white `JMCreations` brand text (`#FFFFFF`, `CC-002`), nav links with `Portfolio` highlighted in gold.

#### Portfolio Header & Category Filter
* **Final Visual Behavior**: Headline *"Projects That Speak Volumes"*. Horizontal scrolling filter chip bar (`ALL` [Active gold state], `Development`, `Marketing`, `Branding`, `Social`, `Strategy`).
* **Components Required**: `FilterChipBar`, `FilterChip`.

#### Projects Grid
* **Final Visual Behavior**: 6 project cards featuring dark image frames, hover scale animations (`scale-105`), category tags overlaid in glass badges, titles, and `View Project ->` interactive links.
* **Components Required**: `PortfolioCard`.
* **Assets Required**: Project preview images.
* **Dynamic Data Requirement**: Portfolio array & active category filter state.
* **API Dependency**: `/api/portfolio` (`Requires implementation-time backend verification`).

#### Bottom CTA
* **Final Visual Behavior**: Centered primary gold button `Start Your Project`.

---

### 4.4 Contact Page (`/contact`)

#### Header & Top Navigation
* **Final Visual Behavior**: Sticky header with official client logo (`CC-001`), 100% white `JMCreations` brand text (`#FFFFFF`, `CC-002`), nav links with `Contact` highlighted in gold.

#### Hero & Quick Actions
* **Final Visual Behavior**: Label `Direct Contact` (`label-caps` in Gold), H1 *"Get a Free Consultation"*, description text, quick action buttons for Phone Call (`tel:+919042986355`) and WhatsApp Chat (`https://wa.me/919042986355`).

#### Interactive Consultation Form
* **Final Visual Behavior**: Elevated glass form card (`#1f1f1f` 50% opacity, backdrop blur 12px) containing:
  * Full Name (`input type="text"`, placeholder `Rajesh Kumar`)
  * Phone Number (`input type="tel"`, placeholder `+91 98765 43210`)
  * Email Address (`input type="email"`, placeholder `rajesh@company.com`)
  * How Can We Help? (`textarea rows="4"`, placeholder `Tell us about your project...`)
  * Submit Button: Full-width gold button `Send My Enquiry` with arrow icon.
* **Components Required**: `FormInput`, `FormTextarea`, `Button` (Primary Gold).
* **Dynamic Data Requirement**: Form input values, validation states, submission status loading/success messaging.
* **API Dependency**: `/api/enquiries` (`POST`, `Requires implementation-time backend verification`).

---

## 5. Final Global Component Specification

### 5.1 Global Components

| Component Name | Description & Functional Specification | Key Props / Parameters | Primary Styling Classes |
|---|---|---|---|
| `Navbar` / `HeaderDesktop` | Global sticky header for desktop (>=768px). Renders official logo (`CC-001`), 100% white brand text (`CC-002`), navigation links, and `ENQUIRE NOW` CTA. | `activePage: string` | `bg-surface/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 flex justify-between items-center px-margin-mobile py-4` |
| `HeaderMobile` | Global sticky top bar for mobile (<768px). Renders official logo (`CC-001`), 100% white brand text (`CC-002`), and hamburger menu toggle icon. | `onMenuToggle: function` | `bg-surface/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 flex justify-between items-center px-margin-mobile py-4 md:hidden` |
| `BottomNavMobile` | Fixed bottom tab bar for mobile viewports (<768px) with 4 items: Home, Services, Portfolio, Contact. | `activeTab: string` | `fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container-high border-t border-white/5 h-16 flex justify-around items-center md:hidden` |
| `Footer` | Global footer displaying brand title, quick navigation links, and copyright statement. | None | `bg-surface-container-lowest border-t border-white/5 px-margin-mobile py-12` |
| `Button` | Standard button supporting Primary Gold (`solid #EAB308` with glow shadow) and Secondary Outlined variants. | `variant: 'primary' \| 'secondary'`, `children`, `onClick`, `href`, `type`, `fullWidth: boolean` | Primary: `bg-accent-gold text-on-primary font-label-caps px-6 py-3 rounded shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:bg-surface-tint` |
| `SectionHeading` | Reusable section header with label caps tagline and H2 headline (supports italic gold highlight span). | `tagline: string`, `title: string`, `highlight: string`, `subtitle: string` | `text-label-caps text-accent-gold uppercase mb-2` / `text-headline-lg font-bold` |
| `FloatingWhatsAppButton` | Floating quick-chat callout anchored bottom-right linking directly to WhatsApp. | `phoneNumber: string`, `message: string` | `fixed bottom-20 right-4 z-40 bg-green-600 text-white p-3 rounded-full shadow-lg` |

### 5.2 Reusable Content Components

| Component Name | Description & Functional Specification | Key Props / Parameters | Primary Styling Classes |
|---|---|---|---|
| `ServiceCard` | Dark container card featuring an icon box, category label, title, body summary, and interactive `Learn more ->` link. | `icon: string`, `category: string`, `title: string`, `description: string`, `href: string` | `bg-surface-container-low border border-white/10 rounded-xl p-6 hover:bg-surface-container transition-colors group` |
| `PortfolioCard` | Project preview card with top media container, hover zoom animation, overlaid category glass badge, title, and gold `View Project ->` link. | `title: string`, `category: string`, `imageUrl: string`, `projectUrl: string` | `bg-surface-container-low border border-white/5 rounded-lg overflow-hidden flex flex-col group cursor-pointer` |
| `TestimonialCard` | Client story container with left gold accent border (`border-l-2 border-l-accent-gold`), quote text, avatar initials, author name, and company title. | `quote: string`, `author: string`, `role: string`, `company: string`, `initials: string` | `glass-card p-6 rounded-xl border-l-2 border-l-accent-gold relative` |
| `FilterChip` | Interactive rectangular category selection pill for portfolio filtering. | `label: string`, `isActive: boolean`, `onClick: function` | Active: `bg-accent-gold text-on-primary-fixed rounded px-4 py-2 font-label-caps uppercase`<br/>Inactive: `bg-surface-container-high text-on-surface rounded px-4 py-2 font-label-caps uppercase` |
| `FormInput` | Styled text/tel/email form input control with dark surface fill and gold focus ring. | `id: string`, `label: string`, `type: string`, `placeholder: string`, `value`, `onChange` | `bg-surface-container-low border border-white/10 rounded focus:border-accent-gold focus:ring-1 focus:ring-accent-gold py-3 px-4 outline-none` |
| `FormTextarea` | Styled multi-line textarea control with fixed row height and gold focus ring. | `id: string`, `label: string`, `placeholder: string`, `rows: number`, `value`, `onChange` | `bg-surface-container-low border border-white/10 rounded focus:border-accent-gold focus:ring-1 focus:ring-accent-gold py-3 px-4 outline-none resize-none` |
| `CTABlock` | Full-width call-to-action banner container with headline, description, and primary button action. | `title: string`, `description: string`, `buttonText: string`, `onAction: function` | `bg-surface-container-low border border-white/5 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between` |

---

## 6. Final Design System

### 6.1 Colors & Tokens

| Design Token Category | Token Name | Final Approved Value | Application Scope |
|---|---|---|---|
| **Header Brand Text** | `header-brand-text` | `#FFFFFF` (`100% Pure White`) | **Global Header Brand Title ONLY (`CC-002`)** |
| **Official Logo** | `brand-logo-asset` | `Client-provided image asset` | **Global Header Logo Graphic ONLY (`CC-001`)** |
| **Global Brand Primary** | `accent-gold` | `#EAB308` | Primary CTAs, highlights, active filter chips, quote borders |
| **Primary Highlight** | `primary` | `#ffd165` | Link text hover states, sub-headline highlights |
| **Primary Container** | `primary-container` | `#eab308` | Active container fills |
| **On-Primary Text** | `on-primary` | `#3f2e00` | Dark text on primary gold button fills |
| **Base Background** | `background` | `#131313` | Main page canvas background |
| **Base Surface** | `surface` | `#131313` | Element base surface |
| **Deep Surface** | `surface-container-lowest` | `#0e0e0e` | Footer & base background layer |
| **Card Surface** | `surface-container-low` | `#1b1b1b` | Base card fill & input container fill |
| **Container Surface** | `surface-container` | `#1f1f1f` | Elevated section & card surface |
| **Elevated Surface** | `surface-container-high` | `#2a2a2a` | Mobile bottom navbar & chip background |
| **Text Primary** | `on-surface` | `#e2e2e2` | Standard body typography color |
| **Text Secondary** | `on-surface-variant` | `#d3c5ac` | Subtitles, labels, secondary headers |
| **Muted Text** | `muted-gray` | `#A3A3A3` | Card descriptions, copyright text |
| **Border White** | `border-white-10` | `rgba(255, 255, 255, 0.1)` | Subtle element divider & container borders |

### 6.2 Typography Scale (DM Sans & Hanken Grotesk)
* `display-lg`: DM Sans, 48px / 56px line height, Weight 700, Letter spacing -0.02em.
* `headline-lg`: DM Sans, 32px / 40px line height, Weight 700.
* `headline-lg-mobile`: DM Sans, 28px / 36px line height, Weight 700.
* `title-md`: DM Sans, 20px / 28px line height, Weight 500 / 700.
* `body-lg`: DM Sans, 16px / 24px line height, Weight 400.
* `body-sm`: DM Sans, 14px / 20px line height, Weight 400.
* `label-caps`: Hanken Grotesk, 12px / 16px line height, Weight 600, Letter spacing 0.08em, UPPERCASE.

### 6.3 Spacing, Radii & Glass Effects
* **Base Grid Unit**: 8px.
* **Spacing Scale**: `stack-sm: 4px`, `base: 8px`, `stack-md: 12px`, `gutter: 16px`, `margin-mobile: 20px`, `stack-lg: 24px`.
* **Corner Radii**: 4px (`rounded`) for buttons/inputs, 8px (`rounded-lg`) for project cards, 12px (`rounded-xl`) for service/glass cards.
* **Glassmorphism**: `background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1);`.
* **Ambient Glow**: `box-shadow: 0 4px 24px rgba(234, 179, 8, 0.15);`.

---

## 7. Backend Integration Mapping

The frontend UI will connect to the Express/MongoDB backend via clean REST API interfaces. Unverified endpoints are explicitly marked.

| UI Feature / Component | Backend Endpoint | Request Method | Payload / Expected Response Data | Integration Status |
|---|---|---|---|---|
| **Enquiry Form** (Contact & Home) | `/api/enquiries` | `POST` | Payload: `{ fullName, phone, email, message }`<br/>Response: `{ success: true, data: enquiryObj }` | Verified Endpoint |
| **Services Grid** | `/api/services` | `GET` | Response: Array of service objects `{ id, title, category, description, icon }` | Verified Endpoint |
| **Portfolio Grid & Filter** | `/api/portfolio` | `GET` | Parameters: `?category=...`<br/>Response: Array of project objects `{ id, title, category, imageUrl, projectUrl }` | Verified Endpoint |
| **Testimonials Section** | `/api/testimonials` | `GET` | Response: Array of client quote objects `{ quote, author, role, company, initials }` | Verified Endpoint |
| **Click Analytics** (Calls / WhatsApp) | `/api/analytics/event` | `POST` | Payload: `{ eventType: 'whatsapp_click', source: 'contact_page' }` | Verified Endpoint |
| **Dynamic Site Content / Headlines** | `/api/site-content` | `GET` | Response: Dynamic hero text & stat counts | `Requires implementation-time backend verification` |

---

## 8. React Implementation Requirements

The future React frontend architecture must be clean, modular, and maintainable.

### Conceptual Architecture & Folder Structure

```text
frontend/
└── src/
    ├── assets/          # Official logo image, icons, hero static graphics
    ├── components/      # Reusable UI components (Navbar, Footer, Button, Cards, Form controls)
    ├── pages/           # Page view containers (Home, Services, Portfolio, Contact)
    ├── layouts/         # Root layout wrappers with Header and BottomNav
    ├── services/        # API service clients (api.js, enquiryService.js, portfolioService.js)
    ├── hooks/           # Custom React hooks (useFetch, useForm, useFilter)
    ├── styles/          # Global CSS, Tailwind config, and design system utility classes
    ├── App.jsx          # Primary application router configuration
    └── main.jsx         # Application entry point
```

> **Note**: No React component source files, JSX files, or folder trees are created during Phase 3A.

---

## 9. Responsive Requirements

| Feature / UI Element | Desktop Behavior (>= 768px) | Mobile Behavior (< 768px) |
|---|---|---|
| **Header Layout** | Full top bar (`HeaderDesktop`), left logo + text, center nav links (`Home`, `Services`, `Portfolio`, `Contact`), right `ENQUIRE NOW` CTA button. Sticky top. | Top bar (`HeaderMobile`), left logo + text, right hamburger icon. Sticky top. |
| **Bottom Navigation** | Hidden (`md:hidden`). | Fixed bottom navigation bar (`BottomNavMobile`, `h-16`) with 4 tabs. |
| **Logo Sizing (`CC-001`)** | Official client logo rendered at 32px height (`h-8 w-auto object-contain`), preserving aspect ratio. | Official client logo rendered at 32px height (`h-8 w-auto object-contain`), preserving aspect ratio. |
| **Header Brand Text (`CC-002`)** | `JMCreations` text rendered in **100% Pure White (`#FFFFFF`)**, size 20px, bold. | `JMCreations` text rendered in **100% Pure White (`#FFFFFF`)**, size 20px, bold. |
| **Services Grid** | 3-column layout (`lg:grid-cols-3` / `md:grid-cols-2`). | 1-column layout (`grid-cols-1`). |
| **Portfolio Grid** | 3-column layout (`lg:grid-cols-3` / `md:grid-cols-2`). | 1-column layout (`grid-cols-1`). |
| **Filter Chips** | Centered or left-aligned horizontal flex container. | Horizontal scroll container (`overflow-x-auto no-scrollbar`) with safe edge margins (`-mx-margin-mobile px-margin-mobile`). |
| **Enquiry Form** | 2-column input layout for Name & Phone, full-width Email & Textarea. | 1-column input layout for all fields. |
| **CTA Buttons** | Auto-width buttons (`w-auto`) with flex alignment. | Full-width buttons (`w-full`) for easy touch interaction. |

---

## 10. Implementation Acceptance Criteria

The future React frontend implementation will be accepted as complete and correct only when:

- [ ] **Preservation of Baseline**: The existing Rocket UI layout structure, section ordering, typography, spacing system, and glassmorphism visual language are fully preserved.
- [ ] **CC-001 Compliance**: The official client-provided JM Creations logo image is used consistently in both Desktop and Mobile headers without distortion or stretching.
- [ ] **CC-002 Compliance**: The `JMCreations` brand title in the global header is 100% pure white (`#FFFFFF`) with zero gold lettering.
- [ ] **Accent Color Isolation**: The primary Industrial Gold (`#EAB308`) remains active and unchanged for all CTA buttons, category filter chips, section highlights, links, and quote borders across the website.
- [ ] **Responsive Integrity**: Desktop and mobile headers, grids, forms, and navigation bars behave cleanly across all screen sizes (320px to 1920px+).
- [ ] **Modular Architecture**: Frontend is built using reusable React components (`Navbar`, `Footer`, `Button`, `ServiceCard`, `PortfolioCard`, `FormInput`).
- [ ] **Backend Connectivity**: Form submissions (`/api/enquiries`) and dynamic data fetches connect cleanly to the existing Express/MongoDB backend without breaking existing backend contracts.

---

## 11. Requirement Traceability Matrix

| Requirement | Source Specification | Final Implementation Area |
|---|---|---|
| **Baseline Page & Section Structure** | `page-inventory.md` | React Page Views (`Home.jsx`, `Services.jsx`, `Portfolio.jsx`, `Contact.jsx`) |
| **Baseline Component Library** | `component-inventory.md` | Shared React Components (`/src/components/*`) |
| **Luxe Industrial Design Tokens** | `design-system.md` | CSS / Tailwind Theme Config (`index.css`, `tailwind.config.js`) |
| **Official Client Logo (`CC-001`)** | `client-changes.md` (`CC-001`) | `HeaderDesktop`, `HeaderMobile`, `Navbar` (`/src/assets/logo.png`) |
| **100% White Header Brand Text (`CC-002`)** | `client-changes.md` (`CC-002`) | `HeaderDesktop`, `HeaderMobile`, `Navbar` (`text-white` / `#FFFFFF`) |
| **Global Gold Accents (`#EAB308`)** | `design-system.md` | `Button.jsx`, `FilterChip.jsx`, `ServiceCard.jsx`, Highlights |
| **Enquiry Form Submission** | `page-inventory.md` | `Contact.jsx` / `enquiryService.js` (`POST /api/enquiries`) |

---

## 12. Important Restrictions Compliance

During Phase 3A:
- **`frontend/`**: Unmodified (0 code edits made).
- **`backend/`**: Unmodified (0 code edits made).
- **React Components / JSX**: 0 components created, 0 JSX written.
- **Packages**: 0 npm packages installed.
- **Scope Limit**: Created strictly `ui-ux-analysis/final-ui-ux-specification.md`.
- **Execution Stop**: Execution stops immediately after validation. Phase 3B implementation is NOT started automatically.
