import React, { useState } from 'react';
import { Shield, Layers, ClipboardList, BarChart2 } from 'lucide-react';
import PilotPortal from './pages/PilotPortal';
import ExtendedSurvey from './pages/ExtendedSurvey';
import AdminDashboard from './pages/AdminDashboard';
import {
  SSO_PROFILES,
  getActiveSsoUser,
  setActiveSsoUser,
} from './services/api';

export default function App() {
  const [viewMode, setViewMode] = useState('dashboard');
  const [surveyTargetApp, setSurveyTargetApp] = useState(null);
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [currentUser, setCurrentUser] = useState(getActiveSsoUser());

  const handleSwitchUser = (userId) => {
    const found = SSO_PROFILES.find((p) => p.id === userId) || SSO_PROFILES[0];
    setActiveSsoUser(found);
    setCurrentUser(found);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 h-14 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
            Tel-U Prototype
          </span>
          <span className="font-bold text-xs sm:text-sm text-white">
            SENADA — Survey Experience & Feedback Aplikasi
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('pilot')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'pilot'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            1. Pop-Up Quick Widget (A.1)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('survey')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'survey'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            2. Extended Survey (A.2)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            3. Dashboard Admin (A.3)
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs">
          <Shield className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">SSO Tel-U:</span>
          <select
            value={currentUser.id}
            onChange={(e) => handleSwitchUser(e.target.value)}
            className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs text-emerald-300 font-medium focus:outline-none"
          >
            {SSO_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>
        </div>
      </header>

      {viewMode === 'pilot' && (
        <PilotPortal
          onNavigateExtended={(app, fbId) => {
            setSurveyTargetApp(app);
            setActiveFeedbackId(fbId);
            setViewMode('survey');
          }}
        />
      )}

      {viewMode === 'survey' && (
        <ExtendedSurvey
          selectedApp={surveyTargetApp}
          feedbackId={activeFeedbackId}
          onBackToApp={() => setViewMode('pilot')}
        />
      )}

      {viewMode === 'dashboard' && (
        <AdminDashboard
          onOpenSurveyForApp={(app) => {
            setSurveyTargetApp(app);
            setActiveFeedbackId(null);
            setViewMode('survey');
          }}
        />
      )}
    </div>
  );
}
