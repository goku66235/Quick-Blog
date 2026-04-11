import { generateAIContent } from "../configs/gemini.js";

export const generateBlogAI = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title) {
      return res.json({ success: false, message: "Title required" });
    }

    // ✅ IMPROVED PROMPT (VERY IMPORTANT)
    const prompt = `
Write a detailed blog post.

Title: ${title}
Category: ${category}

Rules:
- Return ONLY clean HTML (NO markdown, NO \`\`\`html blocks)
- Do NOT include empty tags like <p></p>
- Use proper structure: <h1>, <h2>, <p>, <ul>, <li>
- Make it engaging, human-like and well formatted
- Keep paragraphs meaningful (not empty)
`;

    const content = await generateAIContent(prompt);

    return res.json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.json({
      success: false,
      message: "AI generation failed",
    });
  }
};