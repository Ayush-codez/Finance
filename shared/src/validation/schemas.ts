import Joi from 'joi';
import { LenderType, LoanCategory, OrganizationType, ApplicationStatus } from '../types/loan.types';

/**
 * Shared validation schemas for the Loan Management System
 * These schemas are used for request validation on both frontend and backend
 */

// Base schemas
export const loanAmountSchema = Joi.object({
  min: Joi.number().positive().required(),
  max: Joi.number().positive().greater(Joi.ref('min')).required(),
  requested: Joi.number().positive().optional()
});

export const repaymentTermSchema = Joi.object({
  min: Joi.number().positive().required(),
  max: Joi.number().positive().greater(Joi.ref('min')).required()
});

export const eligibilitySchema = Joi.object({
  minAge: Joi.number().integer().min(16).max(100).required(),
  maxAge: Joi.number().integer().min(Joi.ref('minAge')).max(100).required(),
  minIncome: Joi.number().min(0).required(),
  creditScoreMin: Joi.number().integer().min(300).max(850),
  organizationType: Joi.array().items(
    Joi.string().valid(...Object.values(OrganizationType))
  ).min(1).required(),
  businessAge: Joi.number().integer().min(0).required(), // in months
  sector: Joi.array().items(Joi.string()).min(1).required()
});

// Loan schema
export const loanSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().trim().min(3).max(200).required(),
  lender: Joi.string().trim().min(2).max(100).required(),
  lenderType: Joi.string().valid(...Object.values(LenderType)).required(),
  category: Joi.string().valid(...Object.values(LoanCategory)).required(),
  country: Joi.string().trim().min(2).max(50).required(),
  interestRate: Joi.string().required(),
  loanAmount: loanAmountSchema.required(),
  repaymentTerm: repaymentTermSchema.required(),
  processingFee: Joi.string().required(),
  collateral: Joi.boolean().required(),
  eligibility: eligibilitySchema.required(),
  description: Joi.string().trim().min(10).max(1000).required(),
  benefits: Joi.array().items(Joi.string().trim()).min(1).required(),
  documents: Joi.array().items(Joi.string().trim()).min(1).required(),
  applicationUrl: Joi.string().uri().required(),
  processingTime: Joi.string().required(),
  features: Joi.array().items(Joi.string().trim()).min(1).required(),
  lastUpdated: Joi.string().isoDate().optional()
});

// Loan application tracking schema
export const trackLoanApplicationSchema = Joi.object({
  loanId: Joi.string().required(),
  loanName: Joi.string().trim().min(3).max(200).required(),
  lender: Joi.string().trim().min(2).max(100).required(),
  country: Joi.string().trim().min(2).max(50).required(),
  category: Joi.string().valid(...Object.values(LoanCategory)).required(),
  lenderType: Joi.string().valid(...Object.values(LenderType)).required(),
  applicationUrl: Joi.string().uri().required(),
  sessionId: Joi.string().optional(),
  referrer: Joi.string().uri().allow('', null).optional(),
  loanAmount: Joi.object({
    requested: Joi.number().positive().optional(),
    min: Joi.number().positive().optional(),
    max: Joi.number().positive().optional()
  }).optional(),
  interestRate: Joi.string().optional()
});

// Update application status schema
export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(ApplicationStatus)).required()
});

// User profile schema for eligibility checking
export const userProfileSchema = Joi.object({
  age: Joi.number().integer().min(16).max(100).required(),
  income: Joi.number().min(0).required(),
  creditScore: Joi.number().integer().min(300).max(850).required(),
  organizationType: Joi.string().valid(...Object.values(OrganizationType)).required(),
  businessAge: Joi.number().integer().min(0).required(), // in months
  sector: Joi.string().required(),
  country: Joi.string().trim().min(2).max(50).optional(),
  loanAmount: Joi.number().positive().optional()
});

// Analytics event schema
export const analyticsEventSchema = Joi.object({
  sessionId: Joi.string().required(),
  action: Joi.string().trim().min(2).max(50).required(),
  page: Joi.string().uri().allow('', null).optional(),
  data: Joi.object().optional(),
  utm: Joi.object({
    source: Joi.string().optional(),
    medium: Joi.string().optional(),
    campaign: Joi.string().optional()
  }).optional()
});

// Filter schemas
export const loanFiltersSchema = Joi.object({
  country: Joi.string().trim().optional(),
  category: Joi.string().valid(...Object.values(LoanCategory)).optional(),
  lenderType: Joi.string().valid(...Object.values(LenderType)).optional(),
  minAmount: Joi.number().positive().optional(),
  maxAmount: Joi.number().positive().greater(Joi.ref('minAmount')).optional(),
  maxInterestRate: Joi.number().positive().max(100).optional(),
  collateralFree: Joi.boolean().optional(),
  search: Joi.string().trim().min(2).max(100).optional()
});

export const applicationFiltersSchema = Joi.object({
  country: Joi.string().trim().optional(),
  category: Joi.string().valid(...Object.values(LoanCategory)).optional(),
  lenderType: Joi.string().valid(...Object.values(LenderType)).optional(),
  status: Joi.string().valid(...Object.values(ApplicationStatus)).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  limit: Joi.number().integer().positive().max(1000).default(50),
  offset: Joi.number().integer().min(0).default(0)
});

// Pagination schema
export const paginationSchema = Joi.object({
  limit: Joi.number().integer().positive().max(1000).default(50),
  offset: Joi.number().integer().min(0).default(0)
});

// Query parameter schemas
export const statsQuerySchema = Joi.object({
  days: Joi.number().integer().positive().max(365).default(30)
});

export const popularLoansQuerySchema = Joi.object({
  limit: Joi.number().integer().positive().max(100).default(10)
});

// Organization management schemas
export const organizationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  type: Joi.string().valid(...Object.values(OrganizationType)).required(),
  description: Joi.string().trim().min(10).max(1000).optional(),
  website: Joi.string().uri().optional(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  address: Joi.object({
    street: Joi.string().trim().optional(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    zipCode: Joi.string().trim().optional()
  }).required(),
  establishedDate: Joi.date().max('now').optional(),
  registrationNumber: Joi.string().trim().optional(),
  taxId: Joi.string().trim().optional()
});

// Export validation helper function
export const validateData = <T>(schema: Joi.ObjectSchema, data: any): { error?: string; value?: T } => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    return { error: errorMessage };
  }

  return { value };
};

// Common validation options
export const validationOptions = {
  abortEarly: false,
  stripUnknown: true,
  convert: true,
  allowUnknown: false
};