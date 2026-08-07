import type { Block } from 'payload'

export const ParagraphBlock: Block = {
  slug: 'paragraph',
  labels: {
    singular: 'Paragraph',
    plural: 'Paragraphs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional section heading above the body text.',
      },
    },
    {
      // Uses the global Lexical editor configured in payload.config.ts
      name: 'body',
      type: 'richText',
      admin: {
        description: 'Main body content for this section.',
      },
    },
  ],
}
