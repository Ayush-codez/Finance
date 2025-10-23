import { Loan, LoanFilters, UserProfile, LoanCategory, LenderType, OrganizationType } from '../types/loan.types';

/**
 * Shared utility functions for loan operations
 * These utilities are used across both frontend and backend
 */

// Loan filtering utilities
export const filterLoansByEligibility = (loans: Loan[], userProfile: UserProfile): Loan[] => {
  return loans.filter(loan => {
    const { eligibility } = loan;
    
    // Age check
    if (userProfile.age < eligibility.minAge || userProfile.age > eligibility.maxAge) {
      return false;
    }
    
    // Income check
    if (userProfile.income < eligibility.minIncome) {
      return false;
    }
    
    // Credit score check
    if (userProfile.creditScore < eligibility.creditScoreMin) {
      return false;
    }
    
    // Organization type check
    if (!eligibility.organizationType.includes(userProfile.organizationType)) {
      return false;
    }
    
    // Business age check (in months)
    if (userProfile.businessAge < eligibility.businessAge) {
      return false;
    }
    
    // Sector check
    if (!eligibility.sector.includes(userProfile.sector) && !eligibility.sector.includes('all')) {
      return false;
    }
    
    return true;
  });
};

export const filterLoans = (loans: Loan[], filters: LoanFilters): Loan[] => {
  return loans.filter(loan => {
    // Country filter
    if (filters.country && loan.country.toLowerCase() !== filters.country.toLowerCase()) {
      return false;
    }
    
    // Category filter
    if (filters.category && loan.category !== filters.category) {
      return false;
    }
    
    // Lender type filter
    if (filters.lenderType && loan.lenderType !== filters.lenderType) {
      return false;
    }
    
    // Loan amount filters
    if (filters.minAmount && loan.loanAmount.min > filters.minAmount) {
      return false;
    }
    
    if (filters.maxAmount && loan.loanAmount.max < filters.maxAmount) {
      return false;
    }
    
    // Collateral filter
    if (filters.collateralFree === true && loan.collateral === true) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchFields = [
        loan.name,
        loan.lender,
        loan.description,
        loan.category,
        ...loan.benefits,
        ...loan.features
      ].join(' ').toLowerCase();
      
      if (!searchFields.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

// Loan search utilities
export const searchLoans = (loans: Loan[], query: string): Loan[] => {
  if (!query || query.trim().length < 2) {
    return loans;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return loans.filter(loan => {
    const searchableText = [
      loan.name,
      loan.lender,
      loan.description,
      loan.category,
      loan.country,
      ...loan.benefits,
      ...loan.features,
      ...loan.documents
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
};

// Loan sorting utilities
export const sortLoans = (loans: Loan[], sortBy: 'name' | 'interestRate' | 'loanAmount' | 'processingTime', sortOrder: 'asc' | 'desc' = 'asc'): Loan[] => {
  const sortedLoans = [...loans];
  
  sortedLoans.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'interestRate':
        // Extract numeric value from interest rate string
        const rateA = parseFloat(a.interestRate.replace(/[^\d.-]/g, ''));
        const rateB = parseFloat(b.interestRate.replace(/[^\d.-]/g, ''));
        comparison = rateA - rateB;
        break;
      case 'loanAmount':
        comparison = a.loanAmount.max - b.loanAmount.max;
        break;
      case 'processingTime':
        // Simple comparison based on processing time string
        comparison = a.processingTime.localeCompare(b.processingTime);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  return sortedLoans;
};

// Loan categorization utilities
export const getLoansByCategory = (loans: Loan[], category: LoanCategory): Loan[] => {
  return loans.filter(loan => loan.category === category);
};

export const getLoansByLenderType = (loans: Loan[], lenderType: LenderType): Loan[] => {
  return loans.filter(loan => loan.lenderType === lenderType);
};

export const getLoansByCountry = (loans: Loan[], country: string): Loan[] => {
  return loans.filter(loan => loan.country.toLowerCase() === country.toLowerCase());
};

// Utility to get unique values
export const getUniqueCountries = (loans: Loan[]): string[] => {
  const countries = [...new Set(loans.map(loan => loan.country))];
  return countries.sort();
};

export const getUniqueLenders = (loans: Loan[]): string[] => {
  const lenders = [...new Set(loans.map(loan => loan.lender))];
  return lenders.sort();
};

export const getUniqueSectors = (loans: Loan[]): string[] => {
  const sectors = [...new Set(loans.flatMap(loan => loan.eligibility.sector))];
  return sectors.sort();
};

// Loan comparison utilities
export const compareLoans = (loans: Loan[]): { 
  bestInterestRate: Loan | null;
  highestAmount: Loan | null;
  fastestProcessing: Loan | null;
  noCollateral: Loan[];
} => {
  if (loans.length === 0) {
    return {
      bestInterestRate: null,
      highestAmount: null,
      fastestProcessing: null,
      noCollateral: []
    };
  }
  
  // Find loan with best (lowest) interest rate
  const bestInterestRate = loans.reduce((best, current) => {
    const bestRate = parseFloat(best.interestRate.replace(/[^\d.-]/g, ''));
    const currentRate = parseFloat(current.interestRate.replace(/[^\d.-]/g, ''));
    return currentRate < bestRate ? current : best;
  });
  
  // Find loan with highest amount
  const highestAmount = loans.reduce((highest, current) => {
    return current.loanAmount.max > highest.loanAmount.max ? current : highest;
  });
  
  // Find loans with no collateral requirement
  const noCollateral = loans.filter(loan => !loan.collateral);
  
  // Simple fastest processing (this could be improved with better parsing)
  const fastestProcessing = loans.reduce((fastest, current) => {
    // Simple heuristic: shorter string likely means faster processing
    return current.processingTime.length < fastest.processingTime.length ? current : fastest;
  });
  
  return {
    bestInterestRate,
    highestAmount,
    fastestProcessing,
    noCollateral
  };
};

// Eligibility scoring utilities
export const calculateEligibilityScore = (loan: Loan, userProfile: UserProfile): {
  score: number;
  eligible: boolean;
  reasons: string[];
} => {
  let score = 0;
  let eligible = true;
  const reasons: string[] = [];
  const maxScore = 100;
  
  const { eligibility } = loan;
  
  // Age check (20 points)
  if (userProfile.age >= eligibility.minAge && userProfile.age <= eligibility.maxAge) {
    score += 20;
  } else {
    eligible = false;
    reasons.push(`Age must be between ${eligibility.minAge} and ${eligibility.maxAge}`);
  }
  
  // Income check (25 points)
  if (userProfile.income >= eligibility.minIncome) {
    score += 25;
    // Bonus points for higher income
    const incomeRatio = userProfile.income / eligibility.minIncome;
    score += Math.min(5, incomeRatio - 1);
  } else {
    eligible = false;
    reasons.push(`Minimum income required: ${eligibility.minIncome.toLocaleString()}`);
  }
  
  // Credit score check (20 points)
  if (userProfile.creditScore >= eligibility.creditScoreMin) {
    score += 20;
    // Bonus points for higher credit score
    const creditBonus = Math.min(5, (userProfile.creditScore - eligibility.creditScoreMin) / 50);
    score += creditBonus;
  } else {
    eligible = false;
    reasons.push(`Minimum credit score required: ${eligibility.creditScoreMin}`);
  }
  
  // Organization type check (15 points)
  if (eligibility.organizationType.includes(userProfile.organizationType)) {
    score += 15;
  } else {
    eligible = false;
    reasons.push(`Organization type must be: ${eligibility.organizationType.join(', ')}`);
  }
  
  // Business age check (10 points)
  if (userProfile.businessAge >= eligibility.businessAge) {
    score += 10;
  } else {
    eligible = false;
    const yearsRequired = Math.ceil(eligibility.businessAge / 12);
    reasons.push(`Business must be at least ${yearsRequired} years old`);
  }
  
  // Sector check (10 points)
  if (eligibility.sector.includes(userProfile.sector) || eligibility.sector.includes('all')) {
    score += 10;
  } else {
    eligible = false;
    reasons.push(`Business sector must be: ${eligibility.sector.join(', ')}`);
  }
  
  return {
    score: Math.min(maxScore, Math.round(score)),
    eligible,
    reasons
  };
};

// Format utilities
export const formatLoanAmount = (amount: number, currency: string = '₹'): string => {
  if (amount >= 10000000) { // 1 crore
    return `${currency}${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `${currency}${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 thousand
    return `${currency}${(amount / 1000).toFixed(1)}K`;
  } else {
    return `${currency}${amount.toLocaleString()}`;
  }
};

export const formatInterestRate = (rate: string): string => {
  // Extract numeric values and format consistently
  const matches = rate.match(/(\d+(?:\.\d+)?)/g);
  if (!matches) return rate;
  
  if (matches.length === 1) {
    return `${matches[0]}%`;
  } else if (matches.length >= 2) {
    return `${matches[0]}-${matches[1]}%`;
  }
  
  return rate;
};

export const formatProcessingTime = (time: string): string => {
  // Standardize processing time format
  const lowerTime = time.toLowerCase();
  
  if (lowerTime.includes('hour')) {
    return time.replace(/hours?/gi, 'hrs');
  } else if (lowerTime.includes('day')) {
    return time.replace(/days?/gi, 'days');
  } else if (lowerTime.includes('week')) {
    return time.replace(/weeks?/gi, 'weeks');
  } else if (lowerTime.includes('month')) {
    return time.replace(/months?/gi, 'months');
  }
  
  return time;
};