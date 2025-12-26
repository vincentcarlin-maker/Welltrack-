
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

  const handleStartSession = (prog: WorkoutProgram) => {
    setSelectedProgram(prog);
    setCurrentView('ACTIVE_SESSION');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simule une vérification du stockage local
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Récupérer les 3 dernières séances de musculation (triées par date décroissante)
  const recentMuscuActivities = activities
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
  if (currentView === 'ACTIVE_SESSION' && selectedProgram) return <ACT_SeanceEnCours program={selectedProgram} history={activities} onFinish={(d, b, id) => { onFinishSession(d, b, id); setCurrentView('HUB'); }} onCancel={() => setCurrentView('HUB')} />;
  if (currentView === 'CALENDAR') return <ACT_Calendrier activities={activities} programs={programs} onStartProgram={handleStartSession} onClose={() => setCurrentView('HUB')} />;
  if (currentView === 'HISTORY') return <ACT_HistoriqueSeances activities={activities} onClose={() => setCurrentView('HUB')} />;

  return (
    <div className="space-y-6 pb-20 bg-slate-50 min-h-screen pt-4 px-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Musculation</h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activité Musculaire</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh} 
            className={`p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 active:scale-95 transition-all ${isRefreshing ? 'animate-spin text-brand-blue' : ''}`}
          >
             <RotateCw size={20} />
          </button>
          <button onClick={() => setCurrentView('HISTORY')} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 active:scale-95 transition-transform">
             <History size={20} />
          </button>
        </div>
      </header>

      {/* Hero: Reprendre l'entraînement */}
      <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer" onClick={() => programs[0] && handleStartSession(programs[0])}>
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Gym" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-center p-6">
            <h2 className="text-white text-2xl font-bold mb-1">Continuer<br/>l'entraînement</h2>
            <p className="text-slate-300 text-sm mb-4">Reprendre le dernier programme</p>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <Play fill="white" className="text-white ml-1" />
            </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setCurrentView('CREATE')} className="w-full bg-slate-900 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-lg active:scale-95 transition-transform">
            <PenTool size={18} className="text-blue-400" /> Créer un programme
        </button>
      </div>

      {/* Section Programmes */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Mes entraînements</h3>
            <ChevronRight className="text-slate-400" size={20} />
        </div>
        <div className="space-y-4">
            {programs.map(prog => (
                <div key={prog.id} onClick={() => handleStartSession(prog)} className="relative h-28 rounded-3xl overflow-hidden shadow-lg cursor-pointer active:scale-95 transition-transform">
                    <img src={prog.imageUrl || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80'} className="absolute inset-0 w-full h-full object-cover" alt="Prog" />
                    <div className="absolute inset-0 bg-black/50 p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-bold text-xl">{prog.name}</h4>
                            <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">{prog.programType}</span>
                        </div>
                        <p className="text-slate-200 text-xs">
                          {prog.lastPerformed ? `Dernière séance : ${prog.lastPerformed}` : 'Prêt pour la séance'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* SECTION ACTUALISÉE: Séances récentes avec détail temps/exercice */}
      <div className="mt-8 pb-10">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Séances récentes</h3>
            <button onClick={() => setCurrentView('HISTORY')} className="text-brand-blue text-xs font-bold uppercase tracking-widest">Voir historique</button>
        </div>
        
        {recentMuscuActivities.length > 0 ? (
           <div className="space-y-4">
              {recentMuscuActivities.map(act => {
                 const vol = calculateVolume(act.blocks);
                 const dateObj = new Date(act.date);
                 const isToday = new Date().toDateString() === dateObj.toDateString();
                 
                 return (
                   <div key={act.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-blue border border-slate-100">
                             <Dumbbell size={22} />
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center">
                                <h4 className="font-bold text-slate-800 text-base">Séance Musculation</h4>
                                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-lg">
                                   {isToday ? "Aujourd'hui" : dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                </span>
                             </div>
                             <div className="flex gap-4 mt-1">
                                <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                                   <Clock size={14} className="text-slate-400" /> {act.durationMinutes} min
                                </div>
                                <div className="flex items-center gap-1 text-xs text-brand-blue font-bold">
                                   <Dumbbell size={14} className="text-brand-blue/60" /> {(vol / 1000).toFixed(1)}t soulevé
                                </div>
                             </div>
                          </div>
                      </div>

                      {/* Détail rapide des exercices et du temps */}
                      <div className="bg-slate-50/80 rounded-2xl p-4 space-y-2 border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Clock size={12} /> Détail par exercice
                         </p>
                         {act.blocks?.map((block, bIdx) => (
                            <div key={bIdx} className="space-y-2">
                               {block.exercises.map((ex, exIdx) => (
                                  <div key={exIdx} className="flex justify-between items-center">
                                     <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/30"></div>
                                        <span className="text-xs font-bold text-slate-700">{ex.name}</span>
                                     </div>
                                     <span className="text-[10px] font-black text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-100">
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
           <div className="bg-slate-100/50 rounded-2xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm font-bold">Aucune séance pour le moment</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Complétez votre premier entraînement !</p>
           </div>
        )}
      </div>
    </div>
  );
};
