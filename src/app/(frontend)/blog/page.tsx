import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media, Post } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and updates.',
}

// Fetch only published posts, newest first, with coverImage populated
async function getPosts(): Promise<Post[]> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    sort: '-publishedDate',
    depth: 1, // populate coverImage relationship
    limit: 100,
  })

  return docs
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>Blog</h1>
        <p style={styles.pageSubtitle}>Articles and updates</p>
      </header>

      {posts.length === 0 ? (
        <p style={styles.empty}>No published blog posts yet.</p>
      ) : (
        <ul style={styles.grid} role="list">
          {posts.map((post) => {
            const cover =
              post.coverImage && typeof post.coverImage === 'object'
                ? (post.coverImage as Media)
                : null

            return (
              <li key={post.id} style={styles.card}>
                {/* Cover image */}
                {cover?.url ? (
                  <div style={styles.imageWrapper}>
                    <div style={styles.imageInner}>
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ ...styles.imageWrapper, ...styles.imagePlaceholder }}
                    aria-hidden="true"
                  />
                )}

                {/* Card body */}
                <div style={styles.cardBody}>
                  {post.publishedDate && (
                    <time
                      dateTime={post.publishedDate}
                      style={styles.date}
                    >
                      {formatDate(post.publishedDate)}
                    </time>
                  )}

                  <h2 style={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`} style={styles.cardTitleLink}>
                      {post.title}
                    </Link>
                  </h2>

                  <p style={styles.excerpt}>{post.excerpt}</p>

                  <Link
                    href={`/blog/${post.slug}`}
                    style={styles.readMore}
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

// Inline styles — keeps the component self-contained with no extra CSS files or dependencies
const styles = {
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  },
  header: {
    marginBottom: '3rem',
  },
  pageTitle: {
    fontSize: '2.25rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    marginBottom: '0.5rem',
  },
  pageSubtitle: {
    fontSize: '1rem',
    color: '#666',
  },
  empty: {
    color: '#666',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    listStyle: 'none',
  },
  card: {
    background: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  imageWrapper: {
    width: '100%',
    paddingBottom: '56.25%', // 16:9 ratio
    position: 'relative' as const,
    background: '#e8e8e8',
  },
  imageInner: {
    position: 'absolute' as const,
    inset: 0,
  },
  imagePlaceholder: {
    background: '#e8e8e8',
  },
  cardBody: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    flex: 1,
  },
  date: {
    fontSize: '0.8rem',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  cardTitleLink: {
    color: '#1a1a1a',
  },
  excerpt: {
    fontSize: '0.9rem',
    color: '#555',
    lineHeight: 1.6,
    flex: 1,
  },
  readMore: {
    marginTop: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#0066cc',
    alignSelf: 'flex-start' as const,
  },
} satisfies Record<string, React.CSSProperties | Record<string, React.CSSProperties>>
