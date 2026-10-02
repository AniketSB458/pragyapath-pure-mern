import express from 'express';

const router = express.Router();

// POST /api/explain/concept - Explain complex concepts in Hindi or Marathi
router.post('/concept', async (req, res) => {
  try {
    const { topic = 'Indian Polity', language = 'hi' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const targetLangName = language === 'mr' ? 'Marathi (मराठी)' : 'Hindi (हिन्दी)';

    if (apiKey && apiKey.trim()) {
      try {
        const prompt = `Explain the competitive exam concept: "${topic}" in clear, simple, and encouraging ${targetLangName}.
Requirements:
1. Explain in simple, crystal-clear everyday conversational tone that an Indian student easily grasps.
2. Give 1 practical real-world analogy.
3. List 3 key high-yield exam takeaways (bullet points with bold terms).
4. Keep the entire explanation between 120 and 180 words.
Write directly in ${targetLangName} script.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 350, temperature: 0.7 }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return res.json({ success: true, explanation: candidateText, source: 'gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini concept explain fallback:', err.message);
      }
    }

    // High-Fidelity Multilingual Heuristic Concept Explanations
    let explanation = '';
    const t = topic.toLowerCase();

    if (language === 'mr') {
      if (t.includes('polity') || t.includes('writ') || t.includes('art') || t.includes('right')) {
        explanation = `**${topic} - सोप्या भाषेत स्पष्टीकरण (मराठी):**

भारतीय संविधानातील मूलभूत हक्क (भाग ३, कलमे १२ ते ३५) हे नागरिकांच्या स्वातंत्र्याची ढाल आहेत. 
• **सुलभ उदाहरण:** जसे क्रिकेटमध्ये थर्ड अंपायर असतो, तसेच सर्वोच्च न्यायालय (कलम ३२) आणि उच्च न्यायालय (कलम २२६) मूलभूत हक्कांचे रक्षक आहेत.
• **मुख्य मुद्दे:**
1. **कलम ३२:** स्वतः एक मूलभूत हक्क आहे, ज्याला डॉ. आंबेडकरांनी संविधानाचा 'आत्मा' म्हटले.
2. **कलम २२६:** उच्च न्यायालयांचे अधिकारक्षेत्र अधिक व्यापक आहे (मूलभूत हक्क + इतर कायदेशीर हक्क).
3. **पाच रिट्स:** बंदीप्रत्यक्षीकरण (Habeas Corpus), परमादेश (Mandamus), प्रतिषेध (Prohibition), उत्प्रेषण (Certiorari), आणि अधिकारपृच्छा (Quo-Warranto).`;
      } else if (t.includes('quant') || t.includes('percent') || t.includes('ratio')) {
        explanation = `**${topic} - सोप्या भाषेत स्पष्टीकरण (मराठी):**

अंकगणित आणि क्वांटिटेटिव्ह अ‍ॅप्टिट्यूडमध्ये वेळेची बचत करणे हाच यशाचा पाया आहे.
• **सुलभ युक्ती:** नेहमी टक्केवारीचे अपूर्णांकात रूपांतर करा. उदा. २५% = १/४, २०% = १/५, १६.६६% = १/६.
• **परीक्षेसाठी महत्त्वाचे नियम:**
1. किंमत २५% वाढल्यास, खर्च समान ठेवण्यासाठी खप २०% कमी करावा लागतो: [R / (100 + R)] * 100.
2. नफा आणि तोटा नेहमी खरेदी किमतीवर (Cost Price) काढला जातो.
3. रोज २० मिनिटे सूत्रे न वापरता मानसिक आकडेमोड (Mental Math) सराव करा.`;
      } else {
        explanation = `**${topic} - अभ्यास संकल्पना स्पष्टीकरण (मराठी):**

स्पर्धा परीक्षेच्या दृष्टिकोनातून "${topic}" हा एक अत्यंत महत्त्वाचा घटक आहे.
• **सोपी पद्धत:** कोणताही मोठा विषय लहान लहान संकल्पनांमध्ये विभागा आणि आधी मागील वर्षांचे प्रश्न (PYQs) तपासा.
• **परीक्षेसाठी टिप्स:**
1. मूळ संकल्पना समजून घेतल्याशिवाय पाठांतर करू नका.
2. स्वतःच्या भाषेत २ ते ३ ओळींच्या संक्षिप्त नोट्स तयार करा.
3. आठवड्यातून एकदा नियमित उजळणी (Revision) करा.`;
      }
    } else {
      // Hindi Default
      if (t.includes('polity') || t.includes('writ') || t.includes('art') || t.includes('right')) {
        explanation = `**${topic} - सरल भाषा में समझें (हिन्दी):**

भारतीय संविधान के भाग III (अनुच्छेद 12-35) नागरिकों को मौलिक अधिकार प्रदान करते हैं।
• **सरल उदाहरण:** जिस तरह खेल में अंपायर निष्पक्षता सुनिश्चित करता है, उसी तरह सुप्रीम कोर्ट (अनुच्छेद 32) और हाई कोर्ट (अनुच्छेद 226) हमारे अधिकारों के सर्वोच्च संरक्षक हैं।
• **परीक्षा उपयोगी मुख्य बिंदु:**
1. **अनुच्छेद 32:** डॉ. बी.आर. अंबेडकर ने इसे "संविधान का हृदय और आत्मा" कहा था।
2. **अनुच्छेद 226:** उच्च न्यायालयों का रिट अधिकार क्षेत्र उच्चतम न्यायालय से अधिक व्यापक है।
3. **5 प्रकार की रिटें:** बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, और अधिकार पृच्छा।`;
      } else if (t.includes('quant') || t.includes('percent') || t.includes('ratio')) {
        explanation = `**${topic} - सरल भाषा में समझें (हिन्दी):**

क्वांटिटेटिव एप्टीट्यूड में फॉर्मूले रटने से बेहतर है कि आप अनुपात (Ratio) और प्रतिशत (Percentage) का संबंध समझें।
• **शॉर्टकट ट्रिक:** प्रतिशत को हमेशा भिन्न (Fraction) में बदलें। जैसे 25% = 1/4, 20% = 1/5, 12.5% = 1/8.
• **मुख्य सूत्र:**
1. यदि किसी वस्तु की कीमत R% बढ़ती है, तो खर्च स्थिर रखने के लिए खपत में [R / (100 + R)] * 100% की कमी करनी होगी।
2. क्रमागत छूट (Successive Discount) के लिए सूत्र: d1 + d2 - (d1 * d2 / 100).
3. रोज 15 मिनट गति अभ्यास (Speed Drill) अवश्य करें।`;
      } else {
        explanation = `**${topic} - अवधारणा स्पष्टीकरण (हिन्दी):**

प्रतियोगी परीक्षा के पाठ्यक्रम में "${topic}" एक उच्च अंकदायी विषय है।
• **अध्ययन रणनीति:** पहले बुनियादी अवधारणा स्पष्ट करें, फिर पिछले वर्षों के प्रश्नपत्रों (PYQs) को हल करें।
• **सफलता के सूत्र:**
1. अवधारणा को अपनी भाषा में समझने के बाद ही हल करने का प्रयास करें।
2. गलत विकल्पों के कारणों को पहचानें ताकि निगेटिव मार्किंग से बच सकें।
3. 24 घंटे के भीतर 1 बार त्वरित पुनरावृत्ति (Revision) अवश्य करें।`;
      }
    }

    res.json({ success: true, explanation, source: 'heuristic' });
  } catch (error) {
    console.error('Error in /api/explain/concept:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
