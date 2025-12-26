import React, { useState } from 'react';
import { ActivityLog, WorkoutProgram } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, Flame } from 'lucide-react';

interface Props {
  activities: ActivityLog[];
  onClose: () => void;
}

export const ACT_Calendrier: React.FC<Props> = ({ activities, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Dimanche
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Ajustement Lundi = 0

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  // Filtrer les activités pour le jour sélectionné
  const activitiesForSelectedDate = activities.filter(act => 
    isSameDay(new Date(act.date), selectedDate)
  );

  // Vérifier si un jour a une activité (pour les points dans le calendrier)
  const hasActivity = (day: number) => {
    const checkDate = new Date(year, month, day);
    return activities.some(act => isSameDay(new Date(act.date), checkDate));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-4 px-6 pb-24 animate-in slide-in-from-right">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-800 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           <CalendarIcon size={20} className="text-brand-blue" /> Calendrier
        </h2>
      </header>

      {/* Calendar Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 mb-6">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6">
           <button onClick={() => changeMonth(-1)} className="p-2 text-slate-400 hover:text-slate-800"><ChevronLeft size={20}/></button>
           <span className="font-bold text-lg text-slate-800 capitalize">{monthNames[month]} {year}</span>
           <button onClick={() => changeMonth(1)} className="p-2 text-slate-400 hover:text-slate-800"><ChevronRight size={20}/></button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-4 mb-2">
           {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-300">{d}</div>
           ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
           {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
           
           {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              const hasAct = hasActivity(day);

              return (
                 <div key={day} className="flex flex-col items-center justify-center relative">
                    <button 
                       onClick={() => setSelectedDate(date)}
                       className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all relative
                       ${isSelected ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/30' : 'text-slate-600 hover:bg-slate-50'}
                       ${isToday && !isSelected ? 'border border-brand-blue text-brand-blue' : ''}
                       `}
                    >
                       {day}
                       {hasAct && !isSelected && (
                         <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-green-500"></div>
                       )}
                    </button>
                 </div>
              );
           })}
        </div>
      </div>

      {/* Details Section */}
      <div>
         <h3 className="font-bold text-slate-800 mb-4 capitalize">
            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
         </h3>

         {activitiesForSelectedDate.length > 0 ? (
            <div className="space-y-4">
               {activitiesForSelectedDate.map(act => (
                  <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                        <CheckCircle2 size={20} />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{act.type}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {act.durationMinutes} min
                           </span>
                           <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                              <Flame size={12} /> {act.calories} kcal
                           </span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="bg-slate-100/50 rounded-2xl p-8 text-center border border-dashed border-slate-300">
               <p className="text-slate-400 font-medium mb-2">Aucune activité terminée</p>
               {selectedDate > new Date() ? (
                  <button className="text-sm font-bold text-brand-blue hover:underline">
                     Programmer une séance
                  </button>
               ) : (
                  <span className="text-xs text-slate-400">Jour de repos bien mérité ?</span>
               )}
            </div>
         )}
      </div>
    </div>
  );
};