"use client";

import { Github, Linkedin, Mail, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import type { Profile } from "@/lib/types/portfolio";

type FooterProps = {
  profile: Profile;
};

export function Footer({ profile }: FooterProps) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const socials = [
    { href: profile.githubUrl, icon: Github, label: "GitHub" },
    { href: profile.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: profile.youtubeUrl, icon: Youtube, label: "YouTube" },
    {
      href: profile.email ? `mailto:${profile.email}` : null,
      icon: Mail,
      label: "Email",
    },
  ].filter((s) => Boolean(s.href));

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

        {socials.length > 0 && (
          <div className="flex items-center gap-2">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        )}
      </Container>
    </footer>
  );
}
