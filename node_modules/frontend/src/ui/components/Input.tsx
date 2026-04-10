import type { InputHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none",
        "focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300",
        "placeholder:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

