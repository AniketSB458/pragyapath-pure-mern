import express from 'express';

const router = express.Router();

// Heuristic fallback responses when GEMINI_API_KEY is not configured
function getFallbackReply(message, userProfile) {
  const q = (message || '').toLowerCase();
  const exam = userProfile?.targetExamId || 'upsc_cse';
  const name = userProfile?.name || 'Aspirant';

  if (q.includes('polity') || q.includes('article') || q.includes('constitution')) {
    return `Namaste ${name}! For Indian Polity, focus on Part III (Fundamental Rights, Articles 12-35), Part IV (DPSP), and Article 32 vs 226 writ jurisdictions. Revise Laxmikanth chapters on Parliament and Constitutional Bodies alongside previous 5 years' question papers.`;
  }
  if (q.includes('quant') || q.includes('math') || q.includes('aptitude') || q.includes('reasoning')) {
    return `Hello ${name}! For Quantitative Aptitude and CSAT/General Intelligence, master percentage-ratio-fraction equivalences first. Spend 20 minutes daily solving speed drills before attempting 2-minute mock problems.`;
  }
  if (q.includes('gate') || q.includes('cse') || q.includes('algorithm') || q.includes('data structure')) {
    return `Hello ${name}! For GATE CSE, core high-weightage areas include Data Structures & Algorithms, Operating Systems (Virtual Memory & Scheduling), and Computer Networks. Solve previous 10 years' GATE questions topic-wise.`;
  }
  if (q.includes('schedule') || q.includes('plan') || q.includes('time') || q.includes('strategy')) {
    const hours = userProfile?.dailyHours || 4;
    return `Based on your target of ${hours} hours per day, use a 50-10 Pomodoro rhythm: 2 hours for core subject concepts, 1 hour for active PYQ question practice, and 1 hour for quick revision and personal notes.`;
  }

  return `Namaste ${name}! As your Pragya mentor for ${userProfile?.targetGoal || 'competitive exams'}, I recommend breaking down your syllabus into weekly milestones. Focus on conceptual clarity first, followed by daily PYQ drills and weak topic reviews. What specific topic would you like to explore next?`;
}

// POST /api/mentor/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, userProfile } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message query is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no GEMINI_API_KEY configured, return intelligent heuristic response
    if (!apiKey || !apiKey.trim()) {
      const fallback = getFallbackReply(message, userProfile);
      return res.json({
        success: true,
        source: 'heuristic',
        reply: fallback
      });
    }

    // Call Google Gemini API
    const systemPrompt = `You are Pragya, a wise, supportive, and highly knowledgeable AI academic coach and exam mentor for Indian students in the PragyaPath portal.
Student Profile:
- Name: ${userProfile?.name || 'Student Aspirant'}
- Target Exam: ${userProfile?.targetGoal || 'National Competitive Exam'} (${userProfile?.targetExamId || 'general'})
- Education Stage: ${userProfile?.educationStage || 'Degree Aspirant'} (${userProfile?.degreeOrStream || ''})
- Daily Study Target: ${userProfile?.dailyHours || 4} hours
- Language Preference: ${userProfile?.language || 'en'}

Guidelines:
1. Provide accurate, encouraging, and structured advice for Indian competitive exams (UPSC, SSC, Banking, GATE, State PSC, Defence).
2. Format answers with clear bullet points, bold key terms, and actionable study recommendations.
3. Respond in the language preferred by the user (or match the language of their question).
4. Keep answers focused, practical, and under 250 words unless deep conceptual explanation is requested.`;

    const fullPrompt = `${systemPrompt}\n\nStudent Question: "${message}"`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.warn('Gemini API call failed, falling back:', errText);
      const fallback = getFallbackReply(message, userProfile);
      return res.json({
        success: true,
        source: 'heuristic_fallback',
        reply: fallback
      });
    }

    const data = await geminiRes.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (candidateText) {
      return res.json({
        success: true,
        source: 'gemini',
        reply: candidateText
      });
    }

    return res.json({
      success: true,
      source: 'heuristic',
      reply: getFallbackReply(message, userProfile)
    });
  } catch (error) {
    console.error('Error in /api/mentor/chat:', error);
    res.json({
      success: true,
      source: 'heuristic_recovery',
      reply: getFallbackReply(req.body?.message, req.body?.userProfile)
    });
  }
});

export default router;
