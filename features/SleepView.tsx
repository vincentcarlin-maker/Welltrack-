import React from 'react';
import { SleepLog } from '../types';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Moon, Wind, Zap, AlarmClock } from 'lucide-react';

interface SleepViewProps {
  sleepHistory: SleepLog[];
}

export const SleepView: React.FC<SleepViewProps> = ({ sleepHistory }) => {
  const data = sleepHistory.map(log => ({
    name: new Date(log.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    hours: log.durationHours,
    quality: log.qualityScore
  }));

  const lastLog = sleepHistory[sleepHistory.length - 1];

  return (
    <div className="bg-slate-900 min-h-screen text-white pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

      <div className="px-6 pt-8 relative z-10">
         <header className="mb-8">
            <div className="flex items-center gap-2 mb-1">
               <div className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                  <Moon size={16} className="text-blue-300" />
               </div>
               <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Analyse Sommeil</span>
            </div>
            <h1 className="text-3xl font-bold">Bonne nuit, Alex</h1>
         </header>

         {/* MAIN SCORE CARD */}
         <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
            <div className="relative z-10">
               <div className="text-6xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                  {lastLog.qualityScore}
               </div>
               <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-6">Score de qualité</div>
               
               <div className="flex justify-center gap-8">
                  <div>
                     <div className="text-xl font-bold text-white">{lastLog.durationHours}h</div>
                     <div className="text-[10px] text-slate-400 uppercase font-bold">Durée</div>
                  </div>
                  <div className="w-px bg-white/10 h-10"></div>
                  <div>
                     <div className="text-xl font-bold text-white">{Math.floor(lastLog.deepSleepMinutes/60)}h {lastLog.deepSleepMinutes%60}</div>
                     <div className="text-[10px] text-slate-400 uppercase font-bold">Profond</div>
                  </div>
               </div>
            </div>
         </div>

         {/* CHART */}
         <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-2">
               <h3 className="font-bold text-lg">Cette semaine</h3>
               <span className="text-xs text-slate-400 font-bold bg-white/10 px-2 py-1 rounded-lg">7 derniers jours</span>
            </div>
            <div className="h-40 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                     />
                     <Area type="monotone" dataKey="quality" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorQuality)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* STAGES GRID */}
         <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-800/50 p-5 rounded-3xl border border-white/5 flex flex-col gap-3">
                <Wind className="text-purple-400" size={24} />
                <div>
                   <div className="text-2xl font-bold">12%</div>
                   <div className="text-[10px] text-slate-400 uppercase font-bold">REM (Rêve)</div>
                </div>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-500 w-[12%]"></div>
                </div>
             </div>
             
             <div className="bg-slate-800/50 p-5 rounded-3xl border border-white/5 flex flex-col gap-3">
                <Zap className="text-yellow-400" size={24} />
                <div>
                   <div className="text-2xl font-bold">3%</div>
                   <div className="text-[10px] text-slate-400 uppercase font-bold">Éveil</div>
                </div>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-500 w-[3%]"></div>
                </div>
             </div>
         </div>
         
         <div className="mt-4 bg-gradient-to-r from-indigo-900 to-blue-900 p-5 rounded-3xl border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full">
                <AlarmClock className="text-white" size={20} />
            </div>
            <div>
                <h4 className="font-bold text-sm">Réveil optimal</h4>
                <p className="text-xs text-slate-400">Entre 07:15 et 07:45</p>
            </div>
         </div>
      </div>
    </div>
  );
};