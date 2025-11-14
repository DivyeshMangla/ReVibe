import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function EvaluationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    evaluationType: 'Quarterly',
    period: 'Q4 2025',
    overallScore: 3,
    technicalScore: 3,
    softSkillScore: 3,
    punctuality: 3,
    teamwork: 3,
    comments: '',
    evaluatedBy: ''
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['evaluations'],
    queryFn: () => apiClient.get('/evaluations').then(res => res.data),
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.get('/employees').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/evaluations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      setShowForm(false);
      alert('Evaluation created successfully!');
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/evaluations/${id}/submit`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      alert('Evaluation submitted!');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/evaluations/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      alert('Evaluation approved!');
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Performance Evaluations</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Create Evaluation'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Performance Evaluation</h2>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium mb-1">Evaluation Type</label>
                <select 
                  className="w-full border rounded px-3 py-2"
                  value={formData.evaluationType}
                  onChange={(e) => setFormData({...formData, evaluationType: e.target.value})}
                >
                  <option>Quarterly</option>
                  <option>Annual</option>
                  <option>Probation</option>
                  <option>Project-based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Overall (1-5)</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="5"
                  className="w-full border rounded px-3 py-2"
                  value={formData.overallScore}
                  onChange={(e) => setFormData({...formData, overallScore: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Technical</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="5"
                  className="w-full border rounded px-3 py-2"
                  value={formData.technicalScore}
                  onChange={(e) => setFormData({...formData, technicalScore: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Soft Skills</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="5"
                  className="w-full border rounded px-3 py-2"
                  value={formData.softSkillScore}
                  onChange={(e) => setFormData({...formData, softSkillScore: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Punctuality</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="5"
                  className="w-full border rounded px-3 py-2"
                  value={formData.punctuality}
                  onChange={(e) => setFormData({...formData, punctuality: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teamwork</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="1"
                  max="5"
                  className="w-full border rounded px-3 py-2"
                  value={formData.teamwork}
                  onChange={(e) => setFormData({...formData, teamwork: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <textarea 
                className="w-full border rounded px-3 py-2"
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Evaluated By</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2"
                value={formData.evaluatedBy}
                onChange={(e) => setFormData({...formData, evaluatedBy: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Create Evaluation
            </button>
          </form>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overall Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm">{item.employee?.name}</td>
                <td className="px-6 py-4 text-sm">{item.evaluationType}</td>
                <td className="px-6 py-4 text-sm">{item.period}</td>
                <td className="px-6 py-4 text-sm font-semibold">{item.overallScore}/5.0</td>
                <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span></td>
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
