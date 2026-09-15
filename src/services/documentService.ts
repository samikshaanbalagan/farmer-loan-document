import { sampleDocument } from '../data/mockData';
import type { LoanDocument } from '../types';

export function analyzeUploadedDocument(fileName: string): LoanDocument {
  const doc = JSON.parse(JSON.stringify(sampleDocument)) as LoanDocument;

  if (fileName.toLowerCase().includes('kcc')) {
    doc.title = 'Your Loan Document';
    doc.subtitle = 'We found the following information in your document.';
  }

  return doc;
}

export function getDocumentCompleteness(document: LoanDocument): number {
  const missingFields = document.applicant.filter((field) => field.value.includes('Not found') || field.value.includes('Awaiting')).length;
  const missingRepayment = document.repayment.some((field) => field.value.includes('Not found')) ? 1 : 0;
  const missingDocs = document.requiredDocuments.filter((item) => item.status === 'missing').length;
  const penalty = missingFields + missingRepayment + missingDocs;
  const base = 100;
  return Math.max(40, base - penalty * 4);
}
