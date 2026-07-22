import * as React from "react";
import { cn } from "../cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-border)]",
        "before:absolute before:inset-0",
        "before:animate-shimmer before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}
