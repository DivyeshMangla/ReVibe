import { apiClient } from './client';

export interface Correction {
  id: string;
  salarySlipId: string;
  requestedBy: string;
  reason: string;
  changes: Record<string, any>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const correctionsApi = {
  getAll: () => apiClient.get<Correction[]>('/corrections'),
  
  getOne: (id: string) => apiClient.get(`/corrections/${id}`),
  
  create: (data: { 
    salarySlipId: string; 
    reason: string; 
    changes: Record<string, any>; 
  }) => apiClient.post('/corrections', data),
  
  approve: (id: string) => apiClient.patch(`/corrections/${id}/approve`),
  
  reject: (id: string) => apiClient.patch(`/corrections/${id}/reject`),
};
