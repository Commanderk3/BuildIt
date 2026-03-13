import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GEMINI_KEY } from "../config.js";
import { BUILDER_AGENT_PROMPT } from "../constants/prompts.js";

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

// add dependecy field as well - TODO: make a function which will take input dependency names and generate package.json file
const builderAgentSchema = z.object({
  files: z
    .record(z.string())
    .describe(
      "Object where keys are file paths (e.g. /App.tsx) and values are the complete file contents",
    ),
});

async function invokeBuilderAgent(plans: string) {
  try {
    console.log("Builder agent called with plans length:", plans.length);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: plans,
      config: {
        systemInstruction: BUILDER_AGENT_PROMPT,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(builderAgentSchema), // Add this line
      },
    });

    const raw = response.text;
    console.log("Raw builder response:", raw?.substring(0, 200) + "...");

    if (!raw) {
      throw new Error("Gemini returned empty response");
    }

    const parsed = JSON.parse(raw);
    console.log("Parsed builder response:", Object.keys(parsed));

    const validated = builderAgentSchema.parse(parsed);
    return validated;
  } catch (error) {
    console.error("Builder agent error:", error);
    if (error instanceof Error) {
      // Log more details about the error
      if (error instanceof SyntaxError) {
        console.error("JSON parse error - invalid JSON received");
      } else if (error instanceof z.ZodError) {
        console.error("Schema validation error:", error.errors);
      }
      throw new Error(`Error invoking builder agent: ${error.message}`);
    }
    throw new Error("Unknown error in builder agent");
  }
}

export default invokeBuilderAgent;
