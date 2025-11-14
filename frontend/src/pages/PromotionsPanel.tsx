import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { promotionsApi } from '@/api/promotions.api';

export function PromotionsPanel() {
  const queryClient = useQueryClient();

  const { data: promotions, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApi.getAll().then(res => res.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => promotionsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => promotionsApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
          Create Promotion
        </button>
      </div>

      <div className="grid gap-4">
        {promotions?.map((promotion) => (
          <div key={promotion.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {promotion.currentRole} → {promotion.proposedRole}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Salary Increase: ₹{promotion.salaryIncrease.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Effective Date: {new Date(promotion.effectiveDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-2">{promotion.reason}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 text-xs rounded ${
                  promotion.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  promotion.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  promotion.status === 'EFFECTIVE' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {promotion.status}
                </span>
                
                {promotion.status === 'PENDING' && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => approveMutation.mutate(promotion.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(promotion.id)}
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
