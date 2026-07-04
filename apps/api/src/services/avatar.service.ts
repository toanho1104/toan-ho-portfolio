import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { isAwsConfigured } from '@/config/aws'
import { s3Service } from '@/services/s3.service'
import { profileService } from '@/services/profile.service'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function buildAvatarKey(userId: string, mimeType: string) {
  const ext = MIME_EXT[mimeType] ?? 'jpg'
  return `avatars/${userId}/avatar.${ext}`
}

function contentTypeFromKey(key: string) {
  if (key.endsWith('.png')) return 'image/png'
  if (key.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

function normalizeImageMimeType(type: string, fileName: string) {
  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp') {
    return type
  }

  if (type === 'image/jpg' || type === '') {
    if (/\.jpe?g$/i.test(fileName)) return 'image/jpeg'
    if (/\.png$/i.test(fileName)) return 'image/png'
    if (/\.webp$/i.test(fileName)) return 'image/webp'
  }

  return type
}

async function safeDeleteObject(key: string) {
  try {
    await s3Service.deleteObject(key)
  } catch (error) {
    console.warn(`[avatar] failed to delete old object ${key}:`, error)
  }
}

export const avatarService = {
  async getPublicUrl() {
    const profile = await db.query.profiles.findFirst()

    if (!profile?.avatarS3Key) {
      return null
    }

    const url = await s3Service.getPresignedObjectUrl(
      profile.avatarS3Key,
      contentTypeFromKey(profile.avatarS3Key),
    )

    return { url }
  },

  async getForUser(userId: string) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    })

    if (!profile?.avatarS3Key) {
      return null
    }

    return {
      uploadedAt: profile.updatedAt,
      urlPath: '/profile/avatar',
    }
  },

  async upload(userId: string, file: File) {
    if (!isAwsConfigured()) {
      throw new Error('AWS is not configured')
    }

    const mimeType = normalizeImageMimeType(file.type, file.name)

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new Error('Only JPEG, PNG, or WebP images are allowed')
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image size must be 2MB or less')
    }

    await profileService.ensureProfile(userId)

    const profile = await profileService.getByUserId(userId)
    const key = buildAvatarKey(userId, mimeType)
    const buffer = new Uint8Array(await file.arrayBuffer())

    if (profile?.avatarS3Key && profile.avatarS3Key !== key) {
      await safeDeleteObject(profile.avatarS3Key)
    }

    await s3Service.uploadObject(key, buffer, mimeType)

    const [updated] = await db
      .update(profiles)
      .set({
        avatarS3Key: key,
        avatarUrl: null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning({
        updatedAt: profiles.updatedAt,
      })

    if (!updated) {
      throw new Error('Profile not found')
    }

    return {
      uploadedAt: updated.updatedAt,
      urlPath: '/profile/avatar',
    }
  },

  async remove(userId: string) {
    const profile = await profileService.getByUserId(userId)

    if (!profile?.avatarS3Key) {
      return { message: 'No avatar to delete' }
    }

    await s3Service.deleteObject(profile.avatarS3Key)

    await db
      .update(profiles)
      .set({
        avatarS3Key: null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))

    return { message: 'Avatar deleted' }
  },
}
