import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  Scale,
  Calendar,
  AlertTriangle,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onComplete: () => void;
  scholarshipName: string;
}

const STAGES = [
  { id: 1, label: 'Reading official sources', icon: FileSearch, detail: 'Parsing website notices, gazette circulars & guidelines...' },
  { id: 2, label: 'Extracting requirements', icon: Sparkles, detail: 'Extracting deadlines, income ceilings, age limits, and fees...' },
  { id: 3, label: 'Comparing information across sources', icon: Scale, detail: 'Cross-checking website vs circular vs application form...' },
  { id: 4, label: 'Checking your eligibility', icon: FileCheck2, detail: 'Evaluating applicant profile against extracted parameters...' },
  { id: 5, label: 'Analyzing possible conflicts', icon: AlertTriangle, detail: 'Classifying differences, conditional rules & contradictions...' },
  { id: 6, label: 'Reviewing source dates & legal recency', icon: Calendar, detail: 'Evaluating gazette superseding clauses & authority hierarchy...' },
  { id: 7, label: 'Preparing your Reality Report', icon: ShieldCheck, detail: 'Compiling Verification Queue and evidence citations...' },
];

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onComplete,
  scholarshipName,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPercent = Math.round(((currentStageIdx + 1) / STAGES.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-surface-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400">
              AUDIT ENGINE IN PROGRESS
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
              Analyzing {scholarshipName || 'Scholarship Scheme'}
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Pipeline Execution</span>
            <span className="text-brand-400 font-semibold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-sky-400 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {STAGES.map((stage, idx) => {
            const isFinished = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                  isCurrent
                    ? 'bg-brand-950/40 border-brand-500/50 shadow-glow-brand'
                    : isFinished
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                    : 'bg-transparent border-transparent text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isFinished
                        ? 'text-emerald-400 bg-emerald-950/60'
                        : isCurrent
                        ? 'text-brand-400 bg-brand-900/60 animate-pulse'
                        : 'text-slate-600'
                    }`}
                  >
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${isCurrent ? 'text-white font-bold' : ''}`}>
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <p className="text-[11px] text-brand-300/80 font-mono mt-0.5">
                        {stage.detail}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {isFinished && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                      Done
                    </span>
                  )}
                  {isCurrent && (
                    <div className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
          InfoGuard does not guess. All comparisons ground strictly on submitted official text.
        </div>
      </div>
    </div>
  );
};
