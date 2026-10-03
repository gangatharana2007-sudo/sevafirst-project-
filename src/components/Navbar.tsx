import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  Network,
  FileText,
  Bot,
  Layers,
  FileCode,
  Compass,
  Play,
  Languages,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../lib/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  attackerView: boolean;
  setAttackerView: (val: boolean) => void;
  onStartDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  attackerView,
  setAttackerView,
  onStartDemo,
}) => {
  const t = getTranslation(lang);

  const navItems = [
    { id: 'landing', label: t.navOverview, icon: Compass },
    { id: 'dashboard', label: t.navDashboard, icon: Layers },
    { id: 'exposure-map', label: t.navExposureMap, icon: Network, highlight: true },
    { id: 'findings', label: t.navFindings, icon: AlertTriangle },
    { id: 'documents', label: t.navDocuments, icon: FileCode },
    { id: 'ai-analyst', label: t.navAIAnalyst, icon: Bot },
    { id: 'reports', label: t.navReports, icon: FileText },
    { id: 'methodology', label: t.navMethodology, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top micro banner for Attacker View notification or Demo tag */}
      {attackerView ? (
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-amber-950 text-rose-200 text-xs py-1 px-4 flex items-center justify-between border-b border-rose-800/60 font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-bold tracking-wider uppercase text-rose-100">
              {t.attackerViewTitle}
            </span>
            <span className="hidden md:inline text-rose-300/80">
              — {t.attackerViewSubtitle}
            </span>
          </div>
          <button
            onClick={() => setAttackerView(false)}
            className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 px-2 py-0.5 rounded border border-rose-500/40 transition-colors"
          >
            {t.exitAttackerView}
          </button>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold tracking-widest text-lg bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                    CYBER MIRROR
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                    DEFENSIVE SOC
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans tracking-wide">
                  &ldquo;{t.tagline}&rdquo;
                </div>
              </div>
            </button>
          </div>

          {/* Right Action Tools: Attacker View, Demo Tour, Language */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Attacker View Switch */}
            <button
              onClick={() => {
                const nextState = !attackerView;
                setAttackerView(nextState);
                if (nextState && activeTab !== 'exposure-map') {
                  setActiveTab('exposure-map');
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
                attackerView
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
              title="Toggle cognitive attacker perspective"
            >
              <Eye className={`w-3.5 h-3.5 ${attackerView ? 'text-rose-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">
                {attackerView ? t.exitAttackerView : t.enterAttackerView}
              </span>
            </button>

            {/* Guided Demo Launch */}
            <button
              onClick={onStartDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)] border border-cyan-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{t.startGuidedTour}</span>
            </button>

            {/* Language Switcher EN | தமிழ் */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  lang === 'en'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-2 py-1 rounded transition-colors ${
                  lang === 'ta'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-900/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
