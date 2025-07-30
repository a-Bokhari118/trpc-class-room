import { type inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/src/routers";

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type CoursesOutput = RouterOutput["course"]["getAll"];
export type CourseOutput = RouterOutput["course"]["getSingleCourse"];
export type CourseSidebarOutput =
  RouterOutput["course"]["getCourseSidebarData"];
export type AdminCoursesOutput = RouterOutput["course"]["getAdminCourses"];
export type AdminSingleCourseOutput =
  RouterOutput["course"]["getAdminSingleCourse"];
export type AdminSingleLessonOutput =
  RouterOutput["lesson"]["getAdminSingleLesson"];
