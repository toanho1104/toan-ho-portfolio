type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded-lg bg-base-content/10 ${className}`}
      aria-hidden
    />
  );
}
