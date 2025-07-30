import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { chapterSchema } from "@repo/shared";

export const chapterRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.chapter.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }),

  create: protectedProcedure
    .input(chapterSchema)
    .mutation(async ({ input }) => {
      const validatedData = chapterSchema.safeParse(input);
      if (!validatedData.success) {
        return {
          status: "error",
          message: "Invalid data",
        };
      }
      await prisma.$transaction(async (tx) => {
        const maxPosition = await tx.chapter.findFirst({
          where: {
            courseId: input.courseId,
          },
          select: {
            position: true,
          },
          orderBy: {
            position: "desc",
          },
        });

        await tx.chapter.create({
          data: {
            title: validatedData.data.name,
            courseId: validatedData.data.courseId,
            position: maxPosition ? maxPosition.position + 1 : 1,
          },
        });
      });
      return {
        status: "success",
        message: "Chapter created successfully",
      };
    }),

  reorderChapters: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapters: z.array(z.object({ id: z.string(), position: z.number() })),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
        });
      }
      if (!input.chapters || input.chapters.length === 0) {
        return {
          status: "error",
          message: "No chapters to reorder",
        };
      }
      const update = input.chapters.map((chapter) =>
        prisma.chapter.update({
          where: {
            id: chapter.id,
            courseId: input.courseId,
          },
          data: {
            position: chapter.position,
          },
        })
      );
      await prisma.$transaction(update);
      return {
        status: "success",
        message: "Chapters reordered successfully",
      };
    }),

  delete: protectedProcedure
    .input(z.object({ courseId: z.string(), chapterId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
        });
      }
      const courseWithChapters = await prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
        include: {
          chapters: {
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
      if (!courseWithChapters) {
        return {
          status: "error",
          message: "Course not found",
        };
      }
      const chapters = courseWithChapters.chapters;
      const chapterToDelete = chapters.find(
        (chapter) => chapter.id === input.chapterId
      );
      if (!chapterToDelete) {
        return {
          status: "error",
          message: "Chapter not found",
        };
      }

      const remainingChapters = chapters.filter(
        (chapter) => chapter.id !== input.chapterId
      );
      const update = remainingChapters.map((chapter, index) =>
        prisma.chapter.update({
          where: { id: chapter.id },
          data: { position: index + 1 },
        })
      );
      await prisma.$transaction([
        ...update,
        prisma.lesson.deleteMany({ where: { chapterId: input.chapterId } }),
        prisma.chapter.delete({
          where: { id: input.chapterId },
        }),
      ]);
      return {
        status: "success",
        message: "Chapter deleted successfully",
      };
    }),
});
