"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const { mutate: enroll, isPending } = useMutation(
    trpc.course.enrollInCourse.mutationOptions()
  );

  const onSubmit = () => {
    enroll(
      { courseId },
      {
        onSuccess: () => {
          toast.success("Enrolled in course");
        },
        onError: () => {
          toast.error("Unexpected error occurred");
        },
      }
    );
  };
  return (
    <Button className="w-full" onClick={onSubmit} disabled={isPending}>
      {isPending ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}
