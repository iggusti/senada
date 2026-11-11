# AGENTS.md — SENADA (Survey Experience dan Feedback Aplikasi)

## Konteks Proyek & Riwayat Sesi Sebelumnya

Proyek ini adalah implementasi **Inovasi Tahap Prototype Tahun 2026 — Telkom University** bernama **SENADA (*Survey Experience dan Feedback Aplikasi*)**, yang diusulkan oleh **Ilham Gumantung Gusti** (NIP: `26970004`, Urusan Pengembangan Produk TI Strategis) bersama anggota tim: Riky Faza, Yulio Ferdinand, Aryo Yusuf Dinanda, dan Amira Nur Khalipah (disetujui oleh Rio Guntur Utomo, S.T., M.T., Ph.D., NIP `22900021`).

Seluruh rincian proposal 33 halaman, arsitektur, Lean Canvas, dan Golden Circle telah diabadikan secara mandiri di:
- `docs/DOKUMEN_INOVASI_SENADA.md` (arsip lengkap isi dokumen proposal inovasi)
- `PLANNING.md` (arsip blueprint implementasi teknis dan skema sistem)
- `README.md` (panduan instalasi dan pengujian)

Sesi percakapan awal (`da6e2ab8-8e95-4039-b39f-36fd9c5e7c7a`) sudah diabadikan ke dalam repositori sehingga aman untuk dihapus.

## Aturan Utama Proyek

1. **100% Gratis (Zero-Cost Stack)**: Seluruh teknologi, library, database, autentikasi SSO simulasi, dan layanan pengiriman email wajib menggunakan solusi gratis / *open-source* / *free-tier*.
2. **Tanpa Komentar di Dalam Kode**: Jangan menambahkan komentar (`//`, `/* */`, `<!-- -->`, `#`) di dalam file kode sumber.

## Struktur & Status Implementasi Saat Ini

Seluruh fondasi prototype sudah dibuat dan database sudah di-*migrate* serta di-*seed*:

- `backend/` — **Laravel 11 REST API** (PHP 8.2+):
  - Database default menggunakan SQLite (`backend/database/database.sqlite`, sudah terisi data seeder) dan juga kompatibel penuh dengan MySQL 8 (`docker-compose.yml` / XAMPP).
  - 4 Tabel Utama sesuai Bab 9 Dokumen Inovasi: `applications`, `feedback`, `survey_questions`, `survey_responses`, ditambah `early_warning_logs`.
  - 6 Kontrak Endpoint API sesuai Bab 8 Dokumen Inovasi di `backend/routes/api.php`:
    - `POST /api/feedback/quick`
    - `POST /api/feedback/extended`
    - `GET /api/survey/questions`
    - `GET /api/dashboard/summary`
    - `GET /api/dashboard/app/{id}`
    - `GET /api/apps` (serta `POST /api/apps`, `PUT /api/apps/{id}`, dan `POST /api/early-warning/check`)
  - Cron Job Early Warning System: `php artisan senada:check-early-warning` (mendeteksi penurunan rating `> 0.5` poin dalam 7 hari terakhir).
- `frontend/` — **React 18 + Vite + Tailwind CSS 3**:
  - `src/components/widget/QuickFeedbackModal.jsx` — Pop-up Quick Feedback Widget (sesuai Mockup Lampiran A.1).
  - `src/pages/ExtendedSurvey.jsx` — Halaman Survei Lanjutan dinamis dengan verifikasi SSO otomatis (sesuai Mockup Lampiran A.2).
  - `src/pages/AdminDashboard.jsx` — Dashboard Analitik Real-Time dengan 4 kartu KPI, grafik tren harian/mingguan/bulanan, perbandingan aplikasi, Word Cloud frekuensi kata manual, manajemen aplikasi, dan panel Early Warning (sesuai Mockup Lampiran A.3).
  - `src/pages/PilotPortal.jsx` — Simulator interaktif 5 Aplikasi Internal Pilot Tel-U (*Portal Akademik, Sistem Keuangan, E-Learning LMS, Sistem Absensi, Repository Digital*).

## Perintah Menjalankan Proyek

- Menjalankan Backend API (`http://127.0.0.1:8000`):
  `cd backend && php artisan serve --port=8000`
- Menjalankan Frontend Vite (`http://localhost:5173`):
  `cd frontend && npm run dev`
- Atau jalankan sekaligus dari root:
  `.\start-senada.ps1`
