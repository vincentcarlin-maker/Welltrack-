
import React, { useState, useEffect } from 'react';
import { WorkoutProgram, WorkoutBlock, ActivityLog } from '../../types';
import { Play, ChevronRight, PenTool, Calendar as CalendarIcon, History, Clock, Dumbbell, RotateCw, CheckCircle2 } from 'lucide-react';
import { ACT_CreerEntrainement } from './ACT_CreerEntrainement';
import { ACT_SeanceEnCours } from './ACT_SeanceEnCours';
import { ACT_Calendrier } from './ACT_Calendrier';
import { ACT_HistoriqueSeances } from './ACT_HistoriqueSeances';

interface ACT_MusculationProps {
  programs: WorkoutProgram[];
  userEquipment: string[];
  activities: ActivityLog[];
  onAddProgram: (p: WorkoutProgram) => void;
  onFinishSession: (duration: number, blocks: WorkoutBlock[], programId: string) => void;
}

type MuscuView = 'HUB' | 'CREATE' | 'ACTIVE_SESSION' | 'CALENDAR' | 'HISTORY';

export const ACT_Musculation: React.FC<ACT_MusculationProps> = ({ programs, userEquipment, activities, onAddProgram, onFinishSession }) => {
  const [currentView, setCurrentView] = useState<MuscuView>('HUB');
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // État local pour forcer le rafraîchissement visuel des séances récentes
  const [localActivities, setLocalActivities] = useState<ActivityLog[]>(activities);

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  const handleStartSession = (prog: WorkoutProgram) => {
    setSelectedProgram(prog);
    setCurrentView('ACTIVE_SESSION');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // On simule une lecture forcée du stockage
    const saved = localStorage.getItem('welltrack_activities');
    if (saved) {
      setLocalActivities(JSON.parse(saved));
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Récupérer les 3 dernières séances de musculation (triées par date décroissante)
  const recentMuscuActivities = localActivities
    .filter(act => act.type === 'Musculation')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const calculateVolume = (blocks?: WorkoutBlock[]) => {
    if (!blocks) return 0;
    let total = 0;
    blocks.forEach(b => b.exercises.forEach(ex => total += (ex.sets * ex.reps * ex.weight)));
    return total;
  };

  const formatExDuration = (sec?: number) => {
    if (!sec) return '0s';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (currentView === 'CREATE') return <ACT_CreerEntrainement userEquipment={userEquipment} onSave={(p) => { onAddProgram(p); setCurrentView('HUB'); }} onCancel={() => setCurrentView('HUB')} />;
  if (currentView === 'ACTIVE_SESSION' && selectedProgram) return <ACT_SeanceEnCours program={selectedProgram} history={localActivities} onFinish={(d, b, id) => { onFinishSession(d, b, id); setCurrentView('HUB'); }} onCancel={() => setCurrentView('HUB')} />;
  if (currentView === 'CALENDAR') return <ACT_Calendrier activities={localActivities} programs={programs} onStartProgram={handleStartSession} onClose={() => setCurrentView('HUB')} />;
  if (currentView === 'HISTORY') return <ACT_HistoriqueSeances activities={localActivities} onClose={() => setCurrentView('HUB')} />;

  return (
    <div className="space-y-8 pb-32 bg-slate-50 min-h-screen pt-4 px-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-start pt-[env(safe-area-inset-top)]">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Musculation</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance & Force</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh} 
            className={`w-12 h-12 bg-white rounded-2xl shadow-pro border border-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all ${isRefreshing ? 'animate-spin text-brand-blue' : ''}`}
          >
             <RotateCw size={20} />
          </button>
          <button onClick={() => setCurrentView('HISTORY')} className="w-12 h-12 bg-white rounded-2xl shadow-pro border border-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
             <History size={20} />
          </button>
        </div>
      </header>

      {/* Hero: Reprendre l'entraînement - Ultra rounded */}
      <div className="relative h-56 rounded-[3.5rem] overflow-hidden shadow-pro group cursor-pointer active:scale-[0.98] transition-all" onClick={() => programs[0] && handleStartSession(programs[0])}>
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Gym" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-white text-3xl font-black mb-1 leading-none tracking-tighter">Dernière<br/>Séance</h2>
            <p className="text-slate-300 text-sm font-bold mb-4">Reprendre où vous en étiez</p>
            <div className="w-14 h-14 bg-brand-blue rounded-3xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Play fill="white" className="text-white ml-1" />
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setCurrentView('CREATE')} className="w-full bg-slate-900 py-5 rounded-[2rem] flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest text-white shadow-pro active:scale-95 transition-transform">
            <PenTool size={18} className="text-blue-400" /> Créer Programme
        </button>
      </div>

      {/* Section Programmes */}
      <div>
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-900 text-xl tracking-tighter">Mes Programmes</h3>
            <ChevronRight className="text-slate-300" size={24} />
        </div>
        <div className="grid grid-cols-1 gap-5">
            {programs.map(prog => (
                <div key={prog.id} onClick={() => handleStartSession(prog)} className="relative h-32 rounded-[2.5rem] overflow-hidden shadow-pro cursor-pointer active:scale-95 transition-transform">
                    <img src={prog.imageUrl || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80'} className="absolute inset-0 w-full h-full object-cover" alt="Prog" />
                    <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-center backdrop-blur-[2px]">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-black text-xl tracking-tight">{prog.name}</h4>
                            <span className="bg-yellow-400 text-black text-[8px] font-black px-2 py-0.5 rounded-md uppercase">{prog.programType}</span>
                        </div>
                        <p className="text-slate-200 text-xs font-bold">
                          {prog.lastPerformed ? `Dernièrement : ${prog.lastPerformed}` : 'Jamais effectué'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* SECTION RÉCENTE: Optimisée pour iPhone Pro */}
      <div className="mt-8 pb-10">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-900 text-xl tracking-tighter">Historique Rapide</h3>
            <button onClick={() => setCurrentView('HISTORY')} className="text-brand-blue text-xs font-black uppercase tracking-widest">Voir Tout</button>
        </div>
        
        {recentMuscuActivities.length > 0 ? (
           <div className="space-y-5">
              {recentMuscuActivities.map(act => {
                 const vol = calculateVolume(act.blocks);
                 const dateObj = new Date(act.date);
                 const isToday = new Date().toDateString() === dateObj.toDateString();
                 
                 return (
                   <div key={act.id} className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-pro flex flex-col gap-6 animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center text-brand-blue border border-slate-100">
                             <Dumbbell size={24} />
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center">
                                <h4 className="font-black text-slate-900 text-lg tracking-tight">Séance Muscu</h4>
                                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                                   {isToday ? "Aujourd'hui" : dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </span>
                             </div>
                             <div className="flex gap-5 mt-1">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                   <Clock size={16} className="text-slate-300" /> {act.durationMinutes}m
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-brand-blue font-bold">
                                   <Dumbbell size={16} className="text-brand-blue/30" /> {(vol / 1000).toFixed(1)}t
                                </div>
                             </div>
                          </div>
                      </div>

                      <div className="bg-slate-50/50 rounded-[2rem] p-5 space-y-3 border border-slate-100/50 shadow-inner">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                           <CheckCircle2 size={12} className="text-neon-green" /> Temps par exercice
                         </p>
                         {act.blocks?.map((block, bIdx) => (
                            <div key={bIdx} className="space-y-3">
                               {block.exercises.map((ex, exIdx) => (
                                  <div key={exIdx} className="flex justify-between items-center">
                                     <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                                        <span className="text-sm font-bold text-slate-800">{ex.name}</span>
                                     </div>
                                     <span className="text-xs font-black text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-100 shadow-sm">
                                        {formatExDuration(ex.durationSeconds)}
                                     </span>
                                  </div>
                               ))}
                            </div>
                         ))}
                      </div>
                   </div>
                 );
              })}
           </div>
        ) : (
           <div className="bg-slate-100/50 rounded-[2.5rem] p-12 text-center border border-dashed border-slate-200">
              <Dumbbell size={40} className="mx-auto text-slate-300 mb-4 opacity-30" />
              <p className="text-slate-800 text-lg font-black tracking-tight">Rien pour le moment</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Lancez votre première séance !</p>
           </div>
        )}
      </div>
    </div>
  );
};
