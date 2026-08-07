import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { HeroBlock, ParagraphBlock, ImageBlock, QuoteBlock } from '../blocks'
import { slugify } from '../lib/slugify'

/**
 * Sanitizes the slug on every save and ensures it is unique.
 *
 * Why a collection-level beforeChange hook and not the field-level beforeValidate?
 * The field hook only fires when the slug field itself changes. When Payload
 * duplicates a document it copies all field values verbatim — the slug arrives
 * pre-populated (e.g. "my-post - Copy") and the field hook skips it.
 * A collection beforeChange hook fires on every save unconditionally, giving
 * us one reliable place to enforce: every persisted slug is URL-safe and unique.
 */
const ensureUniqueSlug: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  const rawSlug = data.slug as string | undefined
  if (!rawSlug) return data

  let candidate = slugify(rawSlug)
  if (!candidate) return data

  // Skip uniqueness check when the slug hasn't changed during an update
  if (operation === 'update' && originalDoc?.slug === candidate) {
    return { ...data, slug: candidate }
  }

  const payload = req.payload
  let suffix = 1
  let unique = false

  while (!unique) {
    const { totalDocs } = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { slug: { equals: candidate } },
          ...(operation === 'update' && originalDoc?.id
            ? [{ id: { not_equals: originalDoc.id } }]
            : []),
        ],
      },
      limit: 1,
      depth: 0,
    })

    if (totalDocs === 0) {
      unique = true
    } else {
      suffix += 1
      const base = candidate.replace(/-\d+$/, '')
      candidate = `${base}-${suffix}`
    }
  }

  return { ...data, slug: candidate }
}

export const Posts: CollectionConfig = {
  slug: 'posts',

  access: {
    read: () => true,
  },

  versions: {
    drafts: {
      autosave: false,
    },
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },

  hooks: {
    beforeChange: [ensureUniqueSlug],
  },

  fields: [
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
      // Field hook: derive slug from title when creating a new post with no slug yet.
      // Final sanitization and uniqueness are enforced by the collection beforeChange hook.
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            const title = data?.title as string | undefined
            if (!title) return value
            return slugify(title)
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

    {
      name: 'content',
      type: 'blocks',
      required: true,
      blocks: [HeroBlock, ParagraphBlock, ImageBlock, QuoteBlock],
      admin: {
        description: 'Build the post body by adding, reordering, and removing blocks.',
      },
    },
  ],
}
