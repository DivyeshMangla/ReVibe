import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function EServiceBookPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['eservice-book'],
    queryFn: () => apiClient.get('/eservice-book').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">eService Book</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm">{item.employee?.name}</td>
                <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">{item.entryType}</span></td>
                <td className="px-6 py-4 text-sm">{new Date(item.entryDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{item.description}</td>
                <td className="px-6 py-4 text-sm">{item.verifiedBy ? '✓ Yes' : '✗ No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
