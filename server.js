// server.js  (Node)
import express from "express";
import { OpenAI } from "openai";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Load your pages’ text index (prebuilt)
const pages = JSON.parse(fs.readFileSync("searchIndex.json", "utf8"));

app.post("/api/search", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.json([]);

  // Create embedding for query
  const qEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const qVec = qEmbedding.data[0].embedding;

  // Compute cosine similarity with each page vector
  const similarity = (a, b) =>
    a.reduce((sum, ai, i) => sum + ai * b[i], 0) /
    (Math.sqrt(a.reduce((s, ai) => s + ai ** 2, 0)) *
     Math.sqrt(b.reduce((s, bi) => s + bi ** 2, 0)));

  const scored = pages.map(p => ({
    ...p,
    score: similarity(qVec, p.embedding),
  }));

  // Sort top results
  const top = scored.sort((a, b) => b.score - a.score).slice(0, 5);
  res.json(top);
});

app.listen(3000, () => console.log("AI Search server running"));
