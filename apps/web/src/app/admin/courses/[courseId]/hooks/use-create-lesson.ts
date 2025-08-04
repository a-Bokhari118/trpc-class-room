"use client";

import { trpc } from "@/utils/trpc";
import { queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { LessonSchemaType } from "@repo/shared";

export const useCreateLesson = () => {
  const mutation = useMutation(trpc.lesson.create.mutationOptions());

  const createLesson = (
    data: LessonSchemaType,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    mutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.course.getAdminSingleCourse.queryOptions({
              courseId: data.courseId,
            })
          );
          toast.success("Lesson created successfully");

          options?.onSuccess?.();
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to create lesson");
          options?.onError?.();
        },
      }
    );
  };

  return {
    createLesson,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isPending: mutation.isPending,
  };
};
