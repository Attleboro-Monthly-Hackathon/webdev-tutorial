Access the website here: https://attleboro-monthly-hackathon.github.io/webdev-tutorial/

# Web dev tutorial webring

Twenty-three separate static “sites” (folders) that teach the web in order: from absolute beginner context (files, text editors, DevTools) through a minimal single-page application served as plain files.

## Run locally

```bash
cd web-dev-tutorial-webring
python3 -m http.server 8080
```

Open `http://localhost:8080/` for the index, or jump to `http://localhost:8080/step-intro/`.

## Ring configuration

- **`webring-config.json`** — ordered list of sites (`id`, `path`, `label`). Edit this to rename lessons or reorder the ring.
- **`webring.js`** — shared snippet: defines the `<tutorial-webring>` custom element, loads the JSON, renders previous / index / next links.

Each lesson HTML file includes the same tail:

```html
<tutorial-webring></tutorial-webring>
<script src="../webring.js"></script>
```

Paths like `/shared.css` and `/webring.js` assume the server root is this directory (the default for `python3 -m http.server` when run from here).

Every lesson also ends with a dashed **`#lesson-demo`** region and short instructions to practice Chrome’s **Inspect** / Elements panel on that demo.

## Layout

| Path | Topic |
| --- | --- |
| `step-intro` | Introduction: files, folders, text editors vs word processors, browsers |
| `step-devtools` | DevTools: Elements, Console, Network; live style tweaks |
| `step-html-primer` | HTML concepts + links to MDN, WHATWG, web.dev, DevTools docs |
| `step-01` | Minimal HTML |
| `step-02` | Headings |
| `step-03` | Links |
| `step-04` | Images + SVG asset |
| `step-05` | Lists |
| `step-06` | Semantic regions |
| `step-07` | Inline styles |
| `step-08` | External CSS |
| `step-09` | Classes / IDs |
| `step-10` | Box model |
| `step-11` | Flexbox |
| `step-12` | Grid |
| `step-13` | Forms |
| `step-14` | First JS |
| `step-15` | DOM updates |
| `step-16` | Events |
| `step-17` | `fetch` + JSON |
| `step-18` | `localStorage` |
| `step-19` | ES modules |
| `step-20` | Hash-routed SPA + JSON |
