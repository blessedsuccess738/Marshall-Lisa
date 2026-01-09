
import React, { useState } from 'react';
import { User, Transaction, Currency } from '../types';
import { NGN_TO_USD } from '../constants';

interface WalletPageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ user, onUpdateUser }) => {
  const [tab, setTab] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [processing, setProcessing] = useState(false);
  const [dispCurrency] = useState<Currency>('NGN'); // Default to NGN in wallet for clarity

  const format = (v: number) => `₦${v.toLocaleString()}`;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const val = parseFloat(amount);
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: val,
        type: 'CREDIT',
        description: `Deposit via ${method}`,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS'
      };
      onUpdateUser({
        ...user,
        balance: user.balance + val,
        transactions: [newTx, ...user.transactions]
      });
      setProcessing(false);
      setAmount('');
      alert('Deposit successful!');
    }, 2000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > user.balance) return alert('Insufficient funds');
    if (val < 2000) return alert('Min withdrawal ₦2,000');
    setProcessing(true);
    setTimeout(() => {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: val,
        type: 'DEBIT',
        description: `Withdrawal Request`,
        timestamp: new Date().toISOString(),
        status: 'PENDING'
      };
      onUpdateUser({
        ...user,
        balance: user.balance - val,
        transactions: [newTx, ...user.transactions]
      });
      setProcessing(false);
      setAmount('');
      alert('Withdrawal queued for approval');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <h2 className="text-4xl font-black text-white">Wallet Hub</h2>
            <p className="text-slate-500">Manage deposits and withdraw assets.</p>
         </div>
         <div className="glass-card px-8 py-4 rounded-3xl border border-blue-500/10">
            <p className="text-[10px] font-black text-blue-400 uppercase mb-1 tracking-widest">Main Wallet</p>
            <p className="text-3xl font-black text-white">{format(user.balance)}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border border-slate-800">
           <div className="flex bg-slate-900 p-1.5 rounded-2xl mb-10 w-fit">
              <button onClick={() => setTab('DEPOSIT')} className={`px-8 py-2.5 rounded-xl text-xs font-black transition ${tab === 'DEPOSIT' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Deposit</button>
              <button onClick={() => setTab('WITHDRAW')} className={`px-8 py-2.5 rounded-xl text-xs font-black transition ${tab === 'WITHDRAW' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>Withdraw</button>
           </div>

           <form onSubmit={tab === 'DEPOSIT' ? handleDeposit : handleWithdraw} className="space-y-8">
              <div>
                 <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Amount (₦)</label>
                 <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl text-3xl font-black text-white outline-none focus:ring-1 focus:ring-blue-500 transition" />
              </div>

              <div>
                 <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Payout Method</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['BANK_TRANSFER', 'DEBIT_CARD', 'USDT'].map(m => (
                      <div key={m} onClick={() => setMethod(m)} className={`p-4 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${method === m ? 'border-blue-500 bg-blue-500/5 text-blue-400' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                         <div className={`h-2 w-2 rounded-full ${method === m ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                         <span className="text-xs font-bold uppercase">{m.replace('_', ' ')}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <button disabled={processing || !amount} type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-lg transition shadow-xl shadow-blue-500/10">
                 {processing ? 'Processing...' : `Confirm ${tab}`}
              </button>
           </form>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800">
              <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest">Transfer Limits</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Min. Deposit</span>
                    <span className="text-slate-300 font-bold">₦1,000</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Min. Withdrawal</span>
                    <span className="text-slate-300 font-bold">₦2,000</span>
                 </div>
                 <div className="flex justify-between text-xs border-t border-slate-800 pt-4">
                    <span className="text-slate-500">Network Fee</span>
                    <span className="text-emerald-400 font-bold">₦0.00</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
