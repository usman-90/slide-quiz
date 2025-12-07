import { useState } from 'react';
import type { Quiz, MCQ } from '../../types';
import { createQuiz, updateQuiz } from '../../utils/database';
import { MCQForm } from './MCQForm';

interface QuizFormProps {
  quiz: Quiz;
  onClose: () => void;
}

export const QuizForm = ({ quiz, onClose }: QuizFormProps) => {
  const [title, setTitle] = useState(quiz.title);
  const [mcqs, setMcqs] = useState<MCQ[]>(quiz.mcqs || []);
  const [editingMCQ, setEditingMCQ] = useState<MCQ | null>(null);
  const [addingMCQ, setAddingMCQ] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveMCQ = (mcq: MCQ) => {
    if (editingMCQ) {
      setMcqs(mcqs.map(m => m.id === mcq.id ? mcq : m));
    } else {
      setMcqs([...mcqs, mcq]);
    }
    setEditingMCQ(null);
    setAddingMCQ(false);
  };

  const handleDeleteMCQ = (mcqId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setMcqs(mcqs.filter(m => m.id !== mcqId));
    }
  };

  const handleSaveQuiz = async () => {
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (mcqs.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setSaving(true);
    try {
      if (quiz.id) {
        await updateQuiz(quiz.id, title, mcqs);
      } else {
        await createQuiz(title, quiz.creatorId, mcqs);
      }
      onClose();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  if (addingMCQ || editingMCQ) {
    return (
      <MCQForm
        mcq={editingMCQ}
        onSave={handleSaveMCQ}
        onCancel={() => {
          setEditingMCQ(null);
          setAddingMCQ(false);
        }}
      />
    );
  }

  return (
    <div className="quiz-form">
      <h2>{quiz.id ? 'Edit Quiz' : 'Create New Quiz'}</h2>
      
      <div className="form-group">
        <label>Quiz Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quiz title"
          required
        />
      </div>

      <div className="mcqs-section">
        <div className="section-header">
          <h3>Questions ({mcqs.length})</h3>
          <button onClick={() => setAddingMCQ(true)} className="add-mcq-btn">
            + Add Question
          </button>
        </div>

        {mcqs.length === 0 ? (
          <p className="no-questions">No questions added yet. Click "Add Question" to start.</p>
        ) : (
          <div className="mcqs-list">
            {mcqs.map((mcq, index) => (
              <div key={mcq.id} className="mcq-item">
                <div className="mcq-header">
                  <span className="mcq-number">Q{index + 1}</span>
                  <span className="mcq-question">{mcq.question}</span>
                </div>
                {mcq.options.length > 0 ? (
                  <div className="mcq-options">
                    {mcq.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`mcq-option ${opt.id === mcq.answer ? 'correct' : ''}`}
                      >
                        {opt.id.toUpperCase()}. {opt.text}
                        {opt.id === mcq.answer && <span className="correct-badge">✓</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mcq-answer-only">
                    <strong>Answer:</strong> {mcq.answer}
                  </div>
                )}
                <div className="mcq-actions">
                  <button onClick={() => setEditingMCQ(mcq)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteMCQ(mcq.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button onClick={handleSaveQuiz} disabled={saving} className="save-quiz-btn">
          {saving ? 'Saving...' : 'Save Quiz'}
        </button>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};
