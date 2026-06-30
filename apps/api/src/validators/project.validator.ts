import { t, type Static } from "elysia";
import { projectTypeEnum, projectStatusEnum } from "@/db/schema";
import { paginationValidator } from "@/validators/common.validator";
import { drizzleEnumField } from "@/validators/enum.validator";

const i18nField = t.Object({
  vi: t.Optional(t.String()),
  en: t.Optional(t.String()),
});

const projectTypeField = drizzleEnumField(projectTypeEnum.enumValues);
const projectStatusField = drizzleEnumField(projectStatusEnum.enumValues);

export const createProjectBodyValidator = t.Object({
  title: i18nField,
  summary: t.Optional(i18nField),
  description: t.Optional(i18nField),
  type: t.Optional(projectTypeField),
  status: t.Optional(projectStatusField),
  techStack: t.Optional(t.Array(t.String())),
  thumbnailUrl: t.Optional(t.String({ format: "uri" })),
  images: t.Optional(t.Array(t.String({ format: "uri" }))),
  githubUrl: t.Optional(t.String({ format: "uri" })),
  demoUrl: t.Optional(t.String({ format: "uri" })),
  appStoreUrl: t.Optional(t.String({ format: "uri" })),
  playStoreUrl: t.Optional(t.String({ format: "uri" })),
  isFeatured: t.Optional(t.Boolean()),
  sortOrder: t.Optional(t.Number()),
  startDate: t.Optional(t.String({ format: "date-time" })),
  endDate: t.Optional(t.String({ format: "date-time" })),
});

export const updateProjectBodyValidator = t.Partial(createProjectBodyValidator);

// Extends paginationValidator — thêm filter fields riêng của projects
export const projectQueryValidator = t.Composite([
  paginationValidator,
  t.Object({
    type: t.Optional(projectTypeField),
    status: t.Optional(projectStatusField),
    featured: t.Optional(t.BooleanString()),
  }),
]);

export type ProjectQuery = Static<typeof projectQueryValidator>;
