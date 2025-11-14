import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { employeesApi } from '@/api/employees.api';

export function EmployeeProfileView() {
  const { id } = useParams<{ id: string }>();

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getOne(id!).then(res => res.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Employee Code</p>
            <p className="font-medium">{employee.empCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hire Date</p>
            <p className="font-medium">
              {new Date(employee.hireDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium">{employee.status}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Job Profile History</h2>
        <p className="text-gray-600">Job profile history will be displayed here.</p>
      </div>
    </div>
  );
}
