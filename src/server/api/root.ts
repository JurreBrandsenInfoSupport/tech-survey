import { postRouter } from "~/server/api/routers/post";
import { guestbookRouter } from "~/server/api/routers/guestbook";
import { surveyRouter } from "~/server/api/routers/survey";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  guestbook: guestbookRouter,
  survey: surveyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
