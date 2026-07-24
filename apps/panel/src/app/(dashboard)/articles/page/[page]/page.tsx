import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlesPage } from "../../_components/articles-page";

export const metadata: Metadata = {
  title: "Articles | Blog Admin Panel",
};

export default async function PaginatedArticlesPage({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const page = Number((await params).page);
  const { status } = await searchParams;

  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }

  return <ArticlesPage page={page} status={status} />;
}
