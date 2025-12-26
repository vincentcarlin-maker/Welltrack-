
import React, { useState } from 'react';
import { WorkoutProgram, WorkoutBlock, ActivityLog } from '../../types';
import { Play, ChevronRight, PenTool, Calendar as CalendarIcon } from 'lucide-react';
import { ACT_CreerEntrainement } from './ACT_CreerEntrainement';
import { ACT_SeanceEnCours } from './ACT_SeanceEnCours';
import { ACT_Calendrier } from './ACT_Calendrier';

interface ACT_MusculationProps {
  programs: WorkoutProgram[];
  userEquipment: string[];
  activities: ActivityLog[];
  onAddProgram: (p: WorkoutProgram) => void;
  onFinishSession: (duration: number, blocks: WorkoutBlock[]) => void;
}

type MuscuView = 'HUB' | 'CREATE' | 'ACTIVE_SESSION' | 'CALENDAR';

export const ACT_Musculation: React.FC<ACT_MusculationProps> = ({ programs, userEquipment, activities, onAddProgram, onFinishSession }) => {
  const [currentView, setCurrentView] = useState<MuscuView>('HUB');
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);

  const handleStartSession = (prog: WorkoutProgram) => {
    setSelectedProgram(prog);
    setCurrentView('ACTIVE_SESSION');
  };

  if (currentView === 'CREATE') return <ACT_CreerEntrainement userEquipment={userEquipment} onSave={(p) => { onAddProgram(p); setCurrentView('HUB'); }} onCancel={() => setCurrentView('HUB')} />;
  if (currentView === 'ACTIVE_SESSION' && selectedProgram) return <ACT_SeanceEnCours program={selectedProgram} history={activities} onFinish={(d, b) => { onFinishSession(d, b); setCurrentView('HUB'); }} onCancel={() => setCurrentView('HUB')} />;
  if (currentView === 'CALENDAR') return <ACT_Calendrier activities={activities} onClose={() => setCurrentView('HUB')} />;

  return (
    <div className="space-y-6 pb-20 bg-slate-50 min-h-screen pt-4 px-6">
      <header className="flex justify-between items-start">
        <div>
           <h1 className="text-2xl font-bold text-slate-900">Musculation</h1>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activité Musculaire</p>
        </div>
        <button onClick={() => setCurrentView('CALENDAR')} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 active:scale-95 transition-transform">
           <CalendarIcon size={20} />
        </button>
      </header>

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
                        <p className="text-slate-200 text-xs">{prog.lastPerformed || 'Prêt pour la séance'}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
