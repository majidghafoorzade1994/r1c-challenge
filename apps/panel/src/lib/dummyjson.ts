const dummyJsonBaseUrl =
  process.env.DUMMYJSON_API_URL ?? "https://dummyjson.com";

type DummyJsonErrorBody = {
  message?: string;
};

type DummyJsonUsersResponse = {
  users: Array<{
    email: string;
    username: string;
  }>;
};

export type DummyJsonAuthUser = {
  accessToken: string;
  email: string;
  firstName: string;
  id: number;
  image: string;
  lastName: string;
  refreshToken: string;
  username: string;
};

export type DummyJsonCreatedUser = {
  email: string;
  id: number;
  password: string;
  username: string;
};

export class DummyJsonError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "DummyJsonError";
  }
}

async function dummyJsonRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${dummyJsonBaseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json()) as T & DummyJsonErrorBody;

  if (!response.ok) {
    throw new DummyJsonError(
      body.message ?? "Authentication service request failed",
      response.status,
    );
  }

  return body;
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<DummyJsonAuthUser> {
  const query = new URLSearchParams({
    key: "email",
    value: email,
    select: "username,email",
  });
  const result = await dummyJsonRequest<DummyJsonUsersResponse>(
    `/users/filter?${query.toString()}`,
  );
  const user = result.users.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    throw new DummyJsonError(
      "Username and/or Password is invalid",
      401,
    );
  }

  try {
    return await dummyJsonRequest<DummyJsonAuthUser>("/auth/login", {
      body: JSON.stringify({
        expiresInMins: 30,
        password,
        username: user.username,
      }),
      method: "POST",
    });
  } catch (error) {
    if (
      error instanceof DummyJsonError &&
      (error.status === 400 || error.status === 401)
    ) {
      throw new DummyJsonError(
        "Username and/or Password is invalid",
        401,
      );
    }

    throw error;
  }
}

export function registerUser(input: {
  email: string;
  password: string;
  username: string;
}): Promise<DummyJsonCreatedUser> {
  return dummyJsonRequest<DummyJsonCreatedUser>("/users/add", {
    body: JSON.stringify(input),
    method: "POST",
  });
}
