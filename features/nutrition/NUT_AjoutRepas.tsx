
import React, { useState } from 'react';
import { Meal, MealCategory } from '../../types';
import { ChevronLeft, Save, Utensils, Zap, Flame, Target } from 'lucide-react';

interface Props {
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

const CATEGORIES: MealCategory[] = ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'];

export const NUT_AjoutRepas: React.FC<Props> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MealCategory>('Déjeuner');
  const [calories, setCalories] = useState('400');
  const [protein, setProtein] = useState('20');
  const [carbs, setCarbs] = useState('40');
  const [fats, setFats] = useState('10');

  const handleSave = () => {
    if (!name) return;
    onSave({
      id: Date.now().toString(),
      name,
      category,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fats: parseInt(fats),
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-6 px-6 animate-in slide-in-from-right">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 -ml-2 text-slate-800"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold text-slate-800">Ajouter un repas</h2>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom du plat</label>
          <input 
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Ex: Salade César au poulet"
            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none font-bold text-slate-800 focus:border-brand-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Catégorie</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} onClick={() => setCategory(cat)}
                className={`py-3 rounded-2xl text-xs font-bold border transition-all ${category === cat ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-2 mb-4 text-brand-blue">
              <Flame size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">Valeurs nutritionnelles</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Calories (kcal)</label>
                 <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Protéines (g)</label>
                 <input type="number" value={protein} onChange={e => setProtein(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Glucides (g)</label>
                 <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase">Lipides (g)</label>
                 <input type="number" value={fats} onChange={e => setFats(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold" />
              </div>
           </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Save size={20} /> Enregistrer le repas
        </button>
      </div>
    </div>
  );
};
