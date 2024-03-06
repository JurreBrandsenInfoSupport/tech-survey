import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const surveyRouter = createTRPCRouter({
  getQuestionsWithUniqueAnswerOptionsPerDomain: publicProcedure.query(
    async ({ ctx }) => {
      const domains = await ctx.db.domain.findMany({
        include: {
          questions: {
            select: {
              id: true,
              questionText: true,
            },
          },
        },
      });
      return domains;
    },
  ),

  getQuestions: publicProcedure.query(async ({ ctx }) => {
    const questions = await ctx.db.question.findMany();
    // console.log("Questions:", questions); // Debug console log
    return questions;
  }),

  getAnswerOptions: publicProcedure.query(async ({ ctx }) => {
    const answerOptions = await ctx.db.answerOption.findMany();
    // console.log("Answer options:", answerOptions); // Debug console log
    return answerOptions;
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
