import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function ACRPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    year: new Date().getFullYear(),
    reviewPeriod: `Jan-Dec ${new Date().getFullYear()}`,
    overallRating: 3,
    strengths: '',
    improvements: '',
    goals: '',
    reviewerName: '',
    reviewerEmail: ''
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['acrs'],
    queryFn: () => apiClient.get('/acrs').then(res => res.data),
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.get('/employees').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/acrs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acrs'] });
      setShowForm(false);
      alert('ACR created successfully!');
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/acrs/${id}/submit`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acrs'] });
      alert('ACR submitted for approval!');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/acrs/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acrs'] });
      alert('ACR approved!');
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Annual Confidential Reports (ACR)</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Create ACR'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Annual Confidential Report</h2>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <select 
                  className="w-full border rounded px-3 py-2"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees?.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input 
                  type="number" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Review Period</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2"
                value={formData.reviewPeriod}
                onChange={(e) => setFormData({...formData, reviewPeriod: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overall Rating (1-5)</label>
              <input 
                type="number" 
                step="0.1"
                min="1"
                max="5"
                className="w-full border rounded px-3 py-2"
                value={formData.overallRating}
                onChange={(e) => setFormData({...formData, overallRating: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Strengths</label>
              <textarea 
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={formData.strengths}
                onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Areas for Improvement</label>
              <textarea 
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={formData.improvements}
                onChange={(e) => setFormData({...formData, improvements: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Goals for Next Year</label>
              <textarea 
                className="w-full border rounded px-3 py-2"
                rows={3}
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reviewer Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData({...formData, reviewerName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reviewer Email</label>
                <input 
                  type="email" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.reviewerEmail}
                  onChange={(e) => setFormData({...formData, reviewerEmail: e.target.value})}
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Create ACR
            </button>
          </form>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overall Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviewer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm">{item.employee?.name}</td>
                <td className="px-6 py-4 text-sm">{item.year}</td>
                <td className="px-6 py-4 text-sm">{item.reviewPeriod}</td>
                <td className="px-6 py-4 text-sm font-semibold">{item.overallRating}/5.0</td>
                <td className="px-6 py-4 text-sm">{item.reviewerName}</td>
                <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{item.status}</span></td>
                <td className="px-6 py-4 text-sm">
                  {item.status === 'DRAFT' && (
                    <button
                      onClick={() => submitMutation.mutate(item.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  )}
                  {item.status === 'SUBMITTED' && (
                    <button
                      onClick={() => approveMutation.mutate(item.id)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
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
