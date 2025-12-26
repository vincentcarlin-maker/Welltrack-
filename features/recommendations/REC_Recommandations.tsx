import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, ChevronLeft, RefreshCw, BrainCircuit, Heart, Utensils, Activity } from 'lucide-react';
import { getDailyRecommendations } from '../../services/geminiService';

interface Props {
  stats: any;
  onBack: () => void;
}

export const REC_Recommandations: React.FC<Props> = ({ stats, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [tips, setTips] = useState<string[]>([]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const context = `Pas: ${stats.dailySteps}, Calories: ${stats.dailyCalories}kcal, Sommeil: ${stats.dailySleep?.durationHours || 'inconnu'}h`;
      const res = await getDailyRecommendations(context);
      // Nettoyage sommaire de la réponse Gemini
      const cleanedTips = res.split('\n').filter(t => t.trim().length > 5).map(t => t.replace(/^[*-]\s*/, ''));
      setTips(cleanedTips.length > 0 ? cleanedTips : ["Continuez vos efforts quotidiens !", "Pensez à bien vous hydrater.", "Une marche de 10 minutes après le repas aide la digestion."]);
    } catch (error) {
      setTips(["Hydratation : Buvez 2L d'eau aujourd'hui.", "Mouvement : Faites quelques étirements.", "Sommeil : Évitez les écrans 30min avant de dormir."]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [stats]);

  const getIcon = (index: number) => {
    switch (index % 3) {
      case 0: return <Utensils className="text-orange-500" />;
      case 1: return <Activity className="text-green-500" />;
      default: return <Heart className="text-red-500" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-6 px-6 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
           <BrainCircuit size={20} className="text-brand-blue" /> IA Coach
        </h2>
        <button 
          onClick={fetchRecommendations} 
          disabled={loading}
          className={`p-2 bg-white rounded-full shadow-sm text-slate-400 ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={20} />
        </button>
      </header>

      <div className="bg-gradient-to-br from-brand-blue to-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <Sparkles className="mb-4 text-blue-200 animate-pulse" size={32} />
          <h1 className="text-2xl font-black mb-2">Recommandations du jour</h1>
          <p className="text-blue-100 text-sm opacity-90 leading-relaxed">
            Basé sur votre activité de {new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse space-y-3">
              <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
              <div className="h-3 w-full bg-slate-100 rounded"></div>
              <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
            </div>
          ))
        ) : (
          tips.map((tip, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex gap-4 animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                {getIcon(idx)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  {idx === 0 ? "Nutrition" : idx === 1 ? "Activité" : "Bien-être"}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{tip}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && (
        <div className="mt-8 p-6 bg-slate-100 rounded-[2rem] border border-dashed border-slate-300 flex items-center gap-3">
          <Lightbulb className="text-yellow-500" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">L'IA apprend de vos habitudes quotidiennes pour s'affiner.</p>
        </div>
      )}
    </div>
  );
};