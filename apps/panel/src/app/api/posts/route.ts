import { NextResponse } from "next/server";
import {
  createPost,
  DummyJsonError,
  getPosts,
} from "@/lib/dummyjson";
import { getCurrentUser } from "@/lib/server-auth";

type CreatePostRequest = {
  body?: unknown;
  description?: unknown;
  tags?: unknown;
  title?: unknown;
};

function errorResponse(error: unknown) {
  return NextResponse.json(
    {
      message:
        error instanceof DummyJsonError
          ? error.message
          : "Article service is unavailable",
    },
    { status: error instanceof DummyJsonError ? error.status : 502 },
  );
}

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit")) || 10, 1),
    100,
  );

  try {
    return NextResponse.json(await getPosts(page, limit));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let data: CreatePostRequest;

  try {
    data = (await request.json()) as CreatePostRequest;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const body = typeof data.body === "string" ? data.body.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  if (!title || !body) {
    return NextResponse.json(
      { message: "Title and body are required" },
      { status: 400 },
    );
  }

  try {
    const post = await createPost({
      body,
      description,
      tags,
      title,
      userId: user.id,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
