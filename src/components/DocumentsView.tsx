import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  ArrowRight,
  Eye,
  CheckCircle2,
  Trash2,
  X,
  Globe,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import type { OfficialSource, SourceType } from '../types/scholarship';

interface DocumentsViewProps {
  sources: OfficialSource[];
  onNavigateToAnalyze: () => void;
  onRemoveSource?: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  sources,
  onNavigateToAnalyze,
  onRemoveSource,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<OfficialSource | null>(null);

  if (sources.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-xl">
          <FolderOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          No official documents added.
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Submit official scholarship websites, circular notifications, FAQs, or application forms to inspect their raw text and audit provenance.
        </p>
        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all"
        >
          <span>Add Official Sources</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'website':
        return <Globe className="w-4 h-4 text-brand-400" />;
      case 'notification':
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4 text-indigo-400" />;
      case 'form':
        return <FileCheck className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Official Source Documents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submitted documentation and circulars currently active in the InfoGuard audit memory.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <span>+ Add More Sources</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface-900/90 shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <th className="py-3 px-4">Document / Source Name</th>
              <th className="py-3 px-4">Source Type</th>
              <th className="py-3 px-4">Entry / Upload Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Used in Analysis</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-sans">
            {sources.map((src) => (
              <tr key={src.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-200">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60">
                      {getSourceIcon(src.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{src.title}</p>
                      {src.url ? (
                        <p className="text-[11px] text-brand-400 truncate max-w-xs">{src.url}</p>
                      ) : src.fileName ? (
                        <p className="text-[11px] text-slate-400 font-mono">{src.fileName}</p>
                      ) : (
                        <p className="text-[11px] text-slate-500">Official Text Snippet</p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    {src.type}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-slate-300 font-mono">
                  {new Date(src.addedAt).toLocaleDateString()}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Parsed & Validated</span>
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span className="text-emerald-400 font-semibold text-xs">
                    Yes (Audited)
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedDoc(src)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                  {onRemoveSource && (
                    <button
                      onClick={() => onRemoveSource(src.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-surface-950/80">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  {selectedDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 font-mono text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 space-y-1">
                <div>Type: <span className="text-slate-200">{selectedDoc.type.toUpperCase()}</span></div>
                {selectedDoc.publicationDate && <div>Publication Date: <span className="text-slate-200">{selectedDoc.publicationDate}</span></div>}
                {selectedDoc.circularNo && <div>Circular / Reference: <span className="text-slate-200">{selectedDoc.circularNo}</span></div>}
                <div>Analyzed Character Length: <span className="text-slate-200">{selectedDoc.textContent.length} characters</span></div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-sans font-semibold">Extracted Official Text:</span>
                <pre className="p-4 bg-slate-950/90 rounded-xl border border-slate-800/80 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {selectedDoc.textContent}
                </pre>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-surface-950/80 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
