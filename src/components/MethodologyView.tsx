import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Scale,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../lib/i18n';

interface MethodologyViewProps {
  lang: Language;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ lang }) => {
  const t = getTranslation(lang);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
            DEFENSIVE OPERATING PRINCIPLES
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white font-sans">
          {t.methodologyTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Rigorous defensive exposure-awareness framework: transparency, deterministic correlation, zero-intrusion policy, and grounded AI.
        </p>
      </div>

      {/* Comparison: What it Does vs What it Does NOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What it Does */}
        <div className="bg-slate-900/60 border border-emerald-900/40 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{t.whatItDoes}</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Passive Public Aggregation:</strong> Analyzes only publicly indexable documents, unauthenticated directories, DNS records, and user-authorized uploads.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Deterministic Relationship Graphing:</strong> Connects people, departments, technologies, and documents to reveal cross-source organizational context.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Cognitive Attacker Perspective:</strong> Visualizes which seemingly harmless data points become valuable to adversaries when synthesized together.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>
                <strong>Actionable Remediation:</strong> Generates concrete defense recommendations (metadata scrubbing, email aliasing, MFA enforcement).
              </span>
            </li>
          </ul>
        </div>

        {/* What it Does NOT Do */}
        <div className="bg-slate-900/60 border border-rose-900/40 rounded-2xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold font-mono text-sm">
            <XCircle className="w-5 h-5" />
            <span>{t.whatItDoesNot}</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span>
                <strong>NO Active Scanning or Probing:</strong> Never performs port scans, network banner grabs, fuzzing, or vulnerability probing against external hosts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span>
                <strong>NO Exploitation or Hacking:</strong> Never executes exploits, credential stuffing, password spraying, or bypass payloads.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span>
                <strong>NO Secrets Handling:</strong> Never collects, prompts for, or processes passwords, private keys, or API tokens.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span>
                <strong>NO Synthetic Hallucinations:</strong> Gemini AI is strictly bounded to verified facts; it cannot manufacture fictional vulnerabilities.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4 Deep-Dive Methodology Sections */}
      <div className="space-y-6">
        {/* Section 1: Correlation Engine */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold">
            <Layers className="w-4 h-4" />
            <span>1. Deterministic Correlation Engine</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The core engine uses deterministic graph graph-matching algorithms rather than generative probability to identify security exposures. Every finding is linked to verifiable evidence nodes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-cyan-400 block font-bold mb-1">RULE: Identity Attribution</span>
              Named Personnel + Direct Email + Departmental Role = High-conviction spearphishing target dossier.
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-amber-400 block font-bold mb-1">RULE: Technical Disclosure</span>
              Public IT Policy + Specific Cloud Bucket / Software Version = Targeted reconnaissance vector.
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-purple-400 block font-bold mb-1">RULE: Cross-Source Synthesis</span>
              Financial Report + DNS MX Records = Validated identity provider login template target.
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-rose-400 block font-bold mb-1">RULE: Metadata Leakage</span>
              PDF Properties + Internal File Paths = Internal workstation & username structure disclosure.
            </div>
          </div>
        </div>

        {/* Section 2: How Gemini AI is Used */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            <span>2. Grounded AI Integration (Gemini 3.8 Flash)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            CYBER MIRROR uses Google Gemini strictly as an analytical explanation layer, not an evidence generator. Gemini operates under strict architectural constraints:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
            <li>Strict separation between <strong>OBSERVED DATA</strong> and <strong>AI INTERPRETATION</strong> in all analyst outputs.</li>
            <li>Zero frontend API key exposure: all calls proxy securely through the server backend.</li>
            <li>Full bilingual support: Gemini analyzes context and responds fluently in both English and Tamil.</li>
          </ul>
        </div>

        {/* Section 3: Scoring Calibration */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold">
            <Scale className="w-4 h-4" />
            <span>3. Exposure Awareness Score Formulation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Exposure Awareness Score (e.g. 72 / 100) measures how readily an outside observer can assemble a detailed operational picture of the organization. It is calculated across 5 weighted vectors:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">PUBLIC INFO</span>
              <span className="font-bold text-white">20% Weight</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">IDENTITY</span>
              <span className="font-bold text-purple-400">25% Weight</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">DOCUMENTS</span>
              <span className="font-bold text-emerald-400">20% Weight</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">TECH STACK</span>
              <span className="font-bold text-amber-400">20% Weight</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">CORRELATION</span>
              <span className="font-bold text-rose-400">15% Weight</span>
            </div>
          </div>
        </div>

        {/* Section 4: Privacy & Ethical Pledge */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold">
            <Lock className="w-4 h-4" />
            <span>4. Privacy, Authorization & Zero-Intrusion Pledge</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            CYBER MIRROR is designed to be ethical by default. Users must only evaluate assets and information they own or are authorized to assess. The platform provides immediate controls to clear custom uploads and reset all local session state.
          </p>
        </div>
      </div>
    </div>
  );
};
