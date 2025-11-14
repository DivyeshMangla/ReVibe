import { apiClient } from './client';

export interface Promotion {
  id: string;
  employeeId: string;
  currentRole: string;
  proposedRole: string;
  currentSalary: number;
  proposedSalary: number;
  salaryIncrease: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EFFECTIVE';
  effectiveDate: string;
}

export const promotionsApi = {
  getAll: () => apiClient.get<Promotion[]>('/promotions'),
  
  getOne: (id: string) => apiClient.get(`/promotions/${id}`),
  
  create: (data: Omit<Promotion, 'id' | 'status' | 'salaryIncrease'>) => 
    apiClient.post('/promotions', data),
  
  approve: (id: string) => apiClient.patch(`/promotions/${id}/approve`),
  
  reject: (id: string) => apiClient.patch(`/promotions/${id}/reject`),
  
  markEffective: (id: string) => 
    apiClient.patch(`/promotions/${id}/mark-effective`),
};
