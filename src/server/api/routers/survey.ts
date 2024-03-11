import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { type Role } from "~/models/types";

export const surveyRouter = createTRPCRouter({
  assignDefaultRole: protectedProcedure.mutation(async ({ ctx }) => {
    const defaultRole = await ctx.db.role.findFirst({
      where: {
        default: true,
      },
    });

    if (!defaultRole) {
      throw new Error("Default role not found");
    }

    const users = await ctx.db.user.findMany({
      where: {
        roles: {
          none: {
            id: defaultRole.id,
          },
        },
      },
    });

    for (const user of users) {
      await ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          roles: {
            connect: {
              id: defaultRole.id,
            },
          },
        },
      });
    }
  }),

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

  getUserSelectedRoles: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          roles: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.roles as Role[];
    }),

  setRole: protectedProcedure
    .input(z.object({ userId: z.string(), roleIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { userId, roleIds } = input;

      // find the user
      const user = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // find the roles
      const roles = await ctx.db.role.findMany({
        where: {
          id: {
            in: roleIds,
          },
        },
      });

      if (roles.length !== roleIds.length) {
        throw new Error("Invalid role");
      }

      // set the roles
      await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          roles: {
            set: roles,
          },
        },
      });
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
