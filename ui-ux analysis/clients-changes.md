# Phase 2: Client UI/UX Change Analysis Specification

> **Document Status**: Confirmed Client Change Specifications  
> **Baseline Reference**: Rocket AI UI Baseline (`page-inventory.md`, `component-inventory.md`, `design-system.md`)  
> **Implementation Phase**: Phase 2 (Documentation Only - Pending Implementation)  

---

## Change Specifications

### Change ID: CC-001 — Correct Logo Replacement

* **Change ID**: `CC-001`
* **Page/area**: Global Navigation Header (Desktop and Mobile across all pages: Home, Services, Portfolio, Contact)
* **Component**: Global Header (`HeaderDesktop`, `HeaderMobile`, `TopAppBar`, `Navbar`)
* **Current baseline**: 
  - Rocket UI baseline header displays placeholder/incorrect logo assets (e.g. Google hosted placeholder image `lh3.googleusercontent.com/aida/AP1WRL...` in `home_jmcreations/code.html`, Material Symbol `rocket_launch` icon in `services_jmcreations/code.html` / `portfolio_jmcreations/code.html`, or simulated `JM` text box `<div class="w-8 h-8 bg-primary...">JM</div>` in `contact_jmcreations/code.html`).
* **Client requirement**: 
  - Replace the current incorrect/placeholder Rocket logo with the correct JM Creations logo supplied by the client.
* **Exact final requirement**: 
  - Render the authoritative client-supplied logo image consistently as the main brand logo mark in the top-left section of the global header across all desktop and mobile views.
  - Maintain the exact aspect ratio and visual proportions of the client-provided logo without stretching, squeezing, or distortion.
  - Maintain proper logo dimensions (~32px height / `h-8 w-auto object-contain`) and flex container alignment (`flex items-center gap-2`).
  - Do not redesign or alter the logo's internal graphic elements.
* **Category**: Asset / Branding / Visual
* **Desktop impact**: 
  - Updates the logo image element in `HeaderDesktop` / `Navbar` to source the official client logo file while maintaining horizontal spacing and 32px height alignment next to the brand title.
* **Mobile impact**: 
  - Updates the logo image element in `HeaderMobile` to source the identical official client logo asset, ensuring clean responsive rendering on mobile screens next to the hamburger menu / brand text.
* **Asset impact**: 
  - Replaces all legacy placeholder logo image URLs and icon fallbacks with the official client logo asset file (to be placed in frontend static assets, e.g., `frontend/public/logo.png` or `frontend/src/assets/logo.svg`).
* **Design-system impact**: 
  - Replaces temporary baseline logo visual tokens with the authoritative brand mark. No changes to general container dimensions, padding grid, or header background blur effects.
* **Backend impact**: 
  - None. Static branding image asset handled entirely by the frontend.
* **Priority**: High
* **Implementation status**: Pending Implementation
* **Source/reference**: Confirmed Client Change #1 Specification

---

### Change ID: CC-002 — Header Brand Text (100% White)

* **Change ID**: `CC-002`
* **Page/area**: Global Navigation Header (Desktop and Mobile across all pages: Home, Services, Portfolio, Contact)
* **Component**: Global Header Brand Text (`HeaderDesktop`, `HeaderMobile`, `Navbar` brand text span)
* **Current baseline**: 
  - The `JMCreations` brand text adjacent to the logo mark in the header currently uses mixed white and gold styling (`text-on-surface dark:text-on-surface` with potential gold spans or primary accent highlights in baseline code).
* **Client requirement**: 
  - The ENTIRE "JMCreations" text must be 100% WHITE.
* **Exact final requirement**: 
  - Every single letter of the "JMCreations" header brand text must render in pure white (`#FFFFFF` / `text-white` / `text-surface-white`).
  - Zero gold color (`#EAB308` / `#ffd165`) shall be applied to any portion or letter of the "JMCreations" text in the global header.
  - The global Industrial Gold accent color (`#EAB308`) used elsewhere on the website (CTA buttons, filter chips, highlights, section labels, links) remains completely unchanged.
  - Existing typography settings (Font: `DM Sans`, Size: `title-md` / 20px, Weight: `font-bold`) and positioning remain intact.
* **Category**: Branding / Visual
* **Desktop impact**: 
  - `HeaderDesktop` brand text element `<span>JMCreations</span>` updated to strict full white text color (`text-white` / `text-surface-white`).
* **Mobile impact**: 
  - `HeaderMobile` brand text element `<span>JMCreations</span>` updated to strict full white text color (`text-white` / `text-surface-white`).
* **Asset impact**: 
  - None (CSS / utility style rule update only).
* **Design-system impact**: 
  - Establishes a strict rule that the global header brand title renders in pure white (`#FFFFFF`). Leaves all other primary gold (`#EAB308`) accent tokens across the design system unaffected.
* **Backend impact**: 
  - None. Pure visual CSS style rule.
* **Priority**: High
* **Implementation status**: Pending Implementation
* **Source/reference**: Confirmed Client Change #2 Specification

---

# Final UI/UX Change Summary

* **Total confirmed changes**: 2
* **Affected components**: 
  - Global Header Desktop (`HeaderDesktop` / `TopAppBar`)
  - Global Header Mobile (`HeaderMobile`)
  - Brand Logo Graphic Element (`<img>` / logo container)
  - Brand Title Text Element (`<span>JMCreations</span>`)
* **Affected pages/areas**: 
  - Global Navigation Header rendered across all pages (`Home`, `Services`, `Portfolio`, `Contact`).
* **Assets requiring replacement**: 
  - Replace current placeholder logo references (`lh3.googleusercontent.com...`, Material Symbol `rocket_launch`, simulated `JM` text box) with the official client-supplied logo image asset.
* **Typography/color changes**: 
  - Update "JMCreations" header brand text color from mixed white/gold styling to 100% pure white (`#FFFFFF`).
  - Maintain existing font family (`DM Sans`), font size (`20px` / `title-md`), and font weight (`700` / `font-bold`).
  - All other global gold accent colors (`#EAB308`) across CTAs, cards, badges, and links throughout the site remain untouched.
* **Responsive impact**: 
  - Both changes (`CC-001` and `CC-002`) apply identically and consistently across Desktop (>=768px) and Mobile (<768px) global header versions.
* **Backend impact**: 
  - None. Both changes are purely frontend branding and visual styling updates.
* **Items requiring clarification**: 
  - None. Specifications for client logo replacement and 100% white header brand text are clear, complete, and fully defined for development.
