interface Survey {
  id: string;
  surveyName: string;
  questions: Question[];
}

interface Domain {
  id: string;
  domain: string;
  questions: Question[];
}

interface Question {
  id: string;
  surveyId: string;
  questionText: string;
  survey: Survey;
  domains: Domain[];
  QuestionResult: QuestionResult[];
}

interface AnswerOption {
  id: string;
  option: string;
  QuestionResult: QuestionResult[];
}

interface QuestionResult {
  id: string;
  userId: string;
  questionId: string;
  answerId: string;
  user: User;
  question: Question;
  answer: AnswerOption;
}

interface User {
  id: string;
  // Add more properties as needed
}
