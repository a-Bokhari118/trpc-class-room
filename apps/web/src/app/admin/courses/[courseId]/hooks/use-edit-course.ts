"use client";

import { trpc } from "@/utils/trpc";
import { queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CourseSchemaType } from "@repo/shared";

export const useEditCourse = (courseId: string) => {
  const router = useRouter();

  const mutation = useMutation(trpc.course.edit.mutationOptions());

  const editCourse = (
    data: CourseSchemaType,
    options?: {
      onSuccess?: () => void;
      onError?: () => void;
      redirectToList?: boolean;
    }
  ) => {
    mutation.mutate(
      {
        courseId,
        data,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.course.getAdminSingleCourse.queryOptions({
              courseId,
            })
          );
          toast.success("Course updated successfully");

          if (options?.redirectToList !== false) {
            router.push("/admin/courses");
          }

          options?.onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to update course");
          options?.onError?.();
        },
      }
    );
  };

  return {
    editCourse,
    isEditing: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isPending: mutation.isPending,
  };
};
