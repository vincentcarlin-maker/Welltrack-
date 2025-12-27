
import React, { useEffect, useState } from 'react';
import { ViewState, UserProfile } from '../types';
import { Activity, Utensils, Zap, ChevronRight, TrendingUp, Award, RotateCw, Clock, NotebookText, Moon } from 'lucide-react';
import { getDailyRecommendations } from '../services/geminiService';
import { WellTrackLogo } from '../components/WellTrackLogo';

interface DashboardProps {
  user: UserProfile;
  stats: any;
  onChangeView: (view: ViewState) => void;
  onSyncHealth: () => Promise<void>;
}

const NavButton = ({ label, icon, color, onClick, delay }: { label: string, icon: React.ReactNode, color: string, onClick: () => void, delay: string }) => (
  <button 
    onClick={onClick}
    className={`bg-white p-6 rounded-[2.5rem] shadow-pro flex flex-col items-center justify-center gap-3 aspect-square active:scale-95 transition-all border border-slate-50 animate-in fade-in slide-in-from-bottom duration-700 ${delay}`}
  >
    <div className={`p-4 rounded-3xl ${color} text-white shadow-lg`}>
      {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 30 })}
    </div>
    <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{label}</span>
  </button>
);

export const DashboardView: React.FC<DashboardProps> = ({ user, stats, onChangeView, onSyncHealth }) => {
  const [localTip, setLocalTip] = useState<string>("Analyse en cours...");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getDailyRecommendations("").then(res => setLocalTip(res));
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onSyncHealth();
    setIsRefreshing(false);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 relative overflow-x-hidden">
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] h-[26rem] rounded-b-[4rem] relative px-8 text-white shadow-2xl">
        <div className="h-[calc(env(safe-area-inset-top)+2rem)]"></div>
        <div className="flex justify-between items-start">
          <div>
            <WellTrackLogo variant="white" size={44} />
            <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-widest mt-2">WellTrack Elite</p>
          </div>
          <button onClick={handleRefresh} className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${isRefreshing ? 'animate-spin' : 'active:scale-90'}`}>
            <RotateCw size={20} />
          </button>
        </div>
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg"><Zap size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase text-blue-100 tracking-widest">Niveau Actuel</p>
            <p className="text-2xl font-black">Elite Level {user.level}</p>
          </div>
        </div>
      </div>

      <div className="px-8 -mt-20">
        <div className="bg-white rounded-[3rem] p-8 shadow-pro border border-white flex flex-col items-center">
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#F1F5F9" strokeWidth="12" fill="none" />
              <circle cx="80" cy="80" r="70" stroke="#2563EB" strokeWidth="12" fill="none" strokeDasharray={440} strokeDashoffset={440 - (440 * Math.min(stats.dailySteps / 10000, 1)) } strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{stats.dailySteps.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pas</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-3xl text-center">
               <span className="text-xl font-black text-slate-900">{stats.dailyCalories}</span>
               <span className="text-[10px] text-slate-400 font-bold block uppercase">Kcal</span>
            </div>
            <button onClick={() => onChangeView(ViewState.SLEEP)} className="bg-slate-50 p-4 rounded-3xl text-center active:bg-slate-100 transition-colors">
               <span className="text-xl font-black text-slate-900">{stats.dailySleep?.durationHours || 0}h</span>
               <span className="text-[10px] text-slate-400 font-bold block uppercase">Sommeil</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 mt-8">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-pro flex items-center gap-4 active:scale-98 transition-all" onClick={() => onChangeView(ViewState.RECOMMENDATIONS)}>
          <div className="bg-brand-blue/10 p-3 rounded-2xl text-brand-blue"><Activity size={24} /></div>
          <div className="flex-1"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">IA Coach</p><p className="text-sm font-bold text-slate-800 italic">"{localTip}"</p></div>
          <ChevronRight className="text-slate-300" />
        </div>
      </div>

      <div className="px-8 mt-10 grid grid-cols-2 gap-6">
        <NavButton label="Fit" icon={<Activity />} color="bg-brand-blue" onClick={() => onChangeView(ViewState.ACTIVITY)} delay="delay-0" />
        <NavButton label="Food" icon={<Utensils />} color="bg-emerald-500" onClick={() => onChangeView(ViewState.NUTRITION)} delay="delay-75" />
        <NavButton label="Repos" icon={<Moon />} color="bg-indigo-600" onClick={() => onChangeView(ViewState.SLEEP)} delay="delay-150" />
        <NavButton label="Journal" icon={<NotebookText />} color="bg-slate-800" onClick={() => onChangeView(ViewState.JOURNAL)} delay="delay-200" />
      </div>
    </div>
  );
};
