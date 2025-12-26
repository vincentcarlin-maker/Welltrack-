
import React, { useState } from 'react';
import { ActivityLog, WorkoutBlock } from '../../types';
import { ChevronLeft, ChevronDown, ChevronUp, Clock, Flame, Dumbbell, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  activities: ActivityLog[];
  onClose: () => void;
}

export const ACT_HistoriqueSeances: React.FC<Props> = ({ activities, onClose }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtrer uniquement les activités de musculation
  const muscuHistory = activities
    .filter(act => act.type === 'Musculation')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const calculateSessionVolume = (blocks?: WorkoutBlock[]) => {
    if (!blocks) return 0;
    let total = 0;
    blocks.forEach(b => {
      b.exercises.forEach(ex => {
        total += (ex.sets * ex.reps * ex.weight);
      });
    });
    return total;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatExerciseDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-4 px-6 pb-24 animate-in slide-in-from-right">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-800 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Historique Muscu</h2>
      </header>

      {muscuHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
           <Calendar size={64} className="mb-4 text-slate-300" />
           <p className="font-bold text-slate-500">Aucune séance enregistrée</p>
           <p className="text-xs">Commencez un programme pour voir vos progrès ici.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {muscuHistory.map(session => {
            const isExpanded = expandedId === session.id;
            const volume = calculateSessionVolume(session.blocks);

            return (
              <div 
                key={session.id} 
                className={`bg-white rounded-3xl border border-slate-100 shadow-sm transition-all overflow-hidden ${isExpanded ? 'ring-2 ring-brand-blue/10' : ''}`}
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="p-5 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Musculation</span>
                      <span className="text-[10px] text-slate-400">• {formatDate(session.date)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-800">{session.durationMinutes} min</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <Dumbbell size={12} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-800">{(volume / 1000).toFixed(1)}t</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <Flame size={12} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-800">{session.calories} kcal</span>
                       </div>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full transition-transform ${isExpanded ? 'bg-brand-blue text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>

                {isExpanded && session.blocks && (
                  <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top duration-300">
                    <div className="h-px bg-slate-50 mb-4" />
                    <div className="space-y-4">
                      {session.blocks.map((block, bIdx) => (
                        <div key={bIdx} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                           <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {block.type === 'SUPERSET' ? '⚡ Superset' : 'Exercice'}
                                </span>
                              </div>
                           </div>
                           <div className="space-y-4">
                              {block.exercises.map((ex, exIdx) => (
                                <div key={exIdx} className="border-b border-slate-200/50 pb-3 last:border-0 last:pb-0">
                                   <div className="flex justify-between items-start mb-2">
                                      <span className="text-sm font-bold text-slate-700">{ex.name}</span>
                                      <div className="flex gap-2">
                                         <span className="bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500">
                                           {ex.sets} × {ex.reps}
                                         </span>
                                         <span className="bg-brand-blue/10 px-2 py-0.5 rounded-lg border border-brand-blue/10 text-[10px] font-black text-brand-blue">
                                           {ex.weight} kg
                                         </span>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-white px-2 py-0.5 rounded-md border border-slate-100">
                                         <Clock size={10} /> {formatExerciseDuration(ex.durationSeconds)}
                                      </div>
                                      {ex.rpe && (
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-white px-2 py-0.5 rounded-md border border-slate-100">
                                           RPE {ex.rpe}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-1 text-[10px] text-brand-blue font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                                         Volume: {(ex.sets * ex.reps * ex.weight).toLocaleString()} kg
                                      </div>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
