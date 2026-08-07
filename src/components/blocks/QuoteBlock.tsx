type QuoteBlockProps = {
  quote: string
  author?: string | null
}

export function QuoteBlock({ quote, author }: QuoteBlockProps) {
  return (
    <blockquote style={styles.blockquote}>
      <p style={styles.quote}>&ldquo;{quote}&rdquo;</p>
      {author && <cite style={styles.cite}>— {author}</cite>}
    </blockquote>
  )
}

const styles = {
  blockquote: {
    borderLeft: '4px solid #0066cc',
    margin: 0,
    paddingLeft: '1.5rem',
  },
  quote: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    lineHeight: 1.6,
    color: '#333',
    marginBottom: '0.5rem',
  },
  cite: {
    fontSize: '0.9rem',
    color: '#888',
    fontStyle: 'normal',
  },
}
