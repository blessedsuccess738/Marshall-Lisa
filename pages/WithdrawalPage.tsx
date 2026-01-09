
import React, { useState } from 'react';
import { User, Transaction, SystemSettings, WithdrawalRequest } from '../types';

interface WithdrawalPageProps {
  user: User;
  settings: SystemSettings;
  onUpdateUser: (user: User) => void;
  onAddWithdrawal: (req: WithdrawalRequest) => void;
}

const WithdrawalPage: React.FC<WithdrawalPageProps> = ({ user, settings, onUpdateUser, onAddWithdrawal }) => {
  const [formData, setFormData] = useState({
    amount: '',
    accountNumber: '',
    accountName: '',
    bankName: ''
  });
  const [processing, setProcessing] = useState(false);

  const NIGERIAN_BANKS = [
    'Access Bank', 'GTBank', 'Zenith Bank', 'UBA', 'First Bank', 'Stanbic IBTC', 'Fidelity Bank', 'Wema Bank', 'OPay', 'Kuda Bank', 'Palmpay'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.withdrawalOpen) {
      alert("Withdrawal portal is currently closed. Please check back later.");
      return;
    }

    const amountNum = parseFloat(formData.amount);

    if (amountNum < 2000) {
      alert('Minimum withdrawal is ₦2,000');
      return;
    }

    if (amountNum > user.balance) {
      alert('Insufficient balance');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      const withdrawalId = Math.random().toString(36).substr(2, 9);
      
      const newWithdrawal: WithdrawalRequest = {
        id: withdrawalId,
        userId: user.id,
        username: user.username,
        amount: amountNum,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        status: 'PENDING',
        timestamp: new Date().toISOString()
      };

      const newTx: Transaction = {
        id: withdrawalId,
        amount: amountNum,
        type: 'DEBIT',
        description: `Withdrawal to ${formData.bankName} (${formData.accountNumber})`,
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      };

      onAddWithdrawal(newWithdrawal);
      onUpdateUser({
        ...user,
        balance: user.balance - amountNum,
        transactions: [newTx, ...user.transactions]
      });

      setProcessing(false);
      setFormData({ amount: '', accountNumber: '', accountName: '', bankName: '' });
      alert('Withdrawal request submitted! Verification takes < 15 mins.');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Withdrawal Hub</h2>
            <p className="text-slate-500 font-medium">Payouts are processed 24/7 to all Nigerian banks.</p>
         </div>
         <div className="glass-card px-8 py-5 rounded-3xl border border-blue-500/10">
            <p className="text-[10px] font-black text-blue-400 uppercase mb-1 tracking-widest">Withdrawable Balance</p>
            <p className="text-3xl font-black text-white">₦{user.balance.toLocaleString()}</p>
         </div>
      </div>

      {!settings.withdrawalOpen && (
        <div className="p-8 bg-red-600/10 border border-red-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
           <div className="text-4xl">🚧</div>
           <div>
              <h3 className="text-xl font-black text-white mb-1">Withdrawal Portal Closed</h3>
              <p className="text-slate-400 text-sm font-medium">{settings.withdrawalMessage}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 glass-card p-10 rounded-[3rem] border border-slate-800 transition-opacity ${!settings.withdrawalOpen ? 'opacity-50 pointer-events-none' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Amount (₦)</label>
              <input 
                required 
                type="number" 
                placeholder="2,000.00" 
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white font-black text-xl outline-none focus:ring-1 focus:ring-blue-500 transition" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Account Name</label>
                <input 
                  required 
                  placeholder="John Doe" 
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 focus:ring-blue-500 transition" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Account Number</label>
                <input 
                  required 
                  type="text" 
                  maxLength={10}
                  placeholder="0123456789" 
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 focus:ring-blue-500 transition font-mono" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Receiving Bank</label>
              <select 
                required 
                value={formData.bankName}
                onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 focus:ring-blue-500 transition appearance-none"
              >
                <option value="">Select Bank</option>
                {NIGERIAN_BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
              </select>
            </div>

            <button 
              disabled={processing || !formData.amount || !settings.withdrawalOpen}
              type="submit" 
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-lg transition shadow-xl shadow-blue-500/10 active:scale-95 transform"
            >
              {processing ? 'Submitting Request...' : 'Confirm Withdrawal'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border border-emerald-500/10 bg-emerald-500/5">
            <h3 className="text-sm font-black text-emerald-500 mb-4 uppercase tracking-widest">Payout Status</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {settings.withdrawalOpen ? "System is active. Requests are usually audited and paid within 15 minutes." : settings.withdrawalMessage}
            </p>
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full animate-pulse ${settings.withdrawalOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className={`text-[10px] font-black uppercase ${settings.withdrawalOpen ? 'text-emerald-500' : 'text-red-500'}`}>
                {settings.withdrawalOpen ? 'System Active' : 'Portal Closed'}
              </span>
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800">
            <h3 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Notice</h3>
            <p className="text-slate-500 text-xs italic">
              Ensure account details match your registered name to avoid verification delays. Use our Telegram support if you have issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPage;
