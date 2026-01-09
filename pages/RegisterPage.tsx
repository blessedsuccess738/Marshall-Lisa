
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

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setError('System restricted email.');
      return;
    }

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
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 px-6 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10">
        <h2 className="text-4xl font-black text-white tracking-tight">RoyalGate</h2>
        <p className="mt-3 text-slate-400 font-medium italic">Your gateway to premium digital rewards</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-10 px-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 text-center">{error}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Full Name</label>
                <input required placeholder="Enter your full name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Email Address</label>
                <input required type="email" placeholder="example@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Phone Number</label>
                <input required type="tel" placeholder="080... (11 digits)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Password</label>
                <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Referral Code (Optional)</label>
                <input placeholder="Enter code if any" value={formData.ref} onChange={(e) => setFormData({...formData, ref: e.target.value})} className="w-full px-5 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition" />
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition transform active:scale-[0.98] shadow-xl shadow-blue-500/10 text-lg mt-4">
              Create My Account
            </button>
          </form>
          
          <p className="mt-10 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
