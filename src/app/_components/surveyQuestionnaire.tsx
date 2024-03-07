"use client";

import { Button } from "~/components/ui/button";

import { type Role, type AnswerOption, type Question } from "~/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { type Session } from "next-auth";
import idToTextMap from "~/utils/optionMapping";

export function SurveyQuestionnaire({
  session,
  questions,
  answerOptions,
  roles,
}: {
  session: Session;
  questions: Question[];
  answerOptions: AnswerOption[];
  roles: Role[];
}) {
  const router = useRouter();

  // State to store user responses
  const [responses, setResponses] = useState<Record<string, string>>({});

  // Load saved responses from local storage when component mounts
  useEffect(() => {
    const savedResponses = localStorage.getItem("surveyResponses");
    if (savedResponses) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setResponses(JSON.parse(savedResponses));
    }
  }, []);

  // Save responses to local storage whenever it changes and there are responses
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem("surveyResponses", JSON.stringify(responses));
    }
  }, [responses]);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (roleId: string) => {
    const index = selectedRoles.indexOf(roleId);
    if (index === -1) {
      setSelectedRoles([...selectedRoles, roleId]);
    } else {
      const updatedRoles = [...selectedRoles];
      updatedRoles.splice(index, 1);
      setSelectedRoles(updatedRoles);
    }
  };

  const handleRoleSelection = (roleId: string) => {
    toggleRole(roleId);
    console.log("Selected Roles:", selectedRoles);
  };

  // filter questions based on selected roles
  const filteredQuestions = questions.filter((question) =>
    question.roleIds.some((roleId) => selectedRoles.includes(roleId)),
  );

  // TODO: doe elke 5 seconden een autosave. (server side)
  // Mutation to submit user responses
  const submitResponse = api.survey.setQuestionResult.useMutation({
    onSuccess: (data) => {
      console.log("Response submitted successfully"); // Debug console log
      console.log("Response data:", data); // Debug console log for response data
      router.refresh();
      setResponses({});
    },
    onError: (error) => {
      console.error("Error submitting response:", error); // Debug console log for errors
    },
  });

  return (
    <div>
      <div className="container mx-auto py-8">
        <h1 className="mb-4 text-2xl font-bold">Select Roles</h1>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <li
              key={role.id}
              className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100 hover:bg-opacity-25"
              onClick={() => handleRoleSelection(role.id)}
            >
              <input
                type="checkbox"
                className="mr-2 cursor-pointer"
                checked={selectedRoles.includes(role.id)}
                onChange={() => handleRoleSelection(role.id)}
              />
              <label>{role.role}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="survey-section">
        <div className="section-questions" id="section-questions">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              // Mapping responses to an array of objects with questionId and answerId
              const mappedResponses = Object.entries(responses).map(
                ([questionId, answerId]) => ({
                  userId: session?.user.id,
                  questionId,
                  answerId,
                }),
              );
              // Mutating responses for each question
              mappedResponses.forEach((response) =>
                submitResponse.mutate(response),
              );
            }}
          >
            {filteredQuestions?.map((question) => (
              <div key={question.id} className="mb-4">
                <h2 className="mb-2 text-lg font-semibold">
                  {question.questionText}
                </h2>
                <div className="flex flex-wrap">
                  {answerOptions.map((option) => (
                    <label
                      key={option.id}
                      className="mb-2 mr-4 flex items-center"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        onChange={(e) =>
                          setResponses((prevResponses) => ({
                            ...prevResponses,
                            [question.id]: e.target.value,
                          }))
                        }
                        checked={responses[question.id] === option.id} // Check if the option is selected
                      />
                      <span className="ml-2">{idToTextMap[option.option]}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
