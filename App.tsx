
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
import { User, MembershipTier, WithdrawalRequest, SystemSettings } from './types';
import { ADMIN_EMAIL } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    withdrawalOpen: true,
    withdrawalMessage: "Withdrawals are open 24/7. Requests are processed within 15 minutes.",
    announcement: "Welcome to RoyalGate! Mining rewards have been boosted for all Emperor tiers."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('royalgate_user');
    const savedUsers = localStorage.getItem('royalgate_all_users');
    const savedWithdrawals = localStorage.getItem('royalgate_withdrawals');
    const savedSettings = localStorage.getItem('royalgate_settings');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('royalgate_all_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('royalgate_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem('royalgate_settings', JSON.stringify(settings));
  }, [settings]);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('royalgate_user', JSON.stringify(user));
    // If user doesn't exist in global list, add them
    if (!users.find(u => u.email === user.email)) {
      setUsers(prev => [...prev, user]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('royalgate_user');
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('royalgate_user', JSON.stringify(updatedUser));
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addWithdrawal = (req: WithdrawalRequest) => {
    setWithdrawals(prev => [req, ...prev]);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage onLogin={login} />} />
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        
        <Route 
          path="/onboarding" 
          element={currentUser ? <OnboardingPage user={currentUser} onUpdateUser={updateUser} /> : <Navigate to="/login" />} 
        />
        
        <Route path="/dashboard" element={currentUser ? <DashboardPage user={currentUser} settings={settings} onLogout={logout} onUpdateUser={updateUser} /> : <Navigate to="/login" />}>
          <Route path="wallet" element={<WalletPage user={currentUser} onUpdateUser={updateUser} />} />
          <Route 
            path="withdraw" 
            element={<WithdrawalPage user={currentUser} settings={settings} onUpdateUser={updateUser} onAddWithdrawal={addWithdrawal} />} 
          />
          <Route path="team" element={<TeamPage user={currentUser} />} />
          <Route path="settings" element={<SettingsPage user={currentUser} onUpdateUser={updateUser} />} />
          <Route path="promo" element={<PromoToolPage user={currentUser} />} />
        </Route>

        <Route 
          path="/admin" 
          element={
            currentUser?.isAdmin ? (
              <AdminPage 
                user={currentUser} 
                users={users} 
                setUsers={setUsers}
                withdrawals={withdrawals}
                setWithdrawals={setWithdrawals}
                settings={settings}
                setSettings={setSettings}
                onLogout={logout} 
              />
            ) : <Navigate to="/login" />
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
