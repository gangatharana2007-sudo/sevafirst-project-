import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  Handle,
  Position,
  MarkerType,
  Node,
  Edge,
  NodeProps,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  FileText,
  User,
  Building,
  Mail,
  Server,
  Globe,
  Database,
  ArrowUpRight,
  X,
  Bot,
  Download,
  Check,
  Map as MapIcon,
  Maximize2,
} from 'lucide-react';
import { GraphNode, GraphEdge, NodeType, AttackerRiskLevel, Language } from '../types';
import { getTranslation } from '../lib/i18n';

interface ExposureMapProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  attackerView: boolean;
  setAttackerView: (val: boolean) => void;
  lang: Language;
  onAskAIAboutNode: (node: GraphNode) => void;
}

interface CyberNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  type: NodeType;
  source: string;
  details: string;
  whyItMatters: string;
  potentialExposure: string;
  recommendation: string;
  attackerRisk: AttackerRiskLevel;
  relatedEntities?: string[];
  department?: string;
  metadata?: Record<string, string>;
  isSelected: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  attackerView: boolean;
  x?: number;
  y?: number;
}

type CyberNodeType = Node<CyberNodeData, 'cyberNode'>;

// Node icon resolver
const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case 'Organization':
      return Building;
    case 'Department':
      return Layers;
    case 'Person':
      return User;
    case 'Email':
      return Mail;
    case 'Document':
      return FileText;
    case 'Website':
      return Globe;
    case 'Technology':
      return Server;
    case 'Exposure':
      return AlertTriangle;
    default:
      return Database;
  }
};

// Node color resolver
const getNodeColor = (node: GraphNode, attackerView: boolean) => {
  if (attackerView) {
    if (node.attackerRisk === 'high') {
      return {
        bg: '#ef4444',
        border: '#f87171',
        glow: 'rgba(239, 68, 68, 0.4)',
        text: '#ffffff',
        badge: 'HIGH RISK EXPOSURE',
      };
    }
    if (node.attackerRisk === 'medium') {
      return {
        bg: '#eab308',
        border: '#facc15',
        glow: 'rgba(234, 179, 8, 0.35)',
        text: '#ffffff',
        badge: 'CORRELATED CONTEXT',
      };
    }
    return {
      bg: '#22c55e',
      border: '#4ade80',
      glow: 'rgba(34, 197, 94, 0.25)',
      text: '#ffffff',
      badge: 'PUBLIC ORDINARY',
    };
  }

  switch (node.type) {
    case 'Organization':
      return { bg: '#0284c7', border: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)', text: '#ffffff' };
    case 'Department':
      return { bg: '#2563eb', border: '#60a5fa', glow: 'rgba(96, 165, 250, 0.3)', text: '#ffffff' };
    case 'Person':
      return { bg: '#7c3aed', border: '#a78bfa', glow: 'rgba(167, 139, 250, 0.35)', text: '#ffffff' };
    case 'Email':
      return { bg: '#0d9488', border: '#2dd4bf', glow: 'rgba(45, 212, 191, 0.3)', text: '#ffffff' };
    case 'Document':
      return { bg: '#059669', border: '#34d399', glow: 'rgba(52, 211, 153, 0.35)', text: '#ffffff' };
    case 'Website':
      return { bg: '#0891b2', border: '#22d3ee', glow: 'rgba(34, 211, 238, 0.3)', text: '#ffffff' };
    case 'Technology':
      return { bg: '#d97706', border: '#fbbf24', glow: 'rgba(251, 191, 36, 0.35)', text: '#ffffff' };
    case 'Exposure':
      return { bg: '#e11d48', border: '#fb7185', glow: 'rgba(251, 113, 133, 0.45)', text: '#ffffff' };
    default:
      return { bg: '#475569', border: '#94a3b8', glow: 'rgba(148, 163, 184, 0.2)', text: '#ffffff' };
  }
};

