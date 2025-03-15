import axios from 'axios';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const BASE_URL = 'https://api.deepseek.com/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const generateQuizQuestions = async (subject) => {
  const prompt = `Generate a quiz in strict JSON format with 10 questions about ${subject} with:
- 3 easy, 4 medium, 3 hard
- 4 options per question (a, b, c, d)
- Avoid obvious questions in hard ones (e.g.: "Who discovered Brazil?")
- Incorrect options should be close variants of the correct one (e.g.: capitals of neighboring countries).
- Exact format:
[{
  "id": "q1",
  "question": "...",
  "options": [
    {"id": "a", "text": "..."}, 
    {"id": "b", "text": "..."},
    {"id": "c", "text": "..."},
    {"id": "d", "text": "..."}
  ],
  "correctAnswerId": "a",
  "difficulty": "easy"
}]`;

  try {
    const response = await api.post('/chat/completions', {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};