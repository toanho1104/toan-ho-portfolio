import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { isAwsConfigured } from '@/config/aws'
import { s3Service } from '@/services/s3.service'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['application/pdf'])

function buildResumeKey(userId: string) {
  return `resumes/${userId}/cv.pdf`
}

export const resumeService = {
  async getPublicDownload() {
    const profile = await db.query.profiles.findFirst()

    if (!profile?.resumeS3Key) {
      return null
    }

    const url = await s3Service.getPresignedDownloadUrl(
      profile.resumeS3Key,
      profile.resumeFileName ?? 'resume.pdf',
    )

    return {
      url,
      fileName: profile.resumeFileName ?? 'resume.pdf',
    }
  },

  async getForUser(userId: string) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    })

    if (!profile?.resumeS3Key) {
      return null
    }

    return {
      fileName: profile.resumeFileName,
      uploadedAt: profile.updatedAt,
      downloadPath: '/resume/download',
    }
  },

  async upload(userId: string, file: File) {
    if (!isAwsConfigured()) {
      throw new Error('AWS is not configured')
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new Error('Only PDF files are allowed')
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be 5MB or less')
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    })

    if (!profile) {
      throw new Error('Profile not found')
    }

    const key = buildResumeKey(userId)
    const buffer = new Uint8Array(await file.arrayBuffer())

    if (profile.resumeS3Key && profile.resumeS3Key !== key) {
      await s3Service.deleteObject(profile.resumeS3Key)
    }

    await s3Service.uploadObject(key, buffer, file.type)

    const [updated] = await db
      .update(profiles)
      .set({
        resumeS3Key: key,
        resumeFileName: file.name,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning({
        resumeFileName: profiles.resumeFileName,
        updatedAt: profiles.updatedAt,
      })

    return {
      fileName: updated!.resumeFileName,
      uploadedAt: updated!.updatedAt,
      downloadPath: '/resume/download',
    }
  },

  async remove(userId: string) {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    })

    if (!profile?.resumeS3Key) {
      return { message: 'No resume to delete' }
    }

    await s3Service.deleteObject(profile.resumeS3Key)

    await db
      .update(profiles)
      .set({
        resumeS3Key: null,
        resumeFileName: null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))

    return { message: 'Resume deleted' }
  },
}
