# Deployment

## Runtime requirements

The panel requires:

- Node.js 20.9 or newer
- A Next.js-compatible server runtime
- Outbound HTTPS access to DummyJSON or the configured replacement
- Cookie support

The application cannot be deployed as a purely static export because route handlers and server-side cookie reads are required.

## Build and start

From the repository root:

```bash
npm install
npm run build
npm run start --workspace=panel
```

The build produces:

- Next.js output under `apps/panel/.next`
- UI declarations under `packages/ui/dist`

## Environment

Optional production variable:

```dotenv
DUMMYJSON_API_URL=https://dummyjson.com
```

Set the variable in the panel runtime environment. Do not expose tokens through `NEXT_PUBLIC_` variables.

## Cookie behavior

In production, login cookies are marked `Secure`.

The deployed application must use HTTPS or browsers will not send secure cookies reliably.

Current cookies:

- `access_token`
- `refresh_token`

Both are:

- HTTP-only
- SameSite Lax
- Path `/`
- Limited to 30 minutes

## Network dependencies

Dashboard requests may contact DummyJSON for:

- Current-user validation
- Posts
- User summaries
- Tags
- Individual post reads
- Mutations

An upstream outage affects both login and dashboard rendering. No cache or offline fallback is implemented.

## Deployment checklist

### Before build

- Confirm Node/npm versions.
- Install from the committed lockfile.
- Configure `DUMMYJSON_API_URL` if required.
- Confirm the runtime can reach the upstream API.

### Verification

```bash
npm run lint
npm run check-types
npm run build
```

### After deployment

- Open `/login`.
- Authenticate with a valid upstream user.
- Confirm secure cookies are created.
- Refresh `/articles` directly.
- Test create, update, and delete requests.
- Confirm logout expires both cookies.
- Check small-screen layouts.

## Production suitability

DummyJSON is appropriate for demonstration and challenge environments, not as a production content store.

Before real deployment, replace it with a persistent authenticated API and revisit:

- Token refresh and revocation
- CSRF protection
- Authorization roles
- Rate limiting
- Persistent article IDs and timestamps
- Runtime schema validation
- Observability and error reporting
- Automated tests

See [Limitations](limitations.md).
