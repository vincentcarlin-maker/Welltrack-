import React, { useState, useEffect } from 'react';
import { WorkoutProgram, WorkoutBlock, ActivityLog } from '../../types';
import { ChevronLeft, Play, Pause, CheckCircle2, FastForward, BrainCircuit, Activity, Timer, Plus, SkipForward, Trophy, Flame, Dumbbell, Save } from 'lucide-react';
import { getProgressionRecommendation } from './logic/progressionAlgo';

interface Props {
  program: WorkoutProgram;
  history: ActivityLog[];
  onFinish: (duration: number, blocks: WorkoutBlock[]) => void;
  onCancel: () => void;
}

export const ACT_SeanceEnCours: React.FC<Props> = ({ program, history, onFinish, onCancel }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSummary, setIsSummary] = useState(false); // Nouvel état pour l'écran de fin

  // Navigation
  const [blockIdx, setBlockIdx] = useState(0);     
  const [exInBlockIdx, setExInBlockIdx] = useState(0); 
  const [currentSet, setCurrentSet] = useState(1); 
  
  // Timer de Repos
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [initialRestTime, setInitialRestTime] = useState(0);
  
  // Données de saisie
  const [currentRpe, setCurrentRpe] = useState<number>(8);
  const [sessionBlocks, setSessionBlocks] = useState<WorkoutBlock[]>(JSON.parse(JSON.stringify(program.blocks)));

  // Etats dérivés
  const currentBlock = sessionBlocks[blockIdx];
  const currentEx = currentBlock.exercises[exInBlockIdx];
  const isSuperset = currentBlock.exercises.length > 1;
  const [coachTip, setCoachTip] = useState<{text: string, action: string} | null>(null);

  // Chronomètres
  useEffect(() => {
    let interval: any;
    if (isRunning && !isSummary) interval = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, isSummary]);

  useEffect(() => {
    let interval: any;
    if (isResting && restTimer > 0) {
        interval = setInterval(() => setRestTimer(t => t - 1), 1000);
    } else if (isResting && restTimer <= 0) {
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        proceedToNextStep();
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  useEffect(() => {
    if(!isSummary) {
        const tip = getProgressionRecommendation(currentEx.name, history);
        setCoachTip(tip);
        setCurrentRpe(8);
    }
  }, [currentEx?.name, history, isSummary]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const calculateVolume = () => {
      let vol = 0;
      let sets = 0;
      sessionBlocks.forEach(b => b.exercises.forEach(e => {
          vol += (e.weight * e.reps * e.sets);
          sets += e.sets;
      }));
      return { volume: vol, sets };
  };

  const handleValidateSet = () => {
    currentEx.rpe = currentRpe;
    const isLastBlock = blockIdx === sessionBlocks.length - 1;
    const isLastExInBlock = exInBlockIdx === currentBlock.exercises.length - 1;
    const isLastSet = currentSet === currentEx.sets;

    if (isLastBlock && ((isSuperset && isLastExInBlock && isLastSet) || (!isSuperset && isLastSet))) {
        setIsSummary(true); // Afficher le résumé au lieu de quitter direct
        setIsRunning(false);
    } else {
        if (currentEx.restSeconds > 0) {
            setRestTimer(currentEx.restSeconds);
            setInitialRestTime(currentEx.restSeconds);
            setIsResting(true);
        } else {
            proceedToNextStep();
        }
    }
  };

  const proceedToNextStep = () => {
    setIsResting(false);
    if (isSuperset) {
        if (exInBlockIdx < currentBlock.exercises.length - 1) {
            setExInBlockIdx(exInBlockIdx + 1);
        } else {
            if (currentSet < currentEx.sets) { 
                setCurrentSet(currentSet + 1);
                setExInBlockIdx(0); 
            } else {
                goToNextBlock();
            }
        }
    } else {
        if (currentSet < currentEx.sets) {
            setCurrentSet(currentSet + 1);
        } else {
            goToNextBlock();
        }
    }
  };

  const goToNextBlock = () => {
      if (blockIdx < sessionBlocks.length - 1) {
          setBlockIdx(blockIdx + 1);
          setExInBlockIdx(0);
          setCurrentSet(1);
      } else {
          setIsSummary(true);
          setIsRunning(false);
      }
  };

  // --- ECRAN RESUME & ENREGISTREMENT ---
  if (isSummary) {
      const stats = calculateVolume();
      const calories = Math.ceil(elapsedTime / 60 * 6.5); // Estimation
      
      return (
        <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-glow animate-bounce">
                    <Trophy size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2">Séance Terminée !</h2>
                <p className="text-slate-400 mb-10">Bravo, vous avez complété {program.name}.</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <Timer className="text-blue-400 mb-2" />
                        <div className="text-2xl font-bold">{Math.ceil(elapsedTime / 60)} <span className="text-sm">min</span></div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Durée</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <Dumbbell className="text-purple-400 mb-2" />
                        <div className="text-2xl font-bold">{(stats.volume / 1000).toFixed(1)} <span className="text-sm">t</span></div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Volume</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <CheckCircle2 className="text-green-400 mb-2" />
                        <div className="text-2xl font-bold">{stats.sets}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Séries</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                        <Flame className="text-orange-400 mb-2" />
                        <div className="text-2xl font-bold">{calories}</div>
                        <div className="text-xs text-slate-500 uppercase font-bold">Kcal</div>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 space-y-3">
                <button 
                    onClick={() => onFinish(Math.ceil(elapsedTime / 60), sessionBlocks)}
                    className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                    <Save size={20} /> Enregistrer la séance
                </button>
                <button onClick={onCancel} className="w-full py-4 text-slate-400 font-bold text-sm">
                    Ne pas enregistrer
                </button>
            </div>
        </div>
      );
  }

  // --- ECRAN REPOS ---
  if (isResting) {
    const progress = ((initialRestTime - restTimer) / initialRestTime) * 100;
    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
            <h2 className="text-xl font-bold uppercase tracking-widest text-blue-300 mb-8 relative z-10">Récupération</h2>
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                 <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="120" stroke="#1e293b" strokeWidth="8" fill="none" />
                    <circle cx="128" cy="128" r="120" stroke="#3b82f6" strokeWidth="8" fill="none" 
                        strokeDasharray={754} strokeDashoffset={754 - (754 * progress) / 100} 
                        className="transition-all duration-1000 linear" strokeLinecap="round" />
                 </svg>
                 <div className="text-8xl font-black font-mono tracking-tighter relative z-10">{restTimer}<span className="text-2xl text-slate-400 ml-1">s</span></div>
            </div>
            <div className="flex gap-4 relative z-10">
                <button onClick={() => setRestTimer(t => t + 30)} className="bg-slate-800 p-4 rounded-2xl flex items-center gap-2 font-bold border border-white/10"><Plus size={20} /> +30s</button>
                <button onClick={proceedToNextStep} className="bg-white text-slate-900 p-4 px-8 rounded-2xl flex items-center gap-2 font-bold shadow-lg"><SkipForward size={20} /> Passer</button>
            </div>
            <div className="absolute bottom-10 text-slate-400 text-sm font-medium animate-pulse">Prochain : {isSuperset && exInBlockIdx < currentBlock.exercises.length - 1 ? sessionBlocks[blockIdx].exercises[exInBlockIdx + 1].name : currentEx.name}</div>
        </div>
    );
  }

  // --- ECRAN PRINCIPAL (Reste inchangé en structure, juste nettoyé) ---
  return (
    <div className="h-[100dvh] bg-slate-900 text-white relative overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom)]">
       <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" className="w-full h-3/5 object-cover opacity-20" alt="bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/90 to-slate-900"></div>
       </div>

       <div className="relative z-10 flex justify-between items-center p-6 pt-8 mt-[env(safe-area-inset-top)]">
          <button onClick={onCancel} className="flex items-center gap-1 text-slate-300 active:text-white"><ChevronLeft size={20} /> Retour</button>
          <span className="text-slate-400 font-mono text-sm bg-slate-800 px-2 py-1 rounded-md flex items-center gap-2"><Timer size={14} /> {formatTime(elapsedTime)}</span>
       </div>

       <div className="relative z-10 px-6 flex-1 flex flex-col overflow-y-auto no-scrollbar pb-6">
          <div className="text-center mb-4">
             <h2 className="text-2xl font-bold mb-1">{program.name}</h2>
             {isSuperset && <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-orange-500/30">⚡ Superset</span>}
          </div>

          {coachTip && (
             <div className={`mb-4 p-4 rounded-2xl border flex items-start gap-3 shadow-lg ${coachTip.action === 'DELOAD' ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-600/20 border-blue-500/30'}`}>
                <div className={`p-2 rounded-full ${coachTip.action === 'DELOAD' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}><BrainCircuit size={18} /></div>
                <div><h4 className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${coachTip.action === 'DELOAD' ? 'text-red-300' : 'text-blue-300'}`}>Coach IA</h4><p className="text-sm font-medium text-white leading-tight">{coachTip.text}</p></div>
             </div>
          )}

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl mb-4 relative flex-1 flex flex-col justify-between">
             <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold leading-tight">{currentEx.name}</h3>
                        <p className="text-slate-400 text-xs mt-1">{isSuperset ? `Exercice ${exInBlockIdx + 1} / ${currentBlock.exercises.length}` : 'Série Simple'}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-slate-400 font-mono text-xs block uppercase">Bloc</span>
                        <span className="text-lg font-bold">{blockIdx + 1}/{program.blocks.length}</span>
                    </div>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mb-6 overflow-hidden">
                    <div className="bg-brand-blue h-full transition-all duration-500" style={{ width: `${(currentSet / currentEx.sets) * 100}%` }}></div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-800/50 p-3 rounded-2xl text-center border border-white/5"><span className="text-xl font-bold block text-white">{currentEx.weight}</span><span className="text-[10px] text-slate-400 uppercase font-bold">Kg</span></div>
                    <div className="bg-slate-800/50 p-3 rounded-2xl text-center border border-white/5"><span className="text-xl font-bold block text-white">{currentEx.reps}</span><span className="text-[10px] text-slate-400 uppercase font-bold">Reps</span></div>
                    <div className="bg-brand-blue p-3 rounded-2xl text-center shadow-glow border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <span className="text-xl font-bold block text-white relative z-10">{currentSet} <span className="text-sm opacity-60">/ {currentEx.sets}</span></span>
                        <span className="text-[10px] text-blue-100 uppercase font-bold relative z-10">Série</span>
                    </div>
                </div>
             </div>
             <div>
                <div className="mb-4">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><Activity size={12}/> Intensité (RPE)</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${currentRpe >= 9 ? 'bg-red-500/20 text-red-400' : currentRpe >= 7 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{currentRpe}/10</span>
                   </div>
                   <input type="range" min="1" max="10" step="0.5" value={currentRpe} onChange={(e) => setCurrentRpe(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-blue" />
                   <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-bold uppercase"><span>Facile</span><span>Moyen</span><span>Échec</span></div>
                </div>
                <div className="flex gap-3">
                   <button onClick={() => setIsRunning(!isRunning)} className="bg-slate-800 hover:bg-slate-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0">{isRunning ? <Pause size={20} fill="white"/> : <Play size={20} fill="white" />}</button>
                   <button onClick={handleValidateSet} className="flex-1 bg-white text-slate-900 rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                       {currentSet < currentEx.sets || (isSuperset && exInBlockIdx < currentBlock.exercises.length - 1) ? <span>Valider <FastForward size={16} className="inline ml-1"/></span> : <span>Terminer Exo <CheckCircle2 size={16} className="inline ml-1"/></span>}
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};