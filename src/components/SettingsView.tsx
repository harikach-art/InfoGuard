import React from 'react';
import {
  Database,
  Trash2,
  Info,
  Sliders,
} from 'lucide-react';
import type { RealityReportData } from '../types/scholarship';

interface SettingsViewProps {
  reportData: RealityReportData | null;
  onReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  reportData,
  onReset,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          InfoGuard Audit Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure discrepancy sensitivity, recency weights, and manage local session storage.
        </p>
      </div>

      <div className="bg-surface-900/90 rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Sliders className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Auditing Sensitivity & Authority Hierarchy
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Statutory Gazette Precedence Rule
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                When official gazetted notifications have higher serial revision numbers, prioritize their income and deadline standards over un-versioned web pages.
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-700 bg-slate-900 cursor-pointer"
            />
          </div>

          <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-800/80">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Hard Disqualification Gate Warnings
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Treat any discrepancy involving mandatory application form upload validation as high-severity (e.g. SDM income certificate vs FAQ affidavit).
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-700 bg-slate-900 cursor-pointer"
            />
          </div>

          <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-800/80">
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Conservative Conflict Labeling
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Distinguish conditional exceptions (e.g. course-specific age exemptions) from true contradictions, avoiding false-alarm conflict flags.
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-700 bg-slate-900 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Database className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Session & Memory Control
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          InfoGuard runs all analysis client-side in your browser. No private personal data or uploaded certificates are permanently stored or shared with third parties.
          {reportData && ` Currently caching audit session for "${reportData.scholarshipName}".`}
        </p>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Audits to Clean Empty State</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-500 flex items-start space-x-3">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-400">
            InfoGuard Standard: “Know what’s true before you apply.”
          </p>
          <p>
            Designed to protect college students from missed deadlines, rejected income certificates, and fine-print disqualifications.
          </p>
        </div>
      </div>
    </div>
  );
};
