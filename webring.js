/**
 * Shared webring snippet for the tutorial ring.
 * Loads page order from webring-config.json next to this script.
 * Paths in the config are relative to the project root (this script's folder),
 * so links work when the site is hosted in a subdirectory (e.g. GitHub Pages).
 */
(function () {
  const scriptEl = document.currentScript;
  const rootUrl = new URL("./", scriptEl.src);
  const configUrl = new URL("webring-config.json", scriptEl.src).href;

  function normalizePath(pathname) {
    if (pathname.endsWith("/index.html")) {
      return pathname.slice(0, -"index.html".length);
    }
    if (pathname.endsWith("/")) {
      return pathname;
    }
    const lastSeg = pathname.slice(pathname.lastIndexOf("/") + 1);
    if (lastSeg.includes(".")) {
      return pathname.slice(0, pathname.lastIndexOf("/") + 1);
    }
    return pathname + "/";
  }

  /** Strip leading ./ or / so config paths resolve from the project root. */
  function rootRelativePath(path) {
    return String(path || "").replace(/^\.\//, "").replace(/^\//, "");
  }

  function absoluteSiteUrl(path) {
    return new URL(rootRelativePath(path), rootUrl);
  }

  /**
   * Href for nav links. Use a path from the domain root (including any GitHub Pages
   * subdirectory) so the browser replaces the location instead of appending under
   * the current lesson folder. Shadow DOM relative URLs are easy to resolve wrong.
   */
  function siteHref(path) {
    return absoluteSiteUrl(path).pathname;
  }

  function indexHref() {
    return normalizePath(rootUrl.pathname);
  }

  function currentPathPrefix() {
    return normalizePath(window.location.pathname);
  }

  function resolveSiteIndex(sites, current) {
    let best = -1;
    let bestLen = -1;
    for (let i = 0; i < sites.length; i++) {
      const p = normalizePath(absoluteSiteUrl(sites[i].path).pathname);
      const cur = current.endsWith("/") ? current : current + "/";
      if (cur.startsWith(p) && p.length > bestLen) {
        best = i;
        bestLen = p.length;
      }
    }
    if (best >= 0) return best;
    const byId = document.documentElement.getAttribute("data-webring-id");
    if (byId) {
      const idx = sites.findIndex((s) => s.id === byId);
      if (idx >= 0) return idx;
    }
    return -1;
  }

  const tpl = document.createElement("template");
  tpl.innerHTML = `
    <style>
      :host { display: block; font-family: system-ui, sans-serif; }
      .wrap {
        margin-top: 2.5rem;
        padding: 1rem 1.25rem;
        border: 1px solid #c5d4e8;
        border-radius: 10px;
        background: linear-gradient(180deg, #f4f7fc 0%, #eef3fb 100%);
        box-shadow: 0 1px 2px rgb(15 23 42 / 6%);
      }
      .title { font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; color: #64748b; margin: 0 0 0.5rem; }
      .row { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; align-items: center; justify-content: space-between; }
      a {
        color: #1d4ed8;
        text-decoration: none;
        font-weight: 600;
      }
      a:hover { text-decoration: underline; }
      .meta { font-size: 0.9rem; color: #334155; }
      .muted { color: #94a3b8; font-weight: 500; }
      .err { color: #b91c1c; font-size: 0.9rem; }
    </style>
    <div class="wrap" part="webring">
      <p class="title">Tutorial webring</p>
      <div class="row">
        <span class="meta" id="slot"></span>
        <span id="nav"></span>
      </div>
      <p class="err" id="err" hidden></p>
    </div>
  `;

  class TutorialWebring extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(tpl.content.cloneNode(true));

      const errEl = this.shadowRoot.getElementById("err");
      fetch(configUrl)
        .then((r) => {
          if (!r.ok) throw new Error("Could not load webring-config.json");
          return r.json();
        })
        .then((cfg) => {
          const sites = cfg.sites || [];
          const ringTitle = cfg.title || "Webring";
          this.shadowRoot.querySelector(".title").textContent = ringTitle;

          const cur = currentPathPrefix();
          const i = resolveSiteIndex(sites, cur);
          if (i < 0 || !sites.length) {
            errEl.hidden = false;
            errEl.textContent = "Webring config has no matching site for this page.";
            return;
          }

          const prev = sites[(i - 1 + sites.length) % sites.length];
          const next = sites[(i + 1) % sites.length];
          const here = sites[i];

          this.shadowRoot.getElementById("slot").innerHTML = `
            <strong>${here.label}</strong>
            <span class="muted"> · Step ${i + 1} of ${sites.length}</span>
          `;

          this.shadowRoot.getElementById("nav").innerHTML = `
            <a href="${siteHref(prev.path)}">← Previous</a>
            <span class="muted"> · </span>
            <a href="${indexHref()}">Index</a>
            <span class="muted"> · </span>
            <a href="${siteHref(next.path)}">Next →</a>
          `;
        })
        .catch((e) => {
          errEl.hidden = false;
          errEl.textContent = e.message || String(e);
        });
    }
  }

  customElements.define("tutorial-webring", TutorialWebring);
})();
