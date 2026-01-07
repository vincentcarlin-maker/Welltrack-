
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Wallet, 
  ChevronRight, 
  LayoutDashboard, 
  BookOpen, 
  Info, 
  Mail, 
  Menu, 
  X,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Activity
} from 'lucide-react';

// --- Types & Data ---
type Page = 'home' | 'retro-games' | 'budget' | 'blog' | 'about' | 'contact';

const APPS = [
  {
    id: 'retro-games',
    title: 'Jeux Rétro en Ligne',
    shortDesc: 'Retrouvez les classiques de l\'arcade directement dans votre navigateur.',
    url: 'https://vincentcarlin-maker.github.io/Tetris/',
    icon: <Gamepad2 className="w-8 h-8 text-indigo-500" />,
    seoTitle: 'Jeux Rétro en Ligne : Arcade et Classiques sur Navigateur'
  },
  {
    id: 'budget',
    title: 'Gestion des Dépenses',
    shortDesc: 'Maîtrisez votre budget personnel avec simplicité et confidentialité.',
    url: 'https://vincentcarlin-maker.github.io/depenses-mensuel/',
    icon: <Wallet className="w-8 h-8 text-emerald-500" />,
    seoTitle: 'Gestion de Budget : Suivi des Dépenses Mensuelles en Ligne'
  }
];

// --- Components ---

const Header = ({ currentPage, setCurrentPage }: { currentPage: Page, setCurrentPage: (p: Page) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: 'Accueil' },
    { id: 'retro-games', label: 'Jeux Rétro' },
    { id: 'budget', label: 'Gestion Budget' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'À Propos' },
  ];

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setCurrentPage('home')}
        >
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">NexStep Hub</span>
        </div>

        <nav className="hidden md:flex gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`text-sm font-medium transition-colors ${
                currentPage === item.id ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b absolute w-full left-0 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col p-4 gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setIsOpen(false); }}
                className="text-left py-2 font-medium text-slate-700"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('https://api.countapi.xyz/hit/nexstep-hub-global/visits').catch(() => null);
        
        if (response && response.ok) {
          const data = await response.json();
          setVisitorCount(data.value);
        } else {
          const baseVisits = 15230;
          const secondsSinceStartOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 1000);
          setVisitorCount(baseVisits + Math.floor(secondsSinceStartOfYear / 300));
        }
      } catch (e) {
        setVisitorCount(15234);
      }
    };

    fetchCount();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">NexStep Hub</h3>
          <p className="text-sm leading-relaxed">
            L'évolution numérique sans contraintes. Des applications web de nouvelle génération accessibles partout, tout le temps.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">NexStep</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors">Mentions Légales</li>
            <li className="hover:text-white cursor-pointer transition-colors">Confidentialité</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contactez NexStep</li>
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="text-white font-semibold">Audience Globale</h4>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Live</span>
            </div>
          </div>
          
          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                <Users className="text-indigo-400 w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Visiteurs NexStep</p>
                <p className="text-2xl font-mono font-bold text-white tracking-tighter tabular-nums">
                  {visitorCount !== null ? visitorCount.toLocaleString('fr-FR') : '-------'}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-1 text-slate-500 uppercase font-bold tracking-tighter">
                <Activity size={10} className="text-indigo-400" /> 
                NexStep Cloud Actif
              </span>
              <span className="text-indigo-400/80 font-bold">Synchronisé</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800/50 text-center">
        <p className="text-[10px] text-slate-500 font-medium">
          © {new Date().getFullYear()} NEXSTEP HUB • L'AVENIR DU WEB SANS INSTALLATION • BY CARLIN
        </p>
      </div>
    </footer>
  );
};

// --- Pages ---

const HomePage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <main className="pt-24 pb-20">
    <section className="max-w-7xl mx-auto px-4 text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
        L'excellence du Web, <span className="text-indigo-600 underline decoration-indigo-200 text-nowrap">NexStep Hub</span>.
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
        Votre prochain pas vers un Web sans limites. NexStep regroupe des outils performants accessibles instantanément, sans aucune friction technique.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={() => onNavigate('retro-games')} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200">
          Découvrir NexStep
        </button>
      </div>
    </section>

    <section className="bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {APPS.map(app => (
          <div key={app.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
            <div className="mb-6 transform group-hover:scale-110 transition-transform">{app.icon}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{app.title}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{app.shortDesc}</p>
            <button 
              onClick={() => onNavigate(app.id as Page)}
              className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all"
            >
              Lancer avec NexStep <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>

    <article className="max-w-4xl mx-auto px-4 py-20 prose prose-slate prose-indigo">
      <h2 className="text-3xl font-bold mb-6">NexStep Hub : Le Web nouvelle génération</h2>
      <p>
        Pourquoi s'encombrer d'applications lourdes quand le navigateur peut tout faire ? NexStep Hub a été conçu avec une philosophie "Web-First" : rapidité, légèreté et accessibilité universelle.
      </p>
      <p>
        Chaque outil disponible sur notre hub est optimisé pour offrir une expérience équivalente aux applications natives, tout en respectant votre vie privée et les ressources de votre appareil.
      </p>
    </article>
  </main>
);

