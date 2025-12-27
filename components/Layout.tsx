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
    className={`flex flex-col items-center justify-center w-full h-full transition-all active:opacity-60 relative ${isActive ? 'text-brand-blue' : 'text-slate-400'}`}
  >
    <div className={`transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[8px] mt-1 font-bold uppercase tracking-wider transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      {label}
    </span>
    {isActive && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-blue rounded-full -mt-0.5 opacity-40"></div>
    )}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* Zone principale occupant l'espace restant */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth w-full no-scrollbar relative">
        {children}
      </main>

      {/* 
          Barre de navigation ancrée :
          - flex-none pour une hauteur fixe
          - bg-white/95 avec flou pour un effet premium
          - pb-[env(safe-area-inset-bottom)] pour s'ajuster aux barres système (iOS/Android)
          - h-16 (64px) pour la zone interactive centrée
      */}
      <nav className="flex-none bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex justify-around items-center w-full max-w-lg mx-auto h-16 px-4">
          <NavItem 
            icon={<Home size={22} strokeWidth={activeView === ViewState.HOME ? 2.5 : 2} />} 
            label="Accueil" 
            isActive={activeView === ViewState.HOME} 
            onClick={() => onChangeView(ViewState.HOME)} 
          />
          <NavItem 
            icon={<Activity size={22} strokeWidth={activeView === ViewState.ACTIVITY ? 2.5 : 2} />} 
            label="Fit" 
            isActive={activeView === ViewState.ACTIVITY} 
            onClick={() => onChangeView(ViewState.ACTIVITY)} 
          />
          <NavItem 
            icon={<Utensils size={22} strokeWidth={activeView === ViewState.NUTRITION ? 2.5 : 2} />} 
            label="Manger" 
            isActive={activeView === ViewState.NUTRITION} 
            onClick={() => onChangeView(ViewState.NUTRITION)} 
          />
          <NavItem 
            icon={<Trophy size={22} strokeWidth={activeView === ViewState.GAMIFICATION ? 2.5 : 2} />} 
            label="Défis" 
            isActive={activeView === ViewState.GAMIFICATION} 
            onClick={() => onChangeView(ViewState.GAMIFICATION)} 
          />
          <NavItem 
            icon={<User size={22} strokeWidth={activeView === ViewState.PROFILE ? 2.5 : 2} />} 
            label="Profil" 
            isActive={activeView === ViewState.PROFILE} 
            onClick={() => onChangeView(ViewState.PROFILE)} 
          />
        </div>
      </nav>
    </div>
  );
};
