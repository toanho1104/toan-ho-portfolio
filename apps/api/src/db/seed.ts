import { db } from "./index";
import { users } from "./schema";
import { hash } from "bcryptjs";

const email = "admin@toanho.dev";
const password = "Test@123";

const passwordHash = await hash(password, 12);

await db
  .insert(users)
  .values({
    email,
    passwordHash,
  })
  .onConflictDoNothing();

console.log(`Seeded user: ${email}`);
await process.exit(0);
