import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media } from '@/payload-types'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

type Props = {
  params: Promise<{ slug: string }>
}

// Fetch a single published post by slug — returns null for drafts and missing slugs
async function getPost(slug: string) {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    depth: 2, // populate coverImage + any nested media inside blocks
    limit: 1,
  })

  return docs[0] ?? null
}

// Dynamic Open Graph metadata per post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) return { title: 'Post Not Found' }

  const cover =
    post.coverImage && typeof post.coverImage === 'object'
      ? (post.coverImage as Media)
      : null

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      ...(cover?.url ? { images: [{ url: cover.url, alt: cover.alt }] } : {}),
    },
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  // Draft or missing slug — show 404
  if (!post) notFound()

  const cover =
    post.coverImage && typeof post.coverImage === 'object'
      ? (post.coverImage as Media)
      : null

  return (
    <main style={styles.main}>
      {/* Back link */}
      <Link href="/blog" style={styles.backLink}>← Back to Blog</Link>

      <article>
        {/* Post header */}
        <header style={styles.header}>
          {post.publishedDate && (
            <time dateTime={post.publishedDate} style={styles.date}>
              {formatDate(post.publishedDate)}
            </time>
          )}
          <h1 style={styles.title}>{post.title}</h1>
          <p style={styles.excerpt}>{post.excerpt}</p>
        </header>

        {/* Cover image */}
        {cover?.url && (
          <div style={styles.coverWrapper}>
            <div style={styles.coverInner}>
              <Image
                src={cover.url}
                alt={cover.alt ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, 860px"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        )}

        {/* Content blocks */}
        <div style={styles.content}>
          <BlockRenderer blocks={post.content} />
        </div>
      </article>
    </main>
  )
}

const styles = {
  main: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '2rem 1.5rem 4rem',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    color: '#0066cc',
    fontWeight: 500,
  },
  header: {
    marginBottom: '2rem',
  },
  date: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.02em',
    marginBottom: '1rem',
  },
  excerpt: {
    fontSize: '1.15rem',
    color: '#555',
    lineHeight: 1.7,
    maxWidth: '65ch',
  },
  coverWrapper: {
    marginBottom: '3rem',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  coverInner: {
    position: 'relative' as const,
    width: '100%',
    paddingBottom: '52%',
    background: '#e8e8e8',
  },
  content: {
    marginTop: '1rem',
  },
}
