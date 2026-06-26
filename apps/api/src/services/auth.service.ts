import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export const authService = {
  async findUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },

  async findUserById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  },

  async verifyPassword(plain: string, hash: string) {
    return compare(plain, hash);
  },

  async saveRefreshToken(userId: string, token: string) {
    await db
      .update(users)
      .set({ refreshToken: token, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },

  async clearRefreshToken(userId: string) {
    await db
      .update(users)
      .set({ refreshToken: null, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },

  async findUserByRefreshToken(token: string) {
    return db.query.users.findFirst({
      where: eq(users.refreshToken, token),
    });
  },
};
