"use client";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
export const EnrollmentsChartCard = () => {
  const {
    data: enrollmentsStats,
    isPending,
    isError,
  } = useQuery(trpc.dashboard.getEnrollmentsStats.queryOptions());
  if (isPending) {
    return <Skeleton className="h-[390px] w-full" />;
  }
  if (isError) {
    return <div>Error loading enrollments stats</div>;
  }
  return <ChartAreaInteractive data={enrollmentsStats} />;
};
