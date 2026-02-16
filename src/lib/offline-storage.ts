import { openDB, DBSchema, IDBPDatabase } from 'idb'

// IndexedDB Schema
interface PublicLinkDB extends DBSchema {
  photos: {
    key: string // token
    value: {
      token: string
      photo: Blob
      timestamp: number
      uploadAttempts: number
      status: 'pending' | 'uploading' | 'uploaded' | 'failed'
    }
  }
}

const DB_NAME = 'strop-public-link'
const DB_VERSION = 1

// Initialize IndexedDB
async function getDB(): Promise<IDBPDatabase<PublicLinkDB>> {
  return openDB<PublicLinkDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'token' })
      }
    },
  })
}

/**
 * Store photo locally before upload attempt
 */
export async function storePhotoLocally(
  token: string,
  photo: Blob
): Promise<void> {
  const db = await getDB()
  await db.put('photos', {
    token,
    photo,
    timestamp: Date.now(),
    uploadAttempts: 0,
    status: 'pending',
  })
}

/**
 * Get stored photo for a token
 */
export async function getStoredPhoto(token: string) {
  const db = await getDB()
  return db.get('photos', token)
}

/**
 * Update photo status
 */
export async function updatePhotoStatus(
  token: string,
  status: 'pending' | 'uploading' | 'uploaded' | 'failed',
  incrementAttempts = false
): Promise<void> {
  const db = await getDB()
  const photo = await db.get('photos', token)
  if (photo) {
    await db.put('photos', {
      ...photo,
      status,
      uploadAttempts: incrementAttempts
        ? photo.uploadAttempts + 1
        : photo.uploadAttempts,
    })
  }
}

/**
 * Clear photo after successful upload
 */
export async function clearLocalPhoto(token: string): Promise<void> {
  const db = await getDB()
  await db.delete('photos', token)
}

/**
 * Get all pending photos (for recovery on page load)
 */
export async function getPendingPhotos() {
  const db = await getDB()
  const allPhotos = await db.getAll('photos')
  return allPhotos.filter((p) => p.status === 'pending' || p.status === 'failed')
}

/**
 * Upload photo with exponential backoff retry
 */
export async function uploadWithRetry(
  token: string,
  photo: Blob,
  uploadFn: (photo: Blob) => Promise<boolean>,
  maxAttempts = 5
): Promise<boolean> {
  const storedPhoto = await getStoredPhoto(token)
  const attempts = storedPhoto?.uploadAttempts || 0

  if (attempts >= maxAttempts) {
    await updatePhotoStatus(token, 'failed')
    return false
  }

  try {
    await updatePhotoStatus(token, 'uploading', true)
    const success = await uploadFn(photo)

    if (success) {
      await updatePhotoStatus(token, 'uploaded')
      await clearLocalPhoto(token)
      return true
    } else {
      await updatePhotoStatus(token, 'failed')
      return false
    }
  } catch (error) {
    console.error('Upload failed:', error)
    await updatePhotoStatus(token, 'failed')

    // Calculate exponential backoff delay
    const delay = Math.min(1000 * Math.pow(2, attempts), 30000) // Max 30s

    // Schedule retry
    setTimeout(async () => {
      const currentPhoto = await getStoredPhoto(token)
      if (currentPhoto && currentPhoto.status === 'failed') {
        await uploadWithRetry(token, currentPhoto.photo, uploadFn, maxAttempts)
      }
    }, delay)

    return false
  }
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Recover pending uploads on page load
 */
export async function recoverPendingUploads(
  uploadFn: (token: string, photo: Blob) => Promise<boolean>
): Promise<void> {
  const pending = await getPendingPhotos()

  for (const item of pending) {
    // Don't retry if too many attempts
    if (item.uploadAttempts < 5) {
      await uploadWithRetry(item.token, item.photo, (photo) =>
        uploadFn(item.token, photo)
      )
    }
  }
}
