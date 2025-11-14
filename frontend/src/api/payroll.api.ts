import { apiClient } from './client';

export interface PayrollRun {
  id: string;
  month: number;
  year: number;
  status: 'DRAFT' | 'APPROVED' | 'FINALIZED';
  createdAt: string;
}

export interface SalarySlip {
  id: string;
  employeeId: string;
  basicSalary: number;
  hra: number;
  da: number;
  otherEarnings: number;
  pf: number;
  esi: number;
  tds: number;
  otherDeductions: number;
  grossSalary: number;
  netPay: number;
  version: number;
}

export const payrollApi = {
  getRuns: () => apiClient.get<PayrollRun[]>('/payroll/runs'),
  
  getRun: (id: string) => apiClient.get(`/payroll/runs/${id}`),
  
  createRun: (data: { month: number; year: number }) => 
    apiClient.post('/payroll/runs', data),
  
  approveRun: (id: string) => 
    apiClient.patch(`/payroll/runs/${id}/approve`),
  
  finalizeRun: (id: string) => 
    apiClient.patch(`/payroll/runs/${id}/finalize`),
  
  getSlip: (id: string) => 
    apiClient.get<SalarySlip>(`/payroll/slips/${id}`),
  
  generatePdf: (id: string) => 
    apiClient.get(`/payroll/slips/${id}/pdf`),
  
  calculateSalary: (data: { 
    basicSalary: number; 
    otherEarnings?: number; 
    otherDeductions?: number; 
  }) => apiClient.post('/payroll/calculate', data),
};
