import { NextResponse } from "next/server";
import { DummyJsonError, getPostTags } from "@/lib/dummyjson";
import { getCurrentUser } from "@/lib/server-auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const tags = await getPostTags();
    return NextResponse.json([...tags].sort((a, b) => a.localeCompare(b)));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof DummyJsonError
            ? error.message
            : "Tag service is unavailable",
      },
      { status: error instanceof DummyJsonError ? error.status : 502 },
    );
  }
}
