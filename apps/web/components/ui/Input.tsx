import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 text-base",
          "border-neutral-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          "outline-none transition-all duration-200 placeholder:text-neutral-400",
          error && "border-accent-red focus:border-accent-red focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-accent-red">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
