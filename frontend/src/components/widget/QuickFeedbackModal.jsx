import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { submitQuickFeedback } from '../../services/api';

export default function QuickFeedbackModal({
  isOpen,
  onClose,
  app,
  onSuccessSubmit,
  onGoToExtended,
}) {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !app) return null;

  const handleSubmit = async (redirectExtended = false) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const result = await submitQuickFeedback(
        {
          app_id: app.app_id,
          rating,
          comment: comment.trim() || null,
        },
        app.api_key
      );
      const feedbackId = result?.data?.feedback_id;
      setSubmitting(false);

      if (redirectExtended) {
        onGoToExtended(app, feedbackId, rating, comment);
      } else {
        onSuccessSubmit(result?.data);
        setComment('');
      }
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.message || 'Terjadi kesalahan saat mengirim feedback');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-7 text-slate-800 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
          aria-label="Tutup Pop-up"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-amber-500 text-lg font-bold">★</span>
          <h3 className="text-lg font-bold text-slate-900">
            Beri Penilaian Untuk Aplikasi Ini
          </h3>
        </div>

        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          Seberapa puas Anda dengan <span className="font-semibold text-slate-700">{app.name}</span> ini?
        </p>

        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    active
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              </button>
            );
          })}
          <span className="ml-2 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            {rating} / 5 Bintang
          </span>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            KOMENTAR (OPSIONAL)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan pengalaman Anda..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit(false)}
            className="flex-1 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Mengirim...' : 'Kirim'}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit(true)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
          >
            Isi Survei Lengkap →
          </button>
        </div>
      </div>
    </div>
  );
}
