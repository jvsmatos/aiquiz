import Player from "./Player";

export default function QuizContainer() {
    
    // Handler that receives props from Player component
    function handleStartQuiz(name, quizSubject){

    }

    return (
        <>
        <section className='flex flex-col items-center px-4 bg-background w-full max-w-3xl min-h-[500px]'>
            <Player onStartQuiz={handleStartQuiz} />
        </section>
        </>
    );
}