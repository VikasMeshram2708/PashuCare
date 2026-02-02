"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faqs() {
  const faqs = [
    {
      id: "vet",
      question: "Is PashuCare a real veterinarian?",
      answer:
        "No. PashuCare is an AI-powered veterinary assistant designed to provide guidance and education. It does not replace a licensed veterinarian or physical examination.",
    },
    {
      id: "trust",
      question: "Can I trust the advice given by PashuCare?",
      answer:
        "PashuCare provides evidence-based guidance and common veterinary best practices. However, animal health varies, so the advice should be used to inform decisions, not replace professional care.",
    },
    {
      id: "pets-livestock",
      question: "Does PashuCare work for pets and livestock?",
      answer:
        "Yes. PashuCare supports pets like dogs and cats, as well as livestock such as cows, goats, and poultry. Providing detailed information helps improve the quality of guidance.",
    },
    {
      id: "emergency",
      question: "What should I do in an emergency?",
      answer:
        "If your animal shows severe symptoms such as difficulty breathing, seizures, heavy bleeding, or sudden collapse, contact a local veterinarian or animal hospital immediately.",
    },
    {
      id: "free",
      question: "Is PashuCare free to use?",
      answer:
        "PashuCare offers a free playground experience with limited usage. Additional features and higher limits may be offered as paid plans in the future.",
    },
    {
      id: "account",
      question: "Do I need an account to use PashuCare?",
      answer:
        "You can try PashuCare without creating an account. An account may be required for saving conversations or accessing advanced features.",
    },
    {
      id: "privacy",
      question: "Is my data safe?",
      answer:
        "We take privacy seriously. Conversations may be processed to improve the service, but we do not sell personal data. Avoid sharing sensitive personal information.",
    },
  ];

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Honest answers about how PashuCare works and when to rely on it.
        </p>
      </div>

      {/* FAQs */}
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
