
import React, { useState } from 'react';
import { ActivityLog, WorkoutProgram } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, Flame, PlayCircle, Info } from 'lucide-react';

interface Props {
  activities: ActivityLog[];
  programs: WorkoutProgram[];
  onStartProgram: (p: WorkoutProgram) => void;
  onClose: () => void;
}

const DAY_NAMES_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export const ACT_Calendrier: React.FC<Props> = ({ activities, programs, onStartProgram, onClose }) => {
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

  // Trouver les programmes planifiés pour le jour sélectionné
  const dayNameForSelected = DAY_NAMES_FR[selectedDate.getDay()];
  const scheduledForSelectedDate = programs.filter(p => p.scheduledDay === dayNameForSelected);

  // Vérifier les états pour un jour spécifique dans le calendrier
  const getDayStatus = (day: number) => {
    const checkDate = new Date(year, month, day);
    const dayName = DAY_NAMES_FR[checkDate.getDay()];
    
    const hasCompleted = activities.some(act => isSameDay(new Date(act.date), checkDate));
    const isScheduled = programs.some(p => p.scheduledDay === dayName);
    
    return { hasCompleted, isScheduled };
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-4 px-6 pb-24 animate-in slide-in-from-right">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-800 hover:bg-slate-100 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           <CalendarIcon size={20} className="text-brand-blue" /> Calendrier Muscu
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
              const { hasCompleted, isScheduled } = getDayStatus(day);

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
                       {/* Indicateurs bas de cellule */}
                       <div className="absolute -bottom-1 flex gap-0.5">
                          {hasCompleted && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          )}
                          {isScheduled && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-brand-blue'}`}></div>
                          )}
                       </div>
                    </button>
                 </div>
              );
           })}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
         <h3 className="font-bold text-slate-800 mb-0 capitalize text-lg">
            {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
         </h3>

         {/* Séances programmées */}
         {scheduledForSelectedDate.length > 0 && (
            <div className="space-y-3">
               <div className="flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest px-1">
                  <PlayCircle size={14} /> Séances Préguvues
               </div>
               {scheduledForSelectedDate.map(p => (
                  <div key={p.id} className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-4">
                     <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{p.name}</h4>
                        <span className="text-[10px] font-bold text-blue-500 uppercase">{p.programType}</span>
                     </div>
                     <button 
                        onClick={() => onStartProgram(p)}
                        className="bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-transform"
                     >
                        Démarrer
                     </button>
                  </div>
               ))}
            </div>
         )}

         {/* Historique des activités */}
         <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
               <CheckCircle2 size={14} /> Activités Terminées
            </div>
            {activitiesForSelectedDate.length > 0 ? (
               <div className="space-y-3">
                  {activitiesForSelectedDate.map(act => (
                     <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100 flex-shrink-0">
                           <CheckCircle2 size={18} />
                        </div>
                        <div className="flex-1">
                           <h4 className="font-bold text-slate-800 text-sm">{act.type}</h4>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                 <Clock size={10} /> {act.durationMinutes} min
                              </span>
                              <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1">
                                 <Flame size={10} /> {act.calories} kcal
                              </span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="bg-slate-100/30 rounded-2xl p-6 text-center border border-dashed border-slate-200">
                  <p className="text-slate-400 text-xs font-medium">Aucun historique pour ce jour</p>
               </div>
            )}
         </div>

         {/* Note sur la planification */}
         <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-soft">
            <Info size={16} className="text-slate-400 mt-0.5" />
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
               Les points <span className="text-brand-blue font-bold">bleus</span> indiquent des séances que vous avez programmées de manière récurrente le <span className="text-slate-600 font-bold">{dayNameForSelected}</span>.
            </p>
         </div>
      </div>
    </div>
  );
};
