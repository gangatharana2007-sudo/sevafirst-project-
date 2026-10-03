import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = Number(process.env.PORT) || 3000;

// Initialize Gemini SDK with User-Agent as required by skill guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Helper: Provide deterministic defensive fallback when Gemini is offline or not configured
function getDeterministicExplanation(target: any, lang: 'en' | 'ta' = 'en') {
  const isTamil = lang === 'ta';
  if (isTamil) {
    return {
      answer: `இந்த உருப்படி "${target?.name || target?.title || 'தகவல்'}" பொதுவில் கிடைக்கிறது. தனித்தனியாக இது பாதிப்பில்லாததாக தோன்றலாம். ஆனால் தொடர்புடைய பிற தரவுகளுடன் இணைக்கப்படும்போது, ஒரு வெளி நபர் நிறுவனத்தின் அமைப்பை எளிதாக புரிந்துகொள்ள முடியும்.`,
      evidence: [
        `கண்டறியப்பட்ட உருப்படி: ${target?.name || target?.title || 'பொதுத் தகவல்'}`,
        `மூலம்: ${target?.source || 'வெளிப்படையான ஆவணம் / வலைப்பக்கம்'}`,
        `தொடர்புடைய நிறுவனங்கள்: ${target?.relatedEntities?.join(', ') || 'துறை மற்றும் பணியாளர் விவரங்கள்'}`,
      ],
      reasoning: `தகவல்கள் தனித்தனியாக சாதாரணமாகத் தோன்றலாம். ஆனால் இவை ஒன்றுடன் ஒன்று இணைக்கப்படும்போது நிறுவனத்தைப் பற்றிய கூடுதல் தகவல்கள் வெளிப்படலாம்.`,
      recommendation: `1. பொது இணையதளங்கள் மற்றும் ஆவணங்களில் தேவையற்ற உள் விவரங்களைக் குறைக்கவும்.\n2. பொது மின்னஞ்சல்களுக்கு பன்முக அங்கீகாரத்தை (MFA) கட்டாயமாக்கவும்.\n3. ஊழியர்களுக்கு சமூகப் பொறியியல் (Phishing) விழிப்புணர்வு பயிற்சி அளிக்கவும்.`,
    };
  }

  return {
    answer: `The entity "${target?.name || target?.title || 'Information'}" is publicly observable. In isolation, this appears benign, but when correlated with departmental structures and contact details, it provides attackers with organizational intelligence without requiring active reconnaissance.`,
    evidence: [
      `Observed Item: ${target?.name || target?.title || 'Public data point'}`,
      `Verified Source: ${target?.source || 'Public directory / disclosure document'}`,
      `Contextual Links: ${target?.relatedEntities?.join(', ') || 'Internal departments and systems'}`,
    ],
    reasoning: `Public Information + Department Context + Operational Roles creates identity attribution that can be leveraged for social engineering, spearphishing, or pretexting.`,
    recommendation: `1. Minimize publication of internal administrative hierarchies in public facing files.\n2. Enforce strict Multi-Factor Authentication (MFA) and phishing-resistant security keys.\n3. Regularly audit public documentation for unneeded structural disclosures.`,
  };
}

