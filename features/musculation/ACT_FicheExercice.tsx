import React, { useState } from 'react';
import { ExerciseDef } from '../../data/exerciseData';
import { X, Check, AlertTriangle, Info, Plus, Play, Layers, Video, Minus, Timer } from 'lucide-react';
import { MuscleMap } from '../../components/MuscleMap';

interface Props {
  exercise: ExerciseDef;
  onClose: () => void;
  onAdd: (sets: number, reps: number, weight: number, restSeconds: number) => void;
}

// Composant d'animation de Tempo CSS
const TempoVisualizer = ({ target }: { target: string }) => {
  return (
    <div className="w-full h-48 bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      <div className="flex items-end gap-12 relative z-10">
        <div className="flex flex-col items-center gap-2">
            <div className="h-32 w-2 bg-slate-700 rounded-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 bg-blue-500 rounded-full w-full h-full animate-[ping_2s_ease-in-out_infinite] opacity-20"></div>
                <div className="absolute top-0 left-0 right-0 bg-blue-500 rounded-full w-full h-4 animate-[bounce_2s_infinite]"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mouvement</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 border-2 border-blue-500/30 rounded-full flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                 <div className="w-24 h-24 border border-blue-400/50 rounded-full flex items-center justify-center">
                    <Play fill="white" className="text-white opacity-80" size={24} />
                 </div>
            </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center">
         <p className="text-blue-200 text-xs font-medium bg-blue-900/50 inline-block px-3 py-1 rounded-full border border-blue-500/20 backdrop-blur-sm">
            Simulateur de rythme • 2s / 1s
         </p>
      </div>
    </div>
  );
};

// Petit composant pour les compteurs
const CounterInput = ({ label, value, onChange, step = 1, unit = '' }: any) => (
  <div className="flex flex-col items-center bg-slate-50 p-2 rounded-xl border border-slate-200 w-full relative overflow-hidden">
    <span className="text-[9px] font-bold text-slate-400 uppercase mb-1 z-10 relative">{label}</span>
    <div className="flex items-center justify-between w-full relative z-10">
      <button onClick={() => onChange(Math.max(0, value - step))} className="p-1 text-slate-400 hover:text-blue-500 active:bg-slate-200 rounded"><Minus size={14}/></button>
      <span className="font-bold text-slate-800 text-base leading-none">{value}<span className="text-[10px] ml-0.5 text-slate-400">{unit}</span></span>
      <button onClick={() => onChange(value + step)} className="p-1 text-slate-400 hover:text-blue-500 active:bg-slate-200 rounded"><Plus size={14}/></button>
    </div>
  </div>
);

export const ACT_FicheExercice: React.FC<Props> = ({ exercise, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'DEMO' | 'ANATOMY'>('DEMO');
  
  // États locaux pour la configuration
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(10);
  const [rest, setRest] = useState(90);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      
      {/* Header avec Onglets */}
      <div className="bg-slate-50 pt-[env(safe-area-inset-top)] border-b border-slate-200 shadow-sm relative z-20 flex-shrink-0">
        <div className="absolute top-4 right-4 z-50">
          <button onClick={onClose} className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-slate-800 border border-slate-100 active:scale-95 transition-transform">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-4 pb-0">
           <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl mb-4 max-w-xs mx-auto">
              <button onClick={() => setActiveTab('DEMO')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'DEMO' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Video size={14} /> Animation
              </button>
              <button onClick={() => setActiveTab('ANATOMY')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'ANATOMY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                <Layers size={14} /> Anatomie
              </button>
           </div>
           <div className="pb-6 animate-in fade-in zoom-in-95 duration-300">
              {activeTab === 'DEMO' ? <TempoVisualizer target={exercise.target} /> : (
                <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-inner h-48 flex items-center justify-center">
                    <MuscleMap highlight={exercise.target} />
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Content Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-64 bg-white">
        <div className="mb-6">
          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{exercise.muscleGroup}</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{exercise.type}</span>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{exercise.level}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{exercise.name}</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">{exercise.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Info size={16} className="text-blue-500" /> Matériel requis
          </h3>
          <div className="flex flex-wrap gap-2">
            {exercise.equipment.map(eq => (
              <span key={eq} className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold">{eq}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
            <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2 text-sm"><Check size={18} /> Conseils d'exécution</h3>
            <p className="text-sm text-green-900 leading-relaxed opacity-90">{exercise.tips}</p>
          </div>
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
            <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2 text-sm"><AlertTriangle size={18} /> Erreurs à éviter</h3>
            <p className="text-sm text-red-900 leading-relaxed opacity-90">{exercise.commonErrors}</p>
          </div>
        </div>
      </div>

      {/* Footer Configuration */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-[110] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 gap-2 mb-4">
            <CounterInput label="Séries" value={sets} onChange={setSets} />
            <CounterInput label="Reps" value={reps} onChange={setReps} />
            <CounterInput label="Charge" value={weight} onChange={setWeight} step={2.5} unit="kg" />
            <CounterInput label="Repos" value={rest} onChange={setRest} step={15} unit="s" />
        </div>
        <button 
          onClick={() => onAdd(sets, reps, weight, rest)}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Plus size={20} /> Ajouter la séance
        </button>
      </div>
    </div>
  );
};