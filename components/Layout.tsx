
import React from 'react';
import { ViewState } from '../types';
import { Home, Activity, Moon, Utensils, Trophy } from 'lucide-react';

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
    className={`flex flex-col items-center justify-center w-full py-2 transition-all active:scale-90 transform duration-300 ${isActive ? 'text-brand-blue scale-110' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`transition-transform duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(37,99,235,0.2)]' : ''}`}>
      {icon}
    </div>
    <span className={`text-[8px] mt-1 font-black uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  return (
    // On utilise min-h-screen et bg-brand-light pour couvrir tout l'espace
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* Zone de contenu - on s'assure qu'elle remplit bien tout l'espace flex */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth-mobile w-full no-scrollbar relative bg-[#F8FAFC]">
        {children}
      </main>

      {/* Navigation Flottante - sans aucun fond propre au conteneur parent */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-8 pb-[calc(16px+env(safe-area-inset-bottom))] pointer-events-none">
        <nav className="bg-white/60 backdrop-blur-3xl border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[2.5rem] flex justify-around items-center h-[72px] max-w-md mx-auto px-4 pointer-events-auto ring-1 ring-black/[0.03]">
          <NavItem 
            icon={<Home size={20} strokeWidth={activeView === ViewState.HOME ? 2.5 : 2} />} 
            label="Accueil" 
            isActive={activeView === ViewState.HOME} 
            onClick={() => onChangeView(ViewState.HOME)} 
          />
          <NavItem 
            icon={<Activity size={20} strokeWidth={activeView === ViewState.ACTIVITY ? 2.5 : 2} />} 
            label="Fit" 
            isActive={activeView === ViewState.ACTIVITY} 
            onClick={() => onChangeView(ViewState.ACTIVITY)} 
          />
          <NavItem 
            icon={<Utensils size={20} strokeWidth={activeView === ViewState.NUTRITION ? 2.5 : 2} />} 
            label="Manger" 
            isActive={activeView === ViewState.NUTRITION} 
            onClick={() => onChangeView(ViewState.NUTRITION)} 
          />
          <NavItem 
            icon={<Moon size={20} strokeWidth={activeView === ViewState.SLEEP ? 2.5 : 2} />} 
            label="Repos" 
            isActive={activeView === ViewState.SLEEP} 
            onClick={() => onChangeView(ViewState.SLEEP)} 
          />
          <NavItem 
            icon={<Trophy size={20} strokeWidth={activeView === ViewState.GAMIFICATION ? 2.5 : 2} />} 
            label="Défis" 
            isActive={activeView === ViewState.GAMIFICATION} 
            onClick={() => onChangeView(ViewState.GAMIFICATION)} 
          />
        </nav>
      </div>
    </div>
  );
};
