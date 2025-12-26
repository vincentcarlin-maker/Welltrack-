
import React, { useState } from 'react';
import { WorkoutProgram, ProgramType, WorkoutBlock, ExerciseDetail } from '../../types';
import { ChevronLeft, Plus, Save, Trash2, X, Dumbbell, GripVertical, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { EXERCISE_DB, ExerciseDef } from '../../data/exerciseData';
import { ACT_FicheExercice } from './ACT_FicheExercice';

interface Props {
  userEquipment: string[];
  onSave: (program: WorkoutProgram) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Définition des templates pour l'auto-complétion
const PRESET_WORKOUTS: Record<string, string[]> = {
  'PUSH': ['Développé couché barre', 'Développé militaire haltères', 'Dips (parallèles)', 'Extensions poulie haute'],
  'PULL': ['Tractions pronation', 'Rowing barre', 'Oiseau haltères', 'Curl barre'],
  'LEGS': ['Squat barre', 'Fentes avant', 'Leg curl', 'Extensions mollets debout'],
  'FULL_BODY': ['Squat barre', 'Développé couché barre', 'Tractions pronation', 'Développé militaire barre', 'Gainage'],
};

export const ACT_CreerEntrainement: React.FC<Props> = ({ userEquipment, onSave, onCancel }) => {
  const [step, setStep] = useState<'DETAILS' | 'PICKER'>('DETAILS');
  const [name, setName] = useState('');
  const [type, setType] = useState<ProgramType>('CUSTOM');
  const [scheduledDay, setScheduledDay] = useState<string | undefined>(undefined);
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([]);
  const [pickerCategory, setPickerCategory] = useState<string>('Poitrine');
  const [filterByEquip, setFilterByEquip] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [viewedExercise, setViewedExercise] = useState<ExerciseDef | null>(null);
  const [targetBlockIndex, setTargetBlockIndex] = useState<number | null>(null);

  // Fonction pour appliquer un template
  const applyPreset = (programType: ProgramType) => {
    setType(programType);
    setError(null);

    if (programType === 'CUSTOM') {
      setBlocks([]); // Vide si personnalisé
      setName('');
      return;
    }

    // Génération du nom automatique
    const typeLabels: Record<string, string> = {
      'PUSH': 'Ma Séance Pousse (Push)',
      'PULL': 'Ma Séance Tirage (Pull)',
      'LEGS': 'Ma Séance Jambes (Legs)',
      'FULL_BODY': 'Mon Full Body complet'
    };
    setName(typeLabels[programType] || '');

    // Récupération des exercices du template
    const exerciseNames = PRESET_WORKOUTS[programType] || [];
    const newBlocks: WorkoutBlock[] = [];

    // On cherche les exercices dans la DB pour créer les blocs
    exerciseNames.forEach(exName => {
      // On cherche dans toutes les catégories de la DB
      let foundEx: ExerciseDef | undefined;
      for (const cat in EXERCISE_DB) {
        const match = EXERCISE_DB[cat].find(e => e.name === exName);
        if (match) {
          foundEx = match;
          break;
        }
      }

      if (foundEx) {
        newBlocks.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'SINGLE',
          exercises: [{
            name: foundEx.name,
            sets: 4,
            reps: 10,
            weight: 0,
            restSeconds: 90
          }]
        });
      }
    });

    setBlocks(newBlocks);
  };

  const handleSave = () => {
    setError(null);
    if (!name.trim()) {
      setError("Veuillez donner un nom à votre entraînement");
      return;
    }
    if (blocks.length === 0) {
      setError("Add au moins un exercice au programme");
      return;
    }

    onSave({ 
      id: Date.now().toString(), name, programType: type, blocks, 
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80',
      lastPerformed: 'Jamais',
      scheduledDay: scheduledDay
    });
  };

  const openPicker = (blockIndex: number | null) => {
    setTargetBlockIndex(blockIndex);
    setStep('PICKER');
    setError(null);
  };

  const addExercise = (exName: string, sets: number, reps: number, weight: number, restSeconds: number) => {
    const newEx: ExerciseDetail = { 
        name: exName, 
        sets: sets || 3, 
        reps: reps || 10, 
        weight: weight || 0, 
        restSeconds: restSeconds || 60 
    };

    if (targetBlockIndex !== null) {
        const newBlocks = [...blocks];
        newBlocks[targetBlockIndex].exercises.push(newEx);
        newBlocks[targetBlockIndex].type = 'SUPERSET';
        setBlocks(newBlocks);
    } else {
        const newBlock: WorkoutBlock = {
            id: Date.now().toString(), type: 'SINGLE',
            exercises: [newEx]
        };
        setBlocks([...blocks, newBlock]);
    }
    setStep('DETAILS');
    setTargetBlockIndex(null);
    setViewedExercise(null);
  };

  const updateBlockEx = (blockIdx: number, exIdx: number, field: string, value: number) => {
    const newBlocks = [...blocks];
    (newBlocks[blockIdx].exercises[exIdx] as any)[field] = value;
    setBlocks(newBlocks);
  };

  const removeExercise = (blockIdx: number, exIdx: number) => {
      const newBlocks = [...blocks];
      newBlocks[blockIdx].exercises.splice(exIdx, 1);
      if (newBlocks[blockIdx].exercises.length === 0) {
          newBlocks.splice(blockIdx, 1);
      } else if (newBlocks[blockIdx].exercises.length === 1) {
          newBlocks[blockIdx].type = 'SINGLE';
      }
      setBlocks(newBlocks);
  };

  if (viewedExercise) {
    return (
      <ACT_FicheExercice 
        exercise={viewedExercise} 
        onClose={() => setViewedExercise(null)} 
        onAdd={(sets, reps, weight, rest) => addExercise(viewedExercise.name, sets, reps, weight, rest)} 
      />
    );
  }

  if (step === 'PICKER') {
      const exercises = EXERCISE_DB[pickerCategory] || [];
      const filteredExercises = exercises.filter(ex => {
          if (!filterByEquip) return true;
          return ex.equipment.every(req => userEquipment.includes(req));
      });

      return (
        <div className="min-h-screen bg-slate-50 pt-4 px-4 pb-20 animate-in slide-in-from-bottom">
            <header className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">
                        {targetBlockIndex !== null ? 'Ajouter au Superset' : 'Nouvel Exercice'}
                    </h3>
                    {targetBlockIndex !== null && <span className="text-xs text-blue-500 font-bold">Enchaîné avec {blocks[targetBlockIndex].exercises[0].name}</span>}
                </div>
                <button onClick={() => setStep('DETAILS')} className="p-2 bg-slate-200 rounded-full"><X size={20}/></button>
            </header>

            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm" onClick={() => setFilterByEquip(!filterByEquip)}>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full text-blue-500"><Dumbbell size={18} /></div>
                    <span className="text-sm font-bold text-slate-800">Mon Matériel Uniquement</span>
                </div>
                <div className={`w-11 h-6 rounded-full p-1 transition-colors ${filterByEquip ? 'bg-blue-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${filterByEquip ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
                {Object.keys(EXERCISE_DB).map(cat => (
                    <button key={cat} onClick={() => setPickerCategory(cat)} 
                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${pickerCategory === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-500'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="space-y-3 pb-10">
                {filteredExercises.map((ex, i) => (
                    <div key={i} onClick={() => setViewedExercise(ex)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform flex items-center justify-between cursor-pointer">
                        <div>
                            <h4 className="font-bold text-slate-800">{ex.name}</h4>
                            <div className="flex gap-1 mt-1">
                                <span className="text-[10px] bg-slate-50 px-1.5 rounded text-slate-500">{ex.subGroup}</span>
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 rounded">{ex.level}</span>
                            </div>
                        </div>
                        <Plus className="text-blue-500 bg-blue-50 rounded-full p-1" size={24} />
                    </div>
                ))}
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-40 pt-4 px-6 relative">
      <header className="flex items-center gap-4 mb-6">
         <button onClick={onCancel} className="p-2 -ml-2 text-slate-800"><ChevronLeft size={24} /></button>
         <h2 className="text-xl font-bold text-slate-800">Configuration Séance</h2>
      </header>

      <div className="space-y-6">
         <div className="space-y-3">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                <Sparkles size={14} className="text-blue-500" /> Choisir un format
             </label>
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 'FULL_BODY', label: 'Full Body' },
                    { id: 'PUSH', label: 'Push' },
                    { id: 'PULL', label: 'Pull' },
                    { id: 'LEGS', label: 'Legs' },
                    { id: 'CUSTOM', label: 'Personnalisé' }
                ].map((t) => (
                    <button 
                        key={t.id} 
                        onClick={() => applyPreset(t.id as ProgramType)}
                        className={`px-5 py-3 rounded-2xl text-xs font-bold border transition-all flex-shrink-0 shadow-sm
                        ${type === t.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100'}`}>
                        {t.label}
                    </button>
                ))}
             </div>
         </div>

         <div className="space-y-1">
             <input 
                value={name} 
                onChange={e => { setName(e.target.value); if(error) setError(null); }} 
                placeholder="Nom du programme..." 
                className={`w-full bg-white p-4 rounded-2xl text-slate-800 font-bold shadow-sm border outline-none focus:border-blue-500 transition-colors ${error && !name ? 'border-red-400' : 'border-slate-100'}`} 
             />
             {error && !name && <p className="text-xs text-red-500 font-bold px-2">{error}</p>}
         </div>

         <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-3 flex items-center gap-2">
                <Calendar size={14}/> Jour planifié
            </h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <button 
                   onClick={() => setScheduledDay(undefined)}
                   className={`px-4 py-2 rounded-xl text-xs font-bold border flex-shrink-0 ${!scheduledDay ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-400 border-slate-100'}`}
                >
                   Aucun
                </button>
                {DAYS_OF_WEEK.map(day => (
                   <button 
                      key={day} 
                      onClick={() => setScheduledDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border flex-shrink-0 ${scheduledDay === day ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-400 border-slate-100'}`}
                   >
                      {day}
                   </button>
                ))}
            </div>
         </div>

         <div className="space-y-4">
             <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Exercices ({blocks.length})</h3>
             </div>
             
             {blocks.map((block, i) => (
                 <div key={block.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 relative animate-in fade-in zoom-in-95">
                     <div className="flex justify-between items-center mb-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${block.type === 'SUPERSET' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                            {block.type === 'SUPERSET' ? '⚡ Superset' : 'Exercice simple'}
                        </span>
                     </div>

                     <div className="space-y-6">
                        {block.exercises.map((ex, exIdx) => (
                            <div key={exIdx} className="relative">
                                {exIdx > 0 && <div className="absolute -top-4 left-4 border-l-2 border-dashed border-slate-300 h-4"></div>}
                                
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-slate-800">{ex.name}</h4>
                                    <button onClick={() => removeExercise(i, exIdx)} className="text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[{l:'Séries', f:'sets'}, {l:'Reps', f:'reps'}, {l:'Kg', f:'weight'}, {l:'Repos', f:'restSeconds'}].map((field) => (
                                        <div key={field.l} className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">{field.l}</label>
                                            <input type="number" value={(ex as any)[field.f]} 
                                                onChange={(evt) => updateBlockEx(i, exIdx, field.f, Number(evt.target.value))}
                                                className="w-full bg-transparent text-center font-bold text-slate-800 outline-none p-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                     </div>

                     <div className="mt-5 pt-4 border-t border-slate-50 flex justify-center">
                         <button onClick={() => openPicker(i)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">
                            <GripVertical size={14} /> Ajouter au Superset
                         </button>
                     </div>
                 </div>
             ))}
             
             <button onClick={() => openPicker(null)} className="w-full py-5 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-400 transition-all">
                <Plus size={20} /> Ajouter un exercice
             </button>
         </div>
      </div>

      <div className="fixed bottom-24 left-6 right-6 z-[60] flex flex-col gap-2">
          {error && (
              <div className="bg-red-500/90 backdrop-blur text-white text-xs font-bold py-3 px-4 rounded-2xl text-center shadow-lg animate-in slide-in-from-bottom fade-in flex items-center justify-center gap-2">
                  <AlertCircle size={14} /> {error}
              </div>
          )}
          <button 
              onClick={handleSave} 
              type="button"
              className={`w-full py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all ${blocks.length > 0 ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-slate-200 text-slate-400'}`}
          >
              <Save size={20} /> Enregistrer le programme
          </button>
      </div>
    </div>
  );
};
