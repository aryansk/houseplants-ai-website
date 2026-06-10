// Shared site helpers: nav, footer, data loading, reveal animations
(function () {
  const NAV = `
    <header style="position:fixed;top:0;inset-inline:0;z-index:40">
      <div style="max-width:72rem;margin:1rem auto 0;padding:0 1rem">
        <div class="glass" style="border-radius:9999px;padding:.7rem 1.25rem;display:flex;align-items:center;justify-content:space-between">
          <a href="/" style="display:flex;align-items:center;gap:.5rem;font-weight:700;color:var(--body-text);text-decoration:none">
            <img src="/assets/app-icon.png" style="width:28px;height:28px;border-radius:6px" alt="" />
            <span>HousePlants</span>
          </a>
          <nav class="nav-links" style="display:flex;align-items:center;gap:2rem;font-size:.875rem;font-weight:500;color:rgba(19,34,23,.7)">
            <a data-link="/catalog.html" href="/catalog.html">Catalog</a>
            <a data-link="/tools.html" href="/tools.html">Tools</a>
            <a data-link="/doctor.html" href="/doctor.html">Doctor</a>
            <a data-link="/toxicity.html" href="/toxicity.html">Toxicity</a>
          </nav>
          <a href="https://apps.apple.com/us/app/houseplants-ai-indoor-jungle/id1234567890" class="btn btn-primary" style="padding:.5rem 1rem;font-size:.875rem">Download</a>
        </div>
      </div>
    </header>
    <style>
      .nav-links a{color:rgba(19,34,23,.7);text-decoration:none;transition:color .2s}
      .nav-links a:hover, .nav-links a.active{color:var(--brand-blue)}
      @media (max-width: 720px){ .nav-links{display:none !important} }
    </style>
  `;

  const FOOTER = `
    <footer style="border-top:1px solid rgba(247,243,234,.1);padding:2.5rem 0;background:var(--leaf-900);margin-top:4rem">
      <div style="max-width:72rem;margin:0 auto;padding:0 1.5rem;display:flex;flex-direction:column;gap:1rem;align-items:center;justify-content:space-between;font-size:.875rem;color:rgba(247,243,234,.5)">
        <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center">
          <a href="/" style="color:inherit">Home</a> ·
          <a href="/catalog.html" style="color:inherit">Catalog</a> ·
          <a href="/tools.html" style="color:inherit">Tools</a> ·
          <a href="/doctor.html" style="color:inherit">Plant Doctor</a> ·
          <a href="/toxicity.html" style="color:inherit">Toxicity</a> ·
          <a href="/water-calc.html" style="color:inherit">Water Calc</a> ·
          <a href="/download.html" style="color:inherit">Download</a> ·
          <a href="/privacy.html" style="color:inherit">Privacy</a> ·
          <a href="/terms.html" style="color:inherit">Terms</a> ·
          <a href="mailto:hello@houseplants.ai" style="color:inherit">Contact</a>
        </div>
        <p>© <span id="year"></span> HousePlants · Indie iOS app by Aryan Singh</p>
      </div>
    </footer>
  `;

  function injectChrome() {
    const navHost = document.getElementById('nav');
    if (navHost) navHost.innerHTML = NAV;
    const footHost = document.getElementById('footer');
    if (footHost) footHost.innerHTML = FOOTER;
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();
    // mark active link
    document.querySelectorAll('.nav-links a').forEach(a => {
      const link = a.getAttribute('data-link');
      if (location.pathname.endsWith(link)) {
        a.classList.add('active');
      } else if (link === '/tools.html' && (location.pathname.includes('/water-calc') || location.pathname.includes('/fertilizer'))) {
        a.classList.add('active');
      }
    });
  }

  function setupReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }), { threshold: .15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  let _plantsPromise = null;
  window.loadPlants = function () {
    if (!_plantsPromise) {
      _plantsPromise = fetch('/assets/data/plants.json').then(r => r.json()).then(d => d.plants);
    }
    return _plantsPromise;
  };

  // Map a plant name keyword to a local botanical illustration if we have one
  const IMG_MAP = [
    ['monstera', '/assets/plants/monstera.png'],
    ['philodendron', '/assets/plants/philodendron.png'],
    ['anthurium', '/assets/plants/anthurium.png'],
    ['snake plant', '/assets/plants/snake_plant.png'],
    ['sansevieria', '/assets/plants/snake_plant.png'],
    ['dracaena trifasciata', '/assets/plants/snake_plant.png'],
    ['pothos', '/assets/plants/pothos.png'],
    ['epipremnum', '/assets/plants/pothos.png'],
    ['alocasia', '/assets/plants/alocasia.png'],
  ];

  const UNSPLASH_POOL = {
    cactus: [
      'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521458401476-78957159ae0b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509587524206-f30419e1e1f8?w=600&auto=format&fit=crop&q=80'
    ],
    fern: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580974511812-4b7196c56830?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80'
    ],
    palm: [
      'https://images.unsplash.com/photo-1501747315-124a0eaca060?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525498128493-380d12906ef5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80'
    ],
    flower: [
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508780709619-79562169bc64?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494707924440-293d36091443?w=600&auto=format&fit=crop&q=80'
    ],
    succulent: [
      'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=600&auto=format&fit=crop&q=80'
    ],
    tree: [
      'https://images.unsplash.com/photo-1512428813833-df70f77a5236?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597055142663-f472251a37c3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598880940375-d4e511674403?w=600&auto=format&fit=crop&q=80'
    ],
    calathea: [
      'https://images.unsplash.com/photo-1610991148415-e0d0246a4897?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&auto=format&fit=crop&q=80'
    ],
    bromeliad: [
      'https://images.unsplash.com/photo-1508022833827-98555475918d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
    ],
    general: [
      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517573801209-62204853e9a2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526333699007-ee60224b7933?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584447128309-b66b7a4f1b63?w=600&auto=format&fit=crop&q=80'
    ]
  };

  window.plantImage = function (plant) {
    const n = (plant.common_name || '').toLowerCase();
    const g = (plant.genus || '').toLowerCase();
    for (const [key, src] of IMG_MAP) {
      if (n.includes(key) || g.includes(key)) return src;
    }

    // Classify by category/genus
    let cat = 'general';
    if (/cact|opuntia|euphorb|cereus|mammillaria|echinocactus|rebutia|cleistocactus|lophophora|gymnocalycium/.test(n) || /cact|opuntia|euphorb|cereus|mammillaria|echinocactus|rebutia|cleistocactus|lophophora|gymnocalycium/.test(g)) {
      cat = 'cactus';
    } else if (/fern|nephrolepis|adiantum|platycerium|asplenium|athyrium|pteris|polystichum/.test(n) || /fern|nephrolepis|adiantum|platycerium|asplenium|athyrium|pteris|polystichum/.test(g)) {
      cat = 'fern';
    } else if (/palm|areca|chamaedorea|dypsis|howea|caryota|phoenix|ravenea|licuala/.test(n) || /palm|areca|chamaedorea|dypsis|howea|caryota|phoenix|ravenea|licuala/.test(g)) {
      cat = 'palm';
    } else if (/orchid|rose|lily|hibiscus|chrysanth|bougain|petun|anthurium|spathiphyllum|begonia|cyclamen|geranium|jasmine|gardenia|streptocarpus|african violet/.test(n) || /orchid|rose|lily|hibiscus|chrysanth|bougain|petun|anthurium|spathiphyllum|begonia|cyclamen|geranium|jasmine|gardenia|streptocarpus|african violet/.test(g)) {
      cat = 'flower';
    } else if (/succulent|echeveria|haworthia|crassula|aloe|sedum|sempervivum|agave|kalanchoe|senecio|cotyledon|aonium|graptopetalum|pachyphytum/.test(n) || /succulent|echeveria|haworthia|crassula|aloe|sedum|sempervivum|agave|kalanchoe|senecio|cotyledon|aonium|graptopetalum|pachyphytum/.test(g)) {
      cat = 'succulent';
    } else if (/tree|ficus|bonsai|schefflera|pachira|citrus|coffea|dracaena|beaucarnea|cupressus|juniperus|pinus|acer/.test(n) || /tree|ficus|bonsai|schefflera|pachira|citrus|coffea|dracaena|beaucarnea|cupressus|juniperus|pinus|acer/.test(g)) {
      cat = 'tree';
    } else if (/calathea|goeppertia|maranta|ctenanthe|stromanthe/.test(n) || /calathea|goeppertia|maranta|ctenanthe|stromanthe/.test(g)) {
      cat = 'calathea';
    } else if (/bromeliad|tillandsia|guzmania|vriesea|aechmea|neoregelia/.test(n) || /bromeliad|tillandsia|guzmania|vriesea|aechmea|neoregelia/.test(g)) {
      cat = 'bromeliad';
    }

    const list = UNSPLASH_POOL[cat];
    const idx = (plant.id || 0) % list.length;
    return list[idx];
  };

  window.plantEmoji = function (plant) {
    const n = (plant.common_name || '').toLowerCase();
    if (/cact|opuntia|euphorb/.test(n)) return '🌵';
    if (/fern|nephrolepis|adiantum/.test(n)) return '🪶';
    if (/palm|areca|chamaedor/.test(n)) return '🌴';
    if (/orchid|rose|lily|hibiscus|chrysanth|bougain|petun/.test(n)) return '🌸';
    if (/succulent|echeveria|haworth|crassula|aloe|sedum/.test(n)) return '🌿';
    if (/tree|ficus|bonsai/.test(n)) return '🌳';
    return '🪴';
  };

  document.addEventListener('DOMContentLoaded', () => {
    injectChrome();
    setupReveal();
  });
})();
