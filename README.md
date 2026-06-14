<h1 align="center">Khairuramdhani — Portfolio</h1>

<p align="center">
  <b>AI / ML &amp; Software Engineer</b><br>
  Computer Vision · Embedded Systems (C++) · Mobile (Flutter)<br>
  <sub>Computer Engineering · Universitas Brawijaya</sub>
</p>

<p align="center">
  <a href="https://github.com/khaichi11">GitHub</a> ·
  <a href="https://linkedin.com/in/khairuramdhani">LinkedIn</a> ·
  <a href="mailto:khairuramdhani@student.ub.ac.id">Email</a>
</p>

---

A fast, animated, single-page personal portfolio.
Built with plain **HTML + CSS + vanilla JavaScript** — no build step, no dependencies, no framework.
Scroll-reveal animations use the native `IntersectionObserver` API, so the whole site is static and instant to deploy.

> Live demo: _add your URL here after deploying._

## Features

- Light-minimal design — navy &amp; gold, bilingual EN / ID
- Fully responsive — adapts to desktop, tablet and mobile (hamburger menu, single-column layouts)
- Scroll-reveal animations, scroll-progress bar, animated stat counters
- Image lightbox for project documentation &amp; certificates
- Sticky blurred navbar with active-section highlighting
- SEO + Open Graph meta tags, SVG favicon
- Respects `prefers-reduced-motion`

## Sections

Hero · About · Skills · Experience (work · teaching · education · organizations) · Projects (6, each with a documentation gallery) · Certifications · Contact

## Built with

HTML5 · CSS3 (custom properties, grid, `clamp()`) · Vanilla JavaScript (`IntersectionObserver`) · Google Fonts (Poppins, Inter)

## Structure

```
portfolio/
├── index.html        # all content — edit text here
├── styles.css        # all styling — theme colors live in :root at the top
├── main.js           # scroll reveals, progress bar, lightbox, mobile nav
├── favicon.svg
├── vercel.json       # static deploy config (clean URLs + asset caching)
└── assets/           # images: profile, projects, documentation, certificates
```

## Run locally

No tooling required — just open `index.html` in a browser.
For relative paths to behave, serve it with any static server:

```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

## Deploy

### GitHub Pages
Repository **Settings → Pages → Deploy from a branch → `main` / root**.
Live at `https://khaichi11.github.io/Portfolio/`.

### Vercel
[vercel.com](https://vercel.com) → **Add New… → Project** → import the repo → Framework preset **Other**, output `./` → **Deploy**.
`vercel.json` handles clean URLs and asset caching. Every push auto-deploys.

## Editing

- **Text** — edit `index.html`; each section is clearly commented.
- **Theme / colors** — change the variables in `:root` at the top of `styles.css`.
- **Images** — drop files into `assets/` and update the matching `src`.
  Replace `assets/profile.jpg` to change the hero portrait.

## Author

**Khairuramdhani** — Computer Engineering student at Universitas Brawijaya.

- GitHub — [@khaichi11](https://github.com/khaichi11)
- LinkedIn — [khairuramdhani](https://linkedin.com/in/khairuramdhani)
- Email — [khairuramdhani@student.ub.ac.id](mailto:khairuramdhani@student.ub.ac.id)

## License

© 2026 Khairuramdhani. All rights reserved.
