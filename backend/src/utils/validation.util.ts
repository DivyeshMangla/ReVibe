export class ValidationUtil {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidEmployeeCode(empCode: string): boolean {
    return /^[A-Z0-9]{4,10}$/.test(empCode);
  }

  static isPositiveNumber(value: number): boolean {
    return typeof value === 'number' && value > 0;
  }

  static isValidPercentage(value: number): boolean {
    return typeof value === 'number' && value >= 0 && value <= 100;
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
  }

  static isValidPhoneNumber(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  }

  static validateSalaryComponents(components: Record<string, number>): boolean {
    for (const key in components) {
      if (!this.isPositiveNumber(components[key]) && components[key] !== 0) {
        return false;
      }
    }
    return true;
  }
}
