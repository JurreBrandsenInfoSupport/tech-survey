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
  option: AnswerMapping;
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

export const answerMapping = {
  0: "👍 Used it > Would use again",
  1: "👎 Used it > Would not use again",
  2: "✅ Heard of it > Would like to learn",
  3: "🚫 Heard of it > Not interested",
  4: "❓ Never heard of it/Not sure what it is",
} as const;

type AnswerMapping = keyof typeof answerMapping;
