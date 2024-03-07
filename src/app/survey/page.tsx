import { api } from "~/trpc/server";
import { SurveyQuestionnaire } from "../_components/surveyQuestionnaire";
import { getServerAuthSession } from "~/server/auth";
import { type AnswerOption, type Question } from "~/models/types";
import { SelectRoles } from "../_components/selectRoles";

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
    <div className="p-4">
      <SurveyQuestionnaire
        session={session}
        questions={formattedQuestions}
        answerOptions={formattedAnswerOptions}
        roles={roles}
      />
    </div>
  );
};

export default SurveyPage;
