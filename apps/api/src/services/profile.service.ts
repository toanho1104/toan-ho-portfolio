import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { profiles } from '@/db/schema'

type ProfileRow = typeof profiles.$inferSelect
type UpdateProfileInput = Partial<typeof profiles.$inferInsert>

const UPDATABLE_FIELDS = [
  'name',
  'title',
  'bio',
  'avatarUrl',
  'location',
  'email',
  'phone',
  'githubUrl',
  'linkedinUrl',
  'youtubeUrl',
  'websiteUrl',
  'educationSchool',
  'educationDegree',
  'resumeUrl',
  'isAvailable',
] as const satisfies ReadonlyArray<keyof UpdateProfileInput>

export type PublicProfile = Omit<
  ProfileRow,
  'resumeS3Key' | 'resumeFileName' | 'avatarS3Key'
> & {
  avatar: {
    available: boolean
    urlPath: string
    version: string | null
  } | null
  resume: {
    available: boolean
    fileName: string | null
    downloadPath: string
  } | null
}

function pickUpdatableFields(data: UpdateProfileInput): UpdateProfileInput {
  const result: UpdateProfileInput = {}

  for (const key of UPDATABLE_FIELDS) {
    if (data[key] !== undefined) {
      ;(result as Record<string, unknown>)[key] = data[key]
    }
  }

  return result
}

function toPublicProfile(profile: ProfileRow): PublicProfile {
  const { resumeS3Key, resumeFileName, avatarS3Key, ...rest } = profile

  return {
    ...rest,
    avatar: avatarS3Key
      ? {
          available: true,
          urlPath: '/profile/avatar',
          version: profile.updatedAt.toISOString(),
        }
      : rest.avatarUrl
        ? { available: true, urlPath: rest.avatarUrl, version: null }
        : null,
    resume: resumeS3Key
      ? {
          available: true,
          fileName: resumeFileName,
          downloadPath: '/resume/download',
        }
      : null,
  }
}

export const profileService = {
  toPublicProfile,

  async getPublic(): Promise<PublicProfile | undefined> {
    const profile = await db.query.profiles.findFirst()
    if (!profile) return undefined
    return toPublicProfile(profile)
  },

  async getByUserId(userId: string) {
    return db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    })
  },

  async ensureProfile(userId: string) {
    const existing = await profileService.getByUserId(userId)
    if (existing) return existing

    const [created] = await db
      .insert(profiles)
      .values({ userId, name: '' })
      .returning()

    return created
  },

  async upsert(userId: string, data: UpdateProfileInput): Promise<PublicProfile> {
    const payload = pickUpdatableFields(data)
    const existing = await profileService.getByUserId(userId)

    if (existing) {
      const [updated] = await db
        .update(profiles)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(profiles.userId, userId))
        .returning()

      return toPublicProfile(updated!)
    }

    const [created] = await db
      .insert(profiles)
      .values({
        userId,
        name: payload.name ?? '',
        ...payload,
      })
      .returning()

    return toPublicProfile(created!)
  },
}
