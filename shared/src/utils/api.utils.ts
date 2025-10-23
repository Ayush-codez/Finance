import { APIResponse, LoanApplication, AnalyticsEvent } from '../types/loan.types';
import { HTTP_STATUS, ERROR_CODES } from '../constants/index';

/**
 * Shared API utilities for consistent request/response handling
 * These utilities are used across both frontend and backend
 */

// Success response builder
export const createSuccessResponse = <T>(
  data?: T,
  message?: string,
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }
): APIResponse<T> => {
  const response: APIResponse<T> = {
    success: true
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return response;
};

// Error response builder
export const createErrorResponse = (
  error: string,
  message?: string,
  errorCode?: keyof typeof ERROR_CODES
): APIResponse => {
  return {
    success: false,
    error: errorCode || ERROR_CODES.SERVER_ERROR,
    message: message || error
  };
};

// HTTP error handler
export class APIError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: string = ERROR_CODES.SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
export class ValidationError extends APIError {
  public validationErrors: Array<{ field: string; message: string }>;

  constructor(message: string, validationErrors: Array<{ field: string; message: string }> = []) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    this.validationErrors = validationErrors;
  }
}

// Not found error class
export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

// Rate limit error class
export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, ERROR_CODES.RATE_LIMIT_EXCEEDED);
  }
}

// Request validation utility
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): Array<{ field: string; message: string }> => {
  const errors: Array<{ field: string; message: string }> = [];

  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push({
        field,
        message: `${field} is required`
      });
    }
  });

  return errors;
};

// Sanitize user input
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, ''); // Basic XSS prevention
  }
  
  if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
    const sanitized: Record<string, any> = {};
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeInput(input[key]);
    });
    return sanitized;
  }
  
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }
  
  return input;
};

// Pagination utilities
export const calculatePagination = (
  total: number,
  limit: number,
  offset: number
): {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  totalPages: number;
  currentPage: number;
} => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const hasMore = offset + limit < total;

  return {
    total,
    limit,
    offset,
    hasMore,
    totalPages,
    currentPage
  };
};

// Request logging utility
export const logRequest = (
  method: string,
  url: string,
  userIp?: string,
  userAgent?: string,
  responseTime?: number,
  statusCode?: number
): void => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    method,
    url,
    userIp,
    userAgent,
    responseTime: responseTime ? `${responseTime}ms` : undefined,
    statusCode
  };

  console.log(JSON.stringify(logData, null, 2));
};

// Session ID generator
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${randomStr}`;
};

// Device info parser
export const parseUserAgent = (userAgent: string): {
  browser?: string;
  os?: string;
  device?: string;
  type: 'mobile' | 'tablet' | 'desktop';
} => {
  const ua = userAgent.toLowerCase();
  
  // Simple browser detection
  let browser = 'unknown';
  if (ua.includes('chrome')) browser = 'chrome';
  else if (ua.includes('firefox')) browser = 'firefox';
  else if (ua.includes('safari')) browser = 'safari';
  else if (ua.includes('edge')) browser = 'edge';

  // Simple OS detection
  let os = 'unknown';
  if (ua.includes('windows')) os = 'windows';
  else if (ua.includes('mac')) os = 'macos';
  else if (ua.includes('linux')) os = 'linux';
  else if (ua.includes('android')) os = 'android';
  else if (ua.includes('ios')) os = 'ios';

  // Simple device type detection
  let type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (ua.includes('mobile')) type = 'mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) type = 'tablet';

  return { browser, os, type };
};

// URL utilities
export const buildApiUrl = (
  baseUrl: string,
  endpoint: string,
  queryParams?: Record<string, string | number | boolean>
): string => {
  const url = new URL(endpoint, baseUrl);
  
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

// Retry utility with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Data transformation utilities
export const transformLoanApplicationForDB = (
  data: any,
  userIp?: string,
  userAgent?: string,
  sessionId?: string
): Partial<LoanApplication> => {
  return {
    loanId: data.loanId,
    loanName: data.loanName,
    lender: data.lender,
    country: data.country,
    category: data.category,
    lenderType: data.lenderType?.toLowerCase(),
    applicationUrl: data.applicationUrl,
    userIp,
    userAgent,
    sessionId,
    referrer: data.referrer,
    loanAmount: data.loanAmount ? {
      requested: data.loanAmount.requested,
      min: data.loanAmount.min,
      max: data.loanAmount.max
    } : undefined,
    interestRate: data.interestRate,
    status: 'clicked' as const,
    clickedAt: new Date()
  };
};

export const transformAnalyticsEvent = (
  data: any,
  userIp?: string,
  userAgent?: string
): Partial<AnalyticsEvent> => {
  const deviceInfo = userAgent ? parseUserAgent(userAgent) : undefined;
  
  return {
    sessionId: data.sessionId,
    action: data.action,
    page: data.page,
    data: data.data || {},
    userIp,
    userAgent,
    referrer: data.referrer,
    utm: data.utm,
    deviceInfo,
    createdAt: new Date()
  };
};

// Response caching utility
export const generateCacheKey = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const baseKey = endpoint.replace(/[^a-zA-Z0-9]/g, '_');
  
  if (!params) {
    return baseKey;
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
    
  return `${baseKey}_${Buffer.from(sortedParams).toString('base64')}`;
};

// Input filtering for security
export const filterSensitiveData = (data: Record<string, any>): Record<string, any> => {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'ssn', 'pan', 'aadhaar'];
  const filtered: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveFields.some(field => lowerKey.includes(field));
    
    if (isSensitive) {
      filtered[key] = '***REDACTED***';
    } else {
      filtered[key] = data[key];
    }
  });
  
  return filtered;
};

// Rate limiting utilities
export const isRateLimited = (
  requests: Array<{ timestamp: number }>,
  windowMs: number,
  maxRequests: number
): boolean => {
  const now = Date.now();
  const cutoff = now - windowMs;
  
  // Remove old requests
  const recentRequests = requests.filter(req => req.timestamp > cutoff);
  
  return recentRequests.length >= maxRequests;
};

// Health check utilities
export const createHealthCheck = (serviceName: string) => {
  const startTime = Date.now();
  
  return {
    service: serviceName,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    startTime: new Date(startTime).toISOString()
  };
};