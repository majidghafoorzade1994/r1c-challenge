# Authentication

## Overview

Authentication is implemented as a server-side proxy around DummyJSON.

The browser communicates with internal Next.js API routes. Tokens returned by DummyJSON are stored in HTTP-only cookies and are not exposed to the authentication client component.

## Login

Endpoint:

```text
POST /api/auth/login
```

Request:

```json
{
  "email": "emily.johnson@x.dummyjson.com",
  "password": "emilyspass"
}
```

### Why email requires translation

The UI design uses email, but DummyJSON `/auth/login` expects `username`.

`loginWithEmail()` performs:

1. `GET /users/filter?key=email&value=...&select=username,email`
2. A case-insensitive verification of the returned email
3. `POST /auth/login` using the matching username and submitted password

Missing users and DummyJSON credential errors are normalized to:

```json
{
  "message": "Username and/or Password is invalid"
}
```

with HTTP status `401`.

### Cookies

Successful login creates:

| Cookie          | Contents                | JavaScript readable | Lifetime   |
| --------------- | ----------------------- | ------------------- | ---------- |
| `access_token`  | DummyJSON access token  | No                  | 30 minutes |
| `refresh_token` | DummyJSON refresh token | No                  | 30 minutes |

Cookie properties:

- `httpOnly: true`
- `sameSite: "lax"`
- `path: "/"`
- `secure: true` in production

The route response includes a safe user object but excludes both tokens.

## Registration

Endpoint:

```text
POST /api/auth/register
```

Request:

```json
{
  "username": "new-user",
  "email": "user@example.com",
  "password": "password"
}
```

This calls DummyJSON `/users/add` and returns a reduced user representation with status `201`.

DummyJSON does not persist the new user. A newly submitted registration cannot be expected to authenticate later. Registration exists to exercise the designed flow and API contract.

## Logout

Endpoint:

```text
POST /api/auth/logout
```

The route expires both token cookies by setting their expiration date to the Unix epoch. The client then replaces the current route with `/login` and refreshes the router.

Logout does not call a DummyJSON revocation endpoint.

## Current user resolution

`getCurrentUser()` is a server-only function:

1. Read `access_token` from `next/headers` cookies.
2. Return `null` when the cookie is missing.
3. Call DummyJSON `/auth/me` with a Bearer token.
4. Return `null` if validation fails for any reason.

This intentionally gives callers a simple authenticated-user-or-null contract.

## Dashboard protection

The dashboard layout awaits `getCurrentUser()`.

```text
Valid user   -> render DashboardShell
No user      -> redirect("/login")
```

Post API routes independently perform the same check and return:

```json
{
  "message": "Unauthorized"
}
```

with status `401`.

## Client form validation

Authentication errors appear only after form submission.

Rules:

- Username is required for registration.
- Email is required and checked against a basic email pattern.
- Password is required.

While submitting:

- Inputs are disabled.
- The shared `Button` shows its loading state.
- Duplicate submission is prevented by disabled controls.

Field errors clear as the relevant input changes. API errors appear through the shared `Toast` component.

## Security properties

Current protections:

- Tokens are HTTP-only.
- Production cookies use `Secure`.
- Cookies use `SameSite=Lax`.
- API handlers validate request value types.
- Protected mutations re-check the session server-side.
- Upstream URLs and tokens are not placed in client code.

Not currently implemented:

- Refresh-token rotation
- Automatic access-token refresh
- CSRF tokens
- Rate limiting
- Account lockout
- Token revocation
- Role-based authorization
- Middleware-based route protection

See [Limitations](limitations.md) for recommended production changes.
