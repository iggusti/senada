# Rencana Pengembangan & Dokumentasi Arsitektur SENADA
**Survey Experience dan Feedback Aplikasi — Tahap Prototype (Telkom University 2026)**

---

## 1. Ringkasan Eksekutif Inovasi
- **Nama Inovasi**: SENADA (*Survey Experience dan Feedback Aplikasi*)
- **Konsep Utama**: *"The Google Analytics for User Satisfaction"* khusus untuk ekosistem aplikasi internal organisasi/kampus.
- **Tiga Pilar Utama**:
  1. **Efisien**: Pengumpulan data instan melalui *Quick Feedback Widget* (pop-up non-intrusif) dan integrasi *Single Sign-On* (SSO) Telkom University untuk validasi profil otomatis.
  2. **Terpusat**: Analitik satu pintu (*Single Source of Truth*) melalui Dashboard Admin real-time untuk membandingkan performa antar-aplikasi secara objektif.
  3. **Responsif**: *Early Warning System* yang mendeteksi penurunan rating `> 0.5` poin dalam rentang 7 hari dan mengirimkan notifikasi email otomatis ke pengelola aplikasi.

---

## 2. Stack Teknologi 100% Gratis (Zero-Cost Architecture)

| Layer | Teknologi | Versi | Lisensi / Strategi Gratis |
| :--- | :--- | :--- | :--- |
| **Frontend & Widget** | React.js + Vite | 18.x | MIT License (100% Gratis & Open Source) |
| **Styling** | Tailwind CSS | 3.x | MIT License (100% Gratis & Open Source) |
| **Backend API** | Laravel (PHP) | 11.x | MIT License (Berjalan di PHP 8.2+ lokal/Docker) |
| **Database** | MySQL 8.x / SQLite | 8.x | GPLv2 / Public Domain (Mendukung MySQL 8 XAMPP/Docker & SQLite Zero-Config) |
| **Auth / SSO** | OAuth 2.0 / LDAP (Simulasi SSO Tel-U) | — | Modul SSO Token Provider internal untuk prototype tanpa biaya lisensi |
| **Cache & Rate Limit** | Redis / Laravel Cache | 7.x | BSD License (Docker Redis atau driver `database`/`file` bawaan Laravel) |
| **Notifikasi Email** | Laravel Queue + Mail (SMTP) | — | Mailpit (Lokal Gratis) / Gmail SMTP / Brevo Free Tier (300 email/hari) |
| **Deployment** | Docker + Nginx | — | Apache 2.0 / BSD (Docker Compose lokal atau Free Tier Cloud) |

---

## 3. Spesifikasi 7 Modul Fungsional Prototype

1. **Modul Auth (SSO)**: Identifikasi pengguna otomatis dari token SSO Tel-U (`user_id` berupa NIP/NIM) tanpa perlu login terpisah saat memberi feedback atau mengisi survei lanjutan.
2. **Modul Quick Feedback Widget**: Pop-up overlay di aplikasi internal dengan rating bintang 1–5, komentar singkat opsional, tombol `"Kirim"` (`POST /api/feedback/quick`), dan tombol `"Isi Survei Lengkap"` menuju halaman Extended Survey.
3. **Modul Extended Survey**: Halaman survei lanjutan yang memuat daftar pertanyaan dinamis dari tabel `survey_questions` (`GET /api/survey/questions`) dan menyimpan jawaban ke `survey_responses` (`POST /api/feedback/extended`), lalu melakukan redirect kembali ke aplikasi asal.
4. **Modul Dashboard Admin Real-Time**: Menampilkan kartu KPI (*Total Feedback, Rata-rata Rating, Response Rate, Aplikasi Bermasalah*), grafik tren harian/mingguan/bulanan, daftar *Top & Bottom Apps*, **Word Cloud** frekuensi kata manual, serta filter tanggal, aplikasi, rating, dan kata kunci.
5. **Modul Early Warning System**: Pemeriksaan terjadwal (*cron job* harian `php artisan senada:check-early-warning`) yang mendeteksi penurunan rating `> 0.5` poin dalam 7 hari terakhir dan mengirim alert email otomatis.
6. **Modul Manajemen Aplikasi**: Pendaftaran aplikasi internal baru, pembuatan `api_key` unik, konfigurasi kondisi trigger pop-up, dan pemantauan detail per aplikasi.
7. **Modul API Multi-App**: Satu kontrak API terpusat yang diamankan dengan `X-API-Key` per aplikasi dan *rate limiting* (100 req/menit pada prototype, 1.000 req/menit pada produksi).

