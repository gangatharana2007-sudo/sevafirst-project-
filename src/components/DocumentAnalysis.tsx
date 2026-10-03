import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  RotateCcw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
  Network,
  FileCode,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { UploadedDoc, Language, GraphNode } from '../types';
import { getTranslation } from '../lib/i18n';
import { DEMO_DOCUMENTS } from '../data/novatechDemo';

interface DocumentAnalysisProps {
  documents: UploadedDoc[];
  onAddDocument: (doc: UploadedDoc) => void;
  onDeleteDocument: (docId: string) => void;
  onResetDocuments: () => void;
  lang: Language;
  onViewInGraph: () => void;
}

export const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onResetDocuments,
  lang,
  onViewInGraph,
}) => {
  const t = getTranslation(lang);
  const [selectedDoc, setSelectedDoc] = useState<UploadedDoc | null>(documents[0] || null);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [customDocTitle, setCustomDocTitle] = useState('');
  const [customDocText, setCustomDocText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File Upload handler (TXT, CSV, JSON)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const validExtensions = ['.txt', '.csv', '.json', '.md'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
        setErrorMsg(
          `For binary formats (${file.name}), please paste the document's extracted text content below or use our simulated authorized demo documents for direct testing.`
        );
      } else {
        setErrorMsg('Unsupported file format. Please upload text documents (.txt, .csv, .json, .md).');
      }
      return;
    }

    try {
      setIsProcessing(true);
      const content = await file.text();
      await processDocumentContent(file.name, (file.size / 1024).toFixed(1) + ' KB', content);
    } catch (err: any) {
      setErrorMsg(`Failed to read file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process Document Content & Extract Entities
  const processDocumentContent = async (name: string, size: string, content: string) => {
    try {
      setIsProcessing(true);
      let extracted: any = {
        organizations: ['NovaTech College'],
        people: [],
        departments: [],
        emails: [],
        technologies: [],
        urls: [],
      };

      // Call server extractor
      try {
        const res = await fetch('/api/ai/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentName: name, content }),
        });
        const data = await res.json();
        if (data.entities) {
          extracted = {
            organizations: data.entities.organizations || ['NovaTech College'],
            people: data.entities.people || [],
            departments: data.entities.departments || [],
            emails: data.entities.emails || [],
            technologies: data.entities.technologies || [],
            urls: data.entities.urls || [],
          };
        }
      } catch (apiErr) {
        // Deterministic regex fallback
        const emails = Array.from(new Set(content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []));
        const urls = Array.from(new Set(content.match(/https?:\/\/[^\s$.?#].[^\s]*/g) || []));
        extracted.emails = emails;
        extracted.urls = urls;
      }

      const newDoc: UploadedDoc = {
        id: `doc-custom-${Date.now()}`,
        name,
        size,
        uploadDate: new Date().toISOString().split('T')[0],
        type: 'Authorized Ingestion',
        status: 'Analyzed',
        extractedEntities: extracted,
        rawContent: content,
      };

      onAddDocument(newDoc);
      setSelectedDoc(newDoc);
      setPasteModalOpen(false);
      setCustomDocTitle('');
      setCustomDocText('');
    } catch (err: any) {
      setErrorMsg(`Extraction failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-sans flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <span>{t.documentsTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.documentsSubtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* File input button */}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20 transition-all">
            <Upload className="w-4 h-4" />
            <span>{t.uploadButton}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.csv,.json,.md,.pdf"
              className="hidden"
            />
          </label>

          {/* Paste Document Text Modal Button */}
          <button
            onClick={() => setPasteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Paste Document Text</span>
          </button>

          {/* Reset Demo Docs Button */}
          <button
            onClick={onResetDocuments}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
            title={t.restoreDemoData}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.restoreDemoData}</span>
          </button>
        </div>
      </div>

      {/* Error / Alert notice */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-amber-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Document List on Left, Document Details & Extracted Entities on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Published Files ({documents.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              SIMULATED REPOSITORY
            </span>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-white truncate">{doc.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
                    Analyzed
                  </span>
                </div>
              );
            })}
          </div>

          {documents.length > 4 && (
            <button
              onClick={onResetDocuments}
              className="w-full py-2 text-center text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors"
            >
              Clear Custom Ingestions
            </button>
          )}
        </div>

        {/* Selected Document Details & Extracted Entities */}
        {selectedDoc && (
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-sans">{selectedDoc.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-950 text-slate-400 border border-slate-800">
                    {selectedDoc.type}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  File Size: {selectedDoc.size} | Ingested: {selectedDoc.uploadDate}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onViewInGraph}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>View in Exposure Map</span>
                </button>
                {selectedDoc.id.startsWith('doc-custom') && (
                  <button
                    onClick={() => {
                      onDeleteDocument(selectedDoc.id);
                      setSelectedDoc(documents[0] || null);
                    }}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Extracted Public Entities Grid */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-3 font-semibold">
                Extracted Public Entities ({
                  (selectedDoc.extractedEntities.people?.length || 0) +
                  (selectedDoc.extractedEntities.emails?.length || 0) +
                  (selectedDoc.extractedEntities.technologies?.length || 0) +
                  (selectedDoc.extractedEntities.departments?.length || 0)
                } total)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Personnel */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">
                    Named Personnel ({selectedDoc.extractedEntities.people?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.extractedEntities.people?.length ? (
                      selectedDoc.extractedEntities.people.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800 text-[11px]">
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[11px]">None disclosed</span>
                    )}
                  </div>
                </div>

                {/* Emails */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-teal-400 font-bold block">
                    Public Email Vectors ({selectedDoc.extractedEntities.emails?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.extractedEntities.emails?.length ? (
                      selectedDoc.extractedEntities.emails.map((e, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-800 text-[11px] font-mono">
                          {e}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[11px]">None disclosed</span>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    Infrastructure & Tech Mentions ({selectedDoc.extractedEntities.technologies?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.extractedEntities.technologies?.length ? (
                      selectedDoc.extractedEntities.technologies.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800 text-[11px]">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[11px]">None disclosed</span>
                    )}
                  </div>
                </div>

                {/* Departments */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
                    Department References ({selectedDoc.extractedEntities.departments?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDoc.extractedEntities.departments?.length ? (
                      selectedDoc.extractedEntities.departments.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800 text-[11px]">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[11px]">None disclosed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Text Content Preview */}
            {selectedDoc.rawContent && (
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                  Extracted Document Text Preview
                </span>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {selectedDoc.rawContent}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Paste Document Text Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Ingest Document Text for Analysis</span>
              </h3>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste the text content of any public policy, staff page, press release, or directory. Entities will be extracted and correlated with the digital exposure map.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Document Title / Identifier
                </label>
                <input
                  type="text"
                  value={customDocTitle}
                  onChange={(e) => setCustomDocTitle(e.target.value)}
                  placeholder="e.g. Campus_Security_Advisory_2026.txt"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">
                  Document Content
                </label>
                <textarea
                  value={customDocText}
                  onChange={(e) => setCustomDocText(e.target.value)}
                  rows={8}
                  placeholder="Paste raw text here... Example:
NovaTech College IT Operations:
Contact lead administrator Marcus Chen at m.chen@novatech-demo.example for access to AWS S3 backup buckets and Moodle..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!customDocTitle.trim() || !customDocText.trim() || isProcessing}
                onClick={() =>
                  processDocumentContent(
                    customDocTitle,
                    `${(customDocText.length / 1024).toFixed(1)} KB`,
                    customDocText
                  )
                }
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white shadow transition-all flex items-center gap-1.5"
              >
                {isProcessing ? 'Extracting Entities...' : 'Ingest & Correlate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
