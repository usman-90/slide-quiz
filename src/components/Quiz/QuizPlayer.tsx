import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getQuizzes, getUserTimePeriod } from '../../utils/database';
import type { Quiz, MCQ } from '../../types';
import { ThemeToggle } from '../ThemeToggle';

export const QuizPlayer = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timePeriod, setTimePeriod] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizAndSettings();
  }, [quizId, user]);

  useEffect(() => {
    if (quiz && !showAnswer && !quizEnded && timePeriod > 0) {
      setTimeLeft(timePeriod);
    }
  }, [currentMCQIndex, quiz]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !showAnswer && !quizEnded) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showAnswer && !quizEnded) {
      setShowAnswer(true);
    }
  }, [timeLeft, showAnswer, quizEnded]);

  const loadQuizAndSettings = async () => {
    if (!user || !quizId) return;

    try {
      const quizzes = await getQuizzes();
      const foundQuiz = quizzes.find(q => q.id === quizId);
      
      if (!foundQuiz) {
        alert('Quiz not found');
        navigate('/');
        return;
      }

      const period = await getUserTimePeriod(user.uid);
      setTimePeriod(period);
      setQuiz(foundQuiz);
      setTimeLeft(period);
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Failed to load quiz');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!quiz) return;

    if (currentMCQIndex < quiz.mcqs.length - 1) {
      setShowAnswer(false);
      setTimeLeft(timePeriod);
      setCurrentMCQIndex(currentMCQIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="error">Quiz not found</div>;
  }

  if (quizEnded) {
    return (
      <div className="quiz-ended">
        <h1>Quiz Completed!</h1>
        <p>You have completed all {quiz.mcqs.length} questions.</p>
        <button onClick={handleBackToHome} className="home-btn">
          Back to Home
        </button>
      </div>
    );
  }

  const currentMCQ: MCQ = quiz.mcqs[currentMCQIndex];
  const correctOption = currentMCQ.options?.find(opt => opt.id === currentMCQ.answer);
  const hasOptions = currentMCQ.options?.length > 0;

  return (
    <div className="quiz-player">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <ThemeToggle />
      </div>
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="quiz-progress">
          Question {currentMCQIndex + 1} of {quiz.mcqs.length}
        </div>
      </div>

      <div className={`timer ${timeLeft !== null && timeLeft <= 5 ? 'warning' : ''}`}>
        <div className="timer-circle">
          <span className="timer-text">{timeLeft ?? timePeriod}s</span>
        </div>
        <div className="timer-bar-container">
          <div className="timer-bar" style={{ width: `${timeLeft !== null ? (timeLeft / timePeriod) * 100 : 100}%` }}></div>
        </div>
      </div>

      <div className="mcq-display">
        <h3 className="question">{currentMCQ.question}</h3>
        
        {hasOptions && (
          <div className="options-display">
            {currentMCQ.options.map((option) => (
              <div
                key={option.id}
                className={`option-display ${
                  showAnswer && option.id === currentMCQ.answer ? 'correct-answer' : ''
                }`}
              >
                <span className="option-label">{option.id.toUpperCase()}.</span>
                <span className="option-text">{option.text}</span>
              </div>
            ))}
          </div>
        )}

        {showAnswer && (
          <div className="answer-reveal">
            <h4>Correct Answer:</h4>
            <p className="correct-answer-text">
              {hasOptions ? (
                <>
                  {correctOption?.id.toUpperCase()}. {correctOption?.text}
                </>
              ) : (
                currentMCQ.answer
              )}
            </p>
            <button onClick={handleNext} className="next-btn">
              {currentMCQIndex < quiz.mcqs.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>

      <button onClick={handleBackToHome} className="exit-btn">
        Exit Quiz
      </button>
    </div>
  );
};
