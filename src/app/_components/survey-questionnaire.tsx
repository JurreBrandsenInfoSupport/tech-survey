"use client";

import {
  type Role,
  type AnswerOption,
  type Question,
  type QuestionResult,
} from "~/models/types";
import { usePathname, notFound } from "next/navigation";
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
import { slugToId, slugify } from "~/utils/slugify";

import Navigation from "./progression-bar";
import Link from "next/link";

export function SurveyQuestionnaire({
  session,
  questions,
  answerOptions,
  userSelectedRoles,
  userAnswersForRole,
}: {
  session: Session;
  questions: Question[];
  answerOptions: AnswerOption[];
  userSelectedRoles: Role[];
  userAnswersForRole: QuestionResult[];
}) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedRoles] = useState<string[]>(
    userSelectedRoles.map((role) => role.id),
  );

  const pathname = usePathname() || "";

  // get the current role from the url, which is /survey/[role]
  const currentRole = pathname.split("/").pop() ?? "";
  if (!slugToId[currentRole]) {
    notFound();
  }

  console.log("Selected roles:", selectedRoles);

  const filteredQuestions = questions.filter(
    (question) =>
      question.roleIds?.some(
        (roleId) => roleId === slugToId[currentRole ?? ""],
      ) && selectedRoles.includes(slugToId[currentRole ?? ""] ?? ""),
  );

  // TODO: pak grootte van het scherm
  function isMobileDevice() {
    if (typeof window === "undefined") {
      return false; // Not running in a browser environment
    }
    const userAgent = window.navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );
  }

  // function that check if a user already has more than 1 response for a question
  function hasAnsweredAllQuestionsForRole(
    userAnswersForRole: QuestionResult[],
    roleId: string,
    questions: Question[],
  ) {
    const questionsForRole = userAnswersForRole.filter((answer) =>
      answer.question.roles?.some((role) => role.id === roleId),
    );

    const totalQuestionsForRole = questions.filter((question) =>
      question.roleIds?.some((role) => role === roleId),
    ).length;

    const answeredQuestionsForRole = questionsForRole.filter(
      (answer) => answer.answerId !== undefined,
    );

    return answeredQuestionsForRole.length >= totalQuestionsForRole;
  }

  const isMobile = isMobileDevice();

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
            required_error: `You need to select an answer`,
          },
        ),
      };
    }, {}),
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit() {
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

    try {
      // Submitting responses for each question
      await Promise.all(
        mappedResponses.map((response) => submitResponse.mutateAsync(response)),
      );

      // Navigate to the next role
      const nextHref = getNextHref();
      if (nextHref) {
        window.location.assign(nextHref);
      } else {
        toast({
          title: "Success!",
          description: "Your survey has been submitted.",
        });
        // wait for 2 seconds before redirecting to the thank you page
        setTimeout(() => {
          window.location.assign("/survey/thank-you");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
      toast({
        title: "Error!",
        description: "An error occurred while submitting the survey responses.",
        variant: "destructive",
      });
    }
  }

  const submitResponse = api.survey.setQuestionResult.useMutation({
    onSuccess: () => {
      console.log("Response submitted successfully");
      return true;
    },
    onError: (error) => {
      console.error("Error submitting response:", error);
      return false;
    },
  });

  const selectedRolesForProgressBar = userSelectedRoles
    .sort((a, b) => {
      const roleA = a.role.toLowerCase();
      const roleB = b.role.toLowerCase();

      if (roleA === "general") return -1;
      if (roleB === "general") return 1;

      return 0;
    })
    .map((role) => ({
      id: role.id,
      href: `/survey/${slugify(role.role)}`,
      label: role.role,
      current: slugify(role.role) === currentRole,
      completed: hasAnsweredAllQuestionsForRole(
        userAnswersForRole,
        role.id,
        questions,
      ),
    }));

  function getNextHref() {
    // lookup the current index of the current role
    const index = selectedRolesForProgressBar.findIndex(
      (role) => role.current === true,
    );
    return selectedRolesForProgressBar[index + 1]?.href;
  }

  console.log("Sections:", selectedRolesForProgressBar);

  return (
    <div>
      <div>
        <Navigation roles={selectedRolesForProgressBar} />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
        >
          <Table divClassname="">
            <TableHeader className="sticky top-0 z-10 h-10 w-full bg-slate-100 dark:bg-slate-900">
              <TableRow>
                <TableHead className="w-[200px]">Question</TableHead>
                {answerOptions.map((option) => (
                  <TableHead key={option.id}>
                    {isMobile
                      ? idToTextMapMobile[option.option]
                      : idToTextMap[option.option]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions?.map((question) => (
                <FormField
                  control={form.control}
                  name={question.id}
                  key={`${question.id}`}
                  render={({ field }) => (
                    <TableRow
                      key={question.id}
                      className={
                        form.formState.errors[question.id]
                          ? "!border-2 !border-dashed !border-red-500"
                          : ""
                      }
                    >
                      {" "}
                      {/* add a dashed border of 1px in color red in case of validatio error */}
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
                                <label className="flex cursor-pointer items-center justify-center">
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
          <Button type="submit">{getNextHref() ? "Next" : "Submit"}</Button>
        </form>
      </Form>
    </div>
  );
}
