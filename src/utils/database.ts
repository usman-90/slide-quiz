import { ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../firebase/config';
import type { Quiz, MCQ } from '../types';

// Get quizzes for a specific user
export const getQuizzes = async (userId?: string): Promise<Quiz[]> => {
  const quizzesRef = ref(database, 'quizzes');
  const snapshot = await get(quizzesRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const allQuizzes = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
    
    // Filter by userId if provided
    if (userId) {
      return allQuizzes.filter(quiz => quiz.creatorId === userId);
    }
    
    return allQuizzes;
  }
  return [];
};

// Create a new quiz
export const createQuiz = async (title: string, creatorId: string, mcqs: MCQ[]): Promise<string> => {
  const quizzesRef = ref(database, 'quizzes');
  const newQuizRef = push(quizzesRef);
  
  const quiz = {
    title,
    creatorId,
    createdAt: Date.now(),
    mcqs
  };
  
  await set(newQuizRef, quiz);
  return newQuizRef.key!;
};

// Update a quiz
export const updateQuiz = async (quizId: string, title: string, mcqs: MCQ[]): Promise<void> => {
  const quizRef = ref(database, `quizzes/${quizId}`);
  await update(quizRef, {
    title,
    mcqs
  });
};

// Delete a quiz
export const deleteQuiz = async (quizId: string): Promise<void> => {
  const quizRef = ref(database, `quizzes/${quizId}`);
  await remove(quizRef);
};

// Get user's time period setting
export const getUserTimePeriod = async (userId: string): Promise<number> => {
  const userRef = ref(database, `users/${userId}/timePeriod`);
  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return 30; // Default 30 seconds
};

// Set user's time period setting
export const setUserTimePeriod = async (userId: string, timePeriod: number): Promise<void> => {
  const userRef = ref(database, `users/${userId}/timePeriod`);
  await set(userRef, timePeriod);
};
