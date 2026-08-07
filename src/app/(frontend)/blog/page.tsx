import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media, Post } from '@/payload-types'
import { formatDate } from '@/lib/formatDate'

// Force dynamic rendering so new posts appear immediately without a redeploy.
// Without this, Next.js caches the page at build time and visitors see
// stale data until the next deployment.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and updates.',
}

async function getPosts(): Promise<Post[]> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 100,
  })

  return docs
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="blog-listing">
      {/* Page header */}
      <header className="blog-listing__header">
        <h1 className="blog-listing__title">Articles</h1>
        <p className="blog-listing__subtitle">
          Thoughts, ideas, and updates — published when ready.
        </p>
      </header>

      {posts.length === 0 ? (
        /* Empty state — semantic, accessible, friendly */
        <div className="blog-listing__empty" role="status" aria-live="polite">
          <p className="blog-listing__empty-title">No published articles yet.</p>
          <p className="blog-listing__empty-sub">Check back soon.</p>
        </div>
      ) : (
        <ul className="blog-listing__grid" role="list">
          {posts.map((post) => {
            const cover =
              post.coverImage && typeof post.coverImage === 'object'
                ? (post.coverImage as Media)
                : null

            return (
              /*
               * The entire card is clickable via a stretched-link pattern:
               * .post-card__title-link::after covers the full card with position:absolute.
               * This means users can click anywhere on the card — not just the text.
               * The card has position:relative to contain the stretched pseudo-element.
               * Other interactive elements (if any) would need position:relative + z-index
               * to sit above the stretched link.
               */
              <li key={post.id} className="post-card">
                <div className="post-card__image-wrapper">
                  {cover?.url ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="post-card__image"
                    />
                  ) : (
                    <div className="post-card__image-placeholder" aria-hidden="true" />
                  )}
                </div>

                <div className="post-card__body">
                  {post.publishedDate && (
                    <time dateTime={post.publishedDate} className="post-card__date">
                      {formatDate(post.publishedDate)}
                    </time>
                  )}

                  <h2 className="post-card__title">
                    {/* Stretched link — ::after makes the whole card clickable */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="post-card__title-link"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="post-card__excerpt">{post.excerpt}</p>

                  {/* Visual cue only — not a separate click target (covered by stretched link) */}
                  <span className="post-card__read-more" aria-hidden="true">
                    Read more →
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
