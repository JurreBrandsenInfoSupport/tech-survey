import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.guestbook.findMany({
      select: {
        name: true,
        message: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  postMessage: protectedProcedure
    .input(z.object({ name: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.guestbook.create({
        data: {
          name: input.name,
          message: input.message,
        },
      });
    }),
});
