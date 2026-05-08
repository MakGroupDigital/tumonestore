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

type FooterPageId = 'privacy' | 'terms' | 'developer';

const FOOTER_PAGES: Record<FooterPageId, {
  eyebrow: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: { title: string; body: string[] }[];
}> = {
  privacy: {
    eyebrow: 'Confiance et données',
    title: 'Privacy Policy',
    summary: 'Cette politique décrit notre approche de confidentialité pour Tumone Store, en reprenant les standards attendus sur les stores modernes : transparence, minimisation des données, sécurité et contrôle utilisateur.',
    updatedAt: 'Dernière mise à jour : 5 mai 2026',
    sections: [
      {
        title: 'Transparence des données',
        body: [
          'Chaque app publiée ou référencée doit expliquer clairement les données qu’elle collecte, pourquoi elle les collecte et comment l’utilisateur peut exercer ses droits.',
          'Comme sur les grands stores, les informations de confidentialité doivent rester cohérentes avec les fonctionnalités réelles de l’app et avec les permissions demandées.',
        ],
      },
      {
        title: 'Minimisation et finalité',
        body: [
          'Tumone Store ne doit traiter que les informations nécessaires au fonctionnement du store : préférences locales, langue, navigation, sécurité et amélioration de l’expérience.',
          'Les développeurs doivent éviter toute collecte excessive et ne pas détourner les données vers des usages non déclarés, publicitaires ou frauduleux.',
        ],
      },
      {
        title: 'Sécurité, consentement et contrôle',
        body: [
          'Les apps doivent demander les permissions sensibles uniquement quand elles sont nécessaires et avec un contexte compréhensible pour l’utilisateur.',
          'L’utilisateur garde le contrôle : refus d’une permission, suppression des données locales, désinstallation, signalement et accès aux politiques propres de chaque app.',
        ],
      },
      {
        title: 'Apps tierces et responsabilités',
        body: [
          'Les apps référencées dans Tumone Store peuvent disposer de leurs propres conditions, politiques de confidentialité et systèmes de compte.',
          'Tumone Store peut retirer une app qui présente un risque de sécurité, une collecte opaque, une usurpation d’identité ou une violation manifeste des règles de confiance.',
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Règles du service',
    title: 'Terms of Service',
    summary: 'Ces conditions définissent les règles d’utilisation de Tumone Store comme marketplace applicative : découverte, distribution, qualité, conformité et protection des utilisateurs.',
    updatedAt: 'Dernière mise à jour : 5 mai 2026',
    sections: [
      {
        title: 'Rôle de Tumone Store',
        body: [
          'Tumone Store permet aux utilisateurs de découvrir, consulter et ouvrir des applications sélectionnées, selon des critères de qualité, sécurité, transparence et pertinence.',
          'Le store peut référencer des expériences web, PWA ou autres formats applicatifs compatibles, sans se limiter à une seule technologie de distribution.',
        ],
      },
      {
        title: 'Qualité, sécurité et revue',
        body: [
          'Les apps doivent fonctionner comme annoncé, ne pas tromper l’utilisateur, ne pas copier abusivement une marque existante et ne pas manipuler notes, avis ou découverte.',
          'Tumone Store peut refuser, masquer, suspendre ou retirer une app qui présente un contenu dangereux, illégal, trompeur, malveillant ou contraire aux standards de distribution applicative.',
        ],
      },
      {
        title: 'Distribution et disponibilité',
        body: [
          'Les liens et fiches d’app doivent pointer vers des expériences officielles, stables et maintenues. Les métadonnées, captures, noms et descriptions doivent être exacts.',
          'L’accès à une app peut dépendre du réseau, de l’appareil, du navigateur, du pays, des politiques du développeur ou d’un service tiers.',
        ],
      },
      {
        title: 'Comptes, paiements et conformité',
        body: [
          'Lorsqu’une app propose des comptes, abonnements, achats ou contenus payants, elle doit présenter ses conditions de manière claire avant l’engagement de l’utilisateur.',
          'Les développeurs restent responsables du respect des lois applicables, de leurs licences, de leur propriété intellectuelle et des obligations liées aux plateformes utilisées.',
        ],
      },
    ],
  },
  developer: {
    eyebrow: 'Publication et intégration',
    title: 'Developer Portal',
    summary: 'Un espace de référence pour les développeurs qui souhaitent publier une app sur Tumone Store selon des standards proches des marketplaces reconnues.',
    updatedAt: 'Version portail : 2026.05',
    sections: [
      {
        title: 'Préparer une soumission',
        body: [
          'Fournissez le nom de l’app, le développeur, une description claire, la catégorie, l’âge ou public visé, les régions ciblées, les liens officiels et une politique de confidentialité.',
          'Les métadonnées doivent être fiables : pas de mots-clés trompeurs, pas de fausses captures, pas d’usurpation de marque, pas de promesse que l’app ne tient pas.',
        ],
      },
      {
        title: 'Assets et expérience produit',
        body: [
          'Préparez une icône nette, des captures réelles, une description courte, les informations de support, les liens légaux et une expérience adaptée mobile comme desktop.',
          'L’app doit être stable, rapide, accessible, maintenue et capable de gérer les erreurs, les écrans vides, les permissions et les états hors ligne quand c’est pertinent.',
        ],
      },
      {
        title: 'Sécurité et conformité développeur',
        body: [
          'Les développeurs doivent déclarer les données collectées, protéger les comptes utilisateurs, respecter les droits d’auteur, éviter les contenus interdits et fournir un canal de support.',
          'Les comportements malveillants, la collecte cachée, les fonctionnalités non déclarées, la manipulation d’avis ou l’imitation d’une app connue peuvent entraîner un retrait.',
        ],
      },
      {
        title: 'Distribution et cycle de vie',
        body: [
          'Tumone Store peut demander des corrections avant publication, contrôler les mises à jour importantes et retirer une app devenue indisponible ou non conforme.',
          'Les développeurs doivent maintenir leurs liens, informer des changements majeurs et s’assurer que l’expérience distribuée reste conforme aux informations publiées.',
        ],
      },
    ],
  },
};

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
    description: 'Tumone lance l’app officielle et vous accompagne jusqu’à la confirmation d’installation.',
    steps: [
      {
        title: 'Appuyer sur Installer',
        detail: 'Choisissez l’app, appuyez sur “Installer” et laissez Tumone ouvrir l’expérience officielle.',
      },
      {
        title: 'Ajouter à l’écran d’accueil',
        detail: 'Dans Chrome, ouvrez le menu puis choisissez “Ajouter à l’écran d’accueil” ou “Installer l’app”.',
      },
      {
        title: 'Retourner dans Tumone',
        detail: 'Revenez au store après confirmation pour continuer votre navigation.',
      },
    ],
  },
  ios: {
    label: 'iPhone',
    title: 'Ajouter Tumone Store à l’écran d’accueil',
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
    label: 'Navigateur',
    title: 'Installer sur tout appareil',
    description: 'Un cadre universel illustre la session en cours depuis le navigateur.',
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
    description: 'Tumone launches the official app experience and guides the user to the install confirmation.',
    steps: [
      {
        title: 'Tap Install',
        detail: 'Choose an app, tap “Install” and let Tumone open the official experience.',
      },
      {
        title: 'Add to Home Screen',
        detail: 'Open the browser menu, then choose “Install app” or “Add to Home Screen”.',
      },
      {
        title: 'Return to Tumone',
        detail: 'Confirm the installation, then return to Tumone Store to keep browsing.',
      },
    ],
  },
  ios: {
    label: 'iPhone',
    title: 'Add Tumone Store to Home Screen',
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
        detail: 'It opens fullscreen, ready to launch every verified app.',
      },
    ],
  },
  pwa: {
    label: 'Browser',
    title: 'Install on any device',
    description: 'This universal frame highlights the install flow from the browser.',
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
const REDIRECT_DELAY_MS = 4000;
const LANGUAGE_OPTIONS: LanguageCode[] = ['fr', 'en', 'tsh', 'lin', 'sw'];

const LOCALIZATION: Record<LanguageCode, {
  navTagline: string;
  searchPlaceholder: string;
  heroBadge: string;
  heroSecure: string;
  heroHeadline: string;
  heroAccent: string;
  heroTypewriterPhrases: string[];
  heroBody: string;
  heroCta: string;
  trendingTitle: string;
  searchResultsTitle: string;
  appsFoundLabel: string;
  pulseTitle: string;
  pulseDescription: string;
  downloadGuideTitle: string;
  downloadGuideSubtitle: string;
  guideNext: string;
  guideRepeat: string;
}> = {
  fr: {
    navTagline: 'Chargez votre prochaine vague d\'applis',
    searchPlaceholder: 'Rechercher apps, jeux...',
    heroBadge: 'Choix de la rédaction',
    heroSecure: 'Sécurisé',
    heroHeadline: 'Vivez l\'expérience',
    heroAccent: 'Future des Apps',
    heroTypewriterPhrases: [
      'Future des Apps',
      'Apps fiables et rapides',
      'Store intelligent',
    ],
    heroBody: 'Découvrez des applications ultra-rapides, modernes et sécurisées, sélectionnées pour votre appareil.',
    heroCta: 'Explorer maintenant',
    trendingTitle: 'Applications tendance',
    searchResultsTitle: 'Résultats de recherche',
    appsFoundLabel: 'apps trouvées',
    pulseTitle: 'Radar Tumone',
    pulseDescription: 'Suivez ce qui surfe sur les régions, appareils et créateurs. Tumone Radar repère les tendances avant qu\'elles n\'explosent.',
    downloadGuideTitle: 'Guide tactile pour installer',
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
    heroTypewriterPhrases: [
      'Future of Apps',
      'Fast trusted apps',
      'Smart app store',
    ],
    heroBody: 'Discover ultra-fast, modern, and secure applications curated just for you.',
    heroCta: 'Explore Now',
    trendingTitle: 'Trending Apps',
    searchResultsTitle: 'Search Results',
    appsFoundLabel: 'apps found',
    pulseTitle: 'Pulse Radar',
    pulseDescription: 'Track what is surging across regions, devices, and creators. Tumone Radar highlights momentum before it becomes mainstream.',
    downloadGuideTitle: 'Install guide',
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
    heroTypewriterPhrases: [
      'Bumulu bwa Maputulu',
      'Maputulu ma bukalenge',
      'Store wa mayele',
    ],
    heroBody: 'Landa maputulu ya luatshi, ma makaba ne bukalenge bubi ku cikila lukodi wa nshinga.',
    heroCta: 'Tala kusaka',
    trendingTitle: 'Maputulu ma musangu',
    searchResultsTitle: 'Mawenga ma lupupa',
    appsFoundLabel: 'maputulu ebikalile',
    pulseTitle: 'Radar ya Tumone',
    pulseDescription: 'Sunga memebi ya mawa, mapatya ne bana ba kulindila. Tumone Radar yalaka makambu liboso ya kusomba.',
    downloadGuideTitle: 'Guide d’installation',
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
    heroTypewriterPhrases: [
      'Liso ya Applis',
      'Applis ya kotyela motema',
      'Store ya mayele',
    ],
    heroBody: 'Kokanisa applis ya suka, ya boboto mpe ya kofongola lifuti.',
    heroCta: 'Tala sikoyo',
    trendingTitle: 'Applis oyo ezali kotambola',
    searchResultsTitle: 'Bisengeli ya kosala',
    appsFoundLabel: 'applis oyo tozui',
    pulseTitle: 'Radar ya Tumone',
    pulseDescription: 'Tala oyo ezali kopusa na bitumba, bisika mpe bato ya kokelisa. Tumone Radar eyakana liboso.',
    downloadGuideTitle: 'Guide d’installation',
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
    heroTypewriterPhrases: [
      'Wakati wa Apps',
      'Programu za kuaminika',
      'Store yenye akili',
    ],
    heroBody: 'Gundua programu za kasi, za kisasa na salama zilizokusanywa kwa ajili yako.',
    heroCta: 'Chunguza sasa',
    trendingTitle: 'Programu zinazovuma',
    searchResultsTitle: 'Matokeo ya utafutaji',
    appsFoundLabel: 'apps zilizopatikana',
    pulseTitle: 'Redio ya Tumone',
    pulseDescription: 'Tazama kinachopanda katika maeneo, vifaa na waumbaji. Tumone Radar inaongoza kasi kabla haijaanguka.',
    downloadGuideTitle: 'Mwongozo wa kusakinisha',
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
  const [redirectApp, setRedirectApp] = useState<AppData | null>(null);
  const [redirectProgress, setRedirectProgress] = useState(0);
  const [footerPage, setFooterPage] = useState<FooterPageId | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [downloadingApps, setDownloadingApps] = useState<Set<string>>(new Set());
  const [screenshotGallery, setScreenshotGallery] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({ isOpen: false, images: [], currentIndex: 0 });
  const [guideStepIndex, setGuideStepIndex] = useState(0);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeletingTypewriter, setIsDeletingTypewriter] = useState(false);
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

  useEffect(() => {
    const htmlLang: Record<LanguageCode, string> = {
      fr: 'fr',
      en: 'en',
      tsh: 'fr-CD',
      lin: 'ln-CD',
      sw: 'sw',
    };

    document.documentElement.lang = htmlLang[language] ?? 'fr';
  }, [language]);

  useEffect(() => {
    setTypewriterIndex(0);
    setTypedLength(0);
    setIsDeletingTypewriter(false);
  }, [language]);

  const typewriterPhrases = copy.heroTypewriterPhrases.length > 0
    ? copy.heroTypewriterPhrases
    : [copy.heroAccent];
  const activeTypewriterPhrase = typewriterPhrases[typewriterIndex % typewriterPhrases.length];
  const typedHeroAccent = activeTypewriterPhrase.slice(0, typedLength);

  useEffect(() => {
    const isComplete = typedLength === activeTypewriterPhrase.length;
    const isEmpty = typedLength === 0;
    const delay = isDeletingTypewriter
      ? 34
      : isComplete
        ? 1300
        : 62;

    const timer = window.setTimeout(() => {
      if (!isDeletingTypewriter && isComplete) {
        setIsDeletingTypewriter(true);
        return;
      }

      if (isDeletingTypewriter && isEmpty) {
        setIsDeletingTypewriter(false);
        setTypewriterIndex(prev => (prev + 1) % typewriterPhrases.length);
        return;
      }

      setTypedLength(prev => prev + (isDeletingTypewriter ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    activeTypewriterPhrase,
    isDeletingTypewriter,
    typedLength,
    typewriterPhrases.length,
  ]);

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

  const getAppWebUrl = (app: AppData) => app.pwaUrl || app.iosUrl || '';

  useEffect(() => {
    if (!redirectApp) return;

    const startedAt = Date.now();
    setRedirectProgress(0);

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setRedirectProgress(Math.min(100, Math.round((elapsed / REDIRECT_DELAY_MS) * 100)));
    }, 80);

    const timeout = window.setTimeout(() => {
      const webUrl = getAppWebUrl(redirectApp);
      if (webUrl) {
        window.location.href = webUrl;
      }
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [redirectApp]);

  const prepareInstallRedirect = (app: AppData) => {
    if (!getAppWebUrl(app)) return;

    setSelectedApp(null);
    setRedirectApp(app);
    setInstallStatus('downloading');
    setInstallProgress(0);
    setDownloadingApps(prev => new Set(prev).add(app.id));
  };

  useEffect(() => {
    setInstallProgress(redirectProgress);
  }, [redirectProgress]);

  const handleModalDownload = (app: AppData) => prepareInstallRedirect(app);

  const handleDownload = (app: AppData) => prepareInstallRedirect(app);

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
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-between">
          <div className="flex shrink-0 items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 bg-white/5 border border-white/10 yellow-glow">
              <img src="/logo.png" alt="Tumone Store" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight hidden sm:block">
              Tumone <span className="text-[color:var(--accent-yellow)]">Store</span>
            </h1>
          </div>

          <div className="relative order-3 w-full flex-none sm:order-none sm:mx-8 sm:max-w-md sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder={copy.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base sm:text-sm"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
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
            <div className="flex sm:hidden items-center gap-1">
              {LANGUAGE_OPTIONS.map((code) => (
                <button
                  key={`mobile-${code}`}
                  onClick={() => setLanguage(code)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-[9px] font-semibold border ${
                    language === code
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/60 border-white/20'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 sm:flex items-center justify-center">
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
            <div className="relative min-h-[430px] sm:min-h-[500px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] shadow-[0_34px_110px_rgba(0,0,0,0.52)] group">
              <img
                src="/medium-shot-man-posing-futuristic-portrait.jpg"
                alt="Featured"
                className="hero-bg-drift absolute inset-0 h-full w-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.78)_40%,rgba(0,0,0,0.18)_72%,rgba(0,0,0,0.62)_100%)]" />
              <div className="hero-aurora absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(247,199,28,0.22),transparent_25%),radial-gradient(circle_at_78%_20%,rgba(255,255,255,0.12),transparent_20%),radial-gradient(circle_at_68%_76%,rgba(16,185,129,0.16),transparent_28%)]" />
              <div className="absolute left-6 right-6 top-6 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-black via-black/65 to-transparent" />
              <div className="hero-orbit pointer-events-none absolute right-8 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.025] shadow-[inset_0_0_80px_rgba(255,255,255,0.05),0_0_90px_rgba(247,199,28,0.12)] lg:block" />
              <div className="hero-orbit-inner pointer-events-none absolute right-24 top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-[color:var(--accent-yellow)]/20 lg:block" />

              <div className="relative z-10 flex min-h-[430px] sm:min-h-[500px] flex-col gap-8 p-5 sm:gap-10 sm:p-8 lg:p-12">
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[color:var(--accent-yellow)] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.24em] text-black shadow-[0_0_34px_rgba(247,199,28,0.3)] sm:text-[10px]">
                      {copy.heroBadge}
                    </span>
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[10px] font-medium text-white/75 backdrop-blur-xl sm:text-xs">
                      <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {copy.heroSecure}
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white/65 backdrop-blur-xl sm:flex">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.85)]" />
                    {filteredApps.length} {copy.appsFoundLabel}
                  </div>
                </div>

                <div className="relative z-10 mt-auto max-w-3xl">
                  <h2 className="text-4xl font-display font-bold leading-[0.92] sm:text-6xl lg:text-7xl xl:text-8xl">
                    {copy.heroHeadline} <br className="hidden sm:block" />
                    <span className="gradient-text inline-flex min-h-[1.05em] items-baseline">
                      {typedHeroAccent || '\u00a0'}
                      <span className="typewriter-cursor ml-1 inline-block h-[0.78em] w-[3px] rounded-full bg-[color:var(--accent-yellow)] align-[-0.04em]" />
                    </span>
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/68 sm:text-base lg:text-lg">
                    {copy.heroBody}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black shadow-[0_20px_55px_rgba(255,255,255,0.16)] transition hover:bg-[color:var(--accent-yellow)] sm:px-7 sm:py-3.5 sm:text-base">
                      {copy.heroCta}
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="hero-signal-bar pointer-events-none relative z-10 h-14 rounded-full border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(247,199,28,0.12)] backdrop-blur-xl sm:h-16">
                  <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-yellow)]/70 to-transparent" />
                  <div className="hero-signal-dot absolute left-[16%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[color:var(--accent-yellow)] shadow-[0_0_20px_rgba(247,199,28,0.9)]" />
                  <div className="hero-signal-dot absolute left-[48%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.7)] [animation-delay:0.8s]" />
                  <div className="hero-signal-dot absolute right-[18%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)] [animation-delay:1.6s]" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Téléchargement immersif */}
        {shouldShowGuide && (
          <section className="mb-12">
            <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
              <p className="text-[10px] uppercase tracking-[0.6em] text-white/40">Tumone Install</p>
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

          <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 app-grid">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app) => (
                <motion.div
                  layout
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedApp(app)}
                  className="group glass aspect-square rounded-[20px] p-3 sm:p-4 cursor-pointer hover:bg-white/10 transition-all hover:border-white/20 flex flex-col items-center justify-between text-center"
                >
                  <div className="flex w-full min-w-0 flex-col items-center">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl shadow-xl transition-transform group-hover:scale-105 sm:h-16 sm:w-16">
                      <OptimizedImage
                        src={app.icon}
                        alt={app.name}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="mt-2 w-full min-w-0 sm:mt-3">
                      <h4 className="truncate text-xs font-bold transition-colors group-hover:text-blue-400 sm:text-sm">{app.name}</h4>
                      <p className="mt-0.5 truncate text-[10px] text-white/38 sm:text-xs">{app.category}</p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1 text-[10px] font-medium text-white/55 sm:text-xs">
                      <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />
                      <span>{app.rating}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(app);
                      }}
                      aria-label={`Installer ${app.name}`}
                      disabled={downloadingApps.has(app.id)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all sm:h-9 sm:w-9 ${
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
                        <Download className="w-3.5 h-3.5" />
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
                        disabled={installStatus === 'scanning' || installStatus === 'downloading'}
                        onClick={() => {
                          if (installStatus === 'completed') {
                            setInstallStatus('idle');
                            setSelectedApp(null);
                            return;
                          }

                          handleModalDownload(selectedApp);
                        }}
                        className={cn(
                          "flex-1 min-w-[200px] py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl",
                          installStatus === 'idle' || installStatus === 'completed'
                            ? "bg-white text-black hover:bg-blue-50 shadow-white/5" 
                            : "bg-blue-600/20 text-blue-400 cursor-default"
                        )}
                      >
                        {installStatus === 'idle' && (
                          <>
                            <Download className="w-5 h-5" />
                            Installer
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
                            Préparation sécurisée...
                          </>
                        )}
                        {installStatus === 'downloading' && (
                          <div className="flex flex-col items-center w-full px-4">
                            <div className="flex justify-between w-full mb-1 text-xs">
                              <span>Préparation...</span>
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
                            Retour au Store
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
                              Installer
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

      {/* Install Redirect Assistant */}
      <AnimatePresence>
        {redirectApp && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[#050505] p-5">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(247,199,28,0.18),transparent_28%),radial-gradient(circle_at_72%_68%,rgba(16,185,129,0.15),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_40%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:64px_64px]" />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="relative w-full max-w-xl overflow-hidden rounded-[36px] border border-white/10 bg-black/55 p-6 shadow-[0_34px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-8"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-yellow)]/70 to-transparent" />
              <div className="flex flex-col items-center text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-[color:var(--accent-yellow)]">
                  Tumone Install
                </p>

                <div className="relative mt-8 flex h-36 w-64 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/10"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute h-24 w-24 rounded-full border border-[color:var(--accent-yellow)]/30"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                  />
                  <div className="absolute left-8 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <img src="/logo.png" alt="Tumone Store" className="h-full w-full object-cover" />
                  </div>
                  <ChevronRight className="h-7 w-7 text-white/45" />
                  <div className="absolute right-8 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24px] border border-[color:var(--accent-yellow)]/25 bg-white/5 shadow-[0_20px_60px_rgba(247,199,28,0.18)]">
                    <img src={redirectApp.icon} alt={redirectApp.name} className="h-full w-full object-cover" />
                  </div>
                </div>

                <h2 className="mt-4 text-3xl font-display font-bold sm:text-4xl">
                  Préparation de {redirectApp.name}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/62 sm:text-base">
                  Vous allez être redirigé dans l’app pendant que nous préparons votre expérience.
                </p>

                <div className="mt-8 w-full rounded-[24px] border border-white/10 bg-white/[0.045] p-4">
                  <div className="mb-3 flex items-center justify-between text-xs text-white/50">
                    <span>Connexion sécurisée</span>
                    <span>{redirectProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent-yellow)] to-emerald-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${redirectProgress}%` }}
                      transition={{ duration: 0.12 }}
                    />
                  </div>
                </div>

                <p className="mt-5 text-xs text-white/38">
                  Ne fermez pas cette fenêtre. Redirection automatique en quelques secondes.
                </p>
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

      {/* Footer Pages */}
      <AnimatePresence>
        {footerPage && (
          <motion.div
            className="fixed inset-0 z-[58] overflow-y-auto bg-[#050505]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-6 sm:py-10">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5 yellow-glow">
                    <img src="/logo.png" alt="Tumone Store" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold">Tumone Store</p>
                    <p className="text-xs text-white/38">{FOOTER_PAGES[footerPage].eyebrow}</p>
                  </div>
                </div>
                <button
                  onClick={() => setFooterPage(null)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                  Retour
                </button>
              </div>

              <main className="py-10 sm:py-14">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.32em] text-[color:var(--accent-yellow)]">
                    {FOOTER_PAGES[footerPage].eyebrow}
                  </p>
                  <h1 className="mt-4 text-4xl font-display font-bold leading-tight sm:text-6xl">
                    {FOOTER_PAGES[footerPage].title}
                  </h1>
                  <p className="mt-5 text-base leading-relaxed text-white/64 sm:text-lg">
                    {FOOTER_PAGES[footerPage].summary}
                  </p>
                  <p className="mt-4 text-sm text-white/38">{FOOTER_PAGES[footerPage].updatedAt}</p>
                </div>

                <div className="mt-10 grid gap-4">
                  {FOOTER_PAGES[footerPage].sections.map((section, index) => (
                    <section key={section.title} className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl sm:p-7">
                      <div className="flex items-start gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--accent-yellow)] text-sm font-bold text-black">
                          {index + 1}
                        </span>
                        <div>
                          <h2 className="text-xl font-display font-bold">{section.title}</h2>
                          <div className="mt-4 space-y-3">
                            {section.body.map((paragraph) => (
                              <p key={paragraph} className="text-sm leading-relaxed text-white/62 sm:text-base">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>

                {footerPage === 'developer' && (
                  <div className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-400/[0.055] p-6">
                    <h2 className="font-display text-2xl font-bold">Soumettre une app</h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                      Préparez votre fiche produit, vos captures, votre logo, vos liens officiels, votre politique de confidentialité et les informations développeur. L’équipe Tumone pourra ensuite examiner l’intégration dans le store.
                    </p>
                    <button
                      onClick={() => setFooterPage(null)}
                      className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-[color:var(--accent-yellow)]"
                    >
                      Retour au Store
                    </button>
                  </div>
                )}
              </main>
            </div>
          </motion.div>
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
            <button onClick={() => setFooterPage('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setFooterPage('terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => setFooterPage('developer')} className="hover:text-white transition-colors">Developer Portal</button>
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
