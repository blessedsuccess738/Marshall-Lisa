
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, MembershipTier } from '../types';
import { ADMIN_EMAIL } from '../constants';

interface RegisterPageProps {
  onLogin: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    ref: referralCode
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName,
      username: formData.email.split('@')[0],
      email: formData.email,
      phone: formData.phone,
      country: 'Nigeria',
      tier: MembershipTier.PINCK,
      balance: 0,
      referralBalance: 0,
      referrals: [],
      referredBy: formData.ref,
      isActive: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      transactions: [],
      miningState: { lastStartedAt: null, isClaimable: false },
      dailySpinClaimed: false,
      dailyEarnings: {
        quiz: 0,
        songs: 0,
        videos: 0,
        lastReset: new Date().toISOString()
      }
    };

    onLogin(newUser);
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10">
        <h2 className="text-4xl font-black text-white tracking-tight">RoyalGate</h2>
        <p className="mt-3 text-slate-400 font-medium italic">Your gateway to premium digital rewards</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-10 px-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input required placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none" />
              <input required type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none" />
              <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none" />
              <input required type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none" />
              <input placeholder="Referral Code (Optional)" value={formData.ref} onChange={(e) => setFormData({...formData, ref: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 outline-none" />
            </div>
            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-lg shadow-xl shadow-blue-500/10">Create My Account</button>
          </form>
          <p className="mt-10 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="text-blue-500 font-bold">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
