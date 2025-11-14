import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function JoiningRelievingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['joining-relieving'],
    queryFn: () => apiClient.get('/joining-relieving').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Joining & Relieving</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clearance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm">{item.employee?.name}</td>
                <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded ${item.type === 'JOINING' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.type}</span></td>
                <td className="px-6 py-4 text-sm">{new Date(item.effectiveDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">{item.clearanceStatus}</td>
                <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
