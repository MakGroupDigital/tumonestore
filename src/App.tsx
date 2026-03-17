import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Download, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  X, 
  Smartphone, 
  Apple, 
  Globe,
  TrendingUp,
  LayoutGrid,
  Gamepad2,
  Music2,
  Video,
  Wallet,
  CheckCircle2,
  Info,
  ShoppingBag,
  GraduationCap,
  Trophy,
  ChevronDown
} from 'lucide-react';
import { cn } from './lib/utils';
import { APPS, AppData } from './data';
import { useAppState, LanguageCode } from './hooks/useAppState';
import { usePersistedState } from './hooks/usePersistedState';

// Composant d'image optimisé
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  loading = 'lazy',
  priority = false 
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {hasError && (
        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
          <div className="text-white/40 text-xs">Image non disponible</div>
        </div>
      )}
    </div>
  );
};

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Social', icon: Globe },
  { name: 'Music', icon: Music2 },
  { name: 'Video', icon: Video },
  { name: 'Finance', icon: Wallet },
  { name: 'Games', icon: Gamepad2 },
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Education', icon: GraduationCap },
  { name: 'Sports', icon: Trophy },
];

type GuideStep = {
  title: string;
  detail: string;
};

type PlatformGuide = {
  label: string;
  title: string;
  description: string;
  steps: GuideStep[];
};

const BASE_DOWNLOAD_GUIDES_FR: Record<'android' | 'ios' | 'pwa', PlatformGuide> = {
  android: {
    label: 'Android',
    title: 'Installer une app Tumone Verified',
    description: 'Du “Get” au lancement, chaque action se fait dans un cadre animé type smartphone.',
    steps: [
      {
        title: 'Télécharger avec Get',
        detail: 'Appuyez sur “Get”, choisissez “Télécharger via Tumone Store” et attendez la progression.',
      },
      {
        title: 'Autoriser les sources inconnues',
        detail: 'Paramètres → Applications → Installer des sources inconnues → activez Tumone Store ou votre navigateur.',
      },
      {
        title: 'Suivre la barre d’état',
        detail: 'La progression anime le bouton jusqu’au “Installer”. Puis ouvrez l’app dès qu’elle est prête.',
      },
    ],
  },
  ios: {
    label: 'iPhone',
    title: 'Ajouter Tumone Store en PWA',
    description: 'Safari affiche un mockup iPhone avec le guide pas-à-pas, prêt pour vous.',
    steps: [
      {
        title: 'Ouvrir Safari',
        detail: 'Chargez tumone store, puis laissez la page se stabiliser.',
      },
      {
        title: 'Ajouter à l’écran d’accueil',
        detail: 'Partager → Ajouter à l’écran d’accueil → valider “Tumone Store”.',
      },
      {
        title: 'Lancer l’icône',
        detail: 'Tumone se lance comme une app native, prête à streamer vos apps Tumone Verified.',
      },
    ],
  },
  pwa: {
    label: 'Web / PWA',
    title: 'Installer sur tout appareil',
    description: 'Un cadre universel illustre la session en cours sur le navigateur ou le PWA.',
    steps: [
      {
        title: 'Cliquer sur le menu',
        detail: 'Plus → Ajouter à l’écran d’accueil ou “Installer l’app” selon le navigateur.',
      },
      {
        title: 'Confirmer l’installation',
        detail: 'L’animation guide l’utilisateur vers la création du raccourci dans le dock.',
      },
      {
        title: 'Retourner dans Tumone',
        detail: 'La nouvelle icône s’ajoute, prête à ouvrir chaque application Tumone Verified.',
      },
    ],
  },
};

