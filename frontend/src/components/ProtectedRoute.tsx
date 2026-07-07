// Route guard: redirects unauthenticated users to the login page

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for the session-restore check before deciding
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="animate-spin h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Not logged in: send to /login, remembering where they were headed
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
