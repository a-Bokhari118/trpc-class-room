import { publicProcedure, router } from "../lib/trpc";
import { chapterRouter } from "./chapter";
import { courseRouter } from "./course";
import { dashboardRouter } from "./dashboard";
import { lessonRouter } from "./lesson";
import { todoRouter } from "./todo";
import { s3Router } from "./s3";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  todo: todoRouter,
  course: courseRouter,
  lesson: lessonRouter,
  chapter: chapterRouter,
  dashboard: dashboardRouter,
  s3: s3Router,
});
export type AppRouter = typeof appRouter;
