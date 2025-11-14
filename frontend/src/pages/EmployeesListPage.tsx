import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { employeesApi, Employee } from '@/api/employees.api';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Plus, Eye, Edit, Search } from 'lucide-react';

export function EmployeesListPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    empCode: '',
    name: '',
    email: '',
    department: '',
    hireDate: '',
  });

  const queryClient = useQueryClient();

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesApi.getAll().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => employeesApi.create(data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowAddModal(false);
      setFormData({ empCode: '', name: '', email: '', department: '', hireDate: '' });
      
      const password = response.data.defaultPassword || 'Welcome@123';
      alert(`Employee added successfully!\n\nLogin Credentials:\nEmail: ${response.data.email}\nPassword: ${password}\n\nPlease share these credentials with the employee.`);
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || 'Failed to add employee'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => 
      employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setShowEditModal(false);
      setEditingEmployee(null);
      alert('Employee updated successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || 'Failed to update employee'}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateMutation.mutate({
        id: editingEmployee.id,
        data: {
          name: editingEmployee.name,
          department: editingEmployee.department,
          status: editingEmployee.status,
        },
      });
    }
  };

  const filteredEmployees = employees?.filter((emp: Employee) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.empCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-danger-600">Error loading employees. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your organization's employees
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary">
          <Plus size={18} className="mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </Card>

      {/* Employees Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees && filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee: Employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.empCode} • {employee.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'danger'}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/employees/${employee.id}`}>
                          <Button variant="subtle" size="sm">
                            <Eye size={16} className="mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="subtle" 
                          size="sm"
                          onClick={() => handleEdit(employee)}
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">
                      {searchQuery ? 'No employees match your search' : 'No employees found'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData({ empCode: '', name: '', email: '', department: '', hireDate: '' });
        }}
        title="Add New Employee"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Employee Code"
            type="text"
            required
            value={formData.empCode}
            onChange={(e) => setFormData({ ...formData, empCode: e.target.value })}
            placeholder="e.g., EMP004"
          />

          <Input
            label="Full Name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., John Smith"
          />

          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g., john.smith@company.com"
          />

          <Select
            label="Department"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </Select>

          <Input
            label="Hire Date"
            type="date"
            required
            value={formData.hireDate}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setFormData({ empCode: '', name: '', email: '', department: '', hireDate: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingEmployee(null);
          }}
          title="Edit Employee"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Employee Code"
              type="text"
              disabled
              value={editingEmployee.empCode}
            />

            <Input
              label="Full Name"
              type="text"
              required
              value={editingEmployee.name}
              onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
            />

            <Input
              label="Email"
              type="email"
              disabled
              value={editingEmployee.email}
            />

            <Select
              label="Department"
              required
              value={editingEmployee.department}
              onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </Select>

            <Select
              label="Status"
              required
              value={editingEmployee.status}
              onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value as any })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="TERMINATED">Terminated</option>
            </Select>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEmployee(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
