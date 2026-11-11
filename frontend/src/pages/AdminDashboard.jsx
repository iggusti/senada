import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  AppWindow,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  Settings,
  Search,
  PlusCircle,
  BellRing,
  RefreshCw,
  Star,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import {
  createApp,
  fetchAppDetail,
  fetchDashboardSummary,
  triggerEarlyWarningCheck,
} from '../services/api';

export default function AdminDashboard({ onOpenSurveyForApp }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [period, setPeriod] = useState('weekly');
  const [filterApp, setFilterApp] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [summary, setSummary] = useState(null);
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAlert, setCheckingAlert] = useState(false);
  const [alertResultMsg, setAlertResultMsg] = useState('');

  const [newAppForm, setNewAppForm] = useState({
    name: '',
    category: 'Layanan Akademik & Operasional',
    description: '',
    trigger_condition: 'Setelah pengguna menyelesaikan transaksi utama',
    admin_email: 'admin-ti@telkomuniversity.ac.id',
  });
  const [creatingApp, setCreatingApp] = useState(false);

  const loadDashboard = () => {
    setLoading(true);
    fetchDashboardSummary({
      period,
      app_id: filterApp,
      rating: filterRating,
      keyword: filterKeyword,
    })
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, [period, filterApp, filterRating]);

  const handleInspectApp = (appId) => {
    fetchAppDetail(appId)
      .then((detail) => {
        setSelectedAppDetail(detail);
        setActiveMenu('analitik');
      })
      .catch(() => {});
  };

  const handleRunEarlyWarning = async () => {
    setCheckingAlert(true);
    setAlertResultMsg('');
    try {
      const res = await triggerEarlyWarningCheck();
      setAlertResultMsg(res.message);
      loadDashboard();
    } catch (e) {
      setAlertResultMsg('Gagal memicu cron job Early Warning.');
    } finally {
      setCheckingAlert(false);
    }
  };

  const handleCreateApp = async (e) => {
    e.preventDefault();
    if (!newAppForm.name.trim() || !newAppForm.description.trim()) return;
    setCreatingApp(true);
    try {
      await createApp(newAppForm);
      setNewAppForm({
        name: '',
        category: 'Layanan Akademik & Operasional',
        description: '',
        trigger_condition: 'Setelah pengguna menyelesaikan transaksi utama',
        admin_email: 'admin-ti@telkomuniversity.ac.id',
      });
      loadDashboard();
    } catch (err) {
    } finally {
      setCreatingApp(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'aplikasi', label: 'Aplikasi', icon: AppWindow },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'analitik', label: 'Analitik', icon: BarChart3 },
    { id: 'early-warning', label: 'Early Warning', icon: AlertTriangle },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const trendPoints = summary?.trend || [];

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0b1325] text-slate-100 flex">
      <aside className="w-60 shrink-0 bg-[#080f1e] border-r border-slate-800/80 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 font-bold text-sm text-white">
              S
            </div>
            <span className="font-bold tracking-wider text-sm text-white">
              SENADA
            </span>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.id === 'early-warning' &&
                    (summary?.problematic_apps_count || 0) > 0 && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                        {summary.problematic_apps_count}
                      </span>
                    )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 text-[11px] text-slate-400">
          <div className="font-semibold text-slate-200 mb-1">
            Single Source of Truth
          </div>
          <div>Telkom University — 2026</div>
          <div className="text-emerald-400 mt-1">● API Status: Online (&lt;150ms)</div>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="text-lg font-bold text-white">Dashboard SENADA</h1>
            <p className="text-xs text-slate-400">
              Pemantauan Kepuasan Pengguna — Real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'daily', label: 'Harian' },
              { id: 'weekly', label: 'Mingguan' },
              { id: 'monthly', label: 'Bulanan' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  period === p.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800/90 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {activeMenu === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-xl bg-[#131f37] border border-slate-800 p-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  TOTAL FEEDBACK
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {summary?.total_feedback ?? 160}
                </div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-1">
                  ↑ +{summary?.weekly_growth_pct ?? 12}% minggu ini
                </div>
              </div>

              <div className="rounded-xl bg-[#131f37] border border-slate-800 p-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  RATA-RATA RATING
                </div>
                <div className="text-2xl font-extrabold text-white mt-1 flex items-center gap-1.5">
                  <span>{summary?.avg_rating ?? 4.2}</span>
                  <span className="text-amber-400 text-xl">★</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-1">
                  ↑ +0.3 dari bulan lalu
                </div>
              </div>

              <div className="rounded-xl bg-[#131f37] border border-slate-800 p-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  RESPONSE RATE
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {summary?.response_rate ?? 68}%
                </div>
                <div className="text-[11px] font-semibold text-emerald-400 mt-1">
                  ↑ +5% minggu ini
                </div>
              </div>

              <div className="rounded-xl bg-[#131f37] border border-slate-800 p-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  APLIKASI BERMASALAH
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {summary?.problematic_apps_count ?? 2}
                </div>
                <div className="text-[11px] font-semibold text-red-400 mt-1">
                  ! Early warning aktif
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#131f37] border border-slate-800 p-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-[200px] rounded-lg bg-slate-900/90 border border-slate-700/80 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadDashboard()}
                  placeholder="Filter kata kunci komentar, nama, atau NIM/NIP..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <select
                value={filterApp}
                onChange={(e) => setFilterApp(e.target.value)}
                className="rounded-lg bg-slate-900/90 border border-slate-700/80 px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Semua Aplikasi Pilot (5)</option>
                {(summary?.apps || []).map((a) => (
                  <option key={a.app_id} value={a.app_id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="rounded-lg bg-slate-900/90 border border-slate-700/80 px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Semua Rating (1-5 ★)</option>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    Rating {r} Bintang
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={loadDashboard}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Terapkan
              </button>
            </div>

            <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Tren Rating{' '}
                    {period === 'daily'
                      ? 'Harian'
                      : period === 'monthly'
                      ? 'Bulanan'
                      : 'Mingguan'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Visualisasi rata-rata kepuasan pengguna (skala 1.0 – 5.0)
                  </p>
                </div>
                <span className="text-xs text-blue-400 font-semibold">
                  Target Standar Layanan: ≥ 4.0 ★
                </span>
              </div>

              <div className="grid grid-cols-7 gap-3 items-end h-44 pt-4 px-2">
                {trendPoints.map((pt, idx) => {
                  const heightPct = Math.max(
                    18,
                    Math.min(100, Math.round((pt.avg_rating / 5) * 100))
                  );
                  const isHighest = idx === trendPoints.length - 2;
                  return (
                    <div
                      key={pt.label}
                      className="flex flex-col items-center justify-end h-full group"
                    >
                      <div className="text-[11px] font-bold text-slate-300 mb-1.5">
                        {pt.avg_rating}★
                      </div>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHighest
                            ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                            : 'bg-blue-600/60 group-hover:bg-blue-500'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <div className="text-[10px] text-slate-400 mt-2 text-center truncate w-full">
                        {pt.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6">
                <h3 className="text-sm font-bold text-white mb-1">
                  Perbandingan Performa Antar-Aplikasi (Single Source of Truth)
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">
                  Klik aplikasi untuk membedah detail analitik & kategori keluhan
                </p>

                <div className="space-y-3">
                  {(summary?.top_apps || []).map((app) => {
                    const widthPct = Math.round((app.avg_rating / 5) * 100);
                    return (
                      <div
                        key={app.app_id}
                        onClick={() => handleInspectApp(app.app_id)}
                        className="cursor-pointer rounded-xl bg-slate-900/70 border border-slate-800 p-3.5 hover:border-blue-500/50 transition"
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{app.name}</span>
                            {app.has_early_warning && (
                              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                                Turun {app.rating_drop_7d} poin (7hr)
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-amber-400">
                            {app.avg_rating} ★ ({app.total_feedback} ulasan)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              app.has_early_warning ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">
                    Word Cloud Komentar & Kategori Keluhan Terbanyak
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-4">
                    Diekstrak dari frekuensi kata manual pada komentar pengguna (Bab 7.1)
                  </p>

                  <div className="flex flex-wrap gap-2 rounded-xl bg-slate-900/80 border border-slate-800 p-4 mb-5">
                    {(summary?.word_cloud || []).map((item, i) => {
                      const sizeClass =
                        i < 3
                          ? 'text-base font-extrabold text-blue-300 bg-blue-500/20 border-blue-400/30'
                          : i < 8
                          ? 'text-xs font-bold text-emerald-300 bg-emerald-500/15 border-emerald-400/30'
                          : 'text-[11px] font-medium text-slate-300 bg-slate-800 border-slate-700';
                      return (
                        <button
                          key={item.word}
                          type="button"
                          onClick={() => {
                            setFilterKeyword(item.word);
                            loadDashboard();
                          }}
                          className={`rounded-lg border px-2.5 py-1 transition hover:scale-105 ${sizeClass}`}
                        >
                          {item.word} ({item.count})
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  {(summary?.complaint_categories || []).slice(0, 4).map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between text-xs bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800/80"
                    >
                      <span className="text-slate-300">{cat.category}</span>
                      <span className="font-semibold text-blue-400">
                        {cat.count} laporan ({cat.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'aplikasi' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-bold text-white">
                Manajemen Aplikasi Terintegrasi (Modul 6 & 7)
              </h2>
              {(summary?.apps || []).map((app) => (
                <div
                  key={app.app_id}
                  className="rounded-xl bg-[#131f37] border border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-bold text-white">{app.name}</h3>
                      <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300">
                        {app.avg_rating} ★ ({app.total_feedback} Feedback)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{app.description}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400">
                      <span>
                        Trigger: <strong className="text-slate-200">{app.trigger_condition}</strong>
                      </span>
                      <span>
                        Admin: <strong className="text-slate-200">{app.admin_email}</strong>
                      </span>
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] text-emerald-400">
                      X-API-Key: {app.api_key}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleInspectApp(app.app_id)}
                      className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Detail Analitik
                    </button>
                    {onOpenSurveyForApp && (
                      <button
                        type="button"
                        onClick={() => onOpenSurveyForApp(app)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                      >
                        Uji Survei
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <PlusCircle className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Daftarkan Aplikasi Internal Baru
                </h3>
              </div>

              <form onSubmit={handleCreateApp} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Aplikasi</label>
                  <input
                    type="text"
                    required
                    value={newAppForm.name}
                    onChange={(e) =>
                      setNewAppForm({ ...newAppForm, name: e.target.value })
                    }
                    placeholder="Misal: Sistem Kepegawaian (HRIS)"
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    required
                    value={newAppForm.description}
                    onChange={(e) =>
                      setNewAppForm({ ...newAppForm, description: e.target.value })
                    }
                    placeholder="Fungsi utama aplikasi..."
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Kondisi Trigger Pop-up Widget
                  </label>
                  <input
                    type="text"
                    required
                    value={newAppForm.trigger_condition}
                    onChange={(e) =>
                      setNewAppForm({
                        ...newAppForm,
                        trigger_condition: e.target.value,
                      })
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Email Admin (Penerima Early Warning)
                  </label>
                  <input
                    type="email"
                    required
                    value={newAppForm.admin_email}
                    onChange={(e) =>
                      setNewAppForm({ ...newAppForm, admin_email: e.target.value })
                    }
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creatingApp}
                  className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-500"
                >
                  {creatingApp ? 'Mendaftarkan...' : 'Generate API Key & Simpan'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeMenu === 'feedback' && (
          <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6">
            <h2 className="text-base font-bold text-white mb-4">
              Aliran Feedback Real-Time & Jawaban Extended Survey
            </h2>
            <div className="space-y-3">
              {(summary?.recent_feedback || []).map((fb) => (
                <div
                  key={fb.feedback_id}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-blue-600/20 px-2.5 py-0.5 text-xs font-bold text-blue-300 border border-blue-500/30">
                        {fb.app_name}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {fb.user_name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (SSO ID: {fb.user_id} — {fb.user_role})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400">
                        {'★'.repeat(fb.rating)}
                        {'☆'.repeat(5 - fb.rating)} ({fb.rating}/5)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {fb.created_human}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {fb.comment || 'Tidak ada komentar teks.'}
                  </p>
                  {fb.has_extended && (
                    <div className="mt-3 rounded-lg bg-slate-950/80 border border-slate-800 p-3 space-y-1">
                      <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">
                        ✓ Dilengkapi Jawaban Survei Lanjutan (Extended Survey):
                      </div>
                      {fb.extended_responses.map((er, idx) => (
                        <div key={idx} className="text-[11px] text-slate-300">
                          <span className="text-slate-400">{er.question}:</span>{' '}
                          <strong className="text-white">{er.answer}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'analitik' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-white">
                Analitik Mendalam Per Aplikasi (`GET /api/dashboard/app/&#123;id&#125;`)
              </h2>
              <div className="flex flex-wrap gap-2">
                {(summary?.apps || []).map((a) => (
                  <button
                    key={a.app_id}
                    type="button"
                    onClick={() => handleInspectApp(a.app_id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      selectedAppDetail?.app?.app_id === a.app_id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedAppDetail ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6">
                  <h3 className="text-sm font-bold text-white mb-1">
                    {selectedAppDetail.app.name} — Rata-rata {selectedAppDetail.app.avg_rating} ★
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">
                    {selectedAppDetail.app.description}
                  </p>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">
                    Skor Instrumen Extended Survey (Skala 1-5)
                  </h4>
                  <div className="space-y-3">
                    {(selectedAppDetail.extended_metrics || []).map((m) => (
                      <div key={m.question_id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-200">{m.question_text}</span>
                          <span className="font-bold text-blue-400">
                            {m.avg_score} / 5.0
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(m.avg_score / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6">
                  <h3 className="text-sm font-bold text-white mb-3">
                    Distribusi Bintang & Kategori Keluhan ({selectedAppDetail.app.name})
                  </h3>
                  <div className="space-y-2 mb-6">
                    {(selectedAppDetail.rating_distribution || []).map((d) => (
                      <div key={d.star} className="flex items-center gap-3 text-xs">
                        <span className="w-12 text-amber-400 font-bold">
                          {d.star} ★
                        </span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${d.percentage}%` }}
                          />
                        </div>
                        <span className="w-20 text-right text-slate-400">
                          {d.count} ({d.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">
                    Word Cloud Aplikasi Ini
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedAppDetail.word_cloud || []).map((w) => (
                      <span
                        key={w.word}
                        className="rounded-md bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs text-slate-200"
                      >
                        {w.word} ({w.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-[#131f37] border border-slate-800 p-8 text-center text-xs text-slate-400">
                Pilih salah satu tombol aplikasi di atas untuk menampilkan detail metrik
                Extended Survey, distribusi rating, dan kategori keluhan spesifik aplikasi.
              </div>
            )}
          </div>
        )}

        {activeMenu === 'early-warning' && (
          <div className="space-y-6">
            <div className="rounded-xl bg-red-950/30 border border-red-500/30 p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-red-300 flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-red-400" />
                  Proactive Analytics & Early Warning System (Modul 5)
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Mendeteksi otomatis aplikasi yang mengalami penurunan rating{' '}
                  <strong>&gt; 0.5 poin dalam 7 hari terakhir</strong> dan mengirimkan
                  email peringatan ke admin aplikasi terkait.
                </p>
              </div>
              <button
                type="button"
                disabled={checkingAlert}
                onClick={handleRunEarlyWarning}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
                {checkingAlert
                  ? 'Memeriksa Threshold & Mengirim Email...'
                  : 'Jalankan Deteksi & Kirim Email Alert Sekarang'}
              </button>
            </div>

            {alertResultMsg && (
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{alertResultMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(summary?.early_warnings || []).map((ew) => (
                <div
                  key={ew.app_id}
                  className="rounded-xl bg-[#131f37] border border-red-500/40 p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{ew.name}</span>
                    <span className="rounded-full bg-red-500/20 px-3 py-0.5 text-xs font-bold text-red-400 border border-red-500/30">
                      Turun -{ew.rating_drop_7d} Poin
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 my-3 text-xs">
                    <div className="rounded-lg bg-slate-900 p-2.5">
                      <span className="text-slate-400 block">Rating Minggu Lalu:</span>
                      <strong className="text-emerald-400 text-sm">
                        {ew.previous_7d_rating} ★
                      </strong>
                    </div>
                    <div className="rounded-lg bg-slate-900 p-2.5">
                      <span className="text-slate-400 block">Rating 7 Hari Terakhir:</span>
                      <strong className="text-red-400 text-sm">
                        {ew.recent_7d_rating} ★
                      </strong>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Notifikasi dikirim ke: <strong className="text-slate-200">{ew.admin_email}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6">
              <h3 className="text-sm font-bold text-white mb-4">
                Riwayat Pengiriman Notifikasi Email Early Warning (Cron Job Log)
              </h3>
              <div className="space-y-3">
                {(summary?.early_warning_logs || []).map((log) => (
                  <div
                    key={log.warning_id}
                    className="rounded-lg bg-slate-900/90 border border-slate-800 p-3.5 text-xs"
                  >
                    <div className="flex flex-wrap justify-between gap-2 mb-1">
                      <span className="font-bold text-red-300">
                        [{log.app_name}] Penurunan {log.drop_points} poin ({log.previous_avg}★ →{' '}
                        {log.current_avg}★)
                      </span>
                      <span className="text-slate-400">{log.detected_at}</span>
                    </div>
                    <p className="text-slate-300 mb-1">{log.message}</p>
                    <span className="text-[11px] text-emerald-400">
                      ✓ Penerima: {log.recipient_email} | Status: {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'pengaturan' && (
          <div className="rounded-xl bg-[#131f37] border border-slate-800 p-6 space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">
              Konfigurasi Sistem SENADA & Kontrak Endpoint API (Bab 8)
            </h2>
            <p className="text-slate-400">
              Seluruh komponen berjalan di atas stack 100% gratis & open-source (React 18 + Vite,
              Tailwind CSS 3, Laravel 11 REST API, SQLite/MySQL, serta simulasi SSO Tel-U).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['POST /api/feedback/quick', 'Submit quick feedback dari pop-up widget'],
                ['POST /api/feedback/extended', 'Submit jawaban survei lanjutan'],
                ['GET /api/survey/questions', 'Ambil daftar pertanyaan survei dinamis'],
                ['GET /api/dashboard/summary', 'Ambil ringkasan analitik dashboard admin'],
                ['GET /api/dashboard/app/{id}', 'Ambil detail rating, tren & word cloud per aplikasi'],
                ['GET /api/apps', 'Daftar semua aplikasi yang terdaftar di SENADA'],
              ].map(([ep, desc]) => (
                <div
                  key={ep}
                  className="rounded-lg bg-slate-900 border border-slate-800 p-3"
                >
                  <div className="font-mono font-bold text-blue-400">{ep}</div>
                  <div className="text-slate-400 mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
