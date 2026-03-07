import express from "express";
import type { Request, Response } from "express";
import User from "../models/User.js";

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

router.get("/me", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return res.status(500).json({ message });
  }
});

export default router;
