
import React from 'react';
import { UserProfile, ActivityLog } from '../types';
import { ChevronLeft, ShieldCheck, Sparkles, UserCog, Database } from 'lucide-react';
import { RecoveryMuscleMap } from '../components/RecoveryMuscleMap';

interface Props {
  user: UserProfile;
  activities: ActivityLog[];
  onBack: () => void;
}

export const AdminView: React.FC<Props> = ({ user, activities, onBack }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-6 px-6 animate-in slide-in-from-right">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-200 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck size={24} className="text-slate-900" /> Menu Admin
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuration Système</p>
        </div>
      </header>

      <div className="space-y-8">
        
        {/* Section Avatar Gen */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg text-white shadow-lg">
              <Sparkles size={18} />
            </div>
            <h3 className="font-bold text-slate-800">Personnalisation IA</h3>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Utilisez le générateur d'avatar pour créer un jumeau numérique basé sur votre morphologie. 
              <br/><strong className="text-slate-800">Cliquez sur l'icône de rafraîchissement pour lancer un scan, puis validez avec l'icône verte pour enregistrer.</strong>
            </p>
            
            <div className="overflow-hidden rounded-[2rem] border border-slate-100">
               {/* Suppression de mode="admin" qui causait l'erreur TS */}
               <RecoveryMuscleMap activities={activities} interactive={true} />
            </div>
          </div>
        </section>

        {/* Autres Paramètres */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
              <Database size={18} />
            </div>
            <h3 className="font-bold text-slate-800">Données</h3>
          </div>
          
          <div className="space-y-3">
             <button className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-left font-bold text-slate-600 flex justify-between items-center active:scale-98 transition-transform">
                <span>Exporter mes données (JSON)</span>
                <ChevronLeft className="rotate-180 text-slate-400" size={16} />
             </button>
             <button className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-left font-bold text-red-500 flex justify-between items-center active:scale-98 transition-transform">
                <span>Réinitialiser l'application</span>
                <UserCog size={16} />
             </button>
          </div>
        </section>

        <div className="text-center pt-8">
           <p className="text-[10px] text-slate-300 font-mono">WellTrack v1.0.2 • Build 2405</p>
        </div>

      </div>
    </div>
  );
};
