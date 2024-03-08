import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { type AnswerOption, type Question } from "~/models/types";
import { ModeToggle } from "../_components/mode-toggle";
import { SurveyQuestionnaire } from "../_components/survey-questionnaire";

const SurveyPage: React.FC = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>Unauthenticated</div>;
  }

  const roles = await api.survey.getRoles.query();

  const [questions, answerOptions] = await Promise.all([
    api.survey.getQuestions.query(),
    api.survey.getAnswerOptions.query(),
  ]);

  const formattedQuestions: Question[] = questions.map((question) => ({
    id: question.id,
    surveyId: question.surveyId,
    questionText: question.questionText,
    roleIds: question.roles.map((role) => role.id),
  }));

  const formattedAnswerOptions: AnswerOption[] = answerOptions.map(
    (answerOption) => ({
      id: answerOption.id,
      option: answerOption.option,
    }),
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <div className="absolute right-4 top-4 z-50">
        <ModeToggle />
      </div>
      <div className="container flex h-full flex-col items-center justify-center gap-12 px-4 py-16">
        <SurveyQuestionnaire
          session={session}
          questions={formattedQuestions}
          answerOptions={formattedAnswerOptions}
          roles={roles}
        />
      </div>
    </main>
  );
};
export default SurveyPage;
