"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "./_components/edit-course-form";
import { CourseStructure } from "./_components/course-structure";
import { use } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const {
    data: course,
    isPending,
    isError,
  } = useQuery(
    trpc.course.getAdminSingleCourse.queryOptions({
      courseId: courseId,
    })
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading course</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Edit Course: <span className="text-primary">{course.title}</span>
      </h1>

      <Tabs defaultValue="info" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Course Info</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Course Info</CardTitle>
              <CardDescription>
                Edit the course information here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>Edit the course content here.</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
