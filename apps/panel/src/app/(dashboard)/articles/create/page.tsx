import type { Metadata } from "next";
import { ArticleForm } from "../_components/article-form";
import { getPostTags } from "@/lib/dummyjson";

export const metadata: Metadata = {
  title: "New article | Blog Admin Panel",
};

export default async function CreateArticlePage() {
  const tags = await getPostTags();

  return <ArticleForm tags={tags} />;
}
