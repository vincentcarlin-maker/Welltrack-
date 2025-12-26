
import React, { useEffect, useState } from 'react';
import { ViewState, UserProfile } from '../types';
import { Activity, Moon, Utensils, Zap, Lightbulb, ChevronRight, TrendingUp, Target, Award } from 'lucide-react';
import { getDailyRecommendations } from '../services/geminiService';

interface DashboardProps {
  user: UserProfile;
  stats: any;
  onChangeView: (view: ViewState) => void;
  onSyncHealth: () => Promise<void>;
}

const NavButton = ({ label, icon, color, onClick, delay }: { label: string, icon: React.ReactNode, color: string, onClick: () => void, delay: string }) => (
  <button 
    onClick={onClick}
    className={`bg-white p-5 rounded-[2.5rem] shadow-soft flex flex-col items-center justify-center gap-3 aspect-square active:scale-95 transition-all border border-slate-50 animate-in fade-in slide-in-from-bottom duration-700 ${delay}`}
  >
    <div className={`p-4 rounded-3xl ${color} text-white shadow-lg`}>
      {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 28 })}
    </div>
    <span className="text-xs font-bold text-slate-700">{label}</span>
  </button>
);

export const DashboardView: React.FC<DashboardProps> = ({ user, stats, onChangeView }) => {
  const [aiTip, setAiTip] = useState<string>("Analyse de vos données en cours...");

  useEffect(() => {
    getDailyRecommendations(`Steps: ${stats.dailySteps}, Calories: ${stats.dailyCalories}`).then(res => {
      const firstTip = res.split('\n').find(line => line.length > 5) || "Continuez vos efforts !";
      setAiTip(firstTip.replace(/^[*-]\s*/, ''));
    });
  }, [stats]);

  const stepProgress = Math.min((stats.dailySteps / 10000) * 100, 100);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 relative overflow-x-hidden">
      
      {/* HEADER PREMIUM */}
      <div className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] h-[22rem] rounded-b-[4rem] relative pt-12 px-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-20"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">WellTrack</h1>
            <p className="text-blue-100/80 text-sm font-medium mt-1">Évoluez chaque jour, {user.name}</p>
          </div>
          <button 
            onClick={() => onChangeView(ViewState.PROFILE)}
            className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg active:scale-90 transition-transform overflow-hidden"
          >
            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=fff&bold=true`} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>

        {/* QUICK STATS OVERLAY */}
        <div className="mt-8 flex gap-6 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200/70">Niveau</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">{user.level}</span>
              <Award size={16} className="text-yellow-400" />
            </div>
          </div>
          <div className="w-px h-8 bg-white/10 self-center"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200/70">Points XP</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black">{user.points.toLocaleString()}</span>
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* CARTE HERO FLOTTANTE - RÉSUMÉ ACTIVITÉ */}
      <div className="px-8 -mt-28 relative z-20">
        <div className="bg-white rounded-[3rem] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-white/50 relative overflow-hidden group">
           <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
           
           <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <TrendingUp size={16} className="text-brand-blue" />
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Activité du jour</span>
              </div>
              <span className="text-[10px] font-bold text-neon-green bg-green-50 px-2 py-1 rounded-lg">En forme</span>
           </div>

           <div className="flex items-center gap-8 relative z-10">
              <div className="relative w-32 h-32 flex-shrink-0">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                    <circle 
                      cx="64" cy="64" r="56" stroke="#2563EB" strokeWidth="12" fill="none" 
                      strokeDasharray={352} 
                      strokeDashoffset={352 - (352 * stepProgress) / 100} 
                      className="transition-all duration-1000 ease-out" 
                      strokeLinecap="round" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Zap size={20} className="text-yellow-400 mb-1" />
                    <span className="text-2xl font-black text-slate-800">{stats.dailySteps}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Pas / 10k</span>
                 </div>
              </div>

              <div className="flex-1 space-y-5">
                 <div className="flex flex-col">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-2xl font-black text-slate-800">{stats.dailyCalories}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">kcal brûlées</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="bg-gradient-to-r from-orange-400 to-red-500 h-full w-[65%] rounded-full"></div>
                    </div>
                 </div>
                 
                 <div className="flex gap-4">
                    <button onClick={() => onChangeView(ViewState.ACTIVITY)} className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                      Détails
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* CONSEIL IA - GLASSMORPHISM */}
      <div className="px-8 mt-10">
        <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white shadow-soft flex items-center gap-4 group cursor-pointer hover:border-blue-200 transition-all" onClick={() => onChangeView(ViewState.RECOMMENDATIONS)}>
           <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl text-white shadow-lg group-hover:rotate-12 transition-transform">
              <BrainCircuit size={22} />
           </div>
           <div className="flex-1">
              <h4 className="font-black text-xs text-slate-800 uppercase tracking-widest mb-1 flex items-center gap-2">
                Coach IA <Sparkles size={12} className="text-yellow-500 animate-pulse" />
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 italic">"{aiTip}"</p>
           </div>
           <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={20} />
        </div>
      </div>

      {/* NAVIGATION GRID */}
      <div className="px-8 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-800 text-lg tracking-tight">Modules Santé</h3>
          <button className="text-brand-blue text-xs font-bold flex items-center gap-1">Voir tout <ChevronRight size={14}/></button>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <NavButton 
            label="Fitness" 
            icon={<Activity />} 
            color="bg-[#F59E0B]" 
            onClick={() => onChangeView(ViewState.ACTIVITY)} 
            delay="delay-0"
          />
          <NavButton 
            label="Nutrition" 
            icon={<Utensils />} 
            color="bg-[#10B981]" 
            onClick={() => onChangeView(ViewState.NUTRITION)} 
            delay="delay-75"
          />
          <NavButton 
            label="Repos" 
            icon={<Moon />} 
            color="bg-[#3B82F6]" 
            onClick={() => onChangeView(ViewState.SLEEP)} 
            delay="delay-150"
          />
          <NavButton 
            label="Défis" 
            icon={<Target />} 
            color="bg-[#8B5CF6]" 
            onClick={() => onChangeView(ViewState.GAMIFICATION)} 
            delay="delay-200"
          />
        </div>
      </div>

      {/* DAILY GOAL CARD */}
      <div className="px-8 mt-10">
        <div className="bg-slate-900 rounded-[2.5rem] p-7 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity size={120} />
           </div>
           <h4 className="text-lg font-bold mb-1 relative z-10">Objectif Hebdomadaire</h4>
           <p className="text-slate-400 text-xs mb-6 relative z-10">4 séances de musculation sur 5</p>
           
           <div className="flex gap-2 relative z-10 mb-6">
              {[1, 1, 1, 1, 0].map((v, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${v ? 'bg-neon-green shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}></div>
              ))}
           </div>
           
           <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-colors">
              Voir mon programme
           </button>
        </div>
      </div>

    </div>
  );
};

// Mock missing icon imports for the UI polish
const BrainCircuit = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .94 4.82 2.5 2.5 0 0 0 2 3.14 2.5 2.5 0 0 0 4.02 1.48" />
    <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-.94 4.82 2.5 2.5 0 0 1-2 3.14 2.5 2.5 0 0 1-4.02 1.48" />
    <path d="M12 13v8" /><path d="M12 13v-3" /><path d="M9 21h6" />
  </svg>
);

const Sparkles = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
);
