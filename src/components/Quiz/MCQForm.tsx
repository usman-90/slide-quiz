import { useState } from 'react';
import type { MCQ, Option } from '../../types';

interface MCQFormProps {
  mcq: MCQ | null;
  onSave: (mcq: MCQ) => void;
  onCancel: () => void;
}

export const MCQForm = ({ mcq, onSave, onCancel }: MCQFormProps) => {
  const [question, setQuestion] = useState(mcq?.question || '');
  const [options, setOptions] = useState<Option[]>(
    mcq?.options || [
      { id: 'a', text: '' },
      { id: 'b', text: '' },
      { id: 'c', text: '' },
      { id: 'd', text: '' }
    ]
  );
  const [answer, setAnswer] = useState(mcq?.answer || '');

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (options.some(opt => !opt.text.trim())) {
      alert('Please fill in all options');
      return;
    }
    
    if (!answer) {
      alert('Please select the correct answer');
      return;
    }

    const newMCQ: MCQ = {
      id: mcq?.id || Date.now().toString(),
      question,
      options,
      answer
    };

    onSave(newMCQ);
  };

  return (
    <form onSubmit={handleSubmit} className="mcq-form">
      <h3>{mcq ? 'Edit Question' : 'Add Question'}</h3>
      
      <div className="form-group">
        <label>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          required
        />
      </div>

      <div className="form-group">
        <label>Options:</label>
        {options.map((option) => (
          <div key={option.id} className="option-input">
            <span className="option-label">{option.id.toUpperCase()}.</span>
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${option.id.toUpperCase()}`}
              required
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Correct Answer:</label>
        <select value={answer} onChange={(e) => setAnswer(e.target.value)} required>
          <option value="">Select correct answer</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.id.toUpperCase()}. {option.text || `Option ${option.id.toUpperCase()}`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">Save Question</button>
        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </form>
  );
};
