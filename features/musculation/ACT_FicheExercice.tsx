
import React, { useState, useMemo } from 'react';
import { ExerciseDef } from '../../data/exerciseData';
import { X, Check, AlertTriangle, Info, Plus, Play, Layers, Video, Minus, TrendingUp } from 'lucide-react';
import { MuscleMap } from '../../components/MuscleMap';
import { useAppData } from '../../hooks/useAppData';
import { getExerciseProgressionData, analyzeTrend } from '../../services/analyticsService';
import { LoadRpeGraph } from '../../components/graphs/LoadRpeGraph';
import { VolumeGraph } from '../../components/graphs/VolumeGraph';

interface Props {
  exercise: ExerciseDef;
  onClose: () => void;
  onAdd: (sets: number, reps: number, weight: number, restSeconds: number) => void;
}

const CounterInput = ({ label, value, onChange, step = 1, unit = '' }: any) => (
  <div className="flex flex-col items-center bg-slate-50 p-2 rounded-xl border border-slate-200 w-full">
    <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">{label}</span>
    <div className="flex items-center justify-between w-full">
      <button onClick={() => onChange(Math.max(0, value - step))} className="p-1 text-slate-400 hover:text-blue-500 active:bg-slate-200 rounded"><Minus size={14}/></button>
      <span className="font-bold text-slate-800 text-base">{value}<span className="text-[10px] ml-0.5 text-slate-400">{unit}</span></span>
      <button onClick={() => onChange(value + step)} className="p-1 text-slate-400 hover:text-blue-500 active:bg-slate-200 rounded"><Plus size={14}/></button>
    </div>
  </div>
);

export const ACT_FicheExercice: React.FC<Props> = ({ exercise, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'DEMO' | 'ANATOMY' | 'STATS'>('DEMO');
  const { activities } = useAppData();
  
  const [sets, setSets] = useState(4);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(10);
  const [rest, setRest] = useState(90);

  const graphData = useMemo(() => getExerciseProgressionData(exercise.name, activities), [exercise.name, activities]);
  const insight = useMemo(() => analyzeTrend(graphData), [graphData]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-50 pt-[env(safe-area-inset-top)] border-b border-slate-200 shadow-sm relative z-20">
        <div className="absolute top-4 right-4 z-50">
          <button onClick={onClose} className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-slate-800 border border-slate-100"><X size={20} /></button>
        </div>
        <div className="px-6 pt-4 pb-0">
           <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl mb-4 max-w-sm mx-auto">
              <button onClick={() => setActiveTab('DEMO')} className={`flex-1 py-2 rounded-lg text-[10px] font-black flex items-center justify-center gap-2 uppercase ${activeTab === 'DEMO' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                <Video size={14} /> Demo
              </button>
              <button onClick={() => setActiveTab('ANATOMY')} className={`flex-1 py-2 rounded-lg text-[10px] font-black flex items-center justify-center gap-2 uppercase ${activeTab === 'ANATOMY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                <Layers size={14} /> Muscle
              </button>
              <button onClick={() => setActiveTab('STATS')} className={`flex-1 py-2 rounded-lg text-[10px] font-black flex items-center justify-center gap-2 uppercase ${activeTab === 'STATS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                <TrendingUp size={14} /> Stats
              </button>
           </div>
           <div className="pb-6 h-52">
              {activeTab === 'DEMO' && (
                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <Play fill="white" className="text-white opacity-80" size={32} />
                  <p className="absolute bottom-4 text-white/50 text-[10px] font-black uppercase tracking-widest">Aperçu Technique</p>
                </div>
              )}
              {activeTab === 'ANATOMY' && (
                <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-inner h-full flex items-center justify-center">
                    <MuscleMap highlight={exercise.target} />
                </div>
              )}
              {activeTab === 'STATS' && (
                <div className="h-full">
                  {graphData.length >= 3 ? (
                    exercise.type === 'Polyarticulaire' 
                      ? <LoadRpeGraph data={graphData} insight={insight} />
                      : <VolumeGraph data={graphData} insight={insight} />
                  ) : (
                    <div className="h-full bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200">
                      <TrendingUp size={32} className="mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Besoin de 3 séances pour l'IA</p>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-64">
        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[10px] font-black uppercase">{exercise.muscleGroup}</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-black uppercase">{exercise.type}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tighter">{exercise.name}</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">{exercise.description}</p>
        </div>
        <div className="space-y-4 mb-8">
          <div className="bg-green-50 p-5 rounded-[2rem] border border-green-100 flex gap-4">
            <Check size={20} className="text-green-500 flex-shrink-0" />
            <p className="text-xs text-green-900 font-bold leading-relaxed">{exercise.tips}</p>
          </div>
          <div className="bg-red-50 p-5 rounded-[2rem] border border-red-100 flex gap-4">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-900 font-bold leading-relaxed">{exercise.commonErrors}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-[110] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 gap-2 mb-4">
            <CounterInput label="Séries" value={sets} onChange={setSets} />
            <CounterInput label="Reps" value={reps} onChange={setReps} />
            <CounterInput label="Kg" value={weight} onChange={setWeight} step={2.5} />
            <CounterInput label="Repos" value={rest} onChange={setRest} step={15} unit="s" />
        </div>
        <button onClick={() => onAdd(sets, reps, weight, rest)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-2">
          <Plus size={20} /> Ajouter à la séance
        </button>
      </div>
    </div>
  );
};
