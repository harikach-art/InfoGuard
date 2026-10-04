import React from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  SearchCode,
  FileCheck2,
  TableProperties,
  FileText,
  FolderOpen,
  Settings,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import type { ActiveNavTab, RealityReportData } from '../types/scholarship';
import { SAMPLE_BUNDLES, type SampleBundle } from '../services/sampleBundles';

interface NavbarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  reportData: RealityReportData | null;
  onLoadSample: (bundle: SampleBundle) => void;
  onReset: () => void;
  isAnalyzing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  reportData,
  onLoadSample,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-surface-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyze')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 p-0.5 shadow-glow-brand flex items-center justify-center">
              <div className="w-full h-full bg-surface-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  INFO<span className="text-brand-400">GUARD</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase bg-slate-800 text-slate-300 rounded border border-slate-700">
                  Auditor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                Know what’s true before you apply.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analyze'
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <SearchCode className="w-3.5 h-3.5" />
              <span>Analyze Scholarship</span>
            </button>

            <button
              onClick={() => setActiveTab('eligibility')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'eligibility'
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>My Eligibility</span>
              {reportData && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Source Audit</span>
              {reportData && reportData.conflicts.length > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] font-mono bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                  {reportData.conflicts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'report'
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reality Report</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'documents'
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Documents</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-brand-600/15 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Action Helper: Sample Bundles & Reset */}
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <button
                type="button"
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700/80 text-xs font-medium transition-all"
                title="Load realistic multi-source test bundle"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden xl:inline">Load Sample Package</span>
                <span className="xl:hidden">Samples</span>
              </button>

              <div className="absolute right-0 mt-1 w-72 bg-surface-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                  <p className="text-[11px] font-semibold text-slate-200">Test Source Bundles</p>
                  <p className="text-[10px] text-slate-400">
                    Fills inputs with authentic conflicting sources for quick evaluation:
                  </p>
                </div>
                <div className="space-y-1">
                  {SAMPLE_BUNDLES.map((bundle) => (
                    <button
                      key={bundle.id}
                      onClick={() => onLoadSample(bundle)}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-xs transition-colors flex flex-col space-y-0.5 group/item"
                    >
                      <span className="font-medium text-slate-200 group-hover/item:text-brand-300">
                        {bundle.name}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">
                        {bundle.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {reportData && (
              <button
                onClick={onReset}
                className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors border border-transparent hover:border-rose-900/50"
                title="Reset application to clean empty state"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {(
            [
              ['dashboard', 'Dashboard'],
              ['analyze', 'Analyze'],
              ['eligibility', 'Eligibility'],
              ['audit', 'Audit'],
              ['report', 'Report'],
              ['documents', 'Docs'],
              ['settings', 'Settings'],
            ] as [ActiveNavTab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md font-medium transition-all ${
                activeTab === key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
