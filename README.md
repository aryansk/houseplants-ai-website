# HousePlants — Marketing & Web Companion Site

This repository contains the marketing and web-companion website for the **HousePlants** iOS app. It uses the **Indie House** visual language — warm paper, navy ink, bright room colors, editorial type, handwritten notes, and tactile cut-paper details — while providing fully functional web versions of the app's core care tools.

---

## 🌿 Core Concept

HousePlants bridges premium botanical editorial design with calibrated horticultural utility. Key features highlighted on the site:
* **Comprehensive Reference Library**: A searchable database containing 727 species with custom classification tags.
* **12 Calibrated Pro Tools**: A complete suite of horticultural instruments including AR Sun Seeker, NPK Fertilizer Doser, and Moon Gardening.
* **Offline-First**: Zero tracking, zero account requirement, fully functional offline.

---

## 🛠 Web Companion Tools

The site includes fully interactive, client-side versions of four core companion tools:
1. **[Plant Doctor](doctor.html)**: A symptom-based diagnostic wizard that analyzes leaf discoloration, structural droop, and pest markers to yield probabilistic causes and actionable fixes.
2. **[Water Calculator](water-calc.html)**: Generates a custom 4-week watering plan based on pot size, light levels, season, and plant genus.
3. **[Fertilizer Calculator](fertilizer.html)**: Calibrates exact liquid dilution ratios or solid granular weights using customized NPK ratios.
4. **[Toxicity Checker](toxicity.html)**: A quick pet & child safety lookup index covering all 727 species.

---

## 🎨 Design System & Aesthetics

* **Typography**: Editorial [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), highly readable [Inter](https://fonts.google.com/specimen/Inter), and [Caveat](https://fonts.google.com/specimen/Caveat) for the studio's handwritten annotations.
* **Color Palette**: The Indie House palette — paper (`#f5eddc`), navy ink (`#17213b`), green (`#2a9d54`), yellow (`#f5c518`), red (`#e5372b`), blue (`#1e3ad6`), orange (`#f0941f`), and pink (`#ff92b6`).
* **Composition**: Warm grid paper, 2px navy frames, hard offset shadows, lightly rotated cards, cut labels, colored “rooms,” and the same full-width studio chrome used on Indie House.
* **Micro-Animations**: Lightweight CSS marquee, phone-float, and card-hover effects with a reduced-motion fallback.
* **Rendering**: Below-fold homepage rooms use `content-visibility`, while decorative motion stays CSS-only to avoid a 3D runtime and continuous WebGL work.

---

## ⚡ Architecture & Fallback Design

To maximize SEO performance and ensure compatibility with search index crawlers (like Googlebot) or users browsing with JavaScript disabled, the site utilizes a **hybrid hydration system**:
* **Static Fallbacks**: The initial HTML templates include pre-rendered mock previews of the database grids, symptom checklists, and calculator plans.
* **Shared runtime**: When the small shared client controller ([site.js](assets/site.js)) loads:
  1. It injects the standard navbar and unified professional footer across pages.
  2. It fetches the static plant database (`plants.json`) and replaces the mock fallbacks with fully interactive elements.
* **SEO Best Practices**: Proper title tags, absolute Open Graph metadata (configured with absolute vercel banners), and JSON-LD schema markup (`SoftwareApplication`) are embedded natively.

---

## 💻 Local Preview & Development

The site ships as static HTML. Tailwind is compiled once during development instead of running in visitors' browsers, and the plant generator pre-renders every detail page.

Install dependencies and rebuild generated assets after changing homepage utility classes or plant data:

```bash
npm install
npm run build
```

To launch a local web server:
```bash
# Using NodeJS
npx serve .

# Using Python
python3 -m http.server 8000
```
Then navigate to `http://localhost:3000` (or `http://localhost:8000`).

---

## 🚀 Deployment

The repository is pre-configured for instant zero-config deployments:
* **Vercel**: Use `npm run build` as the build command and `.` as the output directory.
* **Netlify / Cloudflare Pages**: Use `npm run build` as the build command and publish `/` or `.`.
