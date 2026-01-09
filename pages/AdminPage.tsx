
import React, { useState } from 'react';
import { User, WithdrawalRequest, SystemSettings, MembershipTier } from '../types';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

interface AdminPageProps {
  user: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  withdrawals: WithdrawalRequest[];
  setWithdrawals: React.Dispatch<React.SetStateAction<WithdrawalRequest[]>>;
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  onLogout: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  user, users, setUsers, withdrawals, setWithdrawals, settings, setSettings, onLogout 
}) => {
  const [activeView, setActiveView] = useState<'WITHDRAWALS' | 'USERS' | 'SETTINGS'>('WITHDRAWALS');

  const handleWithdrawalAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  const deleteWithdrawal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setWithdrawals(prev => prev.filter(w => w.id !== id));
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === user.id) {
      alert("You cannot delete yourself.");
      return;
    }
    if (window.confirm('Permanently delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const toggleWithdrawal = () => {
    setSettings(prev => ({ ...prev, withdrawalOpen: !prev.withdrawalOpen }));
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-slate-200 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6">
        <div className="text-2xl font-black text-blue-500 mb-10 flex items-center">
           🛡️ RoyalAdmin
        </div>
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveView('WITHDRAWALS')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeView === 'WITHDRAWALS' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            Withdrawals
          </button>
          <button 
            onClick={() => setActiveView('USERS')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeView === 'USERS' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            User Manager
          </button>
          <button 
            onClick={() => setActiveView('SETTINGS')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeView === 'SETTINGS' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            System Control
          </button>
          <Link to="/dashboard" className="block px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800">
            User Dashboard
          </Link>
        </nav>
        <button onClick={onLogout} className="mt-auto w-full py-4 bg-red-600/10 text-red-500 font-bold rounded-xl hover:bg-red-600 hover:text-white transition">
          Log Out
        </button>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto no-scrollbar">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white">System Control Panel</h1>
          <p className="text-slate-500 font-medium">Managing platform stability and payouts.</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Users</p>
            <p className="text-3xl font-black text-white">{users.length}</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pending Requests</p>
            <p className="text-3xl font-black text-amber-500">{withdrawals.filter(w => w.status === 'PENDING').length}</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Portal Status</p>
            <p className={`text-2xl font-black ${settings.withdrawalOpen ? 'text-emerald-500' : 'text-red-500'}`}>
              {settings.withdrawalOpen ? 'OPEN' : 'CLOSED'}
            </p>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Platform Revenue</p>
            <p className="text-3xl font-black text-blue-500">₦{(users.reduce((acc, u) => acc + u.balance, 0)).toLocaleString()}</p>
          </div>
        </div>

        {activeView === 'WITHDRAWALS' && (
          <div className="glass-card rounded-[2.5rem] border border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black">Withdrawal Hub</h2>
              <span className="bg-slate-800 px-4 py-1 rounded-full text-[10px] font-black">{withdrawals.length} Total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Bank Details</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {withdrawals.map(w => (
                    <tr key={w.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-8 py-5">
                        <p className="font-bold text-white">@{w.username}</p>
                        <p className="text-[10px] text-slate-500">{new Date(w.timestamp).toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-5 font-black text-emerald-500">₦{w.amount.toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-300">{w.bankName}</p>
                        <p className="text-xs text-slate-500">{w.accountNumber} - {w.accountName}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${
                          w.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' :
                          w.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right space-x-3">
                        {w.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleWithdrawalAction(w.id, 'APPROVED')} className="text-xs font-black text-emerald-500 hover:underline">Approve</button>
                            <button onClick={() => handleWithdrawalAction(w.id, 'REJECTED')} className="text-xs font-black text-red-500 hover:underline">Reject</button>
                          </>
                        )}
                        <button onClick={() => deleteWithdrawal(w.id)} className="text-xs font-black text-slate-500 hover:text-white">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {withdrawals.length === 0 && <p className="p-12 text-center text-slate-500 italic">No withdrawal requests found.</p>}
            </div>
          </div>
        )}

        {activeView === 'USERS' && (
          <div className="glass-card rounded-[2.5rem] border border-slate-800 overflow-hidden">
             <div className="p-8 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Identity</th>
                    <th className="px-8 py-4">Tier</th>
                    <th className="px-8 py-4">Balance</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-8 py-5">
                        <p className="font-bold text-white">{u.fullName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </td>
                      <td className="px-8 py-5">
                         <span className="bg-blue-500/10 text-blue-400 text-[10px] px-3 py-1 rounded-full font-black uppercase">{u.tier}</span>
                      </td>
                      <td className="px-8 py-5 font-black text-white">₦{u.balance.toLocaleString()}</td>
                      <td className="px-8 py-5 text-right">
                         <button onClick={() => deleteUser(u.id)} className="text-xs font-black text-red-400 hover:text-red-500 transition">Delete User</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'SETTINGS' && (
          <div className="max-w-2xl space-y-8">
            <div className="glass-card p-10 rounded-[3rem] border border-slate-800">
              <h2 className="text-2xl font-black mb-6">Portal Control</h2>
              <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl mb-8">
                 <div>
                    <p className="font-black text-white">Withdrawal Portal</p>
                    <p className="text-sm text-slate-500">Turn withdrawals ON or OFF globally.</p>
                 </div>
                 <button 
                  onClick={toggleWithdrawal}
                  className={`px-8 py-3 rounded-xl font-black transition ${settings.withdrawalOpen ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                 >
                   {settings.withdrawalOpen ? 'Portal Open' : 'Portal Closed'}
                 </button>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Portal Closing Message / Time</label>
                   <textarea 
                    value={settings.withdrawalMessage}
                    onChange={(e) => setSettings({...settings, withdrawalMessage: e.target.value})}
                    className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="e.g. Withdrawals are closed. Re-opening at 8:00 AM."
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Global Announcement</label>
                   <textarea 
                    value={settings.announcement}
                    onChange={(e) => setSettings({...settings, announcement: e.target.value})}
                    className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    rows={3}
                   />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
