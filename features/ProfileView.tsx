
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
    <div className="p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] space-y-6 pb-24 animate-in slide-in-from-right duration-300">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
           <User className="text-brand-blue" /> Mon Profil
        </h2>
      </header>

      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-4xl shadow-inner border-4 border-white">
          {formData.gender === 'M' ? '👨‍💻' : '👩‍💻'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom</label>
            <div className="flex items-center bg-slate-50 rounded-xl px-3 border border-slate-200">
              <User size={18} className="text-slate-400" />
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent p-3 outline-none text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Poids (kg)</label>
                <div className="flex items-center bg-slate-50 rounded-xl px-3 border border-slate-200">
                  <Weight size={18} className="text-slate-400" />
                  <input 
                    type="number" name="weight" value={formData.weight} onChange={handleChange}
                    className="w-full bg-transparent p-3 outline-none text-slate-800 font-medium"
                  />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Taille (cm)</label>
                <div className="flex items-center bg-slate-50 rounded-xl px-3 border border-slate-200">
                  <Ruler size={18} className="text-slate-400" />
                  <input 
                    type="number" name="height" value={formData.height} onChange={handleChange}
                    className="w-full bg-transparent p-3 outline-none text-slate-800 font-medium"
                  />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Âge</label>
                <div className="flex items-center bg-slate-50 rounded-xl px-3 border border-slate-200">
                  <Calendar size={18} className="text-slate-400" />
                  <input 
                    type="number" name="age" value={formData.age} onChange={handleChange}
                    className="w-full bg-transparent p-3 outline-none text-slate-800 font-medium"
                  />
                </div>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Genre</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 outline-none text-slate-800 font-medium"
                >
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <Activity className="absolute -right-4 -top-4 text-slate-700 opacity-20" size={100} />
            <h3 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2">
                <Info size={18} className="text-brand-blue" />
                Vos Métriques
            </h3>
            <div className="grid grid-cols-2 gap-6 relative z-10">
                <div>
                    <span className="text-slate-400 text-xs uppercase block mb-1">IMC (BMI)</span>
                    <span className="text-3xl font-black text-white">{bmi}</span>
                    <span className="text-xs text-slate-400 block mt-1">
                        {Number(bmi) < 18.5 ? 'Maigreur' : Number(bmi) < 25 ? 'Normal' : 'Surpoids'}
                    </span>
                </div>
                <div>
                    <span className="text-slate-400 text-xs uppercase block mb-1">Métabolisme Base</span>
                    <span className="text-3xl font-black text-green-500">{Math.round(bmr > 0 ? bmr : 0)}</span>
                    <span className="text-xs text-slate-400 block mt-1">kcal / jour</span>
                </div>
            </div>
        </div>

        <button 
          type="submit"
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white active:scale-95'}`}
        >
          {isSaved ? 'Profil Mis à jour !' : 'Enregistrer Modifications'}
        </button>
      </form>
    </div>
  );
};
