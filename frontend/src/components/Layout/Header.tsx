// Top navigation bar shown on every page

import { Link, useLocation } from 'react-router-dom';

// Navigation links
const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/assess', label: 'Assessment' },
  { path: '/about', label: 'About' },
];

export default function Header() {
  // Get the current URL to highlight the active tab
  const location = useLocation();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CGM</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Child Growth Monitor
              </h1>
              <p className="text-xs text-slate-500">Rwanda Nutrition Platform</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                  location.pathname === link.path
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
