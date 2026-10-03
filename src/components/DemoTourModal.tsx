import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Eye,
  Bot,
  Layers,
  Network,
  FileText,
  Languages,
} from 'lucide-react';
import { Language } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStepChange: (stepIndex: number) => void;
  currentStep: number;
  lang: Language;
}

export const DEMO_STEPS = [
  {
    title: '1. Load NovaTech College Demo',
    badge: 'STAGE 1',
    description: 'Loaded baseline simulated organization with 4 departments, 4 documents, and 5 technology stacks.',
    actionName: 'View Dashboard',
    targetTab: 'dashboard',
    attackerView: false,
    selectedNodeId: null,
    targetLang: 'en' as Language,
  },
  {
    title: '2. Analyze Exposure Awareness Score',
    badge: 'STAGE 2',
    description: 'Observe the 72/100 Exposure Awareness Score with explainable weight breakdown across 5 defensive vectors.',
    actionName: 'Open Exposure Map',
    targetTab: 'dashboard',
    attackerView: false,
    selectedNodeId: null,
    targetLang: 'en' as Language,
  },
  {
    title: '3. Digital Exposure Map Topology',
    badge: 'STAGE 3',
    description: 'Explore the full organizational graph: organization, departments, people, emails, technologies, and documents.',
    actionName: 'Inspect Relationships',
    targetTab: 'exposure-map',
    attackerView: false,
    selectedNodeId: 'dept-it',
    targetLang: 'en' as Language,
  },
  {
    title: '4. Demonstrate Node Relationships',
    badge: 'STAGE 4',
    description: 'Dr. Aris Vance (CIO) links to IT_Policy.pdf and administrative email, revealing the reporting chain.',
    actionName: 'Enter Attacker View',
    targetTab: 'exposure-map',
    attackerView: false,
    selectedNodeId: 'person-aris',
    targetLang: 'en' as Language,
  },
  {
    title: '5. Enter Cognitive Attacker View',
    badge: 'STAGE 5',
    description: 'Watch nodes transition: Green (ordinary public), Yellow (contextual correlation), Red (security-sensitive exposure).',
    actionName: 'View Correlated Exposure',
    targetTab: 'exposure-map',
    attackerView: true,
    selectedNodeId: 'exposure-identity-chain',
    targetLang: 'en' as Language,
  },
  {
    title: '6. Correlated Exposure Synthesis',
    badge: 'STAGE 6',
    description: 'Public Name + Public Role + Public Email + Cloud S3 Bucket = Complete spearphishing and reconnaissance dossier.',
    actionName: 'Open AI Analyst',
    targetTab: 'findings',
    attackerView: true,
    selectedNodeId: 'exposure-identity-chain',
    targetLang: 'en' as Language,
  },
  {
    title: '7. Grounded Gemini AI Analyst',
    badge: 'STAGE 7',
    description: 'Gemini interprets verified facts without hallucinations, strictly separating OBSERVED DATA from AI INTERPRETATION.',
    actionName: 'Ask for Explanation',
    targetTab: 'ai-analyst',
    attackerView: false,
    selectedNodeId: null,
    targetLang: 'en' as Language,
  },
  {
    title: '8. Multilingual Defense in Tamil',
    badge: 'STAGE 8',
    description: 'Seamless bilingual capabilities: Switch interface to Tamil (தமிழ்) and receive fluent, native security explanations.',
    actionName: 'Generate Security Report',
    targetTab: 'ai-analyst',
    attackerView: false,
    selectedNodeId: null,
    targetLang: 'ta' as Language,
  },
  {
    title: '9. Executive Report Generator',
    badge: 'STAGE 9',
    description: 'Generate an executive security briefing with scope, key risks, and defensive remediations ready for C-suite presentation.',
    actionName: 'Review Methodology & Wrap-up',
    targetTab: 'reports',
    attackerView: false,
    selectedNodeId: null,
    targetLang: 'en' as Language,
  },
  {
    title: '10. Complete Innovation Demo Finished',
    badge: 'STAGE 10',
    description: 'You experienced the full cycle: Public Info + Relationships + Correlation + AI Explanation = Defensive Security.',
    actionName: 'Explore Freely',
    targetTab: 'exposure-map',
    attackerView: false,
    selectedNodeId: null,
    targetLang: 'en' as Language,
  },
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onStepChange,
  currentStep,
  lang,
}) => {
  if (!isOpen) return null;

  const step = DEMO_STEPS[currentStep] || DEMO_STEPS[0];
  const isLast = currentStep === DEMO_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-full px-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-[0_0_35px_rgba(6,182,212,0.25)] backdrop-blur-xl text-white space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              GUIDED DEMO TOUR ({currentStep + 1} / {DEMO_STEPS.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step details */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{step.title}</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
            {step.description}
          </p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5">
          {DEMO_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? 'w-6 bg-cyan-400'
                  : i < currentStep
                  ? 'w-2 bg-cyan-700'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-900/30 transition-all hover:scale-[1.02]"
          >
            <span>{isLast ? 'Complete Tour' : step.actionName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
