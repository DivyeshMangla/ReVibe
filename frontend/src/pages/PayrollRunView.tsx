import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { payrollApi } from '@/api/payroll.api';

export function PayrollRunView() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: run, isLoading } = useQuery({
    queryKey: ['payroll-run', id],
    queryFn: () => payrollApi.getRun(id!).then(res => res.data),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => payrollApi.approveRun(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-run', id] });
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: () => payrollApi.finalizeRun(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-run', id] });
    },
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!run) return <div>Run not found</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Payroll Run - {run.month}/{run.year}
        </h1>
        <p className="text-gray-600 mt-2">Status: {run.status}</p>
      </div>

      <div className="flex gap-4 mb-6">
        {run.status === 'DRAFT' && (
          <button
            onClick={() => approveMutation.mutate()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Approve Run
          </button>
        )}
        {run.status === 'APPROVED' && (
          <button
            onClick={() => finalizeMutation.mutate()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Finalize Run
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Basic Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Gross
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Deductions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Net Pay
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {run.salarySlips?.map((slip: any) => (
              <tr key={slip.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {slip.employee.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{slip.basicSalary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{slip.grossSalary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{(slip.pf + slip.esi + slip.tds + slip.otherDeductions).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">
                  ₹{slip.netPay.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
