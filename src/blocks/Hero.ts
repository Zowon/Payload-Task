import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'Main headline displayed prominently in the hero.',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      admin: {
        description: 'Optional supporting text beneath the heading.',
      },
    },
    {
      name: 'backgroundImage',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        description: 'Optional full-width background image.',
      },
    },
  ],
}
