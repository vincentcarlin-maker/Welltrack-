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
    className={`flex flex-col items-center justify-center w-full py-2 transition-colors active:scale-90 transform duration-100 ${isActive ? 'text-neon-blue' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth-mobile pb-24 w-full">
        {children}
      </main>

      {/* Bottom Navigation - Fixed with Safe Area */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] pt-1">
        <div className="flex justify-around items-center h-14 max-w-md mx-auto px-1">
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
            label="Sommeil" 
            isActive={activeView === ViewState.SLEEP} 
            onClick={() => onChangeView(ViewState.SLEEP)} 
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