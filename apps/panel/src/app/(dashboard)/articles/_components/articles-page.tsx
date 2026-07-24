import { notFound } from "next/navigation";
import {
  getPosts,
  getUserSummaries,
} from "@/lib/dummyjson";
import { ArticlesTable } from "./articles-table";

const pageSize = 10;

export async function ArticlesPage({
  page,
  status,
}: {
  page: number;
  status?: string;
}) {
  const [{ posts, total }, users] = await Promise.all([
    getPosts(page, pageSize),
    getUserSummaries(),
  ]);
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  if (page < 1 || page > totalPages) {
    notFound();
  }

  const authors = Object.fromEntries(
    users.map((user) => [user.id, user.username]),
  );

  return (
    <section className="dashboard-card articles-card">
      <header className="dashboard-card__header">
        <h1>All Posts</h1>
      </header>
      <div className="dashboard-card__body articles-card__body">
        <ArticlesTable
          authors={authors}
          currentPage={page}
          posts={posts}
          status={status}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
}
