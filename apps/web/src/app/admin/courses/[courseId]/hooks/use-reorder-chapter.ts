"use client";

import { trpc } from "@/utils/trpc";
import { queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReorderChapter = () => {
  const mutation = useMutation(trpc.chapter.reorderChapters.mutationOptions());

  const reorderChapter = (
    data: {
      courseId: string;
      chapters: {
        id: string;
        position: number;
      }[];
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
          toast.success("Chapter reordered successfully");

          options?.onSuccess?.();
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to reorder chapter");
          options?.onError?.();
        },
        onSettled: () => {
          options?.onSettled?.();
        },
      }
    );
  };

  return {
    reorderChapter,
    isReordering: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isPending: mutation.isPending,
  };
};
