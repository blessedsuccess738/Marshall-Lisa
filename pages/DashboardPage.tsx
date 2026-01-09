
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { User, MembershipTier, Transaction, Currency, SystemSettings } from '../types';
import { PACKAGES, NGN_TO_USD } from '../constants';

interface DashboardPageProps {
  user: User;
  settings: SystemSettings;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, settings, onLogout, onUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'HOME' | 'QUIZ' | 'MUSIC' | 'MOVIES'>('HOME');
  const [mining, setMining] = useState(false);

  // Playback States
  const [activeMedia, setActiveMedia] = useState<{ id: number; type: 'song' | 'video'; progress: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressInterval = useRef<number | null>(null);

  const pkg = PACKAGES[user.tier];
  const isFree = user.tier === MembershipTier.PINCK;
  const isHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  // Persistence: Restore saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(`royalgate_progress_${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // We don't auto-start, but we keep the state ready
      setActiveMedia(parsed);
    }
  }, [user.id]);

  // Save progress on change
  useEffect(() => {
    if (activeMedia) {
      localStorage.setItem(`royalgate_progress_${user.id}`, JSON.stringify(activeMedia));
    }
  }, [activeMedia, user.id]);

  // Handle Playback Logic
  const startPlayback = (id: number, type: 'song' | 'video') => {
    if (isFree) {
      setShowUpgradeModal(true);
      return;
    }

    // If switching media, reset progress unless it's the same one
    if (activeMedia?.id === id && activeMedia?.type === type) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveMedia({ id, type, progress: 0 });
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying && activeMedia) {
      progressInterval.current = window.setInterval(() => {
        setActiveMedia(prev => {
          if (!prev) return null;
          const nextProgress = prev.progress + 2; // Increment by 2% every second for demo speed (50s total)
          
          if (nextProgress >= 100) {
            handleCompletion(prev.id, prev.type);
            setIsPlaying(false);
            if (progressInterval.current) clearInterval(progressInterval.current);
            return { ...prev, progress: 100 };
          }
          return { ...prev, progress: nextProgress };
        });
      }, 1000);
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, activeMedia]);

  const handleCompletion = (id: number, type: 'song' | 'video') => {
    const amount = type === 'song' ? pkg.songRate : pkg.videoRate;
    const category = type === 'song' ? 'songs' : 'videos';
    const label = type === 'song' ? 'Stream Completion' : 'Movie Completion';

    handleEarning(amount, category, `${label} Reward (#${id})`);
    setActiveMedia(null);
  };

  const formatVal = (val: number) => {
    if (currency === 'USD') return `$${(val / NGN_TO_USD).toFixed(2)}`;
    return `₦${val.toLocaleString()}`;
  };

  const handleEarning = (amount: number, type: 'quiz' | 'songs' | 'videos' | 'mining', desc: string) => {
    if (isFree) {
      setShowUpgradeModal(true);
      return;
    }

    if (type === 'songs' && user.dailyEarnings.songs >= pkg.songLimit) {
      alert(`Daily limit of ${pkg.songLimit} songs reached for your tier!`);
      return;
    }
    if (type === 'videos' && user.dailyEarnings.videos >= pkg.videoLimit) {
      alert(`Daily limit of ${pkg.videoLimit} videos reached for your tier!`);
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
  };

  const ARTISTS = [
    { name: 'Burna Boy', songs: ['City Boys', 'Last Last', 'Tested, Approved', 'It\'s Plenty', 'Giza'] },
    { name: 'Fola', songs: ['Alone', 'Better Days', 'Focus', 'Vibe', 'Tonight'] },
    { name: 'Lil Uzi Vert', songs: ['Just Wanna Rock', 'XO Tour Llif3', 'Money Longer', '20 Min', 'P2'] },
    { name: 'Juice WRLD', songs: ['Lucid Dreams', 'All Girls Are Same', 'Robbery', 'Wishing Well', 'Legends'] },
    { name: 'Lil Tecca', songs: ['Ransom', '500lbs', 'Lot of Me', 'Never Left', 'Diva'] }
  ];

  const SONGS = Array.from({ length: 50 }, (_, i) => {
    const artistIdx = Math.floor(i / 10) % ARTISTS.length;
    const songIdx = i % 5;
    return {
      id: i + 1,
      title: ARTISTS[artistIdx].songs[songIdx] || `Premium Track #${i + 1}`,
      artist: ARTISTS[artistIdx].name,
      duration: '03:45'
    };
  });

  const VIDEOS = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Exclusive Movie Clip #${i + 1}`,
    views: `${(Math.random() * 100).toFixed(1)}k views`
  }));

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Activation', path: '/dashboard/wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { label: 'Withdraw', path: '/dashboard/withdraw', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
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
          {user.isAdmin && (
            <Link to="/admin" className="flex items-center px-4 py-3 rounded-2xl transition-all font-bold text-sm bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white shrink-0 md:w-full">
              <svg className="h-5 w-5 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <span className="hidden md:inline">Admin Panel</span>
            </Link>
          )}
        </nav>
        <div className="mt-auto hidden md:block pt-6 border-t border-slate-800">
          <button onClick={() => window.open('https://t.me/royalgate_support', '_blank')} className="w-full flex items-center px-4 py-3 text-blue-400 font-bold hover:bg-blue-500/10 rounded-2xl transition mb-2">
             Support
          </button>
          <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition">
             Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-10 lg:p-14 overflow-y-auto no-scrollbar bg-[#0b1222]">
        {settings.announcement && (
          <div className="mb-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center gap-4">
             <span className="text-xl">📢</span>
             <p className="text-sm font-medium text-blue-400">{settings.announcement}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              <img src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} className="h-14 w-14 rounded-2xl bg-slate-800 border-2 border-blue-600/20" alt="avatar" />
              <div>
                 <h1 className="text-xl font-black text-white">Welcome, {user.username}!</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10">
                  <p className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-widest">Available Balance</p>
                  <p className="text-5xl font-black text-white mb-6">{formatVal(user.balance)}</p>
                  <div className="flex gap-4">
                    <Link to="/dashboard/wallet" className="px-8 py-3 bg-blue-600 rounded-2xl font-black text-sm text-white hover:bg-blue-500 transition">Activation Hub</Link>
                    <Link to="/dashboard/withdraw" className="px-8 py-3 bg-slate-800 rounded-2xl font-black text-sm text-white hover:bg-slate-700 transition">Withdraw</Link>
                  </div>
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

            <div className="flex space-x-2 border-b border-slate-800 pb-2">
               {['HOME', 'QUIZ', 'MUSIC', 'MOVIES'].map(t => (
                 <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2 text-xs font-black transition ${activeTab === t ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500'}`}>{t}</button>
               ))}
            </div>

            {activeTab === 'HOME' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="glass-card p-10 rounded-[3rem] border border-slate-800 relative overflow-hidden group">
                    <h3 className="text-2xl font-black mb-3">Core Node Miner</h3>
                    <p className="text-slate-500 text-sm mb-10">Run the sequence to extract daily blocks.</p>
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
                           alert('Mining Complete!');
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
                 <p className="text-slate-400 font-medium">Earn per correct answer.</p>
                 <div className="p-10 bg-slate-900 rounded-[2.5rem] border border-slate-800 text-left">
                    <p className="text-xl font-bold mb-8">What is the capital of crypto digital assets?</p>
                    <div className="grid grid-cols-1 gap-4">
                       {['Decentralization', 'MetaMask', 'Binance', 'RoyalGate'].map(opt => (
                         <button key={opt} onClick={() => handleEarning(450, 'quiz', 'Quiz Reward')} className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-left font-bold transition">
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
                    <p className="text-slate-500 text-sm font-bold italic">Earnings added ONLY on completion</p>
                 </div>
                 {/* Single Line Listing (Vertical) */}
                 <div className="space-y-3">
                    {SONGS.map(song => {
                      const isActive = activeMedia?.id === song.id && activeMedia?.type === 'song';
                      return (
                        <div key={song.id} className="p-4 glass-card rounded-2xl border border-slate-800 flex flex-col gap-2 group overflow-hidden">
                           <div className="flex justify-between items-center w-full">
                             <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => startPlayback(song.id, 'song')}
                                  className={`h-12 w-12 rounded-xl flex items-center justify-center font-black transition ${isActive && isPlaying ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                >
                                   {isActive && isPlaying ? '⏸' : '▶'}
                                </button>
                                <div>
                                   <p className="text-sm font-bold text-white">{song.title}</p>
                                   <p className="text-[10px] text-slate-500 uppercase tracking-widest">{song.artist}</p>
                                </div>
                             </div>
                             <div className="text-right">
                               <p className="text-[10px] text-slate-600 font-black">{song.duration}</p>
                               <p className="text-xs font-black text-emerald-400">+{formatVal(pkg.songRate)}</p>
                             </div>
                           </div>
                           
                           {isActive && (
                             <div className="w-full mt-2">
                                <div className="flex justify-between text-[9px] font-black uppercase mb-1">
                                  <span className="text-blue-400">Streaming Progress</span>
                                  <span>{Math.floor(activeMedia.progress)}%</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                                   <div className="bg-emerald-500 h-full transition-all duration-300" style={{width: `${activeMedia.progress}%`}}></div>
                                </div>
                             </div>
                           )}
                        </div>
                      );
                    })}
                 </div>
              </div>
            )}

            {activeTab === 'MOVIES' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-black text-purple-500">Cinema Hub</h2>
                    <p className="text-slate-500 text-sm font-bold italic">Earnings added ONLY on completion</p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {VIDEOS.map(vid => {
                      const isActive = activeMedia?.id === vid.id && activeMedia?.type === 'video';
                      return (
                        <div 
                          key={vid.id} 
                          className={`relative group rounded-3xl overflow-hidden border bg-slate-900 cursor-pointer aspect-[9/12] transition-all ${isActive ? 'ring-4 ring-purple-600 border-purple-600' : 'border-slate-800'}`} 
                          onClick={() => startPlayback(vid.id, 'video')}
                        >
                           <img src={`https://picsum.photos/300/400?random=${vid.id + 200}`} className={`w-full h-full object-cover transition duration-700 ${isActive ? 'opacity-30' : 'opacity-60 group-hover:scale-110'}`} alt="thumb" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent flex flex-col justify-end p-5">
                              <p className="text-xs font-black text-white mb-1">{vid.title}</p>
                              <p className="text-[9px] text-purple-400 font-bold uppercase">{vid.views}</p>
                           </div>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              {isActive ? (
                                <div className="w-full px-4 text-center">
                                   <p className="text-[10px] font-black text-white mb-2 uppercase">{isPlaying ? 'WATCHING' : 'PAUSED'}</p>
                                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                      <div className="bg-purple-600 h-full" style={{width: `${activeMedia.progress}%`}}></div>
                                   </div>
                                   <p className="mt-2 text-[10px] font-bold text-purple-400">+{formatVal(pkg.videoRate)}</p>
                                </div>
                              ) : (
                                <div className="h-12 w-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition">
                                   <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                                </div>
                              )}
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
            )}
          </div>
        ) : <Outlet />}
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="glass-card w-full max-w-xl p-10 rounded-[3.5rem] border border-blue-500/20 text-center relative">
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition">✕</button>
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Activation Required</h2>
              <p className="text-slate-400 mb-10 font-medium">To unlock tasks and daily withdrawals, you need a premium package.</p>
              
              <div className="space-y-4 mb-10 text-left">
                 {[MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR].map(tier => (
                    <div key={tier} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex justify-between items-center group hover:border-blue-600 transition cursor-pointer" onClick={() => navigate('/dashboard/wallet')}>
                       <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase">{PACKAGES[tier].name}</p>
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
