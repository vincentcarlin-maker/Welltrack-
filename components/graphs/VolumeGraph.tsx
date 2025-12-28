
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraphDataPoint, ProgressionInsight } from '../../services/analyticsService';
import { Layers } from 'lucide-react';

interface Props {
  data: GraphDataPoint[];
  insight: ProgressionInsight;
}

export const VolumeGraph: React.FC<Props> = ({ data, insight }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-pro">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Volume de Travail</h4>
          <p className="text-lg font-black text-slate-900 tracking-tighter">Tonnage Total (kg)</p>
        </div>
        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
          <Layers size={20} />
        </div>
      </div>

      <div className="h-64 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700 }}
              formatter={(value: number) => [`${value} kg`, 'Volume']}
            />
            <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? '#10b981' : '#e2e8f0'} 
                  className="transition-all duration-500"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
        <div className="flex-1">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Coach Insight</p>
          <p className="text-xs text-emerald-900 font-bold leading-tight">{insight.message}</p>
        </div>
      </div>
    </div>
  );
};
