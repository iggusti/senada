# Arsip Lengkap Dokumen Inovasi SENADA (Tahap Prototype 2026)
**Survey Experience dan Feedback Aplikasi — Telkom University**

---

## 1. Lembar Identitas & Pengesahan

- **Nama Inovasi**: Survey Experience dan Feedback Aplikasi (SENADA)
- **Status/Tahapan Inovasi**: Tahap Prototype (Tingkat Universitas / YPT Group)
- **Ketua Pengusul**: Ilham Gumantung Gusti (NIP: 26970004)
- **Unit / Lokasi Kerja**: Urusan Pengembangan Produk TI Strategis
- **Daftar Anggota Tim**:
  1. Riky Faza
  2. Yulio Ferdinand
  3. Aryo Yusuf Dinanda
  4. Amira Nur Khalipah
- **Pengesahan**: Disetujui oleh Rio Guntur Utomo, S.T., M.T., Ph.D. (NIP: 22900021, Posisi Pimpinan Fakultas/Direktorat) pada tanggal 11 Mei 2026 di Bandung.

---

## 2. Ringkasan Eksekutif & Konsep Inovasi

SENADA adalah platform *User Experience Management* (UXM) terintegrasi yang memantau dan menganalisis kepuasan pengguna pada ekosistem aplikasi internal Telkom University secara *real-time*.

### Tiga Pilar Utama
1. **Efisien**: Pengumpulan data instan melalui *Quick Feedback Widget* (pop-up non-intrusif) dan integrasi SSO (*Single Sign-On*) Telkom University untuk validasi profil pengguna otomatis tanpa registrasi/login berulang.
2. **Terpusat**: Analitik satu pintu (*Single Source of Truth*) melalui Dashboard Admin real-time untuk membandingkan performa seluruh aplikasi internal secara objektif.
3. **Responsif**: Fitur *Early Warning System* yang mendeteksi penurunan rating signifikan (> 0.5 poin dalam rentang 7 hari) dan mengirimkan notifikasi email otomatis kepada tim pengelola aplikasi.

---

## 3. Latar Belakang & Analisis Permasalahan

Telkom University mengoperasikan ekosistem aplikasi internal yang luas untuk mendukung aktivitas akademik dan operasional. Namun, belum tersedianya mekanisme evaluasi kepuasan pengguna yang terstandarisasi menimbulkan 4 isu kritikal:
1. **Fragmentasi Data dan Pengukuran Tidak Terstruktur**: Ketiadaan metrik kuantitatif dan data historis menyebabkan tingkat kepuasan pengguna hanya diasumsikan secara subjektif tanpa bukti empiris.
2. **Absensi Mekanisme Deteksi Dini (Early Warning)**: Keluhan atau degradasi kualitas layanan sering kali baru teridentifikasi setelah mencapai titik kritis, sehingga penanganan bersifat reaktif.
3. **Subjektivitas Prioritas Pengembangan**: Tim pengembang kesulitan menentukan skala prioritas pembaruan fitur karena minimnya data objektif mengenai kebutuhan nyata pengguna.
4. **Rendahnya User Engagement**: Kanal aspirasi formal yang terbatas atau rumit menyebabkan pengguna enggan menyampaikan masukan.

---

## 4. Tujuan & Target Strategis Prototype

1. **Integrasi Lintas Platform**: Membangun arsitektur fleksibel yang mudah diintegrasikan ke berbagai aplikasi internal melalui pilot project.
2. **Multimodal Feedback**: Instrumen ganda berupa *Quick Feedback* (rating 1-5 bintang) untuk respon cepat dan *Extended Survey* untuk penggalian data kualitatif mendalam.
3. **Visualisasi Real-Time**: Dashboard sentral performa kepuasan aplikasi demi transparansi kualitas layanan.
4. **Standardisasi Metrik Kepuasan**: Menciptakan *Single Source of Truth* untuk membandingkan kualitas antar-layanan secara adil dan objektif.

---

## 5. Fitur Utama Sistem

1. **Quick Feedback Widget (Pop-Up Survey Cepat)**:
   - Muncul otomatis berbasis kondisi trigger (misal: setelah menyelesaikan transaksi utama/simpan KSM/unduh invoice).
   - Rating bintang 1 sampai 5.
   - Kolom komentar singkat (opsional).
   - Tombol "Kirim" langsung kirim ke backend API.
   - Tombol "Isi Survei Lengkap" redirect ke Extended Survey.
2. **Extended Survey Form (Survei Lanjutan)**:
   - Formulir survei terstruktur dengan pertanyaan dinamis dari database.
   - Penilaian kualitas fitur (skala 1-5).
   - Penilaian kecepatan aplikasi (skala 1-5).
   - Penilaian kemudahan penggunaan (skala 1-5).
   - Kolom isian keluhan utama (teks bebas).
   - Kolom isian saran pengembangan (teks bebas).
   - Redirect otomatis kembali ke aplikasi asal setelah submit.
3. **Integrasi Single Sign-On (SSO)**:
   - Otomatis membaca token SSO (OAuth 2.0 / LDAP) Telkom University.
   - Menyimpan `user_id` (NIP/NIM), nama, dan email tanpa proses login terpisah.
