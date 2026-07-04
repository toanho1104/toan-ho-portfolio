type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-10 md:mb-14 ${align === "center" ? "text-center" : ""}`}
    >
      {subtitle && (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-base-content/50">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-base-content sm:text-4xl">
        {title}
      </h2>
      <div
        className={`mt-4 h-px w-12 bg-base-content/20 ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
