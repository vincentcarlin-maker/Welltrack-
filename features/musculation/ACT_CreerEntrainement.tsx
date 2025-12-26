import React, { useState } from 'react';
import { WorkoutProgram, ProgramType, WorkoutBlock } from '../../types';
import { ChevronLeft, Plus, Save, Trash2, X, Dumbbell, GripVertical, Calendar, AlertCircle } from 'lucide-react';
import { EXERCISE_DB, ExerciseDef } from '../../data/exerciseData';
import { ACT_FicheExercice } from './ACT_FicheExercice';

interface Props {
  userEquipment: string[];
  onSave: (program: WorkoutProgram) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export const ACT_CreerEntrainement: React.FC<Props> = ({ userEquipment, onSave, onCancel }) => {
  const [step, setStep] = useState<'DETAILS' | 'PICKER'>('DETAILS');
  const [name, setName] = useState('');
  const [type, setType] = useState<ProgramType>('FULL_BODY');
  const [scheduledDay, setScheduledDay] = useState<string | undefined>(undefined);
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([]);
  const [pickerCategory, setPickerCategory] = useState<string>('Poitrine');
  const [filterByEquip, setFilterByEquip] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour la fiche exercice
  const [viewedExercise, setViewedExercise] = useState<ExerciseDef | null>(null);
  
  // Si null = nouveau bloc, si number = index du bloc à compléter (Superset)
  const [targetBlockIndex, setTargetBlockIndex] = useState<number | null>(null);

  const handleSave = () => {
    setError(null);
    
    if (!name.trim()) {
      setError("Veuillez donner un nom à votre entraînement");
      return;
    }
    
    if (blocks.length === 0) {
      setError("Ajoutez au moins un exercice au programme");
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
    // Valeurs par défaut personnalisées si non fournies (fallback sécurité)
    const newEx = { 
        name: exName, 
        sets: sets || 3, 
        reps: reps || 10, 
        weight: weight || 0, 
        restSeconds: restSeconds || 60 
    };

    if (targetBlockIndex !== null) {
        // Ajout en Superset au bloc existant
        const newBlocks = [...blocks];
        newBlocks[targetBlockIndex].exercises.push(newEx);
        newBlocks[targetBlockIndex].type = 'SUPERSET';
        setBlocks(newBlocks);
    } else {
        // Création nouveau bloc
        const newBlock: WorkoutBlock = {
            id: Date.now().toString(), type: 'SINGLE',
            exercises: [newEx]
        };
        setBlocks([...blocks, newBlock]);
    }
    setStep('DETAILS');
    setTargetBlockIndex(null);
    setViewedExercise(null); // Fermer la fiche
  };

  const updateBlockEx = (blockIdx: number, exIdx: number, field: string, value: number) => {
    const newBlocks = [...blocks];
    (newBlocks[blockIdx].exercises[exIdx] as any)[field] = value;
    setBlocks(newBlocks);
  };

  const removeExercise = (blockIdx: number, exIdx: number) => {
      const newBlocks = [...blocks];
      newBlocks[blockIdx].exercises.splice(exIdx, 1);
      // Si le bloc est vide, on le supprime
      if (newBlocks[blockIdx].exercises.length === 0) {
          newBlocks.splice(blockIdx, 1);
      } else if (newBlocks[blockIdx].exercises.length === 1) {
          newBlocks[blockIdx].type = 'SINGLE';
      }
      setBlocks(newBlocks);
  };

  // --- ECRAN FICHE EXERCICE (Overlay) ---
  if (viewedExercise) {
    return (
      <ACT_FicheExercice 
        exercise={viewedExercise} 
        onClose={() => setViewedExercise(null)} 
        onAdd={(sets, reps, weight, rest) => addExercise(viewedExercise.name, sets, reps, weight, rest)} 
      />
    );
  }

  // --- ECRAN SELECTEUR ---
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

  // --- ECRAN EDITEUR ---
  return (
    <div className="min-h-screen bg-slate-50 pb-40 pt-4 px-6 relative">
      <header className="flex items-center gap-4 mb-6">
         <button onClick={onCancel} className="p-2 -ml-2 text-slate-800"><ChevronLeft size={24} /></button>
         <h2 className="text-xl font-bold text-slate-800">Création Entraînement</h2>
      </header>

      <div className="space-y-6">
         <div className="space-y-1">
             <input 
                value={name} 
                onChange={e => { setName(e.target.value); if(error) setError(null); }} 
                placeholder="Nom du programme..." 
                className={`w-full bg-white p-4 rounded-xl text-slate-800 font-bold shadow-sm border outline-none focus:border-blue-500 transition-colors ${error && !name ? 'border-red-400' : 'border-slate-100'}`} 
             />
             {error && !name && <p className="text-xs text-red-500 font-bold px-2">{error}</p>}
         </div>

         {/* Sélecteur de type */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['FULL_BODY', 'PUSH', 'PULL', 'LEGS', 'CUSTOM'].map((t: any) => (
                <button key={t} onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold border ${type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-slate-400 border-slate-200'}`}>
                    {t.replace('_', ' ')}
                </button>
            ))}
         </div>

         {/* Sélecteur de Jour */}
         <div>
            <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2"><Calendar size={14}/> Jour planifié (optionnel)</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <button 
                   onClick={() => setScheduledDay(undefined)}
                   className={`px-3 py-2 rounded-xl text-xs font-bold border flex-shrink-0 ${!scheduledDay ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}
                >
                   Aucun
                </button>
                {DAYS_OF_WEEK.map(day => (
                   <button 
                      key={day} 
                      onClick={() => setScheduledDay(day)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex-shrink-0 ${scheduledDay === day ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-400 border-slate-200'}`}
                   >
                      {day}
                   </button>
                ))}
            </div>
         </div>

         <div className="space-y-4">
             {blocks.map((block, i) => (
                 <div key={block.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative">
                     {/* En-tête du bloc (Superset ou Single) */}
                     <div className="flex justify-between items-center mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${block.type === 'SUPERSET' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                            {block.type === 'SUPERSET' ? '⚡ Superset' : 'Exercice simple'}
                        </span>
                     </div>

                     {/* Liste des exercices du bloc */}
                     <div className="space-y-6">
                        {block.exercises.map((ex, exIdx) => (
                            <div key={exIdx} className="relative">
                                {exIdx > 0 && <div className="absolute -top-4 left-4 border-l-2 border-dashed border-slate-300 h-4"></div>}
                                
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-slate-800">{ex.name}</h4>
                                    <button onClick={() => removeExercise(i, exIdx)} className="text-slate-300 hover:text-red-400"><Trash2 size={16}/></button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[{l:'Séries', f:'sets'}, {l:'Reps', f:'reps'}, {l:'Kg', f:'weight'}, {l:'Repos', f:'restSeconds'}].map((field) => (
                                        <div key={field.l} className="bg-slate-50 p-2 rounded-lg text-center">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">{field.l}</label>
                                            <input type="number" value={(ex as any)[field.f]} 
                                                onChange={(evt) => updateBlockEx(i, exIdx, field.f, Number(evt.target.value))}
                                                className="w-full bg-transparent text-center font-bold text-slate-800 outline-none p-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                     </div>

                     {/* Bouton Ajouter au Superset */}
                     <div className="mt-4 pt-3 border-t border-slate-50 flex justify-center">
                         <button onClick={() => openPicker(i)} className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors">
                            <GripVertical size={14} /> Ajouter un exercice (Superset)
                         </button>
                     </div>
                 </div>
             ))}
             
             <button onClick={() => openPicker(null)} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-50">
                <Plus size={20} /> Nouveau Bloc
             </button>
         </div>
      </div>

      {/* Bouton Enregistrer Fixe */}
      <div className="fixed bottom-24 left-6 right-6 z-[60] flex flex-col gap-2">
          {error && (
              <div className="bg-red-500/90 backdrop-blur text-white text-xs font-bold py-2 px-4 rounded-xl text-center shadow-lg animate-in slide-in-from-bottom fade-in flex items-center justify-center gap-2">
                  <AlertCircle size={14} /> {error}
              </div>
          )}
          <button 
              onClick={handleSave} 
              type="button"
              className={`w-full py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform ${blocks.length > 0 ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-slate-200 text-slate-400'}`}
          >
              <Save size={20} /> Enregistrer
          </button>
      </div>
    </div>
  );
};