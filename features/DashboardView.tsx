import React, { useEffect, useState } from 'react';
import { ViewState, UserProfile } from '../types';
import { Activity, Moon, Utensils, Zap, BookOpen, Lightbulb, ChevronRight, Play } from 'lucide-react';
import { getDailyRecommendations } from '../services/geminiService';

interface DashboardProps {
  user: UserProfile;
  stats: any;
  onChangeView: (view: ViewState) => void;
  onSyncHealth: () => Promise<void>;
}

// Composant Bouton Navigation Carré
const NavButton = ({ label, icon, color, onClick }: { label: string, icon: React.ReactNode, color: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-3 aspect-square active:scale-95 transition-transform border border-slate-50"
  >
    <div className={`p-3 rounded-full ${color} text-white shadow-md`}>
      {/* Fix: cast icon to ReactElement with expected 'size' prop to avoid TS error */}
      {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 })}
    </div>
    <span className="text-xs font-bold text-slate-600">{label}</span>
  </button>
);

export const DashboardView: React.FC<DashboardProps> = ({ user, stats, onChangeView }) => {
  const [aiTip, setAiTip] = useState<string>("Chargement conseil...");

  useEffect(() => {
    getDailyRecommendations(`Steps: ${stats.dailySteps}`).then(res => setAiTip(res.split('\n')[0]));
  }, [stats]);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 relative overflow-hidden">
      
      {/* HEADER COURBE BLEU */}
      <div className="bg-gradient-to-br from-brand-blue to-blue-600 h-80 rounded-b-[3rem] relative pt-10 px-6 text-white shadow-glow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Bonjour, {user.name}</h1>
            <p className="text-blue-100 text-sm opacity-90">Prêt pour aujourd'hui ?</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl">
            {user.gender === 'M' ? '👨‍💻' : '👩‍💻'}
          </div>
        </div>
      </div>

      {/* CARTE FLOTTANTE HERO */}
      <div className="px-6 -mt-40 relative z-10">
        <div className="bg-white rounded-[2rem] p-5 shadow-xl flex items-center justify-between relative overflow-hidden">
           {/* Decorative Background Blob */}
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-50"></div>

           <div className="relative z-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Résumé du jour</span>
              <div className="flex items-baseline gap-1 mt-1">
                 <span className="text-4xl font-black text-slate-800">{stats.dailyCalories}</span>
                 <span className="text-sm font-medium text-slate-400">kcal</span>
              </div>
              
              <div className="flex gap-4 mt-4">
                 <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Protéines</div>
                    <div className="h-1.5 w-12 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="bg-blue-500 h-full w-[60%]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Pas</div>
                    <div className="h-1.5 w-12 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="bg-neon-green h-full w-[40%]"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Food Image Circle */}
           <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex-shrink-0 relative">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80" alt="Meal" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
           </div>
        </div>
      </div>

      {/* NAVIGATION GRID */}
      <div className="px-6 mt-8">
        <h3 className="font-bold text-slate-800 mb-4 text-lg">Menu Principal</h3>
        <div className="grid grid-cols-2 gap-4">
          <NavButton 
            label="Activité" 
            icon={<Activity />} 
            color="bg-yellow-400" 
            onClick={() => onChangeView(ViewState.ACTIVITY)} 
          />
          <NavButton 
            label="Sommeil" 
            icon={<Moon />} 
            color="bg-brand-blue" 
            onClick={() => onChangeView(ViewState.SLEEP)} 
          />
          <NavButton 
            label="Nutrition" 
            icon={<Utensils />} 
            color="bg-neon-green" 
            onClick={() => onChangeView(ViewState.NUTRITION)} 
          />
          <NavButton 
            label="Conseils IA" 
            icon={<Lightbulb />} 
            color="bg-neon-purple" 
            onClick={() => onChangeView(ViewState.RECOMMENDATIONS)} 
          />
        </div>
      </div>

      {/* CONSEIL RAPIDE */}
      <div className="px-6 mt-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
           <div className="bg-slate-100 p-2 rounded-full">
              <Zap size={18} className="text-slate-500" />
           </div>
           <div>
              <h4 className="font-bold text-sm text-slate-800">Astuce du jour</h4>
              <p className="text-xs text-slate-500 line-clamp-1">{aiTip}</p>
           </div>
           <ChevronRight className="ml-auto text-slate-300" size={16} />
        </div>
      </div>

    </div>
  );
};