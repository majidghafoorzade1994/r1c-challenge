"use client";

import {
  AppHeader,
  Sidebar,
} from "@r1c/ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function DashboardShell({
  children,
  username,
}: {
  children: ReactNode;
  username: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorPage =
    pathname === "/articles/create" || pathname.startsWith("/articles/edit/");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="dashboard-shell">
      <AppHeader
        className="dashboard-header"
        onLogout={handleLogout}
        user={username}
      />
      <div className="dashboard-layout">
        <Sidebar className="dashboard-sidebar">
          <Link
            aria-current={!isEditorPage ? "page" : undefined}
            className={`r1c-sidebar__item${!isEditorPage ? " is-active" : ""}`}
            href="/articles"
          >
            <span>All Articles</span>
          </Link>
          <Link
            aria-current={isEditorPage ? "page" : undefined}
            className={`r1c-sidebar__item${isEditorPage ? " is-active" : ""}`}
            href="/articles/create"
          >
            <span>New Article</span>
          </Link>
        </Sidebar>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
