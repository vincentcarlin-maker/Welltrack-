
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
  Zap
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
          <span className="text-xl font-bold text-slate-900 tracking-tight">WellTrack Hub</span>
        </div>

        {/* Desktop Nav */}
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

      {/* Mobile Nav */}
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

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 className="text-white font-bold text-lg mb-4">WellTrack Hub</h3>
        <p className="text-sm leading-relaxed">
          Développement d'applications web modernes, rapides et accessibles.
          Pas de stores, pas de téléchargements, juste du web performant.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Liens Rapides</h4>
        <ul className="space-y-2 text-sm">
          <li>Mentions Légales</li>
          <li>Politique de Confidentialité</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Engagement</h4>
        <p className="text-sm">
          Toutes nos applications respectent votre vie privée et sont optimisées pour les navigateurs modernes.
        </p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
      © {new Date().getFullYear()} WellTrack Hub. Tous droits réservés.
    </div>
  </footer>
);

// --- Pages ---

const HomePage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <main className="pt-24 pb-20">
    <section className="max-w-7xl mx-auto px-4 text-center mb-20">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
        L'excellence du Web, <span className="text-indigo-600 underline decoration-indigo-200">sans installation</span>.
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
        Découvrez des outils et divertissements performants accessibles instantanément. 
        WellTrack Hub regroupe des applications web légères conçues pour répondre à vos besoins quotidiens.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={() => onNavigate('retro-games')} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition">
          Explorer les Applications
        </button>
      </div>
    </section>

    <section className="bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {APPS.map(app => (
          <div key={app.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="mb-6">{app.icon}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{app.title}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{app.shortDesc}</p>
            <button 
              onClick={() => onNavigate(app.id as Page)}
              className="flex items-center gap-2 text-indigo-600 font-bold group-hover:translate-x-1 transition-transform"
            >
              Découvrir la solution <ChevronRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>

    <article className="max-w-4xl mx-auto px-4 py-20 prose prose-slate">
      <h2 className="text-3xl font-bold mb-6">Pourquoi choisir des applications web plutôt que des apps natives ?</h2>
      <p>
        Dans un monde saturé par les notifications et les boutiques d'applications encombrées, les applications web représentent 
        l'avenir de l'informatique personnelle. Accessibles via un simple lien, elles ne nécessitent aucun téléchargement, 
        ne consomment pas d'espace disque permanent et se mettent à jour instantanément de manière transparente.
      </p>
      <p>
        Chez WellTrack Hub, nous nous engageons à créer des outils web qui respectent votre appareil et votre temps. 
        Que ce soit pour une pause ludique avec nos jeux rétro ou pour une gestion sérieuse de vos finances, 
        tout est à portée de clic, sans friction.
      </p>
    </article>
  </main>
);

