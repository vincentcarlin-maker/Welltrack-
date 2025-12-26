
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Ruler, Weight, Calendar, Activity, Info } from 'lucide-react';

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
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tighter">
           <div className="p-2 bg-blue-50 rounded-xl">
            <User className="text-brand-blue" size={24} />
           </div>
           Mon Profil
        </h2>
      </header>

      <div className="flex justify-center mb-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-white shadow-pro flex items-center justify-center text-5xl border-4 border-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent opacity-50"></div>
            {formData.gender === 'M' ? '👨‍💻' : '👩‍💻'}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white">
            <Activity size={18} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-pro border border-slate-50 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nom Complet</label>
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

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Âge</label>
                <div className="flex items-center bg-slate-50 rounded-2xl px-4 border border-slate-100 focus-within:border-brand-blue transition-colors">
                  <Calendar size={18} className="text-slate-300" />
                  <input 
                    type="number" name="age" value={formData.age} onChange={handleChange}
                    className="w-full bg-transparent p-4 outline-none text-slate-800 font-bold"
                  />
                </div>
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Genre</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none text-slate-800 font-bold appearance-none"
                >
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 className="font-black text-lg mb-6 relative z-10 flex items-center gap-2">
                <Info size={18} className="text-blue-400" />
                Métriques Santé
            </h3>
            <div className="grid grid-cols-2 gap-8 relative z-10">
                <div>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">IMC actuel</span>
                    <span className="text-4xl font-black text-white tracking-tighter">{bmi}</span>
                    <div className="mt-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${Number(bmi) < 25 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {Number(bmi) < 18.5 ? 'Maigreur' : Number(bmi) < 25 ? 'Normal' : 'Surpoids'}
                        </span>
                    </div>
                </div>
                <div>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">Métabolisme</span>
                    <span className="text-4xl font-black text-green-500 tracking-tighter">{Math.round(bmr > 0 ? bmr : 0)}</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-1 uppercase">kcal / jour</span>
                </div>
            </div>
        </div>

        <button 
          type="submit"
          className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${isSaved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'}`}
        >
          {isSaved ? 'Profil Mis à jour !' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
};
