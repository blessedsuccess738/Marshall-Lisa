
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MembershipTier } from '../types';
import { ADMIN_EMAIL } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const baseUserData = {
      transactions: [],
      miningState: { lastStartedAt: null, isClaimable: false },
      dailySpinClaimed: false,
      dailyEarnings: { quiz: 0, songs: 0, videos: 0, lastReset: new Date().toISOString() }
    };

    if (email === ADMIN_EMAIL) {
      const adminUser: User = {
        id: 'admin-1',
        fullName: 'Super Admin',
        username: 'admin',
        email: ADMIN_EMAIL,
        phone: '0000000000',
        country: 'System',
        tier: MembershipTier.EMPEROR,
        balance: 9999999,
        referralBalance: 0,
        referrals: [],
        isActive: true,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        ...baseUserData
      };
      onLogin(adminUser);
      navigate('/admin');
      return;
    }

    const mockUser: User = {
      id: 'user-123',
      fullName: 'Test Member',
      username: 'testuser',
      email: email,
      phone: '1234567890',
      country: 'Nigeria',
      tier: MembershipTier.KING,
      balance: 5400,
      referralBalance: 0,
      referrals: ['ref1', 'ref2'],
      isActive: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      ...baseUserData
    };
    onLogin(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10">
        <h2 className="text-4xl font-black text-white tracking-tight">Welcome Back</h2>
        <p className="mt-3 text-slate-400 font-medium italic">Continue your royal earning journey</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-10 px-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none" />
              <p className="text-[10px] text-slate-600 mt-2 italic">Admin: {ADMIN_EMAIL}</p>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none" />
            </div>
            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-lg">Sign In</button>
          </form>
          <p className="mt-10 text-center text-sm text-slate-500">Don't have an account? <Link to="/register" className="text-blue-500 font-bold">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