const BASE_DOWNLOAD_GUIDES_EN: typeof BASE_DOWNLOAD_GUIDES_FR = {
  android: {
    label: 'Android',
    title: 'Install a Tumone Verified app',
    description: 'The animated phone frame walks you through download, permissions, and install.',
    steps: [
      {
        title: 'Tap Get',
        detail: 'Hit “Get”, choose “Download with Tumone Store” and let the APK stream.',
      },
      {
        title: 'Allow unknown sources',
        detail: 'Settings → Apps → Install unknown apps → allow Tumone Store or your browser.',
      },
      {
        title: 'Follow the progress',
        detail: 'Progress animates until “Install” clears, then open the app instantly.',
      },
    ],
  },
  ios: {
    label: 'iPhone',
    title: 'Add Tumone Store as a PWA',
    description: 'A sleek iPhone frame mirrors Safari and explains each tap.',
    steps: [
      {
        title: 'Open Safari',
        detail: 'Visit Tumone Store and wait for the immersive interface.',
      },
      {
        title: 'Add to Home Screen',
        detail: 'Share → Add to Home Screen → confirm “Tumone Store”.',
      },
      {
        title: 'Launch the icon',
        detail: 'It opens fullscreen, ready to host every verified download.',
      },
    ],
  },
  pwa: {
    label: 'Web / PWA',
    title: 'Install on any device',
    description: 'This universal frame highlights the install flow for browsers and PWAs.',
    steps: [
      {
        title: 'Open the menu',
        detail: 'Hit the browser menu, then “Add to Home Screen” or “Install app”.',
      },
      {
        title: 'Confirm installation',
        detail: 'Micro-animations show you exactly where to tap.',
      },
      {
        title: 'Return to Tumone',
        detail: 'A new shortcut appears, ready to launch verified apps.',
      },
    ],
  },
};

const DOWNLOAD_GUIDES: Record<LanguageCode, typeof BASE_DOWNLOAD_GUIDES_FR> = {
  fr: BASE_DOWNLOAD_GUIDES_FR,
  en: BASE_DOWNLOAD_GUIDES_EN,
  tsh: BASE_DOWNLOAD_GUIDES_FR,
  lin: BASE_DOWNLOAD_GUIDES_FR,
  sw: BASE_DOWNLOAD_GUIDES_FR,
};

const GUIDE_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const LANGUAGE_OPTIONS: LanguageCode[] = ['fr', 'en', 'tsh', 'lin', 'sw'];

