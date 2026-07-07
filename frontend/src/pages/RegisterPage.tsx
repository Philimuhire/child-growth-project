// Account creation page

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/Auth/AuthForm';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (username: string, password: string) => {
    await register({ username, password });
    // New accounts start logged in; go to the dashboard
    navigate('/', { replace: true });
  };

  return (
    <AuthForm
      title="Create your account"
      subtitle="Sign up with a username and password"
      submitLabel="Create account"
      onSubmit={handleRegister}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-700 font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    />
  );
}
