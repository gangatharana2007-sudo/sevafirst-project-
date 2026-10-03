/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ExposureMap } from './components/ExposureMap';
import { FindingsView } from './components/FindingsView';
import { DocumentAnalysis } from './components/DocumentAnalysis';
import { AIAnalyst } from './components/AIAnalyst';
import { ReportGenerator } from './components/ReportGenerator';
import { MethodologyView } from './components/MethodologyView';
import { DemoTourModal, DEMO_STEPS } from './components/DemoTourModal';
import { CyberBackground } from './components/CyberBackground';

import { GraphNode, GraphEdge, Finding, UploadedDoc, Language } from './types';
import { INITIAL_NODES, INITIAL_EDGES, DEMO_DOCUMENTS, DEMO_ORG_NAME } from './data/novatechDemo';
import { runCorrelationEngine } from './lib/correlationEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [attackerView, setAttackerView] = useState<boolean>(false);

  // Core Data State
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_EDGES);
  const [documents, setDocuments] = useState<UploadedDoc[]>(DEMO_DOCUMENTS);

  // Selection & Focus states
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [initialAIItem, setInitialAIItem] = useState<Finding | GraphNode | null>(null);

  // Guided Demo Tour State
  const [demoTourOpen, setDemoTourOpen] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(0);

  // Deterministic Correlation Engine & Metrics
  const { findings, metrics } = useMemo(() => {
    return runCorrelationEngine(nodes, edges, documents.length);
  }, [nodes, edges, documents]);

  // Handler: Add Ingested Document & synthesize new nodes
  const handleAddDocument = (newDoc: UploadedDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);

    // Create a Document Node in the graph
    const docNode: GraphNode = {
      id: newDoc.id,
      label: newDoc.name,
      type: 'Document',
      source: `User Ingestion: ${newDoc.name}`,
      details: `Ingested document (${newDoc.size}) containing public organization mentions.`,
      whyItMatters: 'Newly analyzed public document contributes additional organizational entities.',
      potentialExposure: 'Potential technical or personnel metadata disclosures.',
      recommendation: 'Verify document classification and sanitize metadata prior to publication.',
      attackerRisk: 'medium',
      department: 'Ingestion Staging',
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
    };

    const newNodesToAdd: GraphNode[] = [docNode];
    const newEdgesToAdd: GraphEdge[] = [
      {
        id: `edge-${newDoc.id}-org`,
        source: 'org-novatech',
        target: newDoc.id,
        type: 'PUBLISHED_BY',
        label: 'Ingested Document',
      },
    ];

    // Add extracted emails as nodes
    newDoc.extractedEntities.emails.forEach((email, idx) => {
      const emailNodeId = `email-custom-${newDoc.id}-${idx}`;
      newNodesToAdd.push({
        id: emailNodeId,
        label: email,
        type: 'Email',
        source: newDoc.name,
        details: `Disclosed email address found in ${newDoc.name}.`,
        whyItMatters: 'Publicly reachable communication endpoint.',
        potentialExposure: 'Spearphishing or automated email harvesting vector.',
        recommendation: 'Deploy email authentication protocols (DMARC, SPF, DKIM).',
        attackerRisk: 'medium',
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
      });

      newEdgesToAdd.push({
        id: `edge-${docNode.id}-${emailNodeId}`,
        source: docNode.id,
        target: emailNodeId,
        type: 'MENTIONS',
        label: 'Discloses Contact',
      });
    });

    setNodes((prev) => [...prev, ...newNodesToAdd]);
    setEdges((prev) => [...prev, ...newEdgesToAdd]);
  };

  // Handler: Delete Ingested Document
  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    setNodes((prev) => prev.filter((n) => n.id !== docId && !n.id.includes(docId)));
    setEdges((prev) => prev.filter((e) => e.source !== docId && e.target !== docId));
  };

  // Handler: Reset to pristine NovaTech demo state
  const handleResetData = () => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setDocuments(DEMO_DOCUMENTS);
    setSelectedNodeId(null);
    setSelectedFinding(null);
  };

  // Handler: Start Guided Demo Tour
  const handleStartDemo = () => {
    handleResetData();
    setCurrentDemoStep(0);
    setDemoTourOpen(true);
    applyDemoStep(0);
  };

  // Handler: Apply specific Guided Demo step
  const applyDemoStep = (stepIndex: number) => {
    const step = DEMO_STEPS[stepIndex];
    if (!step) return;

    setCurrentDemoStep(stepIndex);
    setActiveTab(step.targetTab);
    setAttackerView(step.attackerView);
    if (step.selectedNodeId) {
      setSelectedNodeId(step.selectedNodeId);
    }
    if (step.targetLang) {
      setLang(step.targetLang);
    }
  };

  // Handler: Node ask AI
  const handleAskAIAboutNode = (node: GraphNode) => {
    setInitialAIItem(node);
    setActiveTab('ai-analyst');
  };

  // Handler: Finding ask AI
  const handleAskAIAboutFinding = (finding: Finding) => {
    setInitialAIItem(finding);
    setActiveTab('ai-analyst');
  };

  // Handler: Trace node in exposure map
  const handleTraceInGraph = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setActiveTab('exposure-map');
  };

  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Animated Cyber Background with Particle Mesh & Glowing Orbs */}
      <CyberBackground attackerView={attackerView} />

      {/* Top Main Navigation */}
      <div className="relative z-20">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          setLang={setLang}
          attackerView={attackerView}
          setAttackerView={setAttackerView}
          onStartDemo={handleStartDemo}
        />
      </div>

      {/* Main Content Router */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'landing' && (
          <LandingPage
            lang={lang}
            onLaunchDemo={() => setActiveTab('exposure-map')}
            onAnalyzeData={() => setActiveTab('documents')}
            onExploreAttackerView={() => {
              setAttackerView(true);
              setActiveTab('exposure-map');
            }}
            onGoToDashboard={() => setActiveTab('dashboard')}
            onGoToMethodology={() => setActiveTab('methodology')}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            metrics={metrics}
            findings={findings}
            lang={lang}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectFinding={(f) => {
              setSelectedFinding(f);
              setActiveTab('findings');
            }}
            onExploreAttackerView={() => {
              setAttackerView(true);
              setActiveTab('exposure-map');
            }}
          />
        )}

        {activeTab === 'exposure-map' && (
          <ExposureMap
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            attackerView={attackerView}
            setAttackerView={setAttackerView}
            lang={lang}
            onAskAIAboutNode={handleAskAIAboutNode}
          />
        )}

        {activeTab === 'findings' && (
          <FindingsView
            findings={findings}
            nodes={nodes}
            lang={lang}
            onTraceInGraph={handleTraceInGraph}
            onAskAIAboutFinding={handleAskAIAboutFinding}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentAnalysis
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onResetDocuments={handleResetData}
            lang={lang}
            onViewInGraph={() => setActiveTab('exposure-map')}
          />
        )}

        {activeTab === 'ai-analyst' && (
          <AIAnalyst
            findings={findings}
            nodes={nodes}
            initialItem={initialAIItem}
            lang={lang}
            onClearInitialItem={() => setInitialAIItem(null)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportGenerator
            metrics={metrics}
            findings={findings}
            nodes={nodes}
            lang={lang}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView lang={lang} />
        )}
      </main>

      {/* Guided Tour Interactive Bar */}
      <DemoTourModal
        isOpen={demoTourOpen}
        onClose={() => setDemoTourOpen(false)}
        onStepChange={applyDemoStep}
        currentStep={currentDemoStep}
        lang={lang}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">CYBER MIRROR</span>
            <span>—</span>
            <span>See yourself before an attacker does.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Simulated Organization: NovaTech College</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('methodology')}
              className="text-cyan-400 hover:underline"
            >
              Defensive Methodology
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
