import { GradientBackground } from "@/components/gradient-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <div className="relative min-h-dvh">
      <GradientBackground />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row">
        {/* Left: Brand / Info */}
        <div className="flex flex-1 flex-col justify-center space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Get in touch with PashuCare
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            PashuCare is an AI-powered assistant designed to help pet parents
            understand symptoms, explore care options, and make informed
            decisions about animal health.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Whether you have feedback, questions, or partnership ideas, we’d
            love to hear from you.
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Pet health guidance & education</p>
            <p>• Symptom understanding & next steps</p>
            <p>• Built with care for every life</p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="flex flex-1 justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Contact us</CardTitle>
            </CardHeader>

            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
