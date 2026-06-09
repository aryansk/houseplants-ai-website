// Shared site helpers: nav, footer, data loading, reveal animations
(function () {
  const NAV = `
    <header style="position:fixed;top:0;inset-inline:0;z-index:40">
      <div style="max-width:72rem;margin:1rem auto 0;padding:0 1rem">
        <div class="glass" style="border-radius:9999px;padding:.7rem 1.25rem;display:flex;align-items:center;justify-content:space-between">
          <a href="/" style="display:flex;align-items:center;gap:.5rem;font-weight:700;color:var(--cream);text-decoration:none">
            <img src="/assets/app-icon.png" style="width:28px;height:28px;border-radius:6px" alt="" />
            <span>HousePlants</span>
          </a>
          <nav class="nav-links" style="display:flex;align-items:center;gap:2rem;font-size:.875rem;font-weight:500;color:rgba(247,243,234,.7)">
            <a data-link="/catalog.html" href="/catalog.html">Catalog</a>
            <a data-link="/tools.html" href="/tools.html">Tools</a>
            <a data-link="/doctor.html" href="/doctor.html">Doctor</a>
            <a data-link="/toxicity.html" href="/toxicity.html">Toxicity</a>
          </nav>
          <a href="/download.html" class="btn btn-primary" style="padding:.5rem 1rem;font-size:.875rem">Download</a>
        </div>
      </div>
    </header>
    <style>
      .nav-links a{color:rgba(247,243,234,.7);text-decoration:none;transition:color .2s}
      .nav-links a:hover, .nav-links a.active{color:var(--cream)}
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
          <a href="/terms.html" style="color:inherit">Terms</a>
        </div>
        <p>© <span id="year"></span> HousePlants · Built with 🌿 by Aryan</p>
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
      if (location.pathname.endsWith(a.getAttribute('data-link'))) a.classList.add('active');
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
  window.plantImage = function (plant) {
    const n = (plant.common_name || '').toLowerCase();
    const g = (plant.genus || '').toLowerCase();
    for (const [key, src] of IMG_MAP) {
      if (n.includes(key) || g.includes(key)) return src;
    }
    return null;
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
