"use client";

import { ArrowDown, Download, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import type { Locale, Profile } from "@/lib/types/portfolio";
import { getAvatarUrl, getResumeUrl } from "@/lib/api/client";
import { getInitials, pickI18n } from "@/lib/utils/i18n";

type HeroProps = {
  profile: Profile;
  locale: Locale;
};

export function Hero({ profile, locale }: HeroProps) {
  const t = useTranslations("hero");
  const title = pickI18n(profile.title, locale);
  const avatarUrl = getAvatarUrl(profile);
  const resumeUrl = getResumeUrl(profile);

  return (
    <section
      id="top"
      className="relative flex min-h-[90vh] items-center pt-16"
    >
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <motion.p
            className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-base-content/50"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("greeting")}
          </motion.p>

          <motion.h1
            className="text-4xl font-semibold tracking-tight text-base-content sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            {profile.name}
          </motion.h1>

          <motion.p
            className="mt-4 text-xl text-base-content/70 sm:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
          >
            {title}
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            <span
              className={`badge badge-sm ${profile.isAvailable ? "badge-success badge-outline" : "badge-ghost"}`}
            >
              {profile.isAvailable ? t("available") : t("unavailable")}
            </span>
            {profile.location && (
              <span className="text-sm text-base-content/50">
                {profile.location}
              </span>
            )}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32 }}
          >
            <a href="#projects" className="btn btn-neutral btn-sm gap-2">
              {t("ctaProjects")}
              <ArrowDown className="size-4" />
            </a>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="btn btn-outline btn-sm gap-2"
              >
                <Mail className="size-4" />
                {t("ctaContact")}
              </a>
            )}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm gap-2"
              >
                <Download className="size-4" />
                {t("ctaResume")}
              </a>
            )}
          </motion.div>
        </div>

        <motion.div
          className="mx-auto lg:mx-0"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative size-40 overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-sm sm:size-48 lg:size-56">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 224px"
                priority
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-base-200 text-4xl font-semibold text-base-content/30">
                {getInitials(profile.name)}
              </div>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
