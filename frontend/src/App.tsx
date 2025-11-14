import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { PayrollDashboard } from './pages/PayrollDashboard';
import { PayrollRunView } from './pages/PayrollRunView';
import { EmployeesListPage } from './pages/EmployeesListPage';
import { EmployeeProfileView } from './pages/EmployeeProfileView';
import { PromotionsPanel } from './pages/PromotionsPanel';
import { SalaryCorrectionsView } from './pages/SalaryCorrectionsView';
import { ChatbotPanel } from './pages/ChatbotPanel';
import { LeavesPage } from './pages/LeavesPage';
import { TransfersPage } from './pages/TransfersPage';
import { TrainingsPage } from './pages/TrainingsPage';
import { ACRPage } from './pages/ACRPage';
import { EvaluationsPage } from './pages/EvaluationsPage';
import { JoiningRelievingPage } from './pages/JoiningRelievingPage';
import { EServiceBookPage } from './pages/EServiceBookPage';
import { PropertyReturnsPage } from './pages/PropertyReturnsPage';
import { LoginPage } from './pages/LoginPage';
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
            <Route path="employees" element={<EmployeesListPage />} />
            <Route path="employees/:id" element={<EmployeeProfileView />} />
            <Route path="leaves" element={<LeavesPage />} />
            <Route path="transfers" element={<TransfersPage />} />
            <Route path="trainings" element={<TrainingsPage />} />
            <Route path="acr" element={<ACRPage />} />
            <Route path="evaluations" element={<EvaluationsPage />} />
            <Route path="joining-relieving" element={<JoiningRelievingPage />} />
            <Route path="eservice-book" element={<EServiceBookPage />} />
            <Route path="property-returns" element={<PropertyReturnsPage />} />
            <Route path="promotions" element={<PromotionsPanel />} />
            <Route path="corrections" element={<SalaryCorrectionsView />} />
            <Route path="chatbot" element={<ChatbotPanel />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
