import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/state/auth.store';
import { apiClient } from '@/api/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LogIn } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('hr@company.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      login(access_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ReVibe HRMS</h1>
          <p className="text-sm text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {error && (
              <div className="text-sm text-danger-600 bg-danger-50 p-3 rounded border border-danger-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              <LogIn size={18} className="mr-2" />
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>

        {/* Test Accounts */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">Test Accounts:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• HR: <code className="text-gray-900">hr@company.com</code></p>
            <p>• Supervisor: <code className="text-gray-900">supervisor@company.com</code></p>
            <p>• Employee: <code className="text-gray-900">john.doe@company.com</code></p>
            <p className="text-gray-500 mt-2">All passwords: <code className="text-gray-900">password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
