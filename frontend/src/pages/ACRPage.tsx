import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function ACRPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['acrs'],
    queryFn: () => apiClient.get('/acrs').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Annual Confidential Reports (ACR)</h1>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
