"use client";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/public-course-card";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
export default function CoursesPage() {
  const courses = useQuery(trpc.course.getAll.queryOptions());

  if (courses.isPending) {
    return <RenderCoursesSkeleton />;
  }

  if (courses.isError) {
    return <div>Error loading courses</div>;
  }
  return (
    <div className="mt-6">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Explore our courses and find the one that&apos;s right for you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.data?.map((course) => (
          <PublicCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

const RenderCoursesSkeleton = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Explore our courses and find the one that&apos;s right for you.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PublicCourseCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
