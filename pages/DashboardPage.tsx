
import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { User, MembershipTier, Transaction, Currency } from '../types';
import { PACKAGES, NGN_TO_USD } from '../constants';

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
  const [activeTab, setActiveTab] = useState<'HOME' | 'QUIZ' | 'MUSIC' | 'MOVIES'>('HOME');
  const [mining, setMining] = useState(false);

  const pkg = PACKAGES[user.tier];
  const isFree = user.tier === MembershipTier.PINCK;
  const isHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  const formatVal = (val: number) => {
    if (currency === 'USD') return `$${(val / NGN_TO_USD).toFixed(2)}`;
    return `₦${val.toLocaleString()}`;
  };

  const handleEarning = (amount: number, type: 'quiz' | 'songs' | 'videos' | 'mining', desc: string) => {
    if (isFree) {
      setShowUpgradeModal(true);
      return;
    }

    // Check limits
    if (type === 'songs' && user.dailyEarnings.songs >= pkg.songLimit) {
      alert(`Daily limit of ${pkg.songLimit} songs reached for your tier!`);
      return;
    }
    if (type === 'videos' && user.dailyEarnings.videos >= pkg.videoLimit) {
      alert(`Daily limit of ${pkg.videoLimit} videos reached for your tier!`);
      return;
    }
    if (type === 'quiz' && user.dailyEarnings.quiz >= 1000) {
      alert(`Daily limit of ₦1,000 for quizzes reached!`);
      return;
    }

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
      transactions: [newTx, ...user.transactions],
      dailyEarnings: {
        ...user.dailyEarnings,
        [type]: user.dailyEarnings[type as keyof typeof user.dailyEarnings] + (type === 'quiz' ? amount : 1)
      }
    });
    alert(`Success! ${formatVal(amount)} credited.`);
  };

  const SONGS = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Premium Track #${i + 1}`,
    artist: `Artist ${Math.floor(i / 5) + 1}`,
    duration: '03:45'
  }));

  const VIDEOS = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Exclusive Movie Clip #${i + 1}`,
    views: `${(Math.random() * 100).toFixed(1)}k views`
  }));

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Activation', path: '/dashboard/wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { label: 'My Team', path: '/dashboard/team', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Settings', path: '/dashboard/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-64 glass-card md:h-screen sticky top-0 z-50 flex md:flex-col p-4 md:p-6 border-slate-800">
        <div className="text-2xl font-black text-blue-500 mb-10 hidden md:flex items-center">
           RG RoyalGate
        </div>
        <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 w-full overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center px-4 py-3 rounded-2xl transition-all font-bold text-sm shrink-0 md:w-full ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <svg className="h-5 w-5 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-auto hidden md:block pt-6 border-t border-slate-800">
          <button onClick={() => window.open('https://t.me/royalgate_support', '_blank')} className="w-full flex items-center px-4 py-3 text-blue-400 font-bold hover:bg-blue-500/10 rounded-2xl transition mb-2">
             <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
             Support
          </button>
          <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition">
             <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
             Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-10 lg:p-14 overflow-y-auto no-scrollbar bg-[#0b1222]">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              <img src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} className="h-14 w-14 rounded-2xl bg-slate-800 border-2 border-blue-600/20" alt="avatar" />
              <div>
                 <h1 className="text-xl font-black text-white">Welcome back!</h1>
                 <p className="text-slate-500 text-sm font-bold uppercase">{user.tier} Tier</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700 flex">
                 <button onClick={() => setCurrency('NGN')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition ${currency === 'NGN' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>NGN</button>
                 <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition ${currency === 'USD' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>USD</button>
              </div>
           </div>
        </div>

        {isHome ? (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Wallet Quickview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10">
                  <p className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-widest">Available Balance</p>
                  <p className="text-5xl font-black text-white mb-6">{formatVal(user.balance)}</p>
                  <Link to="/dashboard/wallet" className="inline-block px-8 py-3 bg-blue-600 rounded-2xl font-black text-sm text-white hover:bg-blue-500 transition">Activation Hub</Link>
               </div>
               <div className="glass-card p-10 rounded-[3rem] border border-slate-800 flex flex-col justify-center">
                  <p className="text-slate-500 text-[10px] font-black uppercase mb-1 tracking-widest">Daily Limit Status</p>
                  <div className="space-y-3 mt-4">
                     <div className="flex justify-between text-sm"><span className="text-slate-400">Songs Played</span><span className="font-bold">{user.dailyEarnings.songs}/{pkg.songLimit}</span></div>
                     <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-600 h-full transition-all duration-500" style={{width: `${(user.dailyEarnings.songs/pkg.songLimit)*100}%`}}></div></div>
                     <div className="flex justify-between text-sm"><span className="text-slate-400">Videos Watched</span><span className="font-bold">{user.dailyEarnings.videos}/{pkg.videoLimit}</span></div>
                     <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-600 h-full transition-all duration-500" style={{width: `${(user.dailyEarnings.videos/pkg.videoLimit)*100}%`}}></div></div>
                  </div>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-800 pb-2">
               {['HOME', 'QUIZ', 'MUSIC', 'MOVIES'].map(t => (
                 <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2 text-xs font-black transition ${activeTab === t ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500'}`}>{t}</button>
               ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'HOME' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Mining */}
                 <div className="glass-card p-10 rounded-[3rem] border border-slate-800 relative overflow-hidden group">
                    <h3 className="text-2xl font-black mb-3">Core Node Miner</h3>
                    <p className="text-slate-500 text-sm mb-10">Run the RoyalGate sequence to extract daily blocks.</p>
                    <div className="h-32 flex items-center justify-center bg-slate-900/50 rounded-3xl border border-slate-800 mb-8 overflow-hidden">
                       {mining ? (
                         <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-3 bg-blue-600 animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>)}
                         </div>
                       ) : <div className="text-slate-800 font-black text-5xl italic group-hover:text-blue-500/5 transition">STANDBY</div>}
                    </div>
                    <button 
                      onClick={() => {
                        if (isFree) return setShowUpgradeModal(true);
                        setMining(true);
                        setTimeout(() => {
                           handleEarning(pkg.dailyRate, 'mining', 'Daily Node Mining');
                           setMining(false);
                        }, 2500);
                      }}
                      disabled={mining}
                      className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] font-black text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] transition"
                    >
                      {mining ? 'Hashing Blocks...' : 'Start Mining'}
                    </button>
                 </div>
                 
                 <div className="glass-card p-10 rounded-[3rem] border border-slate-800">
                    <h3 className="text-2xl font-black mb-6">Activity Feed</h3>
                    <div className="space-y-4">
                       {user.transactions.slice(0, 5).map(tx => (
                         <div key={tx.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                               <div className={`p-2 rounded-lg ${tx.type === 'CREDIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {tx.type === 'CREDIT' ? '↓' : '↑'}
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-white">{tx.description}</p>
                                  <p className="text-[10px] text-slate-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                               </div>
                            </div>
                            <span className={`text-xs font-black ${tx.type === 'CREDIT' ? 'text-emerald-500' : 'text-slate-400'}`}>
                               {tx.type === 'CREDIT' ? '+' : '-'}{formatVal(tx.amount)}
                            </span>
                         </div>
                       ))}
                       {user.transactions.length === 0 && <p className="text-center text-slate-500 py-10 italic">No activity yet.</p>}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'QUIZ' && (
              <div className="max-w-3xl mx-auto text-center space-y-8 bg-amber-500/5 border border-amber-500/10 p-12 rounded-[3.5rem] glass-card">
                 <h2 className="text-4xl font-black text-amber-500">Royal Trivia</h2>
                 <p className="text-slate-400 font-medium">Answer questions correctly to earn ₦450 per session. (Max ₦1,000/day)</p>
                 <div className="p-10 bg-slate-900 rounded-[2.5rem] border border-slate-800 text-left">
                    <p className="text-xl font-bold mb-8">What is the capital of crypto digital assets?</p>
                    <div className="grid grid-cols-1 gap-4">
                       {['Decentralization', 'MetaMask', 'Binance', 'RoyalGate'].map(opt => (
                         <button key={opt} onClick={() => handleEarning(450, 'quiz', 'Quiz Participation Reward')} className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-left font-bold transition">
                            {opt}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'MUSIC' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-black text-emerald-500">Music Marketplace</h2>
                    <p className="text-slate-500 text-sm font-bold">Earn {formatVal(pkg.songRate)} per stream</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SONGS.map(song => (
                      <div key={song.id} className="p-5 glass-card rounded-2xl border border-slate-800 flex justify-between items-center group">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 font-black group-hover:bg-emerald-500 group-hover:text-white transition cursor-pointer" onClick={() => handleEarning(pkg.songRate, 'songs', `Streamed ${song.title}`)}>
                               ▶
                            </div>
                            <div>
                               <p className="text-sm font-bold text-white">{song.title}</p>
                               <p className="text-[10px] text-slate-500">{song.artist}</p>
                            </div>
                         </div>
                         <span className="text-[10px] text-slate-600 font-black">{song.duration}</span>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'MOVIES' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-black text-purple-500">Cinema Hub</h2>
                    <p className="text-slate-500 text-sm font-bold">Earn {formatVal(pkg.videoRate)} per video</p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {VIDEOS.map(vid => (
                      <div key={vid.id} className="relative group rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer aspect-[9/12]" onClick={() => handleEarning(pkg.videoRate, 'videos', `Watched ${vid.title}`)}>
                         <img src={`https://picsum.photos/300/400?random=${vid.id + 100}`} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-700" alt="thumb" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent flex flex-col justify-end p-5">
                            <p className="text-xs font-black text-white mb-1">{vid.title}</p>
                            <p className="text-[9px] text-purple-400 font-bold uppercase">{vid.views}</p>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <div className="h-12 w-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20">
                               <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        ) : <Outlet />}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="glass-card w-full max-w-xl p-10 rounded-[3.5rem] border border-blue-500/20 text-center relative">
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition"><svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Activation Required</h2>
              <p className="text-slate-400 mb-10 font-medium">To unlock tasks, mining, and daily withdrawals, you need to activate a premium package.</p>
              
              <div className="space-y-4 mb-10">
                 {[MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR].map(tier => (
                    <div key={tier} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex justify-between items-center group hover:border-blue-600 transition cursor-pointer" onClick={() => navigate('/dashboard/wallet')}>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{PACKAGES[tier].name}</p>
                          <p className="text-xl font-black text-white">₦{PACKAGES[tier].price.toLocaleString()}</p>
                       </div>
                       <div className="px-6 py-2 bg-blue-600 rounded-xl text-xs font-black text-white">Select</div>
                    </div>
                 ))}
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-500 font-bold hover:text-slate-300 transition underline underline-offset-4">Maybe Later</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
