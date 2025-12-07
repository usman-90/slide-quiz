import { useState } from 'react';
import type { MCQ, Option } from '../../types';

interface MCQFormProps {
  mcq: MCQ | null;
  onSave: (mcq: MCQ) => void;
  onCancel: () => void;
}

export const MCQForm = ({ mcq, onSave, onCancel }: MCQFormProps) => {
  const [question, setQuestion] = useState(mcq?.question || '');
  const [options, setOptions] = useState<Option[]>(mcq?.options || []);
  const [answer, setAnswer] = useState(mcq?.answer || '');

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const addOption = () => {
    const newId = String.fromCharCode(97 + options.length); // a, b, c, d, ...
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    const newOptions = options.filter(opt => opt.id !== id);
    setOptions(newOptions);
    // Clear answer if it was the removed option
    if (answer === id) {
      setAnswer('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    // Only validate options if there are any
    if (options.length > 0 && options.some(opt => !opt.text.trim())) {
      alert('Please fill in all options or remove empty ones');
      return;
    }
    
    if (!answer.trim()) {
      alert('Please provide the correct answer');
      return;
    }

    // If there are options, validate that answer is a valid option id
    if (options.length > 0 && !options.find(opt => opt.id === answer)) {
      alert('Please select a valid answer from the options');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label>Options: {options.length === 0 && <span style={{ fontSize: '0.9em', color: '#666' }}>(No options - answer only)</span>}</label>
          <button type="button" onClick={addOption} className="add-option-btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}>
            + Add Option
          </button>
        </div>
        {options.length > 0 ? (
          options.map((option) => (
            <div key={option.id} className="option-input" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="option-label">{option.id.toUpperCase()}.</span>
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder={`Option ${option.id.toUpperCase()}`}
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={() => removeOption(option.id)} 
                className="remove-option-btn"
                style={{ padding: '0.3rem 0.6rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No options added. This question will only show the answer.
          </p>
        )}
      </div>

      <div className="form-group">
        <label>Correct Answer:</label>
        {options.length > 0 ? (
          <select value={answer} onChange={(e) => setAnswer(e.target.value)} required>
            <option value="">Select correct answer</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id.toUpperCase()}. {option.text || `Option ${option.id.toUpperCase()}`}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the correct answer"
            required
          />
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">Save Question</button>
        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </form>
  );
};
