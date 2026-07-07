// Top navigation bar shown on every page

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/assess', label: 'Assessment' },
  { path: '/about', label: 'About' },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
      location.pathname === path
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  // Auth controls: username + Logout when signed in, Login / Sign up otherwise
  const authControls = (stacked: boolean) =>
    user ? (
      <div className={stacked ? 'flex flex-col gap-1' : 'flex items-center gap-2'}>
        <span className="px-3 py-2 text-sm text-slate-500">
          Signed in as <span className="font-semibold text-slate-700">{user.username}</span>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
        >
          Logout
        </button>
      </div>
    ) : (
      <div className={stacked ? 'flex flex-col gap-1' : 'flex items-center gap-2'}>
        <Link to="/login" onClick={() => setMenuOpen(false)} className={linkClass('/login')}>
          Login
        </Link>
        <Link
          to="/register"
          onClick={() => setMenuOpen(false)}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors no-underline text-center"
        >
          Sign up
        </Link>
      </div>
    );

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 no-underline min-w-0"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">CGM</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                Child Growth Monitor
              </h1>
              <p className="hidden sm:block text-xs text-slate-500">Rwanda Nutrition Platform</p>
            </div>
          </Link>

          {/* Desktop nav — page links only for signed-in users */}
          <nav className="hidden md:flex items-center gap-1">
            {user &&
              navLinks.map((link) => (
                <Link key={link.path} to={link.path} className={linkClass(link.path)}>
                  {link.label}
                </Link>
              ))}
            {user && <span className="w-px h-6 bg-slate-200 mx-2" />}
            {authControls(false)}
          </nav>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown nav */}
        {menuOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass(link.path)}
                >
                  {link.label}
                </Link>
              ))}
            {user && <span className="h-px bg-slate-200 my-2" />}
            {authControls(true)}
          </nav>
        )}
      </div>
    </header>
  );
}
