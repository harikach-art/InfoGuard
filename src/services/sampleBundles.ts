import type { OfficialSource, StudentDetails } from '../types/scholarship';

export interface SampleBundle {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  sources: Omit<OfficialSource, 'id' | 'addedAt'>[];
  student: StudentDetails;
}

export const SAMPLE_BUNDLES: SampleBundle[] = [
  {
    id: 'central-post-matric-2025',
    name: 'National Post-Matric Merit Scholarship (2025–26)',
    description: 'Real-world example featuring conflicting deadline dates, income discrepancy between gazette notice & web portal, and ambiguous income certificate authority.',
    websiteUrl: 'https://scholarships.gov.in/scheme/post-matric-merit-2025',
    sources: [
      {
        type: 'website',
        title: 'Official Portal Landing Page (Version 2.4)',
        url: 'https://scholarships.gov.in/scheme/post-matric-merit-2025',
        publicationDate: '2025-08-15',
        circularNo: 'WEB-NSP-2025/11',
        textContent: `NATIONAL POST-MATRIC MERIT SCHOLARSHIP PORTAL (AY 2025-26)
Scheme Guidelines & Key Dates:
1. Application Closing Date: All candidates must submit final online applications by October 31, 2025 (23:59 IST). Defective applications can be re-submitted up to November 5, 2025.
2. Financial Eligibility: Total annual family income from all sources must not exceed INR 4,50,000/- (Rupees Four Lakh Fifty Thousand) per annum.
3. Age Requirement: Applicant must be under 25 years of age as on 1st July 2025.
4. Eligible Courses: Regular full-time Undergraduate and Postgraduate programs in recognized Government/Aided universities. Distance learning is not eligible.
5. Application Fee: Strictly zero fee for registration.
6. Documentation: Valid Aadhaar card, Bonafide Student Certificate, and Income Certificate issued by an authorized revenue authority.`,
        status: 'parsed',
        pageCount: 1,
      },
      {
        type: 'notification',
        title: 'Ministry Official Gazette Notification (Circular No. 2401/MHRD)',
        fileName: 'Gazette_Notification_Merit_2025_Final.pdf',
        publicationDate: '2025-09-02',
        circularNo: 'OM-2401/EDU/2025',
        textContent: `MINISTRY OF EDUCATION & HUMAN RESOURCE DEVELOPMENT
OFFICIAL NOTIFICATION — REFERENCE OM-2401/EDU/2025
Subject: Revision of Guidelines for Post-Matric Merit Scheme for Higher Education.
Section 3.2 — Timetable & Deadlines:
Pursuant to academic calendar delays, the Competent Authority has scheduled the last date of application submission as November 15, 2025. Institutional verification window opens November 16 to November 30, 2025.
Section 4.1 — Income Ceiling Revision:
In accordance with Cabinet Resolution No. 44/2025, the family income threshold has been updated: Total annual family income from all sources shall not exceed INR 6,00,000/- (Rupees Six Lakh) per annum. (Supersedes all earlier circulars of AY 2024-25).
Section 4.3 — Age Limitations:
There shall be NO upper age ceiling for students enrolled in professional technical degree courses (B.Tech, B.E., MBBS, BDS). For general Arts/Commerce/Science degrees, applicant age must not exceed 25 years.
Section 7.4 — Compulsory Document Standards:
Income Certificate must be signed and stamped exclusively by a Sub-Divisional Magistrate (SDM), Revenue Divisional Officer (RDO), or Tehsildar with digital barcode verification.`,
        status: 'parsed',
        pageCount: 4,
      },
      {
        type: 'faq',
        title: 'Official Directorate FAQ Document (Released July 2025)',
        url: 'https://scholarships.gov.in/faq/post-matric-v1.pdf',
        publicationDate: '2025-07-20',
        circularNo: 'FAQ-2025-REV1',
        textContent: `FREQUENTLY ASKED QUESTIONS — SCHOLARSHIP DIVISION
Q4: What is the maximum income eligible for this scheme?
A4: As per general state social welfare guidelines, applicant family income must be below INR 4,50,000 per annum.
Q9: Can I submit a self-declaration or salary slip instead of an SDM income certificate?
A9: For non-salaried or agricultural households, a notarized affidavit / self-declaration attested by an Executive Magistrate or Village Administrative Officer (VAO) is accepted if Tehsildar certificate is delayed.
Q14: Is there an extension for students in North-Eastern States or UTs?
A14: Yes. Applications from Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Sikkim and Ladakh are granted an extended submission window until November 30, 2025.`,
        status: 'parsed',
        pageCount: 3,
      },
      {
        type: 'form',
        title: 'Official Online Application Form Instruction Sheet (v3.0)',
        fileName: 'Application_Form_Instructions_2025.pdf',
        publicationDate: '2025-08-01',
        textContent: `ONLINE APPLICATION FORM INSTRUCTIONS & SYSTEM REQUIREMENTS
Field 12: Income Verification:
Warning: System will reject submissions where income certificate is issued by authority below the rank of Tehsildar. Self-declarations and notary affidavits are STRICTLY NOT ACCEPTABLE in the automated portal verification system.
Field 18: Declaration of Domicile:
Candidate must upload permanent domicile certificate of the state in which college is located, OR provide continuous residential proof of minimum 3 years.
Field 22: Submission Deadline:
Portal server clock will automatically terminate accepts on October 31, 2025 at 23:59:59 PM.`,
        status: 'parsed',
        pageCount: 2,
      },
    ],
    student: {
      fullName: 'Aarav Sharma',
      age: '23',
      course: 'B.Tech in Computer Science & Engineering (3rd Year)',
      college: 'National Institute of Technology, Trichy',
      category: 'OBC (Non-Creamy Layer)',
      annualFamilyIncome: '520000',
      state: 'Tamil Nadu',
      previousMarksPercentage: '82.4%',
      gender: 'Male',
      additionalNotes: 'Enrolled in full-time professional 4-year degree. Income is ₹5.2 Lakhs/year.',
    },
  },
  {
    id: 'state-stem-fellowship',
    name: 'State STEM Women & Research Fellowship 2025',
    description: 'Highlights critical submission mode conflict (digital-only portal claim vs mandatory physical speed-post printout requirement in official gazette).',
    websiteUrl: 'https://dst.state.gov.in/fellowships/stem-women-2025',
    sources: [
      {
        type: 'website',
        title: 'Department of Science & Technology Portal Notice',
        url: 'https://dst.state.gov.in/fellowships/stem-women-2025',
        publicationDate: '2025-09-10',
        textContent: `STATE DST STEM FELLOWSHIP 2025-26
100% PAPERLESS APPLICATION NOTICE:
- All applications must be submitted solely through the web portal before December 15, 2025.
- Do NOT send any physical hardcopies to the directorate. Any physical mails will be discarded without review.
- Eligibility: Female students enrolled in M.Sc, M.Tech, or Integrated Ph.D in STEM disciplines.
- Family income: Below INR 8,00,000 per annum.
- Age: 21 to 32 years as of 31st December 2025.`,
        status: 'parsed',
        pageCount: 1,
      },
      {
        type: 'notification',
        title: 'Executive Order & Submission Guidelines (Signed by Undersecretary)',
        fileName: 'EO_STEM_Grant_Rules_2025.pdf',
        publicationDate: '2025-09-18',
        circularNo: 'DST/ORD-882/2025',
        textContent: `EXECUTIVE ORDER NO. 882/DST/2025
Sub-Rule 8(c) — Mandatory Physical Verification:
Notwithstanding online form registration, the candidate MUST take a printout of the generated application form, affix signature, obtain Dean/Registrar countersignature with college seal, and send via Registered Post / Speed Post to: The Director of Science & Technology, Secretariat Campus, Capital Complex, so as to reach on or before December 22, 2025.
Failure to deliver the physical dossier will result in automatic disqualification at preliminary scrutiny stage.
Minimum Marks: Candidate must have secured minimum 75% marks or 7.5 CGPA in Bachelor's degree.`,
        status: 'parsed',
        pageCount: 3,
      },
      {
        type: 'faq',
        title: 'Applicant Helpdesk Advisory Note',
        url: 'https://dst.state.gov.in/help/stem-faq.pdf',
        publicationDate: '2025-09-25',
        textContent: `FAQ & CLARIFICATIONS:
Q1: Is hardcopy mandatory?
A1: Candidates are advised to adhere to Executive Order 882. While the web team is updating the online portal notices, physical dispatch before December 22 remains in force.
Q2: What is the minimum marks for reserved candidates?
A2: A relaxation of 5% in aggregate marks (i.e., 70% or 7.0 CGPA) is applicable for SC, ST and PwD applicants.`,
        status: 'parsed',
        pageCount: 2,
      },
    ],
    student: {
      fullName: 'Priya Narayanan',
      age: '24',
      course: 'M.Tech in Data Science & Artificial Intelligence',
      college: 'Anna University, Chennai',
      category: 'General',
      annualFamilyIncome: '650000',
      state: 'Tamil Nadu',
      previousMarksPercentage: '78.5%',
      gender: 'Female',
      additionalNotes: 'Applying for STEM fellowship. Wondering whether physical posting is required.',
    },
  },
  {
    id: 'merit-higher-ed-grant',
    name: 'Higher Education Corporate Social Responsibility (CSR) Grant',
    description: 'Shows fee ambiguity (advertised as free, but official form mandates an unrefundable administrative demand draft) and conflicting course categories.',
    websiteUrl: 'https://csr-scholarship-foundation.org/higher-ed-2025',
    sources: [
      {
        type: 'website',
        title: 'Foundation Public Announcement',
        url: 'https://csr-scholarship-foundation.org/higher-ed-2025',
        publicationDate: '2025-07-01',
        textContent: `CSR FOUNDATION HIGHER EDUCATION INITIATIVE
- Free registration for all deserving college students across India.
- Deadline: 10th October 2025.
- Eligibility: Open to all undergraduate programs including Arts, Commerce, Science, Medicine, and Law.
- Minimum 60% in 12th standard.`,
        status: 'parsed',
        pageCount: 1,
      },
      {
        type: 'form',
        title: 'Application Form Document & Fee Voucher',
        fileName: 'CSR_Form_Printable_2025.pdf',
        publicationDate: '2025-08-10',
        textContent: `SECTION 4: APPLICATION PROCESSING CHARGE
All non-BPL applicants must enclose a non-refundable Demand Draft of INR 350/- drawn in favor of 'CSR Education Trust' payable at Mumbai. Applications without valid DD number will not be processed.
SECTION 6: ELIGIBLE STREAMS
Limited strictly to STEM (Science, Technology, Engineering, Mathematics) and MBBS students. Applications from Humanities and Commerce will be rejected.`,
        status: 'parsed',
        pageCount: 2,
      },
      {
        type: 'instructions',
        title: 'Foundation Trustee Clarification Circular',
        publicationDate: '2025-09-01',
        circularNo: 'TR-19/2025',
        textContent: `TRUSTEE CLARIFICATION NOTE:
The earlier announcement on the website regarding non-STEM courses has been suspended due to budget constraints. For 2025-26, awards will prioritize Engineering and Medical sciences. Application fee is exempt only for applicants possessing valid Antyodaya Anna Yojana (AAY) ration card.`,
        status: 'parsed',
        pageCount: 1,
      },
    ],
    student: {
      fullName: 'Vikram Joshi',
      age: '20',
      course: 'Bachelor of Commerce (Honours) - 2nd Year',
      college: 'Delhi University',
      category: 'General',
      annualFamilyIncome: '320000',
      state: 'Delhi',
      previousMarksPercentage: '88.0%',
      gender: 'Male',
      additionalNotes: 'Wants to apply for B.Com (Honours). Checking stream eligibility and fees.',
    },
  },
];
