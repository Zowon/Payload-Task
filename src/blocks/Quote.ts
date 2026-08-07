import type { Block } from 'payload'

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: {
    singular: 'Quote',
    plural: 'Quotes',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The quoted text.',
      },
    },
    {
      name: 'author',
      type: 'text',
      admin: {
        description: 'Optional attribution — name of the person being quoted.',
      },
    },
  ],
}
