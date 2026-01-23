"use client";

import { useOptimistic, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon, MailIcon, PhoneIcon } from "lucide-react";
import contactSchema from "./contact-schema";
import { toast } from "sonner";
import { sendContactMail } from "./sendmail";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [optimisticForm, updateOptimisticForm] =
    useOptimistic<contactSchema | null>(null);

  const form = useForm<contactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    },
  });

  function onSubmit(values: contactSchema) {
    startTransition(async () => {
      updateOptimisticForm(values);

      try {
        const res = await sendContactMail({
          name: values.fullName,
          email: values.email,
        });

        if (!res.success) {
          Object.values(res.errors ?? {})
            .flat()
            .forEach((message: string) => {
              toast.error(message);
            });
          return;
        }

        toast.success("Message sent");
      } catch (err) {
        console.error(err);
        toast.error("Network error. Please try again.");
      }
    });
  }

  const disabled = isPending;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.25),transparent_65%)] blur-3xl" />
        <div className="absolute right-0 top-0 h-105 w-105 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--secondary)/0.2),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Left info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight">
              Contact Us
            </h1>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Have a question or need help? Our team is happy to listen and
              guide you toward the right solution.
            </p>

            <div className="space-y-3 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <MailIcon className="h-4 w-4" />
                info@pashucare.ai
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4" />
                Support: +91 12345 67890
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="border-border/60 bg-background/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                We’d love to hear from you
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Let’s get in touch
              </p>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John Doe"
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your company"
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="you@example.com"
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="+91 00000 00000"
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="City, State, Country"
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your message</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Type your message here"
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    disabled={disabled}
                    className="gap-2"
                  >
                    {isPending && (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    )}
                    Send message
                  </Button>

                  {optimisticForm && isPending && (
                    <p className="text-sm text-muted-foreground">
                      Sending your message…
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
