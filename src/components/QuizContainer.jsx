import Player from "./Player";
import { useState } from "react";
import QuizQuestions from "./QuizQuestions";
import Summary from "./Summary";
import QUESTIONS from '@/questions.js';

export default function QuizContainer() {
    const [userAnswers, setUserAnswers] = useState(null);

    const isQuizComplete = userAnswers != null ? userAnswers.length === QUESTIONS.length : false;
    const isPlayerSetup = userAnswers === null;
    const currentQuestionIndex = userAnswers != null && userAnswers.length;

    // Handler that receives props from Player component
    function handleStartQuiz(name, quizSubject){
        setUserAnswers([]);
    }

    function handleSelectedAnswers({selectedAnswer, isCorrect}){
        setUserAnswers(prevAnswers => [...prevAnswers,
            { selectedAnswer, isCorrect },
        ]);
    }

    return (
        <section className='flex flex-col items-center px-4 bg-background w-full max-w-3xl min-h-[500px]'>
            
            {isPlayerSetup ? (
            <Player onStartQuiz={handleStartQuiz} />
            ) : !isQuizComplete ? (
            <QuizQuestions key={currentQuestionIndex} questionIndex={currentQuestionIndex} onSubmitAnswer={handleSelectedAnswers} />
            ) : (
            <Summary />
            )}
        </section>
    );
}