/**
 * Shared constants for the Loan Management System
 * These constants are used across both frontend and backend
 */

// API Configuration
export const API_CONFIG = {
  VERSION: 'v1',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
} as const;

// Database Configuration
export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 5000,
  SOCKET_TIMEOUT: 45000,
  MAX_POOL_SIZE: 10,
  MAX_IDLE_TIME: 30000,
  RETRY_WRITES: true,
  RETRY_READS: true
} as const;

// Pagination Configuration
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 1000,
  DEFAULT_OFFSET: 0
} as const;

// Application Status Flow
export const STATUS_FLOW = {
  INITIAL: 'clicked',
  TRANSITIONS: {
    clicked: ['redirected', 'abandoned'],
    redirected: ['completed', 'abandoned'],
    completed: [],
    abandoned: []
  }
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  AGE: {
    MIN: 16,
    MAX: 100
  },
  CREDIT_SCORE: {
    MIN: 300,
    MAX: 850
  },
  BUSINESS_AGE: {
    MIN: 0, // months
    MAX: 1200 // 100 years
  },
  LOAN_AMOUNT: {
    MIN: 1000,
    MAX: 1000000000 // 100 crores
  },
  INTEREST_RATE: {
    MIN: 0,
    MAX: 50
  },
  STRING_LENGTHS: {
    NAME: { MIN: 2, MAX: 200 },
    DESCRIPTION: { MIN: 10, MAX: 1000 },
    SEARCH: { MIN: 2, MAX: 100 },
    URL: { MIN: 10, MAX: 500 }
  }
} as const;

// Countries and Regions
export const COUNTRIES = [
  { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
  { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'DE', name: 'Germany', currency: 'EUR', symbol: '€' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'CN', name: 'China', currency: 'CNY', symbol: '¥' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', symbol: 'R$' }
] as const;

// Business Sectors
export const BUSINESS_SECTORS = [
  'agriculture',
  'automotive',
  'biotechnology',
  'construction',
  'consulting',
  'e-commerce',
  'education',
  'energy',
  'entertainment',
  'fashion',
  'fintech',
  'food-beverage',
  'healthcare',
  'hospitality',
  'manufacturing',
  'media',
  'real-estate',
  'retail',
  'services',
  'social',
  'technology',
  'telecommunications',
  'transportation',
  'travel',
  'other'
] as const;

// File and Upload Constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  MAX_FILES: 10
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  BATCH_SIZE: 100,
  FLUSH_INTERVAL: 5000, // 5 seconds
  MAX_EVENTS_PER_SESSION: 1000,
  RETENTION_DAYS: 365
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 3600, // 1 hour
  LONG_TTL: 86400, // 24 hours
  SHORT_TTL: 300, // 5 minutes
  KEYS: {
    LOANS: 'loans',
    POPULAR_LOANS: 'popular_loans',
    STATS: 'stats',
    COUNTRIES: 'countries',
    LENDERS: 'lenders'
  }
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  SERVER_ERROR: 'SERVER_ERROR'
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  MONTH_YEAR: 'MM/YYYY'
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  POSTAL_CODE: /^[0-9]{5,6}$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/
} as const;

// Default Values
export const DEFAULTS = {
  CURRENCY: {
    INDIA: '₹',
    US: '$',
    UK: '£',
    EURO: '€'
  },
  LANGUAGE: 'en',
  TIMEZONE: 'UTC',
  PAGE_SIZE: 20,
  DEBOUNCE_DELAY: 300,
  SEARCH_MIN_LENGTH: 2,
  PASSWORD_MIN_LENGTH: 8
} as const;

// Feature Flags
export const FEATURES = {
  ANALYTICS_ENABLED: true,
  FILE_UPLOAD_ENABLED: true,
  NOTIFICATIONS_ENABLED: true,
  ADVANCED_SEARCH: true,
  LOAN_COMPARISON: true,
  ELIGIBILITY_CHECKER: true,
  EXPORT_FUNCTIONALITY: true,
  REAL_TIME_UPDATES: false,
  DARK_MODE: false,
  MULTI_LANGUAGE: false
} as const;

// Third Party API Configuration
export const THIRD_PARTY_APIS = {
  PLAID: {
    ENVIRONMENT: 'sandbox', // sandbox, development, production
    VERSION: '2020-09-14'
  },
  ALPHA_VANTAGE: {
    BASE_URL: 'https://www.alphavantage.co/query',
    RATE_LIMIT: 5 // requests per minute
  },
  RAPID_API: {
    BASE_URL: 'https://rapidapi.com',
    TIMEOUT: 10000
  }
} as const;

// Loan Data Sources
export const DATA_SOURCES = {
  MANUAL: 'manual',
  API_INTEGRATION: 'api_integration',
  WEB_SCRAPING: 'web_scraping',
  PARTNER_FEED: 'partner_feed',
  GOVERNMENT_DATA: 'government_data'
} as const;