"use client";

import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteLesson = () => {
  const mutation = useMutation(trpc.lesson.delete.mutationOptions());

  const deleteLesson = (
    lessonId: string,
    chapterId: string,
    courseId: string,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    mutation.mutate(
      {
        lessonId,
        chapterId,
        courseId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.course.getAdminSingleCourse.queryOptions({
              courseId,
            })
          );
          toast.success("Lesson deleted successfully");
          options?.onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to delete lesson");
          options?.onError?.();
        },
      }
    );
  };

  return {
    deleteLesson,
    isDeleting: mutation.isPending,
  };
};
