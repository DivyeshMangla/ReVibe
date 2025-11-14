import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  ArrowRightLeft,
  GraduationCap,
  FileText,
  ClipboardCheck,
  BookOpen,
  Package,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/state/auth.store';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Payroll', href: '/payroll', icon: DollarSign },
  { name: 'Leaves', href: '/leaves', icon: Calendar },
  { name: 'Transfers', href: '/transfers', icon: ArrowRightLeft },
  { name: 'Trainings', href: '/trainings', icon: GraduationCap },
  { name: 'ACR', href: '/acr', icon: ClipboardCheck },
  { name: 'Evaluations', href: '/evaluations', icon: FileText },
  { name: 'Joining & Relieving', href: '/joining-relieving', icon: BookOpen },
  { name: 'eService Book', href: '/eservice-book', icon: BookOpen },
  { name: 'Property Returns', href: '/property-returns', icon: Package },
  { name: 'Promotions', href: '/promotions', icon: TrendingUp },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">ReVibe HRMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.role || 'Employee'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
