
import { Check, Loader2, RefreshCw, X, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { generateAvatarBase } from '../services/geminiService';
import { ActivityLog } from '../types';

interface Props {
  activities: ActivityLog[];
  size?: number;
  interactive?: boolean;
}

type MuscleStatus = 'fatigued' | 'recovering' | 'ready';

export const RecoveryMuscleMap: React.FC<Props> = ({ activities, interactive = true }) => {
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mapping pour l'IA (Français -> Termes anatomiques anglais pour plus de précision)
  const muscleMapping: Record<string, string> = {
    'Poitrine': 'Pectoralis Major muscles',
    'Epaules': 'Deltoid muscles',
    'Bras': 'Biceps Brachii and Triceps Brachii muscles',
    'Abdominaux': 'Abdominal Rectus and Oblique muscles',
    'Jambes': 'Quadriceps Femoris and Calves muscles',
    'Dos': 'Latissimus Dorsi and Trapezius muscles'
  };

  useEffect(() => {
    const stored = localStorage.getItem('welltrack_avatar_scan');
    if (stored) setSavedUrl(stored);
  }, []);

  const getStatus = (muscle: string): MuscleStatus => {
    const lastSession = activities
      .filter(a => a.blocks?.some(b => b.exercises.some(e => e.name.toLowerCase().includes(muscle.toLowerCase()) || e.name === muscle)))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!lastSession) return 'ready';
    
    const hoursSince = (Date.now() - new Date(lastSession.date).getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) return 'fatigued';
    if (hoursSince < 48) return 'recovering';
    return 'ready';
  };

  const buildMuscleStatusDescription = () => {
    return Object.keys(muscleMapping).map(m => {
      const status = getStatus(m);
      const anatomyName = muscleMapping[m];
      let colorInstruction = "matte dark grey";
      
      if (status === 'fatigued') colorInstruction = "VIBRANT GLOWING NEON RED (representing high muscle fatigue)";
      if (status === 'recovering') colorInstruction = "GLOWING AMBER ORANGE (representing recovery phase)";
      if (status === 'ready') colorInstruction = "INTENSE GLOWING EMERALD GREEN (representing fully ready and recovered)";
      
      return `- ${anatomyName}: ${colorInstruction}`;
    }).join("\n");
  };

  const handleGenerateAvatar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGenerating(true);
    try {
      const description = buildMuscleStatusDescription();
      const url = await generateAvatarBase(description);
      if (url) {
        setPreviewUrl(url);
      }
    } catch (err) {
      console.error("Erreur de génération d'avatar:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (previewUrl) {
      setSavedUrl(previewUrl);
      localStorage.setItem('welltrack_avatar_scan', previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(null);
  };

  const displayUrl = previewUrl || savedUrl;

  return (
    <div className="relative w-full aspect-[4/5] bg-[#070B14] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
      
      {/* Affichage de l'image (Preview ou Saved) */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center">
        {displayUrl ? (
          <>
            <img 
              src={displayUrl} 
              alt="Bio-Scan Avatar" 
              className={`w-full h-full object-cover transition-all duration-1000 ${isGenerating ? 'blur-md opacity-40 scale-105' : 'opacity-100 scale-100'}`} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-60"></div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#070B14]">
             <div className="w-full h-full opacity-5 absolute" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 animate-pulse">
                <Zap className="text-emerald-500" size={32} />
             </div>
             <h4 className="text-white font-black uppercase tracking-tighter text-lg mb-2">Scanner Bio-Ready</h4>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">Générez votre jumeau numérique pour visualiser l'activation de vos fibres musculaires.</p>
          </div>
        )}
      </div>

      {/* Laser de Scan */}
      {(isGenerating || displayUrl) && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-[scan_4s_linear_infinite] z-20 shadow-[0_0_15px_rgba(16,185,129,0.8)] opacity-60"></div>
      )}
      <style>{`
        @keyframes scan {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 105%; opacity: 0; }
        }
      `}</style>

      {/* HUD & Interface Utilisateur */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8">
        
        {/* Barre Supérieure: Statut et Contrôles */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/10">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400">Bio.Integrity: {previewUrl ? 'Scanning...' : 'Locked'}</span>
            </div>
            {displayUrl && (
              <div className="px-3 py-1 bg-white/5 backdrop-blur-sm rounded-lg border border-white/5">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Model_Type: Ecorche_Fiber_Optic</span>
              </div>
            )}
          </div>

          {interactive && (
            <div className="flex gap-2">
               {previewUrl ? (
                 <>
                    <button onClick={handleConfirm} className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-transform">
                      <Check size={20} />
                    </button>
                    <button onClick={handleCancel} className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-transform">
                      <X size={20} />
                    </button>
                 </>
               ) : (
                 <button 
                    onClick={handleGenerateAvatar} 
                    disabled={isGenerating}
                    className={`p-3 rounded-2xl backdrop-blur-xl border transition-all active:scale-90 ${isGenerating ? 'bg-white/5 border-white/5' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}
                  >
                    {isGenerating ? <Loader2 size={20} className="animate-spin text-emerald-400" /> : <RefreshCw size={20} className="text-emerald-400" />}
                  </button>
               )}
            </div>
          )}
        </div>

        {/* HUD Bas de Carte: Légende */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4 py-3 px-6 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5 w-fit mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[7px] font-black uppercase text-white/40 tracking-widest">Récupéré</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
              <span className="text-[7px] font-black uppercase text-white/40 tracking-widest">En Récup.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
              <span className="text-[7px] font-black uppercase text-white/40 tracking-widest">Fatigue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de chargement dynamique */}
      {isGenerating && (
        <div className="absolute inset-0 z-40 bg-[#070B14]/85 backdrop-blur-lg flex flex-col items-center justify-center p-12 text-center">
           <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse"></div>
              <Loader2 size={56} className="text-emerald-400 animate-spin relative z-10" />
           </div>
           <h4 className="text-xl font-black uppercase tracking-tighter mb-3 text-white">Analyse Bio-Anatomique</h4>
           <div className="space-y-2">
              <p className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em]">Coloration des fibres musculaires...</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">L'IA applique des couleurs bioluminescentes basées sur votre volume d'entraînement récent.</p>
           </div>
        </div>
      )}
    </div>
  );
};