const LOCALIZATION: Record<LanguageCode, {
  navTagline: string;
  searchPlaceholder: string;
  heroBadge: string;
  heroSecure: string;
  heroHeadline: string;
  heroAccent: string;
  heroBody: string;
  heroCta: string;
  trendingTitle: string;
  searchResultsTitle: string;
  appsFoundLabel: string;
  pulseTitle: string;
  pulseDescription: string;
}> = {
  fr: {
    navTagline: 'Chargez votre prochaine vague d\'applis',
    searchPlaceholder: 'Rechercher apps, jeux...',
    heroBadge: 'Choix de la rédaction',
    heroSecure: 'Sécurisé',
    heroHeadline: 'Vivez l\'expérience',
    heroAccent: 'Future des Apps',
    heroBody: 'Découvrez des applications ultra-rapides, modernes et sécurisées, sélectionnées pour votre appareil.',
    heroCta: 'Explorer maintenant',
    trendingTitle: 'Applications tendance',
    searchResultsTitle: 'Résultats de recherche',
    appsFoundLabel: 'apps trouvées',
    pulseTitle: 'Radar Tumone',
    pulseDescription: 'Suivez ce qui surfe sur les régions, appareils et créateurs. Tumone Radar repère les tendances avant qu\'elles n\'explosent.',
    downloadGuideTitle: 'Guide tactile pour télécharger',
    downloadGuideSubtitle: 'Un flux immersif par plateforme pour installer nos apps Tumone Verified comme un pro.',
    guideNext: 'Suivant',
    guideRepeat: 'Recommencer',
  },
  en: {
    navTagline: 'Charging your next app wave',
    searchPlaceholder: 'Search apps, games...',
    heroBadge: 'Editor\'s Choice',
    heroSecure: 'Secure',
    heroHeadline: 'Experience the',
    heroAccent: 'Future of Apps',
    heroBody: 'Discover ultra-fast, modern, and secure applications curated just for you.',
    heroCta: 'Explore Now',
    trendingTitle: 'Trending Apps',
    searchResultsTitle: 'Search Results',
    appsFoundLabel: 'apps found',
    pulseTitle: 'Pulse Radar',
    pulseDescription: 'Track what is surging across regions, devices, and creators. Tumone Radar highlights momentum before it becomes mainstream.',
    downloadGuideTitle: 'Download guide',
    downloadGuideSubtitle: 'Interactive phone frames for each platform showing how to install our verified apps.',
    guideNext: 'Next step',
    guideRepeat: 'Restart',
  },
  tsh: {
    navTagline: 'Sedala wamba wa mapema ya maputulu',
    searchPlaceholder: 'Lukula maputulu, mabunduku...',
    heroBadge: 'Kapowa ka bampehe',
    heroSecure: 'Bukalenge bukubeba',
    heroHeadline: 'Landa',
    heroAccent: 'Bumulu bwa Maputulu',
    heroBody: 'Landa maputulu ya luatshi, ma makaba ne bukalenge bubi ku cikila lukodi wa nshinga.',
    heroCta: 'Tala kusaka',
    trendingTitle: 'Maputulu ma musangu',
    searchResultsTitle: 'Mawenga ma lupupa',
    appsFoundLabel: 'maputulu ebikalile',
    pulseTitle: 'Radar ya Tumone',
    pulseDescription: 'Sunga memebi ya mawa, mapatya ne bana ba kulindila. Tumone Radar yalaka makambu liboso ya kusomba.',
    downloadGuideTitle: 'Download guide',
    downloadGuideSubtitle: 'Interactive phone frames for each platform showing how to install our verified apps.',
    guideNext: 'Suivant',
    guideRepeat: 'Recommencer',
  },
  lin: {
    navTagline: 'Sangisa mawimbi na yo ya applis',
    searchPlaceholder: 'Tala applis, ba jeux...',
    heroBadge: 'Liboso ya Bawuta',
    heroSecure: 'Nzela ya kobatela',
    heroHeadline: 'Yoka',
    heroAccent: 'Liso ya Applis',
    heroBody: 'Kokanisa applis ya suka, ya boboto mpe ya kofongola lifuti.',
    heroCta: 'Tala sikoyo',
    trendingTitle: 'Applis oyo ezali kotambola',
    searchResultsTitle: 'Bisengeli ya kosala',
    appsFoundLabel: 'applis oyo tozui',
    pulseTitle: 'Radar ya Tumone',
    pulseDescription: 'Tala oyo ezali kopusa na bitumba, bisika mpe bato ya kokelisa. Tumone Radar eyakana liboso.',
    downloadGuideTitle: 'Download guide',
    downloadGuideSubtitle: 'Interactive phone frames for each platform showing how to install our verified apps.',
    guideNext: 'Suivant',
    guideRepeat: 'Recommencer',
  },
  sw: {
    navTagline: 'Pokea wimbi lako lijalo la programu',
    searchPlaceholder: 'Tafuta apps, michezo...',
    heroBadge: 'Chaguo la Wahariri',
    heroSecure: 'Salama',
    heroHeadline: 'Pata uzoefu',
    heroAccent: 'Wakati wa Apps',
    heroBody: 'Gundua programu za kasi, za kisasa na salama zilizokusanywa kwa ajili yako.',
    heroCta: 'Chunguza sasa',
    trendingTitle: 'Programu zinazovuma',
    searchResultsTitle: 'Matokeo ya utafutaji',
    appsFoundLabel: 'apps zilizopatikana',
    pulseTitle: 'Redio ya Tumone',
    pulseDescription: 'Tazama kinachopanda katika maeneo, vifaa na waumbaji. Tumone Radar inaongoza kasi kabla haijaanguka.',
    downloadGuideTitle: 'Download guide',
    downloadGuideSubtitle: 'Interactive phone frames for each platform showing how to install our verified apps.',
    guideNext: 'Suivant',
    guideRepeat: 'Recommencer',
  },
};

