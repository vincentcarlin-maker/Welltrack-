
import React from 'react';
import { ViewState } from '../types';
import { Home, Activity, Moon, Utensils, Trophy, User } from 'lucide-react';

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
    className={`flex flex-col items-center justify-center w-full py-2 transition-all active:scale-90 transform duration-200 ${isActive ? 'text-brand-blue scale-110' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className={`text-[9px] mt-1 font-bold uppercase tracking-tighter transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Content Area - respect safe-area-inset-top for Dynamic Island */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth-mobile w-full no-scrollbar">
        {children}
      </main>

      {/* Floating Bottom Navigation for iPhone 17 Pro style */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-[calc(10px+env(safe-area-inset-bottom))] pointer-events-none">
        <nav className="bg-white/80 backdrop-blur-2xl border border-white/20 shadow-pro rounded-[2.5rem] flex justify-around items-center h-[64px] max-w-lg mx-auto px-4 pointer-events-auto">
          <NavItem 
            icon={<Home size={22} strokeWidth={activeView === ViewState.HOME ? 2.5 : 2} />} 
            label="Accueil" 
            isActive={activeView === ViewState.HOME} 
            onClick={() => onChangeView(ViewState.HOME)} 
          />
          <NavItem 
            icon={<Activity size={22} strokeWidth={activeView === ViewState.ACTIVITY ? 2.5 : 2} />} 
            label="Activité" 
            isActive={activeView === ViewState.ACTIVITY} 
            onClick={() => onChangeView(ViewState.ACTIVITY)} 
          />
          <NavItem 
            icon={<Utensils size={22} strokeWidth={activeView === ViewState.NUTRITION ? 2.5 : 2} />} 
            label="Repas" 
            isActive={activeView === ViewState.NUTRITION} 
            onClick={() => onChangeView(ViewState.NUTRITION)} 
          />
          <NavItem 
            icon={<Moon size={22} strokeWidth={activeView === ViewState.SLEEP ? 2.5 : 2} />} 
            label="Repos" 
            isActive={activeView === ViewState.SLEEP} 
            onClick={() => onChangeView(ViewState.SLEEP)} 
          />
          <NavItem 
            icon={<Trophy size={22} strokeWidth={activeView === ViewState.GAMIFICATION ? 2.5 : 2} />} 
            label="Défis" 
            isActive={activeView === ViewState.GAMIFICATION} 
            onClick={() => onChangeView(ViewState.GAMIFICATION)} 
          />
        </nav>
      </div>
    </div>
  );
};
