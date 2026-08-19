# Page Inventory - Rocket UI Baseline

> **Baseline Version**: Extracted Rocket AI UI Baseline  
> **Aesthetic Theme**: Luxe Industrial (Dark Mode First)  
> **Status**: Confirmed Baseline  

This document catalogs all pages, page sections, navigation structures, layout patterns, and backend API integration touchpoints identified from the extracted Rocket UI reference baseline.

---

## 1. Page List Overview

| Page Name | File Reference | Primary Route | Purpose / Description | Key Interactive Elements |
|---|---|---|---|---|
| **Home Page** | `home_jmcreations/code.html` | `/` | Main landing page highlighting agency capabilities, value proposition, service previews, stats, client testimonials, portfolio highlights, and lead capture form. | Navigation, Hero CTA (+91 90429 86355 / Call link), Category Filter Tabs, Service Card links, Testimonial cards, Enquiry Form submit, WhatsApp Floating link. |
| **Services Page** | `services_jmcreations/code.html` | `/services` | Detailed showcase of the six core agency disciplines with descriptions and drill-down links. | Top/Bottom Header nav, Service Card "Learn more" links, Bottom CTA "Start Your Project" button. |
| **Portfolio Page** | `portfolio_jmcreations/code.html` | `/portfolio` | Work showcase featuring project grid, category filtering chips, and project detail hover interactions. | Horizontal scrolling filter chips (ALL, Development, Marketing, Branding, Social, Strategy), Project Cards with hover scale & image overlay, "Start Your Project" CTA. |
| **Contact Page** | `contact_jmcreations/code.html` | `/contact` | Lead generation & direct contact hub featuring direct phone/WhatsApp action cards and an interactive consultation request form. | Direct call link, Direct WhatsApp chat link, Interactive Form (Name, Phone, Email, Message), "Send My Enquiry" submit button. |

---

## 2. Detailed Page & Section Breakdown

### 2.1 Home Page (`/`)

* **TopAppBar (Desktop)**
  * **Visual Layout**: Sticky header, blurred dark surface (`bg-surface/80 backdrop-blur-xl border-b border-white/10`).
  * **Content**: Logo image (`h-8`), brand text `JMCreations` (`title-md`), navigation items (`Home`, `Services`, `Portfolio`, `Contact`), CTA button `ENQUIRE NOW` (`bg-accent-gold` with gold ambient glow).
* **TopAppBar (Mobile)**
  * **Visual Layout**: Sticky top header (`md:hidden`), brand title `JMCreations`, hamburger menu icon button (`material-symbols-outlined`).
* **Hero Section**
  * **Tagline Badge**: `End-to-End Business Solutions` (Uppercase `label-caps` in Gold `#EAB308`).
  * **Main Headline (H1)**: *"Your Vision. Our Creation. Endless Possibilities."* (Display Large 48px/56px with italicized gold highlight).
  * **Body Text**: Description of business consulting, marketing, web dev, and branding support.
  * **Primary Action**: Call button (`+91 90429 86355` with arrow icon, solid gold `#EAB308`).
  * **Trust Indicators**: `200+ PROJECTS`, `6+ YEARS` badge indicators.
  * **Scroll Cue**: Animated bounce vertical indicator (`SCROLL`).
* **What We Do (Services Overview)**
  * **Section Header**: Label `What We Do`, H2 `Services Built for Real Results`.
  * **Services Grid (3 Featured Cards)**:
    1. *Website Development* (Code icon, Development tag, description, "Learn more ->" link).
    2. *Digital Marketing* (Campaign icon, Marketing tag, description, "Learn more ->" link).
    3. *Brand Identity* (Branding icon, Branding tag, description, "Learn more ->" link).
* **Why JMCreations / Expertise & Performance**
  * **Stat Glass Card**: Elevated glass container displaying `6+ Years of Expertise`.
  * **Heading (H2)**: *"We Don't Just Deliver Work. We Deliver Growth."*
  * **Description**: Agency background based in Chennai, trusted by 150+ businesses across India.
  * **Stats Grid**:
    * `200+ Projects Delivered`
    * `6+ Years of Excellence`
  * **Testimonial Snippet**: Quote from Arjun Venkataraman (Founder, NovaBazaar) with custom avatar initials badge `AV`.
* **Our Work (Portfolio Preview)**
  * **Header & Category Filters**: Tab buttons (`All`, `Development`, `Marketing`, `Branding`, `Social`, `Strategy`).
  * **Projects Grid (6 Featured Cards)**:
    1. *Analytics Dashboard* (Web Development)
    2. *E-Commerce Mobile App* (Digital Marketing)
    3. *Brand Identity Suite* (Branding)
    4. *Social Media Campaign* (Social Media)
    5. *Corporate Website* (Web Development)
    6. *Growth Strategy* (Consulting)
  * **CTA Button**: `Start Your Project`.
* **Client Stories & Metrics** *(From Extracted Baseline Data)*
  * Quotes from Priya Subramaniam (Kaleidoscope Textiles) and Rohan Krishnamurthy (SwiftLogix).
  * Performance Metrics: SEO Score (6897), Page Load Time (4.2s -> 0.9s), Conversion Rate (1.2% -> 4.8%).
