// Shared plant helpers — usable in the browser (window.PlantInfo + legacy globals)
// and in Node (module.exports), so catalog.html, plant.html, and the static-page
// build script all derive care copy, slugs, and artwork from one source of truth.
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.PlantInfo = api;
    // Legacy globals kept so existing inline scripts keep working unchanged.
    root.plantImage = api.plantImage;
    root.plantTile = api.plantTile;
    root.plantEmoji = api.plantEmoji;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  // URL-safe slug from a common name, e.g. "Monstera Deliciosa" → "monstera-deliciosa"
  function slugify(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ---- Care copy. Heuristic keyword matching so every value in the dataset
  // (Easy/Medium, Medium/Hard, Low to Bright, High (Distilled), …) gets real
  // copy instead of falling through to a generic fallback. ----

  function careText(level) {
    const s = String(level || '').toLowerCase();
    if (s.includes('hard') && s.includes('medium')) return 'Needs a steady routine and the right spot — manageable once dialed in, but unforgiving of neglect.';
    if (s.includes('hard')) return 'Demands a calibrated environment — stable humidity, light, and watering. Best for experienced growers.';
    if (s.includes('easy') && s.includes('medium')) return 'Forgiving most of the time, with a few preferences worth respecting. A good step up from a beginner plant.';
    if (s.includes('medium')) return 'Rewards consistent attention. Keep its light and watering steady and it will thrive.';
    if (s.includes('easy')) return 'Tolerant and forgiving — great for beginners and easy to keep alive.';
    return 'A rewarding plant for committed growers.';
  }

  function lightTips(level) {
    const s = String(level || '').toLowerCase();
    if (s === 'any') return 'Adaptable — does well in anything from low light to bright indirect. Avoid harsh, all-day direct sun.';
    if (s.includes('very low')) return 'Tolerates dim corners and north-facing rooms. Keep it well away from direct sun.';
    if (s.includes('shade')) return 'Prefers shade or filtered light. An interior spot or north window suits it.';
    if (s.includes('full sun') || s.includes('direct')) return 'Wants strong light — a south or west window, or 6+ hours of direct sun. Acclimate gradually to avoid scorch.';
    if (s.includes('low to bright') || (s.includes('low') && s.includes('bright'))) return 'Flexible: happiest in bright indirect light but copes with lower light, just slower-growing.';
    if (s.includes('low') && s.includes('medium')) return 'Low-to-medium light is ideal — a few feet back from a window, out of direct sun.';
    if (s.includes('medium')) return 'Medium, indirect light — near but not in a bright window.';
    if (s.includes('bright')) return 'Bright, indirect light. An east or west window with sheer cover is ideal; no harsh midday sun.';
    return 'Place where light matches the species — most foliage plants want bright, indirect light.';
  }

  function waterTips(level) {
    const s = String(level || '').toLowerCase();
    if (s.includes('distilled')) return 'Sensitive to minerals — use distilled, filtered, or rainwater. Keep the mix evenly moist, never soggy.';
    if (s.includes('tank')) return 'Water into the central cup/tank and keep it topped up; let the potting mix dry between waterings.';
    if (s.includes('mist') || s.includes('soak')) return 'Mist or soak regularly — these like high moisture at the roots and in the air.';
    if (s.includes('humid') || s.includes('moist')) return 'Keep the soil consistently moist and humidity high. Check every 2–3 days.';
    if (s.includes('very low')) return 'Water sparingly — let the soil dry out completely, then a little more. Overwatering is the main risk.';
    if (s.includes('dry out') || (s.includes('low') && s.includes('bark'))) return 'Let the mix dry out fully between waterings. When in doubt, wait a day.';
    if (s.includes('high')) return 'Keep evenly moist — check the top inch every few days and don\'t let it dry out fully.';
    if (s.includes('moderate')) return 'Let the top inch of soil dry between waterings — typically about once a week.';
    if (s.includes('low')) return 'Water sparingly; let most of the pot dry before watering again.';
    return 'Check the soil before watering — push a finger an inch in and water only when it\'s dry.';
  }

  function tempText(category) {
    const c = String(category || '').toLowerCase();
    if (c === 'outdoor') return 'Happiest outdoors in its hardiness range. Bring under cover before the first frost in cold climates.';
    if (c === 'both') return 'Comfortable indoors or out between roughly 15–29 °C. Move it inside before frost and away from cold drafts.';
    return 'Prefers a steady 18–27 °C. Keep it away from cold drafts, radiators, and exterior glass on winter nights.';
  }

  function toxicityText(toxicity) {
    const t = String(toxicity || '').toLowerCase();
    if (t.includes('non')) return 'Generally considered safe around cats, dogs, and children — though no plant should be eaten. A safe pick for pet households.';
    if (t === 'low') return 'Low toxicity — mild stomach upset is possible if eaten, but it\'s not considered dangerous. Still best kept out of reach of curious pets.';
    if (t.includes('varies')) return 'Toxicity varies within this group — confirm your exact species with the ASPCA or a vet before trusting pets and children around it.';
    if (t.includes('toxic')) return 'Toxic if ingested — keep it away from cats, dogs, and small children. Sap and leaves can irritate skin and mouths.';
    return 'Toxicity isn\'t well documented for this one — treat it as potentially harmful and keep pets and children from chewing it.';
  }

  // Classify toxicity into a tag style: 'toxic' | 'safe' | '' (neutral)
  function toxClass(toxicity) {
    const t = String(toxicity || '').toLowerCase();
    if (t.includes('non')) return 'safe';
    if (t.includes('toxic')) return 'toxic';
    return '';
  }

  // ---- Artwork ----

  // Local botanical illustrations, reserved for the exact species they depict.
  const IMG_MAP = [
    ['monstera deliciosa', '/assets/plants/monstera.png'],
    ['philodendron hederaceum', '/assets/plants/philodendron.png'],
    ['heartleaf', '/assets/plants/philodendron.png'],
    ['anthurium andraeanum', '/assets/plants/anthurium.png'],
    ['laurentii', '/assets/plants/snake_plant.png'],
    ['aureum (golden)', '/assets/plants/pothos.png'],
    ['amazonica (polly)', '/assets/plants/alocasia.png'],
  ];

  function plantImage(plant) {
    const n = (plant.common_name || '').toLowerCase();
    for (const [key, src] of IMG_MAP) {
      if (n.includes(key)) return src;
    }
    return null;
  }

  function plantEmoji(plant) {
    const n = (plant.common_name || '').toLowerCase();
    if (/cact|opuntia|euphorb/.test(n)) return '🌵';
    if (/fern|nephrolepis|adiantum/.test(n)) return '🪶';
    if (/palm|areca|chamaedor/.test(n)) return '🌴';
    if (/orchid|rose|lily|hibiscus|chrysanth|bougain|petun/.test(n)) return '🌸';
    if (/succulent|echeveria|haworth|crassula|aloe|sedum/.test(n)) return '🌿';
    if (/tree|ficus|bonsai/.test(n)) return '🌳';
    return '🪴';
  }

  // Generated cut-paper tile: a small seeded Indie House composition so plants
  // without a real illustration each get unique, on-brand artwork.
  function plantTile(plant, emojiSize) {
    const id = Math.abs(plant.id || 0);
    const L = [
      { c: '2fr 1fr', r: '1fr 2fr', emoji: 0 },
      { c: '1fr 2fr', r: '2fr 1fr', emoji: 3 },
      { c: '3fr 2fr', r: '2fr 1fr', emoji: 1 },
      { c: '1fr 1fr', r: '2fr 1fr', emoji: 2 },
      { c: '2fr 3fr', r: '3fr 2fr', emoji: 0 },
      { c: '3fr 1fr', r: '1fr 1fr', emoji: 0 },
    ][id % 6];
    const PERMS = [
      ['#e5372b', '#f5c518', '#1e3ad6'],
      ['#1e3ad6', '#ff92b6', '#2a9d54'],
      ['#f5c518', '#1e3ad6', '#fffaf0'],
      ['#fffaf0', '#e5372b', '#ff92b6'],
      ['#f0941f', '#fffaf0', '#2a9d54'],
      ['#1e3ad6', '#e5372b', '#f5c518'],
      ['#ff92b6', '#fffaf0', '#2a9d54'],
    ];
    const colors = PERMS[id % 7];
    let ci = 0;
    const cells = [0, 1, 2, 3].map(i =>
      i === L.emoji
        ? `<div style="background:#fff;display:grid;place-items:center;font-size:${emojiSize || '2rem'}">${plantEmoji(plant)}</div>`
        : `<div style="background:${colors[ci++]}"></div>`
    ).join('');
    return `<div aria-hidden="true" style="width:100%;height:100%;display:grid;grid-template-columns:${L.c};grid-template-rows:${L.r};gap:3px;background:#17213b">${cells}</div>`;
  }

  return {
    slugify, careText, lightTips, waterTips, tempText, toxicityText, toxClass,
    plantImage, plantEmoji, plantTile,
  };
});
