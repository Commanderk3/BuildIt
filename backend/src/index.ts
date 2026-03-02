import express from "express";
import cors from "cors";
import generateResponse from "./services/ai.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get("/health", (req, res)=> {
    res.status(200).send("Server is healthy.");
});

app.use("/auth", authRoutes);

// use zod
app.post("/ask", async(req, res)=> {
    const userQuery = req.body.data;
    const response = await generateResponse(userQuery);
    res.status(200).json({response});
});

app.post("/fixError", async(req, res)=> {
    const errorMsg = req.body.err;
    // const edits = await debugCode(errorMsg);
    // we may have to send whole code back to server
})

app.listen(PORT, ()=> {
    console.log(`Server listening on port ${3000}`);
});
