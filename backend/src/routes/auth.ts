import express from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../services/sendEmail.js";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const verifiedOtp = await Otp.findOne({ email, verified: true });
    console.log(verifiedOtp);

    if (!verifiedOtp) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await Otp.deleteMany({ email });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        username: user.username,
        email: user.email,
        projects: user.projects,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";

    res.status(500).json({ message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      message: "Log-in success",
      token,
      user: {
        username: user.username,
        email: user.email,
        projects: user.projects,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// SEND OTP
router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

/**
 * VERIFY OTP
 */
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const existingOtp = await Otp.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (existingOtp.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    existingOtp.verified = true;
    await existingOtp.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";

    res.status(500).json({ message });
  }
});

export default router;
