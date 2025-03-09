import { CornerRightDown, Save, UserPen } from 'lucide-react';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from './ui/card.jsx';


export default function Player({name, onStartQuiz}) {
  const [playerName, setPlayerName] = useState('Player');
  const [isEditing, setIsEditing] = useState(false);
  const [showSubject, setShowSubject] = useState(false);
  const [subject, setSubject] = useState('');

  const isDisabled = (playerName === '' || playerName === 'Player');

  function handleStartQuiz(){
    if(!isEditing){
      onStartQuiz(playerName, subject);
    }
  }

  return (
      <Card className='w-full px-5 max-w-[600px] min-h-[230px] items-center'>
        <CardHeader className='text-3xl font-semibold'>
          Hello, {playerName} !
        </CardHeader>
        <CardDescription>Welcome to AI Quiz Generator</CardDescription>
        <CardContent className='w-full space-y-6'>
          <div className="space-y-2">
            <label className='flex items-center gap-2'>Insert your name <CornerRightDown size={16} /></label>
            <div className='flex gap-2'>
              <Input
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={25}
              className={!isEditing && 'bg-gray-100 dark:bg-slate-600'}
              value={playerName}
              disabled={!isEditing}
              required
              />
              {isEditing ? 
              <Button onClick={() => [setIsEditing(!isEditing), setShowSubject(true)]} disabled={isDisabled}>Save</Button> : 
              <Button variant='outline' onClick={() => setIsEditing(!isEditing)}>Edit</Button>
              }
            </div>
          </div>
          
          {showSubject && (
          <div className="space-y-2">
              <label>What would you like to be quizzed on?</label>
              <Textarea
               maxLength={100}
               placeholder='Describe the subject for your quiz (max 100 characters)'
               value={subject}
               onChange={(e) => setSubject(e.target.value)} 
               className='resize-none' 
               rows={2}
              />
              <p className="text-xs text-muted-foreground text-right">
                {subject.length}/100
              </p>
          </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {showSubject && (
            /* Button that will trigger the internal handler and 
             pass trough onStartQuiz function params to handleStartQuiz function in QuizContainer component */
            <Button
              size="lg"
              onClick={handleStartQuiz}
              className="w-full sm:w-auto"
              disabled={!subject.trim()}
            >
              Generate Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
  );
}