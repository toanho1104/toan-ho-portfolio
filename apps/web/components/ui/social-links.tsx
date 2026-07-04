"use client";

import { Github, Linkedin, Mail, Youtube, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { Profile } from "@/lib/types/portfolio";

export type SocialLink = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export function getProfileSocials(profile: Profile): SocialLink[] {
  return [
    { href: profile.githubUrl, icon: Github, label: "GitHub" },
    { href: profile.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: profile.youtubeUrl, icon: Youtube, label: "YouTube" },
    {
      href: profile.email ? `mailto:${profile.email}` : null,
      icon: Mail,
      label: "Email",
    },
  ].filter((s): s is SocialLink => Boolean(s.href));
}

type SocialLinksProps = {
  profile: Profile;
  className?: string;
  linkClassName?: string;
  animated?: boolean;
  reduceMotion?: boolean | null;
};

export function SocialLinks({
  profile,
  className = "",
  linkClassName = "btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content",
  animated = false,
  reduceMotion = false,
}: SocialLinksProps) {
  const socials = getProfileSocials(profile);

  if (socials.length === 0) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {socials.map(({ href, icon: Icon, label }) => {
        const isMailto = href.startsWith("mailto:");
        const link = (
          <a
            href={href}
            target={isMailto ? undefined : "_blank"}
            rel={isMailto ? undefined : "noopener noreferrer"}
            aria-label={label}
            className={linkClassName}
          >
            <Icon className="size-4" />
          </a>
        );

        if (animated && !reduceMotion) {
          return (
            <motion.div
              key={label}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {link}
            </motion.div>
          );
        }

        return <span key={label}>{link}</span>;
      })}
    </div>
  );
}
