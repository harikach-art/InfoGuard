import React, { useState } from 'react';
import {
  TableProperties,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
  ExternalLink,
} from 'lucide-react';
import type { RealityReportData, SourceRequirementItem, SourceConflict, AuditStatus } from '../types/scholarship';
import { ConflictDetailModal } from './ConflictDetailModal';

interface SourceAuditViewProps {
  reportData: RealityReportData | null;
  onNavigateToAnalyze: () => void;
  onNavigateToReport: () => void;
}

export const SourceAuditView: React.FC<SourceAuditViewProps> = ({
  reportData,
  onNavigateToAnalyze,
  onNavigateToReport,
}) => {
  const [selectedConflict, setSelectedConflict] = useState<SourceConflict | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!reportData) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-xl">
          <TableProperties className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          No Sources Audited Yet
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          The comparative Source Audit matrix cross-checks submitted official documents across deadlines, income ceilings, and document standards.
        </p>
        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all"
        >
          <span>Analyze a Scholarship</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Filter requirements
  const filteredRequirements = reportData.requirementsFound.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.websiteValue && item.websiteValue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notificationValue && item.notificationValue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'Possible Conflict':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>Possible Conflict</span>
          </span>
        );
      case 'Conditional Difference':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <HelpCircle className="w-3 h-3" />
            <span>Conditional Difference</span>
          </span>
        );
      case 'Potentially Outdated':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>Potentially Outdated</span>
          </span>
        );
      case 'Requires Verification':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <ShieldAlert className="w-3 h-3" />
            <span>Requires Verification</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  const handleRowClick = (item: SourceRequirementItem) => {
    if (item.conflictId) {
      const conflict = reportData.conflicts.find((c) => c.id === item.conflictId);
      if (conflict) setSelectedConflict(conflict);
    } else if (item.status === 'Possible Conflict' || item.status === 'Conditional Difference' || item.status === 'Potentially Outdated') {
      const conflict = reportData.conflicts.find((c) => c.category === item.category);
      if (conflict) setSelectedConflict(conflict);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Source Audit
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono bg-brand-500/20 text-brand-300 rounded border border-brand-500/30">
              Cross-Source Matrix
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparing verified requirements across all submitted official documents for <span className="text-slate-200 font-semibold">{reportData.scholarshipName}</span>.
          </p>
        </div>

        <button
          onClick={onNavigateToReport}
          className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          <span>View Reality Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Audit Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono">CONFIRMED CONSENSUS</span>
          <span className="text-lg font-bold text-emerald-400">
            {reportData.requirementsFound.filter((r) => r.status === 'Confirmed').length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Harmonious in all sources</span>
        </div>

        <div className="bg-surface-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono">POSSIBLE CONFLICTS</span>
          <span className="text-lg font-bold text-rose-400">
            {reportData.requirementsFound.filter((r) => r.status === 'Possible Conflict').length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Direct contradictions</span>
        </div>

        <div className="bg-surface-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono">POTENTIALLY OUTDATED</span>
          <span className="text-lg font-bold text-amber-400">
            {reportData.requirementsFound.filter((r) => r.status === 'Potentially Outdated').length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Superseded by newer orders</span>
        </div>

        <div className="bg-surface-900/80 p-3.5 rounded-xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block font-mono">CONDITIONAL DIFFERENCES</span>
          <span className="text-lg font-bold text-indigo-400">
            {reportData.requirementsFound.filter((r) => r.status === 'Conditional Difference').length}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Category or course specific</span>
        </div>
      </div>

      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search requirement or value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Audit Statuses</option>
            <option value="Possible Conflict">Possible Conflicts Only</option>
            <option value="Confirmed">Confirmed Only</option>
            <option value="Potentially Outdated">Potentially Outdated</option>
            <option value="Conditional Difference">Conditional Differences</option>
            <option value="Requires Verification">Requires Verification</option>
          </select>
        </div>
      </div>

      {/* Main Comparative Grid */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-surface-900/90 shadow-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Requirement</th>
              <th className="py-3 px-4 font-semibold text-brand-400">Website</th>
              <th className="py-3 px-4 font-semibold text-emerald-400">Notification (Gazette)</th>
              <th className="py-3 px-4 font-semibold text-indigo-400">Official FAQ</th>
              <th className="py-3 px-4 font-semibold text-amber-400">Application Form</th>
              <th className="py-3 px-4 font-semibold">Audit Status</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredRequirements.map((item) => {
              const hasConflictLink = !!item.conflictId || item.status !== 'Confirmed';
              return (
                <tr
                  key={item.id}
                  onClick={() => hasConflictLink && handleRowClick(item)}
                  className={`group transition-colors ${
                    hasConflictLink
                      ? 'hover:bg-slate-800/50 cursor-pointer'
                      : 'hover:bg-slate-900/30'
                  }`}
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    <div>{item.label}</div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.notes}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {item.websiteValue ? (
                      <span className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 inline-block font-mono text-[11px]">
                        {item.websiteValue}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">Not mentioned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {item.notificationValue ? (
                      <span className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 inline-block font-mono text-[11px] text-emerald-300">
                        {item.notificationValue}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">Not mentioned</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {item.faqValue ? (
                      <span className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 inline-block font-mono text-[11px] text-indigo-300">
                        {item.faqValue}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {item.formValue ? (
                      <span className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80 inline-block font-mono text-[11px] text-amber-300">
                        {item.formValue}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {hasConflictLink ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item);
                        }}
                        className="inline-flex items-center space-x-1 text-brand-400 hover:text-brand-300 text-xs font-medium group-hover:underline"
                      >
                        <span>Evidence</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[11px] font-mono">Consensus</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400 text-center font-mono py-2">
        Click any row with a conflict or difference badge to inspect the original quotes and audit evidence.
      </div>

      <ConflictDetailModal
        conflict={selectedConflict}
        onClose={() => setSelectedConflict(null)}
      />
    </div>
  );
};
