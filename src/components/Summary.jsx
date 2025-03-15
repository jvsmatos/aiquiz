import { Card, CardContent, CardHeader, CardDescription, CardFooter, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Trophy, Clock, RefreshCw, Home  } from 'lucide-react';

export default function Summary({results}) {
  const { correctAnswers, incorrectAnswers, expiredAnswers } = results.reduce(
    (acc, item) => {
      if (item.isCorrect === "timeout") {
        acc.expiredAnswers += 1; 
      } else if (item.isCorrect) {
        acc.correctAnswers += 1;
      } else {
        acc.incorrectAnswers += 1;
      }
      return acc;
    },
    { correctAnswers: 0, incorrectAnswers: 0, expiredAnswers: 0 } 
  );

  const score = (correctAnswers / results.length) * 100;

  return (
      <Card className='w-full max-w-[650px] h-full items-center'>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Completed!</CardTitle>
          <CardDescription>Here's how you performed</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary">{score}%</h3>
            <p className="text-muted-foreground mt-1">Your Score</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center border border-green-200 dark:border-green-800">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {correctAnswers}
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Correct Answers
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center border border-red-200 dark:border-red-800">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {incorrectAnswers}
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                Incorrect Answers
              </p>
            </div>
          </div>

          {/* Timeout to be displayed only if >0 */}
          {expiredAnswers > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center border border-yellow-200 dark:border-yellow-800">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                {expiredAnswers}
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Time Expired (No Answer)
              </p>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Quiz Summary</h4>
            <p className="text-sm text-muted-foreground">
              You've completed the quiz with {correctAnswers} correct answers
              out of {results.length} questions.
              {score >= 70
                ? " Great job!"
                : score >= 40
                  ? " Good effort!"
                  : " Keep practicing!"}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="w-full sm:w-auto"
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try the same Quiz again
          </Button>
          <Button className="w-full sm:w-auto">
            <Home className="mr-2 h-4 w-4" />
            Try a new Quiz
          </Button>
        </CardFooter>
      </Card>
  );
}