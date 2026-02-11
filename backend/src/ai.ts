import { GoogleGenAI } from "@google/genai";
import { GEMINI_KEY } from "./config.js";
import { text } from "node:stream/consumers";

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const SYSTEM_PROMPT = `
You are an expert frontend developer.

Always respond ONLY with valid JSON.

The JSON format must be:
{
  "files": {
    "/App.tsx": "...",
    "/index.tsx": "..."
  }
}

Rules:
- No markdown
- No explanations
- No backticks
- Only JSON
- Ensure code is complete and runnable
`;

async function generateResponse(userQuery: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: userQuery }],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
    },
  });

  const raw = response.text ?? "";

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error("Invalid JSON from model:", raw);
    throw new Error("Model did not return valid JSON");
  }
}

export default generateResponse;