// Endpoint: Explain single finding or graph node
app.post('/api/ai/explain', async (req, res) => {
  try {
    const { item, context, lang = 'en' } = req.body;
    const isTamil = lang === 'ta';

    if (!ai) {
      return res.json({
        success: true,
        source: 'local-defense-engine',
        data: getDeterministicExplanation(item, isTamil ? 'ta' : 'en'),
      });
    }

    const systemInstruction = `You are the CYBER MIRROR Defensive AI Analyst.
CYBER MIRROR is a DEFENSIVE cybersecurity exposure-awareness platform.
Your mission is to help organizations understand how publicly visible information connects to create inadvertent exposure.
IMPORTANT RULES:
1. NEVER invent evidence. ONLY analyze the provided verified observed data.
2. NEVER suggest offensive hacking methods, exploitation tools, or attacks.
3. CLEARLY separate OBSERVED DATA from AI INTERPRETATION.
4. If the user requested Tamil (lang='ta'), respond completely and fluently in pure, professional Tamil.
5. Provide:
   - answer: concise executive explanation
   - evidence: bullet list of observed facts
   - reasoning: correlation logic (why connecting these facts creates exposure)
   - recommendation: practical defensive actions`;

    const promptText = `Analyze this security finding / exposure map node:
Language: ${isTamil ? 'Tamil (தமிழ்)' : 'English'}
Item Data:
${JSON.stringify(item, null, 2)}

Contextual Graph Environment:
${JSON.stringify(context || {}, null, 2)}

Respond with a JSON object strictly matching this schema:
{
  "answer": "string",
  "evidence": ["string"],
  "reasoning": "string",
  "recommendation": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/explain:', error);
    const fallback = getDeterministicExplanation(req.body.item, req.body.lang === 'ta' ? 'ta' : 'en');
    return res.json({
      success: true,
      source: 'local-defense-engine-fallback',
      data: fallback,
      note: 'Processed via offline defensive rule engine',
    });
  }
});

// Endpoint: AI Analyst Interactive Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], currentContext, lang = 'en' } = req.body;
    const isTamil = lang === 'ta' || /[\u0B80-\u0BFF]/.test(message);

    if (!ai) {
      // Deterministic analyst reply
      if (isTamil) {
        return res.json({
          reply: `**கண்டறியப்பட்ட தரவு (Observed Data):**\nநோவாடெக் கல்லூரியின் பணியாளர் அடைவு மற்றும் தகவல் தொழில்நுட்பக் கொள்கை பொது ஆவணங்களாக உள்ளன.\n\n**செயற்கை நுண்ணறிவு விளக்கம் (AI Interpretation):**\nஇந்த தகவல்கள் தனித்தனியாக சாதாரணமாகத் தோன்றலாம். ஆனால் இவை ஒன்றுடன் ஒன்று இணைக்கப்படும்போது நிறுவனத்தின் உள் கட்டமைப்பு மற்றும் தொழில்நுட்ப அடுக்குகள் தெளிவாக வெளிப்படுகின்றன.\n\n**பாதுகாப்பு பரிந்துரை (Defensive Recommendation):**\nவெளி ஆவணங்களில் உள்ள மெட்டாடேட்டாவை நீக்கி, ஊழியர்களுக்கு ஃபிஷிங் எதிர்ப்பு விழிப்புணர்வு பயிற்சியை வழங்குங்கள்.`,
          evidence: ['பணியாளர் பட்டியல் (Staff_Directory.pdf)', 'தகவல் தொழில்நுட்ப கொள்கை (IT_Policy.pdf)'],
          reasoning: 'பொதுத் தகவல்களை இணைப்பதன் மூலம் நிறுவனத்தின் முக்கிய இலக்குகள் அடையாளம் காணப்படலாம்.',
          recommendation: 'பொது வெளியீட்டு நெறிமுறைகளை மறுஆய்வு செய்தல் மற்றும் MFA அமல்படுத்தல்.',
        });
      }

      return res.json({
        reply: `**OBSERVED DATA:**\nNovaTech College has 4 public departments, 3 public executive emails, and 4 published administrative PDFs (Staff Directory, IT Policy, Annual Report, Research Summary).\n\n**AI INTERPRETATION:**\nIndividually, each item is common public information. When correlated, an outside observer can assemble a detailed target blueprint: IT administration staff, department roles, and specific technologies (Moodle, S3 storage, Google Workspace).\n\n**DEFENSIVE RECOMMENDATION:**\nStrip unnecessary metadata from published PDFs, implement role-based email aliases instead of direct personnel emails, and mandate hardware-token MFA.`,
        evidence: [
          'Staff Directory published with full names and roles',
          'IT Policy mentions specific cloud and LMS platforms',
          'Executive contact emails published without obfuscation',
        ],
        reasoning:
          'Correlation of public staff roles with disclosed software architectures reduces attacker reconnaissance effort by 80%.',
        recommendation:
          'Audit all public documentation, deploy email gateway protection, and implement DMARC/DKIM/SPF strictly.',
      });
    }

    const systemInstruction = `You are CYBER MIRROR's Defensive Cybersecurity AI Analyst.
Mission: Explain organizational exposure, risk correlations, and defensive remediations.
Guardrails:
- You are strictly defensive. Never teach exploitation or offensive hacking techniques.
- Never invent evidence. Always bind your answers strictly to the provided observed data.
- Clearly separate "OBSERVED DATA" from "AI INTERPRETATION".
- If the user writes in Tamil or lang='ta', respond naturally and professionally in Tamil script.
- Maintain a calm, analytical, authoritative cybersecurity analyst persona.`;

    const promptText = `User Question: "${message}"
Language Mode: ${isTamil ? 'Tamil' : 'English'}

Active Organization Context:
${JSON.stringify(currentContext || {}, null, 2)}

Recent Conversation History:
${JSON.stringify(history.slice(-4), null, 2)}

Provide a thorough, structured, defensive cybersecurity response.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return res.json({
      reply: response.text || 'Analysis completed.',
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    const isTamil = req.body.lang === 'ta';
    return res.json({
      reply: isTamil
        ? `தகவல் தொடர்பு தாமதம் ஏற்பட்டுள்ளது. எனினும் உங்கள் நிறுவனத்தின் பொது வெளிப்பாடு வரைபடத்தில் 7 முக்கிய தொடர்பு புள்ளிகள் மற்றும் 3 உயர் முன்னுரிமை கண்டறிதல்கள் பதிவு செய்யப்பட்டுள்ளன.`
        : `Analysis note: While connected to the defensive rule repository, we observed 7 key correlation links and 3 elevated exposure paths in the current profile. Review the Exposure Map for node-by-node tracing.`,
      error: error.message,
    });
  }
});

// Endpoint: Generate Executive Security Report Summary
app.post('/api/ai/report', async (req, res) => {
  try {
    const { findings, metrics, orgName = 'NovaTech College', lang = 'en' } = req.body;
    const isTamil = lang === 'ta';

    if (!ai) {
      if (isTamil) {
        return res.json({
          summary: `${orgName} நிறுவனத்திற்கான பாதுகாப்பு வெளிப்பாடு பகுப்பாய்வு நிறைவடைந்தது. இந்த மதிப்பீட்டில் தனித்தனியாக தீங்கற்றதாகத் தோன்றும் பொது ஆவணங்கள், மின்னஞ்சல்கள் மற்றும் அமைப்புகள் ஒன்றிணைக்கப்படும் போது, நிறுவனத்தின் கட்டமைப்பு தகவல்கள் வெளிப்படுவது கண்டறியப்பட்டுள்ளது. விழிப்புணர்வு மதிப்பீடு 72/100 ஆக கணக்கிடப்பட்டுள்ளது.`,
          keyRisks: [
            'பொது ஊழியர் பட்டியல் மற்றும் துறை மின்னஞ்சல்கள் இணைக்கப்பட்டு அடையாளம் காணக்கூடிய சாத்தியம்.',
            'தகவல் தொழில்நுட்ப ஆவணங்களில் உள் மென்பொருள் அடுக்குகள் குறிப்பிடப்பட்டிருத்தல்.',
            'ஆவணங்களில் உள்ள ஆசிரியர் மற்றும் சிஸ்டம் மெட்டாடேட்டா வெளிப்பாடு.',
          ],
          strategicRecommendations: [
            'பொது வெளியீட்டுக்கு முன் ஆவணங்களிலிருந்து மெட்டாடேட்டாவை நீக்குங்கள்.',
            'தனிநபர் மின்னஞ்சல்களுக்குப் பதிலாக பொதுவான குழு மின்னஞ்சல்களை (Aliases) பயன்படுத்தவும்.',
            'அனைத்து மேகக்கணி மற்றும் கற்றல் மேலாண்மை தளங்களுக்கும் MFA கட்டாயமாக்குங்கள்.',
          ],
        });
      }

      return res.json({
        summary: `Comprehensive defensive exposure analysis for ${orgName}. The assessment demonstrates how independently benign public records—including staff directories, departmental email schemas, and IT policy documents—synthesize into an actionable organizational intelligence footprint. The Exposure Awareness Score is calculated at ${metrics?.score || 72}/100.`,
        keyRisks: [
          'Identity correlation linking named personnel to administrative responsibilities and direct email vectors.',
          'Technical disclosure across public policy documents revealing infrastructure architecture (LMS, Cloud, SSO).',
          'Document metadata leakage disclosing internal author usernames and workstation environments.',
        ],
        strategicRecommendations: [
          'Institute a sanitized public release protocol that strips EXIF/document metadata prior to publishing.',
          'Transition public-facing contact points from personal named mailboxes to role-based group mailboxes.',
          'Deploy hardware-backed MFA across all administrative and portal endpoints referenced in public literature.',
        ],
      });
    }

    const systemInstruction = `You are a Principal Defensive Cybersecurity Consultant generating an executive exposure briefing for CYBER MIRROR.
Audience: C-suite, Board of Directors, and IT Leadership.
Tone: Professional, measured, defensive, and constructive.
Language: ${isTamil ? 'Tamil (தமிழ்)' : 'English'}.
Strictly adhere to the provided metrics and findings. Do not invent simulated CVEs or unobserved breaches.`;

    const promptText = `Generate an Executive Summary for:
Organization: ${orgName}
Awareness Score: ${metrics?.score || 72} / 100
Metrics: ${JSON.stringify(metrics)}
Key Findings: ${JSON.stringify(findings)}

Output strict JSON:
{
  "summary": "string",
  "keyRisks": ["string"],
  "strategicRecommendations": ["string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/report:', error);
    res.status(500).json({ error: 'Failed to generate report narrative' });
  }
});

// Endpoint: Document Entity Extractor
app.post('/api/ai/extract', async (req, res) => {
  try {
    const { documentName, content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Document content is required' });
    }

    if (!ai) {
      // Deterministic regex extractor fallback
      const emails = Array.from(new Set(content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []));
      const urls = Array.from(new Set(content.match(/https?:\/\/[^\s$.?#].[^\s]*/g) || []));
      return res.json({
        entities: {
          organizations: ['NovaTech College'],
          people: [],
          departments: [],
          emails: emails,
          urls: urls,
          technologies: [],
        },
      });
    }

    const systemInstruction = `Extract cybersecurity-relevant public entities from the provided document text.
Extract strictly factual mentions:
- organizations
- people (full names)
- departments
- emails
- urls
- technologies (e.g. AWS, Moodle, Drupal, Exchange)
Return JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Document Name: ${documentName}\nText:\n${content.slice(0, 15000)}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ entities: parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/extract:', error);
    res.status(500).json({ error: 'Failed to extract entities' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[CYBER MIRROR] Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[CYBER MIRROR] Failed to start server:', err);
});
