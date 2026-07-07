// Root app component with routing

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './pages/Dashboard';
import AssessmentPage from './pages/AssessmentPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public: only the auth screens */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Everything else requires login */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <AboutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assess"
                element={
                  <ProtectedRoute>
                    <AssessmentPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
