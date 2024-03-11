import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { type AnswerOption, type Question } from "~/models/types";
import { Login } from "~/app/_components/login";
import { ModeToggle } from "~/app/_components/mode-toggle";
import { SurveyQuestionnaire } from "~/app/_components/survey-questionnaire";

const SurveyPage: React.FC = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>Unauthenticated</div>;
  }

  const [questions, answerOptions, userSelectedRoles] = await Promise.all([
    api.survey.getQuestions.query(),
    api.survey.getAnswerOptions.query(),
    api.survey.getUserSelectedRoles.query({ userId: session.user.id }),
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
      <div className="absolute right-4 top-4 z-50 flex items-center space-x-4">
        {session && <Login session={session} />}
        <ModeToggle />
      </div>
      <div className="container flex h-full flex-col items-center justify-center gap-12 px-4 py-16">
        <SurveyQuestionnaire
          session={session}
          questions={formattedQuestions}
          answerOptions={formattedAnswerOptions}
          userSelectedRoles={userSelectedRoles}
        />
      </div>
    </main>
  );
};
export default SurveyPage;
