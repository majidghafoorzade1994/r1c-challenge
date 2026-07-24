import { NextResponse } from "next/server";
import {
  DummyJsonError,
  registerUser,
} from "@/lib/dummyjson";

type RegisterRequest = {
  email?: unknown;
  password?: unknown;
  username?: unknown;
};

export async function POST(request: Request) {
  let body: RegisterRequest;

  try {
    body = (await request.json()) as RegisterRequest;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password =
    typeof body.password === "string" ? body.password : "";
  const username =
    typeof body.username === "string" ? body.username.trim() : "";

  if (!email || !password || !username) {
    return NextResponse.json(
      { message: "Username, email, and password are required" },
      { status: 400 },
    );
  }

  try {
    const user = await registerUser({ email, password, username });

    return NextResponse.json(
      {
        user: {
          email: user.email,
          id: user.id,
          username: user.username,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof DummyJsonError
            ? error.message
            : "Registration service is unavailable",
      },
      {
        status: error instanceof DummyJsonError ? error.status : 502,
      },
    );
  }
}
