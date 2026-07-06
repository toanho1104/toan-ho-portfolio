"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/ui/social-links";
import type { Profile } from "@/lib/types/portfolio";

const STACK_TAGS = [
  "Turborepo",
  "Next.js",
  "Elysia · Bun",
  "PostgreSQL",
  "AWS S3",
  "Docker",
  "GitHub Actions",
] as const;

type FooterProps = {
  profile: Profile;
};

export function Footer({ profile }: FooterProps) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-base-300 bg-base-200/30">
      <Container className="flex flex-col items-center gap-8 py-12 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div className="max-w-lg">
          <p className="font-medium text-base-content">{profile.name}</p>
          <p className="mt-1 text-sm text-base-content/50">
            © {year} {profile.name}. {t("rights")}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-base-content/45">
            {t("stackNote")}
          </p>
          <ul
            className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start"
            aria-label={t("stackLabel")}
          >
            {STACK_TAGS.map((tag) => (
              <li key={tag}>
                <span className="inline-block rounded-md border border-base-300/70 bg-base-100/50 px-2 py-0.5 font-mono text-[10px] text-base-content/55">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <SocialLinks profile={profile} className="gap-2 sm:pt-0.5" />
      </Container>
    </footer>
  );
}
