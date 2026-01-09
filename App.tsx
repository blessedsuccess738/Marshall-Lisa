
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import AdminPage from './pages/AdminPage';
import PromoToolPage from './pages/PromoToolPage';
import WalletPage from './pages/WalletPage';
import SettingsPage from './pages/SettingsPage';
import TeamPage from './pages/TeamPage';
import WithdrawalPage from './pages/WithdrawalPage';
import { User, MembershipTier } from './types';

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

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0f172a]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>;

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
        
        <Route path="/dashboard" element={currentUser ? <DashboardPage user={currentUser} onLogout={logout} onUpdateUser={login} /> : <Navigate to="/login" />}>
          <Route path="wallet" element={<WalletPage user={currentUser} onUpdateUser={login} />} />
          <Route path="withdraw" element={<WithdrawalPage user={currentUser} onUpdateUser={login} />} />
          <Route path="team" element={<TeamPage user={currentUser} />} />
          <Route path="settings" element={<SettingsPage user={currentUser} onUpdateUser={login} />} />
          <Route path="promo" element={<PromoToolPage user={currentUser} />} />
        </Route>

        <Route 
          path="/admin" 
          element={
            currentUser?.isAdmin ? (
              <AdminPage user={currentUser} onLogout={logout} />
            ) : <Navigate to="/login" />
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
