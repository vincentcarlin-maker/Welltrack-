
import React from 'react';
import { ShieldCheck, X, Lock, EyeOff } from 'lucide-react';
import { PERMISSION_TEXTS } from '../services/health/PermissionTexts';

interface Props {
  type: keyof typeof PERMISSION_TEXTS;
  onAllow: () => void;
  onDeny: () => void;
}

export const HealthPermissionGate: React.FC<Props> = ({ type, onAllow, onDeny }) => {
  const content = PERMISSION_TEXTS[type];

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom zoom-in-95 duration-500">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
            <ShieldCheck size={32} />
          </div>
          <button onClick={onDeny} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
          {content.title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
          {content.message}
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Lock size={12} className="text-brand-accent" /> Chiffrement de bout en bout
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <EyeOff size={12} className="text-brand-accent" /> Aucune revente de données
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onAllow}
            className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            {content.allow}
          </button>
          <button 
            onClick={onDeny}
            className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            {content.deny}
          </button>
        </div>
      </div>
    </div>
  );
};
