import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { validateQuestions } from './lib/validation.js';
import { rateLimiter } from './lib/rateLimiter.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.set("trust proxy", true);

app.use((req, res, next) => {
  req.requestId = uuidv4(); // Unique ID for each request
  req.clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
  next();
});

/**
 * POST route to generate a quiz based on the given subject.
 * Uses OpenAI API to generate questions and applies rate limiting.
 */
app.post('/api/generate-quiz', rateLimiter, async (req, res) => {
  const { subject } = req.body;
  const { requestId } = req;

  // Input validation: Ensure the subject is not empty
  if (!subject || subject.trim() === "") {
    console.error(`[ERROR] Invalid subject received: ${subject} [${requestId}]`);
    return res.status(400).json({ error: 'Invalid subject. Please provide a valid subject.' });
  }

  // Retrieves the AI prompt template from the environment variables and inserts the subject
  const prompt = process.env.IA_PROMPT.replace('{subject}', subject);

  console.log(`[INFO] Request received. Subject: ${subject} [${requestId}]`);

  try {
    const start = Date.now();
    // Request to OpenAI API to generate quiz questions
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: Number(process.env.OPENAI_TEMPERATURE),
        max_tokens: Number(process.env.OPENAI_MAX_TOKENS)
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const latency = Date.now() - start;
    //Log latency-time API response
    console.log(`[INFO] OpenAI response time: ${latency} ms | Status: ${response.status} [${requestId}]`);

    const rawContent = response.data.choices[0].message.content;

    // Check if OpenAI returned "FALSE", meaning it failed to generate questions
    if (rawContent.trim().toLowerCase() === 'false') {
      console.error(`[ERROR] OpenAI failed to generate questions [${requestId}]`);
      throw new Error('AI service is currently unavailable.');
    }

    // Extract JSON from response
    const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
    const finalContent = jsonMatch ? jsonMatch[1] : rawContent;
    const parsedData = JSON.parse(finalContent);

    // Extract the questions array from the parsed data
    const questions = parsedData.quiz || parsedData.questions || parsedData;

    // Validate the extracted questions
    if (!validateQuestions(questions, requestId)) {
      console.error(`[ERROR] Invalid question structure [${requestId}]`);
      throw new Error('Unable to generate valid questions for this topic.');
    }

    console.log(`[SUCCESS] Quiz generated successfully! Subject: ${subject} - [${requestId}]`);
    res.json(questions);

  } catch (error) {
    console.error(`[ERROR] ${error.message} - [${requestId}]`);
    res.status(500).json({ error: error.message });
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));