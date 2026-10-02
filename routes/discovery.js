import express from 'express';

const router = express.Router();

// POST /api/discovery/recommend - AI-driven career matching
router.post('/recommend', async (req, res) => {
  try {
    const { stream = '', interests = '', workStyle = '', targetSector = '' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim()) {
      try {
        const prompt = `Act as an expert Indian Career and Competitive Exam Navigator.
Based on the student's profile:
- Academic Stream: ${stream}
- Core Interests: ${interests}
- Preferred Work Style: ${workStyle}
- Target Sector: ${targetSector}

Recommend 3 highly suited Indian career pathways (civil services, engineering/tech, banking, research, defence).
Return ONLY a valid JSON object matching this schema (no markdown formatting, raw JSON):
{
  "recommendations": [
    {
      "title": "Job Title / Role",
      "matchScore": 95,
      "rationale": "Clear 2-sentence rationale why this suits the student.",
      "sector": "Sector Name",
      "avgSalary": "Salary range or Pay Level (e.g. Pay Level 10 / 12-18 LPA)",
      "entryExam": "Name of competitive exam or selection route",
      "coreSkills": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ]
}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
              return res.json({ success: true, recommendations: parsed.recommendations, source: 'gemini' });
            }
          }
        }
      } catch (err) {
        console.warn('Gemini discovery fallback:', err.message);
      }
    }

    // High-Fidelity Heuristic Recommendations
    const s = (stream + ' ' + interests + ' ' + targetSector).toLowerCase();
    let recommendations = [];

    if (s.includes('tech') || s.includes('computer') || s.includes('code') || s.includes('ai') || s.includes('software')) {
      recommendations = [
        {
          title: 'PSU Tech Officer / Scientist (ISRO, DRDO, NIC)',
          matchScore: 96,
          rationale: 'Perfect alignment with computer science and engineering problem-solving. Offers prestigious public R&D leadership with Gazetted scientific rank.',
          sector: 'Engineering & Deep Tech',
          avgSalary: 'Pay Level 10 (₹80,000 - ₹1,25,000/mo) + Quarters',
          entryExam: 'GATE CSE / ISRO ICRB / NIC Scientist B',
          coreSkills: ['Algorithms', 'System Design', 'Cyber Architecture', 'Python/C++']
        },
        {
          title: 'UPSC Indian Administrative Service (IAS / IPS)',
          matchScore: 89,
          rationale: 'Analytical engineering mindset offers significant advantages in CSAT and logical decision-making for district administration and national policymaking.',
          sector: 'Public Administration',
          avgSalary: 'Level 10 (Apex Cabinet Secretary Level 17)',
          entryExam: 'UPSC Civil Services Examination (CSE)',
          coreSkills: ['Public Governance', 'Constitutional Law', 'Crisis Leadership', 'Policy Drafting']
        },
        {
          title: 'Assistant Central Intelligence Officer (IB ACIO Tech)',
          matchScore: 85,
          rationale: 'Demands tactical intelligence, signals analysis, and cyber forensics for national sovereign security operations.',
          sector: 'National Security & Defense',
          avgSalary: 'Pay Level 7 (₹65,000 - ₹90,000/mo)',
          entryExam: 'IB ACIO Examination / MHA Tech Board',
          coreSkills: ['Cyber Threat Intel', 'Cryptography', 'Data Analytics', 'Strategic Reasoning']
        }
      ];
    } else {
      recommendations = [
        {
          title: 'Civil Services Officer (IAS / IPS / IRS)',
          matchScore: 94,
          rationale: 'Highest impact leadership pathway in Indian governance. Suits aspirants seeking societal transformation and large-scale administrative execution.',
          sector: 'Central & State Administration',
          avgSalary: 'Pay Level 10 Entry (Gazetted Central Service)',
          entryExam: 'UPSC Civil Services Examination (CSE)',
          coreSkills: ['Indian Polity', 'Ethics & Integrity', 'Societal Awareness', 'Administrative Law']
        },
        {
          title: 'Reserve Bank of India (RBI) Grade B Officer',
          matchScore: 91,
          rationale: 'Elite macroeconomic and monetary regulatory career. Commands stellar prestige, excellent work-life balance, and pivotal financial policy exposure.',
          sector: 'Central Banking & Financial Regulation',
          avgSalary: 'CTC ₹28 - 32 LPA (including Mumbai allowances)',
          entryExam: 'RBI Grade B Phase I & II (Economic & Social Issues)',
          coreSkills: ['Macroeconomics', 'Financial Management', 'Quantitative Analysis', 'Policy Synthesis']
        },
        {
          title: 'SSC CGL Assistant Section Officer (CSS / MEA)',
          matchScore: 88,
          rationale: 'Core administrative backbone in Central Ministries and External Affairs. Fast-track promotions and permanent posting in national capital.',
          sector: 'Central Ministries',
          avgSalary: 'Pay Level 7 (₹65,000 - ₹85,000/mo)',
          entryExam: 'Staff Selection Commission (SSC CGL)',
          coreSkills: ['Quantitative Aptitude', 'General Intelligence', 'Constitutional Governance', 'Office Procedure']
        }
      ];
    }

    res.json({ success: true, recommendations, source: 'heuristic' });
  } catch (error) {
    console.error('Error in /api/discovery/recommend:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
