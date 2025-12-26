import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { useAppData } from '../hooks/useAppData';
import { ACT_Musculation } from './musculation/ACT_Musculation';
import { Settings, Dumbbell, X, Check } from 'lucide-react';

interface ActivityViewProps {
  activities: ActivityLog[];
  dailySteps: number;
  addActivity: (act: ActivityLog) => void;
}

const ALL_EQUIPMENT = [
  'Poids du corps', 'Haltères', 'Barre', 'Banc', 
  'Poulie', 'Machines', 'Barre de Traction', 
  'Elastiques', 'Kettlebell'
];

export const ActivityView: React.FC<ActivityViewProps> = ({ activities, dailySteps, addActivity }) => {
  const { user, programs, actions } = useAppData();
  const [showSettings, setShowSettings] = useState(false);
  const [tempEquip, setTempEquip] = useState<string[]>([]);

  const openSettings = () => {
    setTempEquip(user.availableEquipment);
    setShowSettings(true);
  };

  const toggleEquip = (eq: string) => {
    if (tempEquip.includes(eq)) {
      setTempEquip(prev => prev.filter(e => e !== eq));
    } else {
      setTempEquip(prev => [...prev, eq]);
    }
  };

  const saveSettings = () => {
    actions.updateUser({ availableEquipment: tempEquip });
    setShowSettings(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 px-6 pt-6 relative">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Activité</h2>
        <div className="flex gap-2">
           <button onClick={openSettings} className="bg-white p-2 rounded-full shadow-sm text-slate-400 hover:text-blue-500 transition-colors">
             <Settings size={20} />
           </button>
        </div>
      </header>

      {/* Integration Module Musculation */}
      <div className="mt-4">
         <ACT_Musculation 
            programs={programs} 
            userEquipment={user.availableEquipment}
            activities={activities}
            onAddProgram={actions.addProgram}
            onFinishSession={(duration, blocks) => {
               actions.addActivity({
                   id: Date.now().toString(),
                   type: 'Musculation',
                   durationMinutes: duration,
                   calories: duration * 6, // Approx
                   date: new Date().toISOString(),
                   blocks: blocks
               });
            }}
         />
      </div>

      {/* Modale Paramètres Matériel - Centrée */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
              <header className="flex justify-between items-center mb-6 flex-shrink-0">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Dumbbell className="text-blue-500" /> Mon Matériel
                 </h3>
                 <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                    <X size={20} />
                 </button>
              </header>

              <div className="space-y-6 overflow-y-auto pr-1">
                 <p className="text-sm text-slate-500">Sélectionnez le matériel dont vous disposez. Cela permettra de filtrer les exercices et de générer des programmes adaptés.</p>
                 
                 <div className="flex flex-wrap gap-2">
                    {ALL_EQUIPMENT.map(eq => {
                       const isSelected = tempEquip.includes(eq);
                       return (
                         <button 
                            key={eq} 
                            onClick={() => toggleEquip(eq)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${isSelected ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
                         >
                            {isSelected && <Check size={12} />}
                            {eq}
                         </button>
                       );
                    })}
                 </div>

                 <button onClick={saveSettings} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform sticky bottom-0">
                    Enregistrer le matériel
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};