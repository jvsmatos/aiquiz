import { useReducer, useEffect } from "react";
import { generateQuizQuestions } from '../api.js';
import QuizQuestions from "./QuizQuestions";
import Summary from "./Summary";
import QuizSetup from "./QuizSetup";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Ghost, LoaderCircle } from "lucide-react";

// Checking localStorage for init data
function init() {
    const localStored = JSON.parse(localStorage.getItem('quizData'));
    const now = Date.now();
  
    // If localStored timestamp > than 5min clear init data
    if (localStored && localStored.timestamp && (now - localStored.timestamp > 300000)) {
      localStorage.removeItem('quizData');
      return {
        subject: "",
        questions: [],
        userAnswers: [],
        error: null,
        phase: "start"
      };
    }
  
    if (localStored && localStored.questions && localStored.questions.length > 0) {
      return {
        subject: localStored.subject || "",
        questions: localStored.questions,
        userAnswers: [],
        error: null,
        phase: "inProgress"
      };
    }

    return {
      subject: "",
      questions: [],
      userAnswers: [],
      error: null,
      phase: "start"
    };
  }

// Reducer to manage all states of the Quiz
function quizReducer(state, action) {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, phase: "loading", error: null, subject: action.subject };
    case "SET_QUESTIONS":
      return { ...state, phase: "inProgress", questions: action.questions, userAnswers: [] };
    case "SET_ERROR":
      return { ...state, phase: "error", error: action.error };
    case "SUBMIT_ANSWER":
      const updatedAnswers = [...state.userAnswers, action.payload];
      const isFinished = updatedAnswers.length === state.questions.length;
      return { ...state, userAnswers: updatedAnswers, phase: isFinished ? "finished" : "inProgress" };
    case "RESTART_QUIZ":
      return { ...state, userAnswers: [], phase: "inProgress" };
    default:
      return state;
  }
}

export default function QuizContainer() {
  const [state, dispatch] = useReducer(quizReducer, {}, init);

  // Persisting questions info at localStorage and updating when questions change
  useEffect(() => {
    if (state.questions.length > 0) {
      localStorage.setItem(
        'quizData',
        JSON.stringify({
          questions: state.questions,
          timestamp: Date.now()
        })
      );
    }
  }, [state.questions]);

  // Responsible for starting the Quiz and send the subject to API
  const handleStartQuiz = async (subject) => {
    dispatch({ type: "START_LOADING", subject });
    try {
      const questions = await generateQuizQuestions(subject);
      dispatch({ type: "SET_QUESTIONS", questions });
    } catch (error) {
      localStorage.removeItem('quizData');
      dispatch({
        type: "SET_ERROR",
        error:
          error.response?.data?.error === 'invalid_questions'
            ? 'Unable to generate questions for this topic.'
            : 'Unable to establish connection, sorry.'
      });
    }
  };

  // Updating state with user answer and status
  const handleSelectedAnswers = ({ selectedAnswer, status }) => {
    dispatch({ type: "SUBMIT_ANSWER", payload: { selectedAnswer, status } });
  };

  // Restart the same Quiz and clean the answers
  const handleRestartQuiz = () => {
    dispatch({ type: "RESTART_QUIZ" });
  };

  // Conditional render of content based on current phase
  const renderContent = () => {
    switch (state.phase) {
      case "loading":
        return (
          <div className='flex flex-col items-center space-y-2'>
            <LoaderCircle className='animate-spin w-8 h-8' />
            <p className="font-semibold text-base animate-[pulse_3s_ease-in-out_infinite]">
              Generating Quiz...
            </p>
          </div>
        );
      case "error":
        return (
          <Card>
            <CardHeader className='space-y-4 mx-4 my-2'>
              <CardTitle>Error: {state.error}</CardTitle>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardHeader>
          </Card>
        );
      case "start":
        return <QuizSetup onStartQuiz={handleStartQuiz} />;
      case "inProgress":
        return (
          <QuizQuestions
            key={state.userAnswers.length}
            questionIndex={state.userAnswers.length}
            questions={state.questions}
            onSubmitAnswer={handleSelectedAnswers}
          />
        );
      case "finished":
        return <Summary results={state.userAnswers} onRestart={handleRestartQuiz} />;
      default:
        return (
            <div className='flex flex-col items-center space-y-2'>
            <Ghost className='animate-[pulse_4s_ease-in-out_infinite] w-12 h-12' />
            <p className="font-semibold text-base">
              BUUUUUUUU! Page doesn't exisit.
            </p>
          </div>
        );
    }
  };

  return (
    <section className='flex flex-col items-center px-4 bg-background w-full max-w-3xl min-h-[500px]'>
      {renderContent()}
    </section>
  );
}
