import { NextResponse } from "next/server";
import {
  deletePost,
  DummyJsonError,
  getPost,
  updatePost,
} from "@/lib/dummyjson";
import { getCurrentUser } from "@/lib/server-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdatePostRequest = {
  body?: unknown;
  description?: unknown;
  tags?: unknown;
  title?: unknown;
};

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

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

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseId((await context.params).id);

  if (!id) {
    return NextResponse.json(
      { message: "Invalid article id" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await getPost(id));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseId((await context.params).id);

  if (!id) {
    return NextResponse.json(
      { message: "Invalid article id" },
      { status: 400 },
    );
  }

  let data: UpdatePostRequest;

  try {
    data = (await request.json()) as UpdatePostRequest;
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
    return NextResponse.json(
      await updatePost(id, { body, description, tags, title }),
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseId((await context.params).id);

  if (!id) {
    return NextResponse.json(
      { message: "Invalid article id" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await deletePost(id));
  } catch (error) {
    return errorResponse(error);
  }
}
