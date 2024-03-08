"use client";

import { type Role, type AnswerOption, type Question } from "~/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "~/trpc/react";
import { type Session } from "next-auth";
import idToTextMap from "~/utils/optionMapping";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { toast } from "~/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function RadioGroupForm({
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
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  // filter questions based on selected roles
  const filteredQuestions = questions.filter((question) =>
    question.roleIds.some((roleId) => selectedRoles.includes(roleId)),
  );

  const FormSchema = z.object(
    filteredQuestions.reduce((schema, question) => {
      // Add a validation rule for each question ID
      return {
        ...schema,
        [question.id]: z.enum(
          answerOptions.map((option) => option.id),
          {
            required_error: `You need to select an answer for "${question.questionText}"`,
          },
        ),
      };
    }, {}),
  );

  const router = useRouter();

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

  const handleResponseSelection = (questionId: string, answerId: string) => {
    console.log("Question ID:", questionId);
    console.log("Answer ID:", answerId);

    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answerId,
    }));
  };

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
              <label className="cursor-pointer">{role.role}</label>
            </li>
          ))}
        </ul>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"
        >
          {filteredQuestions?.map((question) => (
            <FormField
              control={form.control}
              name={question.id}
              key={question.id}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>{question.questionText}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value); // Update the form state with the selected value
                            handleResponseSelection(question.id, value); // Update setResponses with the selected value
                          }}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {answerOptions.map((option) => (
                            <FormItem
                              key={option.id}
                              className="flex cursor-pointer items-center  space-x-3 space-y-0 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <FormControl>
                                <RadioGroupItem value={option.id} />
                              </FormControl>
                              <FormLabel className="cursor-pointer">
                                {idToTextMap[option.option]}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </CardContent>
                  </Card>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}