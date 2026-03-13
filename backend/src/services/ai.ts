import invokeBuilderAgent from "../agents/builder.js";
import { invokePlannerAgent } from "../agents/planner.js";

interface Message {
  sender: "user" | "assistant";
  content: string;
  createdAt: number;
}

type LlmResponse =
  | {
      to: "user";
      message: string;
    }
  | {
      to: "builder";
      message: string;
      projectName: string;
      description: string;
    };

async function generateResponse(msgList: Message[]): Promise<LlmResponse> {
  try {
    const parsedResponse = await invokePlannerAgent(msgList);
    console.log("Planner response:", parsedResponse);

    if (parsedResponse.to === "builder") {
      console.log(
        "Calling builder with plans:",
        parsedResponse.message.substring(0, 200) + "...",
      );

      const code = await invokeBuilderAgent(parsedResponse.message);
      // console.log("Builder response received:", code ? "Success" : "Failed");

      if (!code || !code.files) {
        throw new Error("No code received from builder");
      }

      const { projectName, description } = parsedResponse;

      return {
        to: "builder",
        message: JSON.stringify(code),
        projectName,
        description,
      };
    }

    return parsedResponse;
  } catch (err) {
    console.error("Generate response error:", err);

    // Return a user-friendly error message
    return {
      to: "user",
      message:
        "I encountered an error while building your project. Please try again with a more specific request.",
    };
  }
}

export default generateResponse;
