
import React, { useState } from 'react';
import { User, MembershipTier, Transaction } from '../types';
import { PACKAGES } from '../constants';

interface WalletPageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ user, onUpdateUser }) => {
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [processing, setProcessing] = useState(false);

  const tiers = [MembershipTier.LEGACY, MembershipTier.KING, MembershipTier.EMPEROR];

  const handleActivation = (tier: MembershipTier) => {
    setProcessing(true);
    setTimeout(() => {
      const pkg = PACKAGES[tier];
      const activationTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: pkg.price,
        type: 'DEBIT',
        description: `Account Activation (${pkg.name})`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      };
      const bonusTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: pkg.bonus,
        type: 'CREDIT',
        description: `Welcome Bonus (${pkg.name})`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      };

      onUpdateUser({
        ...user,
        tier: tier,
        isActive: true,
        balance: user.balance + pkg.bonus,
        transactions: [bonusTx, activationTx, ...user.transactions]
      });
      setProcessing(false);
      alert(`${pkg.name} Activated Successfully!`);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center max-w-2xl mx-auto space-y-4">
         <h2 className="text-4xl font-black text-white tracking-tight">Activation Hub</h2>
         <p className="text-slate-500 font-medium">Activate your earning streams by selecting a package below. All packages include a welcome bonus and tiered rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {tiers.map(tier => {
           const pkg = PACKAGES[tier];
           const isCurrent = user.tier === tier;
           return (
             <div key={tier} className={`glass-card p-10 rounded-[3.5rem] border transition-all relative overflow-hidden flex flex-col ${selectedTier === tier ? 'border-blue-500 bg-blue-600/5' : 'border-slate-800'}`}>
                {tier === MembershipTier.EMPEROR && (
                   <div className="absolute top-10 -right-10 bg-blue-600 text-white px-12 py-1 rotate-45 text-[10px] font-black uppercase tracking-widest shadow-lg">Premium</div>
                )}
                <h3 className="text-xl font-bold text-slate-300 mb-2">{pkg.name}</h3>
                <div className="text-4xl font-black text-white mb-10">₦{pkg.price.toLocaleString()}</div>
                
                <div className="space-y-4 mb-12 flex-1">
                   {pkg.benefits.map((b, i) => (
                      <div key={i} className="flex items-center text-sm font-medium text-slate-400">
                         <svg className="h-4 w-4 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                         {b}
                      </div>
                   ))}
                </div>

                <button 
                  disabled={processing || isCurrent}
                  onClick={() => handleActivation(tier)}
                  className={`w-full py-4 rounded-2xl font-black text-lg transition shadow-xl ${
                    isCurrent ? 'bg-emerald-600 text-white cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-blue-50'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : processing ? 'Activating...' : 'Activate Now'}
                </button>
             </div>
           );
         })}
      </div>

      <div className="glass-card p-10 rounded-[3rem] border border-slate-800 bg-slate-900/50">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <h4 className="text-xl font-black text-white mb-1">Need a custom deposit?</h4>
               <p className="text-slate-500 text-sm">Contact customer service for manual wallet funding.</p>
            </div>
            <button onClick={() => window.open('https://t.me/royalgate_support', '_blank')} className="px-10 py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-700 transition border border-slate-700">Contact Support</button>
         </div>
      </div>
    </div>
  );
};

export default WalletPage;
