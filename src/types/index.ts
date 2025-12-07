export interface Option {
  id: string;
  text: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: Option[];
  answer: string; // option id
}

export interface Quiz {
  id: string;
  title: string;
  creatorId: string;
  createdAt: number;
  mcqs: MCQ[];
}

export interface User {
  uid: string;
  email: string | null;
  timePeriod?: number; // in seconds
}
