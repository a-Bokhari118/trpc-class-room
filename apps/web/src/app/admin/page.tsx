"use client";
import { SectionCards } from "@/components/sidebar/section-cards";
import { DataTable } from "@/components/sidebar/data-table";
import data from "./data.json";
import { EnrollmentsChartCard } from "./_components/enrollments-chart-card";
export default function AdminPage() {
  return (
    <>
      <SectionCards />
      <EnrollmentsChartCard />
      <DataTable data={data} />
    </>
  );
}
