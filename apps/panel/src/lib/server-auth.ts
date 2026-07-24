import "server-only";

import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/dummyjson";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    return await getAuthUser(accessToken);
  } catch {
    return null;
  }
}
