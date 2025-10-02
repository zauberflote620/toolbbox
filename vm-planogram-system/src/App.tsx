import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { User } from './types';
import { authService } from './services/auth.service';

import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import StoreManager from './components/stores/StoreManager';
import PlanogramBuilder from './components/planogram/PlanogramBuilder';
import FixtureLibrary from './components/fixtures/FixtureLibrary';
import AnalyticsParser from './components/analytics/AnalyticsParser';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setError(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} error={error} setError={setError} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        <Layout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/stores" element={<StoreManager user={user} />} />
            <Route path="/stores/:storeId/planogram" element={<PlanogramBuilder user={user} />} />
            <Route path="/fixtures" element={<FixtureLibrary />} />
            <Route path="/analytics" element={<AnalyticsParser />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </div>
    </DndProvider>
  );
}

export default App;