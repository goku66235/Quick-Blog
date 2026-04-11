import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ✅ CLEAN FUNCTION (CRITICAL FIX)
const cleanHTML = (html) => {
  return html
    .replace(/```html|```/g, "")       // remove markdown blocks
    .replace(/<p>\s*<\/p>/g, "")       // remove empty <p>
    .replace(/<br\s*\/?>/g, "")        // remove <br>
    .replace(/\n/g, "")                // remove new lines
    .replace(/\s+/g, " ")              // normalize spaces
    .trim();
};

export const generateAIContent = async (prompt) => {
  let attempts = 3;

  while (attempts > 0) {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const raw = result.text || "";

      // ✅ CLEAN BEFORE RETURN
      const cleaned = cleanHTML(raw);

      return cleaned;

    } catch (error) {
      console.error("Gemini Error:", error.message);

      if (error.status === 503) {
        attempts--;
        await delay(1500);
        continue;
      }

      break;
    }
  }

  // ✅ CLEAN FALLBACK
  return `
    <h1>AI is busy right now</h1>
    <p>Please try again in a few seconds.</p>
    <ul>
      <li>Server is under heavy load</li>
      <li>This is temporary</li>
      <li>Your system is working fine ✅</li>
    </ul>
  `;
};