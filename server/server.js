import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateQuestions } from './lib/validation.js';
import { rateLimiter } from './lib/rateLimiter.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'https://aiquiz-peach.vercel.app' }));
app.use(express.json());

/**
 * POST route to generate a quiz based on the given subject.
 * Uses OpenAI API to generate questions and applies rate limiting.
 */
app.post('/api/generate-quiz', rateLimiter, async (req, res) => {
  const { subject } = req.body;

  // Input validation: Ensure the subject is not empty
  if (!subject || subject.trim() === "") {
    console.error('[VALIDATION] Invalid subject received:', subject);
    return res.status(400).json({ error: 'Invalid subject. Please provide a valid subject.' });
  }

  // Retrieves the AI prompt template from the environment variables and inserts the subject
  const prompt = process.env.IA_PROMPT.replace('{subject}', subject);

  console.log('[INFO] Request received. Subject:', subject);

  try {
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

    const rawContent = response.data.choices[0].message.content;

    // Check if OpenAI returned "FALSE", meaning it failed to generate questions
    if (rawContent.trim().toLowerCase() === 'false') {
      console.error('[ERROR] OpenAI returned "FALSE", indicating it could not generate the quiz.');
      throw new Error('openai_failed');
    }

    // Extract JSON from response
    const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
    const finalContent = jsonMatch ? jsonMatch[1] : rawContent;
    const parsedData = JSON.parse(finalContent);

    // Debug log: Display the parsed data
    console.log('[DEBUG] Parsed Data:', JSON.stringify(parsedData, null, 2));

    // Extract the questions array from the parsed data
    const questions = parsedData.quiz || parsedData.questions || parsedData;

    // Validate the extracted questions
    if (!validateQuestions(questions)) {
      console.error('[DEBUG] Invalid question structure:', JSON.stringify(questions, null, 2));
      throw new Error('invalid_questions');
    }

    console.log(`[SUCCESS] Quiz about "${subject}" successfully generated!`);
    res.json(questions);

  } catch (error) {
    console.error('[ERROR] Backend error:', error.message);

    let errorMessage = 'Failed to generate the quiz.';
    if (error.message === 'openai_failed') {
      errorMessage = 'OpenAI was unable to generate questions for this subject.';
    } else if (error.message === 'invalid_questions') {
      errorMessage = 'The generated questions do not meet the expected structure.';
    }

    res.status(500).json({ error: errorMessage });
  }
});

export default app; // Comment this line for localhost usage

// Start the server on port 3000 | Comment this lines bellow for Vercel
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`[SERVER] Running on port ${PORT}`));
