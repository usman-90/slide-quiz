import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserTimePeriod, setUserTimePeriod } from '../utils/database';

export const TimeSetting = () => {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState(30);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadTimePeriod();
    }
  }, [user]);

  const loadTimePeriod = async () => {
    if (!user) return;
    try {
      const period = await getUserTimePeriod(user.uid);
      setTimePeriod(period);
    } catch (error) {
      console.error('Error loading time period:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await setUserTimePeriod(user.uid, timePeriod);
      setMessage('Time period saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save time period');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="time-setting">
      <label>
        Time per question (seconds):
        <input
          type="number"
          min="5"
          max="300"
          value={timePeriod}
          onChange={(e) => setTimePeriod(Number(e.target.value))}
        />
      </label>
      <button onClick={handleSave}>Save</button>
      {message && <span className="message">{message}</span>}
    </div>
  );
};
