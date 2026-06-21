import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

export const authService = {
  async findUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    })
  },

  async verifyPassword(plain: string, hash: string) {
    return compare(plain, hash)
  },
}
