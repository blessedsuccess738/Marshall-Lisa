
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
import { User, MembershipTier, WithdrawalRequest, SystemSettings, Song, QuizQuestion } from './types';
import { ADMIN_EMAIL } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    withdrawalOpen: true,
    withdrawalMessage: "Withdrawals are open 24/7. Requests are processed within 15 minutes.",
    announcement: "Welcome to RoyalGate! Mining rewards have been boosted for all Emperor tiers.",
    songs: [
      { id: '1', title: 'City Boys', artist: 'Burna Boy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '3:20' },
      { id: '2', title: 'Last Last', artist: 'Burna Boy', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '2:50' },
      { id: '3', title: 'Alone', artist: 'Fola', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '3:15' },
      { id: '4', title: 'Lucid Dreams', artist: 'Juice WRLD', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: '4:00' },
      { id: '5', title: 'Higher', artist: 'Tems', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: '3:15' },
      { id: '6', title: 'Just Wanna Rock', artist: 'Lil Uzi Vert', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration: '2:00' },
      { id: '7', title: 'Ransom', artist: 'Lil Tecca', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', duration: '3:30' },
      { id: '8', title: 'Me & U', artist: 'Tems', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: '3:02' },
      { id: '9', title: 'Wishing Well', artist: 'Juice WRLD', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', duration: '3:12' },
      { id: '10', title: '500lbs', artist: 'Lil Tecca', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: '2:55' }
    ],
    quizQuestions: [
      { id: 'q1', section: 'Crypto', question: 'What is the smallest unit of Bitcoin?', options: ['Satoshi', 'Wei', 'Gwei', 'Bit'], correctAnswer: 'Satoshi', reward: 500 },
      { id: 'q2', section: 'Tech', question: 'Which company created the iPhone?', options: ['Google', 'Samsung', 'Apple', 'Nokia'], correctAnswer: 'Apple', reward: 500 },
      { id: 'q3', section: 'Nigeria', question: 'What is the capital city of Nigeria?', options: ['Lagos', 'Abuja', 'Kano', 'Enugu'], correctAnswer: 'Abuja', reward: 500 }
    ]
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
    if (!users.find(u => u.id === user.id)) {
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
