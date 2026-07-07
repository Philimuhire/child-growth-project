// Login page

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/Auth/AuthForm';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to send the user after a successful login (defaults to the dashboard)
  const from = (location.state as { from?: string } | null)?.from || '/';

  const handleLogin = async (username: string, password: string) => {
    await login({ username, password });
    navigate(from, { replace: true });
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to run a child assessment"
      submitLabel="Log in"
      onSubmit={handleLogin}
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-700 font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    />
  );
}
