
import React from 'react';
import { ViewState } from '../types';
import { Home, Activity, Utensils, Trophy, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-all active:opacity-60 ${isActive ? 'text-brand-blue' : 'text-slate-400'}`}
  >
    <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[9px] mt-1 font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* 
          Zone principale qui occupe tout l'espace disponible.
          overflow-y-auto permet le scroll interne sans faire bouger la barre de navigation.
      */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth w-full no-scrollbar relative">
        {children}
      </main>

      {/* 
          Barre de navigation : placée à la fin du flex-col.
          Elle est "flex-none" pour ne pas être écrasée.
      */}
      <nav className="flex-none bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] bg-opacity-90 backdrop-blur-lg">
        <div className="flex justify-around items-center w-full max-w-lg mx-auto h-[70px] px-2 pb-[env(safe-area-inset-bottom)]">
          <NavItem 
            icon={<Home size={24} strokeWidth={activeView === ViewState.HOME ? 2.5 : 2} />} 
            label="Accueil" 
            isActive={activeView === ViewState.HOME} 
            onClick={() => onChangeView(ViewState.HOME)} 
          />
          <NavItem 
            icon={<Activity size={24} strokeWidth={activeView === ViewState.ACTIVITY ? 2.5 : 2} />} 
            label="Fit" 
            isActive={activeView === ViewState.ACTIVITY} 
            onClick={() => onChangeView(ViewState.ACTIVITY)} 
          />
          <NavItem 
            icon={<Utensils size={24} strokeWidth={activeView === ViewState.NUTRITION ? 2.5 : 2} />} 
            label="Manger" 
            isActive={activeView === ViewState.NUTRITION} 
            onClick={() => onChangeView(ViewState.NUTRITION)} 
          />
          <NavItem 
            icon={<Trophy size={24} strokeWidth={activeView === ViewState.GAMIFICATION ? 2.5 : 2} />} 
            label="Défis" 
            isActive={activeView === ViewState.GAMIFICATION} 
            onClick={() => onChangeView(ViewState.GAMIFICATION)} 
          />
          <NavItem 
            icon={<User size={24} strokeWidth={activeView === ViewState.PROFILE ? 2.5 : 2} />} 
            label="Profil" 
            isActive={activeView === ViewState.PROFILE} 
            onClick={() => onChangeView(ViewState.PROFILE)} 
          />
        </div>
      </nav>
    </div>
  );
};
