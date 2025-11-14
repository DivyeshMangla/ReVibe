import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { correctionsApi } from '@/api/corrections.api';

export function SalaryCorrectionsView() {
  const queryClient = useQueryClient();

  const { data: corrections, isLoading } = useQuery({
    queryKey: ['corrections'],
    queryFn: () => correctionsApi.getAll().then(res => res.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => correctionsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corrections'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => correctionsApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['corrections'] });
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Salary Corrections</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
          Request Correction
        </button>
      </div>

      <div className="grid gap-4">
        {corrections?.map((correction) => (
          <div key={correction.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Correction Request
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Slip ID: {correction.salarySlipId}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Reason: {correction.reason}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Requested: {new Date(correction.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 text-xs rounded ${
                  correction.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  correction.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {correction.status}
                </span>
                
                {correction.status === 'PENDING' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => approveMutation.mutate(correction.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(correction.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
