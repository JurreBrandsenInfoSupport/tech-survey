import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const surveyRouter = createTRPCRouter({
  getQuestions: publicProcedure.query(async ({ ctx }) => {
    // get all questions and also the roles associated with each question
    const questions = await ctx.db.question.findMany({
      include: {
        roles: true,
      },
    });
    return questions;
  }),

  getAnswerOptions: publicProcedure.query(async ({ ctx }) => {
    const answerOptions = await ctx.db.answerOption.findMany();
    return answerOptions;
  }),

  getRoles: publicProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.role.findMany();
    return roles;
  }),

  setQuestionResult: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        questionId: z.string(),
        answerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Received input:", input); // Debug console log
      const questionResult = await ctx.db.questionResult.create({
        data: {
          userId: input.userId,
          questionId: input.questionId,
          answerId: input.answerId,
        },
      });
      console.log("Question result created:", questionResult); // Debug console log
      return questionResult;
    }),
});
