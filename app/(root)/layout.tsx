import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      {children}
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}
