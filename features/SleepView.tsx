
import React from 'react';
import { SleepLog } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid } from 'recharts';
import { Moon, Wind, Zap, AlarmClock, ChevronLeft, Calendar } from 'lucide-react';

interface SleepViewProps {
  sleepHistory: SleepLog[];
  onBack: () => void;
}

const SleepStat = ({ icon, label, val, sub }: any) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex flex-col gap-3 flex-1">
    <div className="p-2 bg-white/10 rounded-xl self-start">{icon}</div>
    <div>
      <div className="text-xl font-black text-white">{val}</div>
      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

export const SleepView: React.FC<SleepViewProps> = ({ sleepHistory, onBack }) => {
  const data = sleepHistory.slice(-7).map(log => ({
    name: new Date(log.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    val: log.durationHours
  }));

  const lastLog = sleepHistory[sleepHistory.length - 1] || { qualityScore: 0, durationHours: 0, deepSleepMinutes: 0 };

  return (
    <div className="bg-[#0F172A] min-h-screen text-white pb-24 px-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">
      <header className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-black uppercase tracking-widest">Récupération</h1>
        <button className="p-2 bg-white/5 rounded-full"><Calendar size={20} /></button>
      </header>

      <div className="relative mb-10 flex flex-col items-center">
        <div className="w-48 h-48 rounded-full border-[10px] border-white/5 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-[10px] border-indigo-500 border-t-transparent animate-[spin_10s_linear_infinite] opacity-40"></div>
          <div className="text-center">
            <span className="text-6xl font-black tracking-tighter">{lastLog.qualityScore}</span>
            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em]">Sleep Score</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-10">
        <SleepStat icon={<Moon size={18} className="text-indigo-400"/>} label="Durée" val={`${lastLog.durationHours}h`} />
        <SleepStat icon={<Zap size={18} className="text-yellow-400"/>} label="Profond" val={`${Math.floor(lastLog.deepSleepMinutes/60)}h`} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 mb-8">
        <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
           <Wind size={16} /> Cycle hebdomadaire
        </h3>
        <div className="h-40 w-full -ml-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="val" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#sleepGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
        <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400"><AlarmClock size={24} /></div>
        <div className="flex-1">
          <h4 className="font-bold text-sm">Réveil Intelligent</h4>
          <p className="text-xs text-slate-400">Phase légère détectée entre 07:15 - 07:30</p>
        </div>
      </div>
    </div>
  );
};
