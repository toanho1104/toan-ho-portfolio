import { Elysia } from "elysia";
import { authMiddleware } from "@/middleware/auth";
import { profileService } from "@/services/profile.service";
import { updateProfileBodyValidator } from "@/validators/profile.validator";
import { SWAGGER_TAGS } from "@/constants/swagger";

// Public routes
const publicProfileRoutes = new Elysia({ prefix: "/profile" }).get(
  "/",
  async ({ set }) => {
    const profile = await profileService.getPublic();

    if (!profile) {
      set.status = 404;
      return { message: "Profile not found" };
    }

    return profile;
  },
  {
    detail: {
      tags: [SWAGGER_TAGS.PROFILE],
      summary: "Get portfolio owner profile (public)",
    },
  },
);

// Protected routes
const protectedProfileRoutes = new Elysia({ prefix: "/profile" })
  .use(authMiddleware)
  .put(
    "/",
    async ({ userId, body }) => {
      return profileService.upsert(userId!, body);
    },
    {
      body: updateProfileBodyValidator,
      detail: {
        tags: [SWAGGER_TAGS.PROFILE],
        summary: "Update my profile (BO only)",
      },
    },
  );

export const profileRoutes = new Elysia()
  .use(publicProfileRoutes)
  .use(protectedProfileRoutes);
