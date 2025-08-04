"use client";

import { trpc } from "@/utils/trpc";
import { queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ChapterSchemaType } from "@repo/shared";

export const useCreateChapter = () => {
  const mutation = useMutation(trpc.chapter.create.mutationOptions());

  const createChapter = (
    data: ChapterSchemaType,
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
          toast.success("Chapter created successfully");

          options?.onSuccess?.();
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to create chapter");
          options?.onError?.();
        },
      }
    );
  };

  return {
    createChapter,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isPending: mutation.isPending,
  };
};
