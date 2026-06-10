# HousePlants — Marketing & Web Companion Site

This repository contains the marketing and web-companion website for the **HousePlants** iOS app. Designed with a premium editorial aesthetic reminiscent of a coffee table book, the site showcases the native application's features while providing fully functional web versions of its core care tools.

---

## 🌿 Core Concept

HousePlants bridges premium botanical editorial design with calibrated horticultural utility. Key features highlighted on the site:
* **Comprehensive Reference Library**: A searchable database containing 727 species with custom classification tags.
* **12 Calibrated Pro Tools**: A complete suite of horticultural instruments including AR Sun Seeker, NPK Fertilizer Doser, and Moon Gardening.
* **Offline-First**: Zero tracking, zero account requirement, fully functional offline.

---

## 🛠 Web Companion Tools

The site includes fully interactive, client-side versions of four core companion tools:
1. **[Plant Doctor](file:///Users/aryansingh/Downloads/Projects/houseplants-ai-website-1/doctor.html)**: A symptom-based diagnostic wizard that analyzes leaf discoloration, structural droop, and pest markers to yield probabilistic causes and actionable fixes.
2. **[Water Calculator](file:///Users/aryansingh/Downloads/Projects/houseplants-ai-website-1/water-calc.html)**: Generates a custom 4-week watering plan based on pot size, light levels, season, and plant genus.
3. **[Fertilizer Calculator](file:///Users/aryansingh/Downloads/Projects/houseplants-ai-website-1/fertilizer.html)**: Calibrates exact liquid dilution ratios or solid granular weights using customized NPK ratios.
4. **[Toxicity Checker](file:///Users/aryansingh/Downloads/Projects/houseplants-ai-website-1/toxicity.html)**: A quick pet & child safety lookup index covering all 727 species.

---

## 🎨 Design System & Aesthetics

* **Typography**: Structured around high-contrast display serif headers ([Fraunces](https://fonts.google.com/specimen/Fraunces)) paired with clean, highly readable body copy ([Inter](https://fonts.google.com/specimen/Inter)).
* **Color Palette**: An elegant, low-contrast HSL theme utilizing dark woodland greens (`--leaf-900: #0f2a18`), vibrant mint accents (`--leaf-400: #5cb771`), and soft parchment creams (`--cream: #f7f3ea`).
* **Micro-Animations**: Features custom reveal-on-scroll elements (`.reveal`), perspective-shifting card tilts on hover (`.tilt`), and floating phone mockups.
* **3D Visuals**: Three distinct interactive canvas backdrops built using native **Three.js** that simulate light scattering on organic leaf meshes and float floating glass-like central orbs.

---

## ⚡ Architecture & Fallback Design

To maximize SEO performance and ensure compatibility with search index crawlers (like Googlebot) or users browsing with JavaScript disabled, the site utilizes a **hybrid hydration system**:
* **Static Fallbacks**: The initial HTML templates include pre-rendered mock previews of the database grids, symptom checklists, and calculator plans.
* **Hydration**: When the shared client controller ([site.js](file:///Users/aryansingh/Downloads/Projects/houseplants-ai-website-1/assets/site.js)) loads:
  1. It injects the standard navbar and unified professional footer across pages.
  2. It fetches the static plant database (`plants.json`) and replaces the mock fallbacks with fully interactive elements.
* **SEO Best Practices**: Proper title tags, absolute Open Graph metadata (configured with absolute vercel banners), and JSON-LD schema markup (`SoftwareApplication`) are embedded natively.

---

## 💻 Local Preview & Development

The site is built using pure static HTML and CSS variables (with Tailwind config utility variables for structural layout). There is no complex compiler or build step required.

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
* **Vercel**: Run `vercel` from the root directory or import via the Vercel dashboard.
* **Netlify / Cloudflare Pages**: Connect the repository, set the build command to empty, and point the publish directory to `/` or `.`.
