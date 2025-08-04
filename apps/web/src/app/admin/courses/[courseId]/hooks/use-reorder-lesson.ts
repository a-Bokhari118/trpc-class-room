"use client";

import { trpc } from "@/utils/trpc";
import { queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReorderLesson = () => {
  const mutation = useMutation(trpc.lesson.reorderLessons.mutationOptions());

  const reorderLesson = (
    data: {
      courseId: string;
      lessons: {
        id: string;
        position: number;
      }[];
      chapterId: string;
    },
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
      onSettled?: () => void;
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
          toast.success("Lesson reordered successfully");

          options?.onSuccess?.();
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to reorder lesson");
          options?.onError?.();
        },
        onSettled: () => {
          options?.onSettled?.();
        },
      }
    );
  };

  return {
    reorderLesson,
    isReordering: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isPending: mutation.isPending,
  };
};
