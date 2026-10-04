import React from 'react';
import {
  ShieldCheck,
  SearchCode,
  ArrowRight,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import type { RealityReportData } from '../types/scholarship';
import { SAMPLE_BUNDLES, type SampleBundle } from '../services/sampleBundles';

interface DashboardViewProps {
  reportData: RealityReportData | null;
  onNavigateToAnalyze: () => void;
  onNavigateToAudit: () => void;
  onNavigateToReport: () => void;
  onNavigateToEligibility: () => void;
  onLoadSample: (bundle: SampleBundle) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reportData,
  onNavigateToAnalyze,
  onNavigateToAudit,
  onNavigateToReport,
  onNavigateToEligibility,
  onLoadSample,
}) => {
  if (!reportData) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-in fade-in duration-300">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-600/30 to-sky-400/20 border border-brand-500/30 p-1 flex items-center justify-center shadow-glow-brand">
          <div className="w-full h-full bg-surface-950 rounded-[22px] flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-brand-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome to InfoGuard.
          </h1>
          <p className="text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            Start by analyzing a scholarship.
          </p>
        </div>

        <div>
          <button
            onClick={onNavigateToAnalyze}
            className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <SearchCode className="w-4 h-4" />
            <span>Analyze a Scholarship</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-8 border-t border-slate-800/80 max-w-md mx-auto">
          <p className="text-xs text-slate-500 mb-3">
            Want to test immediately? Select an authentic source conflict bundle:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SAMPLE_BUNDLES.slice(0, 2).map((bundle) => (
              <button
                key={bundle.id}
                onClick={() => onLoadSample(bundle)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 text-xs transition-colors flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-brand-400" />
                <span>{bundle.name.split('(')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-surface-900 via-surface-900 to-surface-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[11px] font-mono uppercase bg-brand-500/20 text-brand-300 rounded border border-brand-500/30">
                Active Audit Workspace
              </span>
              <span className="text-xs text-slate-400">
                Audited {new Date(reportData.analyzedAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {reportData.scholarshipName}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Official source documents verified against applicant profile for {reportData.studentSnapshot.fullName} ({reportData.studentSnapshot.course}).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToReport}
              className="flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Open Reality Report</span>
            </button>
            <button
              onClick={onNavigateToAnalyze}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              <SearchCode className="w-4 h-4" />
              <span>Audit Another</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={onNavigateToEligibility}
          className="bg-surface-900/90 p-5 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">ELIGIBILITY VERDICT</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-emerald-400">
            {reportData.eligibilityVerdict}
          </p>
          <p className="text-xs text-slate-400 line-clamp-2">
            {reportData.eligibilitySummary}
          </p>
        </div>

        <div
          onClick={onNavigateToAudit}
          className="bg-surface-900/90 p-5 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">SOURCE CONFLICTS</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-extrabold text-rose-400">
            {reportData.conflicts.length} Identified
          </p>
          <p className="text-xs text-slate-400">
            {reportData.conflicts.filter((c) => c.severity === 'high').length} high severity differences require verification.
          </p>
        </div>

        <div
          onClick={onNavigateToReport}
          className="bg-surface-900/90 p-5 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">DOCUMENTS AUDITED</span>
            <Layers className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-xl font-extrabold text-brand-400">
            {reportData.sourcesSummary.length} Sources
          </p>
          <p className="text-xs text-slate-400">
            Website, Gazette, FAQs, and Form instructions cross-referenced.
          </p>
        </div>
      </div>
    </div>
  );
};
