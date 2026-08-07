import { v2 as cloudinary } from 'cloudinary'
import type {
  Adapter,
  GenerateURL,
  HandleDelete,
  HandleUpload,
  StaticHandler,
} from '@payloadcms/plugin-cloud-storage/types'

/**
 * Cloudinary adapter for @payloadcms/plugin-cloud-storage.
 *
 * Why a custom adapter rather than a third-party plugin?
 * The official plugin supports S3, GCS, Azure, and Vercel Blob — not Cloudinary.
 * The only Payload 3 Cloudinary packages target Payload 2. Writing a thin adapter
 * against the official GeneratedAdapter interface keeps everything in the Payload
 * ecosystem, stays version-locked to 3.87.1, and needs no third-party maintenance.
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const handleUpload: HandleUpload = async ({ data, file }) => {
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'payload-task',
          resource_type: 'auto',
          // Use filename without extension as public_id so Cloudinary stores it cleanly
          public_id: file.filename.replace(/\.[^/.]+$/, ''),
        },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve(result as { secure_url: string; public_id: string })
        },
      )
      stream.end(file.buffer)
    },
  )

  return {
    ...data,
    url: result.secure_url,
    filename: result.public_id,
  }
}

const handleDelete: HandleDelete = async ({ doc }) => {
  await cloudinary.uploader.destroy(`payload-task/${doc.filename}`, {
    resource_type: 'auto',
  })
}

const generateURL: GenerateURL = ({ filename }) => {
  return cloudinary.url(`payload-task/${filename}`, { secure: true })
}

const staticHandler: StaticHandler = async () => {
  // Files are served directly from Cloudinary CDN — no local static handler needed
  return new Response(null, { status: 404 })
}

/**
 * Returns the Adapter factory function expected by cloudStoragePlugin.
 * The factory receives the collection config and returns a GeneratedAdapter.
 */
export function cloudinaryAdapter(): Adapter {
  return () => ({
    name: 'cloudinary',
    generateURL,
    handleDelete,
    handleUpload,
    staticHandler,
  })
}
