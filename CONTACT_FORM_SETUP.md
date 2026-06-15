# Setup form kontak → Google Sheet

Form di section **Contact** menyimpan pesan pengunjung ke sebuah **Google Sheet**
(seperti Google Form). Pengunjung **tidak** melihat email/nomor kamu — yang ada di
kode hanya URL acak Google Apps Script.

**Tanpa email sama sekali.** Pesan masuk ke Sheet, kamu tinggal buka Sheet-nya buat
membaca — jadi tidak ada "kirim ke diri sendiri". (Kalau nanti mau notifikasi,
lihat bagian [Opsional](#opsional-notifikasi) di bawah.)

Sekali setup, selesai. ~5 menit.

---

## 1. Buat Google Sheet

1. Buka <https://sheets.new> → beri nama, mis. **Portfolio — Pesan Masuk**.
2. Isi baris pertama (header) di kolom A–D:

   | A | B | C | D |
   |---|---|---|---|
   | Waktu | Nama | Email | Pesan |

## 2. Tempel Apps Script

1. Di Sheet itu: menu **Extensions → Apps Script**.
2. Hapus semua isi `Code.gs`, lalu tempel kode di bawah.
3. **Save** (ikon disket).

```javascript
// ── Portfolio: form kontak → Google Sheet (tanpa email) ────────────
function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Honeypot: kalau "company" terisi → bot. Pura-pura sukses, jangan simpan.
    if (p.company) return _json({ result: "success" });

    const name = String(p.name || "").trim().slice(0, 100);
    const email = String(p.email || "").trim().slice(0, 120);
    const message = String(p.message || "").trim().slice(0, 2000);

    if (!name || !message) {
      return _json({ result: "error", message: "Nama dan pesan wajib diisi." });
    }

    // Moderasi server-side (tak bisa di-bypass dari browser).
    // Daftar kata yang diblokir: ISI SENDIRI di bawah. File ini tinggal di Apps Script-mu
    // (PRIVAT, tidak ikut ke GitHub), jadi kata-katanya tak akan terlihat di repo publik.
    const BAD_WORDS = []; // contoh: ["kata1", "kata2"] — kosongkan kalau tak mau filter kata
    const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|id|co|io|xyz|ru|info|link|biz|top|site|app)\b)/i;
    const BAD = BAD_WORDS.length ? new RegExp("\\b(" + BAD_WORDS.join("|") + ")\\b", "i") : null;
    if (LINK.test(message)) return _json({ result: "error", message: "Link tidak diperbolehkan di pesan." });
    if (BAD && (BAD.test(message) || BAD.test(name))) return _json({ result: "error", message: "Mohon gunakan bahasa yang sopan." });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.appendRow([new Date(), name, email, message]);

    return _json({ result: "success" });
  } catch (err) {
    return _json({ result: "error", message: String(err) });
  }
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy sebagai Web App

1. Tombol **Deploy → New deployment**.
2. Ikon gerigi → pilih tipe **Web app**.
3. Setelan:
   - **Execute as:** Me (emailmu)
   - **Who has access:** **Anyone**  ← wajib, biar form publik bisa kirim
4. **Deploy** → **Authorize access** → pilih akunmu → "Advanced" → "Go to (nama project)"
   → **Allow**. (Izin yang diminta cuma **menulis ke Sheet** — bukan Gmail.)
5. Salin **Web app URL** yang muncul (berakhiran `…/exec`).

## 4. Pasang URL ke situs

1. Buka [`main.js`](main.js), cari baris:

   ```js
   const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL";
   ```

2. Ganti `PASTE_YOUR_APPS_SCRIPT_URL` dengan URL `…/exec` dari langkah 3.
3. Commit & push → GitHub Pages auto-update.

Selesai. Coba kirim pesan dari situsmu → **baris baru muncul di Sheet**.

---

## Catatan

- **Lihat pesan:** cukup buka Google Sheet-nya kapan saja; semua tersimpan rapi per baris.
- **Ubah kode script setelahnya?** Harus **Deploy → Manage deployments → ✏️ Edit →
  Version: New version → Deploy** agar perubahan aktif. URL `…/exec` tetap sama.
- **Spam:** ada honeypot (field tersembunyi `company`). Cukup untuk bot dasar.
  Kalau spam parah, tambah reCAPTCHA.
- **Privasi:** URL Apps Script tidak membocorkan email/nomormu. Aman ditaruh di repo publik.

---

## Opsional: notifikasi

Default-nya **tidak ada notifikasi** (kamu cek Sheet sendiri). Kalau suatu saat mau
dikabari otomatis tanpa harus buka Sheet, ada dua cara — bilang saja, nanti saya
tuliskan kodenya:

- **Telegram** (disarankan kalau mau dikabari): Apps Script kirim ping ke bot
  Telegram-mu. Bukan email, bukan "ke diri sendiri", dan token bot tersembunyi di
  dalam script. Butuh bikin bot (BotFather) + 1 chat id.
- **Email**: ping ke inbox-mu. Header-nya "dari kamu ke kamu" (wajar untuk contact
  form), berlabel jelas "kiriman pengunjung". Butuh izin Gmail saat authorize.
