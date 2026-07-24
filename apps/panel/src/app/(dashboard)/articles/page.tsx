import type { Metadata } from "next";
import { ArticlesPage } from "./_components/articles-page";

export const metadata: Metadata = {
  title: "Articles | Blog Admin Panel",
};

export default async function ArticlesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <ArticlesPage page={1} status={status} />;
}
