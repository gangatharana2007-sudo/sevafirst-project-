import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Users,
  Network,
  Server,
  Layers,
  Eye,
  Bot,
  ArrowRight,
  TrendingUp,
  Info,
  CheckCircle,
} from 'lucide-react';
import { ExposureAwarenessMetrics, Finding, Language } from '../types';
import { getTranslation } from '../lib/i18n';
import { DEMO_ORG_NAME, DEMO_TAGLINE } from '../data/novatechDemo';

interface DashboardProps {
  metrics: ExposureAwarenessMetrics;
  findings: Finding[];
  lang: Language;
  onNavigate: (tab: string) => void;
  onSelectFinding: (finding: Finding) => void;
  onExploreAttackerView: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  findings,
  lang,
  onNavigate,
  onSelectFinding,
  onExploreAttackerView,
}) => {
  const t = getTranslation(lang);

  // Quick stats cards
  const stats = [
    {
      label: t.publicInfoCount,
      value: metrics.publicInfoCount,
      icon: Network,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      tab: 'exposure-map',
    },
    {
      label: t.peopleCount,
      value: metrics.peopleCount,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      tab: 'exposure-map',
    },
    {
      label: t.documentCount,
      value: metrics.documentCount,
      icon: FileText,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      tab: 'documents',
    },
    {
      label: t.technologyCount,
      value: metrics.technologyCount,
      icon: Server,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      tab: 'exposure-map',
    },
    {
      label: t.relationshipCount,
      value: metrics.relationshipCount,
      icon: Layers,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30',
      tab: 'exposure-map',
    },
    {
      label: t.potentialFindings,
      value: metrics.findingsCount.total,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      tab: 'findings',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              ORGANIZATION PROFILE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              STATUS: MONITORED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
            {DEMO_ORG_NAME}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{DEMO_TAGLINE}</p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('exposure-map')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/30 transition-all"
          >
            <Network className="w-4 h-4" />
            <span>{t.navExposureMap}</span>
          </button>
          <button
            onClick={onExploreAttackerView}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800/80 transition-all"
          >
            <Eye className="w-4 h-4 text-rose-400" />
            <span>{t.exploreAttackerView}</span>
          </button>
          <button
            onClick={() => onNavigate('ai-analyst')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>{t.navAIAnalyst}</span>
          </button>
        </div>
      </div>

      {/* Main Row: Exposure Score Dial & Category Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exposure Score Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                {t.scoreTitle}
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>

            {/* Score Radial / Visual */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG circular progress */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * metrics.totalScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score Number in Center */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                    {metrics.totalScore}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mt-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60">
                    ELEVATED AWARENESS
                  </span>
                </div>
              </div>
            </div>

            {/* Explanatory notice */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{t.scoreDisclaimer}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Baseline Evaluation: 2026-10</span>
            <button
              onClick={() => onNavigate('methodology')}
              className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1"
            >
              <span>Scoring Rules</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Explainable Category Score Breakdown (2 cols on desktop) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-300">
                {t.categoryBreakdown}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                5 DEFENSIVE VECTORS
              </span>
            </div>

            <div className="space-y-4">
              {metrics.categories.map((cat, idx) => {
                const percent = Math.round((cat.score / cat.maxScore) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {cat.name}
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">
                        {cat.score} / {cat.maxScore} pts ({cat.weight}% wt)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 font-sans">
                      {cat.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Each vector measures passive information surface and correlation probability.
            </span>
            <button
              onClick={() => onNavigate('findings')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 shrink-0"
            >
              <span>View Verified Findings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Quick Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(s.tab)}
              className={`p-4 rounded-xl bg-slate-900/60 border ${s.border} hover:bg-slate-900 transition-all cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {s.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Findings Preview & Source Provenance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Breakdown & Top Findings (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-300">
                {t.severityBreakdown}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Deterministic security findings derived from public data correlation
              </div>
            </div>
            <button
              onClick={() => onNavigate('findings')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>All Findings ({findings.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Severity Counters Bar */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-center">
              <span className="block text-lg font-bold font-mono text-rose-400">
                {metrics.findingsCount.high}
              </span>
              <span className="text-[10px] text-rose-300 uppercase font-mono">High</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 text-center">
              <span className="block text-lg font-bold font-mono text-amber-400">
                {metrics.findingsCount.medium}
              </span>
              <span className="text-[10px] text-amber-300 uppercase font-mono">Medium</span>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-900/50 text-center">
              <span className="block text-lg font-bold font-mono text-sky-400">
                {metrics.findingsCount.low}
              </span>
              <span className="text-[10px] text-sky-300 uppercase font-mono">Low</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="block text-lg font-bold font-mono text-slate-400">
                {metrics.findingsCount.informational}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Info</span>
            </div>
          </div>

          {/* Top 3 High-Impact Findings Preview List */}
          <div className="space-y-2.5">
            {findings.slice(0, 3).map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  onSelectFinding(f);
                  onNavigate('findings');
                }}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                        f.severity === 'High'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : f.severity === 'Medium'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-sky-950 text-sky-300 border border-sky-800'
                      }`}
                    >
                      {f.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{f.id}</span>
                    <span className="text-xs text-slate-400 font-medium">| {f.category}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {f.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{f.reason}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Source Distribution Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-300">
                {t.sourceDistribution}
              </h2>
            </div>

            <div className="space-y-3">
              {Object.entries(metrics.sourcesDistribution).map(([source, count], idx) => {
                const total = Object.values(metrics.sourcesDistribution).reduce((a, b) => a + b, 0);
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{source}</span>
                      <span className="font-mono text-slate-400">
                        {count} entities ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="font-mono text-cyan-400 block mb-1">PROVENANCE INTEGRITY:</span>
            Every node in the Exposure Map is traceable to verified publications or public DNS records.
          </div>
        </div>
      </div>
    </div>
  );
};
