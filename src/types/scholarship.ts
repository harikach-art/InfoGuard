export type SourceType = 'website' | 'notification' | 'faq' | 'form' | 'instructions';

export interface OfficialSource {
  id: string;
  type: SourceType;
  title: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
  textContent: string;
  publicationDate?: string;
  circularNo?: string;
  addedAt: string;
  status: 'active' | 'parsed' | 'error';
  pageCount?: number;
}

export interface StudentDetails {
  fullName: string;
  age: string;
  course: string;
  college: string;
  category: string;
  annualFamilyIncome: string;
  state: string;
  previousMarksPercentage?: string;
  gender?: string;
  additionalNotes?: string;
}

export type RequirementCategory =
  | 'deadline'
  | 'income_limit'
  | 'age_limit'
  | 'course'
  | 'category'
  | 'location'
  | 'fees'
  | 'documents'
  | 'instructions';

export type AuditStatus =
  | 'Confirmed'
  | 'Likely Current'
  | 'Possible Conflict'
  | 'Requires Verification'
  | 'Cannot Determine'
  | 'Conditional Difference'
  | 'Potentially Outdated';

export type EligibilityStatus =
  | 'Likely Eligible'
  | 'Ineligible'
  | 'Conditionally Eligible'
  | 'Eligible but Incomplete'
  | 'Cannot Verify';

export interface SourceCitation {
  sourceName: string;
  sourceType: SourceType;
  quote: string;
  pageOrSection?: string;
  date?: string;
  referenceNo?: string;
}

export interface SourceConflict {
  id: string;
  requirement: string;
  category: RequirementCategory;
  status: AuditStatus;
  sourceA: SourceCitation;
  sourceB: SourceCitation;
  whyConflict: string;
  whatToVerify: string;
  authorityRecencyNote: string;
  severity: 'high' | 'medium' | 'low';
}

export interface SourceRequirementItem {
  id: string;
  category: RequirementCategory;
  label: string;
  websiteValue?: string;
  notificationValue?: string;
  faqValue?: string;
  formValue?: string;
  status: AuditStatus;
  conflictId?: string;
  notes: string;
}

export interface EligibilityCheckItem {
  criterion: string;
  status: EligibilityStatus;
  studentValue: string;
  sourceRequirement: string;
  reason: string;
  relevantSources: string[];
}

export interface VerificationQueueItem {
  id: string;
  title: string;
  category: RequirementCategory;
  type: 'conflict' | 'conditional' | 'outdated' | 'confirmed';
  reason: string;
  action: string;
  sourcesInvolved: string[];
  resolved: boolean;
}

export interface RealityReportData {
  scholarshipName: string;
  websiteUrl: string;
  analyzedAt: string;
  overallStatus: 'Action Required' | 'Requires Verification' | 'Consensus Confirmed';
  eligibilityVerdict: EligibilityStatus;
  eligibilitySummary: string;
  requirementsFound: SourceRequirementItem[];
  conflicts: SourceConflict[];
  outdatedInfo: {
    item: string;
    olderSource: string;
    newerSource: string;
    details: string;
  }[];
  missingInfo: {
    item: string;
    expectedIn: string;
    details: string;
  }[];
  requiredDocuments: {
    docName: string;
    mandatory: boolean;
    sourcesMentioning: string[];
    discrepancies?: string;
  }[];
  verificationQueue: VerificationQueueItem[];
  sourcesSummary: {
    id: string;
    type: SourceType;
    title: string;
    url?: string;
    date?: string;
    charCount: number;
  }[];
  studentSnapshot: StudentDetails;
}

export type ActiveNavTab =
  | 'dashboard'
  | 'analyze'
  | 'eligibility'
  | 'audit'
  | 'report'
  | 'documents'
  | 'settings';