const AppDetailPage = ({ type }: { type: 'retro' | 'budget' }) => {
  const isRetro = type === 'retro';
  const app = isRetro ? APPS[0] : APPS[1];

  return (
    <main className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white rounded-xl shadow-sm border">{app.icon}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{app.title}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200">
              <h2 className="text-2xl font-bold mb-4">Présentation de la solution</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {isRetro 
                  ? "Plongez dans l'univers de l'arcade classique avec notre application de jeux rétro. Conçue pour offrir une expérience fluide et nostalgique, elle regroupe des titres légendaires optimisés pour tous les écrans. Pas besoin de console ni d'émulateur complexe : ouvrez votre navigateur et jouez."
                  : "Le suivi budgétaire n'a jamais été aussi limpide. Notre application de gestion des dépenses vous permet de garder un œil sur chaque centime sans complexité inutile. Un outil pensé pour la rapidité de saisie et la clarté visuelle, idéal pour ceux qui veulent reprendre le contrôle de leurs finances."
                }
              </p>
              
              <div className="mt-8 flex gap-4">
                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition"
                >
                  {isRetro ? "Jouer en ligne maintenant" : "Accéder à l'application"}
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Rapidité", desc: "Accès instantané sans chargement long.", icon: <Zap /> },
                { title: "Confidentialité", desc: "Vos données restent locales.", icon: <ShieldCheck /> },
                { title: "Compatibilité", desc: "Fonctionne sur PC, Mac, iOS et Android.", icon: <CheckCircle2 /> },
                { title: "Gratuité", desc: "Solution web accessible sans abonnement.", icon: <CheckCircle2 /> },
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-4 p-4 border rounded-xl bg-slate-50">
                  <div className="text-indigo-600">{feat.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{feat.title}</h4>
                    <p className="text-sm text-slate-600">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <article className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold">Détails et Fonctionnalités</h2>
              <p>
                {isRetro 
                  ? "Notre plateforme de jeux utilise les dernières technologies web pour garantir une réactivité parfaite. Les contrôles sont intuitifs, que vous soyez sur un clavier physique ou un écran tactile. Nous avons sélectionné des jeux qui ont marqué l'histoire pour vous offrir une pause détente de qualité."
                  : "L'application de budget se concentre sur l'essentiel : la vision globale de vos entrées et sorties d'argent. Grâce à des graphiques dynamiques, vous identifiez vos postes de dépenses les plus importants en un clin d'œil. C'est l'outil parfait pour une gestion financière saine au quotidien."
                }
              </p>
              <h3 className="text-xl font-bold mt-6">Comment utiliser l'application ?</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Cliquez sur le bouton d'accès en haut de page.</li>
                <li>L'application se charge instantanément dans votre onglet actuel.</li>
                <li>Commencez à l'utiliser directement : pas d'inscription requise pour la plupart des fonctions de base.</li>
                <li>Ajoutez la page à vos favoris pour y revenir en un clic.</li>
              </ol>
            </article>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Foire aux Questions (FAQ)</h2>
              <div className="space-y-4">
                {[
                  { q: "L'application est-elle payante ?", a: "Non, l'accès est entièrement gratuit et libre." },
                  { q: "Est-ce sécurisé ?", a: "Oui, les applications web ne demandent pas d'accès à vos fichiers système et fonctionnent dans un bac à sable sécurisé." },
                  { q: "Puis-je l'utiliser hors-ligne ?", a: "Grâce à la mise en cache moderne, certaines fonctionnalités restent accessibles sans connexion active après le premier chargement." }
                ].map((faq, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-lg">
                    <h4 className="font-bold text-slate-900">{faq.q}</h4>
                    <p className="text-slate-600 mt-2">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl">
              <h3 className="font-bold text-lg mb-4">Prêt à tester ?</h3>
              <p className="text-sm text-slate-400 mb-6">
                Redécouvrez le plaisir du web simple et efficace.
              </p>
              <a href={app.url} className="block text-center bg-white text-slate-900 py-3 rounded-lg font-bold hover:bg-slate-100 transition">
                Démarrer
              </a>
            </div>
            <div className="border border-slate-200 p-6 rounded-2xl">
              <h3 className="font-bold text-slate-900 mb-4">À propos de WellTrack</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                WellTrack Hub est une initiative visant à promouvoir des outils numériques qui simplifient la vie sans l'encombrer.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

const BlogPage = () => (
  <main className="pt-24 pb-20 max-w-7xl mx-auto px-4">
    <h1 className="text-4xl font-extrabold mb-12">Blog WellTrack</h1>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { title: "L'essor des Web Apps en 2025", desc: "Pourquoi les navigateurs deviennent la nouvelle plateforme de prédilection.", category: "Technologie" },
        { title: "5 conseils pour mieux gérer son budget", desc: "Des astuces simples pour épargner chaque mois.", category: "Productivité" },
        { title: "L'histoire de l'arcade : du physique au web", desc: "Comment le rétrogaming s'est adapté à nos navigateurs.", category: "Divertissement" }
      ].map((post, i) => (
        <div key={i} className="group cursor-pointer">
          <div className="h-48 bg-slate-200 rounded-2xl mb-4 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-slate-200 group-hover:scale-105 transition-transform" />
          </div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{post.category}</span>
          <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-indigo-600 transition-colors">{post.title}</h2>
          <p className="text-slate-600 text-sm">{post.desc}</p>
        </div>
      ))}
    </div>
  </main>
);

const AboutPage = () => (
  <main className="pt-24 pb-20 max-w-3xl mx-auto px-4 text-center">
    <h1 className="text-4xl font-extrabold mb-8">À Propos de WellTrack Hub</h1>
    <p className="text-lg text-slate-600 mb-12 leading-relaxed">
      WellTrack Hub est né d'une volonté simple : remettre l'utilisateur au centre de l'expérience numérique. 
      Nous pensons que les outils que nous utilisons tous les jours devraient être légers, universels et respectueux.
    </p>
    <div className="grid grid-cols-2 gap-8 text-left">
      <div className="p-6 bg-slate-50 rounded-2xl">
        <h3 className="font-bold text-indigo-600 mb-2">Notre Mission</h3>
        <p className="text-sm text-slate-600">Démocratiser l'accès à des applications de qualité sans barrières techniques.</p>
      </div>
      <div className="p-6 bg-slate-50 rounded-2xl">
        <h3 className="font-bold text-indigo-600 mb-2">Notre Vision</h3>
        <p className="text-sm text-slate-600">Un web où chaque besoin trouve sa solution en un clic, sur n'importe quel appareil.</p>
      </div>
    </div>
  </main>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}
