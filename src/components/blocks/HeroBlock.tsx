import Image from 'next/image'
import type { Media } from '@/payload-types'

type HeroBlockProps = {
  heading: string
  subheading?: string | null
  backgroundImage?: (number | null) | Media
}

export function HeroBlock({ heading, subheading, backgroundImage }: HeroBlockProps) {
  const image =
    backgroundImage && typeof backgroundImage === 'object' ? (backgroundImage as Media) : null

  return (
    <section style={styles.hero}>
      {/* Image sits as an absolute fill behind the content */}
      {image?.url && (
        <>
          <Image
            src={image.url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 860px"
            style={{ objectFit: 'cover', zIndex: 0 }}
            priority
          />
          {/* Dark overlay so text is always readable */}
          <div style={styles.overlay} />
        </>
      )}

      {/* Text content sits above the image via zIndex */}
      <div style={{ ...styles.content, color: image?.url ? '#fff' : '#1a1a1a' }}>
        <h2 style={styles.heading}>{heading}</h2>
        {subheading && <p style={styles.subheading}>{subheading}</p>}
      </div>
    </section>
  )
}

const styles = {
  hero: {
    position: 'relative' as const,
    borderRadius: '8px',
    overflow: 'hidden',
    minHeight: '360px',
    display: 'flex',
    alignItems: 'center',
    background: '#1a1a1a',
  },
  overlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  content: {
    position: 'relative' as const,
    zIndex: 2,
    padding: '3rem 2.5rem',
    maxWidth: '700px',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: '0.75rem',
    color: 'inherit',
    letterSpacing: '-0.02em',
  },
  subheading: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    opacity: 0.9,
    color: 'inherit',
  },
}
