import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getQuizzes, deleteQuiz } from '../../utils/database';
import type { Quiz } from '../../types';
import { TimeSetting } from '../TimeSetting';
import { QuizForm } from './QuizForm';

export const QuizList = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (user) {
      loadQuizzes();
    }
  }, [user]);

  const loadQuizzes = async () => {
    if (!user) return;
    
    try {
      // Only load quizzes created by the current user
      const data = await getQuizzes(user.uid);
      setQuizzes(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(quizId);
        loadQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleAddQuiz = () => {
    setEditingQuiz({ id: '', title: '', creatorId: user!.uid, createdAt: Date.now(), mcqs: [] });
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
  };

  const handleCloseForm = () => {
    setEditingQuiz(null);
    loadQuizzes();
  };

  if (authLoading || loading) return <div className="loading">Loading...</div>;

  return (
    <div className="quiz-list-container">
      <div className="header">
        <h1>SlideQuiz</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      <TimeSetting />

      <div className="quiz-actions">
        <button onClick={handleAddQuiz} className="add-quiz-btn">+ Add New Quiz</button>
      </div>

      {editingQuiz && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={handleCloseForm} className="close-btn">×</button>
            <QuizForm quiz={editingQuiz} onClose={handleCloseForm} />
          </div>
        </div>
      )}

      <div className="quizzes-grid">
        {quizzes.length === 0 ? (
          <p>No quizzes available. Create one to get started!</p>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.mcqs?.length || 0} questions</p>
              <div className="quiz-actions">
                <button onClick={() => handleStartQuiz(quiz.id)} className="start-btn">
                  Start Quiz
                </button>
                <button onClick={() => handleEditQuiz(quiz)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(quiz.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
