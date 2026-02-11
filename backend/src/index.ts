import express from 'express';
import generateResponse from './ai.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res)=> {
    res.status(200).send("Server is healthy.");
});

app.post("/ask", async(req, res)=> {
    const userQuery = req.body.data;
    const answer = await generateResponse(userQuery);
    
    console.log(answer);
    res.status(200).json({answer});
});

app.post("/fixError", async(req, res)=> {
    const errorMsg = req.body.err;
    // const edits = await debugCode(errorMsg);
    // we may have to send whole code back to server
})

app.listen(PORT, ()=> {
    console.log(`Server listening on port ${3000}`);
});