
import React, { useState, useEffect, useRef } from 'react';
import { WorkoutProgram, WorkoutBlock, ActivityLog, ProgressionRecommendation } from '../../types';
import { ChevronLeft, Play, Pause, CheckCircle2, FastForward, Activity, Timer, Plus, SkipForward, Trophy, Flame, Dumbbell, Save, Lightbulb, Clock, Info } from 'lucide-react';
import { getSmartProgression } from '../../services/progressionService';

interface Props {
  program: WorkoutProgram;
  history: ActivityLog[];
  onFinish: (duration: number, blocks: WorkoutBlock[], programId: string) => void;
  onCancel: () => void;
}

export const ACT_SeanceEnCours: React.FC<Props> = ({ program, history, onFinish, onCancel }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isSummary, setIsSummary] = useState(false);

  const [blockIdx, setBlockIdx] = useState(0);     
  const [exInBlockIdx, setExInBlockIdx] = useState(0); 
  const [currentSet, setCurrentSet] = useState(1); 
  
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [initialRestTime, setInitialRestTime] = useState(0);
  
  const [currentRpe, setCurrentRpe] = useState<number>(7.5);
  const [sessionBlocks, setSessionBlocks] = useState<WorkoutBlock[]>(JSON.parse(JSON.stringify(program.blocks)));

  const lastTimestampRef = useRef(0);

  const currentBlock = sessionBlocks[blockIdx];
  const currentEx = currentBlock.exercises[exInBlockIdx];
  const isSuperset = currentBlock.exercises.length > 1;
  const [progressionCoach, setProgressionCoach] = useState<ProgressionRecommendation | null>(null);

  useEffect(() => {
    let interval: any;
    if (isRunning && !isSummary) {
      interval = setInterval(() => {
        setElapsedTime(p => p + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isSummary]);

  useEffect(() => {
    let interval: any;
    if (isResting && restTimer > 0) {
        interval = setInterval(() => setRestTimer(t => t - 1), 1000);
    } else if (isResting && restTimer <= 0) {
        proceedToNextStep();
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  useEffect(() => {
    if(!isSummary && currentEx) {
        const recommendation = getSmartProgression(currentEx.name, history);
        setProgressionCoach(recommendation);
        setCurrentRpe(7.5);
    }
  }, [currentEx?.name, history, isSummary]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleValidateSet = () => {
    const currentTime = elapsedTime;
    const timeSpent = currentTime - lastTimestampRef.current;
    
    if (!currentEx.durationSeconds) currentEx.durationSeconds = 0;
    currentEx.durationSeconds += timeSpent;
    lastTimestampRef.current = currentTime;

    currentEx.rpe = currentRpe;
    const isLastBlock = blockIdx === sessionBlocks.length - 1;
    const isLastExInBlock = exInBlockIdx === currentBlock.exercises.length - 1;
    const isLastSet = currentSet === currentEx.sets;

    if (isLastBlock && ((isSuperset && isLastExInBlock && isLastSet) || (!isSuperset && isLastSet))) {
        setIsSummary(true);
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
    lastTimestampRef.current = elapsedTime;

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

  if (isSummary) {
      return (
        <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col p-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-glow animate-bounce">
                    <Trophy size={48} className="text-white" />
                </div>
                <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">Mission Accomplie</h2>
                <p className="text-slate-400 mb-12 font-medium">Votre séance est enregistrée dans l'écosystème WellTrack.</p>

                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <Timer className="text-blue-400 mb-3" size={24} />
                        <div className="text-2xl font-black">{Math.ceil(elapsedTime / 60)} <span className="text-xs opacity-50 uppercase">min</span></div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mt-1">Durée</div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                        <Flame className="text-orange-400 mb-3" size={24} />
                        <div className="text-2xl font-black">{Math.ceil(elapsedTime / 60 * 7)}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mt-1">Kcal</div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 mt-auto">
                <button 
                    onClick={() => onFinish(Math.ceil(elapsedTime / 60), sessionBlocks, program.id)}
                    className="w-full bg-brand-blue text-white py-5 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl active:scale-95 transition-all"
                >
                    Finaliser & Sauvegarder
                </button>
                <button onClick={onCancel} className="w-full py-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                    Abandonner
                </button>
            </div>
        </div>
      );
  }

  if (isResting) {
    const progress = ((initialRestTime - restTimer) / initialRestTime) * 100;
    return (
        <div className="fixed inset-0 z-[100] bg-[#0F172A] flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-blue mb-12">Zone de Récupération</h2>
            <div className="relative w-64 h-64 flex items-center justify-center mb-16">
                 <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="110" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                    <circle cx="128" cy="128" r="110" stroke="#2563EB" strokeWidth="12" fill="none" 
                        strokeDasharray={690} strokeDashoffset={690 - (690 * progress) / 100} 
                        className="transition-all duration-1000 linear" strokeLinecap="round" />
                 </svg>
                 <div className="text-8xl font-black tracking-tighter relative z-10">{restTimer}</div>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setRestTimer(t => t + 30)} className="bg-white/5 p-5 rounded-3xl flex items-center gap-2 font-black text-xs uppercase border border-white/10">+30s</button>
                <button onClick={proceedToNextStep} className="bg-white text-slate-900 p-5 px-10 rounded-3xl flex items-center gap-2 font-black text-xs uppercase shadow-xl">Passer</button>
            </div>
        </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-900 text-white relative overflow-hidden flex flex-col">
       <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1541534741688-6078c64b52d3?w=800&q=80" className="w-full h-1/2 object-cover opacity-30" alt="bg" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/90 to-slate-900"></div>
       </div>

       <div className="relative z-10 flex justify-between items-center p-6 pt-12">
          <button onClick={onCancel} className="p-2 bg-white/10 rounded-full backdrop-blur-md"><ChevronLeft size={20} /></button>
          <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 flex items-center gap-3">
             <Timer size={14} className="text-brand-blue" />
             <span className="font-mono font-bold text-sm tracking-widest">{formatTime(elapsedTime)}</span>
          </div>
       </div>

       <div className="relative z-10 px-6 flex-1 flex flex-col overflow-y-auto no-scrollbar pb-10">
          <div className="text-center mb-6">
             <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em] mb-2 block">{program.name}</span>
             <h2 className="text-3xl font-black leading-tight tracking-tighter">{currentEx.name}</h2>
          </div>

          {progressionCoach && (
             <div className="mb-6 bg-brand-blue/10 border border-brand-blue/30 rounded-[2rem] p-6 animate-in slide-in-from-top duration-500">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-brand-blue rounded-2xl text-white shadow-glow"><Lightbulb size={20} /></div>
                   <div className="flex-1">
                      <h4 className="text-xs font-black uppercase text-brand-blue mb-1 tracking-widest">Conseil WellTrack IA</h4>
                      <p className="text-sm font-bold text-white mb-2">{progressionCoach.text}</p>
                      <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                         <Info size={14} className="text-slate-400 mt-0.5" />
                         <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{progressionCoach.explanation}</p>
                      </div>
                   </div>
                </div>
             </div>
          )}

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative flex-1 flex flex-col justify-between">
             <div>
                <div className="flex justify-between items-center mb-8">
                   <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-blue h-full transition-all duration-700" style={{ width: `${(currentSet / currentEx.sets) * 100}%` }}></div>
                   </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                       <span className="text-2xl font-black block text-white">{currentEx.weight}</span>
                       <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Poids (kg)</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl text-center border border-white/5">
                       <span className="text-2xl font-black block text-white">{currentEx.reps}</span>
                       <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Objectif</span>
                    </div>
                    <div className="bg-brand-blue p-4 rounded-3xl text-center shadow-glow border border-white/10">
                       <span className="text-2xl font-black block text-white">{currentSet} <span className="text-sm opacity-60">/ {currentEx.sets}</span></span>
                       <span className="text-[9px] text-blue-100 uppercase font-black tracking-widest">Série</span>
                    </div>
                </div>
             </div>

             <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity size={14} /> Perception d'effort (RPE)</span>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/20">{currentRpe}/10</span>
                   </div>
                   <input 
                      type="range" min="1" max="10" step="0.5" 
                      value={currentRpe} 
                      onChange={(e) => setCurrentRpe(parseFloat(e.target.value))} 
                      className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-blue" 
                   />
                   <div className="flex justify-between mt-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Léger</span>
                      <span>Optimal</span>
                      <span>Échec</span>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setIsRunning(!isRunning)} className="bg-white/5 hover:bg-white/10 text-white w-16 h-16 rounded-3xl flex items-center justify-center border border-white/10 flex-shrink-0 transition-colors">
                      {isRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                   </button>
                   <button onClick={handleValidateSet} className="flex-1 bg-white text-slate-900 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3">
                      Valider la série <FastForward size={18} />
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
