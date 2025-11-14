import { Link } from 'react-router-dom';
import { useAuthStore } from '@/state/auth.store';

export function Navbar() {
  const { logout, user } = useAuthStore();

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            HR/Payroll System
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/payroll" className="hover:text-primary-100">
              Payroll
            </Link>
            <Link to="/employees" className="hover:text-primary-100">
              Employees
            </Link>
            <Link to="/promotions" className="hover:text-primary-100">
              Promotions
            </Link>
            <Link to="/corrections" className="hover:text-primary-100">
              Corrections
            </Link>
            <Link to="/chatbot" className="hover:text-primary-100">
              Chatbot
            </Link>
            
            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-primary-500">
              <span className="text-sm">{user?.name || 'User'}</span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-500 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
