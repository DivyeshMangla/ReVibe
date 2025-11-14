import { apiClient } from './client';

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  email: string;
  department: string;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
}

export const employeesApi = {
  getAll: () => apiClient.get<Employee[]>('/employees'),
  
  getOne: (id: string) => apiClient.get(`/employees/${id}`),
  
  create: (data: Omit<Employee, 'id' | 'status'>) => 
    apiClient.post('/employees', data),
  
  update: (id: string, data: Partial<Employee>) => 
    apiClient.patch(`/employees/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/employees/${id}`),
};
