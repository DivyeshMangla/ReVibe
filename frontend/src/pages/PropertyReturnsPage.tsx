import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function PropertyReturnsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['property-returns'],
    queryFn: () => apiClient.get('/property-returns').then(res => res.data),
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Property Returns</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((item: any) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm">{item.employee?.name}</td>
                <td className="px-6 py-4 text-sm font-medium">{item.itemName}</td>
                <td className="px-6 py-4 text-sm">{item.itemCategory}</td>
                <td className="px-6 py-4 text-sm">{item.serialNumber || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">{new Date(item.issuedDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded ${item.status === 'RETURNED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
