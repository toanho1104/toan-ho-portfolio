import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import type { Locale } from "@/lib/types/portfolio";
import { setRequestLocale } from "next-intl/server";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortfolioPage locale={locale as Locale} />;
}
