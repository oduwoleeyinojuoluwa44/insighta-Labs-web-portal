import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/index.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { LoginPage } from './pages/LoginPage.js';
import { CallbackPage } from './pages/CallbackPage.js';
import { BrowserPage } from './pages/BrowserPage.js';
import './App.css';

export function App() {
  const { getCurrentUser, loading } = useAuth();

  useEffect(() => {
    // Check if user is already authenticated
    getCurrentUser().catch(() => {
      // Not authenticated, will redirect via router
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading application...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <BrowserPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/profiles" replace />} />
        <Route path="*" element={<Navigate to="/profiles" replace />} />
      </Routes>
    </Router>
  );
}
