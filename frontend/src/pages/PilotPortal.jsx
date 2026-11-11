import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  FileText,
  CreditCard,
  BookOpen,
  QrCode,
  Library,
  MessageSquarePlus,
} from 'lucide-react';
import QuickFeedbackModal from '../components/widget/QuickFeedbackModal';
import { fetchApps } from '../services/api';

const APP_SCENARIOS = {
  'portal-akademik': {
    navItems: ['Dashboard', 'Jadwal', 'Nilai', 'Profil'],
    actionTitle: 'Registrasi KSM & Cetak Kartu Hasil Studi (KHS)',
    actionDesc:
      'Simulasikan aksi penting mahasiswa/dosen di Portal Akademik. Setelah menekan tombol aksi di bawah, trigger kondisi SENADA akan otomatis memunculkan Pop-Up Quick Feedback Widget.',
    buttonLabel: 'Simpan KSM & Unduh Transkrip Semester',
    icon: FileText,
    metrics: [
      { label: 'Status Registrasi', value: 'Aktif — Semester Ganjil 2026/2027' },
      { label: 'Total SKS Diambil', value: '21 SKS (7 Mata Kuliah)' },
      { label: 'IPK Kumulatif', value: '3.84 / 4.00' },
    ],
  },
  'sistem-keuangan': {
    navItems: ['Tagihan UKT', 'Virtual Account', 'Riwayat', 'Bantuan'],
    actionTitle: 'Konfirmasi Pembayaran BPP / Unduh Invoice UKT',
    actionDesc:
      'Simulasikan proses cek tagihan dan unduh bukti pembayaran BPP/UKT pada Sistem Keuangan.',
    buttonLabel: 'Verifikasi Pembayaran & Unduh Invoice',
    icon: CreditCard,
    metrics: [
      { label: 'Status Tagihan Semester', value: 'Lunas Terverifikasi' },
      { label: 'Metode Pembayaran', value: 'Virtual Account BNI / Mandiri' },
      { label: 'Nomor Referensi', value: 'INV-TELU-2026-09821' },
    ],
  },
  'elearning-lms': {
    navItems: ['Mata Kuliah', 'Tugas & Kuis', 'Forum Diskusi', 'Sertifikat'],
    actionTitle: 'Pengumpulan Tugas Besar & Kuis CeLOE LMS',
    actionDesc:
      'Simulasikan aksi pengumpulan berkas tugas kuliah pada E-Learning LMS.',
    buttonLabel: 'Kumpulkan Berkas Tugas Sekarang',
    icon: BookOpen,
    metrics: [
      { label: 'Mata Kuliah Aktif', value: 'Rekayasa Perangkat Lunak Lanjut' },
      { label: 'Progres Materi', value: '92% Selesai (Minggu 13)' },
      { label: 'Batas Waktu Tugas', value: 'Tepat Waktu' },
    ],
  },
  'sistem-absensi': {
    navItems: ['Presensi Harian', 'Scan QR Kelas', 'Rekap Kehadiran', 'Izin/Cuti'],
    actionTitle: 'Check-In Presensi Kehadiran Civitas Tel-U',
    actionDesc:
      'Simulasikan pemindaian QR-Code kehadiran kuliah/kerja pada Sistem Absensi.',
    buttonLabel: 'Konfirmasi Kehadiran (Check-In)',
    icon: QrCode,
    metrics: [
      { label: 'Persentase Kehadiran', value: '96.5% Bulan Ini' },
      { label: 'Lokasi Terdeteksi', value: 'Gedung Bangkit — Kampus Tel-U' },
      { label: 'Status Sesi', value: 'Terverifikasi SSO' },
    ],
  },
  'repository-digital': {
    navItems: ['Katalog Buku', 'Tugas Akhir', 'Jurnal Ilmiah', 'Unggah Karya'],
    actionTitle: 'Unduh Dokumen Karya Ilmiah & Tugas Akhir',
    actionDesc:
      'Simulasikan pengunduhan naskah jurnal atau unggah dokumen Tugas Akhir di OpenLibrary Repository.',
    buttonLabel: 'Unduh Dokumen Full-Text PDF',
    icon: Library,
    metrics: [
      { label: 'Koleksi Digital', value: '142.500+ Dokumen Ilmiah' },
      { label: 'Status Akses Civitas', value: 'Full Access (SSO Tel-U)' },
      { label: 'Kuota Unduhan', value: 'Tidak Terbatas' },
    ],
  },
};