4. **Dashboard Analitik Real-Time**:
   - 4 Kartu KPI: Total Feedback, Rata-rata Rating (CSAT), Response Rate, Aplikasi Bermasalah.
   - Grafik tren rating harian, mingguan, dan bulanan.
   - Peringkat aplikasi: Daftar aplikasi rating tertinggi (Top) dan terendah (Bottom).
   - Analisis kategori keluhan dan Word Cloud frekuensi kata komentar pengguna.
   - Filter komprehensif: rentang tanggal, filter aplikasi, filter rating, dan pencarian kata kunci.
5. **Integrasi Multi-Aplikasi**:
   - Satu endpoint API terpusat untuk semua aplikasi client.
   - Autentikasi menggunakan API Key unik per aplikasi.
6. **Early Warning System**:
   - Deteksi otomatis penurunan rata-rata rating lebih dari 0.5 poin dalam periode 7 hari terakhir.
   - Notifikasi email otomatis kepada admin aplikasi yang bersangkutan melalui scheduler/cron job harian.

---

## 6. Batasan Prototype

- **Aplikasi Pilot**: Maksimal 5 aplikasi internal pilot:
  1. Portal Akademik (Layanan Akademik Utama)
  2. Sistem Keuangan (Administrasi & Tagihan UKT)
  3. E-Learning LMS (Platform Kuliah Online CeLOE)
  4. Sistem Absensi (Presensi Mahasiswa & Pegawai)
  5. Repository Digital (OpenLibrary & Publikasi)
- **Lingkungan**: Staging/development server (single server deployment).
- **Kapasitas Database**: Maksimal 10.000 record feedback pada fase pengujian.
- **Platform Client**: Web-based (browser); integrasi mobile SDK ditargetkan pada tahap produksi.
- **Rate Limiting**: 100 request/menit per aplikasi pada prototype (target produksi: 1.000 req/menit).
- **Analisis Kata**: Word cloud dibangun berbasis frekuensi kata manual (NLP otomatis pada fase produksi).
- **Notifikasi**: Email SMTP (in-app alert & SMS pada tahap produksi).

---

## 7. Golden Circle & Lean Canvas

### Golden Circle
- **WHY**: Kualitas layanan digital tidak hanya diukur dari fungsinya, tetapi dari seberapa baik ia melayani penggunanya. Setiap aplikasi harus dikembangkan berdasarkan suara nyata pengguna, bukan asumsi, demi terciptanya ekosistem digital yang humanis dan unggul.
- **HOW**: Menciptakan cara paling sederhana dan non-intrusif bagi pengguna untuk menyampaikan aspirasi via integrasi SSO dan widget cerdas, mengubah feedback terserak menjadi wawasan terstruktur real-time.
- **WHAT**: SENADA — Platform manajemen pengalaman pengguna terintegrasi yang menyediakan rating cepat, survei mendalam, dan dashboard analitik proaktif.

### Lean Canvas
- **High Level Concept**: *"The Google Analytics for User Satisfaction"* — khusus ekosistem aplikasi internal organisasi/kampus.
- **Problem**: Feedback tidak terstruktur/informal, tidak ada UX metrics kuantitatif, keterlambatan identifikasi masalah teknis.
- **Solution**: Embedded Feedback Widget, Extended Survey, Real-Time Dashboard & Early Warning System.
- **Unfair Advantage**: Integrasi Native dengan SSO Tel-U dan akses langsung ke seluruh API internal kampus.
- **Key Metrics**: Response Rate, Average Rating (CSAT), Resolution Time (waktu respons tren penurunan rating).
- **Customer Segments**: Pimpinan TI/Direktorat, Pengembang Aplikasi, Manajer Produk. Early adopter: Pengguna aplikasi paling kritikal.
- **Cost Effectiveness**: Efisiensi jam kerja survei manual dan pencegahan biaya fitur yang tidak tepat sasaran (*waste reduction*).

---

## 8. Spesifikasi Teknis & Skema Database

### Skema 4 Tabel Inti
1. `applications`: `app_id` (PK), `name`, `code`, `category`, `description`, `api_key`, `trigger_condition`, `admin_email`, `active_users`.
2. `feedback`: `feedback_id` (PK), `app_id` (FK), `user_id`, `user_name`, `user_role`, `rating` (1-5), `comment`, `created_at`.
3. `survey_questions`: `question_id` (PK), `question_text`, `type` (rating/text), `order_index`.
4. `survey_responses`: `response_id` (PK), `feedback_id` (FK), `question_id` (FK), `answer`.
5. Tabel Tambahan: `early_warning_logs` (`id`, `app_id`, `drop_amount`, `current_rating`, `previous_rating`, `sent_to`, `created_at`).

### Kontrak Endpoint API
- `POST /api/feedback/quick`
- `POST /api/feedback/extended`
- `GET /api/survey/questions`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/app/{id}`
- `GET /api/apps`
- `POST /api/apps`
- `PUT /api/apps/{id}`
- `POST /api/early-warning/check`
- Artisan Command: `php artisan senada:check-early-warning`
