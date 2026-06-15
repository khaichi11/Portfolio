/* Khairuramdhani — Portfolio interactions */
(function () {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(hover: none)").matches || "ontouchstart" in window;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress + nav state ---------- */
  const nav = document.getElementById("nav");
  const bar = document.getElementById("progress-bar");
  function onScroll() {
    const st = window.scrollY || document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("scrolled", st > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Per-image explanations for flip-card backs ---------- */
  const DESC = {
    // CERDAS
    "cerdas-down.jpg": "Head tilted down — flagged as a cheating indication.",
    "cerdas-front.jpg": "Facing forward — detected as honest, no warning.",
    "cerdas-left.jpg": "Head turned left — flagged as a violation.",
    "cerdas-right.jpg": "Head turned right — flagged as a violation.",
    "cerdas-confusion.png": "Per-class accuracy across the 6 head-orientation classes.",
    // FishFeed
    "fishfeed-circuit.png": "Breadboard wiring of the ESP32, sensors and RTC.",
    "fishfeed-3d.png": "Enclosure & feeder modelled in Fusion 360 for 3D printing.",
    "fishfeed-assembled.png": "The final feeder in its 3D-printed housing.",
    "fishfeed-app.png": "Flutter app: water status & feeding schedule via Firebase.",
    // Arrhythmia
    "arrhythmia-classdist.png": "Balance of Normal vs Arrhythmia samples.",
    "arrhythmia-scatter.png": "R-R interval vs QRS duration — class separation.",
    "arrhythmia-report.png": "Precision, recall, F1 — 96% accuracy on the test set.",
    "arrhythmia-confusion.png": "Correct vs misclassified SVM predictions.",
    // Buah-Seru
    "buahseru-welcome.png": "Snap a fruit to start the quiz.",
    "buahseru-quiz.png": "Pick the correct fruit from the options.",
    "buahseru-result.png": "Shows the answer with fun nutrition facts.",
    // K-Means
    "kmeans-dataset.png": "Building the waste-sorting dataset in the notebook.",
    "kmeans-algo.png": "K-Means written from scratch — no scikit-learn.",
    "kmeans-jan.png": "Clusters discovered in the January data.",
    "kmeans-feb.png": "Clusters discovered in the February data.",
    // PANDAI
    "pandai-nav.png": "Home, settings and profile — the main navigation.",
    "pandai-scan.png": "Scanning a real plant with the camera.",
    "pandai-result.png": "Real-time identification result for the plant.",
    "pandai-collection.png": "Saved plant collection with detail & description.",
    // Certifications
    "cert-udemy.png": "44-hour bootcamp on AI, ML and data science.",
    "cert-dicoding-ai.png": "Fundamentals of artificial intelligence.",
    "cert-dicoding-viz.png": "Fundamentals of data visualization.",
    "cert-ta-basicprog.png": "Teaching-assistant certificate — Basic Programming.",
    "cert-ta-dsa.png": "Teaching-assistant certificate — Data Structures & Algorithms."
  };

  const esc = (s) => (s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const fileOf = (img) => (img.getAttribute("src") || "").split("/").pop();

  /* ---------- Flip cards (documentation + certificates) ---------- */
  function buildFlips() {
    document.querySelectorAll(".doc").forEach((fig) => {
      const img = fig.querySelector("img");
      if (!img) return;
      const cap = fig.querySelector("figcaption");
      const title = (cap ? cap.textContent : img.alt || "").trim();
      const desc = DESC[fileOf(img)] || "";
      fig.classList.add("flip");
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", title + (desc ? " — " + desc : ""));
      fig.innerHTML =
        '<div class="flip__inner">' +
        '<div class="flip__face flip__front"><img src="' + img.getAttribute("src") + '" alt="' + esc(img.alt) + '" loading="lazy"></div>' +
        '<div class="flip__face flip__back"><strong>' + esc(title) + "</strong>" + (desc ? "<span>" + esc(desc) + "</span>" : "") + "</div>" +
        "</div>";
    });

    document.querySelectorAll(".cert").forEach((fig) => {
      const img = fig.querySelector("img");
      if (!img) return;
      const strong = fig.querySelector("figcaption strong");
      const span = fig.querySelector("figcaption span");
      const title = (strong ? strong.textContent : "").trim();
      const issuer = (span ? span.textContent : "").trim();
      const desc = DESC[fileOf(img)] || "";
      fig.classList.add("flip", "flip--cert");
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", title + (issuer ? " — " + issuer : ""));
      fig.innerHTML =
        '<div class="flip__inner">' +
        '<div class="flip__face flip__front"><img src="' + img.getAttribute("src") + '" alt="' + esc(img.alt) + '" loading="lazy"></div>' +
        '<div class="flip__face flip__back"><strong>' + esc(title) + "</strong>" +
        (issuer ? '<span class="issuer">' + esc(issuer) + "</span>" : "") +
        (desc ? "<span>" + esc(desc) + "</span>" : "") + "</div>" +
        "</div>";
    });

    document.querySelectorAll(".flip").forEach((f) => {
      if (isTouch) f.addEventListener("click", () => f.classList.toggle("flipped"));
      f.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f.classList.toggle("flipped"); }
      });
    });
  }
  buildFlips();

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Replay on every entry (not one-shot) so animations re-fire when you scroll back.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const d = parseInt(e.target.dataset.delay, 10);
        if (e.isIntersecting) {
          e.target.style.transitionDelay = d ? d * 80 + "ms" : "0ms";
          e.target.classList.add("is-visible");
        } else {
          e.target.style.transitionDelay = "0ms";
          e.target.classList.remove("is-visible");
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Stat count-up ---------- */
  const nums = document.querySelectorAll(".stat__num[data-count]");
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    const dur = 1100, start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  if ("IntersectionObserver" in window && nums.length) {
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach((n) => cio.observe(n));
  } else {
    nums.forEach((n) => (n.textContent = n.dataset.count));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = Array.from(document.querySelectorAll(".nav__links a[href^='#']"));
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => sio.observe(s));
  }

  /* ---------- Mobile nav ---------- */
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ---------- 3D tilt on hover ---------- */
  if (!isTouch && !reduceMotion) {
    function tilt(el, max) {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateX(" + (-py * max) + "deg) rotateY(" + (px * max) + "deg)";
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    }
    document.querySelectorAll(".project__hero").forEach((el) => tilt(el, 6));
    const hp = document.querySelector(".hero__photo");
    if (hp) tilt(hp, 8);
  }

  /* ---------- Lightbox (project heroes + teaching photo) ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbClose = document.getElementById("lightbox-close");
  function openLb(src, alt) {
    if (!lb) return;
    lbImg.src = src; lbImg.alt = alt || "";
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => { lbImg.src = ""; }, 300);
  }
  document.querySelectorAll(".project__hero img, .exp__photo img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLb(img.getAttribute("src"), img.alt));
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lb) lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

  /* ---------- Print / PDF (manual Ctrl+P, or secret ?print / #print shortcut) ---------- */
  function preparePrint() {
    document.querySelectorAll("img[loading]").forEach((i) => (i.loading = "eager"));
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible"));
    document.querySelectorAll(".stat__num[data-count]").forEach((n) => (n.textContent = n.dataset.count));
  }
  window.addEventListener("beforeprint", preparePrint);
  if (location.search.indexOf("print") > -1 || location.hash.indexOf("print") > -1) {
    preparePrint();
    window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 900); });
  }
  // CV print is intentionally private (no public button) — open with ?print or #print.

  /* ---------- Contact form → Google Sheet (Apps Script) ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    // Tempel "Web app URL" dari Apps Script kamu (…/exec). Setup: CONTACT_FORM_SETUP.md
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6dywT_dtBwSy4Xn5XJJpWpdNkfHzFIZvr_2AvxeQPW16eizmTgt9_uMQBNiBM4z6IIA/exec";
    const statusEl = document.getElementById("form-status");
    const submitBtn = document.getElementById("form-submit");

    function setStatus(msg, kind) {
      statusEl.textContent = msg;
      statusEl.className = "form__status" + (kind ? " is-" + kind : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (SCRIPT_URL.indexOf("PASTE_") === 0) {
        setStatus("Form belum dikonfigurasi — pasang URL Apps Script dulu.", "err");
        return;
      }
      setStatus("Mengirim…", "");
      submitBtn.disabled = true;

      fetch(SCRIPT_URL, { method: "POST", body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.result === "success") {
            form.reset();
            setStatus("Terkirim! Terima kasih — pesanmu sudah masuk. 🙌", "ok");
          } else {
            setStatus((data && data.message) || "Gagal mengirim. Coba lagi nanti.", "err");
          }
        })
        .catch(function () { setStatus("Gagal terhubung. Cek koneksi lalu coba lagi.", "err"); })
        .finally(function () { submitBtn.disabled = false; });
    });
  }
})();
