
import React, { useEffect, useState } from 'react';
import { ViewState, UserProfile } from '../types';
import { Activity, Utensils, Zap, ChevronRight, TrendingUp, Award, RotateCw, Clock, NotebookText, Calendar } from 'lucide-react';
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
    <span className="text-xs font-[900] text-slate-800 uppercase tracking-tighter">{label}</span>
  </button>
);

export const DashboardView: React.FC<DashboardProps> = ({ user, stats, onChangeView, onSyncHealth }) => {
  const [localTip, setLocalTip] = useState<string>("Analyse Fitrack en cours...");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    getDailyRecommendations("").then(res => setLocalTip(res));
  }, []);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await onSyncHealth();
    const newTip = await getDailyRecommendations("");
    setLocalTip(newTip);
    setLastUpdate(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const stepProgress = Math.min((stats.dailySteps / 10000) * 100, 100);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 relative overflow-x-hidden">
      
      {/* Header Premium Fitrack */}
      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] h-[28rem] rounded-b-[5rem] relative px-8 text-white shadow-2xl transition-all duration-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="h-[calc(env(safe-area-inset-top)+2rem)] w-full"></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <WellTrackLogo variant="white" size={44} />
            <div className="flex items-center gap-2 mt-2 px-1">
               <span className="text-blue-100/60 text-[10px] font-black uppercase tracking-[0.2em]">Fitrack Elite v1.0</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-3">
              <button 
                onClick={handleRefresh}
                className={`w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/20 flex items-center justify-center shadow-lg active:scale-90 transition-all duration-300 ${isRefreshing ? 'scale-110 shadow-glow' : ''}`}
              >
                <RotateCw size={20} className={`${isRefreshing ? 'animate-spin' : 'hover:rotate-45 transition-transform'}`} />
              </button>
              <button 
                onClick={() => onChangeView(ViewState.PROFILE)}
                className="w-12 h-12 rounded-2xl bg-white p-1 border border-white/20 shadow-lg active:scale-90 transition-transform overflow-hidden"
              >
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=fff&color=2563EB&bold=true`} alt="Profile" className="w-full h-full object-cover rounded-xl" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-200/60 bg-black/10 px-2 py-1 rounded-lg backdrop-blur-sm">
              <Clock size={10} /> {lastUpdate}
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white/10 backdrop-blur-md rounded-[3rem] p-6 border border-white/15 flex justify-between items-center relative z-10 shadow-xl">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-brand-accent to-brand-blue rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                 <Zap className="text-white" size={28} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-blue-100 tracking-[0.2em]">Progression Totale</p>
                 <p className="text-3xl font-[900]">{user.level + 10} Jours</p>
              </div>
           </div>
           <Award className="text-brand-accent opacity-40 animate-pulse" size={48} />
        </div>
      </div>

      <div className="px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-[4rem] p-10 shadow-pro border border-white relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-2xl">
                  <TrendingUp size={20} className="text-brand-blue" />
                </div>
                <span className="text-sm font-[900] text-slate-800 uppercase tracking-[0.15em]">Pas Fitrack</span>
              </div>
              <span className="text-[10px] font-black text-brand-accent bg-brand-accent/10 px-4 py-2 rounded-full uppercase tracking-widest border border-brand-accent/20">Elite</span>
           </div>

           <div className="flex flex-col items-center gap-12">
              <div className="relative w-44 h-44 flex-shrink-0">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="88" cy="88" r="78" stroke="#F1F5F9" strokeWidth="16" fill="none" />
                    <circle 
                      cx="88" cy="88" r="78" stroke="#2563EB" strokeWidth="16" fill="none" 
                      strokeDasharray={490} 
                      strokeDashoffset={490 - (490 * stepProgress) / 100} 
                      className="transition-all duration-[1500ms] ease-out" 
                      strokeLinecap="round" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-[900] text-slate-900 tracking-tighter">{stats.dailySteps.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Objectif 10k</span>
                 </div>
              </div>

              <div className="flex-1 w-full space-y-8">
                 <div className="flex flex-col">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Calories Consommées</span>
                        <span className="text-4xl font-[900] text-slate-900 tracking-tighter">{stats.dailyCalories} <span className="text-sm text-slate-400 font-bold">kcal</span></span>
                      </div>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                       <div className="bg-gradient-to-r from-brand-accent to-brand-blue h-full rounded-full shadow-lg transition-all duration-1000 ease-out" style={{ width: `${Math.min((stats.dailyCalories / 2500) * 100, 100)}%` }}></div>
                    </div>
                 </div>
                 <button onClick={() => onChangeView(ViewState.ACTIVITY)} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                   Dashboard Fitrack
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Conseil Coach Fitrack */}
      <div className="px-8 mt-12">
        <div className="bg-white p-7 rounded-[3rem] border border-slate-100 shadow-pro flex items-center gap-6 group cursor-pointer active:scale-98 transition-all" onClick={() => onChangeView(ViewState.RECOMMENDATIONS)}>
           <div className="bg-gradient-to-br from-brand-blue to-brand-accent p-5 rounded-[2rem] text-white shadow-pro group-hover:rotate-6 transition-transform">
              <Activity size={28} />
           </div>
           <div className="flex-1">
              <h4 className="font-black text-[10px] text-brand-blue uppercase tracking-[0.25em] mb-2">Coach Fitrack</h4>
              <p className="text-sm text-slate-800 font-bold leading-tight italic">"{localTip}"</p>
           </div>
           <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={24} />
        </div>
      </div>

      {/* Grille d'actions Fitrack */}
      <div className="px-8 mt-14">
        <h3 className="font-[900] text-slate-900 text-2xl tracking-tighter mb-8">Écosystème Fitrack</h3>
        <div className="grid grid-cols-2 gap-8">
          <NavButton label="Fit" icon={<Activity />} color="bg-brand-blue" onClick={() => onChangeView(ViewState.ACTIVITY)} delay="delay-0" />
          <NavButton label="Food" icon={<Utensils />} color="bg-emerald-500" onClick={() => onChangeView(ViewState.NUTRITION)} delay="delay-75" />
          <NavButton label="Notes" icon={<NotebookText />} color="bg-indigo-600" onClick={() => onChangeView(ViewState.JOURNAL)} delay="delay-150" />
          <NavButton label="Agenda" icon={<Calendar />} color="bg-slate-800" onClick={() => onChangeView(ViewState.ACTIVITY)} delay="delay-200" />
        </div>
      </div>
    </div>
  );
};
