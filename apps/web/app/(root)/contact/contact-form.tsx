"use client";

import { sendContactMail } from "@/actions/mail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";

type ContactActionState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export default function ContactForm() {
  const initialState: ContactActionState = {
    success: false,
    message: "",
  };

  const [state, action, isPending] = useActionState<
    ContactActionState,
    FormData
  >(sendContactMail, initialState);

  return (
    <section>
      {state.success && (
        <p className="text-green-500 text-lg">{state.message}</p>
      )}

      <form action={action} className="space-y-4 md:space-y-8">
        <div>
          <Input name="name" placeholder="Your name" disabled={isPending} />
          {state.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            disabled={isPending}
          />
          {state.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <Textarea
            name="message"
            placeholder="Your message"
            rows={4}
            disabled={isPending}
          />
          {state.errors?.message && (
            <p className="text-sm text-red-500">{state.errors.message[0]}</p>
          )}
        </div>

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Sending..." : "Send message"}
        </Button>
      </form>
    </section>
  );
}
