import { type inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/src/routers";

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type CoursesOutput = RouterOutput["course"]["getAll"];
