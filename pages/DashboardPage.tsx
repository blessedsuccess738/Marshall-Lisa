
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { User, MembershipTier, Transaction, Currency, SystemSettings, Song, QuizQuestion } from '../types';
import { PACKAGES, NGN_TO_USD } from '../constants';

const VIDEOS = [
  { id: 1, title: 'Marvel: Secret Wars Trailer', views: '2.4M Views' },
  { id: 2, title: 'The Witcher: Season 4 Teaser', views: '1.1M Views' },
  { id: 3, title: 'GTA VI: Official Trailer 1', views: '150M Views' },
  { id: 4, title: 'Dune: Part Two - Final Trailer', views: '900K Views' },
  { id: 5, title: 'Interstellar: 10th Anniversary', views: '4.2M Views' }
];

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
  const [activeTab, setActiveTab] = useState<'HOME' | 'TASKS' | 'WALLET' | 'TEAM' | 'PROFILE'>('HOME');
  const [taskSubTab, setTaskSubTab] = useState<'MUSIC' | 'QUIZ' | 'MOVIES'>('MUSIC');
  
  // Mining Logic
  const [miningTimeLeft, setMiningTimeLeft] = useState<number | null>(null);

  // Spin Wheel Logic
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);

  // Audio Playback
  const [activeMedia, setActiveMedia] = useState<{ id: string; type: 'song' | 'video'; progress: number; currentTime: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Quiz States
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const quizSections = Array.from(new Set(settings.quizQuestions.map(q => q.section)));
  const [activeQuizSection, setActiveQuizSection] = useState(quizSections[0] || 'General');

  const pkg = PACKAGES[user.tier];
  const isFree = user.tier === MembershipTier.PINCK;
  const isHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  const sectionQuestions = settings.quizQuestions.filter(q => q.section === activeQuizSection);

  // Sync activeTab with location
  useEffect(() => {
    if (location.pathname.includes('wallet')) setActiveTab('WALLET');
    else if (location.pathname.includes('withdraw')) setActiveTab('WALLET');
    else if (location.pathname.includes('team')) setActiveTab('TEAM');
    else if (location.pathname.includes('settings')) setActiveTab('PROFILE');
    else if (isHome) setActiveTab('HOME');
  }, [location.pathname, isHome]);

  // Mining Timer Effect
  useEffect(() => {
    let interval: number;
    if (user.miningState.lastStartedAt) {
      const startTime = new Date(user.miningState.lastStartedAt).getTime();
      const endTime = startTime + (24 * 60 * 60 * 1000); 

      interval = window.setInterval(() => {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
          if (!user.miningState.isClaimable) {
            onUpdateUser({ ...user, miningState: { ...user.miningState, isClaimable: true } });
          }
          setMiningTimeLeft(0);
          clearInterval(interval);
        } else {
          setMiningTimeLeft(diff);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [user.miningState.lastStartedAt, user.miningState.isClaimable]);

  const startMining = () => {
    if (isFree) return setShowUpgradeModal(true);
    onUpdateUser({
      ...user,
      miningState: { lastStartedAt: new Date().toISOString(), isClaimable: false }
    });
  };

  const claimMining = () => {
    const claimAmount = 2000;
    handleEarning(claimAmount, 'mining', 'Daily Mining Claim Reward');
    onUpdateUser({
      ...user,
      balance: user.balance + claimAmount,
      miningState: { lastStartedAt: null, isClaimable: false }
    });
    setMiningTimeLeft(null);
    alert(`Success! ₦${claimAmount.toLocaleString()} added to your balance.`);
  };

  const handleSpin = () => {
    if (isFree) return setShowUpgradeModal(true);
    if (user.dailySpinClaimed) {
      alert("You have already claimed your daily spin!");
      return;
    }
    setIsSpinning(true);
    setTimeout(() => {
      const outcomes = [100, 200, 500, 1000, 2000, 5000];
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      setSpinResult(result);
      setIsSpinning(false);
      handleEarning(result, 'mining', `Daily Lucky Spin Winner: ₦${result}`);
      onUpdateUser({ ...user, balance: user.balance + result, dailySpinClaimed: true });
      alert(`🎉 Congratulations! You won ₦${result.toLocaleString()}`);
    }, 3000);
  };

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  // Audio Logic
  useEffect(() => {
    if (activeMedia?.type === 'song') {
      const song = settings.songs.find(s => s.id === activeMedia.id);
      if (song) {
        if (!audioRef.current) audioRef.current = new Audio(song.url);
        else if (audioRef.current.src !== song.url) audioRef.current.src = song.url;

        audioRef.current.currentTime = activeMedia.currentTime || 0;

        const handleTimeUpdate = () => {
          if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setActiveMedia(prev => prev ? { ...prev, progress, currentTime: audioRef.current!.currentTime } : null);
          }
        };

        const handleEnded = () => {
          handleCompletion(activeMedia.id, 'song');
          setIsPlaying(false);
        };

        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('ended', handleEnded);

        if (isPlaying) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();

        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.removeEventListener('ended', handleEnded);
          }
        };
      }
    } else if (audioRef.current) audioRef.current.pause();
  }, [activeMedia?.id, isPlaying, settings.songs]);

  const startPlayback = (id: string, type: 'song' | 'video') => {
    if (isFree) return setShowUpgradeModal(true);
    if (activeMedia?.id === id && activeMedia?.type === type) setIsPlaying(!isPlaying);
    else {
      setActiveMedia({ id, type, progress: 0, currentTime: 0 });
      setIsPlaying(true);
    }
  };

  const handleCompletion = (id: string, type: 'song' | 'video') => {
    const amount = type === 'song' ? pkg.songRate : pkg.videoRate;
    handleEarning(amount, type === 'song' ? 'songs' : 'videos', `${type === 'song' ? 'Stream' : 'Movie'} Reward`);
    setActiveMedia(null);
  };

  const handleQuizAnswer = (selected: string) => {
    if (isFree) return setShowUpgradeModal(true);
    const question = sectionQuestions[currentQuizIndex];
    if (selected === question.correctAnswer) {
      handleEarning(question.reward, 'quiz', `Quiz Correct: ${question.question}`);
      alert(`Correct! +₦${question.reward}`);
    } else {
      const penalty = question.reward;
      const penaltyTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: penalty, type: 'DEBIT', description: `Quiz Penalty: Wrong answer`,
        timestamp: new Date().toISOString(), status: 'SUCCESS'
      };
      onUpdateUser({
        ...user,
        balance: Math.max(0, user.balance - penalty),
        transactions: [penaltyTx, ...user.transactions]
      });
      alert(`Wrong answer! -₦${penalty} deducted.`);
    }
    if (currentQuizIndex < sectionQuestions.length - 1) setCurrentQuizIndex(prev => prev + 1);
    else {
      alert("Section complete!");
      setCurrentQuizIndex(0);
    }
  };

  const formatVal = (val: number) => {
    if (currency === 'USD') return `$${(val / NGN_TO_USD).toFixed(2)}`;
    return `₦${val.toLocaleString()}`;
  };

  const handleEarning = (amount: number, type: 'quiz' | 'songs' | 'videos' | 'mining', desc: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount, type: 'CREDIT', description: desc,
      timestamp: new Date().toISOString(), status: 'SUCCESS'
    };
    onUpdateUser({
      ...user,
      balance: user.balance + amount,
      transactions: [newTx, ...user.transactions],
      dailyEarnings: { ...user.dailyEarnings, [type]: user.dailyEarnings[type as keyof typeof user.dailyEarnings] + (type === 'quiz' ? 0 : 1) }
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col pb-24 font-sans">
      {/* Top Header */}
      <div className="p-6 flex justify-between items-center sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
           <img src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} className="h-10 w-10 rounded-full border border-blue-500/20" alt="av" />
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Welcome,</p>
              <h1 className="text-sm font-black text-white">{user.username} 👑</h1>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setCurrency('NGN')} className={`px-2 py-1 text-[8px] font-black rounded ${currency === 'NGN' ? 'bg-blue-600' : 'bg-slate-800'}`}>NGN</button>
           <button onClick={() => setCurrency('USD')} className={`px-2 py-1 text-[8px] font-black rounded ${currency === 'USD' ? 'bg-blue-600' : 'bg-slate-800'}`}>USD</button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto no-scrollbar max-w-2xl mx-auto w-full">
        {activeTab === 'HOME' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Main Balance Card */}
             <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-900 border-none shadow-2xl shadow-blue-500/20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">👑</div>
                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2">Total Balance Available</p>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-8">{formatVal(user.balance)}</h2>
                <div className="flex gap-3 justify-center">
                   <Link to="/dashboard/wallet" className="px-6 py-3 bg-white text-blue-900 rounded-2xl font-black text-xs">Activation</Link>
                   <Link to="/dashboard/withdraw" className="px-6 py-3 bg-blue-500/30 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xs">Withdraw 🏦</Link>
                </div>
             </div>

             {/* Quick Stats Grid */}
             <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-3xl border border-slate-800">
                   <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Referrals</p>
                   <p className="text-xl font-black text-white">{user.referrals.length} <span className="text-[10px] text-emerald-500">Active</span></p>
                </div>
                <div className="glass-card p-5 rounded-3xl border border-slate-800">
                   <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Current Tier</p>
                   <p className="text-xl font-black text-blue-500">{user.tier}</p>
                </div>
             </div>

             {/* Spin Wheel Card */}
             <div className="glass-card p-8 rounded-[3rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent text-center">
                <h3 className="text-xl font-black text-amber-500 mb-2">Daily Lucky Spin 🎡</h3>
                <p className="text-slate-500 text-xs mb-6">Win up to ₦5,000 every single day!</p>
                
                {user.dailySpinClaimed ? (
                  <div className="py-6 px-10 bg-slate-900/50 rounded-2xl border border-slate-800">
                     <p className="text-slate-500 font-bold italic text-sm">Next spin available in 24hrs.</p>
                  </div>
                ) : (
                  <button 
                    disabled={isSpinning}
                    onClick={handleSpin}
                    className={`w-full py-5 rounded-[2rem] font-black text-white shadow-xl transition-all ${isSpinning ? 'bg-slate-800' : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'}`}
                  >
                    {isSpinning ? '🎡 SPINNING...' : 'SPIN NOW'}
                  </button>
                )}
             </div>

             {/* Mining Card */}
             <div className="glass-card p-8 rounded-[3rem] border border-slate-800 relative overflow-hidden">
                <h3 className="text-xl font-black mb-1">Core Mining Node ⚡</h3>
                <p className="text-slate-500 text-xs mb-6">Claim your ₦2,000 block reward.</p>
                
                {user.miningState.isClaimable ? (
                  <button onClick={claimMining} className="w-full py-5 bg-emerald-600 rounded-[2.5rem] font-black text-white animate-pulse">
                     Claim ₦2,000 Reward 💰
                  </button>
                ) : user.miningState.lastStartedAt ? (
                  <div className="text-center space-y-4">
                     <p className="text-3xl font-black text-white font-mono tracking-widest">{formatTime(miningTimeLeft || 0)}</p>
                     <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-1000" style={{width: `${100 - ((miningTimeLeft || 0) / (24 * 60 * 60 * 10))}%`}}></div>
                     </div>
                     <p className="text-[10px] text-slate-600 font-bold uppercase">Mining in progress...</p>
                  </div>
                ) : (
                  <button onClick={startMining} className="w-full py-5 bg-blue-600 rounded-[2.5rem] font-black text-white">
                     Start Mining Sequence
                  </button>
                )}
             </div>
          </div>
        )}

        {activeTab === 'TASKS' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
             <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                {['MUSIC', 'QUIZ', 'MOVIES'].map(t => (
                  <button key={t} onClick={() => setTaskSubTab(t as any)} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition ${taskSubTab === t ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{t}</button>
                ))}
             </div>

             {taskSubTab === 'MUSIC' && (
                <div className="space-y-3">
                   {settings.songs.map(song => {
                     const isActive = activeMedia?.id === song.id && activeMedia?.type === 'song';
                     return (
                       <div key={song.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <button onClick={() => startPlayback(song.id, 'song')} className={`h-11 w-11 rounded-xl flex items-center justify-center text-lg transition ${isActive && isPlaying ? 'bg-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                   {isActive && isPlaying ? '⏸' : '▶'}
                                </button>
                                <div>
                                   <p className="text-sm font-bold text-white">{song.title}</p>
                                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{song.artist}</p>
                                </div>
                             </div>
                             <p className="text-xs font-black text-emerald-500">+{formatVal(pkg.songRate)}</p>
                          </div>
                          {isActive && (
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                               <div className="bg-emerald-500 h-full transition-all duration-300" style={{width: `${activeMedia.progress}%`}}></div>
                            </div>
                          )}
                       </div>
                     );
                   })}
                </div>
             )}

             {taskSubTab === 'QUIZ' && (
                <div className="space-y-8">
                   <div className="text-center p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem]">
                      <h3 className="text-xl font-black text-amber-500 mb-1">High-Stakes Trivia 🏆</h3>
                      <p className="text-[10px] text-red-500 font-bold uppercase italic">Penalty logic: Wrong answers deduct balance!</p>
                   </div>
                   {sectionQuestions.length > 0 ? (
                      <div className="space-y-6">
                         <div className="flex justify-between px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Question {currentQuizIndex+1}/{sectionQuestions.length}</span>
                            <span className="text-emerald-500">₦{sectionQuestions[currentQuizIndex].reward} Reward</span>
                         </div>
                         <p className="text-xl font-bold text-white leading-tight px-2">{sectionQuestions[currentQuizIndex].question}</p>
                         <div className="grid grid-cols-1 gap-3">
                            {sectionQuestions[currentQuizIndex].options.map(opt => (
                               <button key={opt} onClick={() => handleQuizAnswer(opt)} className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-left font-bold transition">
                                  {opt}
                               </button>
                            ))}
                         </div>
                      </div>
                   ) : <p className="text-center text-slate-600 italic">No questions active.</p>}
                </div>
             )}

             {taskSubTab === 'MOVIES' && (
                <div className="grid grid-cols-2 gap-4">
                   {VIDEOS.map(vid => (
                      <div key={vid.id} className="relative aspect-[9/12] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group" onClick={() => startPlayback(vid.id.toString(), 'video')}>
                         <img src={`https://picsum.photos/300/400?random=${vid.id + 77}`} className="w-full h-full object-cover opacity-60 transition group-hover:scale-105" alt="v" />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 p-4 flex flex-col justify-end">
                            <p className="text-[10px] font-black text-white mb-1">{vid.title}</p>
                            <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">{vid.views}</p>
                         </div>
                         <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md h-7 w-7 rounded-full flex items-center justify-center text-[10px]">▶</div>
                      </div>
                   ))}
                </div>
             )}
          </div>
        )}

        {/* Render nested routes for Wallet/Team/Settings */}
        {['WALLET', 'TEAM', 'PROFILE'].includes(activeTab) && <Outlet />}
      </div>

      {/* Bottom Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent pointer-events-none">
         <div className="max-w-md mx-auto glass-card rounded-[2.5rem] p-2 flex justify-around items-center border border-white/5 shadow-2xl pointer-events-auto">
            <button onClick={() => { navigate('/dashboard'); setActiveTab('HOME'); }} className={`flex flex-col items-center p-3 rounded-2xl transition ${activeTab === 'HOME' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
               <span className="text-xl">🏠</span>
               <span className="text-[8px] font-black uppercase mt-1">Home</span>
            </button>
            <button onClick={() => { setActiveTab('TASKS'); }} className={`flex flex-col items-center p-3 rounded-2xl transition ${activeTab === 'TASKS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
               <span className="text-xl">🎵</span>
               <span className="text-[8px] font-black uppercase mt-1">Tasks</span>
            </button>
            <button onClick={() => { navigate('/dashboard/withdraw'); setActiveTab('WALLET'); }} className={`flex flex-col items-center p-3 rounded-2xl transition ${activeTab === 'WALLET' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
               <span className="text-xl">🏦</span>
               <span className="text-[8px] font-black uppercase mt-1">Wallet</span>
            </button>
            <button onClick={() => { navigate('/dashboard/team'); setActiveTab('TEAM'); }} className={`flex flex-col items-center p-3 rounded-2xl transition ${activeTab === 'TEAM' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
               <span className="text-xl">👥</span>
               <span className="text-[8px] font-black uppercase mt-1">Team</span>
            </button>
            <button onClick={() => { navigate('/dashboard/settings'); setActiveTab('PROFILE'); }} className={`flex flex-col items-center p-3 rounded-2xl transition ${activeTab === 'PROFILE' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
               <span className="text-xl">⚙️</span>
               <span className="text-[8px] font-black uppercase mt-1">Profile</span>
            </button>
         </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in">
           <div className="glass-card w-full max-w-sm p-8 rounded-[3.5rem] border border-blue-500/20 text-center relative">
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-6 right-6 text-slate-500">✕</button>
              <h2 className="text-3xl font-black text-white mb-6">Upgrade Plan 👑</h2>
              <div className="space-y-4">
                 {[MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR].map(tier => (
                    <div key={tier} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex justify-between items-center group transition cursor-pointer hover:border-blue-500" onClick={() => navigate('/dashboard/wallet')}>
                       <div className="text-left">
                          <p className="text-[9px] font-black text-blue-500 uppercase">{PACKAGES[tier].name}</p>
                          <p className="text-sm font-black text-white">₦{PACKAGES[tier].price.toLocaleString()}</p>
                       </div>
                       <span className="text-[10px] font-bold text-slate-500">Select Plan →</span>
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
