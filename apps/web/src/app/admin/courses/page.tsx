"use client";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from "./_components/admin-course-card";
import { EmptyState } from "@/components/empty-state";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

const CoursesPage = () => {
  const {
    data: courses,
    isPending,
    isError,
  } = useQuery(trpc.course.getAdminCourses.queryOptions());

  if (isPending) {
    return <AdminCourseCardSkeletonLayout />;
  }
  if (isError) {
    return <div>Error loading courses</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusCircle className="size-4" />
          New Course
        </Link>
      </div>
      {courses.length === 0 ? (
        <EmptyState createLink="/admin/courses/create" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
};

export default CoursesPage;

const AdminCourseCardSkeletonLayout = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <div className={buttonVariants()}>
          <PlusCircle className="size-4" />
          New Course
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <AdminCourseCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};
