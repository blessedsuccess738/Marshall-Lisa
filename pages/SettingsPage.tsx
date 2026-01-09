
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
    country: user.country,
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-black text-white">Account Settings</h2>

      <div className="glass-card p-8 rounded-[2rem] border border-slate-800">
        <div className="flex items-center mb-8 gap-6">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="h-20 w-20 rounded-full border-2 border-slate-800" alt="avatar" />
           <div>
              <p className="text-xl font-black text-white">{user.username}</p>
              <p className="text-slate-400 text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
           </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Full Name</label>
              <input 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Email (Locked)</label>
              <input 
                disabled
                value={user.email}
                className="w-full px-5 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Phone</label>
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Country</label>
              <select 
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>Nigeria</option>
                <option>Ghana</option>
                <option>Kenya</option>
                <option>South Africa</option>
              </select>
            </div>
          </div>

          <button type="submit" className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10">
            Save Changes
          </button>
        </form>
      </div>

      <div className="glass-card p-8 rounded-[2rem] border border-red-500/10">
         <h3 className="text-lg font-bold text-red-400 mb-2">Security Zone</h3>
         <p className="text-slate-500 text-sm mb-6">Updating your password frequently helps keep your account secure.</p>
         <button className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500/5 transition">
            Change Password
         </button>
      </div>
    </div>
  );
};

export default SettingsPage;
