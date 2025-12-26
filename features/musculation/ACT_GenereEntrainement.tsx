import React, { useState } from 'react';
import { WorkoutProgram, ProgramType } from '../../types';
import { generateWorkoutPlan } from '../../services/geminiService';
import { Sparkles, Dumbbell, ChevronLeft, Check, Loader2, Save } from 'lucide-react';

interface Props {
  userEquipment: string[];
  onSave: (program: WorkoutProgram) => void;
  onCancel: () => void;
}

export const ACT_GenereEntrainement: React.FC<Props> = ({ userEquipment, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ProgramType>('FULL_BODY');
  const [selectedEquip, setSelectedEquip] = useState<string[]>(userEquipment);
  const [generatedProgram, setGeneratedProgram] = useState<WorkoutProgram | null>(null);

  const availableEquipList = ['Poids du corps', 'Haltères', 'Barre', 'Banc', 'Elastiques', 'Kettlebell', 'Machines'];

  const toggleEquip = (eq: string) => {
    if (selectedEquip.includes(eq)) setSelectedEquip(selectedEquip.filter(e => e !== eq));
    else setSelectedEquip([...selectedEquip, eq]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateWorkoutPlan(selectedEquip, selectedType);
    if (result) {
      setGeneratedProgram({
        ...result,
        id: Date.now().toString(),
        programType: selectedType,
        imageUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=500&q=80',
        lastPerformed: 'Nouveau'
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 animate-pulse"></div>
            <Loader2 size={64} className="animate-spin relative z-10 text-white" />
        </div>
        <h3 className="text-xl font-bold mt-8">L'IA conçoit votre séance...</h3>
        <p className="text-slate-400 mt-2">Analyse du matériel : {selectedEquip.join(', ')}</p>
      </div>
    );
  }

  if (generatedProgram) {
    return (
      <div className="min-h-screen bg-slate-50 pt-4 pb-20 px-6 animate-in slide-in-from-right">
        <header className="flex items-center gap-4 mb-6">
           <button onClick={() => setGeneratedProgram(null)} className="p-2 -ml-2 text-slate-800"><ChevronLeft/></button>
           <h2 className="text-xl font-bold text-slate-800">Résultat IA</h2>
        </header>

        <div className="bg-white rounded-[2rem] p-6 shadow-xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{generatedProgram.name}</h3>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{generatedProgram.programType}</span>
                <div className="mt-4 space-y-3">
                    {generatedProgram.blocks.map((block, i) => (
                        <div key={i} className="border-l-4 border-purple-400 pl-3 py-1">
                            <p className="font-bold text-slate-700">{block.exercises[0].name}</p>
                            <p className="text-xs text-slate-500">{block.exercises[0].sets} séries x {block.exercises[0].reps} reps</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        <button onClick={() => onSave(generatedProgram)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-lg">
            <Save size={20} /> Enregistrer ce programme
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-4 pb-20 px-6">
       <header className="flex items-center gap-4 mb-6">
         <button onClick={onCancel} className="p-2 -ml-2 text-slate-800"><ChevronLeft size={24} /></button>
         <h2 className="text-xl font-bold text-slate-800">Générateur IA</h2>
       </header>

       <div className="space-y-6">
          <section>
             <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Dumbbell size={18} className="text-blue-500"/> Matériel disponible</h3>
             <div className="flex flex-wrap gap-2">
                {availableEquipList.map(eq => (
                   <button 
                      key={eq} onClick={() => toggleEquip(eq)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedEquip.includes(eq) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
                   >
                      {eq}
                   </button>
                ))}
             </div>
          </section>

          <section>
             <h3 className="font-bold text-slate-800 mb-3">Objectif de séance</h3>
             <div className="grid grid-cols-2 gap-3">
                {['FULL_BODY', 'PUSH', 'PULL', 'LEGS'].map((t) => (
                   <button 
                      key={t} onClick={() => setSelectedType(t as ProgramType)}
                      className={`p-4 rounded-2xl text-center font-bold text-sm transition-all border-2 ${selectedType === t ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-transparent bg-white text-slate-400'}`}
                   >
                      {t.replace('_', ' ')}
                   </button>
                ))}
             </div>
          </section>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-lg mt-4">
             <div className="flex items-start gap-4">
                <Sparkles className="flex-shrink-0 animate-pulse" size={32} />
                <div>
                   <h4 className="font-bold text-lg mb-1">Intelligence Artificielle</h4>
                   <p className="text-sm opacity-90 leading-relaxed">Je vais créer un programme unique adapté à votre matériel ({selectedEquip.length} équipements) et votre objectif.</p>
                </div>
             </div>
          </div>

          <button onClick={handleGenerate} disabled={selectedEquip.length === 0} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
             <Sparkles size={20} /> Générer le programme
          </button>
       </div>
    </div>
  );
};