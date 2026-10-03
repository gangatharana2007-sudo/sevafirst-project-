import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Bot,
  Network,
  CheckCircle2,
  Clock,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Finding, SeverityLevel, Language, GraphNode } from '../types';
import { getTranslation } from '../lib/i18n';

interface FindingsViewProps {
  findings: Finding[];
  nodes: GraphNode[];
  lang: Language;
  onTraceInGraph: (nodeId: string) => void;
  onAskAIAboutFinding: (finding: Finding) => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({
  findings,
  nodes,
  lang,
  onTraceInGraph,
  onAskAIAboutFinding,
}) => {
  const t = getTranslation(lang);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(findings[0] || null);

  const filteredFindings = findings.filter((f) => {
    if (selectedSeverity !== 'ALL' && f.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        f.title.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.reason.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
              EXPOSURE CORRELATIONS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              TRACEABLE DEFENSE FINDINGS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
            {t.findingsTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Every finding is produced by deterministic correlation rules linked directly to verified public facts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'High', 'Medium', 'Low', 'Informational'].map((sev) => {
            const count =
              sev === 'ALL'
                ? findings.length
                : findings.filter((f) => f.severity === sev).length;
            const isSelected = selectedSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {sev === 'ALL' ? t.filterSeverityAll : sev} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Finding Cards List on Left, Detailed Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Findings List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search findings (e.g. Identity, S3, Metadata)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredFindings.map((f) => {
              const isSelected = selectedFinding?.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFinding(f)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                          f.severity === 'High'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : f.severity === 'Medium'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : f.severity === 'Low'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {f.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{f.id}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {f.affectedEntities.length} entities linked
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug">
                    {f.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                    <span>{f.category}</span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredFindings.length === 0 && (
              <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-500 text-xs font-mono">
                No matching security findings found for the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Selected Finding Detail Drawer (7 cols) */}
        {selectedFinding && (
          <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      selectedFinding.severity === 'High'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : selectedFinding.severity === 'Medium'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-sky-950 text-sky-300 border border-sky-800'
                    }`}
                  >
                    {selectedFinding.severity} SEVERITY
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedFinding.id}
                  </span>
                  <span className="text-xs text-slate-400">• {selectedFinding.category}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                  {selectedFinding.title}
                </h2>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAskAIAboutFinding(selectedFinding)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Explain with AI</span>
                </button>
              </div>
            </div>

            {/* Evidence Checklist */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Verified Public Evidence ({selectedFinding.evidence.length})</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedFinding.evidence.map((ev, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5 font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">
                Source Document / Registry: {selectedFinding.source}
              </div>
            </div>

            {/* Correlation Logic */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-300 font-bold block flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{t.correlationReason}</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedFinding.reason}
              </p>
            </div>

            {/* Defensive Recommendation */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/40 space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t.recommendation}</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedFinding.recommendation}
              </p>
            </div>

            {/* Affected Entities in Graph */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                Affected Entities ({selectedFinding.affectedEntities.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedFinding.affectedEntities.map((entId) => {
                  const n = nodes.find((node) => node.id === entId);
                  return (
                    <button
                      key={entId}
                      onClick={() => onTraceInGraph(entId)}
                      className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 transition-colors flex items-center gap-1.5 text-xs font-mono"
                    >
                      <Network className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{n?.label || entId}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
