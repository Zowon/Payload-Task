// Payload's Lexical rich text serializer for React
import { RichText } from '@payloadcms/richtext-lexical/react'

type LexicalContent = {
  root: {
    type: string
    children: { type: string; version: number; [k: string]: unknown }[]
    direction: 'ltr' | 'rtl' | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
  }
  [k: string]: unknown
}

type ParagraphBlockProps = {
  heading?: string | null
  body?: LexicalContent | null
}

export function ParagraphBlock({ heading, body }: ParagraphBlockProps) {
  return (
    <section style={styles.section}>
      {heading && <h2 style={styles.heading}>{heading}</h2>}
      {body && (
        <div style={styles.body}>
          <RichText data={body} />
        </div>
      )}
    </section>
  )
}

const styles = {
  section: {
    maxWidth: '72ch',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    lineHeight: 1.3,
  },
  body: {
    fontSize: '1.05rem',
    lineHeight: 1.75,
    color: '#2d2d2d',
  },
}
