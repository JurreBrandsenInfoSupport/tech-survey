"use client";

import { type Role, type AnswerOption, type Question } from "~/models/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { type Session } from "next-auth";
import { idToTextMap, idToTextMapMobile } from "~/utils/optionMapping";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { toast } from "~/components/ui/use-toast";

export function SurveyQuestionnaire({
  session,
  questions,
  answerOptions,
  userSelectedRoles,
}: {
  session: Session;
  questions: Question[];
  answerOptions: AnswerOption[];
  userSelectedRoles: Role[];
}) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedRoles] = useState<string[]>(
    userSelectedRoles.map((role) => role.id),
  );

  function isMobileDevice() {
    if (typeof window === "undefined") {
      return false; // Not running in a browser environment
    }
    const userAgent = window.navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );
  }

  const router = useRouter();
  const isMobile = isMobileDevice();

  // filter questions based on selected roles
  const filteredQuestions = questions.filter((question) =>
    question.roleIds.some((roleId) => selectedRoles.includes(roleId)),
  );

  const handleResponseSelection = (questionId: string, answerId: string) => {
    console.log("Question ID:", questionId);
    console.log("Answer ID:", answerId);

    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answerId,
    }));
  };

  type QuestionSchema = Record<string, z.ZodEnum<[string, ...string[]]>>;

  const FormSchema = z.object(
    filteredQuestions.reduce<QuestionSchema>((schema, question) => {
      // Add a validation rule for each question ID
      return {
        ...schema,
        [question.id]: z.enum(
          [question.id, ...answerOptions.map((option) => option.id)],
          {
            required_error: `You need to select an answer for "${question.questionText}"`,
          },
        ),
      };
    }, {}),
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit() {
    const mappedResponses = Object.entries(responses).map(
      ([questionId, answerId]) => ({
        userId: session?.user.id,
        questionId,
        answerId,
      }),
    );

    if (mappedResponses.length === 0) {
      toast({
        title: "Error!",
        description: "Please provide at least one response.",
        variant: "destructive",
      });
      return;
    }

    // Mutating responses for each question
    mappedResponses.forEach((response) => submitResponse.mutate(response));

    toast({
      title: "Success!",
      description: "Your survey has been submitted.",
    });
  }

  const submitResponse = api.survey.setQuestionResult.useMutation({
    onSuccess: (data) => {
      console.log("Response submitted successfully");
      console.log("Response data:", data);
      router.refresh();
      setResponses({});
    },
    onError: (error) => {
      console.error("Error submitting response:", error);
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
        >
          <Table divClassname="">
            <TableHeader className="sticky top-0 z-10 h-10 w-full">
              <TableHead className="w-[200px]">Question</TableHead>
              {answerOptions.map((option) => (
                <TableHead key={option.id}>
                  {isMobile
                    ? idToTextMapMobile[option.option]
                    : idToTextMap[option.option]}
                </TableHead>
              ))}
            </TableHeader>
            <TableBody>
              {filteredQuestions?.map((question) => (
                <FormField
                  control={form.control}
                  name={question.id}
                  key={`${question.id}`}
                  render={({ field }) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        {question.questionText}
                        <FormMessage />
                      </TableCell>

                      {answerOptions.map((option) => (
                        <TableCell key={option.id}>
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleResponseSelection(question.id, value);
                                }}
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <label className="block cursor-pointer">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={option.id}
                                      onChange={() => {
                                        field.onChange(option.id);
                                        handleResponseSelection(
                                          question.id,
                                          option.id,
                                        );
                                      }}
                                      checked={field.value === option.id}
                                    />
                                  </FormControl>
                                </label>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                />
              ))}
            </TableBody>
          </Table>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
