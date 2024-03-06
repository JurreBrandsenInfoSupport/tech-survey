export interface Survey {
  id: string;
  surveyName: string;
  questions: Question[];
}

export interface Domain {
  id: string;
  domain: string;
  questions: Question[];
}

export interface Question {
  id: string;
  surveyId: string;
  questionText: string;
}

export interface AnswerOption {
  id: string;
  option: number;
}

export interface QuestionResult {
  id: string;
  userId: string;
  questionId: string;
  answerId: string;
  user: User;
  question: Question;
  answer: AnswerOption;
}

export interface User {
  id: string;
  // Add more properties as needed
}
