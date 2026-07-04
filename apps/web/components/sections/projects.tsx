"use client";

import { useTranslations } from "next-intl";
import { ProjectCard } from "@/components/projects/project-card";
import { Container } from "@/components/ui/container";
import {
  MotionItem,
  MotionStagger,
  MotionWrapper,
} from "@/components/ui/motion-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale, Project } from "@/lib/types/portfolio";

type ProjectsSectionProps = {
  projects: Project[];
  locale: Locale;
};

export function ProjectsSection({ projects, locale }: ProjectsSectionProps) {
  const t = useTranslations("projects");
  const sorted = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="projects" className="scroll-mt-20 bg-base-200/25 py-20 md:py-28">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {sorted.length === 0 ? (
          <MotionWrapper>
            <p className="text-base-content/50">{t("empty")}</p>
          </MotionWrapper>
        ) : (
          <MotionStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((project) => (
              <MotionItem key={project.id}>
                <ProjectCard project={project} locale={locale} />
              </MotionItem>
            ))}
          </MotionStagger>
        )}
      </Container>
    </section>
  );
}
