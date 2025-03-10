import QUESTIONS from '@/questions.js';
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from './ui/card.jsx';

export default function QuizQuestions({index}) {
    return (
    <>
    <ul>
        <li>{QUESTIONS[0].question}</li>
    </ul>
    </>
  );
}