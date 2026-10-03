import React from 'react';
import {
  ShieldAlert,
  Network,
  Eye,
  FileCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../lib/i18n';
import { DEMO_ORG_NAME, DEMO_TAGLINE } from '../data/novatechDemo';

interface LandingPageProps {
  lang: Language;
  onLaunchDemo: () => void;
  onAnalyzeData: () => void;
  onExploreAttackerView: () => void;
  onGoToDashboard: () => void;
  onGoToMethodology: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onLaunchDemo,
  onAnalyzeData,
  onExploreAttackerView,
  onGoToDashboard,
  onGoToMethodology,
}) => {
  const t = getTranslation(lang);

  return (
    <div className="relative overflow-hidden">
      {/* Background Cyber Grid Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Top Simulated Demo Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">{t.simulatedDataBadge}</span>
            <span className="text-cyan-500/70">|</span>
            <span className="text-slate-300">{DEMO_ORG_NAME}</span>
          </div>

          {/* Main Hero Header */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl font-sans">
            <span className="block font-mono tracking-widest text-cyan-400 text-2xl sm:text-3xl mb-2">
              CYBER MIRROR
            </span>
            &ldquo;{t.tagline}&rdquo;
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
            {t.subtitle}
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchDemo}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] border border-cyan-300/40 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Network className="w-5 h-5" />
              <span>{t.launchDemo}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onAnalyzeData}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all"
            >
              <FileCheck className="w-5 h-5 text-cyan-400" />
              <span>{t.analyzeData}</span>
            </button>

            <button
              onClick={onExploreAttackerView}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/80 hover:border-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all"
            >
              <Eye className="w-5 h-5 text-rose-400" />
              <span>{t.exploreAttackerView}</span>
            </button>
          </div>

          {/* Mandatory Defensive Legal Notice */}
          <div className="mt-6 max-w-2xl px-4 py-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 text-amber-200/90 text-xs flex items-center gap-2.5 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.legalNotice}</span>
          </div>
        </div>

        {/* The Core Innovation Formula Banner */}
        <div className="mt-12 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
              CORE INNOVATION & ARCHITECTURE
            </span>
            <h2 className="text-2xl font-bold text-white mt-2">
              How Benign Information Becomes Unintended Exposure
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mt-1">
              Adversaries do not always need zero-day exploits. By assembling fragmented public clues, they map the target organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center font-mono">
            {/* Box 1 */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col items-center">
              <span className="text-xs text-slate-400 mb-1">01. INGESTION</span>
              <span className="text-sm font-bold text-slate-100">PUBLIC INFORMATION</span>
              <span className="text-[11px] text-slate-500 mt-1 font-sans">Directories, PDFs, DNS, Web</span>
            </div>

            <div className="text-cyan-400 text-xl font-bold">+</div>

            {/* Box 2 */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col items-center">
              <span className="text-xs text-slate-400 mb-1">02. TOPOLOGY</span>
              <span className="text-sm font-bold text-sky-300">RELATIONSHIPS</span>
              <span className="text-[11px] text-slate-500 mt-1 font-sans">Belongs To, Mentions, Hosts</span>
            </div>

            <div className="text-cyan-400 text-xl font-bold">+</div>

            {/* Box 3 */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-800/60 flex flex-col items-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <span className="text-xs text-cyan-400 mb-1">03. REASONING</span>
              <span className="text-sm font-bold text-cyan-300">CORRELATION</span>
              <span className="text-[11px] text-slate-500 mt-1 font-sans">Deterministic rule synthesis</span>
            </div>

            <div className="text-cyan-400 text-xl font-bold">+</div>

            {/* Box 4 */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-800/60 flex flex-col items-center shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <span className="text-xs text-indigo-400 mb-1">04. GROUNDED AI</span>
              <span className="text-sm font-bold text-indigo-300">GEMINI EXPLANATION</span>
              <span className="text-[11px] text-slate-500 mt-1 font-sans">Bilingual context & defense</span>
            </div>

            <div className="text-cyan-400 text-2xl font-bold md:col-span-5 my-2">
              <span className="px-4 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-sm tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                = DIGITAL EXPOSURE MAP
              </span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={onLaunchDemo}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Interactive Digital Exposure Map
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Explore complex relationship graphs connecting organizations, staff members, emails, published documents, and technologies with zoom, pan, and real-time physics.
            </p>
            <div className="mt-4 flex items-center text-xs font-mono text-cyan-400">
              <span>EXPLORE GRAPH</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={onExploreAttackerView}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              Cognitive Attacker View
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Shift perspective. Color-code benign public data (Green), contextual clues (Yellow), and composite risk exposures (Red) without ever running offensive attacks.
            </p>
            <div className="mt-4 flex items-center text-xs font-mono text-rose-400">
              <span>VIEW ATTACKER LENS</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={onGoToDashboard}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
              Grounded AI & Awareness Score
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Powered by server-side Gemini 3.8 Flash with strict evidence boundaries and complete bilingual English and Tamil defense analysis.
            </p>
            <div className="mt-4 flex items-center text-xs font-mono text-blue-400">
              <span>VIEW DASHBOARD</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Simulated Demo Organization Summary Bar */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Fictional Target Organization: {DEMO_ORG_NAME}
              </div>
              <div className="text-xs text-slate-400">
                Includes 4 Departments, 4 Published PDFs, 5 Technologies, and 7 Pre-computed Correlation Findings.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchDemo}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              Open Exposure Map
            </button>
            <button
              onClick={onGoToMethodology}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              Read Methodology
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
