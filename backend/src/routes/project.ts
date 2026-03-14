import express from "express";
import type { Request, Response } from "express";
import generateResponse from "../services/ai.js";
import User from "../models/User.js";
import { createNewProject } from "../services/project.service.js";
import { randomUUID } from "crypto";
import { updateNameProject } from "../services/project.service.js";

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}


// Utility Functions

function getUserId(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  return userId;
}

function validateMessages(messages: any, res: Response) {
  if (!Array.isArray(messages)) {
    res.status(400).json({ message: "Invalid messages payload" });
    return null;
  }
  return messages;
}

function validateProjectId(projectId: any, res: Response) {
  if (!projectId || typeof projectId !== "string") {
    res.status(400).json({ message: "Project ID invalid" });
    return null;
  }
  return projectId;
}

async function getUserProject(userId: string, projectId: string) {
  const user = await User.findById(userId);
  if (!user) return { error: "USER_NOT_FOUND" };

  const project = user.projects.find((p) => p.projectId === projectId);
  if (!project) return { error: "PROJECT_NOT_FOUND" };

  return { user, project };
}

// Routes

router.post("/newProject", async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const messages = validateMessages(req.body?.messages, res);
    if (!messages) return;

    const projectId = randomUUID();
    const trimmedMessages = messages.slice(-12);

    const llmResponse = await generateResponse(trimmedMessages);

    const project =
      llmResponse.to === "builder"
        ? await createNewProject(
            userId,
            projectId,
            llmResponse.projectName,
            llmResponse.description
          )
        : await createNewProject(
            userId,
            projectId,
            "New Project",
            "Make plans for your project"
          );

    return res.status(200).json({
      project,
      llmResponse: {
        message: llmResponse.message,
        to: llmResponse.to,
      },
    });
  } catch (error) {
    console.error("Error in /newProject:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/ask/:projectId", async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const projectId = validateProjectId(req.params.projectId, res);
    if (!projectId) return;

    const messages = validateMessages(req.body?.messages, res);
    if (!messages) return;

    const llmResponse = await generateResponse(messages);

    if (llmResponse.to === "builder") {
      const result = await User.updateOne(
        { _id: userId, "projects.projectId": projectId },
        {
          $set: {
            "projects.$.name": llmResponse.projectName,
            "projects.$.description": llmResponse.description,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Project not found" });
      }
    }

    return res.status(200).json({ llmResponse });

  } catch (error) {
    console.error("Error in /ask:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:projectId", async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const projectId = validateProjectId(req.params.projectId, res);
    if (!projectId) return;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { projects: { projectId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Project deleted",
      projects: user.projects,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// router.post("/push/:projectId", async (req: AuthRequest, res: Response) => {
//   // check if projectId exist in database
//   const { user, project } = getUserProject()
// });

export default router;