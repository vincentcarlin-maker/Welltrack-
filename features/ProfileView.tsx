
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Ruler, Weight, Info, ChevronRight, Settings } from 'lucide-react';
import { FitrackIcon } from '../components/FitrackIcon';

const ProfileField = ({ icon, label, name, value, onChange, type = "text" }: any) => (
  <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">{icon}</div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <input 
        type={type} name={name} value={value} onChange={onChange}
        className="w-full bg-transparent font-bold text-slate-800 outline-none"
      />
    </div>
  </div>
);

export const ProfileView: React.FC<{ user: UserProfile, onUpdate: (d: Partial<UserProfile>) => void }> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ ...user, age: user.age.toString(), weight: user.weight.toString(), height: user.height.toString() });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...formData, age: Number(formData.age), weight: Number(formData.weight), height: Number(formData.height) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bmi = (Number(formData.weight) / ((Number(formData.height) / 100) ** 2)).toFixed(1);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32">
      <header className="px-8 pt-[calc(2rem+env(safe-area-inset-top))] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Athlète Profil</h1>
        <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100"><Settings size={20} /></button>
      </header>

      <div className="px-8 flex flex-col items-center mb-8">
        <FitrackIcon size={100} className="mb-4" />
        <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">WellTrack Elite Member</p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <ProfileField icon={<User size={18}/>} label="Nom" name="name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <ProfileField icon={<Weight size={18}/>} label="Poids (kg)" name="weight" type="number" value={formData.weight} onChange={(e:any) => setFormData({...formData, weight: e.target.value})} />
            <ProfileField icon={<Ruler size={18}/>} label="Taille (cm)" name="height" type="number" value={formData.height} onChange={(e:any) => setFormData({...formData, height: e.target.value})} />
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
           <div className="relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Info size={10}/> Performance Body</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black">{bmi}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">IMC Optimal</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Status</p>
                <span className="text-sm font-bold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">Athlète</span>
              </div>
           </div>
        </div>

        <button type="submit" className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-95 ${saved ? 'bg-emerald-500' : 'bg-brand-blue'} text-white`}>
          {saved ? 'Profil Mis à Jour ✓' : 'Enregistrer les modifications'}
        </button>
      </form>

      <div className="px-8 mt-6">
        <button className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Info size={16}/></div><span className="text-sm font-bold text-slate-800">Support WellTrack</span></div>
          <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
