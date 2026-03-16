import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/project.js"
import userRoutes from "./routes/user.js"
import auth from "./middleware/auth.js";
import { MONGO_URI } from "./config.js";
import serverless from "serverless-http";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = mongoose.connection.readyState === 1;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});


app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy.");
});

app.use("/auth", authRoutes);

app.use("/user", auth, userRoutes)

app.use("/project", auth, projectRoutes);

app.post("/fixError", auth, async (req, res) => {
  const errorMsg = req.body.err;
  // const edits = await debugCode(errorMsg);
  // we may have to send whole code back to server
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// export const handler = serverless(app);