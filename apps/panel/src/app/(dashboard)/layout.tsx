import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "./_components/dashboard-shell";
import { getCurrentUser } from "@/lib/server-auth";
import "./dashboard.css";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell username={user.username}>
      {children}
    </DashboardShell>
  );
}
