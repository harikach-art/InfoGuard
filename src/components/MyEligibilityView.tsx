import React from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  User,
  GraduationCap,
  Banknote,
  MapPin,
} from 'lucide-react';
import type { RealityReportData, EligibilityStatus } from '../types/scholarship';
import { formatCurrencyINR } from '../services/auditEngine';

interface MyEligibilityViewProps {
  reportData: RealityReportData | null;
  onNavigateToAnalyze: () => void;
  onNavigateToAudit: () => void;
}

export const MyEligibilityView: React.FC<MyEligibilityViewProps> = ({
  reportData,
  onNavigateToAnalyze,
  onNavigateToAudit,
}) => {
  if (!reportData) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-xl">
          <FileCheck2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          No Eligibility Check Performed Yet
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          InfoGuard checks your specific profile against the legal requirements and income limits identified in your submitted official documents.
        </p>
        <button
          onClick={onNavigateToAnalyze}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all"
        >
          <span>Enter Details & Audit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const { eligibilityVerdict, eligibilitySummary, studentSnapshot } = reportData;

  const getVerdictDesign = (status: EligibilityStatus) => {
    switch (status) {
      case 'Likely Eligible':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
          title: 'Likely Eligible',
          bg: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          desc: 'Your profile complies with the primary eligibility requirements found in the official sources.',
        };
      case 'Ineligible':
        return {
          icon: <XCircle className="w-8 h-8 text-rose-400" />,
          title: 'Ineligible',
          bg: 'bg-rose-950/30 border-rose-500/40 text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          desc: 'One or more of your parameters clearly fall outside the official scheme eligibility gates.',
        };
      case 'Conditionally Eligible':
        return {
          icon: <HelpCircle className="w-8 h-8 text-indigo-400" />,
          title: 'Conditionally Eligible',
          bg: 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          desc: 'Your qualification depends on specific conditional rules (such as course schedule or category).',
        };
      case 'Eligible but Incomplete':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
          title: 'Eligible but Incomplete',
          bg: 'bg-amber-950/30 border-amber-500/40 text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          desc: 'You satisfy academic & financial limits, but specific document format requirements must be resolved to avoid rejection.',
        };
      case 'Cannot Verify':
      default:
        return {
          icon: <ShieldAlert className="w-8 h-8 text-sky-400" />,
          title: 'Cannot Verify',
          bg: 'bg-sky-950/30 border-sky-500/40 text-sky-300',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          desc: 'The submitted official sources provide mutually contradictory requirements, preventing a definitive check.',
        };
    }
  };

  const verdictDesign = getVerdictDesign(eligibilityVerdict);
  const studentIncomeVal = parseFloat(studentSnapshot.annualFamilyIncome.replace(/[^0-9.]/g, '')) || 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            My Eligibility
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded assessment for <span className="text-slate-200 font-semibold">{studentSnapshot.fullName}</span> against <span className="text-slate-200 font-semibold">{reportData.scholarshipName}</span>.
          </p>
        </div>

        <button
          onClick={onNavigateToAudit}
          className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          <span>View Source Audit Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className={`p-6 rounded-2xl border ${verdictDesign.bg} shadow-2xl relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3.5">
            {verdictDesign.icon}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider opacity-75">
                Official Eligibility Assessment
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {verdictDesign.title}
              </h2>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${verdictDesign.badge} self-start sm:self-auto`}>
            Grounding: 100% Sourced Evidence
          </span>
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-sm font-medium text-slate-100 leading-relaxed">
            {eligibilitySummary}
          </p>
          <p className="text-xs text-slate-300 opacity-90">
            {verdictDesign.desc}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Detailed Criteria Breakdown & Grounding
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span>Annual Family Income</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Limit Check
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Your Declared Income:</span>
                <span className="text-white font-mono font-semibold">{formatCurrencyINR(studentIncomeVal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Website Limit:</span>
                <span className="text-slate-300 font-mono">₹4,50,000 / year</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Gazette Circular Limit:</span>
                <span className="text-emerald-300 font-mono font-semibold">₹6,00,000 / year (Revised)</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {studentIncomeVal <= 600000
                ? 'Your income satisfies the revised statutory limit in the latest Ministry Gazette Notice, though you should verify portal numeric boundaries.'
                : 'Your income exceeds the maximum threshold established across all submitted circulars.'}
            </p>
          </div>

          <div className="bg-surface-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <User className="w-4 h-4 text-brand-400" />
                <span>Age Limit Check</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Age: {studentSnapshot.age} yrs
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Your Age:</span>
                <span className="text-white font-mono font-semibold">{studentSnapshot.age} years</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">General Age Limit:</span>
                <span className="text-slate-300 font-mono">Under 25 years</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Technical Exemption:</span>
                <span className="text-brand-300 font-mono">No upper ceiling for B.Tech/MBBS</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {parseInt(studentSnapshot.age, 10) <= 25
                ? 'Your age is within the standard limit.'
                : 'Over 25 years old; qualification relies on professional course exemption schedule in the official Gazette.'}
            </p>
          </div>

          <div className="bg-surface-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Course Program</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Enrollment
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Course / Degree:</span>
                <span className="text-white font-medium">{studentSnapshot.course}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">College / University:</span>
                <span className="text-slate-300">{studentSnapshot.college}</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full-time regular enrollment confirmed eligible by all sources. Distance education is excluded.
            </p>
          </div>

          <div className="bg-surface-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Category & Domicile</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {studentSnapshot.category}
              </span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Reservation Category:</span>
                <span className="text-white">{studentSnapshot.category}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">State / Location:</span>
                <span className="text-slate-300">{studentSnapshot.state}</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Make sure your Caste/Income Certificate is issued by competent authority in {studentSnapshot.state}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
