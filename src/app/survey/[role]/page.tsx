import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { type AnswerOption, type Question } from "~/models/types";
import { Login } from "~/app/_components/login";
import { ModeToggle } from "~/app/_components/mode-toggle";
import { Suspense } from "react";
import { SurveyQuestionnaire } from "~/app/_components/survey-questionnaire";
import Loading from "~/app/loading";

// Wrap the asynchronous data fetching with Suspense
const SuspenseSurveyData = () => (
  <Suspense fallback={<Loading />}>
    <SurveyPage />
  </Suspense>
);

const SurveyPage: React.FC = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return <div>Unauthenticated</div>;
  }

  // Wrap the Promise.all call with React.lazy
  const [questions, answerOptions, userSelectedRoles, userAnswersForRole] =
    await Promise.all([
      api.survey.getQuestions.query(),
      api.survey.getAnswerOptions.query(),
      api.survey.getUserSelectedRoles.query({ userId: session.user.id }),
      api.survey.getUserAnswersForRole.query({ userId: session.user.id }),
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
          userAnswersForRole={userAnswersForRole}
        />
      </div>
    </main>
  );
};
export default SuspenseSurveyData;
