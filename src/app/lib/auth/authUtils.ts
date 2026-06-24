/**
 * Authentication Utilities
 * Centralized authentication helper functions and constants
 */

export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  TOKEN_VALIDATION_INTERVAL: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

/**
 * Email validation regex
 * Validates standard email format
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password strength requirements
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 6,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: false, // Can be enabled for higher security
} as const;

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and list of errors
 */
export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 100;

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
    score -= 30;
  }

  // Check for uppercase
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
    score -= 20;
  }

  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
    score -= 20;
  }

  // Check for special characters (optional but recommended)
  if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password should contain special characters for better security');
    score -= 10;
  }

  return {
    isStrong: errors.length === 0,
    errors,
    score: Math.max(0, score),
  };
}

/**
 * Get stored authentication token
 * @returns Token string or null if not found
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
  } catch (error) {
    console.error('Error reading token from storage:', error);
    return null;
  }
}

/**
 * Get stored user data
 * @returns Parsed user object or null if not found
 */
export function getStoredUser(): any {
  try {
    const userString = localStorage.getItem(AUTH_CONSTANTS.USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error reading user data from storage:', error);
    return null;
  }
}

/**
 * Store authentication token
 * @param token - Token to store
 */
export function storeToken(token: string): void {
  try {
    localStorage.setItem(AUTH_CONSTANTS.TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

/**
 * Store user data
 * @param user - User object to store
 */
export function storeUser(user: any): void {
  try {
    localStorage.setItem(AUTH_CONSTANTS.USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
}

/**
 * Clear stored authentication data
 */
export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(AUTH_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONSTANTS.USER_KEY);
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
}

/**
 * Format authentication error messages
 * @param error - Error message from server
 * @returns Formatted error message for user display
 */
export function formatAuthError(error: string): string {
  const errorMap: Record<string, string> = {
    'Email not found': 'No account found with this email address',
    'Incorrect password': 'Incorrect password. Please try again',
    'Account is deactivated': 'This account has been deactivated',
    'User with this email already exists': 'An account with this email already exists',
    'Current password is incorrect': 'The current password you entered is incorrect',
  };

  return errorMap[error] || error || 'An error occurred. Please try again.';
}

/**
 * Check if token is likely expired based on stored timestamp
 * Note: This is a client-side check only. Always validate with server.
 * @returns True if token appears to be expired
 */
export function isTokenLikelyExpired(): boolean {
  try {
    const token = getStoredToken();
    if (!token) return false;

    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    
    // Check if token expires within the next 5 minutes
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return expirationTime < fiveMinutesFromNow;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if we can't verify
  }
}

/**
 * Create Bearer token header for API requests
 * @param token - Authentication token
 * @returns Authorization header value
 */
export function createAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Build headers for authenticated API requests
 * @param additionalHeaders - Any additional headers to include
 * @returns Complete headers object with authorization
 */
export function buildAuthHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  if (token) {
    headers['Authorization'] = createAuthHeader(token);
  }

  return headers;
}
