# Routing

The panel uses the Next.js App Router.

## Page routes

| URL                    | Access    | Implementation                              | Purpose                     |
| ---------------------- | --------- | ------------------------------------------- | --------------------------- |
| `/`                    | Public    | `app/page.tsx`                              | Redirects to `/articles`    |
| `/login`               | Public    | `(auth)/login/page.tsx`                     | Sign-in page                |
| `/register`            | Public    | `(auth)/register/page.tsx`                  | Simulated registration page |
| `/articles`            | Protected | `(dashboard)/articles/page.tsx`             | First article page          |
| `/articles/page/:page` | Protected | `(dashboard)/articles/page/[page]/page.tsx` | Additional article pages    |
| `/articles/create`     | Protected | `(dashboard)/articles/create/page.tsx`      | Create form                 |
| `/articles/edit/:id`   | Protected | `(dashboard)/articles/edit/[id]/page.tsx`   | Edit form                   |

## API routes

| Method   | URL                  | Purpose                              |
| -------- | -------------------- | ------------------------------------ |
| `POST`   | `/api/auth/login`    | Authenticate and set session cookies |
| `POST`   | `/api/auth/register` | Simulate user creation               |
| `POST`   | `/api/auth/logout`   | Expire session cookies               |
| `GET`    | `/api/posts`         | Return paginated posts               |
| `POST`   | `/api/posts`         | Simulate post creation               |
| `GET`    | `/api/posts/:id`     | Return one post                      |
| `PUT`    | `/api/posts/:id`     | Simulate post replacement/update     |
| `DELETE` | `/api/posts/:id`     | Simulate post deletion               |
| `GET`    | `/api/posts/tags`    | Return alphabetically sorted tags    |

## Route groups

### `(auth)`

The `(auth)` segment:

- Does not appear in the URL
- Applies the centered authentication layout
- Shares `AuthForm` between login and registration

### `(dashboard)`

The `(dashboard)` segment:

- Does not appear in the URL
- Protects all descendant pages
- Loads the current user
- Supplies the header, sidebar, and logout interaction

## Dynamic segments

### Pagination

`/articles/page/[page]` parses the segment as a positive integer. Invalid values call `notFound()`.

Page one has a canonical application route of `/articles`. The pagination client helper deliberately generates:

```text
1       -> /articles
2..N    -> /articles/page/:page
```

### Article edit

`/articles/edit/[id]` requires a positive integer. The page loads the article and tags in parallel. A DummyJSON 404 is translated to Next.js `notFound()`.

## Query parameters

The article list recognizes:

```text
?status=created
?status=updated
?status=deleted
```

These values display success toasts after client-side mutations navigate back to the list.

## Navigation behavior

Internal page links use `next/link`.

Programmatic transitions use:

- `router.push()` for login, registration, pagination, edit, and save flows
- `router.replace()` after logout and deletion where replacing history is preferred
- `router.refresh()` when server-rendered data or session state may need revalidation

## Route protection

Protection occurs at two levels:

1. `(dashboard)/layout.tsx` redirects unauthenticated page requests.
2. Each post API handler calls `getCurrentUser()` and returns `401` when unauthenticated.

There is currently no `middleware.ts`; authentication is enforced by layouts and route handlers.
