"use client";

import { ArrowDown, Mail } from "lucide-react";
import {
  motion,
  type Variants,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { ResumeViewButton } from "@/components/resume/resume-view-button";
import { IntroductionOpenSource } from "@/components/sections/introduction-open-source";
import { getProfileSocials, SocialLinks } from "@/components/ui/social-links";
import type { Locale, Profile } from "@/lib/types/portfolio";
import { getAvatarUrl, getResumeUrl } from "@/lib/api/client";
import { getInitials, pickI18n } from "@/lib/utils/i18n";

type IntroductionProps = {
  profile: Profile;
  locale: Locale;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18, delay: 0.15 },
  },
};

export function Introduction({ profile, locale }: IntroductionProps) {
  const reduceMotion = useReducedMotion();
  const tHero = useTranslations("hero");
  const tAbout = useTranslations("about");
  const title = pickI18n(profile.title, locale);
  const bio = pickI18n(profile.bio, locale);
  const school = pickI18n(profile.educationSchool, locale);
  const degree = pickI18n(profile.educationDegree, locale);
  const avatarUrl = getAvatarUrl(profile);
  const resumeUrl = getResumeUrl(profile);

  const bioParagraphs = bio
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const nameParts = profile.name.split(" ");
  const hasSocials = getProfileSocials(profile).length > 0;

  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20"
    >
      <span id="top" className="sr-only" aria-hidden />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-base-content/[0.03] blur-3xl md:h-96 md:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-base-content/[0.02] blur-3xl"
      />

      <Container className="relative">
        {/*
          Mobile:  Image (1) → Intro (2) → About + Education (3)
          Desktop: Left identity | Right unified panel
        */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-14 xl:gap-x-16">
          {/* ── Left: Identity ── */}
          <motion.div
            className="order-2 lg:order-none lg:col-span-6 xl:col-span-7"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-base-content/50"
            >
              {tHero("greeting")}
            </motion.p>

            <motion.h1
              id="intro-heading"
              variants={fadeUp}
              className="text-4xl font-semibold tracking-tight text-base-content sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] xl:text-6xl"
            >
              {nameParts.map((word, i) => (
                <span key={word} className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      ease: EASE,
                      delay: 0.12 + i * 0.08,
                    }}
                  >
                    {word}
                    {i < nameParts.length - 1 ? "\u00a0" : ""}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.div
              className="mt-5 h-px w-12 origin-left bg-base-content/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            />

            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg text-base-content/70 sm:text-xl lg:text-2xl"
            >
              {title}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <span
                className={`badge badge-sm ${profile.isAvailable ? "badge-success badge-outline" : "badge-ghost"}`}
              >
                {profile.isAvailable ? tHero("available") : tHero("unavailable")}
              </span>
              {profile.location && (
                <span className="text-sm text-base-content/50">
                  {profile.location}
                </span>
              )}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-3"
            >
              <motion.a
                href="#projects"
                className="btn btn-neutral btn-sm gap-2"
                whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {tHero("ctaProjects")}
                <ArrowDown className="size-4" />
              </motion.a>
              {profile.email && (
                <motion.a
                  href={`mailto:${profile.email}`}
                  className="btn btn-outline btn-sm gap-2"
                  whileHover={reduceMotion ? undefined : { scale: 1.03, y: -1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Mail className="size-4" />
                  {tHero("ctaContact")}
                </motion.a>
              )}
              {resumeUrl && (
                <ResumeViewButton
                  downloadUrl={resumeUrl}
                  fileName={profile.resume?.fileName}
                  label={tHero("ctaResume")}
                  animated
                  reduceMotion={reduceMotion}
                />
              )}
            </motion.div>

            {hasSocials && (
              <motion.div
                variants={fadeUp}
                className="mt-8 border-t border-base-content/10 pt-6"
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-base-content/50">
                  {tHero("socials")}
                </p>
                <SocialLinks
                  profile={profile}
                  animated
                  reduceMotion={reduceMotion}
                />
              </motion.div>
            )}

            <IntroductionOpenSource
              className={
                hasSocials
                  ? "mt-6"
                  : "mt-8 border-t border-base-content/10 pt-6"
              }
            />
          </motion.div>

          {/* ── Right panel wrapper (contents on mobile for reordering) ── */}
          <div className="contents lg:col-span-6 lg:col-start-7 lg:block lg:overflow-hidden lg:rounded-2xl lg:border lg:border-base-300/70 lg:bg-base-200/20 lg:shadow-sm lg:backdrop-blur-sm xl:col-span-5 xl:col-start-8">
            {/* Avatar */}
            <motion.div
              className="order-1 lg:order-none"
              variants={fadeRight}
              initial="hidden"
              animate="visible"
            >
              <div className="overflow-hidden rounded-2xl border border-base-300/70 bg-base-200/20 p-4 sm:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-5 lg:pb-0">
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="relative mx-auto aspect-[5/4] max-w-[280px] overflow-hidden rounded-xl sm:max-w-xs lg:max-w-none"
                >
                  <div
                    aria-hidden
                    className={`absolute -inset-px rounded-xl bg-gradient-to-br from-base-content/15 via-transparent to-base-content/10 ${reduceMotion ? "" : "animate-[spin_8s_linear_infinite]"}`}
                    style={{ opacity: 0.6 }}
                  />
                  <motion.div
                    className="relative size-full overflow-hidden rounded-xl border border-base-300/80 bg-base-200"
                    animate={
                      reduceMotion ? undefined : { y: [0, -5, 0] }
                    }
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 320px, 400px"
                        priority
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-4xl font-semibold text-base-content/30">
                        {getInitials(profile.name)}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* About + Education */}
            <motion.div
              className="order-3 space-y-5 lg:order-none lg:p-5 lg:pt-5 xl:p-6"
              variants={stagger}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.35 }}
            >
              <motion.div variants={fadeUp} className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-base-content/50">
                  {tAbout("title")}
                </p>
                {bioParagraphs.map((paragraph) => (
                  <motion.p
                    key={paragraph.slice(0, 40)}
                    variants={fadeUp}
                    className="text-base leading-relaxed text-base-content/75"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>

              {(school || degree) && (
                <motion.div
                  variants={fadeUp}
                  className="rounded-xl border border-base-300/60 bg-base-100/40 p-4 sm:p-5 lg:bg-base-100/30"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">
                    {tAbout("education")}
                  </p>
                  {degree && (
                    <p className="mt-2 font-medium text-base-content">
                      {degree}
                    </p>
                  )}
                  {school && (
                    <p className="mt-1 text-sm text-base-content/65">
                      {school}
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
