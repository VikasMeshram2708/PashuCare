import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components";

interface ContactEmailTemplateProps {
  name: string;
}

export function ContactTemplate({ name }: ContactEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-background font-sans">
          <Container className="mx-auto max-w-140 px-6 py-10">
            <Section className="rounded-xl border border-border bg-background p-8">
              {/* Heading */}
              <Text className="mb-4 text-xl font-semibold text-foreground">
                Thanks for reaching out{name ? `, ${name}` : ""}
              </Text>

              {/* Intro */}
              <Text className="mb-4 text-sm leading-relaxed text-muted-foreground">
                We’ve received your message and appreciate you taking the time
                to contact PashuCare.
              </Text>

              <Text className="mb-6 text-sm leading-relaxed text-muted-foreground">
                A member of our team will review your request and get back to
                you as soon as possible. We typically respond within one
                business day.
              </Text>

              <Hr className="my-6 border-border" />

              {/* Safety / reassurance */}
              <Text className="mb-2 text-sm font-medium text-foreground">
                A quick note while you wait:
              </Text>

              <ul className="mb-6 list-disc pl-5 text-sm text-muted-foreground">
                <li>
                  Please avoid sharing sensitive medical or personal information
                  over email.
                </li>
                <li>
                  For urgent animal health concerns, consult a licensed
                  veterinarian immediately.
                </li>
              </ul>

              {/* Footer */}
              <Text className="mb-1 text-xs text-muted-foreground">
                — The PashuCare Team
              </Text>

              <Text className="text-xs text-muted-foreground">
                This email was sent because you submitted a request through the
                PashuCare contact form.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
