import { api } from "~/trpc/server";
import { Test } from "../_components/test";
import { getServerAuthSession } from "~/server/auth";
import { type AnswerOption, type Question } from "~/models/types";

const SurveyPage: React.FC = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>Unauthenticated</div>;
  }

  const [questions, answerOptions] = await Promise.all([
    api.survey.getQuestions.query(),
    api.survey.getAnswerOptions.query(),
  ]);

  const formattedQuestions: Question[] = questions.map((question) => ({
    id: question.id,
    surveyId: question.surveyId,
    questionText: question.questionText,
  }));

  const formattedAnswerOptions: AnswerOption[] = answerOptions.map(
    (answerOption) => ({
      id: answerOption.id,
      option: answerOption.option,
    }),
  );

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Survey</h1>

      <Test
        session={session}
        questions={formattedQuestions}
        answerOptions={formattedAnswerOptions}
      />
    </div>
  );
};

export default SurveyPage;
