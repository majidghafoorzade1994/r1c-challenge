import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleForm } from "../../_components/article-form";
import { DummyJsonError, getPost, getPostTags } from "@/lib/dummyjson";

export const metadata: Metadata = {
  title: "Edit article | Blog Admin Panel",
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  let article;
  let tags;

  try {
    [article, tags] = await Promise.all([
      getPost(id),
      getPostTags(),
    ]);
  } catch (error) {
    if (error instanceof DummyJsonError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return <ArticleForm article={article} tags={tags} />;
}
