"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { env } from "../env";

export default function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
