import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { courseSchema, editCourseSchema } from "@repo/shared";

export const courseRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        smallDescription: true,
        category: true,
        duration: true,
        level: true,
        fileKey: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getSingleCourse: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const course = await prisma.course.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          smallDescription: true,
          category: true,
          duration: true,
          level: true,
          fileKey: true,
          description: true,
          chapters: {
            select: {
              id: true,
              title: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                },
                orderBy: {
                  position: "asc",
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return course;
    }),

  getCourseSidebarData: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const { slug } = input;
      const user = ctx.session.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this course",
        });
      }

      const course = await prisma.course.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          smallDescription: true,
          category: true,
          duration: true,
          level: true,
          fileKey: true,
          chapters: {
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  position: true,
                  description: true,
                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      lessonId: true,
                      completed: true,
                    },
                  },
                },
                orderBy: {
                  position: "asc",
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }
    }),

  getAdminCourses: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        smallDescription: true,
        duration: true,
        price: true,
        level: true,
        fileKey: true,
        slug: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courses;
  }),

  getIsEnrolled: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
        });
      }

      const enrollment = await prisma.enrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: input.courseId,
            userId: user.id,
          },
        },
        select: {
          status: true,
        },
      });
      if (enrollment?.status === "ACTIVE") {
        return true;
      }
      return false;
    }),

  getAdminSingleCourse: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to access this resource",
        });
      }
      const course = await prisma.course.findUnique({
        where: {
          id: input.courseId,
        },
        select: {
          id: true,
          title: true,
          smallDescription: true,
          duration: true,
          price: true,
          level: true,
          fileKey: true,
          slug: true,
          status: true,
          category: true,
          description: true,
          chapters: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                orderBy: {
                  position: "asc",
                },
                select: {
                  id: true,
                  title: true,
                  description: true,
                  thumbnailKey: true,
                  videoKey: true,
                  position: true,
                },
              },
            },
          },
        },
      });
      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }
      return course;
    }),
  create: protectedProcedure
    .input(courseSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const validatedInput = courseSchema.safeParse(input);
      try {
        if (!validatedInput.success) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: validatedInput.error.message,
          });
        }
        const course = await prisma.course.create({
          data: {
            ...validatedInput.data,
            userId: user.id,
            stripePriceId: Math.random().toString(36).substring(2, 15),
            price: Number(validatedInput.data.price),
            duration: Number(validatedInput.data.duration),
          },
        });

        return {
          status: "success",
          message: "Course created successfully",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create course",
        });
      }
    }),

  edit: protectedProcedure
    .input(editCourseSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      console.log(input);
      const validatedInput = courseSchema.safeParse(input.data);
      if (!validatedInput.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: validatedInput.error.message,
        });
      }
      try {
        await prisma.course.update({
          where: {
            id: input.courseId,
          },
          data: {
            ...validatedInput.data,
            price: Number(validatedInput.data.price),
            duration: Number(validatedInput.data.duration),
          },
        });
        return {
          status: "success",
          message: "Course updated successfully",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update course",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { courseId } = input;
      const user = ctx.session.user;
      await prisma.course.delete({
        where: {
          id: courseId,
        },
      });

      return {
        status: "success",
        message: "Course deleted successfully",
      };
    }),

  enrollInCourse: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { courseId } = input;
      const user = ctx.session.user;

      const course = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
        },
      });

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          courseId,
          userId: user.id,
        },
      });

      if (existingEnrollment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already enrolled in this course",
        });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          courseId,
          userId: user.id,
          amount: course.price,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
      });

      return enrollment;
    }),
});
