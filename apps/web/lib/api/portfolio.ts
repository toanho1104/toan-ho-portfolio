import { apiClient } from "@/lib/api/client";
import type {
  Experience,
  PaginatedResponse,
  Profile,
  Project,
  SkillCategory,
} from "@/lib/types/portfolio";

export const portfolioApi = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await apiClient.get<Profile>("/profile/");
    return data;
  },

  getProjects: async (): Promise<Project[]> => {
    const { data } = await apiClient.get<PaginatedResponse<Project>>(
      "/projects/",
      { params: { limit: 50 } },
    );
    return data.data;
  },

  getExperiences: async (): Promise<Experience[]> => {
    const { data } = await apiClient.get<PaginatedResponse<Experience>>(
      "/experiences/",
      { params: { limit: 20 } },
    );
    return data.data;
  },

  getSkillCategories: async (): Promise<SkillCategory[]> => {
    const { data } = await apiClient.get<SkillCategory[]>("/skills/categories");
    return data;
  },

  getResumeViewUrl: async (): Promise<{ url: string; fileName: string }> => {
    const { data } = await apiClient.get<{ url: string; fileName: string }>(
      "/resume/view",
    );
    return data;
  },
};
