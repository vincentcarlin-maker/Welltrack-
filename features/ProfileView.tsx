
import React, { useState } from 'react';
import { UserProfile } from '../types';
// Fixed missing 'Zap' import
import { User, Ruler, Weight, Info, ChevronRight, Settings, Droplets, Zap } from 'lucide-react';
import { WellTrackLogo } from '../components/WellTrackLogo';

const ProfileField = ({ icon, label, name, value, onChange, type = "text" }: any) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">{icon}</div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
      <input 
        type={type} name={name} value={value} onChange={onChange}
        className="w-full bg-transparent font-bold text-slate-900 outline-none text-base"
      />
    </div>
  </div>
);

export const ProfileView: React.FC<{ user: UserProfile, onUpdate: (d: Partial<UserProfile>) => void }> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ ...user, age: user.age.toString(), weight: user.weight.toString(), height: user.height.toString(), hydrationGoal: user.hydrationGoal.toString() });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ 
      ...formData, 
      age: Number(formData.age), 
      weight: Number(formData.weight), 
      height: Number(formData.height),
      hydrationGoal: Number(formData.hydrationGoal)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bmi = (Number(formData.weight) / ((Number(formData.height) / 100) ** 2)).toFixed(1);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32">
      <header className="px-8 pt-[calc(2.5rem+env(safe-area-inset-top))] flex justify-between items-center mb-10">
        <div>
           <h1 className="text-3xl font-black uppercase tracking-tighter">Profil</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">WellTrack Elite Member</p>
        </div>
        <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100"><Settings size={20} className="text-slate-400" /></button>
      </header>

      <div className="px-8 flex flex-col items-center mb-10">
        <div className="relative mb-6">
           <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-brand-blue to-brand-accent shadow-glow">
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=1e293b&color=fff&size=200`} className="w-full h-full rounded-full border-4 border-white object-cover" alt="Profile" />
           </div>
           <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
              <Zap size={14} fill="currentColor" />
           </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h2>
        <span className="text-[10px] font-black text-brand-blue bg-brand-blue/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mt-3 border border-brand-blue/10">Niveau {user.level} Athlète</span>
      </div>

      <form onSubmit={handleSubmit} className="px-8 space-y-4">
        <ProfileField icon={<User size={20}/>} label="Nom complet" name="name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
        
        <div className="grid grid-cols-2 gap-4">
           <ProfileField icon={<Weight size={20}/>} label="Poids (kg)" name="weight" type="number" value={formData.weight} onChange={(e:any) => setFormData({...formData, weight: e.target.value})} />
           <ProfileField icon={<Ruler size={20}/>} label="Taille (cm)" name="height" type="number" value={formData.height} onChange={(e:any) => setFormData({...formData, height: e.target.value})} />
        </div>

        <ProfileField icon={<Droplets size={20} className="text-brand-blue"/>} label="Objectif Eau (ml)" name="hydrationGoal" type="number" value={formData.hydrationGoal} onChange={(e:any) => setFormData({...formData, hydrationGoal: e.target.value})} />

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden mt-6">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-2 flex items-center gap-2"><Info size={12}/> Métriques Santé</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{bmi}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">IMC</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Votre poids est optimal pour votre taille.</p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <WellTrackLogo size={32} showText={false} variant="white" />
                </div>
              </div>
           </div>
        </div>

        <button type="submit" className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-95 mt-6 ${saved ? 'bg-brand-accent' : 'bg-brand-blue'} text-white shadow-blue-500/20`}>
          {saved ? 'Profil Mis à Jour ✓' : 'Sauvegarder les Changements'}
        </button>
      </form>
    </div>
  );
};
