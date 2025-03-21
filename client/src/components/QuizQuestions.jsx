import { Card, CardContent, CardHeader, CardFooter, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { Label } from './ui/label.jsx';
import { Progress } from './ui/progress.jsx';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group.jsx';

export default function Quizquestions({questions, questionIndex, onSubmitAnswer}) {
    const [timeRemaining, setTimeRemaining] = useState(20); // Timer for each question
    const [answer, setAnswer] = useState({
        selectedAnswer: '',
        isSubmitted: false,
        status: 'idle' // Options: 'idle', 'correct', 'incorrect', 'timeout'
    });

    const cardRef = useRef(null);
    //Watching isSubmitted and then scrolling smoothly to Card
    useEffect(() => {
        if (answer.isSubmitted && cardRef.current) {
            cardRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }, [answer.isSubmitted]);

    //Update the state with selected option
    function handleSelectedOption(option){
        setAnswer(prevAnswer => ({
            ...prevAnswer,
            selectedAnswer: option
        }));
    }

    // Update the state with submit and answer validation
    function handleSubmitAnswer(){
        const isAnswerCorrect = answer.selectedAnswer === questions[questionIndex].correctAnswerId;

        setAnswer(prevAnswer => (
            {
            ...prevAnswer,
            isSubmitted: true,
            status: isAnswerCorrect ? 'correct' : 'incorrect'
            }
        ));
        
    }

    // Pass the result of current question to QuizContainer and remount the component using new index
    function handleNextQuestion(){
        onSubmitAnswer({ selectedAnswer: answer.selectedAnswer, status: answer.status });
    }

    //Watching isSubmitted, when it changes stop or start the timer and update status on timeout
    useEffect(() => {
        if(answer.isSubmitted) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if(prev <= 1){
                    clearInterval(timer);
                    setAnswer(prevAnswer => (
                        {
                        ...prevAnswer,
                        isSubmitted: true,
                        status: 'timeout'
                        }
                    ));
                }
                return prev-1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [answer.isSubmitted]);

    const isOptionSelected = answer.selectedAnswer !== '';
    const correctCss    = 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    const incorrectCss  = 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    const questionLvl   = questions[questionIndex].difficulty;

    // Shuffling answer options only on first render (options always in different positions)
    const shuffledAnswers = useRef();
    if (!shuffledAnswers.current) {
        shuffledAnswers.current = [...questions[questionIndex].options].sort(() => Math.random() - 0.5);
    }

    const correctOption = questions[questionIndex].options.find(
        item => item.id === questions[questionIndex].correctAnswerId
    );


    return (
    <Card className='w-full max-w-[650px] h-full items-center' ref={cardRef}>
        <CardHeader className='w-full'>
            <div className='flex justify-between items-center gap-3'>
                <CardTitle className='text-xl font-bold'>
                    {questions[questionIndex].question}
                </CardTitle>
                <div className='flex flex-col items-center gap-1.5'>
                    <Badge
                     className={`${questionLvl === 'easy' ? 'bg-green-700' : questionLvl === 'hard' ? 'bg-red-700' : 'bg-blue-800'} text-gray-200`}
                    >
                    {questionLvl.toUpperCase()}
                    </Badge>
                    <span className='text-sm text-center text-muted-foreground'>Question {questionIndex+1}/{questions.length}</span>
                </div>
            </div>
            
            <div className='w-full flex items-center gap-1 text-xs text-muted-foreground'>
                <Clock size={14} />
                <span>Time remaining: {timeRemaining}s</span>
            </div>
            <Progress value={(timeRemaining/20)*100} />
        </CardHeader>

        <CardContent className='w-full'>
            <RadioGroup
             className="space-y-3"
             onValueChange={handleSelectedOption}
             disabled={answer.isSubmitted}
            >
                {shuffledAnswers.current.map((option) => 
                    <div
                     key={option.id}
                     className={`flex items-center space-x-2 rounded-lg border p-3.5 
                     ${(answer.isSubmitted && option.id === questions[questionIndex].correctAnswerId) ? correctCss : ''} 
                     ${(answer.isSubmitted && option.id === answer.selectedAnswer && answer.status === 'incorrect') ? incorrectCss : ''}`}
                    >
                        <RadioGroupItem value={option.id} id={option.id}/>
                        <Label className='grow cursor-pointer font-normal' htmlFor={option.id}>{option.text}</Label>
                        {(answer.isSubmitted && option.id === questions[questionIndex].correctAnswerId) && 
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        }
                        {(answer.isSubmitted && option.id === answer.selectedAnswer && answer.status === 'incorrect') && 
                        <XCircle className="h-5 w-5 text-red-500" />
                        }
                    </div>
                )}
            </RadioGroup>
            {(answer.isSubmitted && answer.status === 'correct') && (
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
            )}
            {(answer.isSubmitted && answer.status === 'timeout') && (
            <div className='mt-5 p-3 rounded-lg border bg-muted'>
                <p className='font-semibold text-sm'>
                    <span className='text-sky-600 flex items-center gap-2'>
                        <Clock size={16} /> Time's up!
                    </span>
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                The correct answer was: <strong>{correctOption?.text}</strong>
                </p>
            </div>
            )}
            {(answer.isSubmitted && answer.status === 'incorrect') && (
            <div className='mt-5 p-3 rounded-lg border bg-muted'>
                <p className='font-semibold text-sm'>
                    <span className='text-red-600 flex items-center gap-2'>
                        <XCircle size={16} /> Incorrect!
                    </span>
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                The correct answer was: <strong>{correctOption?.text}</strong>
                </p>
            </div>
            )}
        </CardContent>

        <CardFooter className='w-full'>
            {answer.isSubmitted && questionIndex !== (questions.length-1) ? (
                <Button className='w-full' onClick={handleNextQuestion}>
                    Next Question
                </Button>
            ) : answer.isSubmitted && questionIndex === (questions.length-1) ? (
                <Button className='w-full' onClick={handleNextQuestion}>
                    See Results
                </Button>
            ) : (
                <Button className='w-full' onClick={handleSubmitAnswer} disabled={!isOptionSelected}>
                    Submit Answer
                </Button>
            )}
        </CardFooter>
    </Card>
  );
}