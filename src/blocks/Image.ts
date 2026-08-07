import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Image',
    plural: 'Images',
  },
  fields: [
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Select an image from the media library.',
      },
    },
    {
      name: 'altText',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive text for screen readers and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption displayed beneath the image.',
      },
    },
  ],
}
