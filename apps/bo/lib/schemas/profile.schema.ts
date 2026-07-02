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
  youtubeUrl: optionalUrlSchema,
  websiteUrl: optionalUrlSchema,
  educationSchoolVi: z.string().optional(),
  educationSchoolEn: z.string().optional(),
  educationDegreeVi: z.string().optional(),
  educationDegreeEn: z.string().optional(),
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
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
  educationSchool?: { vi?: string; en?: string };
  educationDegree?: { vi?: string; en?: string };
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
    youtubeUrl: profile.youtubeUrl ?? "",
    websiteUrl: profile.websiteUrl ?? "",
    educationSchoolVi: profile.educationSchool?.vi ?? "",
    educationSchoolEn: profile.educationSchool?.en ?? "",
    educationDegreeVi: profile.educationDegree?.vi ?? "",
    educationDegreeEn: profile.educationDegree?.en ?? "",
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
    youtubeUrl: values.youtubeUrl || undefined,
    websiteUrl: values.websiteUrl || undefined,
    educationSchool: {
      vi: values.educationSchoolVi,
      en: values.educationSchoolEn,
    },
    educationDegree: {
      vi: values.educationDegreeVi,
      en: values.educationDegreeEn,
    },
    resumeUrl: values.resumeUrl || undefined,
    isAvailable: values.isAvailable,
  };
}
