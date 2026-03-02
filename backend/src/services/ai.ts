import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GEMINI_KEY } from "../config.js";
import { PLANNER_AGENT_PROMPT } from "../constants/prompts.js";
import invokeBuilderAgent from "../agents/builder.js";

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

async function generateResponse(userQuery: string) {
  const plannerAgentSchema = z.object({
    message: z
      .string()
      .describe("Your answer to user query or plans for builder agent"),
    to: z
      .enum(["user", "builder"])
      .describe("Target recipient of this message"),
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: userQuery }],
      },
    ],
    config: {
      systemInstruction: PLANNER_AGENT_PROMPT,
      temperature: 0.2,
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(plannerAgentSchema),
    },
  });

  const raw = response.text ?? "";

  try {
    const parsed = JSON.parse(raw);
    const validated = plannerAgentSchema.parse(parsed);

    if (validated.to === "builder") {
      const code = await invokeBuilderAgent(validated.message);
      return code;
    }

    return validated;
  } catch (err) {
    console.error("Invalid structured output:", raw);
    throw new Error("Planner agent returned invalid structured output");
  }
}

export default generateResponse;
