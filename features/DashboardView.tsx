
import React, { useEffect, useState } from 'react';
import { ViewState, UserProfile } from '../types';
import { Activity, Utensils, Zap, ChevronRight, Droplets, Trophy, RotateCw, Moon, NotebookText, BrainCircuit } from 'lucide-react';
import { getDailyRecommendations } from '../services/geminiService';
import { WellTrackLogo } from '../components/WellTrackLogo';
import { HealthPermissionGate } from '../components/HealthPermissionGate';
import { HealthSyncController } from '../services/health/HealthSyncController';

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
  const [showPermission, setShowPermission] = useState(false);

  useEffect(() => {
    getDailyRecommendations("").then(res => setLocalTip(res));
  }, []);

  const handleRefresh = async () => {
    const connected = await HealthSyncController.isConnected();
    if (!connected) {
      setShowPermission(true);
    } else {
      triggerSync();
    }
  };

  const triggerSync = async () => {
    setIsRefreshing(true);
    await onSyncHealth();
    setIsRefreshing(false);
    setShowPermission(false);
  };

  const hydrationProgress = Math.min((stats.hydration / user.hydrationGoal) * 100, 100);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 relative overflow-x-hidden">
      {showPermission && (
        <HealthPermissionGate 
          type="steps" 
          onAllow={triggerSync} 
          onDeny={() => setShowPermission(false)} 
        />
      )}

      {/* Top Section */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] h-[24rem] rounded-b-[4rem] relative px-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="h-[calc(env(safe-area-inset-top)+2rem)]"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <WellTrackLogo variant="white" size={44} />
            <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-widest mt-2">Health Ecosystem</p>
          </div>
          <button onClick={handleRefresh} className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${isRefreshing ? 'animate-spin' : 'active:scale-90'}`}>
            <RotateCw size={20} />
          </button>
        </div>
        
        <div className="mt-8 flex gap-4">
           <div className="flex-1 bg-white/10 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-emerald animate-pulse-soft"><Droplets size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-100 tracking-widest">Hydratation</p>
                <p className="text-xl font-black">{stats.hydration} <span className="text-xs opacity-60">ml</span></p>
              </div>
           </div>
           <div className="w-20 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border border-white/10">
              <div className="relative w-12 h-12">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                    <circle cx="24" cy="24" r="20" stroke="#10B981" strokeWidth="4" fill="none" strokeDasharray={126} strokeDashoffset={126 - (126 * hydrationProgress / 100)} strokeLinecap="round" />
                 </svg>
              </div>
           </div>
        </div>
      </div>

      <div className="px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-[3rem] p-8 shadow-pro border border-white flex flex-col items-center">
          <div className="relative w-44 h-44 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="78" stroke="#F1F5F9" strokeWidth="14" fill="none" />
              <circle cx="88" cy="88" r="78" stroke="#2563EB" strokeWidth="14" fill="none" strokeDasharray={490} strokeDashoffset={490 - (490 * Math.min(stats.dailySteps / 10000, 1)) } strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{stats.dailySteps.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Pas Aujourd'hui</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-[2rem] text-center border border-slate-100">
               <span className="text-2xl font-black text-slate-900 leading-none">{stats.dailyCalories}</span>
               <span className="text-[10px] text-slate-400 font-bold block uppercase mt-1">Calories</span>
            </div>
            <button onClick={() => onChangeView(ViewState.SLEEP)} className="bg-slate-50 p-5 rounded-[2rem] text-center active:bg-slate-100 border border-slate-100 transition-all">
               <span className="text-2xl font-black text-slate-900 leading-none">{stats.dailySleep?.durationHours || 0}h</span>
               <span className="text-[10px] text-slate-400 font-bold block uppercase mt-1">Sommeil</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 mt-8">
        <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/10 shadow-glow flex items-center gap-4 active:scale-98 transition-all cursor-pointer" onClick={() => onChangeView(ViewState.COACH)}>
          <div className="bg-brand-blue p-3 rounded-2xl text-white shadow-glow animate-pulse-soft"><BrainCircuit size={24} /></div>
          <div className="flex-1">
             <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-1">Coach IA WellTrack</p>
             <p className="text-sm font-bold text-white leading-snug">Discussion proactive disponible. Analyse tes progrès !</p>
          </div>
          <ChevronRight className="text-slate-600" />
        </div>
      </div>

      <div className="px-8 mt-10 grid grid-cols-2 gap-6">
        <NavButton label="Santé & Sport" icon={<Activity />} color="bg-brand-blue" onClick={() => onChangeView(ViewState.ACTIVITY)} delay="delay-0" />
        <NavButton label="Nutrition" icon={<Utensils />} color="bg-brand-accent" onClick={() => onChangeView(ViewState.NUTRITION)} delay="delay-75" />
        <NavButton label="Récupération" icon={<Moon />} color="bg-indigo-600" onClick={() => onChangeView(ViewState.SLEEP)} delay="delay-150" />
        <NavButton label="Bien-être" icon={<NotebookText />} color="bg-slate-800" onClick={() => onChangeView(ViewState.JOURNAL)} delay="delay-200" />
      </div>
    </div>
  );
};
