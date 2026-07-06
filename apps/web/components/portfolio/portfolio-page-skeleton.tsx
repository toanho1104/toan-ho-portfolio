"use client";

import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

function NavbarSkeleton() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <Container className="flex h-16 items-center justify-between">
        <Skeleton className="h-5 w-16 rounded-md" />
        <nav className="hidden items-center gap-2 md:flex" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-lg" />
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <Skeleton className="size-9 rounded-lg md:hidden" />
        </div>
      </Container>
    </header>
  );
}

function SectionHeadingSkeleton() {
  return (
    <div className="mb-10 md:mb-14">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="h-9 w-48 sm:h-10 sm:w-56" />
      <Skeleton className="mt-4 h-px w-12 rounded-none" />
    </div>
  );
}

function IntroductionSkeleton() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-14 xl:gap-x-16">
          {/* Left: Identity */}
          <div className="order-2 space-y-5 lg:order-none lg:col-span-6 xl:col-span-7">
            <Skeleton className="h-3 w-28" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-4/5 max-w-sm sm:h-12" />
              <Skeleton className="h-10 w-3/5 max-w-xs sm:h-12" />
            </div>
            <Skeleton className="h-px w-12 rounded-none" />
            <Skeleton className="h-6 w-2/3 max-w-md sm:h-7" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="space-y-3 border-t border-base-content/10 pt-6">
              <Skeleton className="h-3 w-20" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="size-9 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-base-300/60 bg-base-200/20 p-4"
                >
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="mt-2 h-3 w-full" />
                  <Skeleton className="mt-1 h-3 w-4/5" />
                  <div className="mt-3 flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-md" />
                    <Skeleton className="h-6 w-14 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="contents lg:col-span-6 lg:col-start-7 lg:block lg:overflow-hidden lg:rounded-2xl lg:border lg:border-base-300/70 lg:bg-base-200/20 lg:shadow-sm xl:col-span-5 xl:col-start-8">
            <div className="order-1 lg:order-none">
              <div className="overflow-hidden rounded-2xl border border-base-300/70 bg-base-200/20 p-4 sm:p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-5 lg:pb-0">
                <Skeleton className="mx-auto aspect-[5/4] max-w-[280px] rounded-xl sm:max-w-xs lg:max-w-none" />
              </div>
            </div>
            <div className="order-3 space-y-5 lg:p-5 lg:pt-5 xl:p-6">
              <div className="space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="rounded-xl border border-base-300/60 bg-base-100/40 p-4 sm:p-5 lg:bg-base-100/30">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-48" />
                <Skeleton className="mt-1 h-3 w-36" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProjectsSectionSkeleton() {
  return (
    <section className="bg-base-200/25 py-20 md:py-28">
      <Container>
        <SectionHeadingSkeleton />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-6"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
              </div>
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-4 h-3 w-2/3" />
              <div className="mt-auto flex flex-wrap gap-1.5">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-14 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ExperienceSectionSkeleton() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeadingSkeleton />
        <div className="relative space-y-0">
          <div
            className="absolute bottom-0 left-[7px] top-2 w-px bg-base-300 md:left-[11px]"
            aria-hidden
          />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative grid gap-4 pb-10 pl-8 md:grid-cols-[180px_1fr] md:gap-8 md:pl-10 md:pb-12"
            >
              <Skeleton className="absolute left-0 top-2 size-[15px] rounded-full md:left-1 md:size-[19px]" />
              <div>
                <Skeleton className="h-3 w-28" />
                <Skeleton className="mt-2 h-5 w-36" />
                <Skeleton className="mt-1 h-4 w-44" />
              </div>
              <div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-4/5" />
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-16 rounded-md" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function SkillsSectionSkeleton() {
  return (
    <section className="bg-base-200/25 py-20 md:py-28">
      <Container>
        <SectionHeadingSkeleton />
        <div className="grid gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-base-300 bg-base-100 p-5"
            >
              <Skeleton className="mb-4 h-4 w-32" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, j) => (
                  <Skeleton key={j} className="h-7 w-20 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FooterSkeleton() {
  return (
    <footer className="border-t border-base-300 bg-base-200/30">
      <Container className="flex flex-col items-center gap-6 py-12 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="size-9 rounded-lg" />
          ))}
        </div>
      </Container>
    </footer>
  );
}

export function PortfolioPageSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <main aria-busy="true" aria-label="Loading portfolio">
        <IntroductionSkeleton />
        <ProjectsSectionSkeleton />
        <ExperienceSectionSkeleton />
        <SkillsSectionSkeleton />
      </main>
      <FooterSkeleton />
    </>
  );
}
