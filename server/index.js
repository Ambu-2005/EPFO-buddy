// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import { maskPII } from "./middleware/piiMask.js";
import { generateLetterTemplate } from "./utils/letterTemplate.js";
import Tesseract from "tesseract.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// --- resolve __dirname for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- middlewares ---
app.use(cors());                 // allow all origins (ok for this project)
app.use(express.json());         // parse JSON bodies

const upload = multer({ dest: "uploads/" });

// ========== API ROUTES ==========

// --- Chat endpoint (Text) ---
app.post("/ask", async (req, res) => {
  try {
    const question = maskPII(req.body.question || "");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: question }],
        }),
      }
    );

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Groq JSON parse error:", text);
      return res
        .status(500)
        .json({ error: "Groq API returned invalid JSON", raw: text });
    }

    console.log("Groq API response:", data);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Groq API error", details: data });
    }

    if (!data.choices || !data.choices[0]) {
      return res
        .status(500)
        .json({ error: "Invalid API response", details: data });
    }

    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error("Ask error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// --- Image upload + OCR + AI interpretation ---
app.post("/ask-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const {
      data: { text },
    } = await Tesseract.recognize(req.file.path, "eng");

    const question = maskPII(text.trim());

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert EPFO helpdesk assistant.",
            },
            { role: "user", content: question },
          ],
        }),
      }
    );

    const raw = await response.text();
    let data = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error("Groq JSON parse error (image):", raw);
      fs.unlink(req.file.path, () => {});
      return res
        .status(500)
        .json({ error: "Groq API returned invalid JSON", raw });
    }

    // cleanup uploaded file
    fs.unlink(req.file.path, () => {});

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: data.error?.message || "Groq API error", details: data });
    }

    if (!data.choices || !data.choices[0]) {
      return res
        .status(500)
        .json({ error: "Invalid API response", details: data });
    }

    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error("Ask-image error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// --- Letter template endpoint ---
app.post("/letter", (req, res) => {
  try {
    const { name, issue } = req.body;
    const letter = generateLetterTemplate(name, issue);
    res.json({ letter });
  } catch (err) {
    res.status(500).json({ error: err.message || "Letter generation error" });
  }
});

// --- Health Check (API only) ---
app.get("/health", (req, res) => {
  res.send("✅ EPFO Buddy Server is healthy!");
});

// ========== STATIC FRONTEND (single-link deployment) ==========

const clientBuildPath = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  // catch-all for React Router / SPA routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  console.warn(
    "⚠️ client/dist not found. Build the client with `npm run build` in the client folder."
  );

  app.get("/", (req, res) => {
    res.send("✅ EPFO Buddy Server is running! (no client build found)");
  });
}

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
