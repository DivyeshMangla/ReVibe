import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function TrainingsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    trainingName: '',
    trainingType: 'Technical',
    startDate: '',
    endDate: '',
    duration: 1,
    trainer: ''
  });

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['trainings'],
    queryFn: () => apiClient.get('/trainings').then(res => res.data),
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.get('/employees').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/trainings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      setShowForm(false);
      alert('Training scheduled successfully!');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (data: { id: string; completionDate: string; score: number; feedback: string }) => 
      apiClient.patch(`/trainings/${data.id}/complete`, { completionDate: data.completionDate, score: data.score, feedback: data.feedback }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainings'] });
      alert('Training marked as completed!');
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Training Programs</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Schedule Training'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Schedule Training</h2>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Training Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.trainingName}
                  onChange={(e) => setFormData({...formData, trainingName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select 
                  className="w-full border rounded px-3 py-2"
                  value={formData.trainingType}
                  onChange={(e) => setFormData({...formData, trainingType: e.target.value})}
                >
                  <option>Technical</option>
                  <option>Soft Skills</option>
                  <option>Leadership</option>
                  <option>Compliance</option>
                  <option>Safety</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input 
                  type="date" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (days)</label>
                <input 
                  type="number" 
                  className="w-full border rounded px-3 py-2"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trainer Name</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2"
                value={formData.trainer}
                onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Schedule Training
            </button>
          </form>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Training Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm font-medium">{item.trainingName}</td>
                <td className="px-6 py-4 text-sm">{item.employee?.name}</td>
                <td className="px-6 py-4 text-sm">{item.trainingType}</td>
                <td className="px-6 py-4 text-sm">{item.duration} days</td>
                <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{item.status}</span></td>
                <td className="px-6 py-4 text-sm">
                  {(item.status === 'SCHEDULED' || item.status === 'ONGOING') && (
                    <button
                      onClick={() => {
                        const score = prompt('Enter score (0-100):');
                        const feedback = prompt('Enter feedback:');
                        if (score && feedback) {
                          completeMutation.mutate({
                            id: item.id,
                            completionDate: new Date().toISOString(),
                            score: parseFloat(score),
                            feedback
                          });
                        }
                      }}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Mark Complete
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
