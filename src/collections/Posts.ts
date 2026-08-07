import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',

  // Authenticated users can create/edit/delete; public can read published posts
  access: {
    read: () => true,
  },

  // Enable drafts so editors can save without publishing
  versions: {
    drafts: {
      autosave: false,
    },
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },

  fields: [
    // ── Main content area ──────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'A short summary of the post (200–300 characters recommended).',
      },
    },

    // ── Sidebar fields ─────────────────────────────────────────────
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title. You can edit it manually.',
      },
      // Auto-generate slug from title; editor can override
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // If slug is already set by the editor, leave it alone
            if (value) return value

            // Generate from title
            const source = data?.title as string | undefined
            if (!source) return value

            return source
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, '')  // strip invalid chars
              .replace(/\s+/g, '-')           // spaces → hyphens
              .replace(/-+/g, '-')            // collapse multiple hyphens
          },
        ],
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
