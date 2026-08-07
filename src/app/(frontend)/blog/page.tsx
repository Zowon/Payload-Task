import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media, Post } from '@/payload-types'
import { formatDate } from '@/lib/formatDate'

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
    depth: 1, // populate coverImage relationship
    limit: 100,
  })

  return docs
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="blog-listing">
      <header className="blog-listing__header">
        <h1 className="blog-listing__title">Blog</h1>
        <p className="blog-listing__subtitle">Articles and updates</p>
      </header>

      {posts.length === 0 ? (
        <div className="blog-listing__empty" role="status">
          <p>No published blog posts yet. Check back soon.</p>
        </div>
      ) : (
        <ul className="blog-listing__grid" role="list">
          {posts.map((post) => {
            const cover =
              post.coverImage && typeof post.coverImage === 'object'
                ? (post.coverImage as Media)
                : null

            return (
              <li key={post.id} className="post-card">
                {/* Cover image — always rendered to keep card height consistent */}
                <div className="post-card__image-wrapper" aria-hidden={!cover}>
                  {cover?.url ? (
                    <Image
                      src={cover.url}
                      alt={cover.alt ?? post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="post-card__image"
                    />
                  ) : (
                    <div className="post-card__image-placeholder" />
                  )}
                </div>

                <div className="post-card__body">
                  {post.publishedDate && (
                    <time dateTime={post.publishedDate} className="post-card__date">
                      {formatDate(post.publishedDate)}
                    </time>
                  )}

                  <h2 className="post-card__title">
                    <Link href={`/blog/${post.slug}`} className="post-card__title-link">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="post-card__excerpt">{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="post-card__read-more"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read More →
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
