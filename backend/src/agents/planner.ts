import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_KEY } from "../config.js";
import { PLANNER_AGENT_PROMPT } from "../constants/prompts.js";

interface Message {
  sender: "user" | "assistant";
  content: string;
  createdAt: number;
}

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
const plannerAgentSchema = z.discriminatedUnion("to", [
  z.object({
    to: z.literal("user"),
    message: z
      .string()
      .describe("Your answer to the user query"),
  }),

  z.object({
    to: z.literal("builder"),
    message: z
      .string()
      .describe("Detailed build instructions for the builder agent"),

    projectName: z
      .string()
      .describe("Name of the project to be created"),

    description: z
      .string()
      .describe("Short description of the project"),
  }),
]);

const invokePlannerAgent = async (msgList: Message[]) => {
  try {
    const contents = msgList.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: PLANNER_AGENT_PROMPT,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(plannerAgentSchema),
      },
    });

    const raw = response.text;

    if (!raw) {
      throw new Error("Gemini returned empty response");
    }

    const parsed = JSON.parse(raw);
    const validated = plannerAgentSchema.parse(parsed);
    return validated;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Unknown error occurred");
  }
};
export { invokePlannerAgent, plannerAgentSchema };
