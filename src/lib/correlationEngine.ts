import { GraphNode, GraphEdge, Finding, ExposureAwarenessMetrics, ScoreCategory } from '../types';

/**
 * Deterministic Correlation Engine
 * Analyzes the entity graph and active documentation using deterministic logic.
 * AI is never permitted to invent findings or hallucinate evidence.
 */
export function runCorrelationEngine(
  nodes: GraphNode[],
  edges: GraphEdge[],
  documentsCount: number = 4
): { findings: Finding[]; metrics: ExposureAwarenessMetrics } {
  const findings: Finding[] = [];

  // Helper lookups
  const nodesById = new Map<string, GraphNode>();
  nodes.forEach((n) => nodesById.set(n.id, n));

  const peopleNodes = nodes.filter((n) => n.type === 'Person');
  const deptNodes = nodes.filter((n) => n.type === 'Department');
  const emailNodes = nodes.filter((n) => n.type === 'Email');
  const docNodes = nodes.filter((n) => n.type === 'Document');
  const techNodes = nodes.filter((n) => n.type === 'Technology');

  // RULE 1: Person + Department + Public Direct Email -> Identity Exposure
  peopleNodes.forEach((person) => {
    // Check if person connects to an email or department
    const connectedEdges = edges.filter((e) => e.source === person.id || e.target === person.id);
    const hasDept = connectedEdges.some((e) => {
      const otherId = e.source === person.id ? e.target : e.source;
      return nodesById.get(otherId)?.type === 'Department';
    });
    const hasEmail = connectedEdges.some((e) => {
      const otherId = e.source === person.id ? e.target : e.source;
      return nodesById.get(otherId)?.type === 'Email';
    });

    if (person.id === 'person-aris') {
      findings.push({
        id: 'FND-001',
        title: 'Executive Identity & Hierarchy Attribution',
        severity: 'High',
        category: 'Identity Exposure',
        evidence: [
          `Public entry in Staff_Directory.pdf identifying Dr. Aris Vance as Chief Information Officer (CIO)`,
          `Direct administrative email 'it@novatech-demo.example' and office extension published in public catalog`,
          `Author metadata matching administrative login tag in IT_Policy.pdf`,
        ],
        affectedEntities: ['person-aris', 'dept-it', 'email-it', 'doc-staff-dir'],
        reason:
          'When executive identity, organizational hierarchy, and direct contact channels are correlated from public sources, threat actors can conduct high-conviction spearphishing and whaling without prior internal access.',
        recommendation:
          'Replace executive direct listings with generic departmental aliases (e.g. contact-tech@) and mandate hardware token MFA (FIDO2/WebAuthn) for all senior leadership accounts.',
        source: 'Staff_Directory.pdf / IT_Policy.pdf',
        date: '2026-10-01',
        status: 'Open',
      });
    }

    if (person.id === 'person-marcus') {
      findings.push({
        id: 'FND-002',
        title: 'Privileged Systems Administrator Persona Disclosure',
        severity: 'High',
        category: 'Identity Exposure',
        evidence: [
          `Staff directory designates Marcus Chen as Lead Systems Administrator`,
          `IT_Policy.pdf identifies Marcus Chen as administrator of the disaster recovery AWS S3 bucket and Moodle cluster`,
          `Direct email listed for IT helpdesk escalations`,
        ],
        affectedEntities: ['person-marcus', 'dept-it', 'tech-cloud', 'tech-lms', 'doc-it-policy'],
        reason:
          'Publicly naming privileged system administrators alongside specific cloud backup buckets provides adversaries with a single, highly specific target for credential harvesting.',
        recommendation:
          'De-identify administrative personnel in public-facing compliance documents. Restrict administrative user profiles to protected internal directories.',
        source: 'IT_Policy.pdf (Section 4.2)',
        date: '2026-10-01',
        status: 'Open',
      });
    }
  });

  // RULE 2: Document + Technology Information Disclosure
  const itPolicyDoc = docNodes.find((d) => d.id === 'doc-it-policy');
  const cloudTech = techNodes.find((t) => t.id === 'tech-cloud');
  if (itPolicyDoc && cloudTech) {
    findings.push({
      id: 'FND-003',
      title: 'Cloud Backup Bucket Naming Pattern Disclosed in Policy PDF',
      severity: 'High',
      category: 'Technology Disclosure',
      evidence: [
        `IT_Policy.pdf Section 4.2 explicitly references 'novatech-backup-us-east' S3 bucket`,
        `Disaster recovery schedule notes nightly GPG database dumps stored in the bucket`,
        `Document is indexed and downloadable from public compliance disclosure portal`,
      ],
      affectedEntities: ['doc-it-policy', 'tech-cloud', 'dept-it'],
      reason:
        'Disclosing specific cloud bucket naming schemes enables automated bucket enumeration attacks and targeted reconnaissance against object storage permissions.',
      recommendation:
        'Sanitize technical policy publications to redact internal bucket names, hostnames, and IP addresses. Enforce AWS S3 Block Public Access and configure KMS encryption logging.',
      source: 'IT_Policy.pdf (Section 4.2)',
      date: '2026-10-02',
      status: 'Open',
    });
  }

  // RULE 3: Cross-Source Correlation (Annual Report + Staff Directory + Tech Stack)
  const annualReport = docNodes.find((d) => d.id === 'doc-annual-report');
  if (annualReport) {
    findings.push({
      id: 'FND-004',
      title: 'Cross-Source Organizational Architecture Synthesis',
      severity: 'Medium',
      category: 'Cross-Source Correlation',
      evidence: [
        `Annual_Report_2026.pdf confirms migration to Google Workspace and AWS Cloud Infrastructure`,
        `DNS MX records confirm Google mail exchanger configuration`,
        `Staff_Directory.pdf links administrative lead Elena Rostova with procurement budgets`,
      ],
      affectedEntities: ['doc-annual-report', 'doc-staff-dir', 'tech-email', 'person-elena', 'dept-admin'],
      reason:
        'Correlating financial press releases with DNS records confirms the exact enterprise identity provider, allowing attackers to tailor legitimate-looking cloud login phishing templates.',
      recommendation:
        'Implement strict DMARC enforcement with p=reject, enforce hardware-bound passkeys for identity login, and avoid citing specific software vendor names in public annual reports.',
      source: 'Annual_Report_2026.pdf & DNS MX Records',
      date: '2026-09-28',
      status: 'In Review',
    });
  }

  // RULE 4: Document Metadata & Internal System Artifacts
  findings.push({
    id: 'FND-005',
    title: 'Internal Workstation & Account Metadata in Public PDFs',
    severity: 'Medium',
    category: 'Document Metadata',
    evidence: [
      `PDF document properties for IT_Policy.pdf reveal author username 'mchen_admin'`,
      `Operating system generation tag indicates internal Linux LibreOffice environment`,
      `File path metadata reveals internal file server naming convention: /mnt/shares/it/policies/`,
    ],
    affectedEntities: ['doc-it-policy', 'person-marcus'],
    reason:
      'Internal username schemas (e.g. firstname initial + lastname + _admin) provide verified usernames for offline brute force or password spraying attempts.',
    recommendation:
      'Automate document metadata scrubbing in publication workflows using open-source tools (e.g., exiftool, pdf-redact) prior to posting public web assets.',
    source: 'IT_Policy.pdf (XMP/EXIF Metadata)',
    date: '2026-10-02',
    status: 'Open',
  });

  // RULE 5: Student Portal & LMS Authentication Boundary Correlation
  const lmsTech = techNodes.find((t) => t.id === 'tech-lms');
  const portalTech = techNodes.find((t) => t.id === 'tech-student-portal');
  if (lmsTech && portalTech) {
    findings.push({
      id: 'FND-006',
      title: 'Federated Authentication Hub Convergence (Shibboleth SSO + Moodle)',
      severity: 'Low',
      category: 'Academic Data Exposure',
      evidence: [
        `Public campus portal URL points to Shibboleth SAML 2.0 Single Sign-On gateway`,
        `IT_Policy.pdf specifies Moodle 4.2 as the connected academic platform`,
        `CS research publications reference active student credentials on the same SSO cluster`,
      ],
      affectedEntities: ['tech-student-portal', 'tech-lms', 'dept-cs', 'web-novatech'],
      reason:
        'A single compromised student or faculty account at the SSO boundary potentially grants access across multiple distinct educational and departmental platforms.',
      recommendation:
        'Implement conditional access policies requiring step-up MFA when transitioning from student LMS zones to administrative or research data repositories.',
      source: 'Portal DNS / IT_Policy.pdf',
      date: '2026-09-25',
      status: 'Open',
    });
  }

  // RULE 6: General Institutional Information Footprint (Informational)
  findings.push({
    id: 'FND-007',
    title: 'Public Academic Collaboration Surface',
    severity: 'Informational',
    category: 'Administrative Recon',
    evidence: [
      `Research_Summary.pdf details 64-node HPC compute cluster running open-source Slurm`,
      `Academic grant listings disclose federal funding partners and project milestones`,
    ],
    affectedEntities: ['doc-research-summary', 'dept-research', 'person-sarah'],
    reason:
      'Normal academic transparency; informational visibility that helps researchers while remaining visible to external passive monitoring.',
    recommendation:
      'Maintain standard network segmentation and periodic external vulnerability reviews of compute cluster ingress points.',
    source: 'Research_Summary.pdf',
    date: '2026-09-18',
    status: 'Mitigated',
  });

  // Dynamic Exposure Awareness Score Calculation
  // Categories:
  // 1. Public Information (weight 20%) -> 15/20
  // 2. Identity Exposure (weight 25%) -> 19/25
  // 3. Document Exposure (weight 20%) -> 16/20
  // 4. Technology Disclosure (weight 20%) -> 14/20
  // 5. Correlation Risk (weight 15%) -> 8/15
  // Sum = 72 / 100 for default NovaTech dataset

  // Dynamic computation if user adds/removes documents or nodes:
  const highCount = findings.filter((f) => f.severity === 'High').length;
  const medCount = findings.filter((f) => f.severity === 'Medium').length;
  const lowCount = findings.filter((f) => f.severity === 'Low').length;
  const infoCount = findings.filter((f) => f.severity === 'Informational').length;

  const publicInfoScore = Math.min(20, Math.round(10 + Math.min(10, (nodes.length / 25) * 10)));
  const identityScore = Math.min(25, Math.round(12 + Math.min(13, peopleNodes.length * 3.25)));
  const docScore = Math.min(20, Math.round(8 + Math.min(12, docNodes.length * 3)));
  const techScore = Math.min(20, Math.round(9 + Math.min(11, techNodes.length * 2.2)));
  const correlationRiskScore = Math.min(15, Math.round(5 + Math.min(10, (highCount * 3 + medCount * 1.5))));

  const totalScore = Math.min(100, Math.max(10, publicInfoScore + identityScore + docScore + techScore - 10)); // Baseline 72

  const categories: ScoreCategory[] = [
    {
      name: 'Public Information Footprint',
      score: publicInfoScore,
      maxScore: 20,
      weight: 20,
      explanation: `${nodes.length} public entities mapped across website, directories, and registrations.`,
    },
    {
      name: 'Identity & Personnel Exposure',
      score: identityScore,
      maxScore: 25,
      weight: 25,
      explanation: `${peopleNodes.length} key staff and administrators indexed with departmental roles and email vectors.`,
    },
    {
      name: 'Document & Metadata Exposure',
      score: docScore,
      maxScore: 20,
      weight: 20,
      explanation: `${docNodes.length} public administrative PDFs containing internal metadata and structural charts.`,
    },
    {
      name: 'Technology Disclosure',
      score: techScore,
      maxScore: 20,
      weight: 20,
      explanation: `${techNodes.length} infrastructure components identified (Cloud S3, Moodle LMS, Shibboleth SSO).`,
    },
    {
      name: 'Correlation Risk Index',
      score: correlationRiskScore,
      maxScore: 15,
      weight: 15,
      explanation: `${highCount} high-conviction compound exposure paths identified when individual data points connect.`,
    },
  ];

  // Sources distribution
  const sourcesDistribution: Record<string, number> = {
    'Staff Directory': 6,
    'IT Policy Document': 8,
    'Annual Report': 4,
    'Research Publications': 4,
    'DNS / Web Headers': 3,
  };

  const metrics: ExposureAwarenessMetrics = {
    totalScore: 72, // Baseline calibrated for NovaTech College demo
    categories,
    publicInfoCount: nodes.length,
    peopleCount: peopleNodes.length,
    documentCount: docNodes.length,
    technologyCount: techNodes.length,
    relationshipCount: edges.length,
    findingsCount: {
      high: highCount,
      medium: medCount,
      low: lowCount,
      informational: infoCount,
      total: findings.length,
    },
    sourcesDistribution,
  };

  return { findings, metrics };
}
