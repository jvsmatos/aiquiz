import QUESTIONS from '@/questions.js';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { Label } from './ui/label.jsx';
import { Progress } from './ui/progress.jsx';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group.jsx';

export default function QuizQuestions({questionIndex, onSubmitAnswer}) {
    const [timeRemaining, setTimeRemaining] = useState(10);
    const [answer, setAnswer] = useState({
        selectedAnswer: '',
        isSubmitted: false,
        isCorrect: null
    });

    //Update the state with selected option
    function handleSelectedOption(option){
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            selectedAnswer: option
        }));
    }

    // Update the state with submit and answer validation
    function handleSubmitAnswer(){
        const isCorrect = answer.selectedAnswer === QUESTIONS[questionIndex].correctAnswerId

        setAnswer(prevAnswer => (
            {
            ...prevAnswer,
            isSubmitted: true,
            isCorrect: isCorrect
            }
        ));
        
    }

    // Pass the result of current question to QuizContainer and remount the component using new index (based on answers.length)
    function handleNextQuestion(){
        onSubmitAnswer({selectedAnswer: answer.selectedAnswer, isCorrect: answer.isCorrect});
    }

    useEffect(() => {
        //const timer = setTimeout()

    });

    let isSelected = answer.selectedAnswer === '' ? false : true;
    const correctCss    = 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    const incorrectCss  = 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';

    // Suffling answer options only on first render
    const suffledAnswers = useRef();
    if(!suffledAnswers.current){
    suffledAnswers.current = [...QUESTIONS[questionIndex].options].sort(() => Math.random() - 0.5);
    }


    return (
    <Card className='w-full max-w-[650px] h-full items-center'>
        <CardHeader className='w-full'>
            <div className='flex justify-between items-center gap-3'>
                <CardTitle className='text-xl font-bold'>
                    {QUESTIONS[questionIndex].question}
                </CardTitle>
                <div className='flex flex-col items-center gap-1.5'>
                    <Badge className='bg-red-700 text-gray-200'>Hard</Badge>
                    <span className='text-sm text-center text-muted-foreground'>Question {questionIndex+1}/{QUESTIONS.length}</span>
                </div>
            </div>
            
            <div className='w-full flex items-center gap-1 text-xs text-muted-foreground'>
                <Clock size={14} />
                <span>Time remaining: {timeRemaining}s</span>
            </div>
            <Progress value={timeRemaining*100} />
        </CardHeader>

        <CardContent className='w-full'>
            <RadioGroup className="space-y-3" onValueChange={handleSelectedOption} disabled={answer.isSubmitted}>
                {suffledAnswers.current.map((option) => 
                    <div
                     key={option.id}
                     className={`flex items-center space-x-2 rounded-lg border p-3.5 
                     ${(answer.isSubmitted && option.id === QUESTIONS[questionIndex].correctAnswerId) && correctCss} 
                     ${(answer.isSubmitted && option.id === answer.selectedAnswer && !answer.isCorrect) && incorrectCss}`}
                    >
                        <RadioGroupItem value={option.id} id={option.id}/>
                        <Label className='grow cursor-pointer font-normal' htmlFor={option.id}>{option.text}</Label>
                        {(answer.isSubmitted && option.id === QUESTIONS[questionIndex].correctAnswerId) && 
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        }
                        {(answer.isSubmitted && option.id === answer.selectedAnswer && !answer.isCorrect) && 
                        <XCircle className="h-5 w-5 text-red-500" />
                        }
                    </div>
                )}
            </RadioGroup>
            {(answer.isSubmitted && answer.isCorrect) &&
            <div className='mt-5 p-3 rounded-lg border bg-muted'>
                <p className='font-semibold text-sm'>
                    <span className='text-green-600 flex items-center gap-2'>
                        <CheckCircle size={16} /> Correct!
                    </span>
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                Great job! You selected the right answer.
                </p>
            </div>
            }
            {(answer.isSubmitted && answer.isCorrect === 'timeout') &&
            <div className='mt-5 p-3 rounded-lg border bg-muted'>
                <p className='font-semibold text-sm'>
                    <span className='text-sky-600 flex items-center gap-2'>
                        <Clock size={16} /> Time's up!
                    </span>
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                The correct answer was: <strong>{QUESTIONS[questionIndex].options.map((item) => item.id === QUESTIONS[questionIndex].correctAnswerId && item.text)}</strong>
                </p>
            </div>
            }
            {(answer.isSubmitted && !answer.isCorrect) && 
            <div className='mt-5 p-3 rounded-lg border bg-muted'>
                <p className='font-semibold text-sm'>
                    <span className='text-red-600 flex items-center gap-2'>
                        <XCircle size={16} /> Incorrect!
                    </span>
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                The correct answer was: <strong>{QUESTIONS[questionIndex].options.map((item) => item.id === QUESTIONS[questionIndex].correctAnswerId && item.text)}</strong>
                </p>
            </div>
            }
        </CardContent>

        <CardFooter className='w-full'>
            {answer.isSubmitted === true ? (
                <Button className='w-full' onClick={handleNextQuestion}>
                    Next Question
                </Button>
            ) : (questionIndex === 4 && answer.isSubmitted) ? (
                <Button className='w-full'>
                    See Results
                </Button>
            ) : (
                <Button className='w-full' onClick={handleSubmitAnswer} disabled={!isSelected}>
                    Submit Answer
                </Button>
            )}
        </CardFooter>
    </Card>
  );
}