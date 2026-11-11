import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import {
  fetchApps,
  fetchSurveyQuestions,
  getActiveSsoUser,
  submitExtendedSurvey,
} from '../services/api';

export default function ExtendedSurvey({
  selectedApp,
  feedbackId,
  onBackToApp,
}) {
  const [questions, setQuestions] = useState([]);
  const [apps, setApps] = useState([]);
  const [activeAppId, setActiveAppId] = useState(selectedApp?.app_id || 1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const ssoUser = getActiveSsoUser();

  useEffect(() => {
    Promise.all([fetchSurveyQuestions(), fetchApps()])
      .then(([qData, appData]) => {
        setQuestions(qData);
        setApps(appData);
        if (selectedApp?.app_id) {
          setActiveAppId(selectedApp.app_id);
        } else if (appData.length > 0) {
          setActiveAppId(appData[0].app_id);
        }
        const initial = {};
        qData.forEach((q) => {
          initial[q.question_id] = q.type === 'rating' ? 4 : '';
        });
        setAnswers(initial);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedApp]);

  const currentApp =
    apps.find((a) => Number(a.app_id) === Number(activeAppId)) ||
    selectedApp || { app_id: 1, name: 'Portal Akademik' };

  const answeredCount = questions.filter((q) => {
    const val = answers[q.question_id];
    return val !== undefined && String(val).trim() !== '';
  }).length;

  const progressPct =
    questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 60;

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formattedResponses = Object.entries(answers)
        .filter(([, val]) => val !== undefined && String(val).trim() !== '')
        .map(([qId, val]) => ({
          question_id: Number(qId),
          answer: String(val),
        }));

      await submitExtendedSurvey({
        feedback_id: feedbackId || null,
        app_id: currentApp.app_id,
        responses: formattedResponses,
      });

      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        if (onBackToApp) onBackToApp();
      }, 1800);
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16">
      <div className="bg-[#1e293b] text-white px-6 py-3.5 shadow-md">
        <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 font-bold text-sm">
              S
            </div>
            <span className="font-bold tracking-wide text-sm">SENADA</span>
            <span className="text-xs text-slate-400">
              Survey Experience & Feedback Aplikasi
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              SSO Terverifikasi: {ssoUser.name} ({ssoUser.id})
            </span>
            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Aplikasi
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-200/80">
          {submitted ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Terima Kasih Atas Masukan Anda!
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Jawaban survei lanjutan untuk <strong>{currentApp.name}</strong> telah
                disimpan ke basis data SENADA. Mengarahkan kembali ke aplikasi asal...
              </p>
              <button
                type="button"
                onClick={onBackToApp}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Kembali ke Aplikasi Sekarang
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="text-xl font-bold text-slate-900 mb-1">
                Survei Kepuasan Aplikasi
              </h1>
              <p className="text-xs text-slate-500 mb-4">
                Bantu kami meningkatkan kualitas layanan digital Telkom University.
              </p>

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                  #{currentApp.name}
                </span>

                <select
                  value={activeAppId}
                  onChange={(e) => setActiveAppId(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 focus:border-blue-600 focus:outline-none"
                >
                  {apps.map((a) => (
                    <option key={a.app_id} value={a.app_id}>
                      Ganti Aplikasi: {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-7 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {answeredCount} dari {questions.length || 5} pertanyaan
                </span>
              </div>

              {loading ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  Memuat daftar pertanyaan dari database SENADA...
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((q, idx) => (
                    <div key={q.question_id} className="border-b border-slate-100 pb-5 last:border-none">
                      <label className="block text-xs font-bold text-slate-800 mb-3">
                        {idx + 1}. {q.question_text}
                      </label>

                      {q.type === 'rating' ? (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[11px] text-slate-400 w-20">
                            {q.min_label || 'Sangat Buruk'}
                          </span>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((num) => {
                              const isSelected = Number(answers[q.question_id]) === num;
                              return (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => handleAnswerChange(q.question_id, num)}
                                  className={`h-9 w-9 rounded-lg text-xs font-bold border transition ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {num}
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-[11px] text-slate-400 ml-1">
                            {q.max_label || 'Sangat Baik'}
                          </span>
                        </div>
                      ) : (
                        <textarea
                          rows={2}
                          value={answers[q.question_id] || ''}
                          onChange={(e) => handleAnswerChange(q.question_id, e.target.value)}
                          placeholder="Tuliskan masukan atau keluhan Anda di sini..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-7 flex items-center justify-end gap-3">
                {onBackToApp && (
                  <button
                    type="button"
                    onClick={onBackToApp}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan Jawaban...' : 'Submit Survei'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
