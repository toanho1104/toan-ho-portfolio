"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { ProjectsSection } from "@/components/sections/projects";
import { SkillsSection } from "@/components/sections/skills";
import { Container } from "@/components/ui/container";
import {
  useExperiences,
  useProfile,
  useProjects,
  useSkillCategories,
} from "@/hooks/use-portfolio";
import type { Locale } from "@/lib/types/portfolio";

type PortfolioPageProps = {
  locale: Locale;
};

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <span className="loading loading-spinner loading-md text-base-content/40" />
    </main>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Container>
        <p className="text-center text-error">{message}</p>
      </Container>
    </main>
  );
}

export function PortfolioPage({ locale }: PortfolioPageProps) {
  const profileQuery = useProfile();
  const projectsQuery = useProjects();
  const experiencesQuery = useExperiences();
  const skillsQuery = useSkillCategories();

  const isLoading =
    profileQuery.isLoading ||
    projectsQuery.isLoading ||
    experiencesQuery.isLoading ||
    skillsQuery.isLoading;

  const error =
    profileQuery.error ??
    projectsQuery.error ??
    experiencesQuery.error ??
    skillsQuery.error;

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;
  if (!profileQuery.data) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-center text-base-content/60">
          Portfolio data is not available. Please run the API seed.
        </p>
      </main>
    );
  }

  const profile = profileQuery.data;

  return (
    <>
      <Navbar name={profile.name} />
      <main>
        <Hero profile={profile} locale={locale} />
        <AboutSection profile={profile} locale={locale} />
        <ProjectsSection
          projects={projectsQuery.data ?? []}
          locale={locale}
        />
        <ExperienceSection
          experiences={experiencesQuery.data ?? []}
          locale={locale}
        />
        <SkillsSection
          categories={skillsQuery.data ?? []}
          locale={locale}
        />
      </main>
      <Footer profile={profile} />
    </>
  );
}
