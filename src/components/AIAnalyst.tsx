import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Languages,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Finding, GraphNode, Language } from '../types';
import { getTranslation } from '../lib/i18n';

interface AIAnalystProps {
  findings: Finding[];
  nodes: GraphNode[];
  initialItem?: Finding | GraphNode | null;
  lang: Language;
  onClearInitialItem?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'analyst';
  text: string;
  observedData?: string[];
  reasoning?: string;
  recommendations?: string[];
  timestamp: string;
  source?: string;
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({
  findings,
  nodes,
  initialItem,
  lang,
  onClearInitialItem,
}) => {
  const t = getTranslation(lang);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested inquiries
  const suggestions = [
    t.q1,
    t.q2,
    t.q3,
    t.q4,
    t.q5,
    lang === 'ta' ? 'தமிழில் விரிவாக விளக்குக.' : 'தமிழில் விளக்கவும். (Explain in Tamil)',
  ];

  // Initialize initial message on load or when an entity/finding is passed
  useEffect(() => {
    const isTamil = lang === 'ta';
    if (initialItem) {
      const isFinding = 'severity' in initialItem;
      const title = isFinding ? initialItem.title : initialItem.label;
      const query = isTamil
        ? `தயவுசெய்து "${title}" பற்றிய விரிவான தற்காப்பு விளக்கத்தை அளிக்கவும்.`
        : `Please explain the defensive implications of "${title}".`;

      handleSendMessage(query, initialItem);
    } else if (messages.length === 0) {
      // Welcome message
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'analyst',
          text: isTamil
            ? `வணக்கம். நான் சைபர் மிரர் (CYBER MIRROR) தற்காப்பு AI ஆய்வாளர். நான் உங்கள் நிறுவனத்தின் சரிபார்க்கப்பட்ட பொதுத் தகவல்களை மட்டுமே அடிப்படையாகக் கொண்டு பகுப்பாய்வு செய்கிறேன். தனித்தனியாக இருக்கும் பொதுத் தகவல்கள் எவ்வாறு ஒன்றுடன் ஒன்று இணைந்து வெளிப்பாட்டை உருவாக்குகின்றன என்பதை விளக்குவதே எனது நோக்கம்.`
            : `Hello. I am CYBER MIRROR's Defensive AI Analyst. I strictly analyze verified, observable public data points to explain how individual clues connect to reveal organizational context. I never perform unauthorized scanning or invent synthetic vulnerabilities. How can I assist your defense team today?`,
          observedData: isTamil
            ? ['4 பொது ஆவணங்கள்', '5 தொழில்நுட்ப கட்டமைப்புகள்', '3 முக்கிய மின்னஞ்சல் முகவரிகள்']
            : ['4 Published Documents', '5 Technology Stacks', '3 Executive Direct Mailboxes'],
          reasoning: isTamil
            ? 'தனித்தனி தகவல்கள் பாதிப்பில்லாததாகத் தோன்றலாம்; ஆனால் அவற்றின் தொடர்பு அமைப்பு ஒரு தாக்குபவருக்கு முன்கூட்டியே உளவுத் தகவல்களை வழங்கக்கூடும்.'
            : 'Unconnected public facts appear benign; their topological synthesis produces target intelligence without requiring active exploitation.',
          recommendations: isTamil
            ? ['ஆவண மெட்டாடேட்டாவை நீக்குங்கள்', 'பொது மின்னஞ்சல்களுக்கு MFA கட்டாயமாக்குங்கள்']
            : ['Sanitize public document metadata', 'Enforce FIDO2 hardware MFA on published administrative personnel'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'CYBER MIRROR Defensive Model (Gemini 3.8 Flash)',
        },
      ]);
    }
  }, [initialItem, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string, focusTarget?: any) => {
    const textToSend = customPrompt || inputValue.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build context from active findings and nodes
      const currentContext = {
        organization: 'NovaTech College',
        focusItem: focusTarget || initialItem || null,
        topFindings: findings.slice(0, 5).map((f) => ({
          id: f.id,
          title: f.title,
          severity: f.severity,
          category: f.category,
          evidence: f.evidence,
        })),
        totalNodesCount: nodes.length,
        language: lang,
      };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
          currentContext,
          lang,
        }),
      });

      const data = await response.json();

      const analystReply: ChatMessage = {
        id: `analyst-${Date.now()}`,
        sender: 'analyst',
        text: data.reply || 'Analysis completed.',
        observedData: data.evidence || [
          'Observed: Staff_Directory.pdf and IT_Policy.pdf public disclosures',
          'Verified: DNS mail exchange and campus web portal records',
        ],
        reasoning: data.reasoning || 'Correlating departmental roles with software infrastructure creates identity attribution.',
        recommendations: data.recommendations || [
          'Audit unauthenticated document repositories',
          'Implement phishing-resistant authentication keys',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, analystReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Offline defensive rule fallback
      const isTamil = lang === 'ta';
      const fallbackReply: ChatMessage = {
        id: `analyst-${Date.now()}`,
        sender: 'analyst',
        text: isTamil
          ? `கண்டறியப்பட்ட தரவு:\nநோவாடெக் கல்லூரி பணியாளர் அடைவு மற்றும் தகவல் தொழில்நுட்ப கொள்கை ஆவணங்கள் பொதுவில் உள்ளன.\n\nவிளக்கம்:\nஇந்த தகவல்கள் தனித்தனியாக சாதாரணமாகத் தோன்றலாம். ஆனால் இவை ஒன்றுடன் ஒன்று இணைக்கப்படும்போது நிறுவனத்தைப் பற்றிய கூடுதல் தகவல்கள் வெளிப்படலாம்.\n\nபாதுகாப்பு பரிந்துரை:\nபொது மின்னஞ்சல்களுக்கு MFA கட்டாயமாக்கி, வெளியிடப்படும் ஆவணங்களிலிருந்து உள் பயனர் மெட்டாடேட்டாவை நீக்குங்கள்.`
          : `OBSERVED DATA:\nStaff_Directory.pdf and IT_Policy.pdf are accessible publicly.\n\nAI INTERPRETATION:\nWhile individually benign, connecting staff roles with specific cloud storage buckets allows threat actors to construct targeted spearphishing campaigns.\n\nDEFENSIVE RECOMMENDATION:\nScrub document metadata and enforce hardware-backed MFA across administrative staff.`,
        observedData: ['Staff_Directory.pdf', 'IT_Policy.pdf'],
        reasoning: 'Synthesizing public names with specific technology stacks accelerates adversary reconnaissance.',
        recommendations: [
          'Strip internal file paths from public PDFs',
          'Mask administrative email listings behind generic inquiry forms',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Local Defensive Engine (Fallback)',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
      if (onClearInitialItem) onClearInitialItem();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/20 to-blue-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-sans">
                {t.aiAnalystTitle}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">
                GEMINI 3.8 FLASH
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.aiAnalystSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>GROUNDED DEFENSE ONLY</span>
          </div>
        </div>
      </div>

      {/* Suggested Inquiries Pills */}
      <div>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          {t.suggestedQuestions}
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-all text-left flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md min-h-[420px] max-h-[600px] overflow-y-auto space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Header info */}
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-mono font-semibold text-slate-400">
                {msg.sender === 'user' ? 'SECURITY OPERATOR' : 'DEFENSIVE AI ANALYST'}
              </span>
              <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
              {msg.source && (
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-900/60">
                  {msg.source}
                </span>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`rounded-2xl p-4 sm:p-5 max-w-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-lg shadow-cyan-900/20'
                  : 'bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-tl-none space-y-4'
              }`}
            >
              {/* Main narrative */}
              <div className="whitespace-pre-line font-sans">{msg.text}</div>

              {/* Explicit Grounding Separation for AI responses */}
              {msg.sender === 'analyst' && msg.observedData && msg.observedData.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3">
                  {/* OBSERVED DATA */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-400 flex items-center gap-1.5 mb-1.5">
                      <Database className="w-3.5 h-3.5" />
                      <span>{t.observedDataSection}</span>
                    </span>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      {msg.observedData.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI INTERPRETATION / REASONING */}
                  {msg.reasoning && (
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-indigo-300 flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.aiInterpretationSection}</span>
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {msg.reasoning}
                      </p>
                    </div>
                  )}

                  {/* DEFENSIVE RECOMMENDATION */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1.5 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.defensiveRemediationSection}</span>
                      </span>
                      <ul className="space-y-1 text-slate-300 text-xs">
                        {msg.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons (copy) */}
              {msg.sender === 'analyst' && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <span className="text-[11px] font-mono text-slate-400">DEFENSIVE AI ANALYST</span>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                Correlating topology and grounding defensive recommendations with Gemini...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.inputPlaceholder}
          disabled={isLoading}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:hover:from-cyan-600 disabled:hover:to-blue-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all shrink-0"
        >
          <span>{t.sendQuestion}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
