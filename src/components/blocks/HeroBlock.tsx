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
      {image?.url && (
        <div style={styles.bgWrapper}>
          <Image
            src={image.url}
            alt={image.alt ?? heading}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={styles.bgOverlay} />
        </div>
      )}
      <div style={{ ...styles.content, ...(image?.url ? styles.contentOnImage : {}) }}>
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
    minHeight: '320px',
    display: 'flex',
    alignItems: 'center',
    background: '#1a1a1a',
  },
  bgWrapper: {
    position: 'absolute' as const,
    inset: 0,
  },
  bgOverlay: {
    position: 'absolute' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
  },
  content: {
    position: 'relative' as const,
    zIndex: 1,
    padding: '3rem 2rem',
  },
  contentOnImage: {
    color: '#fff',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: '0.75rem',
    color: 'inherit',
  },
  subheading: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    opacity: 0.9,
  },
}
