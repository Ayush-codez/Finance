/**
 * Shared environment configuration management
 * Provides consistent configuration handling across frontend and backend
 */

export enum Environment {
  DEVELOPMENT = 'development',
  TEST = 'test',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

// Base configuration interface
export interface BaseConfig {
  NODE_ENV: Environment;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'debug';
  APP_NAME: string;
  APP_VERSION: string;
}

// Database configuration
export interface DatabaseConfig {
  MONGODB_URI?: string;
  SQLITE_PATH?: string;
  DB_CONNECTION_TIMEOUT: number;
  DB_SOCKET_TIMEOUT: number;
  DB_MAX_POOL_SIZE: number;
  DB_RETRY_WRITES: boolean;
  DB_RETRY_READS: boolean;
}

// API configuration
export interface APIConfig {
  API_VERSION: string;
  API_TIMEOUT: number;
  API_MAX_RETRIES: number;
  CORS_ORIGIN: string | string[];
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

// Security configuration
export interface SecurityConfig {
  JWT_SECRET?: string;
  JWT_EXPIRY: string;
  BCRYPT_ROUNDS: number;
  SESSION_SECRET?: string;
  CSRF_SECRET?: string;
}

// External services configuration
export interface ExternalServicesConfig {
  PLAID_CLIENT_ID?: string;
  PLAID_SECRET?: string;
  PLAID_ENVIRONMENT: 'sandbox' | 'development' | 'production';
  ALPHA_VANTAGE_API_KEY?: string;
  RAPIDAPI_KEY?: string;
  SENDGRID_API_KEY?: string;
  SLACK_WEBHOOK_URL?: string;
}

// Analytics configuration
export interface AnalyticsConfig {
  ANALYTICS_ENABLED: boolean;
  GOOGLE_ANALYTICS_ID?: string;
  MIXPANEL_TOKEN?: string;
  SEGMENT_WRITE_KEY?: string;
  ANALYTICS_BATCH_SIZE: number;
  ANALYTICS_FLUSH_INTERVAL: number;
}

// Complete configuration interface
export interface Config extends 
  BaseConfig, 
  DatabaseConfig, 
  APIConfig, 
  SecurityConfig, 
  ExternalServicesConfig, 
  AnalyticsConfig {
  // Server specific (backend only)
  PORT?: number;
  HOST?: string;
  
  // Client specific (frontend only)
  REACT_APP_API_URL?: string;
  REACT_APP_ENVIRONMENT?: Environment;
  REACT_APP_VERSION?: string;
}

// Default configuration values
const DEFAULT_CONFIG: Partial<Config> = {
  NODE_ENV: Environment.DEVELOPMENT,
  LOG_LEVEL: 'info',
  APP_NAME: 'Loan Management System',
  APP_VERSION: '1.0.0',
  
  // Database defaults
  DB_CONNECTION_TIMEOUT: 5000,
  DB_SOCKET_TIMEOUT: 45000,
  DB_MAX_POOL_SIZE: 10,
  DB_RETRY_WRITES: true,
  DB_RETRY_READS: true,
  SQLITE_PATH: './database/loan_applications.db',
  
  // API defaults
  API_VERSION: 'v1',
  API_TIMEOUT: 10000,
  API_MAX_RETRIES: 3,
  CORS_ORIGIN: 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Security defaults
  JWT_EXPIRY: '24h',
  BCRYPT_ROUNDS: 12,
  
  // External services defaults
  PLAID_ENVIRONMENT: 'sandbox',
  
  // Analytics defaults
  ANALYTICS_ENABLED: true,
  ANALYTICS_BATCH_SIZE: 100,
  ANALYTICS_FLUSH_INTERVAL: 5000,
  
  // Server defaults
  PORT: 5000,
  HOST: '0.0.0.0'
};

// Configuration validation
const requiredEnvVars: Record<Environment, string[]> = {
  [Environment.DEVELOPMENT]: [],
  [Environment.TEST]: [],
  [Environment.STAGING]: [
    'MONGODB_URI',
    'JWT_SECRET'
  ],
  [Environment.PRODUCTION]: [
    'MONGODB_URI',
    'JWT_SECRET',
    'SESSION_SECRET'
  ]
};

// Environment variable parsing utilities
const parseBoolean = (value: string | undefined, defaultValue: boolean = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseStringArray = (value: string | undefined, separator: string = ','): string[] => {
  if (!value) return [];
  return value.split(separator).map(s => s.trim()).filter(s => s.length > 0);
};

// Configuration loader
export const loadConfig = (processEnv: NodeJS.ProcessEnv = process.env): Config => {
  const environment = (processEnv.NODE_ENV as Environment) || Environment.DEVELOPMENT;
  
  // Validate required environment variables
  const required = requiredEnvVars[environment] || [];
  const missing = required.filter(key => !processEnv[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  const config: Config = {
    // Base configuration
    NODE_ENV: environment,
    LOG_LEVEL: (processEnv.LOG_LEVEL as any) || DEFAULT_CONFIG.LOG_LEVEL!,
    APP_NAME: processEnv.APP_NAME || DEFAULT_CONFIG.APP_NAME!,
    APP_VERSION: processEnv.APP_VERSION || DEFAULT_CONFIG.APP_VERSION!,
    
    // Database configuration
    MONGODB_URI: processEnv.MONGODB_URI,
    SQLITE_PATH: processEnv.SQLITE_PATH || DEFAULT_CONFIG.SQLITE_PATH!,
    DB_CONNECTION_TIMEOUT: parseNumber(processEnv.DB_CONNECTION_TIMEOUT, DEFAULT_CONFIG.DB_CONNECTION_TIMEOUT!),
    DB_SOCKET_TIMEOUT: parseNumber(processEnv.DB_SOCKET_TIMEOUT, DEFAULT_CONFIG.DB_SOCKET_TIMEOUT!),
    DB_MAX_POOL_SIZE: parseNumber(processEnv.DB_MAX_POOL_SIZE, DEFAULT_CONFIG.DB_MAX_POOL_SIZE!),
    DB_RETRY_WRITES: parseBoolean(processEnv.DB_RETRY_WRITES, DEFAULT_CONFIG.DB_RETRY_WRITES!),
    DB_RETRY_READS: parseBoolean(processEnv.DB_RETRY_READS, DEFAULT_CONFIG.DB_RETRY_READS!),
    
    // API configuration
    API_VERSION: processEnv.API_VERSION || DEFAULT_CONFIG.API_VERSION!,
    API_TIMEOUT: parseNumber(processEnv.API_TIMEOUT, DEFAULT_CONFIG.API_TIMEOUT!),
    API_MAX_RETRIES: parseNumber(processEnv.API_MAX_RETRIES, DEFAULT_CONFIG.API_MAX_RETRIES!),
    CORS_ORIGIN: processEnv.CORS_ORIGIN ? parseStringArray(processEnv.CORS_ORIGIN) : DEFAULT_CONFIG.CORS_ORIGIN!,
    RATE_LIMIT_WINDOW_MS: parseNumber(processEnv.RATE_LIMIT_WINDOW_MS, DEFAULT_CONFIG.RATE_LIMIT_WINDOW_MS!),
    RATE_LIMIT_MAX_REQUESTS: parseNumber(processEnv.RATE_LIMIT_MAX_REQUESTS, DEFAULT_CONFIG.RATE_LIMIT_MAX_REQUESTS!),
    
    // Security configuration
    JWT_SECRET: processEnv.JWT_SECRET,
    JWT_EXPIRY: processEnv.JWT_EXPIRY || DEFAULT_CONFIG.JWT_EXPIRY!,
    BCRYPT_ROUNDS: parseNumber(processEnv.BCRYPT_ROUNDS, DEFAULT_CONFIG.BCRYPT_ROUNDS!),
    SESSION_SECRET: processEnv.SESSION_SECRET,
    CSRF_SECRET: processEnv.CSRF_SECRET,
    
    // External services configuration
    PLAID_CLIENT_ID: processEnv.PLAID_CLIENT_ID,
    PLAID_SECRET: processEnv.PLAID_SECRET,
    PLAID_ENVIRONMENT: (processEnv.PLAID_ENVIRONMENT as any) || DEFAULT_CONFIG.PLAID_ENVIRONMENT!,
    ALPHA_VANTAGE_API_KEY: processEnv.ALPHA_VANTAGE_API_KEY,
    RAPIDAPI_KEY: processEnv.RAPIDAPI_KEY,
    SENDGRID_API_KEY: processEnv.SENDGRID_API_KEY,
    SLACK_WEBHOOK_URL: processEnv.SLACK_WEBHOOK_URL,
    
    // Analytics configuration
    ANALYTICS_ENABLED: parseBoolean(processEnv.ANALYTICS_ENABLED, DEFAULT_CONFIG.ANALYTICS_ENABLED!),
    GOOGLE_ANALYTICS_ID: processEnv.GOOGLE_ANALYTICS_ID,
    MIXPANEL_TOKEN: processEnv.MIXPANEL_TOKEN,
    SEGMENT_WRITE_KEY: processEnv.SEGMENT_WRITE_KEY,
    ANALYTICS_BATCH_SIZE: parseNumber(processEnv.ANALYTICS_BATCH_SIZE, DEFAULT_CONFIG.ANALYTICS_BATCH_SIZE!),
    ANALYTICS_FLUSH_INTERVAL: parseNumber(processEnv.ANALYTICS_FLUSH_INTERVAL, DEFAULT_CONFIG.ANALYTICS_FLUSH_INTERVAL!),
    
    // Server configuration (backend only)
    PORT: parseNumber(processEnv.PORT, DEFAULT_CONFIG.PORT!),
    HOST: processEnv.HOST || DEFAULT_CONFIG.HOST!,
    
    // Client configuration (frontend only)
    REACT_APP_API_URL: processEnv.REACT_APP_API_URL,
    REACT_APP_ENVIRONMENT: (processEnv.REACT_APP_ENVIRONMENT as Environment),
    REACT_APP_VERSION: processEnv.REACT_APP_VERSION
  };
  
  return config;
};

// Configuration validation
export const validateConfig = (config: Config): void => {
  const errors: string[] = [];
  
  // Validate environment-specific requirements
  if (config.NODE_ENV === Environment.PRODUCTION) {
    if (!config.JWT_SECRET) {
      errors.push('JWT_SECRET is required in production');
    }
    
    if (!config.MONGODB_URI) {
      errors.push('MONGODB_URI is required in production');
    }
    
    if (config.LOG_LEVEL === 'debug') {
      errors.push('LOG_LEVEL should not be debug in production');
    }
  }
  
  // Validate numeric values
  if (config.PORT && (config.PORT < 1 || config.PORT > 65535)) {
    errors.push('PORT must be between 1 and 65535');
  }
  
  if (config.BCRYPT_ROUNDS < 8 || config.BCRYPT_ROUNDS > 15) {
    errors.push('BCRYPT_ROUNDS must be between 8 and 15');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }
};

// Configuration utilities
export const isProduction = (config: Config): boolean => {
  return config.NODE_ENV === Environment.PRODUCTION;
};

export const isDevelopment = (config: Config): boolean => {
  return config.NODE_ENV === Environment.DEVELOPMENT;
};

export const isTest = (config: Config): boolean => {
  return config.NODE_ENV === Environment.TEST;
};

export const shouldEnableFeature = (config: Config, feature: string): boolean => {
  const envVar = `ENABLE_${feature.toUpperCase()}`;
  return parseBoolean(process.env[envVar], false);
};

// Masked configuration for logging (removes sensitive data)
export const getMaskedConfig = (config: Config): Partial<Config> => {
  const sensitiveKeys = [
    'JWT_SECRET',
    'SESSION_SECRET',
    'CSRF_SECRET',
    'PLAID_SECRET',
    'ALPHA_VANTAGE_API_KEY',
    'RAPIDAPI_KEY',
    'SENDGRID_API_KEY',
    'SLACK_WEBHOOK_URL',
    'MONGODB_URI'
  ];
  
  const maskedConfig: any = { ...config };
  
  sensitiveKeys.forEach(key => {
    if (maskedConfig[key]) {
      maskedConfig[key] = '***MASKED***';
    }
  });
  
  // Mask URI credentials
  if (config.MONGODB_URI) {
    maskedConfig.MONGODB_URI = config.MONGODB_URI.replace(/\/\/.*@/, '//***:***@');
  }
  
  return maskedConfig;
};

// Export a default config instance
let _config: Config | null = null;

export const getConfig = (): Config => {
  if (!_config) {
    _config = loadConfig();
    validateConfig(_config);
  }
  return _config;
};

// Export for testing
export const resetConfig = (): void => {
  _config = null;
};