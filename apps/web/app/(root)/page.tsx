import CTA from "@/components/(home)/cta";
import Faqs from "@/components/(home)/faqs";
import Hero from "@/components/(home)/hero";
import Container from "@/components/Container";
import { GradientBackground } from "@/components/gradient-wrapper";

export default function Home() {
  return (
    <div className="">
      {/*  gradient bd*/}
      <GradientBackground />
      <Container>
        <Hero />
        <Faqs />
        <CTA />
      </Container>
    </div>
  );
}
