"use client";

import { trpc } from "@/utils/trpc";
import { queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { CourseSchemaType } from "@repo/shared";

export const useCreateCourse = () => {
  const router = useRouter();

  const mutation = useMutation(trpc.course.create.mutationOptions());

  const createCourse = (
    data: CourseSchemaType,
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
            trpc.course.getAdminCourses.queryOptions()
          );
          toast.success("Course created successfully");

          options?.onSuccess?.();
        },
        onError: (error) => {
          console.log(error);
          toast.error("Failed to create course");
          options?.onError?.();
        },
      }
    );
  };

  return {
    createCourse,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    isPending: mutation.isPending,
  };
};
