# API reference

## Base URLs

Internal application routes use the panel origin:

```text
/api/...
```

The upstream base URL is:

```text
https://dummyjson.com
```

or the value of `DUMMYJSON_API_URL`.

## Response conventions

Internal handlers return JSON.

Common error body:

```json
{
  "message": "Human-readable error"
}
```

Typical statuses:

| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `200`  | Successful read, update, delete, login, or logout             |
| `201`  | Simulated user or article creation                            |
| `400`  | Invalid JSON, invalid ID, or failed required-field validation |
| `401`  | Missing/invalid session or invalid login credentials          |
| `404`  | Upstream resource not found                                   |
| `502`  | Unexpected upstream/service failure                           |

## Authentication endpoints

### `POST /api/auth/login`

Request:

```json
{
  "email": "emily.johnson@x.dummyjson.com",
  "password": "emilyspass"
}
```

Success:

```json
{
  "user": {
    "id": 1,
    "email": "emily.johnson@x.dummyjson.com",
    "firstName": "Emily",
    "lastName": "Johnson",
    "username": "emilys",
    "image": "https://..."
  }
}
```

Side effect: sets `access_token` and `refresh_token` HTTP-only cookies.

Upstream mapping:

```text
GET  /users/filter
POST /auth/login
```

### `POST /api/auth/register`

Request:

```json
{
  "username": "new-user",
  "email": "new-user@example.com",
  "password": "password"
}
```

Success status: `201`.

Upstream mapping:

```text
POST /users/add
```

Registration is simulated and non-persistent.

### `POST /api/auth/logout`

Request body: none.

Success:

```json
{
  "success": true
}
```

Side effect: expires both session cookies.

## Post collection endpoint

### `GET /api/posts`

Requires authentication.

Query parameters:

| Name    | Default | Bounds       | Meaning        |
| ------- | ------- | ------------ | -------------- |
| `page`  | `1`     | Minimum `1`  | One-based page |
| `limit` | `10`    | `1` to `100` | Page size      |

Example:

```text
GET /api/posts?page=2&limit=10
```

The server converts page/limit to DummyJSON `skip`/`limit`.

Response:

```json
{
  "posts": [],
  "total": 251,
  "skip": 10,
  "limit": 10
}
```

Upstream mapping:

```text
GET /posts?limit=:limit&skip=:skip
```

### `POST /api/posts`

Requires authentication.

Request:

```json
{
  "title": "Article title",
  "description": "Short description",
  "body": "Full article body",
  "tags": ["news", "example"]
}
```

Validation:

- `title` must be a non-empty string.
- `body` must be a non-empty string.
- Non-string tags are discarded.
- `description` is optional.

The authenticated user ID is inserted as `userId`.

Success status: `201`.

Upstream mapping:

```text
POST /posts/add
```

## Individual post endpoint

All methods require authentication and a positive integer ID.

### `GET /api/posts/:id`

Upstream mapping:

```text
GET /posts/:id
```

### `PUT /api/posts/:id`

Request:

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "body": "Updated body",
  "tags": ["updated"]
}
```

Validation matches article creation.

Upstream mapping:

```text
PUT /posts/:id
```

### `DELETE /api/posts/:id`

Request body: none.

Upstream response includes:

```json
{
  "isDeleted": true,
  "deletedOn": "..."
}
```

Upstream mapping:

```text
DELETE /posts/:id
```

## Tags endpoint

### `GET /api/posts/tags`

Requires authentication.

Returns a JSON array of tag strings sorted alphabetically.

Upstream mapping:

```text
GET /posts/tag-list
```

## Direct server helpers

`apps/panel/src/lib/dummyjson.ts` also exports server-side helpers:

| Function           | Upstream operation                 |
| ------------------ | ---------------------------------- |
| `loginWithEmail`   | User filter followed by auth login |
| `registerUser`     | Add user                           |
| `getAuthUser`      | Current authenticated user         |
| `getPosts`         | Paginated posts                    |
| `getPost`          | One post                           |
| `getPostTags`      | Tag list                           |
| `getUserSummaries` | All IDs/usernames                  |
| `createPost`       | Add post                           |
| `updatePost`       | Update post                        |
| `deletePost`       | Delete post                        |

All requests use:

- `cache: "no-store"`
- JSON content headers
- `DummyJsonError` for non-2xx responses

## API design notes

- The internal API is not a persistence layer.
- Response schemas are typed but not runtime-schema validated.
- Unknown upstream response shapes may still cause runtime issues.
- GET pages sometimes call server helpers directly rather than their own internal HTTP API to avoid a redundant server-to-self request.
