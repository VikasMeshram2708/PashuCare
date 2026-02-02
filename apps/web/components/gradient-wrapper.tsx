"use client";

import { cn } from "@/lib/utils";

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Center golden glow */}
      <div
        className="
          absolute left-1/2 top-1/2
          h-105 w-105
          -translate-x-1/2 -translate-y-1/2
          rounded-full
          bg-linear-to-tr
          from-primary/45
          via-amber-400/35
          to-yellow-500/30
          blur-3xl
          opacity-80
        "
      />

      {/* Top-right warm gold accent */}
      <div
        className="
          absolute right-[-10%] top-[-10%]
          h-80 w-[320px]
          rounded-full
          bg-linear-to-br
          from-amber-500/35
          to-orange-400/25
          blur-3xl
          opacity-70
        "
      />

      {/* Bottom-left deep gold accent */}
      <div
        className="
          absolute left-[-10%] bottom-[-10%]
          h-75 w-75
          rounded-full
          bg-linear-to-tr
          from-yellow-600/30
          via-amber-600/25
          to-primary/20
          blur-3xl
          opacity-65
        "
      />
    </div>
  );
}
