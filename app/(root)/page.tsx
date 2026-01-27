import Container from "@/components/Container";
import CTA from "@/components/home/cta";
import Faqs from "@/components/home/faqs";
import Hero from "@/components/home/hero";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="w-full">
      <Container className="px-4">
        <div className="absolute inset-0 -z-10">
          <div className="right-0 absolute w-80 h-125 bg-linear-to-tr from-indigo-500/40 via-purple-500/30 to-cyan-300/40 rounded-full blur-3xl" />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Hero />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <Faqs />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <CTA />
        </Suspense>
      </Container>
    </div>
  );
}
