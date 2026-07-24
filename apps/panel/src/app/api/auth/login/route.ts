import { NextResponse } from "next/server";
import {
  DummyJsonError,
  loginWithEmail,
} from "@/lib/dummyjson";

type LoginRequest = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: LoginRequest;

  try {
    body = (await request.json()) as LoginRequest;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password =
    typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const user = await loginWithEmail(email, password);
    const response = NextResponse.json({
      user: {
        email: user.email,
        firstName: user.firstName,
        id: user.id,
        image: user.image,
        lastName: user.lastName,
        username: user.username,
      },
    });
    const cookieOptions = {
      httpOnly: true,
      maxAge: 30 * 60,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };

    response.cookies.set("access_token", user.accessToken, cookieOptions);
    response.cookies.set("refresh_token", user.refreshToken, cookieOptions);

    return response;
  } catch (error) {
    const status =
      error instanceof DummyJsonError && error.status >= 400
        ? error.status
        : 502;

    return NextResponse.json(
      {
        message:
          status === 401
            ? "Username and/or Password is invalid"
            : "Authentication service is unavailable",
      },
      { status },
    );
  }
}
