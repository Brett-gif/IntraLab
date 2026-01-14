import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "wet" | "dry" | "status";
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tone === "neutral" && "border-mist-200 bg-mist-50 text-ink-700",
        tone === "wet" && "border-creek-500/40 bg-creek-500/10 text-creek-600",
        tone === "dry" && "border-ember-600/40 bg-ember-600/10 text-ember-700",
        tone === "status" && "border-ink-500/30 bg-ink-500/10 text-ink-700",
        className
      )}
      {...props}
    />
  );
}
