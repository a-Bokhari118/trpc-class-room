import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure, router } from "../lib/trpc";
import { lessonSchema } from "@repo/shared";

export const lessonRouter = router({
  getLessonContent: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
        });
      }

      const lesson = await prisma.lesson.findUnique({
        where: {
          id: input.lessonId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          videoKey: true,
          thumbnailKey: true,
          position: true,
          lessonProgress: {
            where: {
              userId: user.id,
            },
            select: {
              lessonId: true,
              completed: true,
            },
          },
          chapter: {
            select: {
              courseId: true,
              course: {
                select: {
                  slug: true,
                },
              },
            },
          },
        },
      });

      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      const enrolledCourse = await prisma.enrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: lesson.chapter.courseId,
            userId: user.id,
          },
        },
        select: {
          status: true,
        },
      });

      if (!enrolledCourse) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be enrolled in the course to access this resource",
        });
      }

      return lesson;
    }),

  getAdminSingleLesson: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
        });
      }
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: input.lessonId,
        },
        select: {
          id: true,
          title: true,
          thumbnailKey: true,
          videoKey: true,
          description: true,
          position: true,
        },
      });
      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }
      return lesson;
    }),
  create: protectedProcedure.input(lessonSchema).mutation(async ({ input }) => {
    const validatedData = lessonSchema.safeParse(input);
    if (!validatedData.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: validatedData.error.message,
      });
    }

    await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: {
          chapterId: validatedData.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: validatedData.data.name,
          chapterId: validatedData.data.chapterId,
          description: validatedData.data.description,
          thumbnailKey: validatedData.data.thumbnailKey,
          videoKey: validatedData.data.videoKey,
          position: maxPosition ? maxPosition.position + 1 : 1,
        },
      });
    });
    return {
      status: "success",
      message: "Lesson created successfully",
    };
  }),

  edit: protectedProcedure
    .input(z.object({ lessonId: z.string(), data: lessonSchema }))
    .mutation(async ({ input }) => {
      const validatedData = lessonSchema.safeParse(input.data);
      if (!validatedData.success) {
        return {
          status: "error",
          message: "Invalid data",
        };
      }

      await prisma.lesson.update({
        where: {
          id: input.lessonId,
        },
        data: {
          title: validatedData.data.name,
          description: validatedData.data.description,
          thumbnailKey: validatedData.data.thumbnailKey,
          videoKey: validatedData.data.videoKey,
        },
      });
      return {
        status: "success",
        message: "Lesson updated successfully",
      };
    }),

  delete: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        courseId: z.string(),
        chapterId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const chapterWithLessons = await prisma.chapter.findUnique({
        where: {
          id: input.chapterId,
        },
        include: {
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              position: true,
            },
          },
        },
      });
      if (!chapterWithLessons) {
        return {
          status: "error",
          message: "Chapter not found",
        };
      }
      const lessons = chapterWithLessons.lessons;
      const lessonToDelete = lessons.find(
        (lesson) => lesson.id === input.lessonId
      );
      if (!lessonToDelete) {
        return {
          status: "error",
          message: "Lesson not found",
        };
      }

      const remainingLessons = lessons.filter(
        (lesson) => lesson.id !== input.lessonId
      );
      const update = remainingLessons.map((lesson, index) =>
        prisma.lesson.update({
          where: { id: lesson.id },
          data: { position: index + 1 },
        })
      );
      await prisma.$transaction([
        ...update,
        prisma.lesson.delete({
          where: { id: input.lessonId },
        }),
      ]);
      return {
        status: "success",
        message: "Lesson deleted successfully",
      };
    }),
});
