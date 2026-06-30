import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";

type UpdateProfileInput = Partial<typeof profiles.$inferInsert>;

type PublicProfile = Omit<
  typeof profiles.$inferSelect,
  'resumeS3Key' | 'resumeFileName'
> & {
  resume: {
    available: boolean
    fileName: string | null
    downloadPath: string
  } | null
}

export const profileService = {
  async getPublic(): Promise<PublicProfile | undefined> {
    const profile = await db.query.profiles.findFirst()
    if (!profile) return undefined

    const { resumeS3Key, resumeFileName, ...rest } = profile

    return {
      ...rest,
      resume: resumeS3Key
        ? {
            available: true,
            fileName: resumeFileName,
            downloadPath: '/resume/download',
          }
        : null,
    }
  },

  async getByUserId(userId: string) {
    return db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });
  },

  async upsert(userId: string, data: UpdateProfileInput) {
    const existing = await profileService.getByUserId(userId);

    if (existing) {
      const [updated] = await db
        .update(profiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profiles.userId, userId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(profiles)
      .values({ userId, name: "", ...data })
      .returning();
    return created;
  },
};
