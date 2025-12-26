
import React from 'react';
import { Supplement } from '../../types';
import { ChevronLeft, Pill, Bell, CheckCircle2, Clock, Plus, Zap } from 'lucide-react';

interface Props {
  supplements: Supplement[];
  onToggle: (id: string) => void;
  onBack: () => void;
}

export const COM_Complements: React.FC<Props> = ({ supplements, onToggle, onBack }) => {
  const takenCount = supplements.filter(s => s.taken).length;
  const progress = (takenCount / supplements.length) * 100;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-6 px-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 active:scale-90 transition-transform">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-900">Compléments</h2>
        <button className="p-2 bg-white rounded-full shadow-sm text-slate-400">
          <Bell size={20} />
        </button>
      </header>

      {/* Hero Progress Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Objectif du jour</span>
              <h3 className="text-3xl font-black">{takenCount} / {supplements.length}</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-700" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
          <Pill size={16} className="text-indigo-500" /> Planning quotidien
        </h3>
        
        {supplements.map((sup) => (
          <div 
            key={sup.id} 
            onClick={() => onToggle(sup.id)}
            className={`p-5 rounded-2xl border transition-all flex items-center gap-4 active:scale-95 cursor-pointer ${sup.taken ? 'bg-indigo-50 border-indigo-100 shadow-inner' : 'bg-white border-slate-100 shadow-sm'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${sup.taken ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <Zap size={20} fill={sup.taken ? "white" : "none"} />
            </div>
            
            <div className="flex-1">
              <h4 className={`font-bold text-sm ${sup.taken ? 'text-indigo-900 line-through opacity-50' : 'text-slate-800'}`}>
                {sup.name}
              </h4>
              <div className="flex items-center gap-1 mt-0.5 text-slate-400">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase">{sup.time}</span>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${sup.taken ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-slate-200'}`}>
              {sup.taken && <CheckCircle2 size={16} className="text-white" />}
            </div>
          </div>
        ))}

        <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-100 mt-4">
          <Plus size={20} /> Nouveau rappel
        </button>
      </div>
    </div>
  );
};
