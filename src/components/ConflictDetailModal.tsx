import React from 'react';
import {
  X,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Clock,
} from 'lucide-react';
import type { SourceConflict } from '../types/scholarship';

interface ConflictDetailModalProps {
  conflict: SourceConflict | null;
  onClose: () => void;
}

export const ConflictDetailModal: React.FC<ConflictDetailModalProps> = ({
  conflict,
  onClose,
}) => {
  if (!conflict) return null;

  const getStatusBadge = () => {
    switch (conflict.status) {
      case 'Possible Conflict':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Possible Conflict</span>
          </span>
        );
      case 'Conditional Difference':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Conditional Difference</span>
          </span>
        );
      case 'Potentially Outdated':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Potentially Outdated</span>
          </span>
        );
      case 'Requires Verification':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-sky-500/20 text-sky-300 rounded-full border border-sky-500/30 flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
            <span>Requires Verification</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full">
            {conflict.status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-surface-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-surface-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {conflict.requirement}
                </h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Audit Category: {conflict.category.toUpperCase()} • Severity: {conflict.severity.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SOURCE A */}
            <div className="bg-surface-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase rounded bg-slate-800 text-slate-300">
                    Source A • {conflict.sourceA.sourceType}
                  </span>
                  {conflict.sourceA.date && (
                    <span className="flex items-center space-x-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{conflict.sourceA.date}</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  {conflict.sourceA.sourceName}
                </h4>

                {conflict.sourceA.pageOrSection && (
                  <p className="text-[11px] text-brand-400 font-mono mb-3">
                    Section: {conflict.sourceA.pageOrSection}
                  </p>
                )}

                <div className="relative pl-3 border-l-2 border-brand-500/60 my-2">
                  <p className="text-xs text-slate-300 italic font-mono leading-relaxed bg-slate-900/60 p-2.5 rounded">
                    "{conflict.sourceA.quote}"
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                Official source citation
              </div>
            </div>

            {/* SOURCE B */}
            <div className="bg-surface-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-[11px] font-mono font-bold uppercase rounded bg-slate-800 text-slate-300">
                    Source B • {conflict.sourceB.sourceType}
                  </span>
                  {conflict.sourceB.date && (
                    <span className="flex items-center space-x-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{conflict.sourceB.date}</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                  {conflict.sourceB.sourceName}
                </h4>

                {conflict.sourceB.pageOrSection && (
                  <p className="text-[11px] text-emerald-400 font-mono mb-3">
                    Section: {conflict.sourceB.pageOrSection}
                  </p>
                )}

                <div className="relative pl-3 border-l-2 border-emerald-500/60 my-2">
                  <p className="text-xs text-slate-300 italic font-mono leading-relaxed bg-slate-900/60 p-2.5 rounded">
                    "{conflict.sourceB.quote}"
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                {conflict.sourceB.referenceNo ? `Circular: ${conflict.sourceB.referenceNo}` : 'Official source citation'}
              </div>
            </div>
          </div>

          {/* WHY THIS MAY BE A CONFLICT */}
          <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Why This May Be a Conflict</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {conflict.whyConflict}
            </p>
            {conflict.authorityRecencyNote && (
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-start space-x-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Authority & Recency Analysis:</span>
                <span>{conflict.authorityRecencyNote}</span>
              </div>
            )}
          </div>

          {/* WHAT YOU SHOULD VERIFY */}
          <div className="bg-brand-950/40 rounded-xl p-4 border border-brand-800/50">
            <div className="flex items-center space-x-2 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>What You Should Verify (Applicant Action Plan)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {conflict.whatToVerify}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-surface-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Grounding note: Evidence directly quoted from official user documents.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
};
