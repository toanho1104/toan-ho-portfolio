"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale, Profile } from "@/lib/types/portfolio";
import { pickI18n } from "@/lib/utils/i18n";

type AboutSectionProps = {
  profile: Profile;
  locale: Locale;
};

export function AboutSection({ profile, locale }: AboutSectionProps) {
  const t = useTranslations("about");
  const bio = pickI18n(profile.bio, locale);
  const school = pickI18n(profile.educationSchool, locale);
  const degree = pickI18n(profile.educationDegree, locale);

  return (
    <section id="about" className="scroll-mt-20 py-20 md:py-28">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <MotionWrapper>
          <div className="max-w-3xl space-y-6">
            {bio.split("\n").map(
              (paragraph) =>
                paragraph.trim() && (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-base leading-relaxed text-base-content/75 sm:text-lg"
                  >
                    {paragraph.trim()}
                  </p>
                ),
            )}

            {(school || degree) && (
              <div className="rounded-xl border border-base-300 bg-base-200/30 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                  {t("education")}
                </p>
                {degree && (
                  <p className="mt-2 font-medium text-base-content">{degree}</p>
                )}
                {school && (
                  <p className="mt-1 text-sm text-base-content/65">{school}</p>
                )}
              </div>
            )}
          </div>
        </MotionWrapper>
      </Container>
    </section>
  );
}
