"use client";

import { ExternalLink, Github } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Locale, Project } from "@/lib/types/portfolio";
import { pickI18n } from "@/lib/utils/i18n";

type ProjectCardProps = {
  project: Project;
  locale: Locale;
};

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const t = useTranslations("projects");
  const title = pickI18n(project.title, locale);
  const summary = pickI18n(project.summary, locale);

  const links = [
    { href: project.githubUrl, icon: Github, label: t("links.github") },
    { href: project.demoUrl, icon: ExternalLink, label: t("links.demo") },
  ].filter((l) => Boolean(l.href));

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-6 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-base-content">
          {title}
        </h3>
        {project.isFeatured && (
          <span className="badge badge-neutral badge-sm shrink-0">
            {t("featured")}
          </span>
        )}
      </div>

      {summary && (
        <p className="mb-4 flex-1 text-sm leading-relaxed text-base-content/65">
          {summary}
        </p>
      )}

      {project.techStack.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 6).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-base-200 px-2 py-0.5 font-mono text-[11px] text-base-content/70"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 6 && (
            <span className="text-xs text-base-content/40">
              +{project.techStack.length - 6}
            </span>
          )}
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-2 border-t border-base-300 pt-4">
          {links.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-base-content/70 transition-colors hover:text-base-content"
            >
              <Icon className="size-3.5" />
              {label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
