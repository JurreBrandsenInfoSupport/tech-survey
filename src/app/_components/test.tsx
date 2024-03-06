"use client";

import { type AnswerOption, type Question } from "~/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { type Session } from "next-auth";

export function Test({
  session,
  questions,
  answerOptions,
}: {
  session: Session;
  questions: Question[];
  answerOptions: AnswerOption[];
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
    <div className="p-4">
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
        {questions?.map((question) => (
          <div key={question.id} className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">
              {question.questionText}
            </h2>
            <div className="flex flex-wrap">
              {answerOptions.map((option) => (
                <label key={option.id} className="mb-2 mr-4 flex items-center">
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
                  <span className="ml-2">{option.option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
