# Panduan Google Search Console untuk Islamediaku

## 1. Menambahkan Website ke Google Search Console

1. Buka [Google Search Console](https://search.google.com/search-console)
2. Login dengan akun Google Anda
3. Klik **"Add Property"** (Tambah Properti)
4. Pilih **"URL prefix"** (bukan Domain)
5. Masukkan URL: `https://khutbahqu.vercel.app`
6. Klik **"Continue"**

## 2. Verifikasi Kepemilikan

Islamediaku sudah memiliki file verifikasi di:
- `public/google8c31629919a85dd0.html`
- Meta tag: `<meta name="google-site-verification" content="google8c31629919a85dd0" />`

Jika verifikasi diminta lagi:
1. Pilih metode **"HTML file"** atau **"HTML tag"**
2. File/tag sudah terpasang, klik **"Verify"**

## 3. Submit Sitemap

Setelah verifikasi berhasil:
1. Buka menu **"Sitemaps"** di sidebar kiri
2. Di kolom **"Add a new sitemap"**, masukkan:
   ```
   https://khutbahqu.vercel.app/sitemap.xml
   ```
3. Klik **"Submit"**
4. Status akan berubah menjadi **"Success"** jika sitemap valid

> **Catatan:** Sitemap otomatis diperbarui setiap kali build (`npm run build`) karena menggunakan script `prebuild`.

## 4. URL Inspection (Inspeksi URL)

Gunakan fitur ini untuk memeriksa apakah halaman tertentu sudah diindeks:
1. Buka **"URL Inspection"** di sidebar
2. Masukkan URL yang ingin diperiksa, contoh:
   - `https://khutbahqu.vercel.app/`
   - `https://khutbahqu.vercel.app/khutbah`
   - `https://khutbahqu.vercel.app/khutbah/keutamaan-menjaga-lisan`
3. Klik **Enter**
4. Lihat status **"URL is on Google"** atau **"URL is not on Google"**

## 5. Request Indexing (Meminta Pengindeksan)

Jika URL belum terindeks:
1. Di halaman URL Inspection, klik **"Request Indexing"**
2. Google akan memasukkan URL ke antrian crawling
3. Proses indexing membutuhkan waktu **beberapa jam hingga beberapa minggu**

> **Penting:** Google tidak menjamin kapan halaman akan diindeks. Indexing bergantung pada kualitas konten, struktur website, dan relevansi.

## 6. Membaca Laporan

### Pages Report
- Buka **"Pages"** di sidebar
- Lihat berapa halaman yang **Indexed** vs **Not Indexed**
- Periksa alasan jika ada halaman yang tidak diindeks (misalnya: `Crawled - currently not indexed`, `Discovered - currently not indexed`)

### Performance Report
- Buka **"Performance"** di sidebar
- Lihat metrik:
  - **Total clicks**: berapa kali website diklik dari hasil pencarian
  - **Total impressions**: berapa kali website muncul di hasil pencarian
  - **Average CTR**: persentase klik dari total impression
  - **Average position**: rata-rata posisi di hasil pencarian
- Filter berdasarkan **Queries** untuk melihat keyword mana yang membawa traffic

## 7. Halaman-Halaman Penting untuk Dipantau

| URL | Keterangan |
|-----|-----------|
| `/` | Homepage |
| `/khutbah` | Katalog khutbah |
| `/kalender-hijriah` | Kalender Hijriah |
| `/mushaf` | Mushaf Al-Qur'an |
| `/kontribusi` | Kirim naskah |
| `/tentang` | Tentang |
| `/khutbah/{slug}` | 200+ halaman detail khutbah |

## 8. Catatan Penting

- ⚠️ **Google tidak menjamin ranking instan.** SEO adalah proses jangka panjang.
- ⏳ Indexing pertama kali bisa memakan waktu **1-4 minggu**.
- 📊 Data di Performance report memerlukan **waktu 2-3 hari** untuk diperbarui.
- 🔄 Sitemap otomatis diperbarui setiap build, sehingga halaman baru akan selalu masuk.
- 🚫 Jangan menggunakan teknik black-hat SEO seperti keyword stuffing atau fake backlinks.
- ✅ Fokus pada konten berkualitas dan pengalaman pengguna yang baik.

## 9. URL Penting

- **Sitemap:** https://khutbahqu.vercel.app/sitemap.xml
- **Robots.txt:** https://khutbahqu.vercel.app/robots.txt
- **Google Search Console:** https://search.google.com/search-console
