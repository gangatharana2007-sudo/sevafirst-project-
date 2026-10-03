import { Language } from '../types';

export const translations = {
  en: {
    appTitle: 'CYBER MIRROR',
    tagline: 'See yourself before an attacker does.',
    subtitle:
      'Understand how publicly visible information connects, identify potential exposure, and strengthen your defensive posture.',
    launchDemo: 'Launch Demo',
    analyzeData: 'Analyze Authorized Data',
    exploreAttackerView: 'Explore Attacker View',
    legalNotice:
      'NOTICE: Defensive Exposure-Awareness Platform only. Only analyze information and assets that you own or are explicitly authorized to assess.',
    simulatedDataBadge: 'SIMULATED DEMO DATA',
    demoOrgName: 'NovaTech College',
    
    // Nav
    navOverview: 'Overview',
    navDashboard: 'Dashboard',
    navExposureMap: 'Exposure Map',
    navAttackerView: 'Attacker View',
    navFindings: 'Findings',
    navDocuments: 'Documents',
    navAIAnalyst: 'AI Analyst',
    navReports: 'Reports',
    navMethodology: 'Methodology',
    startGuidedTour: 'Guided Demo',

    // Dashboard
    scoreTitle: 'Exposure Awareness Score',
    scoreDisclaimer: 'Awareness Metric Only — Not a formal compliance or penetration test certification.',
    publicInfoCount: 'Public Entities',
    peopleCount: 'Key Personnel',
    documentCount: 'Published Documents',
    technologyCount: 'Disclosed Technologies',
    relationshipCount: 'Correlation Links',
    potentialFindings: 'Identified Exposures',
    categoryBreakdown: 'Exposure by Category',
    severityBreakdown: 'Findings by Severity',
    sourceDistribution: 'Information Source Provenance',
    
    // Attacker View
    attackerViewTitle: 'ATTACKER VIEW (Awareness Simulation)',
    attackerViewSubtitle:
      'Each item may appear harmless individually. When correlated, the combined information can reveal critical organizational context without active hacking.',
    greenLegend: 'Ordinary public information (low risk in isolation)',
    yellowLegend: 'Information that becomes revealing when correlated',
    redLegend: 'Potentially security-sensitive exposure path',
    enterAttackerView: 'ENTER ATTACKER VIEW',
    exitAttackerView: 'EXIT ATTACKER VIEW',
    harmlessAloneMessage:
      'PUBLIC INFORMATION + RELATIONSHIPS + CORRELATION + AI EXPLANATION = DIGITAL EXPOSURE MAP',

    // Exposure Map
    mapTitle: 'Digital Exposure Map',
    searchNodes: 'Search entities (e.g. Vance, IT, Cloud, S3)...',
    filterAll: 'All Entities',
    filterPeople: 'People',
    filterTech: 'Technologies',
    filterDocs: 'Documents',
    filterExposures: 'Exposures',
    resetGraph: 'Reset View',
    fitToScreen: 'Fit Canvas',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    nodeDetails: 'Entity Inspector',
    whyItMatters: 'Why It Matters',
    potentialExposure: 'Potential Exposure',
    defensiveRecommendation: 'Defensive Recommendation',
    relatedEntities: 'Connected Entities',
    askAIAboutEntity: 'Ask Gemini AI Analyst',
    observedSource: 'Verified Source',
    exportAsImage: 'Export as Image',

    // Findings
    findingsTitle: 'Defensive Findings & Exposure Risks',
    filterSeverityAll: 'All Severities',
    severityHigh: 'High Severity',
    severityMedium: 'Medium Severity',
    severityLow: 'Low Severity',
    severityInfo: 'Informational',
    evidence: 'Evidence',
    affectedEntities: 'Affected Entities',
    correlationReason: 'Correlation Logic',
    recommendation: 'Recommendation',
    status: 'Status',
    traceInGraph: 'Trace in Graph',

    // AI Analyst
    aiAnalystTitle: 'Gemini AI Cybersecurity Analyst',
    aiAnalystSubtitle:
      'Grounded explanation engine. Gemini only interprets verified evidence—never invents findings.',
    suggestedQuestions: 'Suggested Analyst Inquiries',
    q1: 'Why is this finding important?',
    q2: 'Explain this exposure simply.',
    q3: 'What information created this finding?',
    q4: 'What defensive action should be considered?',
    q5: 'Summarize the organization\'s exposure.',
    q6: 'தமிழில் விளக்கவும்.',
    observedDataSection: 'OBSERVED DATA',
    aiInterpretationSection: 'AI INTERPRETATION',
    defensiveRemediationSection: 'DEFENSIVE RECOMMENDATION',
    sendQuestion: 'Analyze with Gemini',
    inputPlaceholder: 'Ask the defensive analyst about relationships, exposures, or mitigations...',

    // Documents
    documentsTitle: 'Document Ingestion & Exposure Extractor',
    documentsSubtitle:
      'Analyze authorized publications (PDF, TXT, CSV) to extract entities and discover relationship links.',
    uploadButton: 'Upload Authorized Document',
    clearAnalysis: 'Clear Uploads',
    restoreDemoData: 'Reset Demo State',
    noDocsWarning: 'Ensure you possess written authorization before analyzing non-public documents.',

    // Reports
    reportsTitle: 'Defensive Security Report',
    generateReport: 'Generate Security Report',
    downloadPdf: 'Print / Save PDF Report',
    executiveSummary: 'Executive Exposure Briefing',
    scopeAndBoundaries: 'Scope & Authorized Boundaries',
    limitationsTitle: 'Methodology Limitations & Disclaimers',

    // Methodology
    methodologyTitle: 'CYBER MIRROR Methodology & Philosophy',
    whatItDoes: 'What CYBER MIRROR Does',
    whatItDoesNot: 'What CYBER MIRROR Does NOT Do',
    ethicalPledge: 'Defensive-Only Ethics & Zero-Intrusion Pledge',
  },

  ta: {
    appTitle: 'சைபர் மிரர் (CYBER MIRROR)',
    tagline: 'தாக்குபவர் பார்ப்பதற்கு முன் உங்களைப் பாருங்கள்.',
    subtitle:
      'பொதுவில் தெரியும் தகவல்கள் எவ்வாறு இணைகின்றன என்பதைப் புரிந்துகொண்டு, சாத்தியமான வெளிப்பாடுகளைக் கண்டறிந்து, உங்கள் பாதுகாப்பு நிலையை வலுப்படுத்துங்கள்.',
    launchDemo: 'மாதிரியைத் தொடங்கவும் (Launch Demo)',
    analyzeData: 'அங்கீகரிக்கப்பட்ட தரவை ஆய்வு செய்க',
    exploreAttackerView: 'தாக்குபவர் பார்வையை ஆராய்க',
    legalNotice:
      'அறிவிப்பு: இது முற்றிலும் தற்காப்பு வெளிப்பாடு விழிப்புணர்வு தளம் மட்டுமே. நீங்கள் சொந்தமாக வைத்துள்ள அல்லது அதிகாரப்பூர்வமாக அனுமதிக்கப்பட்ட சொத்துக்களை மட்டுமே ஆய்வு செய்ய வேண்டும்.',
    simulatedDataBadge: 'மாதிரி சோதனைத் தரவு (SIMULATED DEMO DATA)',
    demoOrgName: 'நோவாடெக் கல்லூரி (NovaTech College)',

    // Nav
    navOverview: 'முகப்பு',
    navDashboard: 'கட்டுப்பாட்டு அறை (Dashboard)',
    navExposureMap: 'டிஜிட்டல் வெளிப்பாடு வரைபடம்',
    navAttackerView: 'தாக்குபவர் பார்வை (Attacker View)',
    navFindings: 'கண்டறிதல்கள் (Findings)',
    navDocuments: 'ஆவணங்கள் (Documents)',
    navAIAnalyst: 'செயற்கை நுண்ணறிவு ஆய்வாளர் (AI Analyst)',
    navReports: 'அறிக்கைகள் (Reports)',
    navMethodology: 'முறைமை (Methodology)',
    startGuidedTour: 'வழிகாட்டப்பட்ட மாதிரி உலா',

    // Dashboard
    scoreTitle: 'வெளிப்பாடு விழிப்புணர்வு மதிப்பீடு',
    scoreDisclaimer: 'இது விழிப்புணர்வுக்கான ஒரு அளவீடு மட்டுமே — முறையான சான்றிதழ் அல்ல.',
    publicInfoCount: 'பொதுத் தகவல்கள்',
    peopleCount: 'முக்கிய நபர்கள்',
    documentCount: 'வெளியிடப்பட்ட ஆவணங்கள்',
    technologyCount: 'தொழில்நுட்ப அடுக்குகள்',
    relationshipCount: 'தொடர்பு இணைப்புகள்',
    potentialFindings: 'சாத்தியமான அபாயங்கள்',
    categoryBreakdown: 'பிரிவு வாரியாக வெளிப்பாடு',
    severityBreakdown: 'தீவிரத்தின் அடிப்படையில் கண்டறிதல்கள்',
    sourceDistribution: 'தகவல் மூலங்களின் பரவல்',

    // Attacker View
    attackerViewTitle: 'தாக்குபவர் பார்வை (Attacker View)',
    attackerViewSubtitle:
      'இந்த தகவல்கள் தனித்தனியாக சாதாரணமாகத் தோன்றலாம். ஆனால் இவை ஒன்றுடன் ஒன்று இணைக்கப்படும்போது நிறுவனத்தைப் பற்றிய கூடுதல் தகவல்கள் வெளிப்படலாம்.',
    greenLegend: 'சாதாரண பொதுத் தகவல் (தனிமையில் குறைந்த ஆபத்து)',
    yellowLegend: 'இணைக்கப்படும்போது கூடுதல் பொருள் தரும் தகவல்',
    redLegend: 'பாதுகாப்புக்கு அச்சுறுத்தலாக அமையக்கூடிய கூட்டு வெளிப்பாடு',
    enterAttackerView: 'தாக்குபவர் பார்வையைத் திறக்கவும்',
    exitAttackerView: 'தாக்குபவர் பார்வையிலிருந்து வெளியேறு',
    harmlessAloneMessage:
      'பொதுத் தகவல் + உறவுகள் + தொடர்புபடுத்துதல் + AI விளக்கம் = டிஜிட்டல் வெளிப்பாடு வரைபடம்',

    // Exposure Map
    mapTitle: 'டிஜிட்டல் வெளிப்பாடு வரைபடம்',
    searchNodes: 'உருப்படிகளைத் தேடுங்கள் (எ.கா. Vance, IT, S3, Moodle)...',
    filterAll: 'அனைத்து தகவல்களும்',
    filterPeople: 'நபர்கள்',
    filterTech: 'தொழில்நுட்பங்கள்',
    filterDocs: 'ஆவணங்கள்',
    filterExposures: 'வெளிப்பாடுகள்',
    resetGraph: 'வரைபடத்தை மீட்டமை',
    fitToScreen: 'முழுத் திரை பார்வை',
    zoomIn: 'பெரிதாக்கு',
    zoomOut: 'சிறிதாக்கு',
    nodeDetails: 'உருப்படி விவரங்கள்',
    whyItMatters: 'இது ஏன் முக்கியமானது?',
    potentialExposure: 'சாத்தியமான அபாயம்',
    defensiveRecommendation: 'பாதுகாப்பு பரிந்துரை',
    relatedEntities: 'தொடர்புடைய நிறுவனங்கள் / தகவல்கள்',
    askAIAboutEntity: 'AI ஆய்வாளரிடம் கேட்க',
    observedSource: 'சரிபார்க்கப்பட்ட மூலம்',
    exportAsImage: 'படமாக ஏற்றுமதி',

    // Findings
    findingsTitle: 'பாதுகாப்பு கண்டறிதல்கள் மற்றும் வெளிப்பாடு அபாயங்கள்',
    filterSeverityAll: 'அனைத்து தீவிர நிலைகளும்',
    severityHigh: 'உயர் தீவிரம் (High)',
    severityMedium: 'நடுத்தர தீவிரம் (Medium)',
    severityLow: 'குறைந்த தீவிரம் (Low)',
    severityInfo: 'தகவல் மட்டும் (Informational)',
    evidence: 'ஆதாரம் (Evidence)',
    affectedEntities: 'பாதிக்கப்பட்ட உருப்படிகள்',
    correlationReason: 'தொடர்புபடுத்தும் காரணம் (Reasoning)',
    recommendation: 'பாதுகாப்பு பரிந்துரை',
    status: 'நிலை (Status)',
    traceInGraph: 'வரைபடத்தில் பார்க்க',

    // AI Analyst
    aiAnalystTitle: 'ஜெமினி AI தற்காப்பு ஆய்வாளர் (Gemini AI Analyst)',
    aiAnalystSubtitle:
      'உண்மையான ஆதாரங்களின் அடிப்படையில் மட்டுமே இயங்கும் நுண்ணறிவு அமைப்பு. ஒருபோதும் ஆதாரங்களை உருவாக்காது.',
    suggestedQuestions: 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
    q1: 'இந்த கண்டறிதல் ஏன் முக்கியமானது?',
    q2: 'இந்த வெளிப்பாட்டை எளிய தமிழில் விளக்கவும்.',
    q3: 'எந்தத் தகவல்கள் இந்த வெளிப்பாட்டை உருவாக்கியது?',
    q4: 'எடுக்க வேண்டிய பாதுகாப்பு நடவடிக்கைகள் என்ன?',
    q5: 'நிறுவனத்தின் ஒட்டுமொத்த வெளிப்பாட்டை சுருக்கமாகக் கூறுக.',
    q6: 'தமிழில் விரிவாக விளக்குக.',
    observedDataSection: 'கண்டறியப்பட்ட தரவு (OBSERVED DATA)',
    aiInterpretationSection: 'செயற்கை நுண்ணறிவு விளக்கம் (AI INTERPRETATION)',
    defensiveRemediationSection: 'பாதுகாப்பு பரிந்துரை (DEFENSIVE RECOMMENDATION)',
    sendQuestion: 'AI-யிடம் கேட்கவும்',
    inputPlaceholder: 'தொடர்புகள், அபாயங்கள் அல்லது தீர்வுகள் பற்றி கேளுங்கள்...',

    // Documents
    documentsTitle: 'ஆவண ஆய்வு மற்றும் வெளிப்பாடு பிரித்தெடுத்தல்',
    documentsSubtitle:
      'அங்கீகரிக்கப்பட்ட ஆவணங்களைப் பதிவேற்றி (PDF, TXT, CSV) தகவல்களைப் பிரித்தெடுத்து வரைபடத்தில் சேர்க்கவும்.',
    uploadButton: 'ஆவணத்தைப் பதிவேற்றவும்',
    clearAnalysis: 'பதிவேற்றங்களை நீக்கு',
    restoreDemoData: 'மாதிரி நிலைக்கு மீட்டமை',
    noDocsWarning: 'பொது அல்லாத ஆவணங்களை ஆய்வு செய்வதற்கு முன் எழுத்துப்பூர்வ அனுமதி இருப்பதை உறுதி செய்யவும்.',

    // Reports
    reportsTitle: 'தற்காப்பு பாதுகாப்பு அறிக்கை (Security Report)',
    generateReport: 'பாதுகாப்பு அறிக்கையை உருவாக்கு',
    downloadPdf: 'அறிக்கையை அச்சிடுக / PDF ஆக சேமிக்க',
    executiveSummary: 'நிர்வாக சுருக்கம் (Executive Summary)',
    scopeAndBoundaries: 'ஆய்வு எல்லை மற்றும் அங்கீகாரம்',
    limitationsTitle: 'முறைமை வரம்புகள் மற்றும் மறுப்புகள்',

    // Methodology
    methodologyTitle: 'சைபர் மிரர் முறைமை மற்றும் தத்துவம்',
    whatItDoes: 'சைபர் மிரர் என்ன செய்கிறது',
    whatItDoesNot: 'சைபர் மிரர் எதைச் செய்யாது',
    ethicalPledge: 'தற்காப்பு நெறிமுறை மற்றும் ஊடுருவலாற்ற உறுதிமொழி',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
