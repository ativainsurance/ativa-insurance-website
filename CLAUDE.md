# CLAUDE.md — Ativa Insurance Website Rules

## Always Do First

* Invoke the `frontend-design` skill before writing ANY frontend code
* Understand this is NOT a generic website — it is a **conversion-focused quoting system**

---

# CORE PRODUCT PRINCIPLE

This website is NOT informational.

It is:
→ A **product selection interface (Amazon-style)**
→ A **guided insurance intake system**

Primary goal:

* User selects product immediately
* Completes form quickly
* Provides full quote-ready data
* No friction, no confusion

## CORE STRUCTURE (NON-NEGOTIABLE)

1. Product selection MUST stay at the top (hero section)
2. Page flow order:

- Hero (product selection + toggle)
- Carriers (scrolling marquee)
- Customer Reviews (Google-style)
- FAQ
- Blog / Educational content
---

## DESIGN SYSTEM

### PERSONAL MODE
- Background: white / beige (light, clean)
- Tone: friendly, simple, approachable
- Icons: home, car, family (soft style)

### COMMERCIAL MODE
- Background:  gold / yellow
- Accent: dark navy / charcoal
- Tone: premium, strong, business-focused

---

## HERO BACKGROUND ILLUSTRATIONS

- Use subtle SVG illustrations (Progressive-style)
- Opacity: 5–10%
- Positioned absolute in background
- MUST change based on mode:

Personal:
- house
- car
- family
- trees

Commercial:
- buildings
- trucks
- tools
- charts

---

# UI STRUCTURE RULES

## Homepage MUST:

* Show product options ABOVE THE FOLD
* No scrolling required to take action
* No long text blocks
* No “about us first” layouts

---

## Primary Toggle (MANDATORY)

* Personal (Blue/White)
* Commercial (Black/Orange)

UI must dynamically change:

* Colors
* Logo (if applicable)
* Product cards

---

## PRODUCTS

### PERSONAL PRODUCTS
- Auto
- Home
- Renters
- Condo
- Flood
- Bundle (REPLACES Life/Health)

### COMMERCIAL PRODUCTS
- BOP
- General Liability
- Commercial Auto
- Workers Comp
- Professional Liability
- Cyber Liability

---

## CARRIER LIST

### PERSONAL
GEICO  
PROGRESSIVE  
BRISTOL WEST  
ASSURANCE AMERICA  
CITIZENS  
CABRILLO COASTAL  
FOREMOST  
GREEN SHIELD  
RLI  
VACANTEXPRESS  
BURNS & WILCOX  
WRIGHT FLOOD  
UNIQUE INSURANCE  
TEND
STERLING
RAINWALK
PROPELLER 
KANGURO
EPREMIUM
NEPTUNE
COLLECTIBLES
AHOY
AONEDGE
ANNEX RISK

### COMMERCIAL
GEICO  
BRISTOL WEST  
FORGE  
HISCOX  
RLI  
NORMANDY  
BURNS & WILCOX  
GREAT AMERICAN  
THREE  
BERXI  
FIRST INSURANCE  
BIBERK  
AMTRUST  
CHUBB  
GREEN SHIELD
NEXT  
PROGRESSIVE
ATTUNE
BLITZ
COVER WHALE
PROPELLER
BTIS

---

## CARRIERS SECTION

- Must be horizontal scrolling (marquee style)
- Continuous movement (like electronic signage)
- No static grid

---

## REVIEWS

- Use Google-style testimonials
- Show:
  - Name
  - Stars
  - Short text

---

## CONTACT / FOOTER INFO

Phone: 561-946-8261  
Address: 2412 Irwin St Ste 372 Melbourne FL 32901  

Licensed States:
CT, FL, GA, NC, SC, NJ, TN, MD, MA, OH, PA  

---

## WHATSAPP BUTTON

- Floating button (bottom right)
- Link:
https://wa.me/13213448474

---


---

## Product Cards

Each card MUST:

* Be large and highly clickable
* Include:

  * Icon
  * Title
  * 1-line description
* Have strong hover effect (lift + shadow)
* Clearly indicate action (cursor, animation, arrow)

---

## Modal Form Behavior

* Opens instantly on click
* Smooth animation
* No page reload

---

# FORM LOGIC (CRITICAL)

## DO NOT BUILD GENERIC FORMS

Each product must have:
→ Its OWN form flow

---

## Requirements:

* Multi-step (not long forms)
* One question per step when possible
* Progress indicator required
* Large inputs (mobile-first)

---

## REQUIRED DATA COLLECTION

### Auto:

* Address validation (Google Places or mock)
* VIN input + decoder (structure required)

### Property:

* Address validation
* Property details (year, sqft, roof, etc.)

### Commercial:

* Business data (revenue, employees, etc.)

---

## UX PRIORITY:

* Reduce typing
* Use dropdowns where possible
* Use auto-fill when possible
* Guide user step-by-step

---

## UX RULES

- Minimize friction
- No unnecessary fields before quote
- Clicking product should immediately start flow
- Fast, mobile-first

---

# 🌍 MULTILINGUAL (MANDATORY)

Must support:

* English (default)
* Portuguese
* Spanish

---

## COPY RULE

DO NOT claim:
“50+ carriers”

Instead:
“multiple top-rated carriers”

---

## Behavior:

* Language switcher in header (EN / PT / ES)
* Instant switching (no reload)
* ALL text must translate:

  * UI
  * Forms
  * Errors
  * Buttons

---

## Implementation:

* Use translation JSON files
* No hardcoded text inside components

---

# DESIGN SYSTEM RULES

## Visual Goal:

* Modern
* Bold
* High-conversion
* Premium but simple

---

## Color Behavior:

* Personal → Blue gradient
* Commercial → Dark + Orange

---

## Typography:

* Strong headline contrast
* Clean body text
* Clear hierarchy

---

## Cards:

* High contrast
* Elevated feel
* Strong hover interaction

---

## DO NOT:

* Use soft/washed-out UI
* Use low contrast
* Make elements look passive

---

# CONVERSION PRINCIPLES

Everything must answer:

 “What should the user do next?”

---

## REQUIRED:

* Clear CTA direction
* Fast perceived speed
* Minimal decisions per step

---

## REMOVE:

* Unnecessary text
* Complex explanations
* Distractions

---

# TECHNICAL RULES

* Next.js (App Router)
* No duplicate components
* No multiple `export default`
* Hooks ONLY inside components
* Clean modular structure:

Required components:

* LanguageProvider
* Toggle
* ProductCard
* Modal
* StepForm

---

# INTEGRATION STRUCTURE

Must include placeholders for:

* Address autocomplete (Google Places)
* VIN decoder API

Even if mocked → structure must exist

---

# BRAND ASSETS

* Always check `/brand_assets`
* Use real logo if available
* Logo must:

  * Be properly sized
  * Match header background
  * Never look pasted or misaligned

---

# HARD RULES

* Do NOT build generic websites
* Do NOT create long forms
* Do NOT add unnecessary sections
* Do NOT break flows
* Do NOT use default Tailwind colors
* Do NOT use `transition-all`
* Do NOT ignore mobile UX

---

# UX VALIDATION (MANDATORY THINKING)

Before finalizing UI, always evaluate:

* Is the next step obvious?
* Is anything slowing the user down?
* Can this be simpler?
* Does this feel fast?

---

# FINAL STANDARD

User should feel:

“I clicked what I need, answered a few simple questions, and I’m done.”

If it feels complex → it is wrong.
