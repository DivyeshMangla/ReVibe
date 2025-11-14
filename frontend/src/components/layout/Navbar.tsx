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
          
          <div className="flex items-center gap-4 text-sm">
            <Link to="/payroll" className="hover:text-primary-100">Payroll</Link>
            <Link to="/employees" className="hover:text-primary-100">Employees</Link>
            <Link to="/leaves" className="hover:text-primary-100">Leaves</Link>
            <Link to="/transfers" className="hover:text-primary-100">Transfers</Link>
            <Link to="/trainings" className="hover:text-primary-100">Trainings</Link>
            <Link to="/acr" className="hover:text-primary-100">ACR</Link>
            <Link to="/evaluations" className="hover:text-primary-100">Evaluations</Link>
            <Link to="/joining-relieving" className="hover:text-primary-100">Joining/Relieving</Link>
            <Link to="/eservice-book" className="hover:text-primary-100">eService</Link>
            <Link to="/property-returns" className="hover:text-primary-100">Property</Link>
            <Link to="/promotions" className="hover:text-primary-100">Promotions</Link>
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-primary-500">
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
