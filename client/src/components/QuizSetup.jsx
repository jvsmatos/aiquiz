import { CornerRightDown } from 'lucide-react';
import { Textarea } from './ui/textarea.jsx';
import { Button } from './ui/button.jsx';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from './ui/card.jsx';

export default function QuizSetup({ onStartQuiz }) {
  const [subject, setSubject] = useState('');

  // Validation for subject input field
  function handleStartQuiz() {
    if (subject.trim()) {
      onStartQuiz(subject);
    }
  }

  return (
    <Card className='w-full px-5 max-w-[600px] min-h-[230px] items-center'>
      <CardHeader className='text-3xl font-semibold'>
        Welcome to AI Quiz Generator
      </CardHeader>
      <CardDescription>Let's get started with your quiz!</CardDescription>
      <CardContent className='w-full space-y-6'>
        <div className="space-y-2">
          <label className='flex items-center gap-2'>
            What would you like to be quizzed on? <CornerRightDown size={16} />
          </label>
          <Textarea
            maxLength={50}
            placeholder='Describe the subject for your quiz (max 50 characters)'
            value={subject}
            onChange={(e) => setSubject(e.target.value)} 
            className='resize-none'
            rows={2}
          />
          <p className="text-xs text-muted-foreground text-right">
            {subject.length}/50
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          size="lg"
          onClick={handleStartQuiz}
          className="w-full sm:w-auto"
          disabled={!subject.trim()}
        >
          Generate Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}