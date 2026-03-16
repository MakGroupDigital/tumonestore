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
  Trophy
} from 'lucide-react';
import { cn } from './lib/utils';
import { APPS, AppData } from './data';

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

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'pwa'>('pwa');
  const [installStatus, setInstallStatus] = useState<'idle' | 'scanning' | 'downloading' | 'completed'>('idle');
  const [installProgress, setInstallProgress] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

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
    const timer = setTimeout(() => setShowSplash(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const filteredApps = useMemo(() => {
    return APPS.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.developer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleDownload = async (app: AppData) => {
    setInstallStatus('scanning');
    setInstallProgress(0);

    // Simulate Security Scan
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setInstallStatus('downloading');
    // Simulate Download Progress
    for (let i = 0; i <= 100; i += 10) {
      setInstallProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setInstallStatus('completed');
    
    // Real redirection after simulation
    setTimeout(() => {
      if (platform === 'ios') {
        if (app.iosUrl) {
          window.open(app.iosUrl, '_blank');
        } else if (app.pwaUrl) {
          alert('To install this app on iOS: \n1. Tap the Share button \n2. Scroll down and tap "Add to Home Screen"');
          window.open(app.pwaUrl, '_blank');
        }
      } else if (platform === 'android') {
        if (app.androidUrl) {
          window.open(app.androidUrl, '_blank');
        } else if (app.pwaUrl) {
          window.open(app.pwaUrl, '_blank');
        }
      } else {
        const url = app.pwaUrl || app.androidUrl || app.iosUrl;
        if (url) window.open(url, '_blank');
      }
      setInstallStatus('idle');
    }, 800);
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
                <p className="text-white/50 text-sm">Charging your next app wave</p>
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
              placeholder="Search apps, games..."
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
          <section className="mb-12">
            <div className="relative h-[300px] sm:h-[400px] rounded-[32px] overflow-hidden group">
              <img 
                src="https://picsum.photos/seed/store-hero/1920/1080" 
                alt="Featured" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 sm:p-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[color:var(--accent-yellow)] text-black text-[10px] font-bold uppercase tracking-wider">Editor's Choice</span>
                  <div className="flex items-center gap-1 text-[color:var(--accent-yellow)] text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Secure
                  </div>
                </div>
                <h2 className="text-4xl sm:text-6xl font-display font-bold mb-4 leading-tight">
                  Experience the <br /> <span className="gradient-text">Future of Apps</span>
                </h2>
                <p className="text-white/60 max-w-md mb-8 text-sm sm:text-base">
                  Discover ultra-fast, modern, and secure applications curated just for you. Optimized for your device.
                </p>
                <button className="px-8 py-4 bg-[color:var(--accent-yellow)] text-black rounded-2xl font-bold hover:bg-[color:var(--accent-yellow-deep)] transition-colors flex items-center gap-2">
                  Explore Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Innovation Sections */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
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
            ].map((card) => (
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
              <h3 className="text-2xl font-display font-bold mb-3">Pulse Radar</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Track what is surging across regions, devices, and creators. Tumone Radar highlights momentum
                before it becomes mainstream.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { label: 'Velocity', value: '92%', tone: 'text-emerald-300' },
                { label: 'Trust Score', value: 'A+', tone: 'text-[color:var(--accent-yellow)]' },
                { label: 'Latency', value: '18ms', tone: 'text-blue-300' },
                { label: 'Fresh Drops', value: '128', tone: 'text-purple-300' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              {searchQuery ? 'Search Results' : 'Trending Apps'}
            </h3>
            <div className="text-white/40 text-sm">
              {filteredApps.length} apps found
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <img src={app.icon} alt={app.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                      className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Get
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
                    <img src={selectedApp.icon} alt={selectedApp.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                        onClick={() => handleDownload(selectedApp)}
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

                {/* Screenshots */}
                <div className="mb-12">
                  <h4 className="text-xl font-display font-bold mb-6">Screenshots</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {selectedApp.screenshots.map((src, i) => (
                      <img 
                        key={i} 
                        src={src} 
                        alt="Screenshot" 
                        className="h-[400px] rounded-2xl object-cover shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xl font-display font-bold mb-4">About this app</h4>
                  <p className="text-white/60 leading-relaxed">
                    {selectedApp.description}
                  </p>
                </div>
              </div>
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
