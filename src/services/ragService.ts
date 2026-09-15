import { knowledgeBase, sampleDocument } from '../data/mockData';
import type { LoanDocument, RAGResult } from '../types';

export function askRAG(question: string, document: LoanDocument, language: string): RAGResult {
  const normalized = question.toLowerCase();

  if (normalized.includes('document') || normalized.includes('documents') || normalized.includes('missing')) {
    return {
      question,
      answer:
        'You may need identity proof, address proof, land or cultivation proof, bank account details and recent photographs. Some required items are still missing from the uploaded file.',
      why: 'Retrieved from KCC Crop Loan Guidelines',
      section: 'Required Documents',
      page: '3',
      confidence: 94,
      source: 'KCC Crop Loan Guidelines',
      language,
    };
  }

  if (normalized.includes('eligible') || normalized.includes('eligibility')) {
    const land = document.applicant.find((field) => field.label === 'Land Area')?.value ?? 'not provided';
    const crop = document.applicant.find((field) => field.label === 'Primary Crop')?.value ?? 'not provided';
    return {
      question,
      answer: `Your document shows ${crop} and land information as ${land}. The retrieved eligibility guideline states that small or marginal farmers with eligible agricultural land and crop activity may be considered, but final eligibility is decided by the lender.`,
      why: 'Retrieved from KCC Eligibility Guidelines',
      section: 'Eligibility',
      page: '4',
      confidence: 92,
      source: 'KCC Eligibility Guidelines',
      language,
    };
  }

  if (normalized.includes('moratorium')) {
    return {
      question,
      answer: 'Moratorium means a temporary pause or adjustment in loan repayment timing, often linked to crop cycles or sanctioned terms. It is not a guarantee and depends on the final sanctioned conditions.',
      why: 'Retrieved from Agricultural Lending Glossary',
      section: 'Loan Terms',
      page: '11',
      confidence: 96,
      source: 'Agricultural Lending Glossary',
      language,
    };
  }

  if (normalized.includes('amount') || normalized.includes('loan')) {
    const amount = document.loan.find((field) => field.label === 'Sanctioned Loan Amount')?.value ?? 'not specified';
    return {
      question,
      answer: `According to the uploaded document, the sanctioned loan amount is ${amount}. This is the amount currently stated in the document and should be verified with the bank before acting on it.`,
      why: 'Retrieved from uploaded document',
      section: 'Loan Amount',
      page: '3',
      confidence: 98,
      source: 'Uploaded Document',
      language,
    };
  }

  if (normalized.includes('collateral') || normalized.includes('security')) {
    return {
      question,
      answer: 'The uploaded document does not clearly state a collateral requirement for this particular amount. Collateral rules may depend on lender policy, scheme conditions and asset type.',
      why: 'Retrieved from Crop Loan Guidelines and uploaded document',
      section: 'Security / Collateral',
      page: '6',
      confidence: 88,
      source: 'Crop Loan Guidelines',
      language,
    };
  }

  const fallback = knowledgeBase[0];
  return {
    question,
    answer: 'I could not find sufficient information in the available loan documents. Please confirm this with your bank or authorized loan officer.',
    why: `Retrieved from ${fallback.document}`,
    section: fallback.section,
    page: String(fallback.page),
    confidence: 74,
    source: fallback.document,
    language,
  };
}

export function checkEligibilityStatus(document: LoanDocument): { status: 'satisfied' | 'review' | 'not-found'; text: string } {
  const farmerType = document.applicant.find((field) => field.label === 'Farmer Category')?.value ?? 'Unknown';
  const land = document.applicant.find((field) => field.label === 'Land Area')?.value ?? 'Not provided';
  const crop = document.applicant.find((field) => field.label === 'Primary Crop')?.value ?? 'Not provided';

  if (land.includes('Not found') || crop.includes('Not found')) {
    return {
      status: 'review',
      text: '🟡 Additional verification required. Please provide land area and crop to compare with the eligibility clause.',
    };
  }

  if (farmerType.toLowerCase().includes('small') || farmerType.toLowerCase().includes('marginal')) {
    return {
      status: 'satisfied',
      text: '🟢 Conditions appear satisfied based on the available document and guideline. Final eligibility is decided by the lending institution.',
    };
  }

  return {
    status: 'not-found',
    text: '🔴 Conditions not found or not matched. This is an informational assessment only. Final eligibility must be confirmed by the lender.',
  };
}

export function getMockKnowledgeBase() {
  return knowledgeBase;
}

export function getDemoDocument() {
  return sampleDocument;
}
