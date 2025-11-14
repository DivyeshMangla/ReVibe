import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiClient.get('/employees').then(res => res.data),
  });

  const { data: leaves } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => apiClient.get('/leaves').then(res => res.data),
  });

  const stats = [
    {
      name: 'Total Employees',
      value: employees?.length || 0,
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      name: 'Pending Leaves',
      value: leaves?.filter((l: any) => l.status === 'PENDING').length || 0,
      icon: Calendar,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      name: 'Active Payroll',
      value: '1',
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      name: 'This Month',
      value: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      icon: TrendingUp,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Overview of your HR management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Recent Employees</h2>
          </CardHeader>
          <CardContent>
            {employees?.slice(0, 5).map((emp: any) => (
              <div key={emp.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.department}</p>
                </div>
                <span className="text-xs text-gray-500">{emp.empCode}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          </CardHeader>
          <CardContent>
            {leaves?.filter((l: any) => l.status === 'PENDING').slice(0, 5).map((leave: any) => (
              <div key={leave.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{leave.leaveType}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium text-warning-700 bg-warning-50 rounded-full">
                  Pending
                </span>
              </div>
            )) || (
              <p className="text-sm text-gray-500 py-4 text-center">No pending approvals</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
