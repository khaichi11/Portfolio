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
      id: "Selamat datang. Saya asisten portofolio Khai dan dapat membantu menjawab pertanyaan seputar keahlian, proyek, pengalaman, pendidikan, sertifikasi, atau cara menghubunginya. Silakan mulai dari topik yang Anda minati.",
      en: "Welcome. I am Khai's portfolio assistant and can help answer questions about his skills, projects, experience, education, certifications, or how to reach him. Please let me know which topic you would like to start with." },

    { k: ["siapa", "tentang", "about", "who", "profil", "profile", "kenalan", "khairu", "orangnya", "dia siapa"],
      id: "Khairuramdhani (disapa Khai) adalah AI/ML Engineer, Mobile Developer, dan Mechanical Designer, serta mahasiswa Teknik Komputer di Universitas Brawijaya. Fokus utamanya adalah Computer Vision, namun ia juga menguasai machine learning, data, IoT/embedded, mobile, dan desain mekanik. Ia terbiasa menggunakan Python dan C++, mengembangkan aplikasi mobile dengan Flutter, serta mengerjakan proyek secara menyeluruh mulai dari data hingga penerapannya pada perangkat nyata.",
      en: "Khairuramdhani (Khai) is an AI/ML Engineer, Mobile Developer, and Mechanical Designer, as well as a Computer Engineering student at Universitas Brawijaya. His main focus is Computer Vision, while also being proficient in machine learning, data, IoT/embedded systems, mobile development, and mechanical design. He primarily works with Python and C++, develops mobile applications with Flutter, and carries out projects end to end, from data to deployment on real devices." },

    { k: ["skill", "keahlian", "kemampuan", "bisa apa", "kuasai", "teknologi", "stack", "tools", "bahasa pemrograman", "programming", "framework", "tech"],
      id: "Keahlian utama Khai:\n• Bahasa Pemrograman: Python, C++, Dart, JavaScript\n• AI/ML: PyTorch, TensorFlow, scikit-learn, YOLO, CNN, SVM\n• Computer Vision: OpenCV, deteksi real-time, segmentasi, on-device (TF Lite)\n• Mobile: Flutter, Firebase, Supabase\n• Embedded/IoT: ESP32, Arduino, FreeRTOS, sensor, RTC\n• Mechanical Design & CAD: Autodesk Fusion 360, sheet metal design, gambar teknik\n• Data: pandas, NumPy, matplotlib, seaborn\n• Tools: Git, Linux, Anaconda, Weights & Biases",
      en: "Khai's core skills:\n• Programming Languages: Python, C++, Dart, JavaScript\n• AI/ML: PyTorch, TensorFlow, scikit-learn, YOLO, CNN, SVM\n• Computer Vision: OpenCV, real-time detection, segmentation, on-device (TF Lite)\n• Mobile: Flutter, Firebase, Supabase\n• Embedded/IoT: ESP32, Arduino, FreeRTOS, sensors, RTC\n• Mechanical Design & CAD: Autodesk Fusion 360, sheet metal design, technical drawing\n• Data: pandas, NumPy, matplotlib, seaborn\n• Tools: Git, Linux, Anaconda, Weights & Biases" },

    { k: ["pengalaman", "experience", "kerja", "work", "magang", "intern", "internship", "aitf", "komdigi", "job", "career", "asisten", "teaching assistant"],
      id: "Pengalaman Khai:\n• AI Engineer Intern di AITF (Feb–Jun 2026): program nasional hasil kolaborasi Komdigi dan Universitas Brawijaya. Membangun pipeline anotasi data semi-otomatis menggunakan Vision-Language Models, pipeline deep learning end-to-end untuk Computer Vision, serta melakukan fine-tuning LLM.\n• Asisten Praktikum Struktur Data & Algoritma serta Pemrograman Dasar (2024/2025) di FILKOM UB, mengampu sesi laboratorium C++ dan meninjau tugas mahasiswa.",
      en: "Khai's experience:\n• AI Engineer Intern at AITF (Feb–Jun 2026): a national program resulting from a collaboration between Komdigi and Universitas Brawijaya. Built a semi-automatic data-annotation pipeline using Vision-Language Models, developed end-to-end deep-learning pipelines for Computer Vision, and fine-tuned LLMs.\n• Teaching Assistant for Data Structures & Algorithms and Basic Programming (2024/2025) at FILKOM UB, leading C++ laboratory sessions and reviewing student assignments." },

    { k: ["pendidikan", "education", "kuliah", "sekolah", "kampus", "universitas", "brawijaya", "sma", "study", "degree", "jurusan", "background"],
      id: "Pendidikan: S1 Teknik Komputer, Universitas Brawijaya, Malang (Agu 2023–sekarang). SMA: SMAN 1 Sindang, Indramayu (jurusan IPA).",
      en: "Education: Computer Engineering (Bachelor's), Universitas Brawijaya, Malang (Aug 2023–present). High school: SMAN 1 Sindang, Indramayu (Natural Sciences)." },

    { k: ["proyek", "project", "projects", "portofolio", "karya", "bikin apa", "pernah bikin", "buatan", "portfolio"],
      id: "Ada 7 proyek end-to-end:\n1. CERDAS: deteksi mencontek real-time (YOLO, on-device Android)\n2. FishFeed: pemberi pakan ikan otomatis (ESP32 + Flutter)\n3. Arrhythmia: klasifikasi aritmia menggunakan SVM (96% akurasi)\n4. Buah-Seru: aplikasi edukasi pengenalan buah (CNN)\n5. K-Means from Scratch: clustering manual tanpa scikit-learn\n6. PANDAI: identifikasi tanaman (MobileNet, MVP)\n7. Robotiik Chassis: desain mekanik sheet-metal untuk robot berkaki (Fusion 360)\nSilakan pilih salah satu untuk detail lebih lanjut.",
      en: "Seven end-to-end projects:\n1. CERDAS: real-time cheating detection (YOLO, on-device Android)\n2. FishFeed: automatic fish feeder (ESP32 + Flutter)\n3. Arrhythmia: arrhythmia classification using SVM (96% accuracy)\n4. Buah-Seru: fruit-recognition learning application (CNN)\n5. K-Means from Scratch: clustering implemented manually without scikit-learn\n6. PANDAI: plant identification (MobileNet, MVP)\n7. Robotiik Chassis: sheet-metal mechanical design for a legged robot (Fusion 360)\nPlease select one for further detail." },

    { k: ["cerdas", "contek", "mencontek", "cheating", "exam", "ujian", "gaze", "kepala", "head"],
      id: "CERDAS: mendeteksi indikasi mencontek saat ujian secara real-time dengan membaca arah kepala dan pandangan mata. Menggunakan YOLO dengan 6 kelas orientasi, berjalan on-device di Android (~9 FPS) melalui TensorFlow Lite dan Flutter. Dikerjakan sebagai full pipeline: data, training, hingga deployment. Repo: github.com/khaichi11/Mobile-Cheating-Detection-YOLO",
      en: "CERDAS: real-time exam-cheating detection by analysing head and gaze orientation. Uses YOLO with 6 classes, running on-device on Android (~9 FPS) via TensorFlow Lite and Flutter. Developed as a full pipeline, from data to training and deployment. Repo: github.com/khaichi11/Mobile-Cheating-Detection-YOLO" },

    { k: ["fishfeed", "fish", "ikan", "pakan", "feeder", "esp32", "iot", "embedded", "akuarium", "feed"],
      id: "FishFeed: sistem pemberi pakan ikan otomatis berbasis ESP32. Firmware C++ (Arduino) menggunakan FreeRTOS, sensor ultrasonik dan turbidity, serta RTC. Aplikasi Flutter terhubung melalui Firebase Realtime Database untuk memantau kondisi air dan pakan serta mengatur jadwal dari HP. Repo: github.com/khaichi11/Aplikasi-Sistem-Tertanam-FishFeed",
      en: "FishFeed: an automatic fish-feeding system built around an ESP32. C++ firmware (Arduino) with FreeRTOS, ultrasonic and turbidity sensors, and an RTC module. A Flutter application connects via Firebase Realtime Database to monitor water and feed conditions and configure schedules from a phone. Repo: github.com/khaichi11/Aplikasi-Sistem-Tertanam-FishFeed" },

    { k: ["arrhythmia", "aritmia", "svm", "jantung", "heart", "ecg", "ekg", "qrs"],
      id: "Arrhythmia Classification: model SVM untuk membedakan detak jantung normal dan aritmia berdasarkan R-R interval dan durasi QRS (data ECG). Mencakup pipeline ML lengkap: EDA, normalisasi fitur, confusion matrix, dan classification report. Akurasi yang dicapai sebesar 96%. Repo: github.com/khaichi11/Code-on-College (SVM.ipynb)",
      en: "Arrhythmia Classification: an SVM model distinguishing normal heartbeats from arrhythmia using R-R interval and QRS duration (ECG data). Includes a complete ML pipeline: EDA, feature normalisation, confusion matrix, and classification report. Achieved 96% accuracy. Repo: github.com/khaichi11/Code-on-College (SVM.ipynb)" },

    { k: ["buah", "fruit", "buah-seru", "buahseru", "anak", "edukasi", "grabcut", "kids"],
      id: "Buah-Seru: aplikasi edukasi pengenalan buah untuk anak-anak. Pengguna memotret sebuah buah, lalu aplikasi menampilkan nama beserta informasi menarik seputar buah tersebut. Menggunakan OpenCV (GrabCut) untuk segmentasi, CNN (TensorFlow) untuk klasifikasi, serta TensorFlow Lite dan Flutter agar dapat berjalan di HP. Repo: github.com/khaichi11/Aplikasi-Deteksi-Buah-CNN",
      en: "Buah-Seru: an educational fruit-recognition application for children. Users photograph a fruit, and the application displays its name along with interesting related facts. Uses OpenCV (GrabCut) for segmentation, a CNN (TensorFlow) for classification, and TensorFlow Lite with Flutter for on-device deployment. Repo: github.com/khaichi11/Aplikasi-Deteksi-Buah-CNN" },

    { k: ["k-means", "kmeans", "clustering", "cluster", "sampah", "waste", "from scratch", "scratch"],
      id: "K-Means from Scratch: algoritma K-Means yang diimplementasikan secara manual di Python (tanpa scikit-learn) untuk pemilahan sampah, guna memahami cara kerjanya secara mendalam. Menggunakan pandas dan NumPy untuk perhitungan jarak yang divektorisasi, serta matplotlib untuk visualisasi cluster. Repo: github.com/khaichi11/Code-on-College (K_Means_Pemilah_Sampah.ipynb)",
      en: "K-Means from Scratch: the K-Means algorithm implemented manually in Python (without scikit-learn) for waste sorting, in order to understand its inner workings in depth. Uses pandas and NumPy for vectorised distance computation, along with matplotlib for cluster visualisation. Repo: github.com/khaichi11/Code-on-College (K_Means_Pemilah_Sampah.ipynb)" },

    { k: ["pandai", "tanaman", "plant", "mobilenet", "sdg", "plants"],
      id: "PANDAI: aplikasi Android untuk identifikasi tanaman secara real-time bagi siswa sekolah dasar, dilengkapi sentuhan gamifikasi. Dibangun menggunakan Flutter, Firebase, dan Supabase, dengan model MobileNet melalui TensorFlow Lite, serta selaras dengan SDG 4 dan SDG 15. Status: MVP, dengan alur utama yang telah berfungsi. Repo: github.com/khaichi11/Mobile-APP-Plant-Detection-Mobilenet",
      en: "PANDAI: an Android application for real-time plant identification aimed at primary-school students, featuring gamified learning. Built with Flutter, Firebase, and Supabase, incorporating a MobileNet model via TensorFlow Lite, and aligned with SDG 4 and SDG 15. Status: MVP, with the core flow fully functional. Repo: github.com/khaichi11/Mobile-APP-Plant-Detection-Mobilenet" },

    { k: ["robotiik", "chassis", "fusion", "fusion 360", "sheet metal", "mekanik", "mechanical", "cad", "robot berkaki", "legged robot", "bend table", "gambar teknik", "technical drawing"],
      id: "Robotiik Chassis: chassis robot berkaki untuk tim Robotiik, dikerjakan menggunakan Autodesk Fusion 360 dengan mengacu pada desain Robotis sebagai basis, kemudian disesuaikan untuk dimensi servo dan komputer onboard yang digunakan. Setiap part berupa sheet metal dengan bend table dan flat pattern untuk fabrikasi. Khai berperan sebagai PIC Mekanik dan Computer Vision di Robotiik.",
      en: "Robotiik Chassis: the chassis for Robotiik's legged robot, developed using Autodesk Fusion 360 with reference to Robotis' original design, then adapted for the servo and onboard-computer dimensions used. Each part is designed as sheet metal with bend tables and flat patterns for fabrication. Khai serves as Mechanical and Computer Vision PIC at Robotiik." },

    { k: ["sertifikat", "sertifikasi", "certificate", "certification", "pelatihan", "training", "kursus", "course", "udemy", "dicoding"],
      id: "Sertifikasi & pelatihan:\n• Complete A.I. & Machine Learning, Data Science Bootcamp (Udemy)\n• Belajar Dasar AI (Dicoding)\n• Belajar Dasar Visualisasi Data (Dicoding)\n• Asisten Praktikum Pemrograman Dasar (FILKOM UB)\n• Asisten Praktikum Struktur Data & Algoritma (FILKOM UB)",
      en: "Certifications & training:\n• Complete A.I. & Machine Learning, Data Science Bootcamp (Udemy)\n• Belajar Dasar AI (Dicoding)\n• Belajar Dasar Visualisasi Data (Dicoding)\n• Teaching Assistant · Basic Programming (FILKOM UB)\n• Teaching Assistant · Data Structures & Algorithms (FILKOM UB)" },

    { k: ["kontak", "contact", "email", "hubungi", "reach", "linkedin", "github", "sosial", "social", "mail", "menghubungi"],
      id: "Cara menghubungi Khai:\n• Email: khairuramdhani@student.ub.ac.id\n• GitHub: github.com/khaichi11\n• LinkedIn: linkedin.com/in/khairuramdhani\nAnda juga dapat meninggalkan pesan melalui formulir pada bagian Contact di halaman ini.",
      en: "How to reach Khai:\n• Email: khairuramdhani@student.ub.ac.id\n• GitHub: github.com/khaichi11\n• LinkedIn: linkedin.com/in/khairuramdhani\nYou may also leave a message via the form in the Contact section of this page." },

    { k: ["computer vision", "fokus", "minat", "spesialisasi", "interest", "specialty", "suka apa", "passion"],
      id: "Minat utama Khai adalah Computer Vision, meliputi deteksi real-time, segmentasi, dan inferensi on-device (TF Lite). Bidang ini menjadi benang merah pada proyek seperti CERDAS, Buah-Seru, dan PANDAI. Selain itu, Khai juga menguasai ML klasik, data, IoT, mobile, dan desain mekanik.",
      en: "Khai's main interest is Computer Vision, encompassing real-time detection, segmentation, and on-device inference (TF Lite). This focus runs through projects such as CERDAS, Buah-Seru, and PANDAI. He is also proficient in classic ML, data, IoT, mobile development, and mechanical design." },

    { k: ["hobi", "hobby", "fotografi", "photography", "foto", "camera", "kamera", "di luar coding", "outside of code", "waktu luang", "free time"],
      id: "Di luar kegiatan akademik dan teknis, Khai memiliki minat pada fotografi. Ia pernah bertugas sebagai panitia dokumentasi pada acara Robin dan kerap menjadi orang yang mengambil dokumentasi foto pada kegiatan organisasi.",
      en: "Outside of his academic and technical work, Khai has an interest in photography. He previously served on the documentation committee for the Robin event and is often responsible for capturing photos at organisational activities." },

    { k: ["makasih", "terima kasih", "thanks", "thank you", "thx", "mantap", "keren", "nice"],
      id: "Sama-sama. Silakan bertanya kembali mengenai proyek atau keahlian Khai, atau hubungi Khai langsung melalui bagian Contact.",
      en: "You are welcome. Feel free to ask further about Khai's projects or skills, or reach out directly via the Contact section." }
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
      ? "I can only answer questions related to Khai and his portfolio. Please try asking about his skills, projects, experience, education, certifications, or contact details."
      : "Saya hanya dapat menjawab pertanyaan seputar Khai dan portofolionya. Silakan coba bertanya mengenai keahlian, proyek, pengalaman, pendidikan, sertifikasi, atau cara menghubunginya.";
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