* **Get a Free Consultation (Form Section)**
  * Form Card containing Full Name, Phone Number, Email Address, Message Textarea, and `Send My Enquiry` button.
* **Footer & Mobile Navigation**
  * Desktop Footer with semantic links and copyright notice.
  * Mobile Bottom Navigation Bar (4 icons: Home, Services, Portfolio, Contact).
  * Floating WhatsApp Action Button (`https://wa.me/919042986355`).

---

### 2.2 Services Page (`/services`)

* **Header Section**
  * Label: `What We Do` (`label-caps` gold).
  * Main Headline (H1): `Services Built for Real Results` with gold italic highlight.
  * Subtitle: *"Six core disciplines, one integrated team. No hand-offs, no gaps..."*
* **Services Grid (6 Full Service Cards)**
  1. **Website Development** (Icon: `code`, Category: `Development`)
  2. **Digital Marketing** (Icon: `campaign`, Category: `Marketing`)
  3. **Brand Identity** (Icon: `brush`, Category: `Branding`)
  4. **Business Consulting** (Icon: `insights`, Category: `Strategy`)
  5. **Social Media Management** (Icon: `share`, Category: `Social`)
  6. **Content Creation** (Icon: `edit_document`, Category: `Content`)
* **CTA Banner Section**
  * Headline: *"Ready to scale your business?"*
  * Button: `Start Your Project` (Gold filled, arrow right icon, subtle ambient glow).

---

### 2.3 Portfolio Page (`/portfolio`)

* **Header Section**
  * Label: `Our Work` (`label-caps` gold uppercase).
  * Main Headline (H1): *"Projects That Speak Volumes"*.
* **Filter Chips Bar**
  * Horizontal scrolling pill container (`overflow-x-auto no-scrollbar`).
  * Chips: `ALL` (Active gold state), `Development`, `Marketing`, `Branding`, `Social`, `Strategy`.
* **Projects Grid (3 Columns on Desktop, 1 Column on Mobile)**
  * 6 project cards with rich dark image frames, hover scale animations (`scale-105`), category tags overlaid in blurred badges (`bg-surface-dim/80 backdrop-blur-md`), titles, and `View Project ->` interactive links.
* **Bottom Action**
  * Centered primary gold button: `Start Your Project`.

---

### 2.4 Contact Page (`/contact`)

* **Hero & Direct Contact Section**
  * Label: `Direct Contact` (`label-caps` gold).
  * Main Headline (H1): *"Get a Free Consultation"*.
  * Description: *"Tell us about your business and we'll map out a growth strategy..."*
  * Quick Contact Buttons:
    * `+91 90429 86355` (Direct Phone Call action card).
    * `Chat on WhatsApp` (WhatsApp green/gold action card linking to `wa.me`).
* **Enquiry Form Component (Glassmorphism Container)**
  * **Fields**:
    * Full Name (`input type="text"`, placeholder: `Rajesh Kumar`)
    * Phone Number (`input type="tel"`, placeholder: `+91 98765 43210`)
    * Email Address (`input type="email"`, placeholder: `rajesh@company.com`)
    * How Can We Help? (`textarea rows="4"`, placeholder: `Tell us about your project...`)
  * **Submit Action**: Primary gold button `Send My Enquiry` (`w-full`, arrow icon, active scale transform).
  * **Fallback Call Link**: Direct telephone text link.

---

## 3. Backend API Integration Mapping

When connecting the React frontend to the Express/MongoDB backend, the following endpoint mappings will be required:

| Component / Section | User Action / Trigger | Backend Endpoint | Request Method | Payload / Response Data |
|---|---|---|---|---|
| **Enquiry Form** (Contact & Home) | Form Submission (`Send My Enquiry`) | `/api/enquiries` | `POST` | Payload: `{ name, phone, email, message, service }`<br/>Response: Success/Error status |
| **Services Grid** | Page Load / Dynamic Render | `/api/services` | `GET` | Response: List of service objects (title, category, icon, description) |
| **Portfolio Grid & Filter** | Page Load / Filter Click | `/api/portfolio` | `GET` | Parameters: `?category=...`<br/>Response: Array of project objects (title, category, imageUrl, projectUrl) |
| **Testimonial Slider / Grid** | Page Load | `/api/testimonials` | `GET` | Response: List of client quotes, avatars, names, titles, companies |
| **Call & WhatsApp Buttons** | Click Event | `/api/analytics/event` | `POST` | Payload: `{ eventType: 'whatsapp_click', page: '...' }` |
| **Hero Text & Site Settings** | Page Load | `/api/site-content` | `GET` | Response: Dynamic headlines, phone numbers, and stat counts |

---

## 4. Confirmation & Uncertainty Matrix

* **Confirmed Baseline Information**:
  * 4 main pages (`Home`, `Services`, `Portfolio`, `Contact`).
  * Palette, fonts, spacing tokens, and glassmorphic aesthetic defined in `DESIGN.md`.
  * Layout structure, component hierarchy, and responsive breakdown in `code.html` files.
* **Uncertain / Pending Requirements**:
  * Exact client-requested text modifications (awaiting client prompt).
  * Additional pages (e.g., Blog, Career, Admin Panel UI specs are pending further instructions).
