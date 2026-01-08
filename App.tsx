
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import AdminPage from './pages/AdminPage';
import PromoToolPage from './pages/PromoToolPage';
import { User, MembershipTier } from './types';
import { ADMIN_EMAIL } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('earnlink_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('earnlink_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('earnlink_user');
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage onLogin={login} />} />
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        
        <Route 
          path="/onboarding" 
          element={currentUser ? <OnboardingPage user={currentUser} onUpdateUser={login} /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/dashboard/*" 
          element={
            currentUser ? (
              currentUser.tier === MembershipTier.NONE && !currentUser.isAdmin ? (
                <Navigate to="/onboarding" />
              ) : (
                <DashboardPage user={currentUser} onLogout={logout} onUpdateUser={login} />
              )
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/admin" 
          element={
            currentUser?.isAdmin ? (
              <AdminPage user={currentUser} onLogout={logout} />
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/promo" 
          element={
            currentUser ? <PromoToolPage user={currentUser} /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
