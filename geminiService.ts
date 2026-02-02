
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SUPPORT_DB = "https://visiononesupportbot-default-rtdb.europe-west1.firebasedatabase.app/";

export const getAIHelp = async (userPrompt: string, history: any[] = []) => {
  try {
    // Dynamische Instruktionen aus DB laden (simuliert oder via Fetch)
    let dynamicContext = "";
    try {
      const configRes = await fetch(`${SUPPORT_DB}config/bot_knowledge.json`);
      const configData = await configRes.json();
      if (configData) dynamicContext = configData;
    } catch (e) {
      console.warn("Using fallback knowledge");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Du bist der VONE Support Assistent. 
        ZUSÄTZLICHES WISSEN: ${dynamicContext}
        PAKET-INFOS: Starter (40€), Performance (80€), Yearly Premium (120€, kein 4K), Diamond (200€, inkl. 4K, 2 Geräte), Black VIP (300€, 4 Geräte).
        Regeln: Antworte professionell, präzise und auf Deutsch.`,
      }
    });
    return response.text || "Entschuldigung, ich konnte keine Antwort generieren.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "KI-Support derzeit nicht erreichbar.";
  }
};

/**
 * Wandelt rohen Mitarbeiter-Text in eine freundliche Kunden-Nachricht um.
 */
export const makeFriendly = async (rawText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Wandle diesen rohen Text eines Support-Mitarbeiters in eine extrem freundliche, professionelle und hilfsbereite Nachricht für den Kunden um: "${rawText}"`,
      config: {
        systemInstruction: "Du bist ein Ghostwriter für Support-Mitarbeiter. Dein Ziel ist es, Zeit zu sparen und Kunden glücklich zu machen.",
      }
    });
    return response.text || rawText;
  } catch (error) {
    return rawText;
  }
};
