import type { Post } from '@/payload-types'
import { HeroBlock } from './HeroBlock'
import { ParagraphBlock } from './ParagraphBlock'
import { ImageBlock } from './ImageBlock'
import { QuoteBlock } from './QuoteBlock'

// Union type of all possible block shapes from the generated Post type
type Block = Post['content'][number]

// Component map — add new block types here as the project grows
const blockComponents = {
  hero: HeroBlock,
  paragraph: ParagraphBlock,
  image: ImageBlock,
  quote: QuoteBlock,
} as const

type BlockType = keyof typeof blockComponents

function isKnownBlock(block: Block): block is Extract<Block, { blockType: BlockType }> {
  return block.blockType in blockComponents
}

type BlockRendererProps = {
  blocks: Post['content']
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <div style={styles.container}>
      {blocks.map((block, index) => {
        // Unknown block types are silently skipped — page continues rendering
        if (!isKnownBlock(block)) return null

        const Component = blockComponents[block.blockType]
        const key = block.id ?? `block-${index}`

        return (
          <div key={key} style={styles.block}>
            {/* Each block cast to its own props type via the component map */}
            {block.blockType === 'hero' && (
              <HeroBlock {...block} />
            )}
            {block.blockType === 'paragraph' && (
              <ParagraphBlock {...block} />
            )}
            {block.blockType === 'image' && (
              <ImageBlock {...block} />
            )}
            {block.blockType === 'quote' && (
              <QuoteBlock {...block} />
            )}
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '3rem',
  },
  block: {},
}
