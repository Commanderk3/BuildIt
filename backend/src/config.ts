import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const GEMINI_KEY = requireEnv("GEMINI_KEY");
const JWT_SECRET= requireEnv("JWT_SECRET");
const MONGO_URI = requireEnv("MONGO_URI");

export { GEMINI_KEY, JWT_SECRET, MONGO_URI }
