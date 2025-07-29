"use client";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { DataTable } from "@/components/sidebar/data-table";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import data from "./data.json";
export default function AdminPage() {
  const {
    data: enrollmentsStats,
    isPending,
    isError,
  } = useQuery(trpc.dashboard.getEnrollmentsStats.queryOptions());
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading enrollments stats</div>;
  }
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={enrollmentsStats} />

      <DataTable data={data} />
    </>
  );
}