const INNOVATION_CARDS: Record<LanguageCode, { title: string; desc: string; badge: string }[]> = {
  fr: [
    {
      title: 'Collections intelligentes',
      desc: 'Des sélections pilotées par l\'IA en fonction de votre usage réel. Pas de bruit, que de la vitesse.',
      badge: 'Nouveau',
    },
    {
      title: 'Restauration instantanée',
      desc: 'Récupération en un clic de vos apps essentielles. Changez de device sans perdre vos workflows.',
      badge: 'Nuage',
    },
    {
      title: 'Ateliers Créateurs',
      desc: 'Une rampe pour les créateurs émergents avec builds vérifiés et changelogs transparents.',
      badge: 'Mis en avant',
    },
  ],
  en: [
    {
      title: 'Smart Collections',
      desc: 'AI-curated drops based on how you actually use your device. No noise, just velocity.',
      badge: 'New',
    },
    {
      title: 'Instant Restore',
      desc: 'One-tap recovery for your essential stack. Switch devices and keep every workflow intact.',
      badge: 'Cloud',
    },
    {
      title: 'Creator Labs',
      desc: 'A spotlight lane for rising creators, powered by verified builds and transparent changelogs.',
      badge: 'Featured',
    },
  ],
  tsh: [
    {
      title: 'Bimuntu vya Malipuka',
      desc: 'Mapembele ya AI mu lifwa lya bakumba. Budi badinga, bulemboka.',
      badge: 'Sika',
    },
    {
      title: 'Kusosa kusanga',
      desc: 'Bukeba mu kukula ku diabu dya yo. Shala tshilema mu kusosa disangu.',
      badge: 'Luse',
    },
    {
      title: 'Batongolaji ba Bakanyi',
      desc: 'Mutoki wa ba creatéurs balesa ne changelog zyashala mu lisolo lavi.',
      badge: 'Bangi',
    },
  ],
  lin: [
    {
      title: 'Makoki ya Smart',
      desc: 'Ba sélections ya AI, ebimisami na ndenge otindi yo. Kozanga libanga, kaka malongo.',
      badge: 'Sika',
    },
    {
      title: 'Kokotisa Mbala',
      desc: 'Kozonga ya mbala moko na stack na yo. Warisa appareil mpe kokoba mosala.',
      badge: 'Lola',
    },
    {
      title: 'Ateliers ya Createurs',
      desc: 'Nzela mpo na base ya batu bafandaka, na builds ya solo mpe changelog ya transparence.',
      badge: 'Misala',
    },
  ],
  sw: [
    {
      title: 'Mikusanyiko Mahiri',
      desc: 'Mikusanyiko ya AI kulingana na jinsi unavyotumia kifaa chako. Hakuna kelele, kuna kasi.',
      badge: 'Mpya',
    },
    {
      title: 'Rejesho ya Haraka',
      desc: 'Uhuishaji wa apps muhimu mara moja. Badilisha kifaa bila kupoteza mtiririko.',
      badge: 'Wingu',
    },
    {
      title: 'Maabara za Waumbaji',
      desc: 'Mwanga kwa waumbaji wanaochipukia, kwa kuzingatia builds zilizo hakikishiwa na changelog wazi.',
      badge: 'Maarufu',
    },
  ],
};

const PULSE_STATS: Record<LanguageCode, { label: string; value: string; tone: string }[]> = {
  fr: [
    { label: 'Vélocité', value: '92%', tone: 'text-emerald-300' },
    { label: 'Indice de confiance', value: 'A+', tone: 'text-[color:var(--accent-yellow)]' },
    { label: 'Latence', value: '18ms', tone: 'text-blue-300' },
    { label: 'Nouveautés', value: '128', tone: 'text-purple-300' },
  ],
  en: [
    { label: 'Velocity', value: '92%', tone: 'text-emerald-300' },
    { label: 'Trust Score', value: 'A+', tone: 'text-[color:var(--accent-yellow)]' },
    { label: 'Latency', value: '18ms', tone: 'text-blue-300' },
    { label: 'Fresh Drops', value: '128', tone: 'text-purple-300' },
  ],
  tsh: [
    { label: 'Mwendu', value: '92%', tone: 'text-emerald-300' },
    { label: 'Kamfumu', value: 'A+', tone: 'text-[color:var(--accent-yellow)]' },
    { label: 'Buamba', value: '18ms', tone: 'text-blue-300' },
    { label: 'Mabunduku', value: '128', tone: 'text-purple-300' },
  ],
  lin: [
    { label: 'Mbangu', value: '92%', tone: 'text-emerald-300' },
    { label: 'Bundu ya sempala', value: 'A+', tone: 'text-[color:var(--accent-yellow)]' },
    { label: 'Ndenge ya kosala', value: '18ms', tone: 'text-blue-300' },
    { label: 'Sango sika', value: '128', tone: 'text-purple-300' },
  ],
  sw: [
    { label: 'Mwendo', value: '92%', tone: 'text-emerald-300' },
    { label: 'Alama ya Uaminifu', value: 'A+', tone: 'text-[color:var(--accent-yellow)]' },
    { label: 'Ucheleweshaji', value: '18ms', tone: 'text-blue-300' },
    { label: 'Mabusha', value: '128', tone: 'text-purple-300' },
  ],
};

