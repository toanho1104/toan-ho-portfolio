import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";

type UpdateProfileInput = Partial<typeof profiles.$inferInsert>;

export const profileService = {
  async getPublic() {
    return db.query.profiles.findFirst();
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
