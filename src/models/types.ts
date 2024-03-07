export interface Survey {
  id: string;
  surveyName: string;
}

export interface Role {
  id: string;
  role: string;
}

export interface Question {
  id: string;
  surveyId: string;
  questionText: string;
  roleIds: string[];
  roles?: Role[];
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
