
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GraphDataPoint, ProgressionInsight } from '../../services/analyticsService';
import { TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  data: GraphDataPoint[];
  insight: ProgressionInsight;
}

export const LoadRpeGraph: React.FC<Props> = ({ data, insight }) => {
  const statusColors = {
    PROGRESSION: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    STAGNATION: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    REGRESSION: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    DELOAD: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  };

  const Icon = insight.status === 'PROGRESSION' ? TrendingUp : insight.status === 'STAGNATION' ? RefreshCw : AlertCircle;

  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-pro">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Tendance Force & Effort</h4>
          <p className="text-lg font-black text-slate-900 tracking-tighter">Charge (kg) vs RPE</p>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase flex items-center gap-2 ${statusColors[insight.status]}`}>
          <Icon size={14} /> {insight.status}
        </div>
      </div>

      <div className="h-64 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#2563eb' }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#f59e0b' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
              labelStyle={{ color: '#64748b', marginBottom: '4px' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="load" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Poids (kg)" />
            <Line yAxisId="right" type="monotone" dataKey="rpe" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="RPE" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm"><Icon size={16} className={statusColors[insight.status].split(' ')[0]} /></div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">{insight.message}</p>
      </div>
    </div>
  );
};
