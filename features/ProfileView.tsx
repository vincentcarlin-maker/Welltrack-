
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Ruler, Weight, Calendar, Activity, Info } from 'lucide-react';
import { FitrackIcon } from '../components/FitrackIcon';

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (data: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age.toString(),
    weight: user.weight.toString(),
    height: user.height.toString(),
    gender: user.gender
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      age: Number(formData.age) || 0,
      weight: Number(formData.weight) || 0,
      height: Number(formData.height) || 0,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const weightNum = Number(formData.weight) || 0;
  const heightNum = Number(formData.height) || 0;
  const ageNum = Number(formData.age) || 0;

  const bmi = heightNum > 0 ? (weightNum / ((heightNum / 100) ** 2)).toFixed(1) : '0';
  const bmr = formData.gender === 'M'
    ? (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5
    : (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;

  return (
    <div className="p-6 pt-[calc(3rem+env(safe-area-inset-top,20px))] space-y-6 pb-32 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-[900] text-slate-800 flex items-center gap-3 tracking-tighter uppercase">
           Mon Profil
        </h2>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {user.name.slice(0,3).toUpperCase()}-PRO</span>
        </div>
      </header>

      <div className="flex justify-center mb-10">
        <div className="relative animate-float">
          <FitrackIcon size={120} />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-dark shadow-lg border-2 border-white">
            <Activity size={18} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-pro border border-slate-50 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nom Fitrack</label>
            <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-100 focus-within:border-brand-blue transition-colors">
              <User size={18} className="text-slate-300" />
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent p-4 outline-none text-slate-800 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Poids (kg)</label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-100 focus-within:border-brand-blue transition-colors">
                  <Weight size={18} className="text-slate-300" />
                  <input 
                    type="number" name="weight" value={formData.weight} onChange={handleChange}
                    className="w-full bg-transparent p-4 outline-none text-slate-800 font-bold"
                  />
                </div>
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Taille (cm)</label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-100 focus-within:border-brand-blue transition-colors">
                  <Ruler size={18} className="text-slate-300" />
                  <input 
                    type="number" name="height" value={formData.height} onChange={handleChange}
                    className="w-full bg-transparent p-4 outline-none text-slate-800 font-bold"
                  />
                </div>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl"></div>
            <h3 className="font-[900] text-lg mb-6 relative z-10 flex items-center gap-2 uppercase tracking-tighter">
                <Info size={18} className="text-brand-accent" />
                Métriques de Performance
            </h3>
            <div className="grid grid-cols-2 gap-8 relative z-10">
                <div>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">IMC Elite</span>
                    <span className="text-4xl font-[900] text-white tracking-tighter">{bmi}</span>
                    <div className="mt-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${Number(bmi) < 25 ? 'bg-green-500/20 text-green-400' : 'bg-brand-accent/20 text-brand-accent'}`}>
                            {Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Optimal' : 'Athletic+'}
                        </span>
                    </div>
                </div>
                <div>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">Metabolism</span>
                    <span className="text-4xl font-[900] text-brand-accent tracking-tighter">{Math.round(bmr > 0 ? bmr : 0)}</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-1 uppercase">kcal / day</span>
                </div>
            </div>
        </div>

        <button 
          type="submit"
          className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-xl transition-all active:scale-95 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-brand-blue text-white'}`}
        >
          {isSaved ? 'PROFIL MIS À JOUR !' : 'ENREGISTRER LES MODIFICATIONS'}
        </button>
      </form>
    </div>
  );
};
