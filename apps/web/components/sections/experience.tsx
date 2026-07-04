"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import {
  MotionItem,
  MotionStagger,
  MotionWrapper,
} from "@/components/ui/motion-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Experience, Locale } from "@/lib/types/portfolio";
import { formatDateRange, pickI18n } from "@/lib/utils/i18n";

type ExperienceSectionProps = {
  experiences: Experience[];
  locale: Locale;
};

export function ExperienceSection({
  experiences,
  locale,
}: ExperienceSectionProps) {
  const t = useTranslations("experience");
  const sorted = [...experiences].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="experience" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {sorted.length === 0 ? (
          <MotionWrapper>
            <p className="text-base-content/50">{t("empty")}</p>
          </MotionWrapper>
        ) : (
          <MotionStagger className="relative space-y-0">
            <div
              className="absolute bottom-0 left-[7px] top-2 w-px bg-base-300 md:left-[11px]"
              aria-hidden
            />
            {sorted.map((exp) => {
              const position = pickI18n(exp.position, locale);
              const description = pickI18n(exp.description, locale);
              const period = formatDateRange(
                exp.startDate,
                exp.endDate,
                exp.isCurrent,
                locale,
              );

              return (
                <MotionItem key={exp.id}>
                  <div className="relative grid gap-4 pb-10 pl-8 md:grid-cols-[180px_1fr] md:gap-8 md:pl-10 md:pb-12">
                    <span
                      className="absolute left-0 top-2 size-[15px] rounded-full border-2 border-base-content bg-base-100 md:left-1 md:size-[19px]"
                      aria-hidden
                    />

                    <div>
                      <p className="font-mono text-xs uppercase tracking-wide text-base-content/50">
                        {period}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-base-content">
                        {exp.company}
                      </h3>
                      {position && (
                        <p className="mt-1 text-sm text-base-content/65">
                          {position}
                        </p>
                      )}
                    </div>

                    <div>
                      {description && (
                        <p className="text-sm leading-relaxed text-base-content/70">
                          {description}
                        </p>
                      )}
                      {exp.techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {exp.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-base-300 px-2 py-0.5 font-mono text-[11px] text-base-content/60"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </MotionItem>
              );
            })}
          </MotionStagger>
        )}
      </Container>
    </section>
  );
}
