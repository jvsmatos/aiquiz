import QUESTIONS from '@/questions.js';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from './ui/card.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { Label } from './ui/label.jsx';
import { Progress } from './ui/progress.jsx';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group.jsx';

export default function QuizQuestions({questionIndex}) {
    const [timeRemaining, setTimeRemaining] = useState(10);

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
            <Progress value={timeRemaining} />
        </CardHeader>

        <CardContent className='w-full'>
            <RadioGroup className='space-y-3'>
                {QUESTIONS[questionIndex].options.map(option => 
                    <div key={option.id} className="flex items-center space-x-2 rounded-lg border p-3.5">
                        <RadioGroupItem value={option.text} id={option.id} />
                        <Label className='grow cursor-pointer font-normal' htmlFor={option.id}>{option.text}</Label>
                    </div>
                )}
                <div className="flex items-center space-x-2 rounded-lg border p-3.5 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <RadioGroupItem value='Lisbon' id='1' />
                    <Label className='grow cursor-pointer font-normal' htmlFor='1'>Lisbon</Label>
                    <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-3.5 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <RadioGroupItem value='São Paulo' id='2' />
                    <Label className='grow cursor-pointer font-normal' htmlFor='2'>São Paulo</Label>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
            </RadioGroup>
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
            <div className='mt-5 p-3 rounded-lg border bg-muted'>
                <p className='font-semibold text-sm'>
                    <span className='text-sky-600 flex items-center gap-2'>
                        <Clock size={16} /> Time's up!
                    </span>
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                The correct answer was: Lisbon
                </p>
            </div>
            <div className='mt-5 p-3 rounded-lg border bg-muted'>
                <p className='font-semibold text-sm'>
                    <span className='text-red-600 flex items-center gap-2'>
                        <XCircle size={16} /> Incorrect!
                    </span>
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                The correct answer was: Lisbon
                </p>
            </div>
        </CardContent>

        <CardFooter className='w-full'>
            <Button className='w-full' disabled>
                Submit Answer
            </Button>
        </CardFooter>
    </Card>
  );
}