// Custom Cyber Node Component for React Flow
const CyberNode: React.FC<NodeProps<CyberNodeType>> = ({ data, selected }) => {
  const isSelected = selected || data.isSelected;
  const isOrg = data.type === 'Organization';
  const isDept = data.type === 'Department';
  const Icon = getNodeIcon(data.type);
  const color = getNodeColor(data, data.attackerView);

  const radius = isOrg ? 32 : isDept ? 24 : 18;
  const nodeDiameter = radius * 2;

  return (
    <div
      className={`relative flex flex-col items-center cursor-pointer select-none transition-all duration-200 ${
        data.isDimmed ? 'opacity-20' : 'opacity-100'
      }`}
      style={{ width: Math.max(120, nodeDiameter + 40) }}
    >
      {/* Invisible React Flow Connection Handles for all directions */}
      <Handle type="target" position={Position.Top} className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0 !w-1 !h-1" />
      <Handle type="target" position={Position.Left} id="target-left" className="!opacity-0 !w-1 !h-1" />
      <Handle type="source" position={Position.Right} id="source-right" className="!opacity-0 !w-1 !h-1" />

      {/* Main Node Graphic Body */}
      <div
        className="relative flex items-center justify-center transition-transform hover:scale-110"
        style={{ width: nodeDiameter, height: nodeDiameter }}
      >
        {/* Selection Ring */}
        {isSelected && (
          <div
            className="absolute rounded-full border-2 animate-spin pointer-events-none"
            style={{
              width: nodeDiameter + 16,
              height: nodeDiameter + 16,
              borderColor: data.attackerView ? '#f43f5e' : '#38bdf8',
              borderStyle: 'dashed',
              animationDuration: '8s',
            }}
          />
        )}

        {/* Outer Glow Halo */}
        <div
          className={`absolute rounded-full pointer-events-none ${isSelected ? 'animate-pulse' : ''}`}
          style={{
            width: nodeDiameter + 8,
            height: nodeDiameter + 8,
            backgroundColor: color.glow,
          }}
        />

        {/* Outer Dark Circular Base */}
        <div
          className="relative rounded-full flex items-center justify-center shadow-lg"
          style={{
            width: nodeDiameter,
            height: nodeDiameter,
            backgroundColor: '#0f172a',
            borderWidth: isSelected ? 3 : 2,
            borderStyle: 'solid',
            borderColor: color.border,
          }}
        >
          {/* Inner Accent Center */}
          <div
            className="rounded-full flex items-center justify-center text-white"
            style={{
              width: nodeDiameter - 8,
              height: nodeDiameter - 8,
              backgroundColor: color.bg,
              opacity: 0.9,
            }}
          >
            <Icon className={isOrg ? 'w-6 h-6' : 'w-4 h-4'} />
          </div>
        </div>
      </div>

      {/* Node Label Below */}
      <div className="mt-2 text-center pointer-events-none">
        <span
          className={`block text-[11px] leading-tight font-sans tracking-tight truncate max-w-[130px] drop-shadow-md ${
            isSelected
              ? 'text-cyan-300 font-bold'
              : isOrg
              ? 'text-white font-bold'
              : 'text-slate-200'
          }`}
        >
          {data.label}
        </span>
        <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
          {data.attackerView ? data.attackerRisk : data.type}
        </span>
      </div>
    </div>
  );
};