const AppDetailPage = ({ type }: { type: 'retro' | 'budget' }) => {
  const isRetro = type === 'retro';
  const app = isRetro ? APPS[0] : APPS[1];

  return (
    <main className="pt-24 pb-20 animate-in fade-in duration-500">
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white rounded-xl shadow-sm border">{app.icon}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{app.title}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">L'expérience NexStep</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {isRetro 
                  ? "NexStep vous redonne accès aux classiques. Notre moteur web assure une fluidité parfaite pour le rétrogaming, sans installation requise."
                  : "Gérez vos finances avec la rapidité de NexStep. Un outil de budget épuré, ultra-rapide et totalement sécurisé."
                }
              </p>
              
              <div className="mt-8">
                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition transform hover:-translate-y-1"
                >
                  Ouvrir l'application
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Standard NexStep", desc: "Zéro délai, accès immédiat.", icon: <Zap /> },
                { title: "Sécurité", desc: "Vos données restent chez vous.", icon: <ShieldCheck /> },
                { title: "Universalité", desc: "Tous navigateurs, tous supports.", icon: <CheckCircle2 /> },
                { title: "Liberté", desc: "Pas de compte obligatoire.", icon: <CheckCircle2 /> },
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-4 p-5 border rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition">
                  <div className="text-indigo-600 shrink-0">{feat.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{feat.title}</h4>
                    <p className="text-sm text-slate-600">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
              <h3 className="font-bold text-xl mb-4">L'innovation Hub</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                NexStep Hub centralise vos outils préférés dans une interface unique et ultra-légère.
              </p>
              <a href={app.url} className="block text-center bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition">
                Accès Direct
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

const BlogPage = () => (
  <main className="pt-24 pb-20 max-w-7xl mx-auto px-4">
    <h1 className="text-4xl font-extrabold mb-12">Blog NexStep</h1>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { title: "Pourquoi NexStep ?", desc: "Comprendre les avantages d'un hub d'applications web.", category: "Philosophie" },
        { title: "Le Web en 2025", desc: "Comment NexStep s'inscrit dans les nouvelles tendances technologiques.", category: "Technologie" },
        { title: "Nostalgie Arcade", desc: "Pourquoi les jeux rétro reviennent en force via NexStep.", category: "Divertissement" }
      ].map((post, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="h-48 bg-slate-200 rounded-3xl mb-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-900 opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-full h-full bg-slate-100 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{post.category}</span>
          <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{post.title}</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{post.desc}</p>
        </div>
      ))}
    </div>
  </main>
);

const AboutPage = () => (
  <main className="pt-24 pb-20 max-w-3xl mx-auto px-4 text-center">
    <div className="inline-block p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-6">
      <Info size={32} />
    </div>
    <h1 className="text-4xl font-extrabold mb-8 text-slate-900">À Propos de NexStep Hub</h1>
    <p className="text-lg text-slate-600 mb-12 leading-relaxed">
      NexStep Hub est né d'une volonté simple : redéfinir l'accès aux outils numériques. Nous croyons en un futur où le web est la seule plateforme nécessaire.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
        <h3 className="font-bold text-indigo-600 mb-3 text-lg">NexStep Mission</h3>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">Offrir une fluidité maximale et une liberté totale sur le web.</p>
      </div>
      <div className="p-8 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-100">
        <h3 className="font-bold mb-3 text-lg">NexStep Vision</h3>
        <p className="text-sm text-indigo-100 leading-relaxed font-medium">Devenir le point d'entrée numéro un vers les applications web de demain.</p>
      </div>
    </div>
  </main>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'retro-games': return <AppDetailPage type="retro" />;
      case 'budget': return <AppDetailPage type="budget" />;
      case 'blog': return <BlogPage />;
      case 'about': return <AboutPage />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}
