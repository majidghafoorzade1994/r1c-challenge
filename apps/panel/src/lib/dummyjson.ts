const dummyJsonBaseUrl =
  process.env.DUMMYJSON_API_URL ?? "https://dummyjson.com";

type DummyJsonErrorBody = {
  message?: string;
};

type DummyJsonUsersResponse = {
  users: Array<{
    email: string;
    id?: number;
    username: string;
  }>;
};

export type DummyJsonPost = {
  body: string;
  description?: string;
  id: number;
  reactions?: {
    dislikes: number;
    likes: number;
  };
  tags: string[];
  title: string;
  userId: number;
  views?: number;
};

export type DummyJsonPostsResponse = {
  limit: number;
  posts: DummyJsonPost[];
  skip: number;
  total: number;
};

export type DummyJsonUserSummary = {
  id: number;
  username: string;
};

export type DummyJsonAuthUser = {
  accessToken: string;
  refreshToken: string;
} & DummyJsonUser;

export type DummyJsonUser = {
  email: string;
  firstName: string;
  id: number;
  image: string;
  lastName: string;
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
      body.message ?? "DummyJSON request failed",
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

export function getAuthUser(
  accessToken: string,
): Promise<DummyJsonUser> {
  return dummyJsonRequest<DummyJsonUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getPosts(
  page = 1,
  limit = 10,
): Promise<DummyJsonPostsResponse> {
  const query = new URLSearchParams({
    limit: String(limit),
    skip: String((page - 1) * limit),
  });

  return dummyJsonRequest<DummyJsonPostsResponse>(
    `/posts?${query.toString()}`,
  );
}

export function getPost(id: number): Promise<DummyJsonPost> {
  return dummyJsonRequest<DummyJsonPost>(`/posts/${id}`);
}

export function getPostTags(): Promise<string[]> {
  return dummyJsonRequest<string[]>("/posts/tag-list");
}

export async function getUserSummaries(): Promise<DummyJsonUserSummary[]> {
  const query = new URLSearchParams({
    limit: "0",
    select: "id,username",
  });
  const result = await dummyJsonRequest<{
    users: DummyJsonUserSummary[];
  }>(`/users?${query.toString()}`);

  return result.users;
}

export function createPost(input: {
  body: string;
  description?: string;
  tags: string[];
  title: string;
  userId: number;
}): Promise<DummyJsonPost> {
  return dummyJsonRequest<DummyJsonPost>("/posts/add", {
    body: JSON.stringify(input),
    method: "POST",
  });
}

export function updatePost(
  id: number,
  input: {
    body: string;
    description?: string;
    tags: string[];
    title: string;
  },
): Promise<DummyJsonPost> {
  return dummyJsonRequest<DummyJsonPost>(`/posts/${id}`, {
    body: JSON.stringify(input),
    method: "PUT",
  });
}

export function deletePost(id: number): Promise<
  DummyJsonPost & {
    deletedOn: string;
    isDeleted: boolean;
  }
> {
  return dummyJsonRequest(`/posts/${id}`, {
    method: "DELETE",
  });
}
