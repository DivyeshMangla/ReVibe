export class DateUtil {
  static getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Invalid Month';
  }

  static isValidMonthYear(month: number, year: number): boolean {
    return month >= 1 && month <= 12 && year >= 2000 && year <= 2100;
  }

  static getFirstDayOfMonth(month: number, year: number): Date {
    return new Date(year, month - 1, 1);
  }

  static getLastDayOfMonth(month: number, year: number): Date {
    return new Date(year, month, 0);
  }

  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static isEffectiveDate(effectiveDate: Date, referenceDate: Date = new Date()): boolean {
    return effectiveDate <= referenceDate;
  }
}