export default function PilotPortal({ onNavigateExtended }) {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [widgetOpen, setWidgetOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchApps()
      .then((data) => {
        setApps(data);
        if (data.length > 0) {
          setSelectedApp(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const currentApp = selectedApp || {
    app_id: 1,
    name: 'Portal Akademik',
    code: 'portal-akademik',
    trigger_condition: 'Setelah simpan KSM / Cetak KHS',
  };

  const scenario =
    APP_SCENARIOS[currentApp.code] || APP_SCENARIOS['portal-akademik'];
  const IconComp = scenario.icon;

  const handleTriggerAction = () => {
    setWidgetOpen(true);
  };

  const handleSuccessQuick = (feedbackData) => {
    setWidgetOpen(false);
    setToastMessage(
      `Feedback cepat (${feedbackData?.rating || 5} ★) untuk ${currentApp.name} berhasil dikirim ke server SENADA!`
    );
    setTimeout(() => setToastMessage(''), 5000);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0f2547] text-white flex flex-col">
      <div className="bg-[#091830] border-b border-white/10 px-6 py-3">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 font-bold text-xs">
              T
            </div>
            <span className="font-bold text-sm tracking-wide">
              {currentApp.name} Telkom University
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-300">
            {scenario.navItems.map((item, idx) => (
              <span
                key={item}
                className={
                  idx === 0
                    ? 'font-semibold text-white underline underline-offset-8 decoration-blue-400'
                    : 'hover:text-white cursor-pointer'
                }
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-6 flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900/60 p-4 border border-white/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-blue-300 font-semibold block">
              Simulator 5 Aplikasi Internal Pilot (Bab 7.1 Dokumen Inovasi)
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              Pilih salah satu aplikasi pilot di sebelah kanan untuk menguji integrasi lintas-platform SENADA.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {apps.map((app) => {
              const active = app.app_id === currentApp.app_id;
              return (
                <button
                  key={app.app_id}
                  type="button"
                  onClick={() => {
                    setSelectedApp(app);
                    setWidgetOpen(false);
                  }}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {app.name}
                </button>
              );
            })}
          </div>
        </div>

        {toastMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateExtended(currentApp, null)}
              className="font-semibold underline hover:text-white"
            >
              Isi Survei Lanjutan →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-400/30 text-blue-300">
                  <IconComp className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs text-blue-300 font-medium">
                    {currentApp.category || 'Aplikasi Internal Tel-U'}
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    {scenario.actionTitle}
                  </h2>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-slate-300">
                API Key: {currentApp.api_key?.slice(0, 18)}...
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {scenario.actionDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {scenario.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-slate-900/50 border border-white/10 p-3.5"
                >
                  <div className="text-[11px] text-slate-400">{m.label}</div>
                  <div className="text-xs font-bold text-white mt-1">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTriggerAction}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition"
              >
                <Sparkles className="h-4 w-4" />
                {scenario.buttonLabel} (Trigger Pop-Up SENADA)
              </button>

              <button
                type="button"
                onClick={() => setWidgetOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                <MessageSquarePlus className="h-4 w-4 text-amber-400" />
                Buka Quick Feedback Widget
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                Informasi Embedded Widget SENADA
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Sesuai <strong>Lampiran A.1 Dokumen Inovasi</strong>, komponen Quick Feedback Widget
                tertanam secara non-intrusif di aplikasi asal dan mengirim data ke endpoint tunggal:
              </p>
              <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-emerald-300 border border-slate-800 mb-4">
                POST /api/feedback/quick
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-slate-400">Kondisi Trigger:</span>
                  <span className="font-medium text-right">{currentApp.trigger_condition}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5">
                  <span className="text-slate-400">Rata-rata Rating Saat Ini:</span>
                  <span className="font-bold text-amber-400">{currentApp.avg_rating || 4.2} ★</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-400">Total Responden:</span>
                  <span className="font-semibold">{currentApp.total_feedback || 0} Feedback</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateExtended(currentApp, null)}
              className="mt-6 w-full rounded-xl bg-indigo-600/30 border border-indigo-400/40 px-4 py-2.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-600/40 transition"
            >
              Buka Halaman Extended Survey ({currentApp.name}) →
            </button>
          </div>
        </div>
      </div>

      <QuickFeedbackModal
        isOpen={widgetOpen}
        onClose={() => setWidgetOpen(false)}
        app={currentApp}
        onSuccessSubmit={handleSuccessQuick}
        onGoToExtended={(app, feedbackId) => {
          setWidgetOpen(false);
          onNavigateExtended(app, feedbackId);
        }}
      />
    </div>
  );
}
