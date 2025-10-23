import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 5500;  // different port to avoid macOS conflicts
const HOST = "127.0.0.1"; // explicitly use 127.0.0.1

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Initialize OpenAI client once
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Test route
app.get("/test", (req, res) => {
  res.send("✅ Server is running!");
});

// ✅ Chat route (main AI endpoint)
app.post("/chat", async (req, res) => {
  try {
    const { message, subject, history } = req.body;

    const messages = [
      {
        role: "system",
        content: `
You are EduBot, an AI tutor and problem solver.
Your goals:
- Teach and assist students in learning ${subject || "academic"} topics.
- When given a question or problem (e.g. math, physics, or logic), solve it step-by-step.
- Show all reasoning clearly and neatly.
- If the question is conceptual, explain it with simple examples.
- Encourage curiosity and critical thinking.
- Never just give the final answer — always show how you got it.
- Keep your tone friendly, supportive, and educational.
        `
      },
      ...(history || []).map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: message }
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7, // balanced creativity + accuracy
    });

    // Extract the model’s reply safely
    const reply =
      completion?.choices?.[0]?.message?.content ||
      "⚠️ Sorry, I didn’t understand that.";

    // Return to frontend
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

// ✅ Start server
app.listen(PORT, HOST, () =>
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
);
