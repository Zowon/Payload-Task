# payload-task

A take-home blog platform built with Payload CMS 3.x, Next.js App Router, PostgreSQL (Neon), and Cloudinary.

## Stack

| Layer | Technology |
|---|---|
| CMS | [Payload CMS 3.x](https://payloadcms.com/docs) |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| Media | [Cloudinary](https://cloudinary.com) |
| Deployment | Vercel |

## Getting started

```bash
cp .env.example .env   # fill in your credentials
npm install
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin).
On first run you will be prompted to create an admin user.

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `PAYLOAD_SECRET` | Random secret used to sign JWTs — generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Architecture

### Why PostgreSQL (Neon)?

SQLite is a local file-based database. Vercel's serverless functions run on an ephemeral read-only filesystem — SQLite cannot persist data there. Neon is a serverless PostgreSQL provider with a generous free tier, native Vercel integration, and connection pooling built in. The `@payloadcms/db-postgres` adapter is the official Payload adapter for Postgres and works identically in local dev and production.

### Why Cloudinary?

Vercel's filesystem is ephemeral — uploaded files would be lost between function invocations. Cloudinary provides persistent CDN-backed media storage. Using the same Cloudinary account in both local dev and production eliminates the "works locally, broken in production" class of media bugs. The `@payloadcms/plugin-cloud-storage` adapter intercepts Payload's upload pipeline transparently — all existing Media relationships, frontend `<Image>` components, and block renderers continue working without any changes.

### Why Server Components?

Every public page (`/blog`, `/blog/[slug]`) is a Server Component. Data is fetched at render time via the Payload Local API (`payload.find()`), which queries the database directly without an HTTP round-trip. This means zero client-side JavaScript for content rendering, faster Time to First Byte, and no loading spinners.

### Why the Payload Local API instead of `fetch()`?

The frontend and CMS share the same Next.js process. `payload.find()` accesses the database directly — no serialization, no network, no auth headers. `fetch('/api/posts')` would add unnecessary latency and require managing API keys.

### Block renderer — component map

```
blockComponents = { hero: HeroBlock, paragraph: ParagraphBlock, ... }
```

Adding a new block type requires one line in the map. No switch statement, no modification of existing rendering code. Unknown block types are silently skipped — the page never crashes.

### Draft handling

Drafts are filtered at the query level: `_status: { equals: 'published' }`. Drafts return zero results, which triggers `notFound()`. This is safer than fetching then checking status in component code.

### Slug generation

Slugs are sanitized on every save via a `beforeChange` collection hook. This catches Payload's duplicate operation (which appends ` - Copy`) and ensures every stored slug is lowercase, hyphen-separated, and unique. A uniqueness loop appends `-2`, `-3`, etc. when conflicts exist.

## Trade-offs

- **No pagination** — the listing page fetches up to 100 posts. Cursor-based pagination would be needed at scale.
- **Inline styles** in block components — acceptable for this scope. CSS Modules or Tailwind would be cleaner in a team codebase.
- **No image transforms** — Cloudinary supports on-the-fly resizing via URL parameters. This could be added to `generateURL` without any schema changes.

## Future improvements

- Add image transformations via Cloudinary URL parameters
- Add pagination to the blog listing
- Add a category/tag taxonomy
- Dark mode via `prefers-color-scheme`
- Read time estimate on article pages
