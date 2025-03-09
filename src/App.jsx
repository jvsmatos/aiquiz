import Player from './components/Player.jsx';
import ThemeToggle from "./components/ThemeToggle.jsx";

export function App() {

  return (
    <div className='w-full min-h-screen bg-gray-100 dark:bg-slate-950'>
      <header className='w-full py-4'>
        <ThemeToggle />
        <div className="max-w-5xl mx-auto my-5 px-4 dark:text-white flex flex-col text-center">
          <h1 className='text-3xl mb-5'>AI Quiz Generator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge with our intelligent quiz system that generates
            questions based on your selected topic and difficulty level.
          </p>
        </div>
      </header>

      <main className=" flex flex-col max-w-4xl mx-auto py-2 px-2">
      
        <Player />
      </main>

      <footer className="w-full max-w-4xl text-center mt-8 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} AI Quiz Generator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

