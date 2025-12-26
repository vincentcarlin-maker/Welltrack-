
import React, { useState, useRef } from 'react';
import { Meal } from '../../types';
import { analyzeMealImage } from '../../services/geminiService';
import { ChevronLeft, Camera, Loader2, Sparkles, Check, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

export const NUT_AnalyseRepas: React.FC<Props> = ({ onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setPreviewUrl(reader.result as string);
      setLoading(true);
      try {
        const analysis = await analyzeMealImage(base64);
        setResult(analysis);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!result) return;
    onSave({
      id: Date.now().toString(),
      name: result.name,
      category: 'Déjeuner',
      calories: result.calories,
      protein: result.macros.p,
      carbs: result.macros.c,
      fats: result.macros.f,
      timestamp: new Date().toISOString(),
      imageUrl: previewUrl || undefined
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white pb-24 pt-6 px-6 flex flex-col animate-in fade-in">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="p-2 -ml-2 text-white/70"><ChevronLeft size={24} /></button>
        <h2 className="text-xl font-bold">Analyse IA</h2>
      </header>

      {!previewUrl && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative">
             <div className="absolute inset-0 bg-brand-blue/20 blur-2xl rounded-full"></div>
             <Camera size={48} className="text-brand-blue relative z-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black mb-2">Prenez votre plat en photo</h3>
            <p className="text-slate-400 text-sm max-w-[250px]">L'IA WellTrack identifiera les ingrédients et estimera les calories pour vous.</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-transform flex items-center gap-2"
          >
            <ImageIcon size={20} /> Choisir une photo
          </button>
          <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
      )}

      {previewUrl && (
        <div className="flex-1 flex flex-col">
          <div className="aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl mb-8 relative">
             <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
             {loading && (
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 size={48} className="animate-spin text-brand-blue mb-4" />
                  <p className="font-bold text-sm animate-pulse">Analyse nutritionnelle...</p>
               </div>
             )}
          </div>

          {result && !loading && (
            <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 animate-in slide-in-from-bottom">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest flex items-center gap-1">
                       <Sparkles size={10} /> Identification IA
                    </span>
                    <h4 className="text-xl font-bold">{result.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">{result.calories}</span>
                    <span className="text-[10px] block font-bold text-slate-400 uppercase">kcal</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                     <span className="block font-bold">{result.macros.p}g</span>
                     <span className="text-[8px] text-slate-500 uppercase font-black">Prot</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                     <span className="block font-bold">{result.macros.c}g</span>
                     <span className="text-[8px] text-slate-500 uppercase font-black">Gluc</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-center">
                     <span className="block font-bold">{result.macros.f}g</span>
                     <span className="text-[8px] text-slate-500 uppercase font-black">Lip</span>
                  </div>
               </div>

               <div className="flex gap-3">
                  <button onClick={() => {setPreviewUrl(null); setResult(null);}} className="flex-1 bg-white/10 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                     <X size={18} /> Annuler
                  </button>
                  <button onClick={handleConfirm} className="flex-[2] bg-brand-blue py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                     <Check size={18} /> Valider le repas
                  </button>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
