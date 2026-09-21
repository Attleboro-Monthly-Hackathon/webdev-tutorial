(function () {
  const app = document.getElementById("app");

  const views = {
    "/": {
      title: "Home",
      html:
        "<h2>Home view</h2><p>This content is injected by JavaScript. The URL hash stays in sync with what you see.</p>" +
        '<p><span class="pill">Tip</span> Use the back button; it moves through hash history.</p>',
    },
    "/about": {
      title: "About",
      html:
        "<h2>About this demo</h2><p>A single-page application keeps one document alive and updates sections in place. " +
        "Frameworks build on this idea; here it is plain DOM APIs.</p>",
    },
    "/data": {
      title: "Data",
      html:
        "<h2>Static data</h2><p>Even without a backend you can <code>fetch</code> JSON beside this file.</p>" +
        '<p><button type="button" id="load-local">Load lesson.json</button></p><pre id="data-out" class="code"></pre>',
    },
  };

  function normalizeHash() {
    const h = window.location.hash.replace(/^#/, "") || "/";
    return h.startsWith("/") ? h : "/" + h;
  }

  function render() {
    const path = normalizeHash();
    const view = views[path] || {
      title: "Not found",
      html: "<h2>Unknown route</h2><p>No view for <code>" + path + "</code>. Try <a href=\"#/\">home</a>.</p>",
    };
    app.innerHTML = view.html;
    document.title = "Step 20 — " + view.title;

    if (path === "/data") {
      const btn = document.getElementById("load-local");
      const out = document.getElementById("data-out");
      if (btn && out) {
        btn.addEventListener(
          "click",
          function () {
            out.textContent = "Loading…";
            fetch("lesson.json")
              .then(function (r) {
                if (!r.ok) throw new Error("HTTP " + r.status);
                return r.json();
              })
              .then(function (data) {
                out.textContent = JSON.stringify(data, null, 2);
              })
              .catch(function (e) {
                out.textContent = "Error: " + e.message;
              });
          },
          { once: true },
        );
      }
    }
  }

  window.addEventListener("hashchange", render);
  if (!window.location.hash) {
    window.location.hash = "#/";
  }
  render();
})();
