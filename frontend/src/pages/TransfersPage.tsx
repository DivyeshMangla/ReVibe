import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function TransfersPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fromDepartment: '',
    toDepartment: '',
    fromLocation: '',
    toLocation: '',
    reason: '',
    effectiveDate: ''
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['transfers'],
    queryFn: () => apiClient.get('/transfers').then(res => res.data),
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.get('/employees').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/transfers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      setShowForm(false);
      alert('Transfer request submitted!');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/transfers/${id}/approve`, { approverId: 'manager' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      alert('Transfer approved!');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/transfers/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      alert('Transfer rejected!');
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transfer Requests</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Request Transfer'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Request Transfer</h2>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select 
                className="w-full border rounded px-3 py-2"
                value={formData.employeeId}
                onChange={(e) => {
                  const emp = employees?.find((e: any) => e.id === e.target.value);
                  setFormData({...formData, employeeId: e.target.value, fromDepartment: emp?.department || ''});
                }}
                required
              >
                <option value="">Select Employee</option>
                {employees?.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.department}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From Department</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.fromDepartment}
                  onChange={(e) => setFormData({...formData, fromDepartment: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To Department</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.toDepartment}
                  onChange={(e) => setFormData({...formData, toDepartment: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From Location</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.fromLocation}
                  onChange={(e) => setFormData({...formData, fromLocation: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To Location</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.toLocation}
                  onChange={(e) => setFormData({...formData, toLocation: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea 
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Effective Date</label>
              <input 
                type="date" 
                className="w-full border rounded px-3 py-2"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit Transfer Request
            </button>
          </form>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm">{item.employee?.name}</td>
                <td className="px-6 py-4 text-sm">{item.fromDepartment} - {item.fromLocation}</td>
                <td className="px-6 py-4 text-sm">{item.toDepartment} - {item.toLocation}</td>
                <td className="px-6 py-4 text-sm">{new Date(item.effectiveDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{item.status}</span></td>
                <td className="px-6 py-4 text-sm">
                  {item.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveMutation.mutate(item.id)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(item.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
