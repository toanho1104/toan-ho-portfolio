import { forwardRef } from "react";
import { cn } from "../lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "input input-bordered w-full",
            error && "input-error",
            className,
          )}
          {...props}
        />
        {error && <span className="text-error text-xs">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
