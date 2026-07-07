// Shared username/password form used by the Login and Register pages

import { useState, type ReactNode } from 'react';

interface AuthFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  onSubmit: (username: string, password: string) => Promise<void>;
  footer: ReactNode;
}

export default function AuthForm({ title, subtitle, submitLabel, onSubmit, footer }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(username.trim(), password);
    } catch (err: unknown) {
      // Prefer the backend's error detail when present
      const detail =
        (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail) && detail[0]?.msg) {
        setError(String(detail[0].msg));
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 ' +
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className={inputClass}
              placeholder="e.g. florenceuwase"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={submitLabel === 'Create account' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={inputClass}
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Please wait…' : submitLabel}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
      </div>
    </div>
  );
}
