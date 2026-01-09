
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface OnboardingPageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ user }) => {
  const navigate = useNavigate();

  const EARNING_METHODS = [
    {
      title: 'Cloud Mining',
      desc: 'Activate daily sequences to extract rewards from our global nodes.',
      icon: '⚡',
      color: 'text-blue-400'
    },
    {
      title: 'Music Streams',
      desc: 'Listen to over 50+ premium tracks and earn per second of audio.',
      icon: '🎵',
      color: 'text-emerald-400'
    },
    {
      title: 'Cinema Hub',
      desc: 'Watch high-quality trailers and movie clips for instant credit.',
      icon: '🎬',
      color: 'text-purple-400'
    },
    {
      title: 'Royal Trivia',
      desc: 'Test your knowledge. Correct answers grant up to ₦1,000 daily.',
      icon: '🏆',
      color: 'text-amber-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header section */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-blue-600/10 text-blue-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Welcome to the Royal Circle
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            Your Wealth, <span className="text-gradient">Redefined.</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            RoyalGate is a multi-layered ecosystem designed to reward your attention and digital activity.
          </p>
        </div>

        {/* Ways to Earn Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EARNING_METHODS.map((method, i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-slate-800 hover:border-blue-500/30 transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform block">{method.icon}</div>
              <h3 className={`text-xl font-black mb-3 ${method.color}`}>{method.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{method.desc}</p>
            </div>
          ))}
        </div>

        {/* Rules & Payouts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[3rem] border border-slate-800">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center">
              <span className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm italic">R</span>
              Platform Guidelines
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">1</div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <strong className="text-slate-200">Integrity First:</strong> Multiple account creation from the same device is strictly prohibited and results in immediate suspension.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">2</div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <strong className="text-slate-200">Daily Resets:</strong> All tasks and mining sessions reset at <span className="text-blue-500 font-bold">00:00 GMT</span>. Unclaimed rewards do not rollover.
                </p>
              </li>
              <li className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">3</div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <strong className="text-slate-200">Withdrawals:</strong> Payouts are processed 24/7 with a minimum threshold of <span className="text-emerald-500 font-bold">₦2,000</span>.
                </p>
              </li>
            </ul>
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-blue-500/10 bg-gradient-to-br from-blue-600/5 to-transparent flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-2xl font-black text-white mb-4">Activation & Growth</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              While the <span className="text-blue-400 font-bold uppercase">Pinck</span> tier allows you to explore the dashboard, premium earning rates and withdrawal features are unlocked upon account activation.
            </p>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 mb-8">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-500 font-bold uppercase tracking-tighter">Min. Payout</span>
                <span className="text-white font-black">₦2,000</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-tighter">Support Response</span>
                <span className="text-blue-400 font-black">&lt; 15 Mins</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 text-lg transform active:scale-[0.98]"
            >
              Enter Dashboard
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            By proceeding, you agree to our Terms of Use and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
