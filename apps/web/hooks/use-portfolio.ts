"use client";

import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "@/lib/api/portfolio";
import { queryKeys } from "@/lib/query-keys";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: portfolioApi.getProfile,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: portfolioApi.getProjects,
  });
}

export function useExperiences() {
  return useQuery({
    queryKey: queryKeys.experiences,
    queryFn: portfolioApi.getExperiences,
  });
}

export function useSkillCategories() {
  return useQuery({
    queryKey: queryKeys.skillCategories,
    queryFn: portfolioApi.getSkillCategories,
  });
}
