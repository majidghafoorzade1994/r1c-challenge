"use client";

import {
  Button,
  Checkbox,
  Field,
  Input,
  Textarea,
  Toast,
} from "@r1c/ui";
import { useRouter } from "next/navigation";
import type { FormEvent, KeyboardEvent } from "react";
import { useMemo, useState } from "react";

type ArticleFormErrors = {
  body?: string;
  title?: string;
};

export type ArticleFormProps = {
  article?: {
    body: string;
    description?: string;
    id: number;
    tags: string[];
    title: string;
  };
  tags: string[];
};

function initialDescription(body?: string) {
  if (!body) {
    return "";
  }

  const words = body.trim().split(/\s+/);
  return words.slice(0, 20).join(" ");
}

export function ArticleForm({ article, tags }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(article);
  const [allTags, setAllTags] = useState(tags);
  const [selectedTags, setSelectedTags] = useState(
    () => new Set(article?.tags ?? []),
  );
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<ArticleFormErrors>({});
  const [apiError, setApiError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sortedTags = useMemo(
    () => [...allTags].sort((a, b) => a.localeCompare(b)),
    [allTags],
  );

  function toggleTag(tag: string) {
    setSelectedTags((current) => {
      const next = new Set(current);

      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }

      return next;
    });
  }

  function addTag() {
    const value = newTag.trim().toLowerCase();

    if (!value) {
      return;
    }

    setAllTags((current) =>
      current.some((tag) => tag.toLowerCase() === value)
        ? current
        : [...current, value],
    );
    setSelectedTags((current) => new Set(current).add(value));
    setNewTag("");
  }

  function handleNewTagKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const body = String(data.get("body") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const nextErrors: ArticleFormErrors = {};

    if (!title) {
      nextErrors.title = "Required field";
    }

    if (!body) {
      nextErrors.body = "Required field";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setApiError(undefined);
    setIsSubmitting(true);

    try {
      const response = await fetch(
        article ? `/api/posts/${article.id}` : "/api/posts",
        {
          body: JSON.stringify({
            body,
            description,
            tags: [...selectedTags],
            title,
          }),
          headers: { "Content-Type": "application/json" },
          method: article ? "PUT" : "POST",
        },
      );
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not save the article");
      }

      router.push(`/articles?status=${isEditing ? "updated" : "created"}`);
      router.refresh();
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Could not save the article",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {apiError && (
        <Toast
          className="dashboard-toast"
          description={apiError}
          title="Something went wrong"
          variant="error"
        />
      )}

      <div className="article-editor">
        <section className="dashboard-card article-form-card">
          <header className="dashboard-card__header">
            <h1>{isEditing ? "Edit article" : "New article"}</h1>
          </header>
          <div className="dashboard-card__body">
            <form className="article-form" noValidate onSubmit={handleSubmit}>
              <Field
                error={errors.title}
                htmlFor="article-title"
                label="Title"
              >
                <Input
                  defaultValue={article?.title}
                  disabled={isSubmitting}
                  id="article-title"
                  invalid={Boolean(errors.title)}
                  name="title"
                  onChange={() =>
                    setErrors((current) => ({
                      ...current,
                      title: undefined,
                    }))
                  }
                  placeholder="Enter article title"
                />
              </Field>

              <Field htmlFor="article-description" label="Description">
                <Input
                  defaultValue={
                    article?.description ?? initialDescription(article?.body)
                  }
                  disabled={isSubmitting}
                  id="article-description"
                  name="description"
                  placeholder="Enter a short description"
                />
              </Field>

              <Field
                error={errors.body}
                htmlFor="article-body"
                label="Body"
              >
                <Textarea
                  className="article-form__body"
                  defaultValue={article?.body}
                  disabled={isSubmitting}
                  id="article-body"
                  invalid={Boolean(errors.body)}
                  name="body"
                  onChange={() =>
                    setErrors((current) => ({
                      ...current,
                      body: undefined,
                    }))
                  }
                  placeholder="Write your article"
                />
              </Field>

              <Button loading={isSubmitting} type="submit">
                Submit
              </Button>
            </form>
          </div>
        </section>

        <aside className="dashboard-card article-tags">
          <div className="dashboard-card__body">
            <label className="article-tags__label" htmlFor="new-tag">
              Tags
            </label>
            <Input
              disabled={isSubmitting}
              id="new-tag"
              onBlur={addTag}
              onChange={(event) => setNewTag(event.target.value)}
              onKeyDown={handleNewTagKeyDown}
              placeholder="New tag"
              value={newTag}
            />
            <div className="article-tags__list">
              {sortedTags.map((tag) => (
                <label className="article-tag" key={tag}>
                  <Checkbox
                    checked={selectedTags.has(tag)}
                    disabled={isSubmitting}
                    onChange={() => toggleTag(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
