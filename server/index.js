import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import { maskPII } from "./middleware/piiMask.js";
import { generateLetterTemplate } from "./utils/letterTemplate.js";
import OpenAI from "openai";
import Tesseract from "tesseract.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
const upload = multer({ dest: "uploads/" });

// OpenAI client for Whisper and GPT
//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Chat endpoint (Text) ---
app.post("/ask", async (req, res) => {
  try {
    const question = maskPII(req.body.question);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Groq free model
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    console.log("Groq API response:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid API response", details: data });
    }
    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Audio endpoint (using OpenAI Whisper) ---
/* app.post("/ask-audio", upload.single("audio"), async (req, res) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1",
    });

    const question = maskPII(transcription.text);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: question }],
      }),
    });


    const data = await response.json();
    console.log("Groq API response (audio):", data);

    fs.unlink(req.file.path, () => {});

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid API response", details: data });
    }
    res.json({ question, answer: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/
// --- Image upload + OCR + AI interpretation ---
app.post("/ask-image", upload.single("image"), async (req, res) => {
  try {
    const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");

    const question = maskPII(text.trim());

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert EPFO helpdesk assistant." },
          { role: "user", content: question },
        ],
      }),
    });

    const data = await response.json();

    fs.unlink(req.file.path, () => {});

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid API response", details: data });
    }
    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Letter template endpoint ---
app.post("/letter", (req, res) => {
  const { name, issue } = req.body;
  const letter = generateLetterTemplate(name, issue);
  res.json({ letter });
});

// --- Health Check ---
app.get("/", (req, res) => {
  res.send("✅ EPFO Buddy Server is running!");
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
