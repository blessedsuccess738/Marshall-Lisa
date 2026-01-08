
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { User, MembershipTier } from '../types';
import { PACKAGES } from '../constants';
import StatCard from '../components/StatCard';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, onUpdateUser }) => {
  const navigate = useNavigate();
  const pkg = PACKAGES[user.tier];
  const [mining, setMining] = useState(false);
  const [watchedCount, setWatchedCount] = useState(0);

  const handleMine = () => {
    setMining(true);
    setTimeout(() => {
      const updatedUser = { ...user, balance: user.balance + pkg.dailyRate };
      onUpdateUser(updatedUser);
      setMining(false);
      alert(`Mined ₦${pkg.dailyRate.toLocaleString()} successfully!`);
    }, 2000);
  };

  const handleWatch = () => {
    setWatchedCount(prev => prev + 1);
    const updatedUser = { ...user, balance: user.balance + pkg.videoRate };
    onUpdateUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 text-2xl font-black text-blue-600">EarnLink</div>
        <nav className="flex-1 px-4 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium bg-blue-50 text-blue-600 rounded-xl">
            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </Link>
          <Link to="/promo" className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl">
            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L17 12.828"></path></svg>
            AI Promo Tools
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition">
            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
            <p className="text-gray-500">Tier: <span className="font-semibold text-blue-600">{user.tier} Member</span></p>
          </div>
          <div className="flex items-center space-x-4">
             {user.isAdmin && <Link to="/admin" className="text-xs font-bold text-blue-600 underline">Admin Panel</Link>}
             <img src={`https://picsum.photos/100/100?u=${user.id}`} className="h-10 w-10 rounded-full border-2 border-blue-100" alt="profile" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="Total Balance" 
            value={`₦${user.balance.toLocaleString()}`} 
            icon={<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            color="bg-blue-100"
          />
          <StatCard 
            label="Referrals" 
            value={user.referrals.length} 
            icon={<svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
            color="bg-green-100"
          />
          <StatCard 
            label="Today's Earnings" 
            value={`₦${(watchedCount * pkg.videoRate).toLocaleString()}`} 
            icon={<svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
            color="bg-purple-100"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Earning Modules */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Daily Digital Mining</h3>
                <p className="text-gray-500 mb-6 text-sm">Earn ₦{pkg.dailyRate.toLocaleString()} by starting the cloud miner.</p>
                <button 
                  onClick={handleMine}
                  disabled={mining}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition transform active:scale-95 ${mining ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
                >
                  {mining ? 'Mining in progress...' : `Mine Today (₦${pkg.dailyRate})`}
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0"></div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Video Tasks</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center">
                      <div className="bg-black p-3 rounded-xl mr-4">
                         <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm">Reward Video #{i}</p>
                        <p className="text-xs text-green-600 font-semibold">+₦{pkg.videoRate}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleWatch}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Watch & Earn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Section */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Refer & Earn</h3>
              <p className="text-gray-500 text-sm mb-6">Invite friends and earn up to 10% from their subscription fees.</p>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4 break-all">
                <code className="text-xs text-blue-600 font-bold">https://earnlink.pro/register?ref={user.username}</code>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://earnlink.pro/register?ref=${user.username}`);
                  alert('Link copied!');
                }}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition"
              >
                Copy My Link
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Withdraw Earnings</h3>
                <span className="text-xs text-gray-400">Min: ₦2,000</span>
              </div>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Withdrawal request submitted for approval!'); }}>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount (₦)</label>
                  <input required type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bank Details</label>
                  <textarea required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500" rows={2} placeholder="Account Name, Number, Bank Name"></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100">
                  Request Instant Withdrawal
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
