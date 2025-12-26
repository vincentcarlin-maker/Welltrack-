
import React, { useState } from 'react';
import { Meal } from '../types';
import { Search, Plus, ScanBarcode, ChevronRight } from 'lucide-react';
import { NUT_AjoutRepas } from './nutrition/NUT_AjoutRepas';
import { NUT_AnalyseRepas } from './nutrition/NUT_AnalyseRepas';

interface NutritionViewProps {
  meals: Meal[];
  dailyCalories: number;
  addMeal: (meal: Meal) => void;
}

type NutritionSubView = 'LIST' | 'ADD_MANUAL' | 'ANALYZE_AI';

export const NutritionView: React.FC<NutritionViewProps> = ({ meals, dailyCalories, addMeal }) => {
  const [subView, setSubView] = useState<NutritionSubView>('LIST');
  const targetCalories = 2200;
  const progress = Math.min((dailyCalories / targetCalories) * 100, 100);

  if (subView === 'ADD_MANUAL') {
    return <NUT_AjoutRepas onSave={(meal) => { addMeal(meal); setSubView('LIST'); }} onCancel={() => setSubView('LIST')} />;
  }

  if (subView === 'ANALYZE_AI') {
    return <NUT_AnalyseRepas onSave={(meal) => { addMeal(meal); setSubView('LIST'); }} onCancel={() => setSubView('LIST')} />;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-6 px-6 animate-in fade-in duration-300">
       <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Nutrition</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suivi Journalier</p>
          </div>
          <button className="bg-white p-3 rounded-full shadow-sm text-slate-400 active:scale-90 transition-transform">
             <Search size={20} />
          </button>
       </header>

       <div className="flex items-center gap-8 mb-10">
          <div className="relative w-32 h-32 flex-shrink-0">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={365} strokeDashoffset={365 - (365 * progress) / 100} className="text-brand-blue transition-all duration-1000 ease-out" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{dailyCalories}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Kcal</span>
             </div>
          </div>

          <div className="flex-1 space-y-4">
             {[{ label: 'Protéines', val: '120g', color: 'bg-blue-500', w: '70%' },
               { label: 'Glucides', val: '210g', color: 'bg-green-500', w: '50%' },
               { label: 'Lipides', val: '55g', color: 'bg-orange-500', w: '30%' }
             ].map(m => (
               <div key={m.label}>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                     <span>{m.label}</span>
                     <span>{m.val}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${m.color}`} style={{ width: m.w }}></div>
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800 text-lg">Historique</h3>
             <span className="text-xs font-bold text-slate-400">{meals.length} repas</span>
          </div>
          <div className="space-y-4">
             {meals.map((meal, idx) => (
                <div key={meal.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform">
                   <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={meal.imageUrl || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80`} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{meal.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{meal.category}</p>
                   </div>
                   <div className="text-right">
                      <div className="font-black text-slate-900">{meal.calories}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">kcal</div>
                   </div>
                </div>
             ))}
          </div>
       </div>

       <div className="fixed bottom-24 right-6 flex flex-col gap-4">
          <button onClick={() => setSubView('ANALYZE_AI')} className="w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center active:scale-90 transition-transform border border-white/10">
             <ScanBarcode size={24} />
          </button>
          <button onClick={() => setSubView('ADD_MANUAL')} className="w-14 h-14 bg-brand-blue text-white rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center active:scale-90 transition-transform">
             <Plus size={24} />
          </button>
       </div>
    </div>
  );
};
