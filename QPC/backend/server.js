require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Question Schema
const QuestionSchema = new mongoose.Schema({
  questionText: String,
  plagiarismScore: Number,
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", QuestionSchema);

// Plagiarism Check API (Dummy API Call)
async function checkPlagiarism(text) {
  try {
    const response = await axios.post(
      "https://api.plagiarismchecker.com/check",
      { text },
      { headers: { Authorization: `Bearer ${process.env.PLAGIARISM_API_KEY}` } }
    );
    return response.data.score;
  } catch (error) {
    console.error("Error checking plagiarism:", error.message);
    return null;
  }
}

// Create a Question with Plagiarism Check
app.post("/api/questions", async (req, res) => {
  const { questionText } = req.body;
  if (!questionText) return res.status(400).json({ error: "Question required" });

  const plagiarismScore = await checkPlagiarism(questionText);
  const newQuestion = new Question({ questionText, plagiarismScore });

  await newQuestion.save();
  res.json(newQuestion);
});

// Fetch Questions
app.get("/api/questions", async (req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json(questions);
});

// Serve Frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));