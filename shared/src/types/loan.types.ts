/**
 * Shared types and interfaces for the Loan Management System
 * These types are used across both frontend and backend
 */

// Base Loan Types
export interface LoanAmount {
  min: number;
  max: number;
  requested?: number;
}

export interface RepaymentTerm {
  min: number; // in months
  max: number; // in months
}

export interface Eligibility {
  minAge: number;
  maxAge: number;
  minIncome: number;
  creditScoreMin: number;
  organizationType: OrganizationType[];
  businessAge: number; // in months
  sector: string[];
}

// Enums
export enum LenderType {
  GOVERNMENT = 'government',
  BANK = 'bank',
  NBFC = 'nbfc',
  PRIVATE = 'private',
  FINTECH = 'fintech',
  OTHER = 'other'
}

export enum LoanCategory {
  STARTUP = 'startup',
  SME = 'sme',
  NGO = 'ngo',
  EDUCATION = 'education',
  AGRICULTURE = 'agriculture',
  PERSONAL = 'personal',
  HOME = 'home'
}

export enum OrganizationType {
  STARTUP = 'startup',
  SME = 'sme',
  NGO = 'ngo',
  INDIVIDUAL = 'individual',
  INSTITUTION = 'institution',
  FARMER = 'farmer',
  COOPERATIVE = 'cooperative'
}

export enum ApplicationStatus {
  CLICKED = 'clicked',
  REDIRECTED = 'redirected',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

// Main Loan Interface
export interface Loan {
  id: string;
  name: string;
  lender: string;
  lenderType: LenderType;
  category: LoanCategory;
  country: string;
  interestRate: string;
  loanAmount: LoanAmount;
  repaymentTerm: RepaymentTerm;
  processingFee: string;
  collateral: boolean;
  eligibility: Eligibility;
  description: string;
  benefits: string[];
  documents: string[];
  applicationUrl: string;
  processingTime: string;
  features: string[];
  lastUpdated?: string;
}

// Loan Application Interface
export interface LoanApplication {
  id?: string;
  loanId: string;
  loanName: string;
  lender: string;
  country: string;
  category: LoanCategory;
  lenderType: LenderType;
  applicationUrl: string;
  userIp?: string;
  userAgent?: string;
  sessionId?: string;
  referrer?: string;
  loanAmount?: {
    requested?: number;
    min?: number;
    max?: number;
  };
  interestRate?: string;
  status: ApplicationStatus;
  clickedAt?: Date;
  redirectedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Profile for Eligibility Check
export interface UserProfile {
  age: number;
  income: number;
  creditScore: number;
  organizationType: OrganizationType;
  businessAge: number; // in months
  sector: string;
  country?: string;
  loanAmount?: number;
}

// Analytics Types
export interface AnalyticsEvent {
  sessionId: string;
  action: string;
  page?: string;
  data?: Record<string, any>;
  userIp?: string;
  userAgent?: string;
  referrer?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  deviceInfo?: {
    type?: string;
    os?: string;
    browser?: string;
  };
  createdAt?: Date;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface StatsResponse {
  total: Array<{ count: number }>;
  byCountry: Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
  byLenderType: Array<{ _id: string; count: number }>;
  byStatus: Array<{ _id: string; count: number }>;
  recent: Array<{ _id: string; count: number }>;
  period?: string;
}

export interface PopularLoan {
  loanId: string;
  loanName: string;
  lender: string;
  country: string;
  category: string;
  applicationCount: number;
  lastApplied: Date;
}

// Filter Types
export interface LoanFilters {
  country?: string;
  category?: LoanCategory;
  lenderType?: LenderType;
  minAmount?: number;
  maxAmount?: number;
  maxInterestRate?: number;
  collateralFree?: boolean;
  search?: string;
}

export interface ApplicationFilters {
  country?: string;
  category?: LoanCategory;
  lenderType?: LenderType;
  status?: ApplicationStatus;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// Constants
export const LOAN_CATEGORIES = [
  { id: LoanCategory.STARTUP, name: 'Startup', description: 'Funding for new businesses and innovative ventures' },
  { id: LoanCategory.SME, name: 'SME', description: 'Loans for small and medium enterprises' },
  { id: LoanCategory.NGO, name: 'NGO', description: 'Grants and funding for non-profit organizations' },
  { id: LoanCategory.EDUCATION, name: 'Education', description: 'Educational loans for institutions and individuals' },
  { id: LoanCategory.AGRICULTURE, name: 'Agriculture', description: 'Loans for farmers and agricultural businesses' },
  { id: LoanCategory.PERSONAL, name: 'Personal', description: 'Personal loans for individual needs' },
  { id: LoanCategory.HOME, name: 'Home', description: 'Home loans and mortgage financing' }
];

export const LENDER_TYPES = [
  { id: LenderType.GOVERNMENT, name: 'Government Schemes', description: 'Government-backed loans and grants' },
  { id: LenderType.BANK, name: 'Banks', description: 'Traditional bank loans and credit facilities' },
  { id: LenderType.NBFC, name: 'NBFCs', description: 'Non-banking financial company loans' },
  { id: LenderType.PRIVATE, name: 'Private Lenders', description: 'Private financial institutions and fintech companies' },
  { id: LenderType.FINTECH, name: 'Fintech', description: 'Technology-driven financial services' },
  { id: LenderType.OTHER, name: 'Others', description: 'Other lending institutions' }
];

export const ORGANIZATION_TYPES = [
  { id: OrganizationType.STARTUP, name: 'Startup', description: 'Early-stage business ventures' },
  { id: OrganizationType.SME, name: 'SME', description: 'Small and medium enterprises' },
  { id: OrganizationType.NGO, name: 'NGO', description: 'Non-governmental organizations' },
  { id: OrganizationType.INDIVIDUAL, name: 'Individual', description: 'Individual applicants' },
  { id: OrganizationType.INSTITUTION, name: 'Institution', description: 'Educational or other institutions' },
  { id: OrganizationType.FARMER, name: 'Farmer', description: 'Agricultural professionals' },
  { id: OrganizationType.COOPERATIVE, name: 'Cooperative', description: 'Cooperative societies' }
];