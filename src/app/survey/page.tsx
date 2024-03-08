import { api } from "~/trpc/server";
import { SurveyQuestionnaire } from "../_components/survey-questionnaire";
import { getServerAuthSession } from "~/server/auth";
import { type AnswerOption, type Question } from "~/models/types";
import { ModeToggle } from "../_components/mode-toggle";

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
    <main className="flex min-h-screen items-center justify-center">
      <div className="container flex h-full flex-col items-center justify-center gap-12 px-4 py-16">
        <ModeToggle />
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
