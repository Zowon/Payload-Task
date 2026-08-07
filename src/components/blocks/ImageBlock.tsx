import Image from 'next/image'
import type { Media } from '@/payload-types'

type ImageBlockProps = {
  image: number | Media
  altText: string
  caption?: string | null
}

export function ImageBlock({ image, altText, caption }: ImageBlockProps) {
  // image may be an unresolved ID if depth was too low — guard safely
  if (!image || typeof image !== 'object') return null

  const media = image as Media
  if (!media.url) return null

  return (
    <figure style={styles.figure}>
      <div style={styles.imageWrapper}>
        <Image
          src={media.url}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ objectFit: 'contain' }}
        />
      </div>
      {caption && <figcaption style={styles.caption}>{caption}</figcaption>}
    </figure>
  )
}

const styles = {
  figure: {
    margin: 0,
  },
  imageWrapper: {
    position: 'relative' as const,
    width: '100%',
    paddingBottom: '56.25%', // 16:9
    background: '#f0f0f0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  caption: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
    color: '#888',
    textAlign: 'center' as const,
  },
}
