
import React, { useState } from 'react';
import { User, WithdrawalRequest, SystemSettings, MembershipTier, Song, QuizQuestion } from '../types';
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
  const [activeView, setActiveView] = useState<'WITHDRAWALS' | 'USERS' | 'SETTINGS' | 'MUSIC' | 'QUIZ'>('WITHDRAWALS');

  // Music Management Logic
  const [newSong, setNewSong] = useState({ title: '', artist: '', url: '', duration: '' });
  const addSong = () => {
    if (!newSong.title || !newSong.url) return;
    const song: Song = { ...newSong, id: Math.random().toString(36).substr(2, 9) };
    setSettings(prev => ({ ...prev, songs: [song, ...prev.songs] }));
    setNewSong({ title: '', artist: '', url: '', duration: '' });
  };
  const removeSong = (id: string) => {
    setSettings(prev => ({ ...prev, songs: prev.songs.filter(s => s.id !== id) }));
  };

  // Quiz Management Logic
  const [newQuiz, setNewQuiz] = useState({ section: '', question: '', options: '', correctAnswer: '', reward: '50' });
  const addQuiz = () => {
    if (!newQuiz.question || !newQuiz.correctAnswer) return;
    const quiz: QuizQuestion = { 
      id: Math.random().toString(36).substr(2, 9),
      section: newQuiz.section || 'General',
      question: newQuiz.question,
      options: newQuiz.options.split(',').map(o => o.trim()),
      correctAnswer: newQuiz.correctAnswer,
      reward: parseInt(newQuiz.reward)
    };
    setSettings(prev => ({ ...prev, quizQuestions: [quiz, ...prev.quizQuestions] }));
    setNewQuiz({ section: '', question: '', options: '', correctAnswer: '', reward: '50' });
  };
  const removeQuiz = (id: string) => {
    setSettings(prev => ({ ...prev, quizQuestions: prev.quizQuestions.filter(q => q.id !== id) }));
  };

  const handleWithdrawalAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-slate-200 flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6">
        <div className="text-2xl font-black text-blue-500 mb-10 flex items-center">🛡️ RoyalAdmin</div>
        <nav className="flex-1 space-y-2">
          {['WITHDRAWALS', 'USERS', 'MUSIC', 'QUIZ', 'SETTINGS'].map(view => (
            <button key={view} onClick={() => setActiveView(view as any)} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition text-xs ${activeView === view ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
              {view}
            </button>
          ))}
          <Link to="/dashboard" className="block px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 text-xs">User Dashboard</Link>
        </nav>
        <button onClick={onLogout} className="mt-auto w-full py-4 bg-red-600/10 text-red-500 font-bold rounded-xl hover:bg-red-600 hover:text-white transition text-xs">Log Out</button>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto no-scrollbar">
        {activeView === 'WITHDRAWALS' && (
          <div className="glass-card rounded-[2.5rem] border border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center"><h2 className="text-xl font-black">Withdrawals</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <tr><th className="px-8 py-4">User</th><th className="px-8 py-4">Amount</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {withdrawals.map(w => (
                    <tr key={w.id}>
                      <td className="px-8 py-5">@{w.username}</td>
                      <td className="px-8 py-5 text-emerald-500 font-black">₦{w.amount.toLocaleString()}</td>
                      <td className="px-8 py-5"><span className="px-2 py-1 bg-slate-800 rounded text-[10px]">{w.status}</span></td>
                      <td className="px-8 py-5 text-right">
                        {w.status === 'PENDING' && <button onClick={() => handleWithdrawalAction(w.id, 'APPROVED')} className="text-xs text-blue-500 font-bold">Approve</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'MUSIC' && (
          <div className="space-y-10">
            <div className="glass-card p-10 rounded-[2.5rem] border border-slate-800">
              <h2 className="text-2xl font-black mb-6">Add New Music</h2>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Title" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} className="p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <input placeholder="Artist" value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} className="p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <input placeholder="Audio URL (Direct MP3)" value={newSong.url} onChange={e => setNewSong({...newSong, url: e.target.value})} className="p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <input placeholder="Duration (e.g 3:20)" value={newSong.duration} onChange={e => setNewSong({...newSong, duration: e.target.value})} className="p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
              </div>
              <button onClick={addSong} className="mt-6 w-full py-4 bg-blue-600 rounded-xl font-black">Add Song to Dashboard</button>
            </div>
            <div className="glass-card rounded-[2.5rem] border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800"><h3 className="font-bold">Active Songs</h3></div>
              <div className="divide-y divide-slate-800">
                {settings.songs.map(s => (
                  <div key={s.id} className="p-4 flex justify-between items-center">
                    <div><p className="font-bold text-sm">{s.title}</p><p className="text-[10px] text-slate-500">{s.artist}</p></div>
                    <button onClick={() => removeSong(s.id)} className="text-xs text-red-500 font-bold">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'QUIZ' && (
          <div className="space-y-10">
            <div className="glass-card p-10 rounded-[2.5rem] border border-slate-800">
              <h2 className="text-2xl font-black mb-6">Manage Quiz</h2>
              <div className="space-y-4">
                <input placeholder="Section (e.g History, Tech)" value={newQuiz.section} onChange={e => setNewQuiz({...newQuiz, section: e.target.value})} className="w-full p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <input placeholder="Question" value={newQuiz.question} onChange={e => setNewQuiz({...newQuiz, question: e.target.value})} className="w-full p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <input placeholder="Options (comma separated)" value={newQuiz.options} onChange={e => setNewQuiz({...newQuiz, options: e.target.value})} className="w-full p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <input placeholder="Correct Answer" value={newQuiz.correctAnswer} onChange={e => setNewQuiz({...newQuiz, correctAnswer: e.target.value})} className="w-full p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <input placeholder="Reward Amount (₦)" type="number" value={newQuiz.reward} onChange={e => setNewQuiz({...newQuiz, reward: e.target.value})} className="w-full p-4 bg-slate-900 rounded-xl text-sm border border-slate-800" />
                <button onClick={addQuiz} className="w-full py-4 bg-amber-600 rounded-xl font-black">Add Question</button>
              </div>
            </div>
            <div className="glass-card rounded-[2.5rem] border border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800"><h3 className="font-bold">Existing Questions</h3></div>
              <div className="divide-y divide-slate-800">
                {settings.quizQuestions.map(q => (
                  <div key={q.id} className="p-4 flex justify-between items-center">
                    <div><p className="font-bold text-sm">{q.question}</p><p className="text-[10px] text-amber-500 uppercase">{q.section} | ₦{q.reward}</p></div>
                    <button onClick={() => removeQuiz(q.id)} className="text-xs text-red-500 font-bold">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other views same as before... */}
      </div>
    </div>
  );
};

export default AdminPage;
