import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { PayrollDashboard } from './pages/PayrollDashboard';
import { PayrollRunView } from './pages/PayrollRunView';
import { EmployeeProfileView } from './pages/EmployeeProfileView';
import { PromotionsPanel } from './pages/PromotionsPanel';
import { SalaryCorrectionsView } from './pages/SalaryCorrectionsView';
import { ChatbotPanel } from './pages/ChatbotPanel';
import { useAuthStore } from './state/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/payroll" replace />} />
            <Route path="payroll" element={<PayrollDashboard />} />
            <Route path="payroll/:id" element={<PayrollRunView />} />
            <Route path="employees/:id" element={<EmployeeProfileView />} />
            <Route path="promotions" element={<PromotionsPanel />} />
            <Route path="corrections" element={<SalaryCorrectionsView />} />
            <Route path="chatbot" element={<ChatbotPanel />} />
          </Route>
          <Route path="/login" element={<div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Login</h1>
              <p className="text-gray-600">Login page stub - JWT authentication required</p>
            </div>
          </div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
