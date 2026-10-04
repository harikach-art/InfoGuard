import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AnalyzeScholarshipView } from './components/AnalyzeScholarshipView';
import { SourceAuditView } from './components/SourceAuditView';
import { MyEligibilityView } from './components/MyEligibilityView';
import { RealityReportView } from './components/RealityReportView';
import { DocumentsView } from './components/DocumentsView';
import { DashboardView } from './components/DashboardView';
import { SettingsView } from './components/SettingsView';
import { AnalysisModal } from './components/AnalysisModal';
import type {
  ActiveNavTab,
  OfficialSource,
  RealityReportData,
  StudentDetails,
} from './types/scholarship';
import { runInfoGuardAudit } from './services/auditEngine';
import type { SampleBundle } from './services/sampleBundles';

export function App() {
  // Navigation State - Starts directly on the workspace product
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('analyze');

  // Strict empty states on initial load
  const [scholarshipName, setScholarshipName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [sources, setSources] = useState<OfficialSource[]>([]);
  const [student, setStudent] = useState<StudentDetails>({
    fullName: '',
    age: '',
    course: '',
    college: '',
    category: '',
    annualFamilyIncome: '',
    state: '',
    previousMarksPercentage: '',
    gender: '',
    additionalNotes: '',
  });

  // Report state - strictly null until user clicks "Run InfoGuard"
  const [reportData, setReportData] = useState<RealityReportData | null>(null);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage] = useState('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [pendingAuditParams, setPendingAuditParams] = useState<{
    name: string;
    url: string;
    srcs: OfficialSource[];
    stud: StudentDetails;
  } | null>(null);

  // Load a sample bundle into form fields (remains unanalyzed until user clicks Run InfoGuard)
  const handleLoadSample = (bundle: SampleBundle) => {
    setScholarshipName(bundle.name);
    setWebsiteUrl(bundle.websiteUrl);

    const generatedSources: OfficialSource[] = bundle.sources.map((s, idx) => ({
      ...s,
      id: `sample-source-${idx}-${Date.now()}`,
      addedAt: new Date().toISOString(),
    }));

    setSources(generatedSources);
    setStudent(bundle.student);

    // Switch to analyze workspace so the user sees the filled inputs before running
    setActiveTab('analyze');
  };

  // Reset to 100% clean empty state
  const handleReset = () => {
    setScholarshipName('');
    setWebsiteUrl('');
    setSources([]);
    setStudent({
      fullName: '',
      age: '',
      course: '',
      college: '',
      category: '',
      annualFamilyIncome: '',
      state: '',
      previousMarksPercentage: '',
      gender: '',
      additionalNotes: '',
    });
    setReportData(null);
    setActiveTab('analyze');
  };

  // Trigger analysis execution
  const handleRunAudit = (
    name: string,
    url: string,
    submittedSources: OfficialSource[],
    studentDetails: StudentDetails
  ) => {
    setScholarshipName(name);
    setWebsiteUrl(url);
    setSources(submittedSources);
    setStudent(studentDetails);

    setPendingAuditParams({
      name,
      url,
      srcs: submittedSources,
      stud: studentDetails,
    });

    setIsAnalyzing(true);
    setShowAnalysisModal(true);
  };

  // Called when multi-stage progress completes
  const handleAnalysisCompleted = () => {
    if (!pendingAuditParams) return;

    const result = runInfoGuardAudit(
      pendingAuditParams.name,
      pendingAuditParams.url,
      pendingAuditParams.srcs,
      pendingAuditParams.stud
    );

    setReportData(result);
    setIsAnalyzing(false);
    setShowAnalysisModal(false);

    // Seamlessly navigate to Source Audit so user sees the verified comparison table
    setActiveTab('audit');
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reportData={reportData}
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'analyze' && (
          <AnalyzeScholarshipView
            onRunAudit={handleRunAudit}
            isAnalyzing={isAnalyzing}
            analysisStage={analysisStage}
            onLoadSample={handleLoadSample}
            initialSources={sources}
            initialStudent={student}
            initialName={scholarshipName}
            initialUrl={websiteUrl}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            reportData={reportData}
            onNavigateToAnalyze={() => setActiveTab('analyze')}
            onNavigateToAudit={() => setActiveTab('audit')}
            onNavigateToReport={() => setActiveTab('report')}
            onNavigateToEligibility={() => setActiveTab('eligibility')}
            onLoadSample={handleLoadSample}
          />
        )}

        {activeTab === 'audit' && (
          <SourceAuditView
            reportData={reportData}
            onNavigateToAnalyze={() => setActiveTab('analyze')}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'eligibility' && (
          <MyEligibilityView
            reportData={reportData}
            onNavigateToAnalyze={() => setActiveTab('analyze')}
            onNavigateToAudit={() => setActiveTab('audit')}
          />
        )}

        {activeTab === 'report' && (
          <RealityReportView
            reportData={reportData}
            onNavigateToAnalyze={() => setActiveTab('analyze')}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsView
            sources={sources}
            onNavigateToAnalyze={() => setActiveTab('analyze')}
            onRemoveSource={handleRemoveSource}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            reportData={reportData}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Progressive Multi-Stage Analysis Modal */}
      <AnalysisModal
        isOpen={showAnalysisModal}
        onComplete={handleAnalysisCompleted}
        scholarshipName={scholarshipName}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8 bg-surface-950/80 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-300">INFOGUARD</span>
            <span>•</span>
            <span className="text-slate-400">“Know what’s true before you apply.”</span>
          </div>
          <div className="text-slate-400">
            Source Conflict Auditor • Client-Side Auditing Engine
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
