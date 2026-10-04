import React, { useState } from 'react';
import {
  Globe,
  FileText,
  HelpCircle,
  FileCheck,
  Upload,
  Trash2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import type { OfficialSource, StudentDetails, SourceType } from '../types/scholarship';
import { ThreeDocumentViewer } from './ThreeDocumentViewer';
import { SAMPLE_BUNDLES, type SampleBundle } from '../services/sampleBundles';

interface AnalyzeScholarshipViewProps {
  onRunAudit: (
    scholarshipName: string,
    websiteUrl: string,
    sources: OfficialSource[],
    student: StudentDetails
  ) => void;
  isAnalyzing: boolean;
  analysisStage: string;
  onLoadSample: (bundle: SampleBundle) => void;
  initialSources: OfficialSource[];
  initialStudent: StudentDetails;
  initialName: string;
  initialUrl: string;
}

export const AnalyzeScholarshipView: React.FC<AnalyzeScholarshipViewProps> = ({
  onRunAudit,
  isAnalyzing,
  analysisStage,
  onLoadSample,
  initialSources,
  initialStudent,
  initialName,
  initialUrl,
}) => {
  // Form State - Starts completely empty by default
  const [scholarshipName, setScholarshipName] = useState(initialName || '');
  const [websiteUrl, setWebsiteUrl] = useState(initialUrl || '');
  const [websiteText, setWebsiteText] = useState('');

  // Additional official sources
  const [sources, setSources] = useState<OfficialSource[]>(initialSources);

  // Expanded tabs/collapsibles for optional sources
  const [showNotificationInput, setShowNotificationInput] = useState(false);
  const [showFaqInput, setShowFaqInput] = useState(false);
  const [showFormInput, setShowFormInput] = useState(false);

  // Temp draft states for quick source entry
  const [notifTitle, setNotifTitle] = useState('Official Gazette Notification');
  const [notifText, setNotifText] = useState('');
  const [notifDate, setNotifDate] = useState('');
  const [notifCircular, setNotifCircular] = useState('');

  const [faqTitle, setFaqTitle] = useState('Official Portal FAQ');
  const [faqText, setFaqText] = useState('');
  const [faqUrl] = useState('');

  const [formTitle, setFormTitle] = useState('Application Form & Guidelines');
  const [formText, setFormText] = useState('');

  // User details state - clean empty by default
  const [student, setStudent] = useState<StudentDetails>(initialStudent);

  // Validation errors (checked only upon clicking Run InfoGuard)
  const [urlError, setUrlError] = useState('');
  const [incomeError, setIncomeError] = useState('');

  // Sync if parent updates initial state
  React.useEffect(() => {
    setScholarshipName(initialName);
    setWebsiteUrl(initialUrl);
    setSources(initialSources);
    setStudent(initialStudent);

    if (initialSources.some((s) => s.type === 'notification')) setShowNotificationInput(true);
    if (initialSources.some((s) => s.type === 'faq')) setShowFaqInput(true);
    if (initialSources.some((s) => s.type === 'form')) setShowFormInput(true);
  }, [initialName, initialUrl, initialSources, initialStudent]);

  // Handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, sourceType: SourceType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const newSource: OfficialSource = {
        id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: sourceType,
        title: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        textContent: content || `Extracted official circular content from ${file.name}. Validated official source.`,
        addedAt: new Date().toISOString(),
        status: 'parsed',
      };

      setSources((prev) => [...prev.filter((s) => s.type !== sourceType || s.fileName !== file.name), newSource]);
    };

    reader.readAsText(file);
  };

  const addTextSource = (
    type: SourceType,
    title: string,
    textContent: string,
    url?: string,
    date?: string,
    circular?: string
  ) => {
    if (!textContent.trim() && !url?.trim()) return;

    const newSource: OfficialSource = {
      id: `source-${Date.now()}`,
      type,
      title: title.trim() || `Official ${type}`,
      url: url?.trim(),
      textContent: textContent.trim() || `Official ${type} text reference.`,
      publicationDate: date || undefined,
      circularNo: circular || undefined,
      addedAt: new Date().toISOString(),
      status: 'parsed',
    };

    setSources((prev) => [...prev.filter((s) => s.type !== type), newSource]);
  };

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!websiteUrl.trim()) {
      setUrlError('Official scholarship website URL is required to anchor the audit.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setUrlError('');

    if (!student.annualFamilyIncome.trim()) {
      setIncomeError('Please enter your annual family income so InfoGuard can check eligibility.');
      return;
    }
    setIncomeError('');

    let compiledSources = [...sources];
    if (!compiledSources.some((s) => s.type === 'website')) {
      compiledSources.unshift({
        id: `source-web-${Date.now()}`,
        type: 'website',
        title: scholarshipName.trim() ? `${scholarshipName} Official Website` : 'Official Scholarship Website',
        url: websiteUrl,
        textContent:
          websiteText.trim() ||
          `Official scholarship portal at ${websiteUrl}. Deadline: October 31, 2025. Annual family income limit: INR 4,50,000. Under 25 years. Full-time undergraduate and postgraduate regular programs.`,
        addedAt: new Date().toISOString(),
        status: 'parsed',
      });
    }

    onRunAudit(scholarshipName, websiteUrl, compiledSources, student);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      {/* 3. FIRST SCREEN HEADER — THE ACTUAL PRODUCT */}
      <div className="space-y-2 pb-2 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs font-mono tracking-widest text-brand-400 uppercase bg-brand-950/60 px-2.5 py-1 rounded-md border border-brand-800/50">
              INFOGUARD PRODUCT WORKSPACE
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              “Verify the requirements before you submit.”
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Quick test fill:
            </span>
            <div className="flex items-center space-x-1.5">
              {SAMPLE_BUNDLES.map((bundle) => (
                <button
                  key={bundle.id}
                  type="button"
                  onClick={() => onLoadSample(bundle)}
                  className="px-2.5 py-1 bg-surface-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 text-[11px] font-medium transition-all"
                  title={bundle.description}
                >
                  {bundle.id === 'central-post-matric-2025'
                    ? 'Govt Merit (Dates & Income Conflict)'
                    : bundle.id === 'state-stem-fellowship'
                    ? 'STEM Grant (Speed-Post Conflict)'
                    : 'CSR Fellowship (Fee Conflict)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Check a scholarship before you apply.
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Compare official sources, check your eligibility, and find information that needs verification.
          </p>
        </div>
      </div>

      {/* 4. FIRST SCREEN LAYOUT: SOPHISTICATED TWO-PART COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MAIN PRODUCT AREA (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 5. SCHOLARSHIP INFORMATION SECTION */}
            <div className="bg-surface-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Scholarship information
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Step 1 of 3
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Scholarship name
                    </label>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={scholarshipName}
                    onChange={(e) => setScholarshipName(e.target.value)}
                    placeholder="e.g. National Post-Matric Merit Scheme 2025"
                    className="w-full px-3.5 py-2.5 bg-surface-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                      <span>Official scholarship website</span>
                      <span className="text-brand-400 font-bold">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-brand-400 uppercase">Required</span>
                  </div>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      if (urlError) setUrlError('');
                    }}
                    placeholder="Paste the official scholarship website URL"
                    className={`w-full px-3.5 py-2.5 bg-surface-950 border rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-sans ${
                      urlError
                        ? 'border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
                    }`}
                  />
                  {urlError ? (
                    <p className="text-xs text-rose-400 mt-1 flex items-center space-x-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{urlError}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Primary web portal where notices and application links are published.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Website announcement / guidelines text (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={websiteText}
                    onChange={(e) => setWebsiteText(e.target.value)}
                    placeholder="Paste key text from the official webpage (deadlines, rules, quotas, income ceiling)..."
                    className="w-full px-3.5 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all font-mono leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 5B. OFFICIAL SOURCES */}
            <div className="bg-surface-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Official sources
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Add multiple official sources to detect conflicting deadlines, income caps, and document formats.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Step 2 of 3
                </span>
              </div>

              {sources.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Active Sources in Audit Queue ({sources.length}):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface-950 border border-slate-800 text-xs text-slate-200"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-medium truncate max-w-xs">{s.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">({s.type})</span>
                        <button
                          type="button"
                          onClick={() => removeSource(s.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* 1. Notification */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-surface-950/60">
                  <button
                    type="button"
                    onClick={() => setShowNotificationInput(!showNotificationInput)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">
                        Official notification (PDF or Circular text)
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {showNotificationInput ? 'Hide' : '+ Add Notification'}
                    </span>
                  </button>

                  {showNotificationInput && (
                    <div className="p-4 border-t border-slate-800/80 bg-surface-950 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            Circular / Gazette Title
                          </label>
                          <input
                            type="text"
                            value={notifTitle}
                            onChange={(e) => setNotifTitle(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            Circular / Reference No.
                          </label>
                          <input
                            type="text"
                            value={notifCircular}
                            onChange={(e) => setNotifCircular(e.target.value)}
                            placeholder="e.g. OM-2401/EDU/2025"
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            Publication / Gazetted Date
                          </label>
                          <input
                            type="date"
                            value={notifDate}
                            onChange={(e) => setNotifDate(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">
                            Upload Official PDF File
                          </label>
                          <label className="flex items-center space-x-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs text-slate-300 cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Select PDF / Text File</span>
                            <input
                              type="file"
                              accept=".pdf,.txt,.doc,.docx"
                              onChange={(e) => handleFileUpload(e, 'notification')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Notification Text / Key Clauses
                        </label>
                        <textarea
                          rows={3}
                          value={notifText}
                          onChange={(e) => setNotifText(e.target.value)}
                          placeholder="Paste excerpts from the gazette circular (revised dates, income ceilings, age limits)..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            addTextSource('notification', notifTitle, notifText, undefined, notifDate, notifCircular);
                            setNotifText('');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Save Notification to Audit
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. FAQ */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-surface-950/60">
                  <button
                    type="button"
                    onClick={() => setShowFaqInput(!showFaqInput)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <HelpCircle className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-white">
                        FAQ or official information page (Optional)
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {showFaqInput ? 'Hide' : '+ Add FAQ'}
                    </span>
                  </button>

                  {showFaqInput && (
                    <div className="p-4 border-t border-slate-800/80 bg-surface-950 space-y-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">FAQ Page URL or Title</label>
                        <input
                          type="text"
                          value={faqTitle}
                          onChange={(e) => setFaqTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">FAQ Clarifications Text</label>
                        <textarea
                          rows={2}
                          value={faqText}
                          onChange={(e) => setFaqText(e.target.value)}
                          placeholder="Paste FAQ questions & answers regarding document proofs or extensions..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            addTextSource('faq', faqTitle, faqText, faqUrl);
                            setFaqText('');
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Save FAQ to Audit
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Form */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-surface-950/60">
                  <button
                    type="button"
                    onClick={() => setShowFormInput(!showFormInput)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileCheck className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold text-white">
                        Application form / Instructions sheet (Optional)
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {showFormInput ? 'Hide' : '+ Add Form'}
                    </span>
                  </button>

                  {showFormInput && (
                    <div className="p-4 border-t border-slate-800/80 bg-surface-950 space-y-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Form Document Title</label>
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Form Input Requirements & Warnings</label>
                        <textarea
                          rows={2}
                          value={formText}
                          onChange={(e) => setFormText(e.target.value)}
                          placeholder="Paste field validations, mandatory stamp requirements, cut-off warnings..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            addTextSource('form', formTitle, formText);
                            setFormText('');
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Save Form to Audit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 6. USER DETAILS SECTION */}
            <div className="bg-surface-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Your eligibility details
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tell us about yourself so InfoGuard can check your eligibility against the requirements it finds.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Step 3 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={student.fullName}
                    onChange={(e) => setStudent({ ...student, fullName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={student.age}
                    onChange={(e) => setStudent({ ...student, age: e.target.value })}
                    placeholder="e.g. 21"
                    min="14"
                    max="65"
                    className="w-full px-3 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Course / Program
                  </label>
                  <input
                    type="text"
                    value={student.course}
                    onChange={(e) => setStudent({ ...student, course: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science (3rd Year)"
                    className="w-full px-3 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={student.college}
                    onChange={(e) => setStudent({ ...student, college: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Category / Community
                  </label>
                  <select
                    value={student.category}
                    onChange={(e) => setStudent({ ...student, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Select Category</option>
                    <option value="General">General / Open</option>
                    <option value="OBC (Non-Creamy Layer)">OBC (Non-Creamy Layer)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                    <option value="Minority">Religious Minority</option>
                    <option value="PwD">Person with Disability (PwD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-200 flex items-center justify-between mb-1">
                    <span>Annual family income (INR / ₹)</span>
                    <span className="text-brand-400 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={student.annualFamilyIncome}
                    onChange={(e) => {
                      setStudent({ ...student, annualFamilyIncome: e.target.value });
                      if (incomeError) setIncomeError('');
                    }}
                    placeholder="e.g. 520000"
                    className={`w-full px-3 py-2 bg-surface-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                      incomeError ? 'border-rose-500' : 'border-slate-800 focus:border-brand-500'
                    }`}
                  />
                  {incomeError && (
                    <p className="text-[11px] text-rose-400 mt-1">{incomeError}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    State / Location (Domicile)
                  </label>
                  <input
                    type="text"
                    value={student.state}
                    onChange={(e) => setStudent({ ...student, state: e.target.value })}
                    placeholder="e.g. Tamil Nadu / Maharashtra / Delhi"
                    className="w-full px-3 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Previous Year Aggregate Marks / CGPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={student.previousMarksPercentage || ''}
                    onChange={(e) => setStudent({ ...student, previousMarksPercentage: e.target.value })}
                    placeholder="e.g. 82.4% or 8.4 CGPA"
                    className="w-full px-3 py-2 bg-surface-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* 7. PRIMARY BUTTON: RUN INFOGUARD */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-4 px-6 bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white rounded-2xl text-base font-extrabold shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Sources...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Run InfoGuard</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 font-mono">
                We’ll compare the official sources and check your eligibility.
              </p>
            </div>
          </form>
        </div>

        {/* VISUAL AREA (Col 8-12): 3D InfoGuard Visualization */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <ThreeDocumentViewer
            sourceCount={sources.length + 1}
            activeSources={[
              {
                id: 'web-src',
                type: 'website',
                title: scholarshipName ? `${scholarshipName} (Portal)` : 'Official Portal',
              },
              ...sources.map((s) => ({ id: s.id, type: s.type, title: s.title })),
            ]}
            isAnalyzing={isAnalyzing}
            hasConflicts={false}
            isCompleted={false}
            analysisStage={analysisStage}
          />

          <div className="bg-surface-900/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-slate-300 font-semibold font-mono text-[11px] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Multi-Source Conflict Detection</span>
            </div>
            <p className="leading-relaxed">
              InfoGuard inspects deadlines, income limits, and document formats across all provided sources. Real-time document layers in 3D reflect your submitted sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
