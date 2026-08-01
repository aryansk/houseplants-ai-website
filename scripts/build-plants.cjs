#!/usr/bin/env node
/*
 * Static-page generator.
 *
 * Reads assets/data/plants.json and writes one pre-rendered, SEO-friendly page
 * per plant into /plants/<slug>.html, then regenerates sitemap.xml to include
 * every static page. Run after editing the plant data:
 *
 *     node scripts/build-plants.cjs
 *
 * Care copy, slugs, and artwork come from assets/plant-info.js so the static
 * pages, the catalog, and plant.html all stay in lockstep.
 */
const fs = require('fs');
const path = require('path');
const PI = require('../assets/plant-info.js');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://houseplants-ai-website-1.vercel.app';
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/plants.json'), 'utf8'));
const plants = data.plants;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const bySlug = new Map(plants.map(p => [PI.slugify(p.common_name), p]));

function metaDescription(p) {
  const tox = /non/i.test(p.toxicity) ? 'pet-safe'
    : /toxic/i.test(p.toxicity) ? 'toxic to pets' : `${(p.toxicity || 'unverified').toLowerCase()} toxicity`;
  return `${p.common_name} (${p.genus}) care guide: ${(p.light_requirements || '').toLowerCase()} light, ` +
    `${(p.watering_needs || '').toLowerCase()} watering, ${(p.care_difficulty || '').toLowerCase()} to grow — ` +
    `${tox}. Light, water, temperature, repotting, and safety tips.`;
}

function faqLd(p) {
  const qa = [
    [`Is ${p.common_name} toxic to cats and dogs?`, PI.toxicityText(p.toxicity)],
    [`How much light does ${p.common_name} need?`, PI.lightTips(p.light_requirements)],
    [`How often should I water ${p.common_name}?`, PI.waterTips(p.watering_needs)],
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

function breadcrumbLd(p, slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Catalog', item: `${SITE}/catalog` },
      { '@type': 'ListItem', position: 2, name: p.common_name, item: `${SITE}/plants/${slug}` },
    ],
  };
}

function statCard(label, value) {
  return `<div class="glass" style="padding:1rem"><p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--leaf-300);font-weight:700">${esc(label)}</p><p style="font-weight:700;margin-top:.25rem">${esc(value || '—')}</p></div>`;
}

function careCard(title, body) {
  return `<div class="glass" style="padding:1.25rem"><h3 style="font-weight:700">${title}</h3><p style="color:rgba(17,17,17,.7);margin-top:.5rem;font-size:.9rem">${esc(body)}</p></div>`;
}

function relatedCards(p) {
  const related = plants
    .filter(x => x.id !== p.id && (x.genus === p.genus || x.care_difficulty === p.care_difficulty))
    .slice(0, 6);
  if (!related.length) return '';
  const cards = related.map(r => {
    const slug = PI.slugify(r.common_name);
    const img = PI.plantImage(r);
    const visual = img ? `<img src="${img}" alt="" loading="lazy" width="220" height="220" />` : PI.plantTile(r);
    return `<a href="/plants/${slug}" class="tilt" style="text-decoration:none;color:inherit;background:#ffffff;overflow:hidden;display:block">
      <div class="plant-thumb">${visual}</div>
      <div style="padding:.75rem"><p style="font-weight:700;font-size:.85rem;line-height:1.2">${esc(r.common_name)}</p></div>
    </a>`;
  }).join('');
  return `<section>
      <h2 class="font-display" style="font-size:2rem;font-weight:900">You may also like</h2>
      <div style="margin-top:1rem;display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${cards}</div>
    </section>`;
}

function page(p) {
  const slug = PI.slugify(p.common_name);
  const url = `${SITE}/plants/${slug}`;
  const desc = metaDescription(p);
  const img = PI.plantImage(p);
  const visual = img
    ? `<img src="${img}" alt="${esc(p.common_name)}" width="640" height="640" style="width:100%;height:100%;object-fit:cover" />`
    : PI.plantTile(p, '6rem');
  const cls = PI.toxClass(p.toxicity);
  const toxBadge = cls === 'toxic' ? '⚠ ' : cls === 'safe' ? '✓ ' : '';
  const ld = [faqLd(p), breadcrumbLd(p, slug)]
    .map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(p.common_name)} Care Guide · HousePlants</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(p.common_name)} Care Guide · HousePlants" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/assets/banner.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/assets/app-icon.png" />
