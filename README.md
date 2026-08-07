# payload-task

A take-home blog platform built with Payload CMS 3.x, Next.js App Router, PostgreSQL (Neon), and Cloudinary. Deployed to Vercel.

## Live Demo

| | URL |
|---|---|
| Blog | https://payload-task-byteshifted.vercel.app/blog |
| Admin | https://payload-task-byteshifted.vercel.app/admin/login |

---

## Stack

| Layer | Technology |
|---|---|
| CMS | [Payload CMS 3.x](https://payloadcms.com/docs) |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| Media | [Cloudinary](https://cloudinary.com) |
| Deployment | Vercel |

---

## Features

- **Block-based content editor** — posts are composed from reusable content blocks with drag-and-drop reordering, duplication, and removal built into the Payload admin UI
- **Four block types** — Hero (with optional background image), Paragraph (Lexical rich text), Image (with alt text and caption), Quote (with attribution)
- **Draft / Publish workflow** — editors save drafts and publish when ready; draft posts never appear on the public frontend
- **Automatic slug generation** — slugs are derived from the post title, sanitized to be URL-safe, and enforced as unique across all posts
- **Responsive public frontend** — blog listing at `/blog` and detail pages at `/blog/[slug]`, built entirely with Server Components
- **Payload Local API** — frontend queries the database directly inside the same Next.js process, with no HTTP round-trip
- **Dynamic SEO metadata** — each post generates its own `<title>`, meta description, and Open Graph tags including cover image
- **Cloudinary media storage** — all uploads go to Cloudinary in both local development and production
- **PostgreSQL via Neon** — serverless Postgres that works identically in local dev and on Vercel

---

## Assignment Coverage

| Requirement | Implementation |
|---|---|
| Payload CMS 3.x | `payload@3.87.1`, `@payloadcms/next@3.87.1` |
| Block-based editor | `content` blocks field on Posts collection |
| Drag-and-drop block ordering | Built into Payload's blocks field — no custom code needed |
| Draft / Publish workflow | `versions.drafts` enabled on Posts; status filtered at query level |
| Blog listing page | `/blog` — Server Component, published only, newest first |
| Blog detail page | `/blog/[slug]` — Server Component, 404 for drafts and unknown slugs |
| Server rendering | All public pages are Server Components with no client-side JS |
| Responsive UI | CSS Grid with `auto-fill`, `clamp()` typography, mobile breakpoints |
| SEO metadata | `generateMetadata` per post with title, description, Open Graph |
| Accessibility | Semantic HTML, alt text, `:focus-visible` keyboard styles, heading hierarchy |

---

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public blog pages (/blog, /blog/[slug])
│   └── (payload)/           # Payload admin UI and API routes
├── blocks/                  # Payload block configuration (CMS schema)
├── collections/             # Payload collection configuration
├── components/
│   ├── blocks/              # React rendering components for each block type
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── cloudinaryAdapter.ts # Custom Cloudinary adapter for @payloadcms/plugin-cloud-storage
│   ├── formatDate.ts        # Shared date formatting utility
│   └── slugify.ts           # Shared slug sanitization utility
└── payload.config.ts        # Central Payload configuration
```

---

## Getting Started

```bash
cp .env.example .env   # fill in your credentials (see Environment Variables below)
npm install
npm run dev
```

Once running:

| | URL |
|---|---|
| Blog frontend | http://localhost:3000/blog |
| Payload admin | http://localhost:3000/admin |

On first run you will be prompted to create an admin user.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `PAYLOAD_SECRET` | Random secret used to sign JWTs — generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Deployment

The application is deployed to Vercel with the following production infrastructure:

- **Database** — Neon serverless PostgreSQL, connected via `DATABASE_URL`
- **Media** — Cloudinary, connected via `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Secrets** — `PAYLOAD_SECRET` configured as a sensitive environment variable in Vercel

The build script runs `payload generate:importmap && next build`. The import map is generated fresh on every Vercel build so the admin UI is always in sync with the collection configuration.

---

## Architecture

### Design philosophy

The frontend and the CMS live inside the same Next.js application. Rather than making HTTP requests to the Payload REST API, the frontend uses `payload.find()` from the Payload Local API. This queries the database directly within the same Node.js process — no serialization, no network latency, no authentication headers to manage. The result is simpler code, better performance, and full TypeScript type safety from the generated `payload-types.ts`.

### PostgreSQL (Neon)

SQLite cannot persist data on Vercel's ephemeral serverless filesystem. Neon is a serverless PostgreSQL provider with a free tier, native Vercel integration, and connection pooling built in. The `@payloadcms/db-postgres` adapter is the official Payload Postgres adapter and works identically in local development and production.

### Cloudinary

Vercel's filesystem is ephemeral — uploaded files would be lost between function invocations. Cloudinary provides persistent CDN-backed storage. Using the same Cloudinary account in both local development and production eliminates environment-specific media bugs. The `@payloadcms/plugin-cloud-storage` adapter intercepts Payload's upload pipeline transparently, so all existing Media relationships, frontend `<Image>` components, and block renderers continue working without changes.

The official plugin has no Cloudinary adapter. A thin custom adapter was written against the `GeneratedAdapter` interface in `src/lib/cloudinaryAdapter.ts`. This keeps the integration version-locked to Payload 3.87.1 with no third-party dependencies.

### Server Components

Every public page is a Server Component. Data is fetched at render time via the Payload Local API with `export const dynamic = 'force-dynamic'` to prevent Next.js from caching stale content on Vercel. This means zero client-side JavaScript for content rendering and no loading states.

### Block renderer

```ts
const blockComponents = {
  hero: HeroBlock,
  paragraph: ParagraphBlock,
  image: ImageBlock,
  quote: QuoteBlock,
}
```

The component map is the single registry for block rendering. Adding a new block type requires one line — no switch statement, no modification of existing code. Unknown block types hit the `isKnownBlock` guard and return `null` silently, so the page continues rendering remaining blocks without crashing.

### Draft handling

Drafts are filtered at the query level: `_status: { equals: 'published' }`. A draft returns zero documents, which triggers `notFound()`. This is safer than fetching first and checking status in component code — drafts cannot leak through a future coding mistake.

### Slug generation

Slugs are sanitized on every save via a `beforeChange` collection hook. This catches Payload's built-in duplicate operation (which appends ` - Copy`) and ensures every stored slug is lowercase, hyphen-separated, and URL-safe. A uniqueness loop appends `-2`, `-3`, etc. when conflicts exist.

---

## Accessibility

- Semantic HTML throughout (`<article>`, `<header>`, `<time>`, `<figure>`, `<figcaption>`, `<blockquote>`, `<cite>`, `<nav>`)
- `alt` text is a required field on the Media collection — uploads without alt text are rejected
- `:focus-visible` keyboard focus ring applied globally so keyboard navigation is always visible
- Correct heading hierarchy on all pages (`h1` per page, `h2` per card/block)
- Responsive layout scales from mobile to desktop without JavaScript

---

## SEO

- `generateMetadata` on the detail page produces a unique `<title>` and `<meta name="description">` per post
- Open Graph tags include title, description, and cover image URL where available
- Next.js `<Image>` with `sizes` and `priority` attributes for optimized loading and no layout shift
- Semantic `<time dateTime="...">` elements for machine-readable publish dates

---

## Trade-offs

- **No pagination** — the listing fetches up to 100 posts. Cursor-based pagination would be the correct approach at scale.
- **Inline styles in block components** — acceptable for this scope. CSS Modules or Tailwind would be cleaner in a team codebase.
- **No Cloudinary image transforms** — Cloudinary supports on-the-fly resizing via URL parameters. This could be added to `generateURL` in the adapter without any schema changes.
- **Custom Cloudinary adapter** — written against the official `GeneratedAdapter` interface because Payload 3 has no first-party Cloudinary support. Functional and maintainable, but not from the official ecosystem.

---

## Future Improvements

- Image transformations via Cloudinary URL parameters
- Cursor-based pagination on the blog listing
- Category or tag taxonomy
- Dark mode via `prefers-color-scheme`
- Estimated reading time on article pages
