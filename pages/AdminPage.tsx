
import React, { useState } from 'react';
import { User, MembershipTier, WithdrawalRequest } from '../types';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
// Added missing import for ADMIN_EMAIL
import { ADMIN_EMAIL } from '../constants';

const AdminPage: React.FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    { id: '1', userId: 'u1', username: 'lucky_earner', amount: 5000, method: 'Bank', accountDetails: 'John Doe, 12345678, GTBank', status: 'PENDING', timestamp: new Date().toISOString() },
    { id: '2', userId: 'u2', username: 'crypto_king', amount: 12000, method: 'USDT', accountDetails: '0x123...abc', status: 'PENDING', timestamp: new Date().toISOString() }
  ]);

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-black text-blue-400">Admin Control</div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/admin" className="block px-4 py-3 text-sm font-medium bg-gray-800 rounded-xl">Overview</Link>
          <div className="block px-4 py-3 text-sm font-medium text-gray-400">Users</div>
          <div className="block px-4 py-3 text-sm font-medium text-gray-400">Transactions</div>
          <div className="block px-4 py-3 text-sm font-medium text-gray-400">Settings</div>
        </nav>
        <div className="p-4">
          <button onClick={onLogout} className="w-full py-3 bg-red-600 rounded-xl font-bold">Log Out</button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
           <h1 className="text-3xl font-black text-gray-900">System Overview</h1>
           {/* Fix: Using imported ADMIN_EMAIL constant */}
           <p className="text-gray-500">Managing {ADMIN_EMAIL}</p>
        </header>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Users" value="1,240" icon={<span className="text-blue-600">👤</span>} color="bg-blue-50" />
          <StatCard label="Total Revenue" value="₦2,450,000" icon={<span className="text-green-600">💰</span>} color="bg-green-50" />
          <StatCard label="Pending Payouts" value={withdrawals.filter(w => w.status === 'PENDING').length} icon={<span className="text-red-600">⏳</span>} color="bg-red-50" />
          <StatCard label="Active Sessions" value="142" icon={<span className="text-purple-600">⚡</span>} color="bg-purple-50" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold">Withdrawal Approval Hub</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {withdrawals.map(w => (
                <tr key={w.id}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">@{w.username}</p>
                    <p className="text-xs text-gray-400">{new Date(w.timestamp).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₦{w.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{w.accountDetails}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      w.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      w.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {w.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleAction(w.id, 'APPROVED')} className="text-xs font-bold text-green-600 hover:underline">Approve</button>
                        <button onClick={() => handleAction(w.id, 'REJECTED')} className="text-xs font-bold text-red-600 hover:underline">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {withdrawals.length === 0 && <div className="p-12 text-center text-gray-400">No withdrawal requests found.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
