export type SourceType = 'DOCUMENT' | 'FARMER PROVIDED' | 'RAG SOURCE';

export interface FieldRecord {
  label: string;
  value: string;
  source: SourceType;
  sourceDetail: string;
}

export interface RequiredDocumentRecord {
  name: string;
  required: boolean;
  status: 'uploaded' | 'missing';
  source: string;
}

export interface ResponsibilityItem {
  label: string;
  explain: string;
  source: string;
}

export interface MissingItem {
  title: string;
  detail: string;
  type: 'field' | 'document';
  actionLabel: string;
}

export interface LoanDocument {
  title: string;
  subtitle: string;
  applicant: FieldRecord[];
  loan: FieldRecord[];
  interest: FieldRecord[];
  eligibility: FieldRecord[];
  requiredDocuments: RequiredDocumentRecord[];
  collateral: FieldRecord[];
  repayment: FieldRecord[];
  responsibilities: ResponsibilityItem[];
  completeness: number;
  missingItems: MissingItem[];
}

export interface RAGResult {
  question: string;
  answer: string;
  why: string;
  section: string;
  page: string;
  confidence: number;
  source: string;
  language: string;
}
