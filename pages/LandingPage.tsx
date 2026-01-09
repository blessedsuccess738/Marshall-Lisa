
import React from 'react';
import { Link } from 'react-router-dom';
import { PACKAGES } from '../constants';
import { MembershipTier } from '../types';

const LandingPage: React.FC = () => {
  const tiers = [MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Navbar */}
      <nav className="fixed top-0 w-full glass-card z-50 px-6 py-5 flex justify-between items-center border-b border-slate-800">
        <div className="text-2xl font-black text-blue-500 flex items-center tracking-tighter">
          <span className="bg-blue-600 text-white p-1.5 rounded-lg mr-2 text-sm italic">RG</span>
          RoyalGate
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-slate-400 font-bold hover:text-white transition text-sm">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-black text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-24 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-block bg-blue-600/10 text-blue-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-blue-500/10">
          Digital Reward Ecosystem 2025
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
          Earning Made <br /><span className="text-gradient">Royal.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
          Join the elite circle of 50,000+ members who turn their attention into digital assets. Mining, Music, and Movies—all in one hub.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link to="/register" className="bg-white text-slate-900 px-12 py-5 rounded-[2rem] text-lg font-black shadow-2xl hover:scale-105 transition-all w-full sm:w-auto">
            Get Started Now
          </Link>
          <div className="flex items-center gap-4 bg-slate-800/50 p-2 pr-6 rounded-full border border-slate-700">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-slate-900 object-cover" src={`https://picsum.photos/100/100?random=${i + 40}`} alt="user" />
              ))}
            </div>
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">50k+ Members</span>
          </div>
        </div>
      </section>

      {/* Tiers / Value Props */}
      <section className="py-24 bg-[#0b1222]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl font-black text-white tracking-tight">Our Platform Rules</h2>
             <p className="text-slate-500 font-medium">Built on transparency and consistency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-[3rem] border border-slate-800 text-center">
               <div className="h-16 w-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl">🛡️</div>
               <h3 className="text-xl font-black text-white mb-4 tracking-tight">Zero Multi-Acc</h3>
               <p className="text-slate-500 text-sm leading-relaxed font-medium">We maintain ecosystem balance by enforcing a strict one-user, one-account policy. Security is our priority.</p>
            </div>
            <div className="glass-card p-10 rounded-[3rem] border border-slate-800 text-center">
               <div className="h-16 w-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl">💰</div>
               <h3 className="text-xl font-black text-white mb-4 tracking-tight">Rapid Payouts</h3>
               <p className="text-slate-500 text-sm leading-relaxed font-medium">Reach ₦2,000 and withdraw instantly. No long waiting periods. We process verified requests within 15 minutes.</p>
            </div>
            <div className="glass-card p-10 rounded-[3rem] border border-slate-800 text-center">
               <div className="h-16 w-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl">🎮</div>
               <h3 className="text-xl font-black text-white mb-4 tracking-tight">Gamified Income</h3>
               <p className="text-slate-500 text-sm leading-relaxed font-medium">Earn through Mining Nodes, Music playlists, and Movie trailers. It's not work—it's a lifestyle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-black text-slate-500 uppercase tracking-[0.2em] mb-12">₦500M+ Already Paid Out</h2>
          <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale invert brightness-200">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Paystack_Logo.png" alt="Paystack" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Flutterwave_Logo.png" alt="Flutterwave" className="h-8" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50 bg-[#0b1222]">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-black text-blue-500 flex items-center">
              RG RoyalGate
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
               <a href="#" className="hover:text-white transition">Privacy</a>
               <a href="#" className="hover:text-white transition">Terms</a>
               <a href="#" className="hover:text-white transition">Support</a>
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
               © 2025 RoyalGate Pro Systems.
            </p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
