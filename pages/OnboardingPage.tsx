
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MembershipTier, Transaction } from '../types';
import { PACKAGES } from '../constants';

interface OnboardingPageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [processing, setProcessing] = useState(false);

  const tiers = [MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR];

  const handlePayment = (tier: MembershipTier) => {
    setProcessing(true);
    setSelectedTier(tier);
    
    setTimeout(() => {
      const pkg = PACKAGES[tier];
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: pkg.price,
        type: 'DEBIT',
        description: `Account Activation (${pkg.name})`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      };
      const welcomeBonus: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: pkg.bonus,
        type: 'CREDIT',
        description: `Welcome Bonus (${pkg.name})`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      };

      const updatedUser: User = {
        ...user,
        tier: tier,
        balance: user.balance + pkg.bonus,
        isActive: true,
        transactions: [welcomeBonus, newTx, ...user.transactions]
      };
      onUpdateUser(updatedUser);
      setProcessing(false);
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black text-white">Activate Your <span className="text-gradient">Empire</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium">Select a tier to unlock cloud mining, high-paying tasks, and your instant sign-up bonus.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map(tier => {
            const pkg = PACKAGES[tier];
            return (
              <div key={tier} className={`glass-card p-10 rounded-[3rem] border transition-all flex flex-col relative overflow-hidden group ${selectedTier === tier ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
                {tier === MembershipTier.EMPEROR && (
                  <div className="absolute top-8 -right-8 bg-blue-600 text-white px-10 py-1 rotate-45 text-[10px] font-black uppercase tracking-widest shadow-lg">Popular</div>
                )}
                
                <h3 className="text-xl font-bold text-slate-300 mb-2">{pkg.name}</h3>
                <div className="text-5xl font-black text-white mb-8">₦{pkg.price.toLocaleString()}</div>
                
                <div className="space-y-5 mb-10 flex-1">
                  {pkg.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center text-slate-400 text-sm font-medium">
                      <svg className="h-4 w-4 text-blue-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      {benefit}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handlePayment(tier)}
                  disabled={processing}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition shadow-xl group-hover:scale-[1.02] ${
                    selectedTier === tier && processing ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-blue-50'
                  }`}
                >
                  {selectedTier === tier && processing ? 'Processing...' : `Get Started`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
           <button onClick={() => navigate('/dashboard')} className="text-slate-500 font-bold hover:text-slate-300 transition underline underline-offset-4">Explore Dashboard First</button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
