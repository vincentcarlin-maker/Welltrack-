
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
    <div className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[9px] mt-1 font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth-mobile w-full no-scrollbar relative bg-[#F8FAFC]">
        {children}
      </main>

      {/* Barre de navigation fixée tout en bas avec l'onglet Profil ajouté */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)] flex items-center justify-around h-[calc(64px+env(safe-area-inset-bottom))]">
        <div className="flex justify-around items-center w-full max-w-lg mx-auto h-[64px] px-2">
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
