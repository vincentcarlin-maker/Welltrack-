
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Sparkles, BrainCircuit, Activity, Utensils, Zap, Loader2 } from 'lucide-react';
import { ChatMessage, UserProfile, ActivityLog } from '../../types';
import { getCoachResponse } from '../../services/coachService';

interface Props {
  user: UserProfile;
  activities: ActivityLog[];
  stats: any;
  onBack: () => void;
}

export const CoachChatView: React.FC<Props> = ({ user, activities, stats, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: `Salut ${user.name} ! Prêt à optimiser tes performances aujourd'hui ? Je suis ton coach WellTrack. Comment puis-je t'aider ?`, 
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const lastActivity = activities[0];
    const response = await getCoachResponse([...messages, userMsg], {
      user,
      lastActivity,
      dailyCalories: stats.dailyCalories,
      hydration: stats.hydration
    });

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const QuickChip = ({ label, icon, onClick }: any) => (
    <button onClick={onClick} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all whitespace-nowrap">
      {icon} {label}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="p-6 pt-12 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl border-b border-white/5 relative z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <BrainCircuit className="text-brand-blue" size={24} /> Coach <span className="text-brand-accent">Pro</span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">IA Active • Analyse en temps réel</span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed font-medium shadow-2xl ${
              m.role === 'user' 
                ? 'bg-brand-blue text-white rounded-tr-none' 
                : 'bg-white/10 backdrop-blur-md border border-white/10 text-slate-100 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-brand-blue" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Le coach analyse...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Interface */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-30">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          <QuickChip label="Analyse Séance" icon={<Activity size={12}/>} onClick={() => handleSend("Analyse ma dernière séance d'entraînement.")} />
          <QuickChip label="Conseil Nutrition" icon={<Utensils size={12}/>} onClick={() => handleSend("Donne-moi un conseil nutrition pour aujourd'hui.")} />
          <QuickChip label="Comment progresser ?" icon={<Zap size={12}/>} onClick={() => handleSend("Je stagne sur mes charges, quoi faire ?")} />
        </div>

        <div className="flex gap-3 bg-white/5 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/10 shadow-2xl">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Pose une question au coach..."
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-medium placeholder:text-slate-600"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              input.trim() ? 'bg-brand-blue text-white shadow-glow' : 'bg-white/5 text-slate-700'
            }`}
          >
            <Send size={20} className={input.trim() ? 'translate-x-0.5' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};
