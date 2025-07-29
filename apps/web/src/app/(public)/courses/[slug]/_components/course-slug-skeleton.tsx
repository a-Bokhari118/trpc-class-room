import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CourseSlugSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        {/* Image Skeleton */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="mt-8 space-y-6">
          {/* Title and Description Skeletons */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          {/* Badges Skeleton */}
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-24" />
            ))}
          </div>

          <Separator className="my-8" />

          {/* Course Description Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>

        {/* Course Content Skeleton */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="space-y-4">
            {/* Chapter Skeletons */}
            {[1, 2, 3].map((index) => (
              <Card key={index} className="p-0 overflow-hidden border-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-10 rounded-full" />
                      <div>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-24 mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-32" />
              </div>

              {/* Course Overview Skeleton */}
              <div className="mb-6 space-y-3 rounded-lg bg-muted/20 p-4">
                <Skeleton className="h-5 w-36" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="size-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button and Benefits Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-11 w-full" />
                <div className="rounded-lg border p-4">
                  <Skeleton className="h-5 w-40 mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="size-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
