import express from "express";
import axios from "axios";

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message requis" });
  }

  try {
    // 💡 FIXED: Changed 'gemini-pro' to 'gemini-2.5-flash' in the URL
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
Tu es un assistant IA officiel de Meta Meca Industries (Tunisie).

RÈGLES:
- Réponds toujours en français
- Style: professionnel, court, commercial
- Ne parle que de Meta Meca (menuiserie, métal, fabrication, devis)
- Si question hors sujet → ramène vers les services Meta Meca
- Propose toujours de demander un devis

INFOS ENTREPRISE:
- Menuiserie sur mesure
- Fabrication métallique
- Design intérieur
- Installation en Tunisie
- WhatsApp: +21694703066

QUESTION CLIENT:
${message}
                `
              }
            ]
          }
        ]
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erreur Gemini API" });
  }
});

export default router;