"use client";

import { ExternalLink } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const OPEN_SOURCE_ITEMS = [
  {
    id: "rn-inline-to-stylesheet",
    titleKey: "rnInline.title",
    descriptionKey: "rnInline.description",
    links: [
      {
        labelKey: "links.marketplace",
        href: "https://marketplace.visualstudio.com/items?itemName=toan-ho-dev.rn-inline-to-stylesheet",
      },
    ],
  },
  {
    id: "rn-scale-cache",
    titleKey: "rnScaleCache.title",
    descriptionKey: "rnScaleCache.description",
    links: [
      {
        labelKey: "links.npm",
        href: "https://www.npmjs.com/package/rn-scale-cache",
      },
      {
        labelKey: "links.github",
        href: "https://github.com/toanho1104/rn-scale-cache",
      },
    ],
  },
] as const;

type IntroductionOpenSourceProps = {
  className?: string;
};

export function IntroductionOpenSource({
  className = "mt-8 border-t border-base-content/10 pt-6",
}: IntroductionOpenSourceProps) {
  const t = useTranslations("introduction.openSource");

  return (
    <motion.div variants={fadeUp} className={className}>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-base-content/50">
        {t("title")}
      </p>
      <div className="space-y-3">
        {OPEN_SOURCE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-base-300/60 bg-base-200/20 p-4"
          >
            <p className="font-medium text-base-content">{t(item.titleKey)}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-base-content/65">
              {t(item.descriptionKey)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-xs gap-1.5 text-base-content/70 hover:text-base-content"
                >
                  {t(link.labelKey)}
                  <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
