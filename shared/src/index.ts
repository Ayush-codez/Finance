/**
 * @fileoverview Main entry point for the shared loan management package
 * @package @loan-management/shared
 * @version 1.0.0
 */

// Export all types
export * from './types/loan.types';

// Export all validation schemas
export * from './validation/schemas';

// Export all utilities
export * from './utils/loan.utils';

// Export all constants
export * from './constants/index';

// Re-export specific commonly used items for convenience
export {
  // Types
  type Loan,
  type LoanApplication,
  type UserProfile,
  type APIResponse,
  LenderType,
  LoanCategory,
  OrganizationType,
  ApplicationStatus,
  
  // Validation
  validateData,
  loanSchema,
  trackLoanApplicationSchema,
  userProfileSchema,
  
  // Utilities
  filterLoansByEligibility,
  filterLoans,
  searchLoans,
  calculateEligibilityScore,
  formatLoanAmount,
  formatInterestRate,
  
  // Constants
  LOAN_CATEGORIES,
  LENDER_TYPES,
  ORGANIZATION_TYPES,
  COUNTRIES,
  BUSINESS_SECTORS,
  ERROR_CODES,
  HTTP_STATUS,
  API_CONFIG,
  VALIDATION_RULES
} from './index';

// Package metadata
export const PACKAGE_INFO = {
  name: '@loan-management/shared',
  version: '1.0.0',
  description: 'Shared utilities, types, and constants for loan management system'
} as const;