export default function App() {
  const {
    language,
    setLanguage,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useAppState();
  const copy = LOCALIZATION[language] ?? LOCALIZATION.fr;
  const innovationCards = INNOVATION_CARDS[language] ?? INNOVATION_CARDS.fr;
  const pulseStats = PULSE_STATS[language] ?? PULSE_STATS.fr;
  
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'pwa'>('pwa');
  const [installStatus, setInstallStatus] = useState<'idle' | 'scanning' | 'downloading' | 'completed'>('idle');
  const [installProgress, setInstallProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [downloadingApps, setDownloadingApps] = useState<Set<string>>(new Set());
  const [screenshotGallery, setScreenshotGallery] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({ isOpen: false, images: [], currentIndex: 0 });
  const [guideStepIndex, setGuideStepIndex] = useState(0);
  const [guideLastSeen, setGuideLastSeen] = usePersistedState<number | null>('tumone-guide-last-seen', null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad')) {
      setPlatform('ios');
    } else if (ua.includes('android')) {
      setPlatform('android');
    } else {
      setPlatform('pwa');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setGuideStepIndex(0);
  }, [platform, language]);

  const downloadGuide = (DOWNLOAD_GUIDES[language] ?? DOWNLOAD_GUIDES.fr)[platform];
  const guideSteps = downloadGuide.steps;
  const currentGuideStep = guideSteps[guideStepIndex];
  const isLastGuideStep = guideStepIndex === guideSteps.length - 1;
  const shouldShowGuide = !guideLastSeen || Date.now() - guideLastSeen > GUIDE_TTL_MS;

  useEffect(() => {
    if (shouldShowGuide && !guideLastSeen) {
      setGuideLastSeen(Date.now());
    }
  }, [shouldShowGuide, guideLastSeen, setGuideLastSeen]);

  const handleGuideNext = () => {
    setGuideStepIndex(prev => {
      if (prev === guideSteps.length - 1) {
        setGuideLastSeen(Date.now());
        return 0;
      }
      return prev + 1;
    });
  };

  const normalizeText = (value: string) => {
    const cleaned = value.trim().toLowerCase();
    try {
      return cleaned.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    } catch {
      return cleaned;
    }
  };

  const filteredApps = useMemo(() => {
    const normalizedSearch = normalizeText(searchQuery);
    return APPS.filter(app => {
      const searchable = [
        app.name,
        app.developer,
        app.category,
        app.description,
      ].map(normalizeText);

      const matchesSearch = normalizedSearch === '' ||
        searchable.some(field => field.includes(normalizedSearch));

      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const openScreenshotGallery = (images: string[], index: number) => {
    setScreenshotGallery({ isOpen: true, images, currentIndex: index });
  };

  const closeScreenshotGallery = () => {
    setScreenshotGallery({ isOpen: false, images: [], currentIndex: 0 });
  };

  const navigateScreenshot = (direction: 'prev' | 'next') => {
    setScreenshotGallery(prev => ({
      ...prev,
      currentIndex: direction === 'next' 
        ? (prev.currentIndex + 1) % prev.images.length
        : (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  const handleModalDownload = async (app: AppData) => {
    // Détection automatique de la plateforme et redirection directe pour iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS && app.iosUrl) {
      // Redirection directe vers PWA pour iOS
      window.open(app.iosUrl, '_blank');
      return;
    }

    // Pour Android et autres plateformes
    setInstallStatus('scanning');
    setInstallProgress(0);

    // Simulate Security Scan
    await new Promise(resolve => setTimeout(resolve, 800));

    setInstallStatus('downloading');
    // Simulate Download Progress
    for (let i = 0; i <= 100; i += 25) {
      setInstallProgress(i);
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    setInstallStatus('completed');

    // Téléchargement après simulation
    setTimeout(() => {
      let downloadUrl = '';

      if (platform === 'android' && app.androidUrl) {
        downloadUrl = app.androidUrl;
      } else if (platform === 'ios' && app.iosUrl) {
        downloadUrl = app.iosUrl;
      } else if (app.pwaUrl) {
        downloadUrl = app.pwaUrl;
      } else {
        downloadUrl = app.androidUrl || app.iosUrl || '';
      }

      if (downloadUrl) {
        try {
          // Pour les liens Play Store, ouvrir directement
          if (downloadUrl.includes('play.google.com')) {
            window.open(downloadUrl, '_blank');
          } else {
            // Téléchargement direct pour les APK
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${app.name.toLowerCase().replace(/\s+/g, '-')}.apk`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (error) {
          console.error('Download error:', error);
          window.open(downloadUrl, '_blank');
        }
      }

      setInstallStatus('idle');
    }, 600);
  };

  const handleDownload = async (app: AppData) => {
    // Détection automatique de la plateforme et redirection directe pour iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS && app.iosUrl) {
      // Redirection directe vers PWA pour iOS
      window.open(app.iosUrl, '_blank');
      return;
    }

    // Ajouter l'app à la liste des téléchargements en cours
    setDownloadingApps(prev => new Set(prev).add(app.id));

    try {
      // Simulation du délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Pour Android et autres plateformes
      let downloadUrl = '';

      if (platform === 'android' && app.androidUrl) {
        downloadUrl = app.androidUrl;
      } else if (platform === 'ios' && app.iosUrl) {
        downloadUrl = app.iosUrl;
      } else if (app.pwaUrl) {
        downloadUrl = app.pwaUrl;
      } else {
        downloadUrl = app.androidUrl || app.iosUrl || '';
      }

      if (downloadUrl) {
        try {
          // Pour les liens Play Store, ouvrir directement
          if (downloadUrl.includes('play.google.com')) {
            window.open(downloadUrl, '_blank');
          } else {
            // Téléchargement direct pour les APK
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${app.name.toLowerCase().replace(/\s+/g, '-')}.apk`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (error) {
          console.error('Download error:', error);
          window.open(downloadUrl, '_blank');
        }
      }
    } finally {
      // Retirer l'app de la liste des téléchargements en cours
      setDownloadingApps(prev => {
        const newSet = new Set(prev);
        newSet.delete(app.id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050505]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-6">
              <motion.div
                className="relative w-28 h-28 rounded-3xl overflow-hidden border border-white/10 bg-white/5 yellow-glow"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img src="/logo.png" alt="Tumone Store" className="w-full h-full object-cover" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.15, 0.5, 0.15] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(circle at 30% 20%, rgba(247, 199, 28, 0.45), transparent 60%)" }}
                />
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="font-display text-2xl">Tumone Store</p>
                <p className="text-white/50 text-sm">{copy.navTagline}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 glass-dark border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 bg-white/5 border border-white/10 yellow-glow">
              <img src="/logo.png" alt="Tumone Store" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight hidden sm:block">
              Tumone <span className="text-[color:var(--accent-yellow)]">Store</span>
            </h1>
          </div>

          <div className="relative flex-1 max-w-md mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--accent-yellow)]/10 border border-[color:var(--accent-yellow)]/20 text-[color:var(--accent-yellow)] text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tumone Verified
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {LANGUAGE_OPTIONS.map((code) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    language === code
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex sm:hidden items-center gap-2">
              {LANGUAGE_OPTIONS.map((code) => (
                <button
                  key={`mobile-${code}`}
                  onClick={() => setLanguage(code)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-semibold border ${
                    language === code
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/60 border-white/20'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white/60" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap",
                selectedCategory === cat.name 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Hero Section */}
        {searchQuery === '' && selectedCategory === 'All' && (
          <section className="mb-8 sm:mb-12">
            <div className="relative h-[250px] sm:h-[350px] lg:h-[400px] rounded-[20px] sm:rounded-[32px] overflow-hidden group">
              <img
                src="/medium-shot-man-posing-futuristic-portrait.jpg"
                alt="Featured"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 xl:p-12 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4">
                  <span className="px-2 sm:px-3 py-1 rounded-full bg-[color:var(--accent-yellow)] text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                    {copy.heroBadge}
                  </span>
                  <div className="flex items-center gap-1 text-[color:var(--accent-yellow)] text-[10px] sm:text-xs font-medium">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {copy.heroSecure}
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-display font-bold mb-2 sm:mb-4 leading-tight">
                  {copy.heroHeadline} <br className="hidden sm:block" />
                  <span className="gradient-text">{copy.heroAccent}</span>
                </h2>
                <p className="text-white/60 max-w-xs sm:max-w-md mb-4 sm:mb-8 text-xs sm:text-sm lg:text-base leading-relaxed">
                  {copy.heroBody}
                </p>
                <button className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-[color:var(--accent-yellow)] text-black rounded-xl sm:rounded-2xl font-bold hover:bg-[color:var(--accent-yellow-deep)] transition-colors flex items-center gap-2 text-sm sm:text-base">
                  {copy.heroCta}
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Téléchargement immersif */}
        {shouldShowGuide && (
          <section className="mb-12">
            <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.6em] text-white/40">Tumone Download</p>
              <h3 className="text-3xl font-display font-bold">{copy.downloadGuideTitle}</h3>
            <p className="text-white/60 text-sm sm:text-base">{copy.downloadGuideSubtitle}</p>
          </div>
          <div className="mt-8 flex flex-col items-center gap-6 lg:gap-10">
            <div
              className={`relative w-full max-w-[360px] bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl p-6 ${platform === 'ios' ? 'rounded-[80px] border-[12px] border-white/20' : platform === 'android' ? 'rounded-[45px] border-[16px] border-blue-500/40' : 'rounded-[40px] border-[14px] border-purple-500/40'}`}
            >
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.4em] text-white/60">{downloadGuide.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                    {guideStepIndex + 1}/{guideSteps.length}
                  </span>
                </div>
                <h4 className="text-2xl font-semibold">{downloadGuide.title}</h4>
                <p className="text-sm text-white/70 leading-relaxed">{downloadGuide.description}</p>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">{currentGuideStep.title}</p>
                  <p className="mt-2 text-sm text-white/80 leading-snug">{currentGuideStep.detail}</p>
                </div>
              </div>
            </div>
            <div className="flex w-full max-w-[360px] gap-2">
              {guideSteps.map((_, index) => (
                <span
                  key={index}
                  className={`flex-1 h-1 rounded-full transition ${index <= guideStepIndex ? 'bg-[color:var(--accent-yellow)]' : 'bg-white/10'}`}
                />
              ))}
            </div>
            <button
              onClick={handleGuideNext}
              className="px-6 py-2 rounded-2xl bg-white text-black font-semibold tracking-wide hover:bg-white/90 transition"
            >
              {isLastGuideStep ? copy.guideRepeat : copy.guideNext}
            </button>
          </div>
        </section>
        )}

        {/* App Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              {searchQuery ? copy.searchResultsTitle : copy.trendingTitle}
            </h3>
            <div className="text-white/40 text-sm">
              {filteredApps.length} {copy.appsFoundLabel}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 app-grid">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app) => (
                <motion.div
                  layout
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedApp(app)}
                  className="group glass rounded-[28px] p-5 cursor-pointer hover:bg-white/10 transition-all hover:border-white/20"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                      <OptimizedImage
                        src={app.icon}
                        alt={app.name}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg truncate group-hover:text-blue-400 transition-colors">{app.name}</h4>
                      <p className="text-white/40 text-sm truncate">{app.developer}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-white/60">{app.rating}</span>
                        <span className="text-[10px] text-white/30 ml-1">• {app.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                      {app.size}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(app);
                      }}
                      disabled={downloadingApps.has(app.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-w-[60px] justify-center ${
                        downloadingApps.has(app.id)
                          ? "bg-blue-600/20 text-blue-400 cursor-not-allowed"
                          : "bg-white/10 hover:bg-blue-600 hover:text-white"
                      }`}
                    >
                      {downloadingApps.has(app.id) ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-3.5 h-3.5"
                        >
                          <Download className="w-full h-full" />
                        </motion.div>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          Get
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
        {/* Innovation Sections */}
        <section className="mt-16 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {innovationCards.map((card) => (
              <div key={card.title} className="glass rounded-[28px] p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest text-white/50">{card.title}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[color:var(--accent-yellow)] text-black">
                    {card.badge}
                  </span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="glass rounded-[32px] p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-display font-bold mb-3">{copy.pulseTitle}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {copy.pulseDescription}
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {pulseStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* App Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass-dark rounded-[40px] overflow-hidden flex flex-col shadow-2xl border-white/10"
            >
              <button 
                onClick={() => setSelectedApp(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto p-8 sm:p-12">
                <div className="flex flex-col md:flex-row gap-8 mb-12">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0">
                    <OptimizedImage
                      src={selectedApp.icon}
                      alt={selectedApp.name}
                      className="w-full h-full"
                      priority={true}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl sm:text-4xl font-display font-bold">{selectedApp.name}</h2>
                      {selectedApp.isVerified && (
                        <CheckCircle2 className="w-6 h-6 text-blue-400" />
                      )}
                    </div>
                    <p className="text-blue-400 font-medium text-lg mb-6">{selectedApp.developer}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center p-3 rounded-2xl bg-white/5">
                        <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Rating</div>
                        <div className="font-bold text-lg flex items-center justify-center gap-1">
                          {selectedApp.rating} <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-white/5">
                        <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Reviews</div>
                        <div className="font-bold text-lg">{selectedApp.reviews}</div>
                      </div>
                      <div className="text-center p-3 rounded-2xl bg-white/5">
                        <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Size</div>
                        <div className="font-bold text-lg">{selectedApp.size}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button 
                        disabled={installStatus !== 'idle'}
                        onClick={() => handleModalDownload(selectedApp)}
                        className={cn(
                          "flex-1 min-w-[200px] py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl",
                          installStatus === 'idle' 
                            ? "bg-white text-black hover:bg-blue-50 shadow-white/5" 
                            : "bg-blue-600/20 text-blue-400 cursor-default"
                        )}
                      >
                        {installStatus === 'idle' && (
                          <>
                            <Download className="w-5 h-5" />
                            Install Now
                          </>
                        )}
                        {installStatus === 'scanning' && (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                              <ShieldCheck className="w-5 h-5" />
                            </motion.div>
                            Scanning for threats...
                          </>
                        )}
                        {installStatus === 'downloading' && (
                          <div className="flex flex-col items-center w-full px-4">
                            <div className="flex justify-between w-full mb-1 text-xs">
                              <span>Downloading...</span>
                              <span>{installProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${installProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {installStatus === 'completed' && (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            Securely Installed
                          </>
                        )}
                      </button>
                      <button className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Info className="w-6 h-6 text-white/60" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Screenshots */}
                <div className="mb-12">
                  <h4 className="text-xl font-display font-bold mb-6">Screenshots</h4>
                  <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {selectedApp.screenshots.map((src, i) => (
                      <div 
                        key={i} 
                        className="h-[300px] sm:h-[350px] lg:h-[400px] w-[180px] sm:w-[200px] lg:w-[220px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => openScreenshotGallery(selectedApp.screenshots, i)}
                      >
                        <img
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Play Protect Banner */}
                <div className="mb-8 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-400">Tumone Protect Verified</h4>
                      <p className="text-white/40 text-sm">This app has been scanned and is safe to install on your device.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-emerald-500/10 pt-6">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      No malware detected
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Privacy verified
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Secure connection
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                  <h4 className="text-xl font-display font-bold mb-4">About this app</h4>
                  <p className="text-white/60 leading-relaxed">
                    {selectedApp.description}
                  </p>
                </div>

                {/* App Suggestions */}
                <div className="mb-12">
                  <h4 className="text-xl font-display font-bold mb-6">You might also like</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {APPS.filter(app => 
                      app.id !== selectedApp.id && 
                      app.category === selectedApp.category
                    ).slice(0, 3).map(suggestedApp => (
                      <div 
                        key={suggestedApp.id}
                        className="glass rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => setSelectedApp(suggestedApp)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={suggestedApp.icon}
                              alt={suggestedApp.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm truncate">{suggestedApp.name}</h5>
                            <p className="text-white/40 text-xs truncate">{suggestedApp.developer}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-medium text-white/60">{suggestedApp.rating}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(suggestedApp);
                          }}
                          disabled={downloadingApps.has(suggestedApp.id)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            downloadingApps.has(suggestedApp.id)
                              ? "bg-blue-600/20 text-blue-400 cursor-not-allowed"
                              : "bg-white/10 hover:bg-blue-600 hover:text-white"
                          }`}
                        >
                          {downloadingApps.has(suggestedApp.id) ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="w-3.5 h-3.5"
                            >
                              <Download className="w-full h-full" />
                            </motion.div>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              Get
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Screenshot Gallery Modal */}
      <AnimatePresence>
        {screenshotGallery.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full flex items-center justify-center p-4"
            >
              {/* Close Button */}
              <button 
                onClick={closeScreenshotGallery}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Navigation Buttons */}
              {screenshotGallery.images.length > 1 && (
                <>
                  <button 
                    onClick={() => navigateScreenshot('prev')}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-white rotate-180" />
                  </button>
                  <button 
                    onClick={() => navigateScreenshot('next')}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              {/* Current Screenshot */}
              <div className="max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <img
                  src={screenshotGallery.images[screenshotGallery.currentIndex]}
                  alt={`Screenshot ${screenshotGallery.currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Image Counter */}
              {screenshotGallery.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
                  {screenshotGallery.currentIndex + 1} / {screenshotGallery.images.length}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 yellow-glow">
              <img src="/logo.png" alt="Tumone Store" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-lg">Tumone Store</span>
          </div>
          <div className="flex gap-8 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Developer Portal</a>
          </div>
          <div className="flex items-center gap-4">
            <Apple className="w-5 h-5 text-white/20" />
            <Smartphone className="w-5 h-5 text-white/20" />
            <Globe className="w-5 h-5 text-white/20" />
          </div>
        </div>
        <div className="text-center mt-12 text-white/20 text-xs">
          © {new Date().getFullYear()} Tumone Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
