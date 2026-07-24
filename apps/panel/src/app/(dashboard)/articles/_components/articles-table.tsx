"use client";

import {
  Button,
  Ellipsis,
  Menu,
  MenuItem,
  Modal,
  Pagination,
  Toast,
} from "@r1c/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DummyJsonPost } from "@/lib/dummyjson";

const successMessages: Record<
  string,
  { description?: string; title: string }
> = {
  created: {
    description: "Article created successfully",
    title: "Well done!",
  },
  deleted: { title: "Article deleted successfully" },
  updated: {
    description: "Article updated successfully",
    title: "Well done!",
  },
};

function excerpt(body: string) {
  const words = body.trim().split(/\s+/);
  const value = words.slice(0, 20).join(" ");
  return words.length > 20 ? `${value}…` : value;
}

function pageHref(page: number) {
  return page === 1 ? "/articles" : `/articles/page/${page}`;
}

export function ArticlesTable({
  authors,
  currentPage,
  posts,
  status,
  totalPages,
}: {
  authors: Record<number, string>;
  currentPage: number;
  posts: DummyJsonPost[];
  status?: string;
  totalPages: number;
}) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<number>();
  const [deleteTarget, setDeleteTarget] = useState<DummyJsonPost>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>();

  async function handleDelete() {
    if (!deleteTarget || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setError(undefined);

    try {
      const response = await fetch(`/api/posts/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Could not delete the article");
      }

      setDeleteTarget(undefined);
      router.replace(`${pageHref(currentPage)}?status=deleted`);
      router.refresh();
    } catch (deleteError) {
      setDeleteTarget(undefined);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete the article",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const successMessage = status ? successMessages[status] : undefined;

  return (
    <>
      {successMessage && (
        <Toast
          className="dashboard-toast"
          description={successMessage.description}
          title={successMessage.title}
        />
      )}
      {error && (
        <Toast
          className="dashboard-toast"
          description={error}
          title="Something went wrong"
          variant="error"
        />
      )}

      <div className="articles-table-wrap">
        <table className="articles-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Tags</th>
              <th scope="col">Excerpt</th>
              <th scope="col">Created</th>
              <th aria-label="Actions" scope="col" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <span className="article-id">{post.id}</span>
                </td>
                <td>
                  <strong>{post.title}</strong>
                </td>
                <td>@{authors[post.userId] ?? `user_${post.userId}`}</td>
                <td>{post.tags.join(", ") || "—"}</td>
                <td className="article-excerpt">{excerpt(post.body)}</td>
                <td>—</td>
                <td className="article-actions">
                  <Button
                    aria-expanded={activeMenu === post.id}
                    aria-haspopup="menu"
                    aria-label={`Actions for ${post.title}`}
                    icon={<Ellipsis size={20} />}
                    iconOnly
                    onClick={() =>
                      setActiveMenu((current) =>
                        current === post.id ? undefined : post.id,
                      )
                    }
                    variant="secondary"
                  />
                  {activeMenu === post.id && (
                    <Menu className="article-actions__menu" data-floating="true">
                      <MenuItem
                        onClick={() =>
                          router.push(`/articles/edit/${post.id}`)
                        }
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setActiveMenu(undefined);
                          setDeleteTarget(post);
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="articles-pagination">
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => router.push(pageHref(page))}
          totalPages={totalPages}
        />
      </div>

      <Modal
        cancelLabel="Cancel"
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onCancel={() => !isDeleting && setDeleteTarget(undefined)}
        onConfirm={handleDelete}
        open={Boolean(deleteTarget)}
        title="Delete Article"
        variant="danger"
      >
        Are you sure you want to delete this article?
      </Modal>
    </>
  );
}
