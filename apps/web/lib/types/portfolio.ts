export type I18nField = {
  vi?: string;
  en?: string;
};

export type Locale = "en" | "vi";

export type Profile = {
  id: string;
  name: string;
  title: I18nField;
  bio: I18nField;
  avatarUrl: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  websiteUrl: string | null;
  educationSchool: I18nField;
  educationDegree: I18nField;
  isAvailable: boolean;
  avatar: { available: boolean; urlPath: string; version: string | null } | null;
  resume: { available: boolean; fileName: string | null; downloadPath: string } | null;
};

export type Project = {
  id: string;
  experienceId: string | null;
  title: I18nField;
  summary: I18nField;
  description: I18nField;
  type: string;
  status: string;
  techStack: string[];
  thumbnailUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
};

export type Experience = {
  id: string;
  company: string;
  companyLogoUrl: string | null;
  companyUrl: string | null;
  position: I18nField;
  description: I18nField;
  techStack: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  sortOrder: number;
};

export type Skill = {
  id: string;
  name: string;
  type: string;
  level: string;
  yearsOfExperience: number | null;
  sortOrder: number;
};

export type SkillCategory = {
  id: string;
  name: I18nField;
  sortOrder: number;
  skills: Skill[];
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};
