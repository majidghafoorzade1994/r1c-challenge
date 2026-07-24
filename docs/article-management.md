# Article management

## Feature overview

The dashboard supports the CRUD interaction model required by the designs:

- Read a paginated article list
- Read an individual article for editing
- Create an article
- Update an article
- Delete an article

DummyJSON simulates mutations, so create/update/delete responses are successful but do not permanently alter later reads.

## Article model

The local TypeScript representation is:

```ts
type DummyJsonPost = {
  id: number;
  title: string;
  body: string;
  description?: string;
  tags: string[];
  userId: number;
  reactions?: {
    likes: number;
    dislikes: number;
  };
  views?: number;
};
```

`description` is included to match the design form, although it is not a standard persisted field in the DummyJSON post dataset.

## Article list

Routes:

```text
/articles
/articles/page/:page
```

The server loads in parallel:

- One page of posts
- All user ID/username summaries

Page size is fixed at 10 in `articles-page.tsx`.

The author map is created from user summaries:

```text
post.userId -> @username
```

When no username is found, the UI falls back to `@user_<id>`.

### Table fields

| Column  | Source                                                     |
| ------- | ---------------------------------------------------------- |
| `#`     | `post.id`                                                  |
| Title   | `post.title`                                               |
| Author  | User-summary lookup by `post.userId`                       |
| Tags    | Comma-separated `post.tags`                                |
| Excerpt | First 20 words of `post.body`                              |
| Created | Em dash because DummyJSON posts have no creation timestamp |
| Actions | Edit/delete menu                                           |

### Pagination

`totalPages` is calculated with:

```text
ceil(total / 10)
```

Out-of-range pages return the Next.js not-found response.

The shared `Pagination` component handles visible page numbers and ellipses. The application owns URL navigation.

## Create article

Route:

```text
/articles/create
```

The server loads the DummyJSON tag list. The client form:

- Requires title
- Accepts an optional description
- Requires body
- Allows zero or more tags
- Supports adding a custom tag

Pressing Enter in the new-tag field or blurring the field adds a normalized lowercase tag. New tags are selected by default and can be unchecked.

On submit:

1. Validate title and body.
2. Send `POST /api/posts`.
3. The API assigns the authenticated user's ID.
4. Navigate to `/articles?status=created`.
5. Display the creation toast.

## Edit article

Route:

```text
/articles/edit/:id
```

The page fetches the current article and tag list in parallel.

Initial values:

- Title from `post.title`
- Description from `post.description` when present
- Description fallback from the first 20 body words
- Body from `post.body`
- Selected tags from `post.tags`

On submit:

1. Validate title and body.
2. Send `PUT /api/posts/:id`.
3. Navigate to `/articles?status=updated`.
4. Display the update toast.

Because DummyJSON does not persist updates, returning to the edit page later loads the original upstream content.

## Delete article

The table action menu opens a shared danger `Modal`.

After confirmation:

1. Disable duplicate deletion through `isDeleting`.
2. Send `DELETE /api/posts/:id`.
3. Close the modal.
4. Replace the current list URL with `?status=deleted`.
5. Refresh server-rendered content.

DummyJSON returns `isDeleted` and `deletedOn`, but the post remains in future list requests.

## UI states

### Loading

- Create/edit buttons use the shared button loading state.
- Article fields and tag controls are disabled during save.
- Delete confirmation changes its label while deleting.

### Validation

Title and body errors appear only after submit. Editing a field clears its error.

### Success

The list maps status query values to shared success toasts:

- `created`
- `updated`
- `deleted`

### Failure

Mutation failures show an error toast. Server pages currently rely on the nearest Next.js error boundary for upstream read failures; no route-specific `error.tsx` exists.

## Tags

The tag endpoint returns the DummyJSON tag list sorted alphabetically.

The create/edit server pages call the upstream helper directly, while `/api/posts/tags` exposes an authenticated internal endpoint for client use or future features.

## Server and client split

| Concern                           | Runtime                     |
| --------------------------------- | --------------------------- |
| Load list, tags, article, authors | Server                      |
| Calculate page count              | Server                      |
| Validate dynamic route parameters | Server                      |
| Menus, modal, pagination          | Client                      |
| Form state and validation         | Client                      |
| Mutation requests                 | Client through internal API |
| Session and user ID validation    | Server                      |
