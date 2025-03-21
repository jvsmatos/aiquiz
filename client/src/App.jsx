import QuizContainer from './components/QuizContainer.jsx';
import ThemeToggle from "./components/ThemeToggle.jsx";

export function App() {

  return (
    <div className='w-full min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-950 dark:text-gray-100'>
      <header className='w-full py-4'>
        <ThemeToggle /> {/* Toggle component to switch light/dark mode */}
        <div className="max-w-5xl mx-auto my-8 px-4 text-center text-primary">
          <h1 className='text-3xl md:text-4xl font-bold mb-2'>AI Quiz Generator</h1>
          <p className="max-w-2xl mx-auto text-gray-500">
            Test your knowledge with our intelligent quiz system that generates
            questions based on your selected topic and difficulty level.
          </p>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <QuizContainer />
      </main>

      <footer className='w-full mt-8 text-sm text-gray-500 bottom-0'>
        <div className='max-w-5xl mx-auto text-center'>
          <p>
            © {new Date().getFullYear()} AI Quiz Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

