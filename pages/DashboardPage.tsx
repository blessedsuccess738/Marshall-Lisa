
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { User, MembershipTier, Transaction, Currency } from '../types';
import { PACKAGES, NGN_TO_USD } from '../constants';
import StatCard from '../components/StatCard';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, onUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mining, setMining] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'QUIZ' | 'MUSIC' | 'MOVIES'>('OVERVIEW');

  const pkg = PACKAGES[user.tier];
  const isFree = user.tier === MembershipTier.PINCK;
  const isHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  const formatVal = (val: number) => {
    if (currency === 'USD') return `$${(val / NGN_TO_USD).toFixed(2)}`;
    return `₦${val.toLocaleString()}`;
  };

  const checkAccess = () => {
    if (isFree) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  const handleEarning = (amount: number, desc: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      type: 'CREDIT',
      description: desc,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    };
    onUpdateUser({ 
      ...user, 
      balance: user.balance + amount,
      transactions: [newTx, ...user.transactions]
    });
  };

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Wallet', path: '/dashboard/wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { label: 'Team', path: '/dashboard/team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'AI Tools', path: '/dashboard/promo', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L17 12.828' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 glass-card md:h-screen sticky top-0 z-50 flex md:flex-col p-4 md:p-6 border-slate-800">
        <div className="text-2xl font-black text-blue-500 mb-8 hidden md:flex items-center">
          <span className="bg-blue-600 text-white rounded-lg p-1.5 mr-2 text-sm italic">RG</span> RoyalGate
        </div>
        <nav className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 w-full overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center px-4 py-3 rounded-2xl transition-all shrink-0 md:w-full font-bold text-sm ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <svg className="h-5 w-5 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-4 md:p-10 lg:p-14 overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-black text-white">Dashboard</h1>
            <p className="text-slate-500 text-sm">{user.fullName}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex bg-slate-800 p-1 rounded-full border border-slate-700">
                <button onClick={() => setCurrency('NGN')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition ${currency === 'NGN' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}>NGN</button>
                <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition ${currency === 'USD' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}>USD</button>
             </div>
             <div className="h-10 w-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`} alt="avatar" />
             </div>
          </div>
        </div>

        {isHome ? (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20">
                <p className="text-blue-400 text-[10px] font-black uppercase mb-1 tracking-widest">Total Assets</p>
                <p className="text-4xl font-black text-white">{formatVal(user.balance)}</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800">
                <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">Earning Tier</p>
                <p className="text-2xl font-black text-white uppercase">{user.tier}</p>
              </div>
              <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800">
                <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">Team Size</p>
                <p className="text-2xl font-black text-white">{user.referrals.length} Members</p>
              </div>
            </div>

            {/* Earning Tabs */}
            <div className="flex space-x-2 border-b border-slate-800 pb-2">
               {['OVERVIEW', 'QUIZ', 'MUSIC', 'MOVIES'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 text-xs font-black transition-all ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500'}`}>{tab}</button>
               ))}
            </div>

            <div className="animate-in fade-in duration-500">
              {activeTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Mining Game Block */}
                  <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-2">Cloud Node Mining</h3>
                    <p className="text-slate-500 text-sm mb-8">Synchronize with the RoyalGate nodes to extract value.</p>
                    <div className="flex items-center justify-center h-32 mb-8 bg-slate-900/50 rounded-2xl relative">
                        {mining ? (
                          <div className="flex gap-2">
                             {[1, 2, 3].map(i => <div key={i} className="w-2 bg-blue-500 animate-bounce" style={{animationDelay: `${i * 0.1}s`}}></div>)}
                          </div>
                        ) : <div className="text-blue-500/20 text-4xl font-black italic">IDLE</div>}
                    </div>
                    <button onClick={() => { if(checkAccess()) { setMining(true); setTimeout(() => { handleEarning(pkg.dailyRate, 'Daily Node Mining'); setMining(false); alert('Mining Block Verified!'); }, 3000); } }} disabled={mining} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-white shadow-lg shadow-blue-500/20 active:scale-95 transition">
                      {mining ? 'Verifying Hashes...' : 'Start Mining Session'}
                    </button>
                  </div>

                  {/* Task Center */}
                  <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800">
                    <h3 className="text-xl font-bold mb-6">Engagement Tasks</h3>
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl flex justify-between items-center group hover:border-blue-500 transition">
                          <div>
                            <p className="font-bold text-sm">Reward Stream #{i}</p>
                            <p className="text-[10px] text-blue-400 font-black">+{formatVal(pkg.videoRate)} Available</p>
                          </div>
                          <button onClick={() => checkAccess() && alert('Playing reward video...')} className="px-5 py-2 bg-slate-700 rounded-xl text-xs font-black group-hover:bg-blue-600 transition">Claim</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'QUIZ' && (
                <div className="glass-card p-10 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 max-w-2xl mx-auto text-center">
                   <h3 className="text-2xl font-black text-amber-500 mb-4">RoyalGate Trivia</h3>
                   <p className="text-slate-400 mb-8">Answer questions correctly to earn ₦450 per session. (Max ₦1,000/day)</p>
                   <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl mb-8">
                      <p className="text-lg font-bold mb-6">What is the primary utility of RoyalGate tokens?</p>
                      <div className="grid grid-cols-1 gap-3">
                         {['Mining Power', 'Store of Value', 'Governance'].map(opt => (
                           <button key={opt} onClick={() => checkAccess() && (Math.random() > 0.5 ? (handleEarning(450, 'Quiz Reward'), alert('Correct! N450 Added')) : alert('Incorrect. Try again later.'))} className="py-3 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold text-sm transition">{opt}</button>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'MUSIC' && (
                <div className="glass-card p-10 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 max-w-2xl mx-auto text-center">
                   <h3 className="text-2xl font-black text-emerald-500 mb-4">Listen to Earn</h3>
                   <p className="text-slate-400 mb-10">Get rewarded for discovering premium audio content.</p>
                   <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 flex flex-col items-center">
                      <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-500/10">
                         <svg className="h-10 w-10 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                      </div>
                      <p className="font-bold text-white mb-1">Discovering Royalty - Mix 01</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-8">24.5k Listens</p>
                      <button onClick={() => checkAccess() && alert('Starting audio session... Rewards credit after 30s.')} className="px-10 py-4 bg-emerald-600 rounded-full font-black text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20">Listen Now (+₦50)</button>
                   </div>
                </div>
              )}

              {activeTab === 'MOVIES' && (
                <div className="glass-card p-10 rounded-[2.5rem] border border-purple-500/20 bg-purple-500/5 max-w-2xl mx-auto text-center">
                   <h3 className="text-2xl font-black text-purple-500 mb-4">Cinema Rewards</h3>
                   <p className="text-slate-400 mb-10">Watch premium short-films and trailers for instant balance credits.</p>
                   <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="relative group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 cursor-pointer" onClick={() => checkAccess() && alert('Watching Movie...')}>
                           <img src={`https://picsum.photos/400/300?random=${i + 20}`} className="aspect-video object-cover opacity-50 group-hover:scale-105 transition" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-white/10 backdrop-blur p-2 rounded-full border border-white/20"><svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
                           </div>
                           <div className="absolute bottom-0 left-0 p-3 w-full bg-gradient-to-t from-black text-left">
                              <p className="text-[10px] font-bold text-white">Trailer #{i}</p>
                              <p className="text-[9px] text-purple-400 font-black">+₦80</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : <Outlet />}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80 animate-in fade-in zoom-in duration-300">
           <div className="glass-card w-full max-w-xl p-10 rounded-[3rem] border border-blue-500/30 text-center relative overflow-hidden">
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition"><svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              <h2 className="text-4xl font-black text-white mb-2">Upgrade Required</h2>
              <p className="text-slate-400 mb-10">Your current <span className="text-blue-500 font-bold uppercase">{user.tier}</span> plan has limited access. Activate a premium package to unlock these earning modules.</p>
              
              <div className="grid grid-cols-1 gap-4 mb-10">
                 {[MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR].map(tier => (
                   <div key={tier} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center group hover:border-blue-500 transition">
                      <div className="text-left">
                         <p className="text-xs font-black text-blue-400 uppercase tracking-widest">{PACKAGES[tier].name}</p>
                         <p className="text-lg font-black text-white">₦{PACKAGES[tier].price.toLocaleString()}</p>
                      </div>
                      <Link to="/onboarding" className="px-6 py-2 bg-blue-600 rounded-xl text-xs font-black text-white hover:bg-blue-500 transition">Select</Link>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
