import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
