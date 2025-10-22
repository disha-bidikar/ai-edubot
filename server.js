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

// Test route
app.get("/test", (req, res) => {
  res.send("Server is running!");
});

// Chat route
const completion = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: `
You are EduBot, an AI tutor. 
- Explain concepts clearly and in simple language. 
- Provide examples when possible. 
- Encourage learning and critical thinking. 
- Ask guiding questions to engage students. 
- Tailor explanations according to the subject selected by the user.
`
    },
    { role: "user", content: userMessage },
  ],
});


app.listen(PORT, HOST, () =>
  console.log(`🚀 Server running on http://${HOST}:${PORT}`)
);
app.post("/chat", async (req, res) => {
  try {
    const { message, subject, history } = req.body;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
      {
        role: "system",
        content: `
You are EduBot, an AI tutor. 
- Explain ${subject} concepts clearly.
- Give examples and encourage learning.
- Use previous messages if relevant.
`
      },
      ...(history || []).map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: message }
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});
