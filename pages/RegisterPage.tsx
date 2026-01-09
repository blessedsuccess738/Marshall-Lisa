
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
    ref: referralCode,
    username: '' // derived or extra
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setError('This email is reserved.');
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName,
      username: formData.email.split('@')[0] + Math.floor(Math.random() * 100),
      email: formData.email,
      phone: formData.phone,
      country: 'Nigeria',
      tier: MembershipTier.PINCK, // Default to free Pinck tier
      balance: 0,
      referralBalance: 0,
      referrals: [],
      referredBy: formData.ref,
      isActive: true,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      transactions: []
    };

    onLogin(newUser);
    navigate('/dashboard'); // Go directly to dashboard
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-4xl font-black text-white">Create Account</h2>
        <p className="mt-2 text-slate-400 font-medium italic">Join the Elite Rewards Circle</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-10 px-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 text-center">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                <input required placeholder="Enter your full name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-1">Email Address</label>
                <input required type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-1">Phone Number</label>
                <input required type="tel" placeholder="0800 000 0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-1">Password</label>
                <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 ml-1">Referral Code (Optional)</label>
                <input placeholder="PRO-2025" value={formData.ref} onChange={(e) => setFormData({...formData, ref: e.target.value})} className="w-full px-5 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>
            </div>

            <button type="submit" className="w-full py-4.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition transform active:scale-[0.98] shadow-xl shadow-blue-500/10 text-lg">
              Sign Up & Access Dashboard
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-500">
            Already registered? <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
