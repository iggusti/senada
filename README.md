# SENADA — Survey Experience dan Feedback Aplikasi
**Inovasi Tahap Prototype — Telkom University (2026)**

SENADA adalah platform manajemen pengalaman pengguna (*User Experience Management*) terintegrasi yang memantau dan menganalisis kepuasan pengguna pada ekosistem aplikasi internal Telkom University secara *real-time*.

---

## Cara Melanjutkan Sesi Ini di Workspace `senada`

Karena ruang kerja (*workspace*) aktif di aplikasi Antigravity tidak dapat dipindah secara otomatis oleh agen dari dalam sesi chat, Anda dapat memindahkan/melanjutkan sesi ini ke workspace `senada` dengan langkah berikut:

1. **Buka Folder Project `senada` di Antigravity**:
   - Di **Antigravity 2.0**: Klik menu **Projects** di sidebar kiri, lalu tambahkan/pilih folder `C:\Users\DevTI-TelU\Code\Self-Taught\senada`.
   - Di **Antigravity IDE**: Klik **File > Open Folder...** dan pilih `C:\Users\DevTI-TelU\Code\Self-Taught\senada`.
2. **Tautkan Riwayat Chat Ini (`@ Mention`)**:
   - Di kolom chat pada workspace `senada` yang baru dibuka, ketik `@` lalu pilih **Previous Conversations** dan pilih percakapan ini (atau cukup minta agen membaca `PLANNING.md` dan `README.md` di root project).

---

## Cara Menjalankan Aplikasi (100% Gratis / Lokal)

Seluruh kode **Backend (Laravel 11 + SQLite/MySQL)** dan **Frontend (React 18 + Vite + Tailwind CSS 3)** sudah selesai dibangun dan database sudah terisi otomatis (*seeded*) dengan **5 Aplikasi Pilot Tel-U**.

### Opsi 1: Jalankan Sekaligus via Script PowerShell
```powershell
.\start-senada.ps1
```

### Opsi 2: Jalankan Manual di 2 Terminal
**Terminal 1 — Backend API Laravel (`http://127.0.0.1:8000`)**:
```powershell
cd backend
php artisan serve --port=8000
```

**Terminal 2 — Frontend React + Vite (`http://localhost:5173`)**:
```powershell
cd frontend
npm run dev
```

### Perintah Tambahan (Reset Data & Cron Early Warning)
- **Reset & Seed ulang Database**:
  ```powershell
  cd backend
  php artisan migrate:fresh --seed
  ```
- **Jalankan Deteksi Early Warning System (Penurunan > 0.5 poin dalam 7 hari)**:
  ```powershell
  cd backend
  php artisan senada:check-early-warning
  ```
