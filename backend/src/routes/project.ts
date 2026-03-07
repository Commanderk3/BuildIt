import express from "express";
import type { Request, Response } from "express";
import generateResponse from "../services/ai.js";
import User from "../models/User.js";
import { createNewProject } from "../services/project.service.js";
import { randomUUID } from "crypto";
import { updateChatHistory } from "../services/project.service.js";

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

router.post("/newProject", async (req: AuthRequest, res: Response) => {
  try {
    const projectId = randomUUID();
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userQuery = req.body?.data;
    const llmResponse = await generateResponse(userQuery);
    const responseText =
      typeof llmResponse === "string" ? llmResponse : llmResponse.message;
    await updateChatHistory(userId, projectId, userQuery, responseText);
    const project = await createNewProject(userId, projectId);

    return res.status(200).json({ project });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/ask/:projectId", async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;
    const userQuery = req.body?.data;

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).json({ message: "Project ID invalid" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userQuery || typeof userQuery !== "string") {
      return res.status(400).json({ message: "Invalid query payload" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = user.projects.find((p) => p.projectId === projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const llmResponse = { message: "Hello", to: "user" }; // await generateResponse(userQuery);
    const responseText = typeof llmResponse === "string" ? llmResponse : llmResponse.message;

    await updateChatHistory(userId, projectId, userQuery, responseText);

    return res.status(200).json({ llmResponse });
  } catch (error) {
    console.error("Error in /ask:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:projectId", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { projects: { projectId } } },
      { new: true },
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

export default router;
