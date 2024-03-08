"use client";

import { Button } from "~/components/ui/button";

import { type Role, type AnswerOption, type Question } from "~/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { type Session } from "next-auth";
import idToTextMap from "~/utils/optionMapping";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { useToast } from "~/components/ui/use-toast";

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
  const { toast } = useToast();

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
      <form
        className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
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
          <div key={question.id} className="mx-auto w-full">
            <Card>
              <CardHeader>
                <CardTitle>{question.questionText}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup>
                  {answerOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-2 hover:bg-gray-100"
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
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="text-gray-900">
                        {idToTextMap[option.option]}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        ))}
        <div className="col-span-full mt-4">
          <Button
            variant={"outline"}
            type="submit"
            className="w-full"
            onClick={() => {
              toast({
                title: "Success!",
                description: "Your responses have been submitted successfully",
              });
            }}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
