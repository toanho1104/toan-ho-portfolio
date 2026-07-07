"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { MotionItem, MotionStagger } from "@/components/ui/motion-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale, SkillCategory } from "@/lib/types/portfolio";
import { pickI18n } from "@/lib/utils/i18n";

type SkillsSectionProps = {
  categories: SkillCategory[];
  locale: Locale;
};

export function SkillsSection({ categories, locale }: SkillsSectionProps) {
  const t = useTranslations("skills");
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="skills" className="scroll-mt-20 bg-base-200/25 py-20 md:py-28">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {sorted.length === 0 ? (
          <p className="text-base-content/50">{t("empty")}</p>
        ) : (
          <MotionStagger className="grid gap-8 md:grid-cols-2">
            {sorted.map((category) => {
              const categoryName = pickI18n(category.name, locale);
              const skills = [...category.skills].sort(
                (a, b) => a.sortOrder - b.sortOrder,
              );

              return (
                <MotionItem key={category.id}>
                  <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/80">
                      {categoryName}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center rounded-lg bg-base-200/80 px-2.5 py-1 text-sm text-base-content/80"
                          title={skill.level}
                        >
                          {skill.name}
                        </span>
                      ))}
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
