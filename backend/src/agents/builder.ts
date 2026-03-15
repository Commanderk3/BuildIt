import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GEMINI_KEY } from "../config.js";
import { BUILDER_AGENT_PROMPT } from "../constants/prompts.js";

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

const builderAgentSchema = z.object({
  files: z
    .record(z.string())
    .describe(
      "Object where keys are file paths (e.g. /App.tsx) and values are the complete file contents",
    ),
  dependencies: z
    .record(z.string())
    .describe("Runtime dependencies required for the project"),

  devDependencies: z
    .record(z.string())
    .optional()
    .describe("Development dependencies like typescript, vite, eslint"),
});

function generatePackageJson(
  dependencies: Record<string, string>,
  devDependencies?: Record<string, string>
) {
  return {
    name: "generated-project",
    version: "0.0.1",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
    },
    dependencies,
    devDependencies: devDependencies ?? {},
  };
}

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
        responseSchema: zodToJsonSchema(builderAgentSchema),
      },
    });

    const raw = response.text;
    if (!raw) {
      throw new Error("Gemini returned empty response");
    }

    const parsed = JSON.parse(raw);

    const validated = builderAgentSchema.parse(parsed);
    const packageJson = generatePackageJson(
      validated.dependencies,
      validated.devDependencies,
    );
    validated.files["/package.json"] = JSON.stringify(packageJson, null, 2);
    return validated;
  } catch (error) {
    if (error instanceof Error) {
      console.error("JSON parse error - invalid JSON received");
      throw new Error(`Error invoking builder agent: ${error.message}`);
    }
    throw new Error("Unknown error in builder agent");
  }
}

export default invokeBuilderAgent;