<link rel="apple-touch-icon" href="/assets/app-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/styles.css" />
${ld}
</head>
<body>
<a href="#main" class="skip-link">Skip to content</a>
<div id="nav"></div>

<main id="main" style="max-width:64rem;margin:0 auto;padding:8rem 1.5rem 4rem">
  <nav aria-label="Breadcrumb" style="font-size:.875rem"><a href="/catalog" style="color:rgba(17,17,17,.6);text-decoration:none">← Back to catalog</a></nav>
  <div class="reveal in" style="margin-top:1rem;display:grid;grid-template-columns:1fr;gap:2.5rem">
    <div class="hero-grid" style="display:grid;grid-template-columns:1fr;gap:2.5rem">
      <div style="aspect-ratio:1/1;background:var(--leaf-800);overflow:hidden;position:relative">
        ${visual}
        <span class="tag ${cls}" style="position:absolute;top:1rem;left:1rem">${toxBadge}${esc(p.toxicity || 'Safety unknown')}</span>
      </div>
      <div>
        <p style="color:var(--leaf-300);font-weight:700;text-transform:uppercase;letter-spacing:.2em;font-size:.75rem">${esc(p.category || 'Plant')} · ${esc(p.care_difficulty || '')}</p>
        <h1 class="font-display" style="font-size:clamp(2.5rem,5vw,4rem);font-weight:900;margin:.5rem 0 0;line-height:1.05">${esc(p.common_name)}</h1>
        <p style="color:rgba(17,17,17,.6);font-style:italic;margin-top:.3rem">${esc(p.genus || '')}</p>
        <p style="color:rgba(17,17,17,.75);margin-top:1.5rem;line-height:1.6">${esc(PI.careText(p.care_difficulty))}</p>
        <div style="margin-top:1.5rem;display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem">
          ${statCard('Light', p.light_requirements)}
          ${statCard('Water', p.watering_needs)}
          ${statCard('Care level', p.care_difficulty)}
          ${statCard('Category', p.category)}
        </div>
        <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
          <a href="/water-calc?plant=${encodeURIComponent(p.common_name)}" class="btn btn-primary">💧 Watering plan</a>
          <a href="/doctor" class="btn btn-ghost">🩺 Diagnose</a>
        </div>
      </div>
    </div>

    <section>
      <h2 class="font-display" style="font-size:2rem;font-weight:900">Care guide</h2>
      <div style="margin-top:1rem;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
        ${careCard('☀ Light', PI.lightTips(p.light_requirements))}
        ${careCard('💧 Water', PI.waterTips(p.watering_needs))}
        ${careCard('🌡 Temperature', PI.tempText(p.category))}
        ${careCard('🪴 Repotting', 'Every 1–2 years, sizing up by one pot diameter. Refresh the soil annually to replenish nutrients.')}
        ${careCard('🐾 Safety', PI.toxicityText(p.toxicity))}
        ${careCard('🌱 Propagation', `Most members of ${p.genus || 'this genus'} propagate by stem cuttings or division. See the in-app Propagation Station for step-by-step guides.`)}
      </div>
    </section>

    ${relatedCards(p)}
  </div>
  <style>@media(min-width:768px){.hero-grid{grid-template-columns:1fr 1fr}}</style>
</main>

<div id="footer"></div>
<script src="/assets/plant-info.js"></script>
<script src="/assets/site.js"></script>
</body>
</html>
`;
}

// ---- write pages ----
const outDir = path.join(ROOT, 'plants');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
let n = 0;
for (const p of plants) {
  const slug = PI.slugify(p.common_name);
  fs.writeFileSync(path.join(outDir, `${slug}.html`), page(p));
  n++;
}

// ---- regenerate sitemap ----
const today = new Date().toISOString().slice(0, 10);
const staticPages = [
  ['/', '1.0'], ['/catalog', '0.9'], ['/tools', '0.9'], ['/doctor', '0.8'],
  ['/toxicity', '0.8'], ['/water-calc', '0.8'], ['/fertilizer', '0.8'],
  ['/story', '0.6'], ['/download', '0.7'], ['/privacy', '0.3'], ['/terms', '0.3'],
];
const urls = [
  ...staticPages.map(([loc, pr]) => `  <url><loc>${SITE}${loc}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`),
  ...plants.map(p => `  <url><loc>${SITE}/plants/${PI.slugify(p.common_name)}</loc><lastmod>${today}</lastmod><priority>0.5</priority></url>`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

console.log(`Generated ${n} plant pages + sitemap (${urls.length} urls).`);
