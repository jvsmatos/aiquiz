import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL backend
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateQuizQuestions = async (subject) => {
  try {
    const response = await api.post('/api/generate-quiz', { subject }); // Send the subject via POST to backend
    return response.data; // Response from backend with data requested
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate questions');
  }
};