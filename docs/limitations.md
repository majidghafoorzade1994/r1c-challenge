# Limitations and future work

## DummyJSON persistence

DummyJSON simulates:

- User creation
- Post creation
- Post updates
- Post deletion

Successful mutation responses do not change later reads. Consequences:

- Registered users cannot log in with their newly submitted credentials.
- Created articles disappear after navigation/reload.
- Updated articles return to original content on a later read.
- Deleted articles remain in the list.

This is the most important behavioral constraint in the project.

## Article data gaps

DummyJSON posts do not provide a creation timestamp, so the Created column displays an em dash.

The design includes a description field, but description is not a standard persisted DummyJSON post field. The client and proxy pass it through, but it should not be treated as durable.

## Session lifecycle

The application stores a refresh token but does not use it.

Missing capabilities:

- Automatic access-token refresh
- Refresh-token rotation
- Logout revocation
- Session-expiry messaging
- Multi-device session management

After expiration, protected routes redirect to login.

## Authorization

Any authenticated DummyJSON user can:

- View all posts
- Create a post
- Edit any post
- Delete any post

There are no ownership or role checks.

## Request validation

TypeScript types document expected upstream shapes, but no runtime schema library validates DummyJSON responses.

Request validation is intentionally small:

- Value type checks
- Positive integer IDs
- Required title/body
- Basic email pattern

Recommended improvement: introduce a runtime schema library and shared request/response schemas.

## Error handling

Mutation flows show toasts, but server-rendered article reads do not have route-specific:

- `loading.tsx`
- `error.tsx`
- Empty-state component

Unexpected upstream read failures fall through to the nearest Next.js boundary.

## Automated testing

No unit, component, integration, or end-to-end test framework is configured.

High-value first tests:

1. Email-to-username login mapping
2. Cookie options on login/logout
3. Post route authentication and validation
4. Pagination item calculation
5. Article form validation and tag behavior
6. Protected-route redirects
7. End-to-end login and mutation flows

## Accessibility

Existing accessibility work includes:

- Native form controls
- Labels and error roles
- `aria-invalid`
- Dialog roles
- `aria-current`
- Visible focus states
- Native buttons for actions

Areas to improve:

- Modal focus trapping
- Escape-key modal close
- Restore focus after modal close
- Menu keyboard navigation
- Live-region behavior for route-level success messages
- Automated accessibility testing

## Styling/tooling overlap

The application uses plain CSS, but Tailwind remains installed and imported through the panel's global stylesheet.

This creates avoidable tooling overlap. A future cleanup should either:

- Remove Tailwind and its PostCSS plugin entirely, or
- Adopt Tailwind intentionally through a separate planned migration

The current component library is designed around co-located plain CSS and shared custom properties.

## Package publication

`@r1c/ui` is private and exports TypeScript source. Its build emits declarations only and does not create a standalone publish-ready JavaScript/CSS distribution.

Publishing it externally would require decisions about:

- JavaScript output formats
- CSS copying/bundling
- Export maps for built artifacts
- React/Lucide dependency policy
- Versioning and changelogs

## Observability

The application has no:

- Structured logging
- Error tracking
- Metrics
- Tracing
- Audit log

API errors are returned to clients, but production diagnostics would be limited.

## Recommended roadmap

1. Replace DummyJSON with a persistent backend.
2. Add runtime schemas.
3. Add automated tests.
4. Implement token refresh and stronger authorization.
5. Add route-specific loading/error/empty states.
6. Improve modal and menu accessibility.
7. Resolve the Tailwind/plain-CSS tooling overlap.
8. Add observability and deployment-specific configuration.
