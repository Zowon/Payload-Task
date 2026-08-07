import { v2 as cloudinary } from 'cloudinary'
import type {
  Adapter,
  GenerateURL,
  HandleDelete,
  HandleUpload,
  StaticHandler,
} from '@payloadcms/plugin-cloud-storage/types'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const FOLDER = 'payload-task'

const handleUpload: HandleUpload = async ({ data, file }) => {
  const result = await new Promise<{
    secure_url: string
    public_id: string
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: 'auto',
        // strip extension — Cloudinary manages the format itself
        public_id: file.filename.replace(/\.[^/.]+$/, ''),
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve(result as { secure_url: string; public_id: string })
      },
    )
    stream.end(file.buffer)
  })

  // result.public_id = "payload-task/my-image" (includes folder)
  // result.secure_url = full CDN URL — use this directly as the stored url
  // Strip the folder prefix from public_id before storing as filename
  // so we don't double-prefix when regenerating URLs later.
  const filenameWithoutFolder = result.public_id.replace(`${FOLDER}/`, '')

  return {
    ...data,
    url: result.secure_url,
    filename: filenameWithoutFolder,
  }
}

const handleDelete: HandleDelete = async ({ doc }) => {
  // doc.filename is already without the folder prefix (set by handleUpload above)
  await cloudinary.uploader.destroy(`${FOLDER}/${doc.filename}`, {
    resource_type: 'auto',
  })
}

// generateURL is called when Payload needs to rebuild the URL from stored data.
// filename here is the value we stored — without the folder prefix.
const generateURL: GenerateURL = ({ filename }) => {
  return cloudinary.url(`${FOLDER}/${filename}`, { secure: true })
}

const staticHandler: StaticHandler = async () => {
  return new Response(null, { status: 404 })
}

export function cloudinaryAdapter(): Adapter {
  return () => ({
    name: 'cloudinary',
    generateURL,
    handleDelete,
    handleUpload,
    staticHandler,
  })
}
