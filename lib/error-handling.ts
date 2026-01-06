/**
 * Error Handling Utilities
 * Centralized error handling with user-friendly messages
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = true,
    public userMessage?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Error codes for different error types
 */
export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  FILE_ERROR: 'FILE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  API_ERROR: 'API_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

/**
 * Convert unknown errors to AppError
 */
export function handleError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error
  }

  // Standard Error
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new AppError(
        error.message,
        ErrorCodes.NETWORK_ERROR,
        true,
        'Network connection failed. Please check your internet and try again.'
      )
    }

    // File errors
    if (error.message.includes('File') || error.message.includes('image')) {
      return new AppError(
        error.message,
        ErrorCodes.FILE_ERROR,
        true,
        'File processing failed. Please try a different image.'
      )
    }

    // Validation errors
    if (error.message.includes('invalid') || error.message.includes('validation')) {
      return new AppError(
        error.message,
        ErrorCodes.VALIDATION_ERROR,
        true,
        error.message
      )
    }

    // Auth errors
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return new AppError(
        error.message,
        ErrorCodes.AUTH_ERROR,
        true,
        'Authentication failed. Please sign in again.'
      )
    }

    // Generic error
    return new AppError(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      true,
      'An error occurred. Please try again.'
    )
  }

  // Unknown error type
  return new AppError(
    'An unexpected error occurred',
    ErrorCodes.UNKNOWN_ERROR,
    true,
    'An unexpected error occurred. Please try again.'
  )
}

/**
 * Log error with context
 */
export function logError(error: AppError | Error, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    name: error.name,
    ...(error instanceof AppError && {
      code: error.code,
      recoverable: error.recoverable,
      userMessage: error.userMessage,
    }),
    context,
    timestamp: new Date().toISOString(),
  }

  console.error('[AppError]', errorInfo)

  // In production, you might want to send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: unknown): string {
  const appError = handleError(error)
  return appError.userMessage || appError.message
}
