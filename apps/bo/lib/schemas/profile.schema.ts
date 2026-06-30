import { z } from "zod";
import { optionalEmailSchema, optionalUrlSchema } from "./common.schema";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  titleVi: z.string().optional(),
  titleEn: z.string().optional(),
  bioVi: z.string().optional(),
  bioEn: z.string().optional(),
  avatarUrl: optionalUrlSchema,
  location: z.string().optional(),
  email: optionalEmailSchema,
  phone: z.string().optional(),
  githubUrl: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  websiteUrl: optionalUrlSchema,
  resumeUrl: optionalUrlSchema,
  isAvailable: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function profileToForm(profile: {
  name: string;
  title: { vi?: string; en?: string };
  bio: { vi?: string; en?: string };
  avatarUrl?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  resumeUrl?: string | null;
  isAvailable: boolean;
}): ProfileFormValues {
  return {
    name: profile.name,
    titleVi: profile.title.vi ?? "",
    titleEn: profile.title.en ?? "",
    bioVi: profile.bio.vi ?? "",
    bioEn: profile.bio.en ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    location: profile.location ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    githubUrl: profile.githubUrl ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    websiteUrl: profile.websiteUrl ?? "",
    resumeUrl: profile.resumeUrl ?? "",
    isAvailable: profile.isAvailable,
  };
}

export function formToProfilePayload(values: ProfileFormValues) {
  return {
    name: values.name,
    title: { vi: values.titleVi, en: values.titleEn },
    bio: { vi: values.bioVi, en: values.bioEn },
    avatarUrl: values.avatarUrl || undefined,
    location: values.location || undefined,
    email: values.email || undefined,
    phone: values.phone || undefined,
    githubUrl: values.githubUrl || undefined,
    linkedinUrl: values.linkedinUrl || undefined,
    websiteUrl: values.websiteUrl || undefined,
    resumeUrl: values.resumeUrl || undefined,
    isAvailable: values.isAvailable,
  };
}