---

## 4. Rancangan Database (4 Tabel Inti)

### 4.1 Tabel `applications`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `app_id` | `INT / BIGINT` | Primary Key, ID unik aplikasi |
| `name` | `VARCHAR(100)` | Nama aplikasi (misal: Portal Akademik) |
| `description` | `TEXT` | Deskripsi singkat aplikasi |
| `api_key` | `VARCHAR(64)` | Kunci autentikasi API per aplikasi |
| `trigger_condition` | `VARCHAR(100)` | Kondisi pemicu pop-up widget |
| `admin_email` | `VARCHAR(100)` | Email admin penerima Early Warning |

### 4.2 Tabel `feedback`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `feedback_id` | `INT / BIGINT` | Primary Key |
| `app_id` | `INT / BIGINT (FK)` | Relasi ke tabel `applications` |
| `user_id` | `VARCHAR(50)` | NIP/NIM dari token SSO Tel-U |
| `rating` | `INT (1-5)` | Nilai rating bintang 1 s.d. 5 |
| `comment` | `TEXT` | Komentar singkat (opsional) |
| `created_at` | `DATETIME` | Waktu feedback diberikan |

### 4.3 Tabel `survey_questions`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `question_id` | `INT / BIGINT` | Primary Key |
| `question_text` | `TEXT` | Teks pertanyaan yang ditampilkan |
| `type` | `ENUM('rating','text')` | Tipe input pertanyaan |
| `order_index` | `INT` | Urutan tampilan pertanyaan |

### 4.4 Tabel `survey_responses`
| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `response_id` | `INT / BIGINT` | Primary Key |
| `feedback_id` | `INT / BIGINT (FK)` | Relasi ke tabel `feedback` |
| `question_id` | `INT / BIGINT (FK)` | Relasi ke tabel `survey_questions` |
| `answer` | `TEXT` | Jawaban pengguna (nilai skala 1-5 atau teks bebas) |

---

## 5. Kontrak Endpoint API Backend

| Method | Endpoint | Deskripsi | Payload / Response |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/feedback/quick` | Submit quick feedback dari pop-up widget | Body: `app_id`, `user_id`, `rating`, `comment` |
| `POST` | `/api/feedback/extended` | Submit jawaban survei lanjutan | Body: `feedback_id`, `responses[]` |
| `GET` | `/api/survey/questions` | Ambil daftar pertanyaan survei lanjutan | Response: `[{ question_id, question_text, type, order_index }]` |
| `GET` | `/api/dashboard/summary` | Ambil ringkasan dashboard admin & grafik tren | Response: `total_feedback`, `avg_rating`, `response_rate`, `problematic_apps_count`, `trend`, `top_apps`, `low_apps`, `early_warnings`, `word_cloud` |
| `GET` | `/api/dashboard/app/{id}` | Ambil detail rating, kategori keluhan, & word cloud per aplikasi | Response: `app`, `trend`, `complaint_categories`, `word_cloud`, `recent_feedback` |
| `GET` | `/api/apps` | Daftar semua aplikasi yang terdaftar di SENADA | Response: `[{ app_id, name, avg_rating, total_feedback, ... }]` |
| `POST` | `/api/apps` | Registrasi aplikasi baru di Manajemen Aplikasi | Body: `name`, `description`, `trigger_condition`, `admin_email` |
| `POST` | `/api/early-warning/check` | Memicu pengecekan Early Warning & kirim notifikasi email | Response: daftar aplikasi yang mengalami penurunan `> 0.5` poin dalam 7 hari |

---

## 6. Aplikasi Pilot pada Tahap Prototype
Sesuai Bab 7.1 Batasan Fungsional, terdapat **5 Aplikasi Internal Pilot** yang terintegrasi:
1. **Portal Akademik** (iGracias / Akademik Terpadu)
2. **Sistem Keuangan** (Pembayaran UKT & Anggaran)
3. **E-Learning LMS** (CeLOE Learning Management System)
4. **Sistem Absensi** (Presensi Pegawai & Perkuliahan)
5. **Repository Digital** (OpenLibrary & Karya Ilmiah)
