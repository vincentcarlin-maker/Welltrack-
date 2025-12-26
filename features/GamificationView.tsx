
import React from 'react';
import { UserProfile } from '../types';
import { Trophy, Flame, Target, Crown, Share2, Medal } from 'lucide-react';

interface GamificationViewProps {
  user: UserProfile;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ user }) => {
  const challenges = [
    { id: 1, title: "Marathonien", desc: "10,000 pas", progress: 0.8, reward: 50, color: 'from-orange-400 to-red-500' },
    { id: 2, title: "Zen Master", desc: "30 min Yoga", progress: 1.0, reward: 30, color: 'from-blue-400 to-indigo-500' },
  ];

  const badgesList = [
    { id: '1', name: "Lève-tôt", icon: "🌅", unlocked: true, rarity: 'Common' },
    { id: '2', name: "Machine", icon: "🤖", unlocked: true, rarity: 'Rare' },
    { id: '3', name: "Gourmet", icon: "🥗", unlocked: true, rarity: 'Common' },
    { id: '4', name: "Spartiate", icon: "⚔️", unlocked: false, rarity: 'Epic' },
    { id: '5', name: "Yogi", icon: "🧘", unlocked: false, rarity: 'Common' },
    { id: '6', name: "Flash", icon: "⚡", unlocked: false, rarity: 'Rare' },
  ];

  const nextLevelPoints = 1000 - (user.points % 1000);
  const progressPercent = (user.points % 1000) / 10;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-[calc(1.5rem+env(safe-area-inset-top))] px-6">
       <header className="mb-8 flex justify-between items-start">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">Défis & Succès</h1>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Votre progression</p>
          </div>
          <button className="bg-white p-3 rounded-full shadow-sm text-slate-400"><Share2 size={20}/></button>
       </header>

       {/* PROFILE HERO CARD */}
       <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden mb-8">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-orange-500 mb-4 shadow-glow">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=fff`} className="w-full h-full rounded-full border-4 border-slate-900" alt="Profile" />
             </div>
             
             <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
             <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 mb-6">
                <Crown size={14} className="text-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Niveau {user.level}</span>
             </div>

             <div className="w-full">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                   <span>{user.points} XP</span>
                   <span>Niveau Suivant ({nextLevelPoints} pts)</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
             </div>
          </div>
       </div>

       {/* DAILY CHALLENGES */}
       <div className="mb-8">
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
             <Flame className="text-orange-500" size={20} /> Défis du jour
          </h3>
          <div className="space-y-4">
             {challenges.map(c => (
                <div key={c.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shadow-md`}>
                      <Target size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between mb-1">
                         <span className="font-bold text-slate-800">{c.title}</span>
                         <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">+{c.reward}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                         <div className={`h-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.progress * 100}%` }}></div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* BADGES GRID */}
       <div>
          <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
             <Medal className="text-yellow-500" size={20} /> Collection
          </h3>
          <div className="grid grid-cols-3 gap-4">
             {badgesList.map(badge => (
                <div key={badge.id} className={`aspect-square rounded-3xl flex flex-col items-center justify-center p-2 relative group overflow-hidden ${badge.unlocked ? 'bg-white shadow-md border border-slate-100' : 'bg-slate-100 opacity-60 grayscale'}`}>
                   {badge.unlocked && <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-transparent opacity-50"></div>}
                   <span className="text-4xl mb-2 drop-shadow-sm transform group-active:scale-110 transition-transform">{badge.icon}</span>
                   <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{badge.name}</span>
                   {badge.unlocked && badge.rarity === 'Epic' && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                   )}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};
