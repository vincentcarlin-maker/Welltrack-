
import React, { useState, useEffect } from 'react';
import { WorkoutProgram, WorkoutBlock, ActivityLog } from '../../types';
import { Play, ChevronRight, PenTool, History, Calendar, CheckCircle2, Zap, BrainCircuit } from 'lucide-react';
import { ACT_CreerEntrainement } from './ACT_CreerEntrainement';
import { ACT_SeanceEnCours } from './ACT_SeanceEnCours';
import { ACT_Calendrier } from './ACT_Calendrier';
import { ACT_HistoriqueSeances } from './ACT_HistoriqueSeances';
import { RecoveryMuscleMap } from '../../components/RecoveryMuscleMap';

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
  const [localActivities, setLocalActivities] = useState<ActivityLog[]>(activities);

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  const handleStartSession = (prog: WorkoutProgram) => {
    setSelectedProgram(prog);
    setCurrentView('ACTIVE_SESSION');
  };

  const calculateReadiness = () => {
    if (localActivities.length === 0) return 100;
    const lastAct = localActivities.filter(a => a.type === 'Musculation')[0];
    if (!lastAct) return 100;
    const hours = (Date.now() - new Date(lastAct.date).getTime()) / (1000 * 60 * 60);
    if (hours < 24) return 45;
    if (hours < 48) return 75;
    return 95;
  };

  const readiness = calculateReadiness();

  if (currentView === 'CREATE') return <ACT_CreerEntrainement userEquipment={userEquipment} onSave={(p) => { onAddProgram(p); setCurrentView('HUB'); }} onCancel={() => setCurrentView('HUB')} />;
  if (currentView === 'ACTIVE_SESSION' && selectedProgram) return <ACT_SeanceEnCours program={selectedProgram} history={localActivities} onFinish={(d, b, id) => { onFinishSession(d, b, id); setCurrentView('HUB'); }} onCancel={() => setCurrentView('HUB')} />;
  if (currentView === 'CALENDAR') return <ACT_Calendrier activities={localActivities} programs={programs} onStartProgram={handleStartSession} onClose={() => setCurrentView('HUB')} />;
  if (currentView === 'HISTORY') return <ACT_HistoriqueSeances activities={localActivities} onClose={() => setCurrentView('HUB')} />;

  return (
    <div className="space-y-8 pb-32 bg-slate-50 min-h-screen pt-4 px-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-start pt-[env(safe-area-inset-top)]">
        <div>
           <h1 className="text-3xl font-[900] text-slate-900 tracking-tighter uppercase">Musculation</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fitrack Performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView('CALENDAR')} className="w-12 h-12 bg-white rounded-2xl shadow-pro border border-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-all">
             <Calendar size={20} className="text-brand-blue" />
          </button>
          <button onClick={() => setCurrentView('HISTORY')} className="w-12 h-12 bg-white rounded-2xl shadow-pro border border-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-transform">
             <History size={20} />
          </button>
        </div>
      </header>

      {/* Section Récupération */}
      <section className="animate-in slide-in-from-bottom duration-700">
        <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <h3 className="font-[900] text-slate-900 text-lg tracking-tight uppercase">Récupération</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fitrack Scan</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-[900] ${readiness > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>{readiness}%</span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dispo</p>
          </div>
        </div>
        <RecoveryMuscleMap activities={localActivities} />
      </section>

      {/* Suggestion Coach Fitrack */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden group active:scale-98 transition-all cursor-pointer" onClick={() => programs[0] && handleStartSession(programs[0])}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
         <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center shadow-glow">
                <BrainCircuit size={24} className="text-white" />
            </div>
            <div className="flex-1">
               <h4 className="font-black text-sm uppercase tracking-widest text-brand-accent">Coach Fitrack</h4>
               <p className="text-lg font-bold leading-tight">
                {readiness > 70 ? "Prêt pour une nouvelle performance ?" : "Focus sur la technique aujourd'hui."}
               </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
               <ChevronRight size={20} />
            </div>
         </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setCurrentView('CREATE')} className="w-full bg-white border border-slate-100 py-5 rounded-[2rem] flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-900 shadow-pro active:scale-95 transition-transform">
            <PenTool size={18} className="text-brand-blue" /> Nouveau Programme
        </button>
      </div>

      {/* Liste des programmes */}
      <div>
        <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-[900] text-slate-900 text-xl tracking-tighter uppercase">Mes Séances</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{programs.length} Packs</span>
        </div>
        <div className="grid grid-cols-1 gap-5">
            {programs.map(prog => (
                <div key={prog.id} onClick={() => handleStartSession(prog)} className="bg-white p-5 rounded-[2.5rem] shadow-pro border border-slate-50 flex items-center gap-5 cursor-pointer active:scale-95 transition-transform">
                    <div className="w-16 h-16 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0">
                       <img src={prog.imageUrl || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80'} className="w-full h-full object-cover" alt="Prog" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-[900] text-slate-900 text-lg tracking-tight leading-none mb-1 uppercase">{prog.name}</h4>
                        <div className="flex gap-2 items-center">
                           <span className="bg-blue-50 text-brand-blue text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">{prog.programType}</span>
                           <p className="text-slate-400 text-[10px] font-bold">
                              {prog.lastPerformed ? prog.lastPerformed : 'Nouveau'}
                           </p>
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-300 group-hover:text-brand-blue transition-colors">
                       <Play fill="currentColor" size={16} />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
