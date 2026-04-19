import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  loading?: boolean;
}

export function Button({ variant = "primary", loading, children, className, ...props }: ButtonProps) {
  const base = "tap-target w-full font-semibold rounded-xl px-6 py-3 transition-all duration-200 disabled:opacity-50 cursor-pointer";
  const variants = {
    primary: "bg-primary-400 text-white hover:bg-primary-500 active:scale-[0.98]",
    ghost:   "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Just a sec...
        </span>
      ) : children}
    </button>
  );
}