// Internal Map Engine with React Flow hooks
const FlowCanvas: React.FC<ExposureMapProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  attackerView,
  setAttackerView,
  lang,
  onAskAIAboutNode,
}) => {
  const t = getTranslation(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const { fitView, zoomIn, zoomOut, setCenter, getViewport } = useReactFlow();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  // MiniMap display toggle
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Export as Image state
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Node position coordinates state
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  // Layout initialization
  useEffect(() => {
    const initialPos: Record<string, { x: number; y: number }> = {};
    const org = nodes.find((n) => n.type === 'Organization') || nodes[0];
    const centerX = 500;
    const centerY = 350;

    if (org) {
      initialPos[org.id] = { x: centerX, y: centerY };
    }

    const depts = nodes.filter((n) => n.type === 'Department');
    depts.forEach((dept, idx) => {
      const angle = (idx / depts.length) * 2 * Math.PI - Math.PI / 4;
      initialPos[dept.id] = {
        x: centerX + Math.cos(angle) * 220,
        y: centerY + Math.sin(angle) * 180,
      };
    });

    const otherNodes = nodes.filter((n) => n.type !== 'Organization' && n.type !== 'Department');
    otherNodes.forEach((node, idx) => {
      if (node.x !== undefined && node.y !== undefined) {
        initialPos[node.id] = {
          x: centerX + node.x * 1.05,
          y: centerY + node.y * 1.05,
        };
      } else {
        const angle = (idx / otherNodes.length) * 2 * Math.PI;
        const radius = 320 + (idx % 3) * 60;
        initialPos[node.id] = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * (radius * 0.8),
        };
      }
    });

    setNodePositions(initialPos);
  }, [nodes]);

  // Selected node lookup
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Connected nodes lookup
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>([selectedNodeId]);
    edges.forEach((edge) => {
      if (edge.source === selectedNodeId) set.add(edge.target);
      if (edge.target === selectedNodeId) set.add(edge.source);
    });
    return set;
  }, [selectedNodeId, edges]);

  // React Flow nodeTypes map (stable definition)
  const nodeTypes = useMemo(() => ({ cyberNode: CyberNode }), []);

  // Filtered nodes
  const filteredNodesList = useMemo(() => {
    return nodes.filter((n) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          n.label.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q) ||
          n.details.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedTypeFilter !== 'ALL' && n.type !== selectedTypeFilter) return false;
      if (selectedRiskFilter !== 'ALL' && n.attackerRisk !== selectedRiskFilter) return false;
      return true;
    });
  }, [nodes, searchQuery, selectedTypeFilter, selectedRiskFilter]);

  // Convert GraphNode[] into React Flow Node[]
  const flowNodes: Node<CyberNodeData>[] = useMemo(() => {
    return filteredNodesList.map((node) => {
      const pos = nodePositions[node.id] || { x: 500, y: 350 };
      const isSelected = node.id === selectedNodeId;
      const isConnected = connectedNodeIds.has(node.id);
      const isDimmed = Boolean(selectedNodeId && !isSelected && !isConnected);

      return {
        id: node.id,
        type: 'cyberNode',
        position: pos,
        data: {
          ...node,
          isSelected,
          isConnected,
          isDimmed,
          attackerView,
        },
      };
    });
  }, [filteredNodesList, nodePositions, selectedNodeId, connectedNodeIds, attackerView]);

  // Convert GraphEdge[] into React Flow Edge[]
  const flowEdges: Edge[] = useMemo(() => {
    return edges.map((edge) => {
      const isConnected =
        !selectedNodeId || edge.source === selectedNodeId || edge.target === selectedNodeId;
      const isAttacker = edge.isAttackerVector || edge.type === 'POTENTIALLY_EXPOSES';

      const strokeColor =
        attackerView && isAttacker
          ? '#f43f5e'
          : isConnected && selectedNodeId
          ? '#38bdf8'
          : '#334155';

      const strokeWidth =
        attackerView && isAttacker ? 2.5 : isConnected && selectedNodeId ? 2 : 1.2;

      const shouldShowLabel =
        selectedNodeId === edge.source || selectedNodeId === edge.target || isAttacker;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: shouldShowLabel ? edge.label : undefined,
        animated: attackerView && isAttacker,
        style: {
          stroke: strokeColor,
          strokeWidth,
          opacity: selectedNodeId && !isConnected ? 0.15 : 0.85,
        },
        labelStyle: {
          fill: attackerView && isAttacker ? '#fda4af' : '#94a3b8',
          fontSize: 9,
          fontFamily: 'monospace',
        },
        labelBgStyle: {
          fill: '#020617',
          fillOpacity: 0.85,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 14,
          height: 14,
        },
      };
    });
  }, [edges, selectedNodeId, attackerView]);

  // Node position drag update
  const onNodeDragStop = useCallback(
    (_event: unknown, node: Node) => {
      setNodePositions((prev) => ({
        ...prev,
        [node.id]: { x: node.position.x, y: node.position.y },
      }));
    },
    []
  );

  // Node click handler
  const onNodeClick = useCallback(
    (_event: unknown, node: Node) => {
      onSelectNode(node.id === selectedNodeId ? null : node.id);
    },
    [selectedNodeId, onSelectNode]
  );

  // Pane click handler (deselect)
  const onPaneClick = useCallback(() => {
    if (selectedNodeId) {
      onSelectNode(null);
    }
  }, [selectedNodeId, onSelectNode]);

  // Center / Focus on specific node
  const handleCenterOnNode = useCallback(
    (nodeId: string) => {
      onSelectNode(nodeId);
      const pos = nodePositions[nodeId];
      if (pos) {
        setCenter(pos.x + 30, pos.y + 30, { duration: 600, zoom: 1.1 });
      }
    },
    [nodePositions, onSelectNode, setCenter]
  );

  // Reset graph
  const handleReset = useCallback(() => {
    fitView({ duration: 600, padding: 0.2 });
    onSelectNode(null);
    setSearchQuery('');
    setSelectedTypeFilter('ALL');
    setSelectedRiskFilter('ALL');
  }, [fitView, onSelectNode]);

  // High-Resolution Presentation Image Exporter
  const handleExportAsImage = useCallback(() => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const container = containerRef.current;
      const baseWidth = container?.clientWidth || 1200;
      const baseHeight = container?.clientHeight || 800;
      const viewport = getViewport();

      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = baseWidth * scale;
      canvas.height = baseHeight * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Dark SOC Presentation Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Cyber Grid Dots
      ctx.fillStyle = '#1e293b';
      const gridSize = 28 * scale;
      for (let gx = 0; gx < canvas.width; gx += gridSize) {
        for (let gy = 0; gy < canvas.height; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Top Presentation Header Watermark
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(0, 0, canvas.width, 54 * scale);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 54 * scale);
      ctx.lineTo(canvas.width, 54 * scale);
      ctx.stroke();

      ctx.font = `bold ${14 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('CYBER MIRROR', 24 * scale, 34 * scale);

      ctx.font = `${11 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('— DIGITAL EXPOSURE MAP | DEFENSIVE INTELLIGENCE', 135 * scale, 34 * scale);

      const modeText = attackerView
        ? 'ATTACKER VIEW [COGNITIVE RECONNAISSANCE LENS]'
        : 'DEFENSIVE SOC TOPOLOGY [AUTHORIZED ASSESSMENT]';
      ctx.font = `bold ${9 * scale}px monospace`;
      ctx.fillStyle = attackerView ? '#f43f5e' : '#38bdf8';
      const modeWidth = ctx.measureText(modeText).width;
      ctx.fillText(modeText, canvas.width - modeWidth - 24 * scale, 34 * scale);
      ctx.restore();

      // 4. Apply Graph Zoom & Pan Transform from React Flow Viewport
      ctx.save();
      ctx.translate(viewport.x * scale, viewport.y * scale);
      ctx.scale(viewport.zoom * scale, viewport.zoom * scale);

      // 5. Render Edges
      edges.forEach((edge) => {
        const src = nodePositions[edge.source];
        const tgt = nodePositions[edge.target];
        if (!src || !tgt) return;

        const isConnected =
          !selectedNodeId || edge.source === selectedNodeId || edge.target === selectedNodeId;
        const isAttacker = edge.isAttackerVector || edge.type === 'POTENTIALLY_EXPOSES';
        const strokeColor =
          attackerView && isAttacker
            ? '#f43f5e'
            : isConnected && selectedNodeId
            ? '#38bdf8'
            : '#334155';
        const strokeWidth =
          attackerView && isAttacker ? 2.5 : isConnected && selectedNodeId ? 2 : 1.2;

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.globalAlpha = selectedNodeId && !isConnected ? 0.15 : 0.85;

        if (attackerView && isAttacker) {
          ctx.setLineDash([5, 3]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.stroke();

        ctx.restore();
      });

      // 6. Render Nodes
      nodes.forEach((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return;

        const isSelected = node.id === selectedNodeId;
        const isConnected = connectedNodeIds.has(node.id);
        const isDimmed = selectedNodeId && !isSelected && !isConnected;
        const color = getNodeColor(node, attackerView);
        const isOrg = node.type === 'Organization';
        const radius = isOrg ? 32 : node.type === 'Department' ? 24 : 18;

        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.2 : 1;

        if (isSelected) {
          ctx.strokeStyle = attackerView ? '#f43f5e' : '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 2]);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = color.glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = color.border;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color.bg;
        ctx.globalAlpha = (isDimmed ? 0.2 : 1) * 0.85;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius - 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = isDimmed ? 0.2 : 1;
        ctx.font = `${isOrg ? 'bold 12px' : '10px'} "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + radius + 14);

        ctx.restore();
      });

      ctx.restore(); // Restore from zoom/pan transform

      // 7. Legend Box
      ctx.save();
      const legendX = 24 * scale;
      const legendY = (baseHeight - 110) * scale;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1 * scale;
      const legendW = 280 * scale;
      const legendH = (attackerView ? 96 : 80) * scale;
      ctx.beginPath();
      ctx.roundRect(legendX, legendY, legendW, legendH, 8 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.font = `bold ${10 * scale}px monospace`;
      ctx.fillStyle = attackerView ? '#fda4af' : '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText(
        attackerView ? 'ATTACKER VIEW COGNITIVE LENS' : 'TOPOLOGY ENTITY LEGEND',
        legendX + 12 * scale,
        legendY + 18 * scale
      );

      if (attackerView) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(legendX + 18 * scale, legendY + 36 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `${9 * scale}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Ordinary Public Data (Low isolation risk)', legendX + 28 * scale, legendY + 39 * scale);

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(legendX + 18 * scale, legendY + 54 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Revealing when correlated together', legendX + 28 * scale, legendY + 57 * scale);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(legendX + 18 * scale, legendY + 72 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('Security-sensitive compound exposure', legendX + 28 * scale, legendY + 75 * scale);
      } else {
        const legendItems = [
          { label: 'Org & Departments', color: '#38bdf8' },
          { label: 'Personnel', color: '#a78bfa' },
          { label: 'Documents', color: '#34d399' },
          { label: 'Technologies', color: '#fbbf24' },
          { label: 'Exposures', color: '#fb7185' },
        ];
        legendItems.forEach((item, idx) => {
          const itemX = legendX + (idx % 2 === 0 ? 16 : 140) * scale;
          const itemY = legendY + (36 + Math.floor(idx / 2) * 16) * scale;
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(itemX, itemY, 3.5 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = `${9 * scale}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(item.label, itemX + 8 * scale, itemY + 3 * scale);
        });
      }

      ctx.restore();

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const modeSlug = attackerView ? 'attacker-view' : 'soc-topology';
      link.download = `cyber-mirror-exposure-map-${modeSlug}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export exposure map as image:', err);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, attackerView, edges, nodes, nodePositions, selectedNodeId, connectedNodeIds, getViewport]);

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] min-h-[600px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search & Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchNodes}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">{t.filterAll}</option>
            <option value="Person">{t.filterPeople}</option>
            <option value="Technology">{t.filterTech}</option>
            <option value="Document">{t.filterDocs}</option>
            <option value="Department">Department</option>
            <option value="Exposure">{t.filterExposures}</option>
          </select>
        </div>

        {/* Center: Attacker View Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAttackerView(!attackerView)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              attackerView
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{attackerView ? t.exitAttackerView : t.enterAttackerView}</span>
          </button>
        </div>

        {/* Right: Zoom, MiniMap & Export Controls */}
        <div className="flex items-center gap-2">
          {/* MiniMap Toggle Button */}
          <button
            onClick={() => setShowMiniMap(!showMiniMap)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              showMiniMap
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle React Flow MiniMap navigation preview"
          >
            <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">MiniMap</span>
          </button>

          {/* Quick Zoom and Fit View Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => zoomIn({ duration: 300 })}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded"
              title={t.zoomIn}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => zoomOut({ duration: 300 })}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded"
              title={t.zoomOut}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 hover:bg-slate-800 text-slate-300 rounded"
              title={t.resetGraph}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Export as Image Button */}
          <button
            onClick={handleExportAsImage}
            disabled={isExporting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
              exportSuccess
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-500/60 shadow-sm'
            }`}
            title="Capture current canvas state and export as high-resolution PNG for presentation decks"
          >
            {exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Saved PNG!</span>
              </>
            ) : isExporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.exportAsImage}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main React Flow Graph Canvas Area */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onPaneClick={onPaneClick}
          minZoom={0.3}
          maxZoom={2.5}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
          className="w-full h-full"
        >
          {/* Subtle Cyber Grid Background */}
          <Background color="#1e293b" gap={28} size={1.2} />

          {/* React Flow Integrated MiniMap */}
          {showMiniMap && (
            <MiniMap
              nodeColor={(n) => {
                const nodeData = (n.data as unknown) as CyberNodeData | undefined;
                if (!nodeData) return '#475569';
                if (attackerView) {
                  if (nodeData.attackerRisk === 'high') return '#ef4444';
                  if (nodeData.attackerRisk === 'medium') return '#eab308';
                  return '#22c55e';
                }
                switch (nodeData.type) {
                  case 'Organization':
                    return '#0284c7';
                  case 'Department':
                    return '#2563eb';
                  case 'Person':
                    return '#7c3aed';
                  case 'Email':
                    return '#0d9488';
                  case 'Document':
                    return '#059669';
                  case 'Website':
                    return '#0891b2';
                  case 'Technology':
                    return '#d97706';
                  case 'Exposure':
                    return '#e11d48';
                  default:
                    return '#475569';
                }
              }}
              nodeStrokeColor="#0f172a"
              nodeStrokeWidth={2}
              nodeBorderRadius={6}
              maskColor="rgba(2, 6, 23, 0.78)"
              className="!bg-slate-950/95 !border !border-slate-800 !rounded-xl !shadow-2xl overflow-hidden !m-4"
              position="bottom-right"
              zoomable
              pannable
            />
          )}

          {/* React Flow Controls */}
          <Controls
            showInteractive={false}
            className="!bg-slate-900 !border !border-slate-800 !rounded-xl !shadow-xl [&>button]:!bg-slate-900 [&>button]:!border-slate-800 [&>button]:!text-slate-300 hover:[&>button]:!bg-slate-800"
          />
        </ReactFlow>

        {/* Bottom Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs max-w-sm pointer-events-auto">
          {attackerView ? (
            <div className="space-y-1.5 font-mono">
              <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.attackerViewTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-slate-300 text-[11px]">{t.greenLegend}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#eab308]" />
                <span className="text-slate-300 text-[11px]">{t.yellowLegend}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
                <span className="text-rose-200 text-[11px] font-semibold">{t.redLegend}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Org & Depts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Personnel</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Documents</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Technologies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Exposures</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Entity Inspector Drawer (when node is clicked) */}
      {selectedNode && (
        <div className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-20 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider ${
                  selectedNode.attackerRisk === 'high'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : selectedNode.attackerRisk === 'medium'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {selectedNode.type}
              </span>
              <span className="text-[10px] font-mono text-slate-400">ID: {selectedNode.id}</span>
            </div>
            <button
              onClick={() => onSelectNode(null)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-5 space-y-4 text-xs">
            <div>
              <h3 className="text-base font-bold text-white font-sans">{selectedNode.label}</h3>
              {selectedNode.department && (
                <div className="text-slate-400 text-xs mt-0.5">
                  Division: {selectedNode.department}
                </div>
              )}
            </div>

            {/* Verified Observed Source */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                {t.observedSource}
              </span>
              <span className="text-slate-300 text-xs">{selectedNode.source}</span>
            </div>

            {/* Description & Details */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Overview
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedNode.details}</p>
            </div>

            {/* Why it Matters */}
            <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40">
              <span className="text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.whyItMatters}</span>
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedNode.whyItMatters}</p>
            </div>

            {/* Potential Exposure */}
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40">
              <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.potentialExposure}</span>
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedNode.potentialExposure}</p>
            </div>

            {/* Defensive Recommendation */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
              <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.defensiveRecommendation}</span>
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedNode.recommendation}</p>
            </div>

            {/* Related Connected Entities */}
            {selectedNode.relatedEntities && selectedNode.relatedEntities.length > 0 && (
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  {t.relatedEntities} ({selectedNode.relatedEntities.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.relatedEntities.map((relId) => {
                    const targetNode = nodes.find((n) => n.id === relId);
                    if (!targetNode) return null;
                    return (
                      <button
                        key={relId}
                        onClick={() => handleCenterOnNode(relId)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-700 transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <span>{targetNode.label}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ask AI Analyst Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onAskAIAboutNode(selectedNode)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-900/30 transition-all text-xs"
              >
                <Bot className="w-4 h-4" />
                <span>{t.askAIAboutEntity}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Exported Wrapper providing ReactFlowProvider
export const ExposureMap: React.FC<ExposureMapProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
};
