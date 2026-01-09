
import React, { useState } from 'react';
import { User } from '../types';

interface SettingsPageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phone: user.phone,
  });

  const AVATARS = [
    'pixel-art', 'bottts', 'avataaars', 'identicon', 'rings'
  ].map(type => `https://api.dicebear.com/7.x/${type}/svg?seed=${user.username}`);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
    alert('Profile updated successfully!');
  };

  const selectAvatar = (url: string) => {
    onUpdateUser({ ...user, avatarUrl: url });
    alert('Avatar updated!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      <h2 className="text-3xl font-black text-white tracking-tight">Account Settings</h2>

      <div className="glass-card p-10 rounded-[3rem] border border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest ml-1">Select Your Identity</p>
        <div className="flex flex-wrap gap-4 mb-10">
           {AVATARS.map((url, i) => (
             <img 
               key={i} 
               src={url} 
               onClick={() => selectAvatar(url)}
               className={`h-20 w-20 rounded-2xl cursor-pointer transition border-4 ${user.avatarUrl === url ? 'border-blue-600 scale-110 shadow-xl shadow-blue-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'}`} 
               alt="av" 
             />
           ))}
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Full Name</label>
              <input value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Email (Locked)</label>
              <input disabled value={user.email} className="w-full px-6 py-4 bg-slate-800/50 border border-slate-800 rounded-2xl text-slate-500 outline-none cursor-not-allowed" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 ml-1 tracking-widest">Phone Number</label>
            <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:ring-1 focus:ring-blue-500 transition" />
          </div>

          <button type="submit" className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black transition-all shadow-xl shadow-blue-500/10">
            Save Changes
          </button>
        </form>
      </div>

      <div className="glass-card p-10 rounded-[3rem] border border-red-500/10">
         <h3 className="text-xl font-black text-red-500 mb-2">Help & Security</h3>
         <p className="text-slate-500 text-sm mb-10">Reach out to our support team for specialized inquiries.</p>
         <div className="flex gap-4">
            <button onClick={() => window.open('https://t.me/royalgate_support', '_blank')} className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-700 transition">Contact Support</button>
            <button className="px-8 py-3 border border-red-500/20 text-red-500 rounded-2xl font-black hover:bg-red-500/5 transition">Delete Account</button>
         </div>
      </div>
    </div>
  );
};

export default SettingsPage;
