import { api } from "~/trpc/server";
import { Test } from "../_components/test";
import { getServerAuthSession } from "~/server/auth";

const SurveyPage: React.FC = async () => {
  const session = await getServerAuthSession();

  // Fetch survey questions from the API
  const questions = await api.survey.getQuestions.query();

  // Fetch answer options from the API
  const answerOptions = await api.survey.getAnswerOptions.query();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Survey</h1>

      <Test
        session={session}
        questions={questions}
        answerOptions={answerOptions}
      />
    </div>
  );
};

export default SurveyPage;
