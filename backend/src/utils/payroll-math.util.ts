export class PayrollMath {
  static calculateHRA(basicSalary: number): number {
    return basicSalary * 0.4;
  }

  static calculateDA(basicSalary: number): number {
    return basicSalary * 0.12;
  }

  static calculatePF(basicSalary: number): number {
    const pfCeiling = 15000;
    const pfRate = 0.12;
    const applicableBasic = Math.min(basicSalary, pfCeiling);
    return applicableBasic * pfRate;
  }

  static calculateESI(grossSalary: number): number {
    const esiCeiling = 21000;
    const esiRate = 0.0075;
    
    if (grossSalary > esiCeiling) {
      return 0;
    }
    
    return grossSalary * esiRate;
  }

  static calculateTDS(grossSalary: number, otherDeductions: number): number {
    const annualGross = grossSalary * 12;
    const standardDeduction = 50000;
    const taxableIncome = annualGross - standardDeduction - (otherDeductions * 12);

    if (taxableIncome <= 0) {
      return 0;
    }

    let tax = 0;
    
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
    }

    return Math.round(tax / 12);
  }

  static calculateGrossSalary(
    basicSalary: number,
    hra: number,
    da: number,
    otherEarnings: number
  ): number {
    return basicSalary + hra + da + otherEarnings;
  }

  static calculateNetPay(
    grossSalary: number,
    pf: number,
    esi: number,
    tds: number,
    otherDeductions: number
  ): number {
    return grossSalary - pf - esi - tds - otherDeductions;
  }

  static calculateSalaryComponents(basicSalary: number, otherEarnings: number = 0, otherDeductions: number = 0) {
    const hra = this.calculateHRA(basicSalary);
    const da = this.calculateDA(basicSalary);
    const grossSalary = this.calculateGrossSalary(basicSalary, hra, da, otherEarnings);
    
    const pf = this.calculatePF(basicSalary);
    const esi = this.calculateESI(grossSalary);
    const tds = this.calculateTDS(grossSalary, pf + esi + otherDeductions);
    
    const netPay = this.calculateNetPay(grossSalary, pf, esi, tds, otherDeductions);

    return {
      basicSalary,
      hra: Math.round(hra),
      da: Math.round(da),
      otherEarnings,
      grossSalary: Math.round(grossSalary),
      pf: Math.round(pf),
      esi: Math.round(esi),
      tds: Math.round(tds),
      otherDeductions,
      netPay: Math.round(netPay)
    };
  }

  static roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
