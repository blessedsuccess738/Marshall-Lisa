
import React from 'react';
import { User } from '../types';

const TeamPage: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-black text-white">My Referral Team</h2>

      <div className="grid md:grid-cols-2 gap-6">
         <div className="glass-card p-8 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-purple-600/10 to-transparent">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">Network Growth</h3>
            <div className="flex items-end gap-2 mb-2">
               <span className="text-5xl font-black text-white">{user.referrals.length}</span>
               <span className="text-purple-400 font-bold mb-1">Members</span>
            </div>
            <p className="text-slate-500 text-sm italic">Building a strong team maximizes bonuses</p>
         </div>

         <div className="glass-card p-8 rounded-[2rem] border border-slate-800">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">Invite Link</h3>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-blue-400 font-mono text-xs break-all mb-4">
               https://royalgate.pro/register?ref={user.username}
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(`https://royalgate.pro/register?ref=${user.username}`); alert('Copied!'); }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
            >
              Copy Link
            </button>
         </div>
      </div>

      <div className="glass-card rounded-[2rem] border border-slate-800 overflow-hidden">
         <div className="p-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white">Referral List</h3>
         </div>
         <div className="divide-y divide-slate-800">
            {user.referrals.map((id, i) => (
              <div key={id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition">
                 <div className="flex items-center">
                    <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 mr-4">
                       {i + 1}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">Member ID: {id.substr(0, 8)}</p>
                       <p className="text-xs text-slate-500">Tier: LEGACY (Active)</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-emerald-400 font-bold text-sm">+₦500.00</p>
                    <p className="text-[10px] text-slate-500 uppercase">Comm. Earned</p>
                 </div>
              </div>
            ))}
            {user.referrals.length === 0 && (
               <div className="p-12 text-center text-slate-500">
                  <p className="mb-4">No referrals yet.</p>
                  <button onClick={() => {}} className="text-blue-500 font-bold hover:underline">Invite your first friend!</button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default TeamPage;
