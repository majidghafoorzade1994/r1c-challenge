import { NextResponse } from "next/server";

export function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("access_token", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set("refresh_token", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
