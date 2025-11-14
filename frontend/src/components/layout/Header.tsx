import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/payroll': 'Payroll',
  '/leaves': 'Leave Management',
  '/transfers': 'Transfers',
  '/trainings': 'Training Management',
  '/acr': 'ACR Management',
  '/evaluations': 'Performance Evaluations',
  '/joining-relieving': 'Joining & Relieving',
  '/eservice-book': 'eService Book',
  '/property-returns': 'Property Returns',
  '/promotions': 'Promotions',
};

export function Header() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const getTitle = () => {
    return pageTitles[location.pathname] || 'Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">ReVibe</span>
        {pathSegments.length > 0 && (
          <>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="font-medium text-gray-900">{getTitle()}</span>
          </>
        )}
      </nav>
    </header>
  );
}
