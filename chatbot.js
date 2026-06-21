/* ============================================================
   Khai's Assistant — lightweight retrieval chatbot
   Runs 100% in the visitor's browser: no model download, no
   backend, no API key, no account. It matches the question to a
   curated knowledge base about Khai, so it is instant and can
   never hallucinate (answers always come from the data below).
   ============================================================ */
(function () {
  "use strict";

  var fab = document.getElementById("chat-fab");
  var panel = document.getElementById("chat-panel");
  if (!fab || !panel) return;
  var closeBtn = document.getElementById("chat-close");
  var log = document.getElementById("chat-log");
  var form = document.getElementById("chat-form");
  var input = document.getElementById("chat-input");
  var chips = document.getElementById("chat-chips");

  // Each entry: k = keywords (id+en), id/en = answer in that language.
  var ENTRIES = [
    { k: ["halo", "hai", "hi", "hello", "hey", "pagi", "siang", "malam", "assalamualaikum"],
      id: "Hai! 👋 Aku asisten portofolio Khai. Bisa tanya soal skill, proyek, pengalaman, pendidikan, sertifikasi, atau cara menghubunginya. Mau mulai dari mana?",
      en: "Hi! 👋 I'm Khai's portfolio assistant. Ask me about his skills, projects, experience, education, certifications, or how to reach him. Where shall we start?" },

    { k: ["siapa", "tentang", "about", "who", "profil", "profile", "kenalan", "khairu", "orangnya", "dia siapa"],
      id: "Khairuramdhani (panggil Khai) — AI/ML & Mobile Developer, mahasiswa Teknik Komputer di Universitas Brawijaya. Paling fokus ke Computer Vision, tapi nyaman juga di machine learning, data, IoT/embedded, dan mobile. Biasa pakai Python & C++, dan bikin app mobile dengan Flutter — proyeknya digarap end-to-end dari data sampai jalan di perangkat nyata.",
      en: "Khairuramdhani (Khai) — an AI/ML & Mobile Developer and Computer Engineering student at Universitas Brawijaya. His main focus is Computer Vision, but he's also at home with ML, data, IoT/embedded, and mobile. He works mainly in Python & C++ and builds mobile apps with Flutter — taking projects end-to-end from data to running on real devices." },

    { k: ["skill", "keahlian", "kemampuan", "bisa apa", "kuasai", "teknologi", "stack", "tools", "bahasa pemrograman", "programming", "framework", "tech"],
      id: "Skill utama Khai:\n• Bahasa: Python, C++, Dart, JavaScript\n• AI/ML: PyTorch, TensorFlow, scikit-learn, YOLO, CNN, SVM\n• Computer Vision: OpenCV, deteksi real-time, segmentasi, on-device (TF Lite)\n• Mobile: Flutter, Firebase, Supabase\n• Embedded/IoT: ESP32, Arduino, FreeRTOS, sensor, RTC\n• Data: pandas, NumPy, matplotlib, seaborn\n• Tools: Git, Linux, Anaconda, Weights & Biases",
      en: "Khai's core skills:\n• Languages: Python, C++, Dart, JavaScript\n• AI/ML: PyTorch, TensorFlow, scikit-learn, YOLO, CNN, SVM\n• Computer Vision: OpenCV, real-time detection, segmentation, on-device (TF Lite)\n• Mobile: Flutter, Firebase, Supabase\n• Embedded/IoT: ESP32, Arduino, FreeRTOS, sensors, RTC\n• Data: pandas, NumPy, matplotlib, seaborn\n• Tools: Git, Linux, Anaconda, Weights & Biases" },

    { k: ["pengalaman", "experience", "kerja", "work", "magang", "intern", "internship", "aitf", "komdigi", "job", "career", "asisten", "teaching assistant"],
      id: "Pengalaman Khai:\n• AI Engineer Intern @ AITF (Feb 2026–sekarang) — program nasional kolaborasi Komdigi × Universitas Brawijaya. Bikin pipeline anotasi data semi-otomatis pakai Vision-Language Models, pipeline deep learning end-to-end untuk Computer Vision, dan fine-tuning LLM.\n• Asisten Praktikum — Struktur Data & Algoritma serta Pemrograman Dasar (2024/2025) di FILKOM UB (ngajar lab C++, review tugas).",
      en: "Khai's experience:\n• AI Engineer Intern @ AITF (Feb 2026–present) — a national program, a Komdigi × Universitas Brawijaya collaboration. Built a semi-automatic data-annotation pipeline with Vision-Language Models, end-to-end deep-learning pipelines for Computer Vision, and fine-tuned LLMs.\n• Teaching Assistant — Data Structures & Algorithms and Basic Programming (2024/2025) at FILKOM UB (C++ labs, assignment reviews)." },

    { k: ["pendidikan", "education", "kuliah", "sekolah", "kampus", "universitas", "brawijaya", "sma", "study", "degree", "jurusan", "background"],
      id: "Pendidikan: S1 Teknik Komputer, Universitas Brawijaya, Malang (Agu 2023–sekarang). SMA: SMAN 1 Sindang, Indramayu (jurusan IPA).",
      en: "Education: Computer Engineering (Bachelor's), Universitas Brawijaya, Malang (Aug 2023–present). High school: SMAN 1 Sindang, Indramayu (Natural Sciences)." },

    { k: ["proyek", "project", "projects", "portofolio", "karya", "bikin apa", "pernah bikin", "buatan", "portfolio"],
      id: "Ada 6 proyek end-to-end:\n1. CERDAS — deteksi mencontek real-time (YOLO, on-device Android)\n2. FishFeed — pemberi pakan ikan otomatis (ESP32 + Flutter)\n3. Arrhythmia — klasifikasi aritmia pakai SVM (96% akurasi)\n4. Buah-Seru — app edukasi pengenalan buah (CNN)\n5. K-Means from Scratch — clustering manual tanpa scikit-learn\n6. PANDAI — identifikasi tanaman (MobileNet, MVP)\nMau detail yang mana?",
      en: "Six end-to-end projects:\n1. CERDAS — real-time cheating detection (YOLO, on-device Android)\n2. FishFeed — automatic fish feeder (ESP32 + Flutter)\n3. Arrhythmia — arrhythmia classification with SVM (96% accuracy)\n4. Buah-Seru — fruit-recognition learning app (CNN)\n5. K-Means from Scratch — clustering coded by hand, no scikit-learn\n6. PANDAI — plant identification (MobileNet, MVP)\nWhich one would you like details on?" },

    { k: ["cerdas", "contek", "mencontek", "cheating", "exam", "ujian", "gaze", "kepala", "head"],
      id: "CERDAS — deteksi mencontek saat ujian secara real-time dengan membaca arah kepala & pandangan mata. Pakai YOLO, 6 kelas orientasi, jalan on-device di Android (~9 FPS) lewat TensorFlow Lite + Flutter. Dikerjakan full pipeline: data → training → deploy. Repo: github.com/khaichi11/Mobile-Cheating-Detection-YOLO",
      en: "CERDAS — real-time exam-cheating detection by reading head & gaze orientation. Uses YOLO with 6 classes, runs on-device on Android (~9 FPS) via TensorFlow Lite + Flutter. Full pipeline: data → training → deployment. Repo: github.com/khaichi11/Mobile-Cheating-Detection-YOLO" },

    { k: ["fishfeed", "fish", "ikan", "pakan", "feeder", "esp32", "iot", "embedded", "akuarium", "feed"],
      id: "FishFeed — pemberi pakan ikan otomatis berbasis ESP32. Firmware C++ (Arduino) pakai FreeRTOS, sensor ultrasonik & turbidity, plus RTC. Aplikasi Flutter terhubung via Firebase Realtime Database untuk pantau air/pakan & atur jadwal dari HP. Repo: github.com/khaichi11/Aplikasi-Sistem-Tertanam-FishFeed",
      en: "FishFeed — an automatic fish feeder built around an ESP32. C++ firmware (Arduino) with FreeRTOS, ultrasonic & turbidity sensors plus an RTC. A Flutter app connects via Firebase Realtime Database to monitor water/feed and set schedules. Repo: github.com/khaichi11/Aplikasi-Sistem-Tertanam-FishFeed" },

    { k: ["arrhythmia", "aritmia", "svm", "jantung", "heart", "ecg", "ekg", "qrs"],
      id: "Arrhythmia Classification — SVM untuk membedakan detak jantung normal vs aritmia dari R-R interval & durasi QRS (data ECG). Full ML pipeline: EDA, normalisasi fitur, confusion matrix, classification report. Hasil 96% akurasi. Repo: github.com/khaichi11/Code-on-College (SVM.ipynb)",
      en: "Arrhythmia Classification — an SVM separating normal heartbeats from arrhythmia using R-R interval & QRS duration (ECG data). Full ML pipeline: EDA, feature normalisation, confusion matrix, classification report. Reached 96% accuracy. Repo: github.com/khaichi11/Code-on-College (SVM.ipynb)" },

    { k: ["buah", "fruit", "buah-seru", "buahseru", "anak", "edukasi", "grabcut", "kids"],
      id: "Buah-Seru — app edukasi pengenalan buah untuk anak: foto buahnya → muncul nama + info seru. Pakai OpenCV (GrabCut) untuk segmentasi, CNN (TensorFlow), dan TF Lite + Flutter biar jalan di HP. Repo: github.com/khaichi11/Aplikasi-Deteksi-Buah-CNN",
      en: "Buah-Seru — a fruit-recognition learning app for kids: snap a fruit → get its name + fun facts. Uses OpenCV (GrabCut) segmentation, a CNN (TensorFlow), and TF Lite + Flutter to run on a phone. Repo: github.com/khaichi11/Aplikasi-Deteksi-Buah-CNN" },

    { k: ["k-means", "kmeans", "clustering", "cluster", "sampah", "waste", "from scratch", "scratch"],
      id: "K-Means from Scratch — algoritma K-Means ditulis sendiri di Python (tanpa scikit-learn) untuk pemilahan sampah, supaya benar-benar paham cara kerjanya. Pakai pandas & NumPy (perhitungan jarak ter-vektorisasi) dan matplotlib untuk visualisasi cluster. Repo: github.com/khaichi11/Code-on-College (K_Means_Pemilah_Sampah.ipynb)",
      en: "K-Means from Scratch — K-Means coded by hand in Python (no scikit-learn) for waste sorting, to really understand the internals. Uses pandas & NumPy (vectorised distance) and matplotlib for cluster visualisation. Repo: github.com/khaichi11/Code-on-College (K_Means_Pemilah_Sampah.ipynb)" },

    { k: ["pandai", "tanaman", "plant", "mobilenet", "sdg", "plants"],
      id: "PANDAI — app Android identifikasi tanaman real-time untuk anak SD, dengan sentuhan gamifikasi. Dibangun pakai Flutter + Firebase + Supabase, model MobileNet via TensorFlow Lite; selaras dengan SDG 4 & SDG 15. Status: MVP (alur utamanya sudah jalan). Repo: github.com/khaichi11/Mobile-APP-Plant-Detection-Mobilenet",
      en: "PANDAI — an Android app for real-time plant identification aimed at primary-school kids, with gamified learning. Built with Flutter + Firebase + Supabase and a MobileNet model via TensorFlow Lite; aligned with SDG 4 & SDG 15. Status: an MVP (core flow works). Repo: github.com/khaichi11/Mobile-APP-Plant-Detection-Mobilenet" },

    { k: ["sertifikat", "sertifikasi", "certificate", "certification", "pelatihan", "training", "kursus", "course", "udemy", "dicoding"],
      id: "Sertifikasi & pelatihan:\n• Complete A.I. & Machine Learning, Data Science Bootcamp (Udemy)\n• Belajar Dasar AI (Dicoding)\n• Belajar Dasar Visualisasi Data (Dicoding)\n• Asisten Praktikum Pemrograman Dasar (FILKOM UB)\n• Asisten Praktikum Struktur Data & Algoritma (FILKOM UB)",
      en: "Certifications & training:\n• Complete A.I. & Machine Learning, Data Science Bootcamp (Udemy)\n• Belajar Dasar AI (Dicoding)\n• Belajar Dasar Visualisasi Data (Dicoding)\n• Teaching Assistant · Basic Programming (FILKOM UB)\n• Teaching Assistant · Data Structures & Algorithms (FILKOM UB)" },

    { k: ["kontak", "contact", "email", "hubungi", "reach", "linkedin", "github", "sosial", "social", "mail", "menghubungi"],
      id: "Cara menghubungi Khai:\n• Email: khairuramdhani@student.ub.ac.id\n• GitHub: github.com/khaichi11\n• LinkedIn: linkedin.com/in/khairuramdhani\nAtau tinggalkan pesan lewat form di bagian Contact halaman ini 🙂",
      en: "How to reach Khai:\n• Email: khairuramdhani@student.ub.ac.id\n• GitHub: github.com/khaichi11\n• LinkedIn: linkedin.com/in/khairuramdhani\nOr drop a message via the form in the Contact section of this page 🙂" },

    { k: ["computer vision", "fokus", "minat", "spesialisasi", "interest", "specialty", "suka apa", "passion"],
      id: "Minat utama Khai adalah Computer Vision — deteksi real-time, segmentasi, dan inferensi on-device (TF Lite). Itu benang merah di proyek seperti CERDAS, Buah-Seru, dan PANDAI. Tapi dia juga nyaman di ML klasik, data, IoT, dan mobile.",
      en: "Khai's main interest is Computer Vision — real-time detection, segmentation, and on-device inference (TF Lite). That thread runs through projects like CERDAS, Buah-Seru, and PANDAI. He's also comfortable with classic ML, data, IoT, and mobile." },

    { k: ["makasih", "terima kasih", "thanks", "thank you", "thx", "mantap", "keren", "nice"],
      id: "Sama-sama! 🙌 Kalau mau, tanya lagi soal proyek atau skill Khai, atau langsung hubungi dia lewat bagian Contact ya.",
      en: "You're welcome! 🙌 Feel free to ask more about Khai's projects or skills, or reach out via the Contact section." }
  ];

  function norm(s) {
    return (" " + String(s).toLowerCase() + " ").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ");
  }
  // Score a keyword against the normalized query. Long words match as substrings
  // so Indonesian suffixes ("skillnya", "proyeknya", "skill-nya") still hit;
  // short words (<=3 chars) need a whole-word match to avoid false positives.
  function hit(nq, kw) {
    var k = norm(kw).trim();
    if (!k) return 0;
    if (k.indexOf(" ") >= 0) return nq.indexOf(k) >= 0 ? 3 : 0;   // phrase
    if (k.length >= 4) return nq.indexOf(k) >= 0 ? 1 : 0;          // long word
    return nq.indexOf(" " + k + " ") >= 0 ? 1 : 0;                 // short word
  }
  function isEnglish(q) {
    var s = norm(q), e = 0, i = 0;
    [" what ", " who ", " how ", " your ", " his ", " skills ", " skill ", " project ", " projects ",
     " experience ", " contact ", " can ", " does ", " tell ", " about ", " where ", " education "].forEach(function (w) { if (s.indexOf(w) >= 0) e++; });
    [" apa ", " siapa ", " gimana ", " bagaimana ", " nya ", " yang ", " dia ", " kerja ", " proyek ",
     " pengalaman ", " kontak ", " bisa ", " kuliah ", " tentang ", " dimana "].forEach(function (w) { if (s.indexOf(w) >= 0) i++; });
    return e > i;
  }
  var STOP = " apa yang dia nya aja saja sih dong gimana bagaimana itu the is are his her of to do does what who how tell me about and ya kah pun ".split(" ");
  function tokens(s) {
    return norm(s).trim().split(" ").filter(function (t) { return t.length >= 2 && STOP.indexOf(t) < 0; });
  }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function reply(q) {
    var nq = norm(q), qt = tokens(q), best = null, score = 0;
    ENTRIES.forEach(function (en) {
      var s = 0;
      en.k.forEach(function (kw) { s += hit(nq, kw); });
      // typo tolerance: a query word within 1 edit of a single-word keyword
      qt.forEach(function (t) {
        if (t.length < 4) return;
        en.k.forEach(function (kw) {
          var k = norm(kw).trim();
          if (k.indexOf(" ") < 0 && k.length >= 4 && Math.abs(k.length - t.length) <= 1 && lev(t, k) === 1) s += 0.5;
        });
      });
      if (s > score) { score = s; best = en; }
    });
    var eng = isEnglish(q);
    if (best && score > 0) return eng ? (best.en || best.id) : best.id;
    return eng
      ? "I can only chat about Khai & his portfolio 🙂 Try asking about his skills, projects, experience, education, certifications, or contact."
      : "Aku cuma bisa cerita seputar Khai & portofolionya 🙂 Coba tanya soal skill, proyek, pengalaman, pendidikan, sertifikasi, atau cara menghubunginya.";
  }

  function addMsg(role, text) {
    var el = document.createElement("div");
    el.className = "chat-msg chat-msg--" + role;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function ask(q) {
    q = (q || "").trim();
    if (!q) return;
    if (chips) chips.remove();
    addMsg("user", q);
    var typing = addMsg("bot", "…");
    setTimeout(function () {
      typing.textContent = reply(q);
      log.scrollTop = log.scrollHeight;
    }, 280);
  }

  function openPanel() { panel.classList.add("open"); fab.classList.add("is-open"); fab.setAttribute("aria-expanded", "true"); input.focus(); }
  function closePanel() { panel.classList.remove("open"); fab.classList.remove("is-open"); fab.setAttribute("aria-expanded", "false"); }

  fab.addEventListener("click", function () {
    panel.classList.contains("open") ? closePanel() : openPanel();
  });
  if (closeBtn) closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) closePanel();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value;
    input.value = "";
    ask(q);
  });
  if (chips) chips.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-q]");
    if (b) ask(b.getAttribute("data-q"));
  });
})();
