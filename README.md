# HousePlants — Marketing & Web Companion Site

This repository contains the marketing and web-companion website for the **HousePlants** iOS app. Designed with a Piet Mondrian / De Stijl aesthetic — primary-color blocks, black grid lines, and hard geometry — the site showcases the native application's features while providing fully functional web versions of its core care tools.

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

* **Typography**: Heavy geometric display headers ([Archivo Black](https://fonts.google.com/specimen/Archivo+Black)) paired with clean, highly readable body copy ([Inter](https://fonts.google.com/specimen/Inter)).
* **Color Palette**: Mondrian primaries on an off-white canvas — red (`#DD0100`), blue (`#0E4DA4`), yellow (`#FAC901`), and black (`#111111`) on `#FAF7F0`. No gradients; headline accents use hard color stops.
* **Composition**: Rectangles only (global `border-radius: 0`), 2px black frames on every panel, hard offset shadows (`6px 6px 0 #111`), and a signature red/white/blue/yellow color-bar strip under the navigation on every page.
* **Micro-Animations**: Reveal-on-scroll elements (`.reveal`) and framed cards that shift on hover with the offset shadow turning red.
* **3D Visuals**: Three interactive **Three.js** canvas backdrops that float flat De Stijl color panels around a spinning primary-red cube with black wireframe edges.

---

## ⚡ Architecture & Fallback Design

To maximize SEO performance and ensure compatibility with search index crawlers (like Googlebot) or users browsing with JavaScript disabled, the site utilizes a **hybrid hydration system**:
* **Static Fallbacks**: The initial HTML templates include pre-rendered mock previews of the database grids, symptom checklists, and calculator plans.
* **Hydration**: When the shared client controller ([site.js](assets/site.js)) loads:
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
