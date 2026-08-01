// Shared site helpers: nav, footer, app links, analytics, and plant data.
(function () {
  // Single source of truth for the App Store link. The app isn't live yet, so
  // this points at a placeholder — change it here once and every "Download"
  // button on the site (nav + any [data-app-store] link) updates.
  const APP_STORE_URL = 'https://apps.apple.com/us/app/houseplants-ai-indoor-jungle/id1234567890';

  const NAV = `
    <header class="ih-header">
      <div class="ih-header-inner">
          <a class="ih-brand" href="/" aria-label="HousePlants home">
            <img src="/assets/app-icon.png" alt="" />
            <span class="ih-brand-name">HousePlants <small>/ Indie House</small></span>
          </a>
          <span class="ih-header-note" aria-hidden="true">a small app from the studio →</span>
          <nav class="nav-links" id="site-navigation">
            <a data-link="/catalog" href="/catalog">Catalog</a>
            <a data-link="/tools" href="/tools">Tools</a>
            <a data-link="/doctor" href="/doctor">Doctor</a>
            <a data-link="/toxicity" href="/toxicity">Toxicity</a>
            <a data-link="/story" href="/story">Our Story</a>
            <a href="${APP_STORE_URL}" class="btn btn-primary">Get the app ↗</a>
          </nav>
          <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-navigation"><span></span><span></span></button>
      </div>
    </header>
  `;

  const FOOTER = `
    <footer class="ih-footer">
      <div class="ih-footer-crawl">HousePlants · made carefully at Indie House · water when the soil asks ·</div>
      <div class="ih-footer-inner">
        <div class="ih-footer-top">
          <div class="ih-footer-signoff">
            <strong>HousePlants</strong>
            <p>A calmer, smarter home for the plants sharing your rooms.</p>
            <em>built slowly. cared for obsessively.</em>
          </div>
          <nav class="ih-footer-links" aria-label="Footer">
            <a href="/">Home</a>
            <a href="/catalog">Plant catalog</a>
            <a href="/tools">Care tools</a>
            <a href="/doctor">Plant doctor</a>
            <a href="/toxicity">Toxicity checker</a>
            <a href="/water-calc">Water calculator</a>
            <a href="/story">Our story</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="mailto:hello@houseplants.ai">Say hello ↗</a>
          </nav>
        </div>
        <div class="ih-footer-bottom">
          <p>© <span id="year"></span> HousePlants · An Indie House app by Aryan Singh</p>
          <span class="ih-palette" aria-label="Indie House colors"><i style="background:var(--green)"></i><i style="background:var(--yellow)"></i><i style="background:var(--red)"></i><i style="background:var(--blue)"></i><i style="background:var(--pink)"></i></span>
        </div>
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
    // mark active link (works with and without Vercel cleanUrls stripping .html)
    const norm = p => p.replace(/\.html$/, '');
    const path = norm(location.pathname);
    document.querySelectorAll('.nav-links a[data-link]').forEach(a => {
      const link = norm(a.getAttribute('data-link'));
      if (path.endsWith(link)) {
        a.classList.add('active');
      } else if (link === '/tools' && (path.includes('/water-calc') || path.includes('/fertilizer'))) {
        a.classList.add('active');
      }
    });
    // mobile menu
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    }
  }

  // Point every App Store link (here and in page markup) at the one constant.
  function wireAppStoreLinks() {
    document.querySelectorAll('a[data-app-store]').forEach(a => { a.href = APP_STORE_URL; });
  }

  // Cookieless Vercel Web Analytics — no cookies, no cross-site tracking,
  // consistent with the site's "no tracking" promise. No-ops in local dev.
  function loadAnalytics() {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    const s = document.createElement('script');
    s.defer = true;
    s.src = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  }

  let _plantsPromise = null;
  window.loadPlants = function () {
    if (!_plantsPromise) {
      _plantsPromise = fetch('/assets/data/plants.json').then(r => r.json()).then(d => d.plants);
    }
    return _plantsPromise;
  };

  // Plant artwork + care-copy helpers live in plant-info.js (shared with the
  // static-page build script). On pages that include it they're available as
  // window.plantImage / window.plantTile / window.plantEmoji / window.PlantInfo.

  document.addEventListener('DOMContentLoaded', () => {
    injectChrome();
    wireAppStoreLinks();
    loadAnalytics();
  });
})();
