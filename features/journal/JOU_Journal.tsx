import React, { useState } from 'react';
import { JournalEntry } from '../../types';
import { ChevronLeft, Save, Smile, Frown, Meh, Sun, Moon, Zap, PenLine } from 'lucide-react';

interface Props {
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const MOODS = [
  { val: 1, icon: <Frown />, label: 'Triste', color: 'text-red-500' },
  { val: 2, icon: <Meh />, label: 'Fatigué', color: 'text-orange-500' },
  { val: 3, icon: <Smile />, label: 'Bien', color: 'text-yellow-500' },
  { val: 4, icon: <Zap />, label: 'Énergie', color: 'text-green-500' },
  { val: 5, icon: <Sun />, label: 'Super', color: 'text-brand-blue' },
];

export const JOU_Journal: React.FC<Props> = ({ onSave, onCancel }) => {
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    onSave({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      energy,
      notes
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-6 px-6 animate-in slide-in-from-right">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-800"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold text-slate-800">Journal de Bord</h2>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-4 text-center">Comment vous sentez-vous ?</label>
          <div className="flex justify-around items-center">
            {MOODS.map((m) => (
              <button 
                key={m.val} 
                onClick={() => setMood(m.val)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${mood === m.val ? 'bg-slate-100 scale-110 shadow-inner' : 'opacity-40 grayscale'}`}
              >
                {/* FIX: cast icon to ReactElement with expected 'size' prop to avoid TS error */}
                <div className={`${m.color}`}>{React.cloneElement(m.icon as React.ReactElement<{ size?: number }>, { size: 32 })}</div>
                <span className="text-[10px] font-bold">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
             <label className="text-xs font-bold text-slate-400 uppercase">Niveau d'Énergie</label>
             <span className="text-brand-blue font-black">{energy}/5</span>
          </div>
          <input 
            type="range" min="1" max="5" step="1" 
            value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-blue mb-2"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-300">
            <span>Épuisé</span>
            <span>Productif</span>
            <span>Incassable</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3">
            <PenLine size={14} /> Notes personnelles
          </label>
          <textarea 
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Une pensée, une victoire ou un défi aujourd'hui ?"
            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none text-sm text-slate-700 min-h-[120px] resize-none focus:border-brand-blue"
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Save size={20} /> Enregistrer l'entrée
        </button>
      </div>
    </div>
  );
};