import type { Post } from '@/payload-types'
import { HeroBlock } from './HeroBlock'
import { ParagraphBlock } from './ParagraphBlock'
import { ImageBlock } from './ImageBlock'
import { QuoteBlock } from './QuoteBlock'

type Block = Post['content'][number]

/**
 * Component map — the single source of truth for block registration.
 *
 * To add a new block type:
 *   1. Create the component file (e.g. VideoBlock.tsx)
 *   2. Add one line here: `video: VideoBlock`
 *   No other file needs to change. This is the Open/Closed Principle in practice:
 *   existing rendering code is closed for modification, open for extension via registration.
 *
 * Why a map instead of a switch statement?
 *   - One line to register a new block vs a new case block
 *   - The map IS the registry — the render loop reads from it directly
 *   - No risk of forgetting a `return` or `break` in a case
 *   - The full list of supported blocks is visible at a glance
 */
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {blocks.map((block, index) => {
        // Unknown block types are silently skipped — remaining blocks continue rendering
        if (!isKnownBlock(block)) return null

        const key = block.id ?? `block-${index}`

        // Look up the component from the map.
        // Cast to accept the block's data — TypeScript cannot narrow this automatically
        // because the map holds a union of all component types. The isKnownBlock guard
        // above already validated the blockType, so this cast is safe.
        const Component = blockComponents[block.blockType] as React.ComponentType<typeof block>

        return (
          <div key={key}>
            <Component {...block} />
          </div>
        )
      })}
    </div>
  )
}
