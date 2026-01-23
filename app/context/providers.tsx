"use client";

import { ClerkProvider } from "@clerk/nextjs";
import React, { Suspense } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="text-sm">Loading...</p>}>
      <ClerkProvider>{children}</ClerkProvider>
    </Suspense>
  );
}
