import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  AlertTriangle,
  Clock,
  FileCheck2,
  ShieldCheck,
  Layers,
  ExternalLink,
} from 'lucide-react';
import type { RealityReportData, SourceConflict } from '../types/scholarship';
import { ConflictDetailModal } from './ConflictDetailModal';

interface RealityReportViewProps {
  reportData: RealityReportData | null;
  onNavigateToAnalyze: () => void;
}

export const RealityReportView: React.FC<RealityReportViewProps> = ({
  reportData,
  onNavigateToAnalyze,
}) => {
  const [selectedConflict, setSelectedConflict] = useState<SourceConflict | null>(null);
  const [queueState, setQueueState] = useState<Record<string, boolean>>({});

  if (!reportData) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-xl">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          Your Reality Report will appear here after analysis.
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Submit official scholarship sources (website, circulars, FAQs, application forms) to generate the comprehensive reality report.
        </p>
        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all"
        >
          <span>Analyze a Scholarship</span>
        </button>
      </div>
    );
  }

  const toggleQueueItem = (id: string) => {
    setQueueState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `InfoGuard_RealityReport_${reportData.scholarshipName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const getOverallStatusStyle = () => {
    switch (reportData.overallStatus) {
      case 'Action Required':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Requires Verification':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Consensus Confirmed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 print:py-0 print:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-bold">
              Official Audit Output
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-[11px] font-mono text-slate-400">
              Audit Timestamp: {new Date(reportData.analyzedAt).toLocaleString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Application Reality Report
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            A comprehensive discrepancy, recency, and eligibility audit before submission.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700 text-xs font-semibold transition-all"
            title="Export JSON audit file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-8 print:border-none print:shadow-none print:p-0">
        <div className="bg-surface-950/80 rounded-xl p-5 border border-slate-800/90 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              SCHOLARSHIP AUDITED
            </span>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              {reportData.scholarshipName}
            </h3>
            <a
              href={reportData.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-400 hover:underline flex items-center space-x-1 mt-1 truncate"
            >
              <span className="truncate">{reportData.websiteUrl}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              OVERALL AUDIT STATUS
            </span>
            <div className="mt-1">
              <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getOverallStatusStyle()}`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{reportData.overallStatus}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {reportData.conflicts.length} Source Conflict{reportData.conflicts.length !== 1 ? 's' : ''} detected across {reportData.sourcesSummary.length} documents.
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              APPLICANT VERDICT
            </span>
            <div className="mt-1">
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-block">
                {reportData.eligibilityVerdict}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Applicant: <span className="text-slate-300 font-semibold">{reportData.studentSnapshot.fullName}</span> ({reportData.studentSnapshot.course})
            </p>
          </div>
        </div>

        {/* SECTION 1: VERIFICATION QUEUE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Before You Apply — Verification Queue
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Action Checklist
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Resolve these specific source ambiguities before submitting to protect against administrative rejection or portal lockout.
          </p>

          <div className="space-y-3">
            {reportData.verificationQueue.map((item) => {
              const isChecked = !!queueState[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleQueueItem(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                      : item.type === 'conflict'
                      ? 'bg-rose-950/20 border-rose-800/40 text-slate-100 hover:border-rose-700/60'
                      : item.type === 'outdated'
                      ? 'bg-amber-950/20 border-amber-800/40 text-slate-100 hover:border-amber-700/60'
                      : 'bg-surface-950/80 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleQueueItem(item.id)}
                      className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-700 bg-slate-900 cursor-pointer"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {item.category.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong className="text-slate-400">Reason:</strong> {item.reason}
                      </p>
                      <p className="text-xs text-brand-300 font-medium pt-1">
                        <strong className="text-slate-400">Action:</strong> {item.action}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: IDENTIFIED SOURCE CONFLICTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Source Conflicts & Discrepancies ({reportData.conflicts.length})
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Audited Contradictions
            </span>
          </div>

          <div className="space-y-4">
            {reportData.conflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="bg-surface-950/90 rounded-xl p-5 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">
                    {conflict.requirement}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold font-mono rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {conflict.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">
                      {conflict.sourceA.sourceName} ({conflict.sourceA.date || 'Source A'})
                    </span>
                    <p className="italic text-slate-200">
                      "{conflict.sourceA.quote}"
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">
                      {conflict.sourceB.sourceName} ({conflict.sourceB.date || 'Source B'})
                    </span>
                    <p className="italic text-slate-200">
                      "{conflict.sourceB.quote}"
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400">Analysis:</span> {conflict.whyConflict}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <span className="text-brand-300 font-medium">
                    What to verify: {conflict.whatToVerify}
                  </span>
                  <button
                    onClick={() => setSelectedConflict(conflict)}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <span>Full Evidence</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: POTENTIALLY OUTDATED INFORMATION */}
        {reportData.outdatedInfo.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Potentially Outdated Information
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Recency Analysis
              </span>
            </div>

            <div className="space-y-3">
              {reportData.outdatedInfo.map((out, idx) => (
                <div key={idx} className="bg-surface-950/80 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{out.item}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      Superseded
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500">Older Reference:</span> {out.olderSource}
                    </div>
                    <div className="text-emerald-400 font-medium">
                      <span className="text-slate-500">Newer Authority:</span> {out.newerSource}
                    </div>
                  </div>
                  <p className="text-slate-400">{out.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: REQUIRED DOCUMENTS CHECKLIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Required Documents & Authority Standards
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Document Checklist
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-950/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                  <th className="py-2.5 px-3">Document Title</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Sources Mentioning</th>
                  <th className="py-2.5 px-3">Discrepancy / Special Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                {reportData.requiredDocuments.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {doc.docName}
                    </td>
                    <td className="py-2.5 px-3">
                      {doc.mandatory ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                          Conditional
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {doc.sourcesMentioning.join(', ')}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300/90 text-[11px]">
                      {doc.discrepancies || 'Consistent format requirement'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: EVIDENCE & SOURCES TRAIL */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Evidence & Sources Audit Trail
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Provenance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {reportData.sourcesSummary.map((src) => (
              <div key={src.id} className="bg-surface-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase rounded bg-slate-800 text-brand-300 mb-1 inline-block">
                  {src.type}
                </span>
                <p className="font-semibold text-slate-200 truncate">{src.title}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{src.date || 'Undated'}</span>
                  <span className="font-mono">{src.charCount} chars analyzed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConflictDetailModal
        conflict={selectedConflict}
        onClose={() => setSelectedConflict(null)}
      />
    </div>
  );
};
