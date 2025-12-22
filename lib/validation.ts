/**
 * Validation utilities
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one letter (a-z or A-Z)
 * - At least one number (0-9)
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất một chữ cái');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất một chữ số');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get a single error message from password validation
 */
export function getPasswordError(password: string): string | undefined {
  const result = validatePassword(password);
  return result.errors[0];
}

/**
 * Check if password meets all requirements
 */
export function isPasswordValid(password: string): boolean {
  return validatePassword(password).isValid;
}

