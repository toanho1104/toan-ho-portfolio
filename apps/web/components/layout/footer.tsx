"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/ui/social-links";
import type { Profile } from "@/lib/types/portfolio";

type FooterProps = {
  profile: Profile;
};

export function Footer({ profile }: FooterProps) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-base-300 bg-base-200/30">
      <Container className="flex flex-col items-center gap-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-medium text-base-content">{profile.name}</p>
          <p className="mt-1 text-sm text-base-content/50">
            © {year} {profile.name}. {t("rights")}
          </p>
          <p className="mt-1 text-xs text-base-content/40">{t("builtWith")}</p>
        </div>

        <SocialLinks profile={profile} className="gap-2" />
      </Container>
    </footer>
  );
}
