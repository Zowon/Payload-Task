import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media } from '@/payload-types'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { formatDate } from '@/lib/formatDate'

type Props = {
  params: Promise<{ slug: string }>
}

// Fetch a single published post by slug.
// Filtering _status at query level means drafts return zero docs → notFound().
// This is safer than fetching then checking status in component code.
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
    depth: 2, // depth:2 to populate media inside content blocks
    limit: 1,
  })

  return docs[0] ?? null
}

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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) notFound()

  const cover =
    post.coverImage && typeof post.coverImage === 'object'
      ? (post.coverImage as Media)
      : null

  return (
    <div className="post-page">
      <nav className="post-page__nav" aria-label="Breadcrumb">
        <Link href="/blog" className="post-page__back-link">← Back to Blog</Link>
      </nav>

      <main>
        <article className="post-page__article">
          <header className="post-page__header">
            {post.publishedDate && (
              <time dateTime={post.publishedDate} className="post-page__date">
                {formatDate(post.publishedDate)}
              </time>
            )}
            <h1 className="post-page__title">{post.title}</h1>
            <p className="post-page__excerpt">{post.excerpt}</p>
          </header>

          {cover?.url && (
            <div className="post-page__cover-wrapper">
              <Image
                src={cover.url}
                alt={cover.alt ?? post.title}
                fill
                sizes="(max-width: 768px) 100vw, 860px"
                className="post-page__cover-image"
                priority
              />
            </div>
          )}

          <div className="post-page__content">
            <BlockRenderer blocks={post.content} />
          </div>
        </article>
      </main>
    </div>
  )
}
