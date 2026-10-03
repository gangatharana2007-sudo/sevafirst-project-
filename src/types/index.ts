export type NodeType =
  | 'Organization'
  | 'Person'
  | 'Department'
  | 'Email'
  | 'Document'
  | 'Website'
  | 'Technology'
  | 'Source'
  | 'Exposure';

export type RelationshipType =
  | 'BELONGS_TO'
  | 'MENTIONS'
  | 'ASSOCIATED_WITH'
  | 'PUBLISHED_BY'
  | 'RELATED_TO'
  | 'POTENTIALLY_EXPOSES';

export type AttackerRiskLevel = 'low' | 'medium' | 'high'; // low: Green, medium: Yellow, high: Red

export interface GraphNode {
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
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  pinned?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
  isAttackerVector?: boolean;
}

export type SeverityLevel = 'High' | 'Medium' | 'Low' | 'Informational';

export interface Finding {
  id: string;
  title: string;
  severity: SeverityLevel;
  category:
    | 'Identity Exposure'
    | 'Technology Disclosure'
    | 'Cross-Source Correlation'
    | 'Document Metadata'
    | 'Administrative Recon'
    | 'Academic Data Exposure';
  evidence: string[];
  affectedEntities: string[];
  reason: string;
  recommendation: string;
  source: string;
  date: string;
  status: 'Open' | 'Mitigated' | 'In Review';
}

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  explanation: string;
}

export interface ExposureAwarenessMetrics {
  totalScore: number; // e.g. 72 / 100
  categories: ScoreCategory[];
  publicInfoCount: number;
  peopleCount: number;
  documentCount: number;
  technologyCount: number;
  relationshipCount: number;
  findingsCount: {
    high: number;
    medium: number;
    low: number;
    informational: number;
    total: number;
  };
  sourcesDistribution: Record<string, number>;
}

export type Language = 'en' | 'ta';

export interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  type: string;
  status: 'Analyzed' | 'Processing';
  extractedEntities: {
    organizations: string[];
    people: string[];
    departments: string[];
    emails: string[];
    technologies: string[];
    urls: string[];
  };
  rawContent?: string;
}
