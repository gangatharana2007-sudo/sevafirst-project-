import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Building,
  RefreshCw,
} from 'lucide-react';
import { Finding, ExposureAwarenessMetrics, GraphNode, Language } from '../types';
import { getTranslation } from '../lib/i18n';
import { DEMO_ORG_NAME } from '../data/novatechDemo';

interface ReportGeneratorProps {
  metrics: ExposureAwarenessMetrics;
  findings: Finding[];
  nodes: GraphNode[];
  lang: Language;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  metrics,
  findings,
  nodes,
  lang,
}) => {
  const t = getTranslation(lang);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<{
    summary: string;
    keyRisks: string[];
    strategicRecommendations: string[];
  } | null>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          findings: findings.map((f) => ({
            id: f.id,
            title: f.title,
            severity: f.severity,
            category: f.category,
            reason: f.reason,
          })),
          metrics,
          orgName: DEMO_ORG_NAME,
          lang,
        }),
      });

      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error('Report generation error:', err);
      // Fallback narrative
      const isTamil = lang === 'ta';
      setReportData({
        summary: isTamil
          ? `${DEMO_ORG_NAME} நிறுவனத்திற்கான பாதுகாப்பு வெளிப்பாடு பகுப்பாய்வு நிறைவடைந்தது. இந்த மதிப்பீட்டில் தனித்தனியாக தீங்கற்றதாகத் தோன்றும் பொது ஆவணங்கள், மின்னஞ்சல்கள் மற்றும் அமைப்புகள் ஒன்றிணைக்கப்படும் போது, நிறுவனத்தின் கட்டமைப்பு தகவல்கள் வெளிப்படுவது கண்டறியப்பட்டுள்ளது. விழிப்புணர்வு மதிப்பீடு ${metrics.totalScore}/100 ஆக கணக்கிடப்பட்டுள்ளது.`
          : `Defensive exposure assessment conducted for ${DEMO_ORG_NAME}. By assembling public documents, administrative emails, and software disclosures, the analysis identified that correlated public intelligence produces significant reconnaissance value without requiring unauthorized probing. Overall Exposure Awareness Score is calculated at ${metrics.totalScore}/100.`,
        keyRisks: isTamil
          ? [
              'பொது ஊழியர் பட்டியல் மற்றும் துறை மின்னஞ்சல்கள் இணைக்கப்பட்டு அடையாளம் காணக்கூடிய சாத்தியம்.',
              'தகவல் தொழில்நுட்ப ஆவணங்களில் உள் மென்பொருள் அடுக்குகள் குறிப்பிடப்பட்டிருத்தல்.',
              'ஆவணங்களில் உள்ள ஆசிரியர் மற்றும் சிஸ்டம் மெட்டாடேட்டா வெளிப்பாடு.',
            ]
          : [
              'Identity correlation linking named personnel to administrative responsibilities and direct email vectors.',
              'Technical disclosure across public policy documents revealing infrastructure architecture (LMS, Cloud, SSO).',
              'Document metadata leakage disclosing internal author usernames and workstation environments.',
            ],
        strategicRecommendations: isTamil
          ? [
              'பொது வெளியீட்டுக்கு முன் ஆவணங்களிலிருந்து மெட்டாடேட்டாவை நீக்குங்கள்.',
              'தனிநபர் மின்னஞ்சல்களுக்குப் பதிலாக பொதுவான குழு மின்னஞ்சல்களை (Aliases) பயன்படுத்தவும்.',
              'அனைத்து மேகக்கணி மற்றும் கற்றல் மேலாண்மை தளங்களுக்கும் MFA கட்டாயமாக்குங்கள்.',
            ]
          : [
              'Institute a sanitized public release protocol that strips EXIF/document metadata prior to publishing.',
              'Transition public-facing contact points from personal named mailboxes to role-based group mailboxes.',
              'Deploy hardware-backed MFA across all administrative and portal endpoints referenced in public literature.',
            ],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Action Bar (hidden on print) */}
      <div className="print:hidden bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              EXECUTIVE BRIEFING EXPORTER
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
            {t.reportsTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesizes observed public exposure, correlation findings, and strategic defensive remediations into an executive document.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/25 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing Briefing...' : t.generateReport}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>{t.downloadPdf}</span>
          </button>
        </div>
      </div>

      {/* The Printable Security Report Document */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 sm:p-12 text-slate-100 shadow-2xl space-y-8 font-sans print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-widest mb-1">
              CYBER MIRROR DEFENSIVE EXPOSURE ASSESSMENT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {DEMO_ORG_NAME}
            </h2>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Assessment Date: 2026-10-03</span>
              <span>•</span>
              <span className="font-mono text-cyan-400">Class: Defensive Public Intelligence</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Exposure Awareness Metric
            </span>
            <div className="text-3xl font-mono font-bold text-amber-400">
              {metrics.totalScore} <span className="text-sm text-slate-500 font-normal">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Elevated Correlation Footprint
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>1.0 {t.executiveSummary}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {reportData?.summary ||
              (lang === 'ta'
                ? `${DEMO_ORG_NAME} நிறுவனத்தின் பொதுத் தகவல்களை இணைத்து பகுப்பாய்வு செய்ததில், வெளிப்படையாகக் கிடைக்கும் ஆவணங்கள் மற்றும் பணியாளர் விவரங்கள் மூலம் நிறுவனத்தின் முக்கிய உள் அமைப்புகள் மற்றும் நிர்வாகப் பொறுப்புகள் எளிதில் அடையாளம் காணப்படுவது உறுதிசெய்யப்பட்டுள்ளது. விழிப்புணர்வு மதிப்பீடு ${metrics.totalScore}/100 ஆகப் பதிவு செய்யப்பட்டுள்ளது.`
                : `This exposure report synthesizes the defensive posture of ${DEMO_ORG_NAME}. By analyzing unauthenticated web assets, published administrative directories, and technical disclosure documents, CYBER MIRROR identified multiple correlation vectors where benign public information combines to reveal high-value organizational targets. The institution's Exposure Awareness Score stands at ${metrics.totalScore}/100.`)}
          </p>
        </section>

        {/* Scope and Sources Inventory */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>2.0 {t.scopeAndBoundaries}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">PUBLIC ENTITIES</span>
              <span className="text-lg font-bold text-white">{metrics.publicInfoCount}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">DOCUMENTS ANALYZED</span>
              <span className="text-lg font-bold text-emerald-400">{metrics.documentCount}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">CORRELATION PATHS</span>
              <span className="text-lg font-bold text-sky-400">{metrics.relationshipCount}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ELEVATED FINDINGS</span>
              <span className="text-lg font-bold text-rose-400">{metrics.findingsCount.high}</span>
            </div>
          </div>
        </section>

        {/* Key Correlated Findings Table */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>3.0 Key Correlated Exposure Findings</span>
          </h3>

          <div className="space-y-3">
            {findings.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
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
                    <span className="font-bold text-white">{f.id} — {f.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{f.category}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{f.reason}</p>
                <div className="text-[11px] text-emerald-400 font-mono bg-emerald-950/20 p-2 rounded border border-emerald-900/40">
                  <strong className="text-emerald-300">Action: </strong>
                  {f.recommendation}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Strategic Recommendations */}
        <section className="space-y-3">
          <h3 className="text-sm font-mono uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>4.0 Strategic Defensive Roadmap</span>
          </h3>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2 text-xs text-slate-300">
            {(reportData?.strategicRecommendations || [
              'Institute automated EXIF and system metadata scrubbing across all campus document publication pipelines.',
              'Replace named administrator emails in public directories with generic role-based distribution groups.',
              'Mandate phishing-resistant FIDO2 hardware tokens for all executive and IT administrative staff.',
              'Sanitize regulatory disclosure documents to conceal internal cloud bucket naming patterns and software release versions.',
            ]).map((rec, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">4.{i + 1}</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Legal & Limitations Notice */}
        <section className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
          <div className="font-bold text-slate-400">5.0 {t.limitationsTitle}</div>
          <p>
            CYBER MIRROR is a defensive exposure awareness platform. It does not perform network port scanning, software vulnerability testing, credential attacks, or penetration testing. The Exposure Awareness Score reflects passive contextual footprint and is not an ISO/SOC2 certification.
          </p>
        </section>
      </div>
    </div>
  );
};
