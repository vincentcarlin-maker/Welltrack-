
import React, { useState, useEffect } from 'react';
import { ActivityLog } from '../types';
import { generateAvatarBase } from '../services/geminiService';
import { Scan, Sparkles, Loader2, Check, X, Trash2 } from 'lucide-react';

interface Props {
  activities: ActivityLog[];
  size?: number;
}

type MuscleStatus = 'fatigued' | 'recovering' | 'ready';

export const RecoveryMuscleMap: React.FC<Props> = ({ activities, size = 240 }) => {
  const [savedUrl, setSavedUrl] = useState<string | null>(localStorage.getItem('welltrack_avatar_scan'));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // L'image affichée est soit la prévisualisation, soit l'image sauvegardée
  const displayUrl = previewUrl || savedUrl;

  const handleGenerateAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    const url = await generateAvatarBase();
    if (url) {
      setPreviewUrl(url); // On met en prévisualisation uniquement, pas encore sauvegardé
    }
    setIsGenerating(false);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      setSavedUrl(previewUrl);
      localStorage.setItem('welltrack_avatar_scan', previewUrl);
      setPreviewUrl(null); // On sort du mode prévisualisation
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null); // On annule la prévisualisation, on revient à l'état précédent (savedUrl)
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Supprimer cet avatar ?")) {
        setSavedUrl(null);
        localStorage.removeItem('welltrack_avatar_scan');
    }
  };

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

  // Couleurs ajustées pour le mode Overlay (semi-transparent)
  const colors = {
    fatigued: 'rgba(251, 113, 133, 0.6)',   // Rose
    recovering: 'rgba(251, 191, 36, 0.5)', // Amber
    ready: 'rgba(52, 211, 153, 0.1)',      // Emerald (très transparent si prêt)
    stroke: 'rgba(255,255,255,0.4)'
  };

  const getMuscleColor = (target: string) => colors[getStatus(target)];

  return (
    <div className="relative flex flex-col items-center bg-[#0F172A] rounded-[3rem] p-0 border border-white/5 shadow-2xl overflow-hidden group min-h-[400px]">
      
      {/* Background & Image Layer */}
      <div className="absolute inset-0 z-0 bg-slate-900 flex items-center justify-center">
        {displayUrl ? (
          <>
            <img src={displayUrl} alt="AI Body Scan" className={`w-full h-full object-cover transition-opacity duration-500 ${previewUrl ? 'opacity-100' : 'opacity-90'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        )}
      </div>
      
      {/* Scanning Animation (Active seulement si pas d'image ou pendant génération) */}
      {(isGenerating || !displayUrl) && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent animate-[scan_4s_linear_infinite] z-20 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
      )}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* Interactive Layer */}
      <div className="relative z-10 w-full h-full flex flex-col items-center pt-8 pb-4">
        
        {/* Controls (Top Right) */}
        <div className="absolute top-4 right-4 flex gap-2 z-50">
           {previewUrl ? (
             <>
                <button 
                  onClick={handleCancel}
                  className="bg-red-500/20 backdrop-blur-md p-2 rounded-xl border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 animate-in zoom-in"
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={handleConfirm}
                  className="bg-emerald-500/20 backdrop-blur-md p-2 rounded-xl border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 animate-in zoom-in"
                >
                  <Check size={16} />
                </button>
             </>
           ) : (
             <>
               {savedUrl && (
                 <button 
                   onClick={handleDelete}
                   className="bg-black/20 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white/40 hover:text-red-400 transition-all active:scale-95"
                 >
                   <Trash2 size={16} />
                 </button>
               )}
               <button 
                onClick={handleGenerateAvatar}
                disabled={isGenerating}
                className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-cyan-400" />}
                <span className="sr-only">Générer Avatar Muscles</span>
              </button>
             </>
           )}
        </div>

        {/* SVG Overlay for Muscle Status */}
        <svg viewBox="0 0 120 220" style={{ width: size, height: 'auto' }} className="drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] mt-4">
          <defs>
            <filter id="glow-fatigue">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Si pas d'avatar, on affiche une silhouette de base */}
          {!displayUrl && (
            <path d="M60 10 C65 10 68 14 68 20 C68 26 65 30 60 30 C55 30 52 26 52 20 C52 14 55 10 60 10 Z" fill="#1E293B" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          )}
          
          {/* Muscle Zones (Clickable/Overlay) */}
          <g style={{ mixBlendMode: 'plus-lighter' }}>
             {/* Shoulders / Traps */}
             <path d="M40 40 Q60 32 80 40 L85 55 L35 55 Z" fill={getMuscleColor('Epaules')} stroke={colors.stroke} strokeWidth="0.5" className="transition-all duration-500 hover:opacity-80" />
             
             {/* Chest */}
             <path d="M42 45 Q60 40 78 45 C80 60 70 65 60 65 C50 65 40 60 42 45 Z" fill={getMuscleColor('Poitrine')} stroke={colors.stroke} strokeWidth="0.5" className="transition-all duration-500" />
             
             {/* Arms */}
             <path d="M32 45 L20 90 Q25 95 30 90 L38 55 Z" fill={getMuscleColor('Bras')} stroke={colors.stroke} strokeWidth="0.5" />
             <path d="M88 45 L100 90 Q95 95 90 90 L82 55 Z" fill={getMuscleColor('Bras')} stroke={colors.stroke} strokeWidth="0.5" />
             
             {/* Abs */}
             <path d="M48 68 Q60 65 72 68 L70 100 Q60 105 50 100 Z" fill={getMuscleColor('Abdominaux')} stroke={colors.stroke} strokeWidth="0.5" />
             
             {/* Legs */}
             <path d="M45 108 L35 180 Q45 185 55 180 L58 108 Z" fill={getMuscleColor('Jambes')} stroke={colors.stroke} strokeWidth="0.5" />
             <path d="M75 108 L85 180 Q75 185 65 180 L62 108 Z" fill={getMuscleColor('Jambes')} stroke={colors.stroke} strokeWidth="0.5" />
          </g>
        </svg>

        {/* Data Tags */}
        <div className="absolute top-1/3 left-4 flex flex-col items-start animate-in slide-in-from-left duration-1000">
           <div className="flex items-center gap-2 mb-1">
             <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${previewUrl ? 'bg-amber-400 text-amber-400 animate-pulse' : 'bg-cyan-400 text-cyan-400'}`}></div>
             <span className={`text-[7px] font-black uppercase tracking-widest ${previewUrl ? 'text-amber-200' : 'text-cyan-200'}`}>
               {previewUrl ? 'Validation...' : 'Scan.Active'}
             </span>
           </div>
           {!displayUrl && <span className="text-[8px] text-slate-500 max-w-[80px]">Générez votre avatar 3D avec Imagen</span>}
        </div>
      </div>

      {/* Legend Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6 z-30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]"></div>
          <span className="text-[8px] font-bold uppercase text-slate-300 tracking-widest">Prêt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]"></div>
          <span className="text-[8px] font-bold uppercase text-slate-300 tracking-widest">Récup.</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FB7185] shadow-[0_0_8px_#FB7185] animate-pulse"></div>
          <span className="text-[8px] font-bold uppercase text-slate-300 tracking-widest">Fatigue</span>
        </div>
      </div>
    </div>
  );
};
