"use client";

import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteChapter = () => {
  const mutation = useMutation(trpc.chapter.delete.mutationOptions());

  const deleteChapter = (
    chapterId: string,
    courseId: string,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    mutation.mutate(
      {
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
          toast.success("Chapter deleted successfully");
          options?.onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to delete chapter");
          options?.onError?.();
        },
      }
    );
  };

  return {
    deleteChapter,
    isDeleting: mutation.isPending,
  };
};
